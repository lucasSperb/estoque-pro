import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout/Layout";

import Dashboard from "../features/dashboard/pages/Dashboard";
import Produtos from "../features/produtos/pages/Produtos";
import Vendas from "../features/vendas/pages/Vendas";
import Clientes from "../features/clientes/pages/Clientes";
import Compras from "../features/compras/pages/Compras";
import Relatorios from "../features/relatorios/pages/Relatorios";
import Configuracoes from "../features/configuracoes/pages/Configuracoes";

function Router() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />

        <Route path="produtos" element={<Produtos />} />
        <Route path="vendas" element={<Vendas />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="compras" element={<Compras />} />
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="configuracoes" element={<Configuracoes />} />
      </Route>
    </Routes>
  );
}

export default Router;