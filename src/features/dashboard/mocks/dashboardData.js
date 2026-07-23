export const lowStockProducts = [
  {
    id: 1,
    nome: "Perfume Lily",
    categoria: "Perfumes",
    estoque: 2,
    minimo: 5,
  },
  {
    id: 2,
    nome: "Shampoo Match",
    categoria: "Cabelos",
    estoque: 3,
    minimo: 8,
  },
  {
    id: 3,
    nome: "Creme Nativa SPA",
    categoria: "Hidratantes",
    estoque: 1,
    minimo: 6,
  },
  {
    id: 4,
    nome: "Sabonete Cuide-se Bem",
    categoria: "Banho",
    estoque: 4,
    minimo: 10,
  },
];

export const recentSales = [
  {
    id: 1,
    cliente: "Maria Oliveira",
    produto: "Perfume Lily",
    valor: 189.9,
    data: "Hoje • 14:32",
  },
  {
    id: 2,
    cliente: "Ana Souza",
    produto: "Shampoo Match",
    valor: 49.9,
    data: "Hoje • 13:18",
  },
  {
    id: 3,
    cliente: "Carlos Lima",
    produto: "Creme Nativa SPA",
    valor: 79.9,
    data: "Hoje • 11:45",
  },
  {
    id: 4,
    cliente: "Fernanda Rocha",
    produto: "Kit Cuide-se Bem",
    valor: 129.9,
    data: "Ontem • 18:05",
  },
];

export const salesChartData = [
  { mes: "Jan", vendas: 3200 },
  { mes: "Fev", vendas: 4100 },
  { mes: "Mar", vendas: 3800 },
  { mes: "Abr", vendas: 5400 },
  { mes: "Mai", vendas: 6200 },
  { mes: "Jun", vendas: 5900 },
  { mes: "Jul", vendas: 7100 },
];

import {
  FiBox,
  FiArchive,
  FiDollarSign,
  FiUsers,
} from "react-icons/fi";

export const summaryCards = [
  {
    id: 1,
    title: "Produtos",
    value: "128",
    icon: FiBox,
    color: "#3B82F6",
    variation: "+12%",
    positive: true,
  },
  {
    id: 2,
    title: "Itens em Estoque",
    value: "842",
    icon: FiArchive,
    color: "#10B981",
    variation: "+4%",
    positive: true,
  },
  {
    id: 3,
    title: "Vendas Hoje",
    value: "R$ 2.450",
    icon: FiDollarSign,
    color: "#F59E0B",
    variation: "+18%",
    positive: true,
  },
  {
    id: 4,
    title: "Clientes",
    value: "58",
    icon: FiUsers,
    color: "#8B5CF6",
    variation: "-2%",
    positive: false,
  },
];