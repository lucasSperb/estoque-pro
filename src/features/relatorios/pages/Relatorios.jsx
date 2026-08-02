import React, { useState, useMemo } from 'react';
import usePurchaseStore from '../../../store/usePurchaseStore';
import useProductStore from '../../../store/useProductStore';
import Select from '../../../components/ui/Select/Select';
import Button from '../../../components/ui/Button/Button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  FiBarChart2, 
  FiTrendingUp, 
  FiDollarSign, 
  FiPackage, 
  FiDownload 
} from 'react-icons/fi';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

import '../styles/Relatorios.css';

export function RelatoriosPage() {
  const purchases = usePurchaseStore((state) => state.purchases || []);
  const products = useProductStore((state) => state.products || []);

  const [period, setPeriod] = useState('30days');

  const periodOptions = [
    { value: '7days', label: 'Últimos 7 dias' },
    { value: '30days', label: 'Últimos 30 dias' },
    { value: '90days', label: 'Últimos 90 dias' },
    { value: 'year', label: 'Este ano' },
  ];

  // 1. Filtragem das Compras com base no Período selecionado
  const filteredPurchases = useMemo(() => {
    const now = new Date();
    return purchases.filter((purchase) => {
      if (!purchase.date) return true;
      const purchaseDate = new Date(purchase.date);
      const diffTime = Math.abs(now - purchaseDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (period === '7days') return diffDays <= 7;
      if (period === '30days') return diffDays <= 30;
      if (period === '90days') return diffDays <= 90;
      if (period === 'year') return purchaseDate.getFullYear() === now.getFullYear();
      return true;
    });
  }, [purchases, period]);

  // 2. Métricas Consolidadas dinâmicas
  const totalPurchasesValue = useMemo(() => {
    return filteredPurchases.reduce((acc, p) => acc + (p.totalAmount || p.total || 0), 0);
  }, [filteredPurchases]);

  const totalStockItems = useMemo(() => {
    return products.reduce((acc, p) => acc + Number(p.stock || p.quantidade || 0), 0);
  }, [products]);

  const totalStockValue = useMemo(() => {
    return products.reduce(
      (acc, p) => acc + Number(p.stock || p.quantidade || 0) * Number(p.price || p.preco || 0),
      0
    );
  }, [products]);

  // 3. Dados formatados para o gráfico de Compras (com base nas compras filtradas)
  const chartDataInvestment = useMemo(() => {
    if (filteredPurchases.length === 0) {
      return [{ date: 'Sem dados', valor: 0 }];
    }

    const grouped = filteredPurchases.reduce((acc, curr) => {
      const dateKey = curr.date ? new Date(curr.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : 'Outros';
      acc[dateKey] = (acc[dateKey] || 0) + (curr.totalAmount || curr.total || 0);
      return acc;
    }, {});

    return Object.keys(grouped).map((date) => ({
      date,
      valor: grouped[date]
    }));
  }, [filteredPurchases]);

  // 4. Distribuição do Estoque por Categoria
  const categoryData = useMemo(() => {
    return products.reduce((acc, item) => {
      const cat = item.category || 'Geral';
      const found = acc.find((c) => c.category === cat);
      if (found) {
        found.qtd += Number(item.stock || item.quantidade || 1);
      } else {
        acc.push({ category: cat, qtd: Number(item.stock || item.quantidade || 1) });
      }
      return acc;
    }, []);
  }, [products]);

  // 5. Função de Exportação para PDF Real
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Título do Documento
    doc.setFontSize(18);
    doc.text('Relatório Gerencial de Estoque e Compras', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 14, 30);
    doc.text(`Filtro selecionado: ${periodOptions.find((p) => p.value === period)?.label}`, 14, 36);

    // Tabela de Resumo Financeiro
    autoTable(doc, {
      startY: 44,
      head: [['Métrica', 'Valor']],
      body: [
        ['Investimento em Compras', `R$ ${totalPurchasesValue.toFixed(2)}`],
        ['Valor Total em Estoque', `R$ ${totalStockValue.toFixed(2)}`],
        ['Total de Itens Armazenados', `${totalStockItems} unidades`],
        ['Pedidos Registrados no Período', `${filteredPurchases.length} pedidos`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241] }
    });

    // Tabela de Detalhamento por Categoria
    if (categoryData.length > 0) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 14,
        head: [['Categoria', 'Quantidade em Estoque']],
        body: categoryData.map((c) => [c.category, `${c.qtd} un`]),
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] }
      });
    }

    doc.save(`relatorio_${period}_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <div className="relatorios">
      {/* Cabeçalho */}
      <header className="relatorios__header">
        <div>
          <h1>Relatórios</h1>
          <p>Visão geral do desempenho de estoque, vendas e compras</p>
        </div>
        <div className="relatorios__headerActions">
          <div className="relatorios__filter">
            <Select
              options={periodOptions}
              value={period}
              onChange={(val) => setPeriod(val)}
            />
          </div>
          <Button onClick={handleExportPDF} variant="secondary">
            <FiDownload /> Exportar PDF
          </Button>
        </div>
      </header>

      {/* Cards Indicadores */}
      <section className="relatorios__summary">
        <div className="relatoriosCard">
          <div className="relatoriosCard__header">
            <span>Investimento no Período</span>
            <FiDollarSign className="relatoriosCard__icon" />
          </div>
          <strong className="relatoriosCard__value">
            R$ {totalPurchasesValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </strong>
        </div>

        <div className="relatoriosCard">
          <div className="relatoriosCard__header">
            <span>Valor em Estoque</span>
            <FiTrendingUp className="relatoriosCard__icon" />
          </div>
          <strong className="relatoriosCard__value">
            R$ {totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </strong>
        </div>

        <div className="relatoriosCard">
          <div className="relatoriosCard__header">
            <span>Itens Armazenados</span>
            <FiPackage className="relatoriosCard__icon" />
          </div>
          <strong className="relatoriosCard__value">{totalStockItems} un</strong>
        </div>

        <div className="relatoriosCard">
          <div className="relatoriosCard__header">
            <span>Pedidos Filtrados</span>
            <FiBarChart2 className="relatoriosCard__icon" />
          </div>
          <strong className="relatoriosCard__value">{filteredPurchases.length}</strong>
        </div>
      </section>

      {/* Seção de Gráficos Dinâmicos */}
      <div className="relatorios__chartsGrid">
        <div className="relatoriosChartCard">
          <h3>Evolução de Compras (R$)</h3>
          <div className="relatoriosChartCard__wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartDataInvestment}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ background: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="valor" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="relatoriosChartCard">
          <h3>Estoque por Categoria</h3>
          <div className="relatoriosChartCard__wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryData.length ? categoryData : [{ category: 'Sem dados', qtd: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="category" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ background: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }}
                />
                <Bar dataKey="qtd" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RelatoriosPage;