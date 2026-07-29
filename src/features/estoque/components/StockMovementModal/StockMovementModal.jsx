import { useEffect, useState } from "react";
import {
  FiX,
  FiArrowDown,
  FiArrowUp,
  FiRefreshCw,
} from "react-icons/fi";

import Button from "../../../../components/ui/Button/Button";
import Select from "../../../../components/ui/Select/Select";
import useProductStore from "../../../../store/useProductStore";
import "./StockMovementModal.css";

function StockMovementModal({
  open,
  product,
  initialType = "entrada", // 👈 Nova prop recebendo o tipo inicial
  onClose,
  onSave,
}) {
  const products = useProductStore((state) => state.products || []);

  const [selectedProductId, setSelectedProductId] = useState("");
  const [type, setType] = useState(initialType);
  const [quantity, setQuantity] = useState("");
  const [observation, setObservation] = useState("");

  const productOptions = products.map((p) => ({
    value: p.id,
    label: `${p.nome} (Atual: ${p.estoque ?? 0})`,
  }));

  const currentProduct = product || products.find((p) => String(p.id) === String(selectedProductId));

  useEffect(() => {
    if (!open) return;

    if (product) {
      setSelectedProductId(product.id);
    } else if (products.length > 0) {
      setSelectedProductId(products[0].id);
    } else {
      setSelectedProductId("");
    }

    // Define o tipo com base na prop initialType ("entrada", "saida" ou "ajuste")
    setType(initialType);
    setQuantity("");
    setObservation("");
  }, [open, product, products, initialType]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();

    const value = Number(quantity);

    if (!value || value <= 0 || !currentProduct) return;

    onSave({
      productId: currentProduct.id,
      type,
      quantity: value,
      observation,
    });

    onClose();
  }

  const currentStock = currentProduct ? Number(currentProduct.estoque || 0) : 0;
  let previewStock = currentStock;

  if (quantity !== "") {
    const value = Number(quantity);

    if (type === "entrada") {
      previewStock = currentStock + value;
    }

    if (type === "saida") {
      previewStock = Math.max(0, currentStock - value);
    }

    if (type === "ajuste") {
      previewStock = value;
    }
  }

  return (
    <div className="stockMovementModal__overlay">
      <div className="stockMovementModal">
        <div className="stockMovementModal__header">
          <div>
            <h2>Movimentar Estoque</h2>
            {product ? (
              <p>{product.nome}</p>
            ) : (
              <p>Selecione um produto abaixo</p>
            )}
          </div>

          <button
            type="button"
            className="stockMovementModal__close"
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="stockMovementModal__body">
          {!product && (
            <div className="stockMovementModal__field">
              <label>Produto</label>
              <Select
                options={productOptions}
                value={selectedProductId}
                placeholder="Selecione um produto..."
                onChange={(val) => setSelectedProductId(val)}
              />
            </div>
          )}

          <div className="stockMovementModal__types">
            <button
              type="button"
              className={type === "entrada" ? "active success" : ""}
              onClick={() => setType("entrada")}
            >
              <FiArrowDown />
              Entrada
            </button>

            <button
              type="button"
              className={type === "saida" ? "active danger" : ""}
              onClick={() => setType("saida")}
            >
              <FiArrowUp />
              Saída
            </button>

            <button
              type="button"
              className={type === "ajuste" ? "active warning" : ""}
              onClick={() => setType("ajuste")}
            >
              <FiRefreshCw />
              Ajuste
            </button>
          </div>

          <div className="stockMovementModal__field">
            <label>Quantidade</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Digite a quantidade"
              required
            />
          </div>

          <div className="stockMovementModal__field">
            <label>Observação</label>
            <textarea
              rows="4"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Opcional..."
            />
          </div>

          <div className="stockMovementModal__resume">
            <div>
              <span>Estoque atual</span>
              <strong>{currentStock}</strong>
            </div>

            <div>
              <span>Após movimentação</span>
              <strong>{previewStock}</strong>
            </div>
          </div>

          <div className="stockMovementModal__footer">
            <Button
              variant="secondary"
              type="button"
              onClick={onClose}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={!currentProduct}>
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StockMovementModal;