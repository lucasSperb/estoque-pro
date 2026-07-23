import { useNavigate } from "react-router-dom";

import {
  FiPlus,
  FiShoppingCart,
  FiUsers,
  FiFileText,
} from "react-icons/fi";

import "./QuickActions.css";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Novo Produto",
      subtitle: "Cadastrar produto",
      icon: <FiPlus />,
      path: "/produtos",
    },
    {
      title: "Nova Venda",
      subtitle: "Registrar venda",
      icon: <FiShoppingCart />,
      path: "/vendas",
    },
    {
      title: "Novo Cliente",
      subtitle: "Cadastrar cliente",
      icon: <FiUsers />,
      path: "/clientes",
    },
    {
      title: "Relatórios",
      subtitle: "Visualizar relatórios",
      icon: <FiFileText />,
      path: "/relatorios",
    },
  ];

  return (
    <section className="quickActions">
      <div className="quickActions__header">
        <h2>Ações Rápidas</h2>

        <p>Atalhos para as funções mais utilizadas.</p>
      </div>

      <div className="quickActions__grid">
        {actions.map((action) => (
          <button
            key={action.title}
            className="quickActions__card"
            onClick={() => navigate(action.path)}
          >
            <div className="quickActions__icon">
              {action.icon}
            </div>

            <h3>{action.title}</h3>

            <span>{action.subtitle}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default QuickActions;