import "./RecentSales.css";

import { FiShoppingBag } from "react-icons/fi";

import { recentSales } from "../../mocks/dashboardData";

function RecentSales() {
  return (
    <section className="recentSales">
      <div className="recentSales__header">
        <div className="recentSales__title">
          <FiShoppingBag />

          <h2>Últimas Vendas</h2>
        </div>

        <span>{recentSales.length} vendas</span>
      </div>

      <div className="recentSales__list">
        {recentSales.map((sale) => (
          <div
            key={sale.id}
            className="recentSales__item"
          >
            <div className="recentSales__info">
              <div className="recentSales__avatar">
                {sale.cliente.charAt(0)}
              </div>

              <div>
                <h3>{sale.cliente}</h3>

                <p>{sale.produto}</p>
              </div>
            </div>

            <div className="recentSales__value">
              <strong>
                {sale.valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>

              <span>{sale.data}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecentSales;