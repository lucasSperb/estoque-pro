import { useMemo } from "react";
import {
  FiPackage,
  FiAlertTriangle,
  FiXCircle,
  FiDollarSign,
} from "react-icons/fi";

import useProductStore from "../../../../store/useProductStore";
import { formatCurrency } from "../../utils/stockHelpers";

import "./StockSummary.css";

function StockSummary() {
  // Escuta os produtos reativamente do Zustand
  const products = useProductStore((state) => state.products || []);

  const summary = useMemo(() => {
    const totalProducts = products.length;

    const lowStock = products.filter(
      (p) =>
        Number(p.estoque || 0) > 0 &&
        Number(p.estoque || 0) <= Number(p.estoqueMinimo || 0)
    ).length;

    const outStock = products.filter(
      (p) => Number(p.estoque || 0) === 0
    ).length;

    const totalValue = products.reduce(
      (total, product) =>
        total + Number(product.preco || 0) * Number(product.estoque || 0),
      0
    );

    return {
      totalProducts,
      lowStock,
      outStock,
      totalValue,
    };
  }, [products]);

  const cards = [
    {
      title: "Produtos",
      value: summary.totalProducts,
      icon: <FiPackage />,
      color: "blue",
    },
    {
      title: "Estoque Baixo",
      value: summary.lowStock,
      icon: <FiAlertTriangle />,
      color: "yellow",
    },
    {
      title: "Sem Estoque",
      value: summary.outStock,
      icon: <FiXCircle />,
      color: "red",
    },
    {
      title: "Valor em Estoque",
      value: formatCurrency(summary.totalValue),
      icon: <FiDollarSign />,
      color: "green",
    },
  ];

  return (
    <section className="stockSummary">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`stockSummary__card stockSummary__card--${card.color}`}
        >
          <div className="stockSummary__icon">{card.icon}</div>

          <div className="stockSummary__content">
            <span>{card.title}</span>
            <strong>{card.value}</strong>
          </div>
        </div>
      ))}
    </section>
  );
}

export default StockSummary;