import React, { useState } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiDollarSign, 
  FiShoppingBag, 
  FiXCircle, 
  FiCheckCircle 
} from 'react-icons/fi';
import { useSaleStore } from '@/store/useSaleStore';
import Button from '@/components/ui/Button/Button';
import Pagination from '@/components/ui/Pagination/Pagination';
import ConfirmDialog from '@/components/ui/ConfirmDialog/ConfirmDialog';
import Input from '@/components/ui/Input/Input';
import Select from '@/components/ui/Select/Select';
import SaleModal from '../components/SaleModal/SaleModal';
import toast from 'react-hot-toast';
import '../styles/Vendas.css';

export default function Vendas() {
  const {
    busca,
    setBusca,
    filtroStatus,
    setFiltroStatus,
    paginaAtual,
    setPaginaAtual,
    itensPorPagina,
    adicionarVenda,
    cancelarVenda,
    getVendasFiltradas,
    getTotalVendasMes
  } = useSaleStore();

  const [modalAberto, setModalAberto] = useState(false);
  const [vendaParaCancelar, setVendaParaCancelar] = useState(null);

  const vendasFiltradas = getVendasFiltradas ? getVendasFiltradas() : [];
  const totalPaginas = Math.ceil(vendasFiltradas.length / (itensPorPagina || 10)) || 1;
  const vendasExibidas = vendasFiltradas.slice(
    (paginaAtual - 1) * (itensPorPagina || 10),
    paginaAtual * (itensPorPagina || 10)
  );

  const optionsStatus = [
    { label: 'Todos os Status', value: 'todos' },
    { label: 'Concluídas', value: 'concluida' },
    { label: 'Canceladas', value: 'cancelada' },
  ];

  const handleSalvarVenda = (novaVenda) => {
    try {
      adicionarVenda(novaVenda);
      toast.success('Venda registrada com sucesso!');
      setModalAberto(false);
    } catch (err) {
      toast.error(err?.message || 'Erro ao registrar a venda.');
    }
  };

  const handleConfirmarCancelamento = () => {
    if (vendaParaCancelar) {
      cancelarVenda(vendaParaCancelar.id);
      toast.success(`Venda #${vendaParaCancelar.id} cancelada com sucesso!`);
      setVendaParaCancelar(null);
    }
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  };

  const formatarData = (dataIso) => {
    if (!dataIso) return '-';
    return new Date(dataIso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="vendas">
      {/* Cabeçalho */}
      <div className="vendas__header">
        <div>
          <h1>Vendas</h1>
          <p>Gerencie suas vendas, registre novos pedidos e acompanhe seus ganhos.</p>
        </div>
        <Button onClick={() => setModalAberto(true)}>
          <FiPlus /> Nova Venda
        </Button>
      </div>

      {/* Cards de Métricas Rápidas */}
      <div className="vendas__cards">
        <div className="vendasCard">
          <div className="vendasCard__icon">
            <FiDollarSign />
          </div>
          <div className="vendasCard__info">
            <span>Faturamento do Mês</span>
            <strong>{formatarMoeda(getTotalVendasMes ? getTotalVendasMes() : 0)}</strong>
          </div>
        </div>
        <div className="vendasCard">
          <div className="vendasCard__icon">
            <FiShoppingBag />
          </div>
          <div className="vendasCard__info">
            <span>Total de Vendas</span>
            <strong>{vendasFiltradas.length}</strong>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="vendas__filters">
        <div className="vendas__search">
          <Input
            placeholder="Buscar por cliente ou ID da venda..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            icon={<FiSearch />}
          />
        </div>
        <div className="vendas__selectFilter">
          <Select
            options={optionsStatus}
            value={filtroStatus}
            onChange={(val) => setFiltroStatus(val)}
          />
        </div>
      </div>

      {/* Tabela de Vendas em DIVs */}
      {vendasExibidas.length === 0 ? (
        <div className="vendas__empty">
          <h3>Nenhuma venda encontrada</h3>
          <p>Tente ajustar os filtros ou cadastre uma nova venda.</p>
        </div>
      ) : (
        <div className="vendasTable">
          <div className="vendasTable__head">
            <div>ID</div>
            <div>Cliente</div>
            <div>Data</div>
            <div>Forma Pagamento</div>
            <div>Total</div>
            <div>Status</div>
            <div>Ações</div>
          </div>

          {vendasExibidas.map((venda) => (
            <div key={venda.id} className="vendasTable__row">
              <div data-label="ID">
                <strong>#{venda.id}</strong>
              </div>
              <div data-label="Cliente">{venda.clienteNome || venda.cliente || 'Cliente Não Identificado'}</div>
              <div data-label="Data">{formatarData(venda.data)}</div>
              <div data-label="Pagamento">{venda.formaPagamento}</div>
              <div data-label="Total">
                <strong>{formatarMoeda(venda.total)}</strong>
              </div>
              <div data-label="Status">
                <span className={`vendasBadge vendasBadge--${venda.status}`}>
                  {venda.status === 'concluida' ? (
                    <>
                      <FiCheckCircle /> Concluída
                    </>
                  ) : (
                    <>
                      <FiXCircle /> Cancelada
                    </>
                  )}
                </span>
              </div>
              <div data-label="Ações" className="vendasTable__actions">
                {venda.status === 'concluida' && (
                  <button
                    type="button"
                    className="delete"
                    title="Cancelar Venda"
                    onClick={() => setVendaParaCancelar(venda)}
                  >
                    <FiXCircle />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      {totalPaginas > 1 && (
        <Pagination
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          onPageChange={setPaginaAtual}
        />
      )}

      {/* Modal de Nova Venda */}
      <SaleModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSave={handleSalvarVenda}
      />

      {/* Diálogo de Confirmação de Cancelamento */}
      <ConfirmDialog
        isOpen={!!vendaParaCancelar}
        title="Cancelar Venda"
        message={`Tem certeza de que deseja cancelar a venda #${vendaParaCancelar?.id}? O valor será desconsiderado e os itens retornarão ao estoque.`}
        confirmText="Sim, Cancelar"
        cancelText="Voltar"
        onConfirm={handleConfirmarCancelamento}
        onCancel={() => setVendaParaCancelar(null)}
      />
    </div>
  );
}