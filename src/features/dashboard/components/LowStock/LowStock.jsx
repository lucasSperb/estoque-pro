import "./LowStock.css";

import { FiAlertTriangle } from "react-icons/fi";

import { lowStockProducts } from "../../mocks/dashboardData";

function LowStock() {
  return (
    <section className="lowStock">

      <div className="lowStock__header">

        <div className="lowStock__title">

          <FiAlertTriangle />

          <h2>Estoque Baixo</h2>

        </div>

        <span>{lowStockProducts.length} itens</span>

      </div>

      <div className="lowStock__list">

        {lowStockProducts.map((produto) => (

          <div
            key={produto.id}
            className="lowStock__item"
          >

            <div>

              <h3>{produto.nome}</h3>

              <p>{produto.categoria}</p>

            </div>

            <div className="lowStock__stock">

              <strong>{produto.estoque}</strong>

              <span>
                mín. {produto.minimo}
              </span>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default LowStock;