import "../../../styles/Dashboard.css";

import SummaryCard from "../components/SummaryCard/SummaryCard";
import SalesChart from "../components/SalesChart/SalesChart";
import LowStock from "../components/LowStock/LowStock";
import RecentSales from "../components/RecentSales/RecentSales";
import QuickActions from "../components/QuickActions/QuickActions";

function Dashboard() {
  return (
    <div className="dashboard">
      {/* Cabeçalho */}
      <header className="dashboard__header">
        <div>
          <h1>Dashboard</h1>
          <p>Bem-vindo ao Estoque Pro 👋</p>
        </div>
      </header>

      {/* Cards */}
      <section className="dashboard__summary">
        <SummaryCard />
      </section>

      {/* Gráfico */}
      <section className="dashboard__chart">
        <SalesChart />
      </section>

      {/* Linha inferior */}
      <section className="dashboard__bottom">
        <LowStock />

        <RecentSales />
      </section>

      {/* Atalhos */}
      <section className="dashboard__quickActions">
        <QuickActions />
      </section>
    </div>
  );
}

export default Dashboard;