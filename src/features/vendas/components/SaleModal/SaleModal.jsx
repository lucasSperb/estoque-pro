import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { useSaleStore } from '../../../../store/useSaleStore';
import useProductStore from '../../../../store/useProductStore';
import useClientStore from '../../../../store/useClientStore';
import Button from '../../../../components/ui/Button/Button';
import Select from '../../../../components/ui/Select/Select';
import Input from '../../../../components/ui/Input/Input';
import toast from 'react-hot-toast';
import './SaleModal.css';

export function SaleModal({ open, onClose }) {
  if (!open) return null;

  const { adicionarVenda } = useSaleStore();

  const products = useProductStore((state) => state.products || []);
  const clientState = useClientStore();
  const clientes = clientState.clientes || clientState.clients || [];

  const [clienteId, setClienteId] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('PIX');
  const [desconto, setDesconto] = useState('');
  const [observacao, setObservacao] = useState('');

  // Itens do carrinho
  const [itens, setItens] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [qtdSelecionada, setQtdSelecionada] = useState(1);

  // Reset do formulário quando abre/fecha
  useEffect(() => {
    if (!open) {
      setClienteId('');
      setFormaPagamento('PIX');
      setDesconto('');
      setObservacao('');
      setItens([]);
      setProdutoSelecionado('');
      setQtdSelecionada(1);
    }
  }, [open]);

  // Fechar ao teclar ESC
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const clienteOptions = clientes.map((c) => ({
    label: `${c.nome || c.name}${c.telefone ? ` (${c.telefone})` : ''}`,
    value: c.id,
  }));

  const formaPagamentoOptions = [
    { label: 'PIX', value: 'PIX' },
    { label: 'Dinheiro', value: 'Dinheiro' },
    { label: 'Cartão de Crédito', value: 'Cartão de Crédito' },
    { label: 'Cartão de Débito', value: 'Cartão de Débito' },
    { label: 'Fiado / A Prazo', value: 'Fiado' },
  ];

  const formatarMoeda = (val) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const produtoOptions = products.map((p) => {
    const estoqueAtual = Number(p.estoque ?? p.quantidade ?? 0);
    const preco = Number(p.preco || p.price || 0);

    return {
      label: `${p.nome} - ${formatarMoeda(preco)} (Estoque: ${estoqueAtual})`,
      value: p.id,
      disabled: estoqueAtual <= 0,
    };
  });

  // Cálculo exato do Subtotal e Total Final baseados APENAS no carrinho
  const subtotalGeral = itens.reduce((sum, item) => sum + item.subtotal, 0);
  const totalGeral = Math.max(0, subtotalGeral - Number(desconto || 0));

  const handleAdicionarItem = () => {
    if (!produtoSelecionado) {
      toast.error('Selecione um produto!');
      return;
    }

    const produtoObj = products.find((p) => String(p.id) === String(produtoSelecionado));
    if (!produtoObj) return;

    const qtdNumerica = Number(qtdSelecionada);
    const estoqueDisponivel = Number(produtoObj.estoque ?? produtoObj.quantidade ?? 0);
    const precoUnitario = Number(produtoObj.preco || produtoObj.price || 0);

    if (qtdNumerica <= 0) {
      toast.error('Informe uma quantidade válida!');
      return;
    }

    if (qtdNumerica > estoqueDisponivel) {
      toast.error(`Estoque insuficiente! Apenas ${estoqueDisponivel} unidades disponíveis.`);
      return;
    }

    const itemExistenteIndex = itens.findIndex(
      (i) => String(i.produtoId) === String(produtoSelecionado)
    );

    if (itemExistenteIndex > -1) {
      const novaQtd = itens[itemExistenteIndex].quantidade + qtdNumerica;
      if (novaQtd > estoqueDisponivel) {
        toast.error(`Quantidade total no carrinho excede o estoque disponível (${estoqueDisponivel}).`);
        return;
      }
      const novosItens = [...itens];
      novosItens[itemExistenteIndex].quantidade = novaQtd;
      novosItens[itemExistenteIndex].subtotal = novaQtd * precoUnitario;
      setItens(novosItens);
    } else {
      setItens([
        ...itens,
        {
          produtoId: produtoObj.id,
          produtoNome: produtoObj.nome,
          precoUnitario: precoUnitario,
          quantidade: qtdNumerica,
          subtotal: qtdNumerica * precoUnitario,
        },
      ]);
    }

    setProdutoSelecionado('');
    setQtdSelecionada(1);
  };

  const handleRemoverItem = (index) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!clienteId) {
      toast.error('Selecione um cliente!');
      return;
    }

    let listaParaEnviar = [...itens];

    // Se o usuário selecionou um produto mas esqueceu de clicar no botão "+" de adicionar
    if (listaParaEnviar.length === 0 && produtoSelecionado) {
      const produtoObj = products.find((p) => String(p.id) === String(produtoSelecionado));
      if (produtoObj) {
        const qtdNumerica = Number(qtdSelecionada);
        const precoUnitario = Number(produtoObj.preco || produtoObj.price || 0);

        listaParaEnviar.push({
          produtoId: produtoObj.id,
          produtoNome: produtoObj.nome,
          precoUnitario: precoUnitario,
          quantidade: qtdNumerica,
          subtotal: qtdNumerica * precoUnitario,
        });
      }
    }

    if (listaParaEnviar.length === 0) {
      toast.error('Adicione pelo menos um produto no carrinho!');
      return;
    }

    const clienteObj = clientes.find((c) => String(c.id) === String(clienteId));

    try {
      adicionarVenda({
        clienteId,
        clienteNome: clienteObj ? clienteObj.nome || clienteObj.name : 'Cliente Não Identificado',
        itens: listaParaEnviar,
        desconto: Number(desconto || 0),
        total: totalGeral,
        formaPagamento,
        observacao,
      });

      toast.success('Venda realizada com sucesso!');
      onClose();
    } catch (err) {
      toast.error(err.message || 'Erro ao realizar a venda.');
    }
  };

  return (
    <div className="saleModal__overlay" onClick={onClose}>
      <div className="saleModal" onClick={(e) => e.stopPropagation()}>
        <div className="saleModal__header">
          <h2>
            <FiShoppingCart /> Nova Venda
          </h2>
          <button type="button" className="saleModal__close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="saleModal__body">
          {/* Informações Básicas */}
          <div className="saleModal__row">
            <div className="saleModal__field">
              <label>Cliente *</label>
              <Select
                options={clienteOptions}
                value={clienteId}
                placeholder="Selecione um cliente"
                onChange={(val) => setClienteId(val)}
              />
            </div>

            <div className="saleModal__field">
              <label>Forma de Pagamento</label>
              <Select
                options={formaPagamentoOptions}
                value={formaPagamento}
                placeholder="Selecione a forma"
                onChange={(val) => setFormaPagamento(val)}
              />
            </div>
          </div>

          {/* Adicionar Produtos ao Carrinho */}
          <div className="saleModal__section">
            <h3>Adicionar Produtos</h3>
            <div className="saleModal__addItem">
              <div style={{ flex: 1 }}>
                <Select
                  options={produtoOptions}
                  value={produtoSelecionado}
                  placeholder="Selecione um produto"
                  onChange={(val) => setProdutoSelecionado(val)}
                />
              </div>

              <Input
                type="number"
                min="1"
                step="1"
                value={qtdSelecionada}
                onChange={(e) => setQtdSelecionada(e.target.value)}
                placeholder="Qtd"
                style={{ width: '90px', textAlign: 'center' }}
              />

              <Button type="button" onClick={handleAdicionarItem}>
                <FiPlus />
              </Button>
            </div>
          </div>

          {/* Lista de Itens do Carrinho */}
          <div className="saleModal__cart">
            <h4>Itens da Venda ({itens.length})</h4>
            {itens.length === 0 ? (
              <p className="saleModal__cartEmpty">Carrinho vazio.</p>
            ) : (
              <div className="saleModal__cartList">
                {itens.map((item, idx) => (
                  <div key={idx} className="saleModal__cartItem">
                    <div>
                      <strong>{item.produtoNome}</strong>
                      <span>
                        {item.quantidade}x {formatarMoeda(item.precoUnitario)}
                      </span>
                    </div>
                    <div className="saleModal__cartItemActions">
                      <strong>{formatarMoeda(item.subtotal)}</strong>
                      <button
                        type="button"
                        onClick={() => handleRemoverItem(idx)}
                        className="delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totais e Desconto */}
          <div className="saleModal__footerSummary">
            <div className="saleModal__field">
              <Input
                type="number"
                label="Desconto (R$)"
                min="0"
                step="0.01"
                value={desconto}
                onChange={(e) => setDesconto(e.target.value)}
              />
            </div>
            <div className="saleModal__totals">
              <div>
                <span>Subtotal:</span>
                <span>{formatarMoeda(subtotalGeral)}</span>
              </div>
              <div className="total">
                <span>Total Final:</span>
                <strong>{formatarMoeda(totalGeral)}</strong>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="saleModal__field">
            <Input
              type="text"
              label="Observação"
              placeholder="Ex: Entrega agendada para sexta-feira"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />
          </div>

          {/* Rodapé de Ações */}
          <div className="saleModal__footer">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Finalizar Venda</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SaleModal;