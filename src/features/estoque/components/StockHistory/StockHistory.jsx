import { useState, useMemo } from "react";
import {
  FiSearch,
  FiArrowDown,
  FiArrowUp,
  FiRefreshCw,
  FiCalendar,
} from "react-icons/fi";
import useStockStore from "../../../../store/useStockStore";
import Select from "../../../../components/ui/Select/Select";
import "./StockHistory.css";

function StockHistory() {
  const movements = useStockStore((state) => state.movements || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const typeOptions = [
    { value: "all", label: "Todos os tipos" },
    { value: "entrada", label: "Entradas" },
    { value: "saida", label: "Saídas" },
    { value: "ajuste", label: "Ajustes" },
  ];

  const filteredMovements = useMemo(() => {
    return movements.filter((mov) => {
      const matchesSearch =
        (mov.productName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (mov.observation || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesType =
        typeFilter === "all" ? true : mov.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [movements, searchTerm, typeFilter]);

  function formatDate(isoString) {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function renderTypeBadge(type) {
    switch (type) {
      case "entrada":
        return (
          <span className="stockBadge stockBadge--success">
            <FiArrowDown /> Entrada
          </span>
        );
      case "saida":
        return (
          <span className="stockBadge stockBadge--danger">
            <FiArrowUp /> Saída
          </span>
        );
      case "ajuste":
        return (
          <span className="stockBadge stockBadge--warning">
            <FiRefreshCw /> Ajuste
          </span>
        );
      default:
        return <span className="stockBadge">{type}</span>;
    }
  }

  return (
    <div className="stockHistory">
      <div className="stockHistory__filters">
        <div className="stockHistory__search">
          <FiSearch className="stockHistory__searchIcon" />
          <input
            type="text"
            placeholder="Buscar por produto ou observação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="stockHistory__select">
          <Select
            options={typeOptions}
            value={typeFilter}
            onChange={(val) => setTypeFilter(val)}
          />
        </div>
      </div>

      {filteredMovements.length === 0 ? (
        <div className="stockHistory__empty">
          <h3>Nenhuma movimentação encontrada</h3>
          <p>
            {searchTerm || typeFilter !== "all"
              ? "Tente ajustar os filtros de busca."
              : "Ainda não existem registros de movimentação no estoque."}
          </p>
        </div>
      ) : (
        <div className="stockHistoryTable">
          <div className="stockHistoryTable__head">
            <div>Data e Hora</div>
            <div>Produto</div>
            <div>Tipo</div>
            <div>Qtd.</div>
            <div>Anterior</div>
            <div>Novo Estoque</div>
            <div>Observação</div>
          </div>

          {filteredMovements.map((mov, idx) => (
            <div key={mov.id || idx} className="stockHistoryTable__row">
              <div data-label="Data e Hora" className="stockHistoryTable__date">
                <FiCalendar />
                <span>{formatDate(mov.createdAt)}</span>
              </div>

              <div data-label="Produto" className="stockHistoryTable__product">
                <strong>{mov.productName || "Produto Removido"}</strong>
              </div>

              <div data-label="Tipo">{renderTypeBadge(mov.type)}</div>

              <div data-label="Qtd." className="stockHistoryTable__qty">
                {mov.type === "entrada" && `+${mov.quantity}`}
                {mov.type === "saida" && `-${mov.quantity}`}
                {mov.type === "ajuste" && `${mov.quantity}`}
              </div>

              <div data-label="Anterior">{mov.previousStock ?? "-"}</div>

              <div data-label="Novo Estoque">
                <strong>{mov.newStock ?? "-"}</strong>
              </div>

              <div data-label="Observação" className="stockHistoryTable__obs">
                {mov.observation || "-"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StockHistory;