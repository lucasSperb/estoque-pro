import {
  FiHome,
  FiBox,
  FiShoppingCart,
  FiUsers,
  FiTruck,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi";

const menu = [
  { title: "Dashboard", path: "/", icon: FiHome },
  { title: "Produtos", path: "/produtos", icon: FiBox },
  { title: "Vendas", path: "/vendas", icon: FiShoppingCart },
  { title: "Clientes", path: "/clientes", icon: FiUsers },
  { title: "Compras", path: "/compras", icon: FiTruck },
  { title: "Relatórios", path: "/relatorios", icon: FiBarChart2 },
  { title: "Configurações", path: "/configuracoes", icon: FiSettings },
];

export default menu;