import "./StockTable.css";

import {
  FiArrowDown,
  FiArrowUp,
  FiEye,
} from "react-icons/fi";

function StockTable({
  products = [],
  onView,
  onMovement,
}) {
  if (products.length === 0) {
    return (
      <div className="stockTable__empty">
        <h3>Nenhum produto encontrado</h3>

        <p>
          Não existem produtos cadastrados.
        </p>
      </div>
    );
  }

  return (
    <div className="stockTable">

      <div className="stockTable__head">

        <div>Código</div>

        <div>Produto</div>

        <div>Categoria</div>

        <div>Estoque</div>

        <div>Mínimo</div>

        <div>Status</div>

        <div>Ações</div>

      </div>

      {products.map((product) => {

        const low =
          Number(product.estoque) <=
          Number(product.estoqueMinimo);

        return (

          <div
            key={product.id}
            className="stockTable__row"
          >

            <div data-label="Código">
              {product.codigo}
            </div>

            <div
              data-label="Produto"
              className="stockTable__product"
            >
              <strong>
                {product.nome}
              </strong>

              <span>
                {product.marca}
              </span>
            </div>

            <div data-label="Categoria">
              {product.categoria}
            </div>

            <div data-label="Estoque">
              {product.estoque}
            </div>

            <div data-label="Mínimo">
              {product.estoqueMinimo}
            </div>

            <div data-label="Status">

              <span
                className={
                  low
                    ? "status danger"
                    : "status success"
                }
              >
                {low
                  ? "Baixo"
                  : "OK"}
              </span>

            </div>

            <div
              data-label="Ações"
              className="stockTable__actions"
            >

              <button
                onClick={() =>
                  onView(product)
                }
              >
                <FiEye />
              </button>

              <button
                onClick={() =>
                  onMovement(product, "entrada")
                }
              >
                <FiArrowUp />
              </button>

              <button
                onClick={() =>
                  onMovement(product, "saida")
                }
              >
                <FiArrowDown />
              </button>

            </div>

          </div>

        );
      })}
    </div>
  );
}

export default StockTable;