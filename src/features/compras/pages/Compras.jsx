import React, { useState } from 'react';
import usePurchaseStore from "../../../store/usePurchaseStore";
import useProductStore from "../../../store/useProductStore";
import Button from "../../../components/ui/Button/Button";
import Select from "../../../components/ui/Select/Select";
import { Modal } from "../../../components/ui/Modal/Modal"; 
import { 
  FiPlus, 
  FiTruck, 
  FiPackage, 
  FiDollarSign, 
  FiCheckCircle, 
  FiSearch, 
  FiTrash2 
} from 'react-icons/fi';

import "../styles/Compras.css";

export function ComprasPage() {
  const purchases = usePurchaseStore((state) => state.purchases);
  const getMetrics = usePurchaseStore((state) => state.getMetrics);
  const getFilteredPurchases = usePurchaseStore((state) => state.getFilteredPurchases);
  const isModalOpen = usePurchaseStore((state) => state.isModalOpen);
  const openModal = usePurchaseStore((state) => state.openModal);
  const closeModal = usePurchaseStore((state) => state.closeModal);
  const addPurchase = usePurchaseStore((state) => state.addPurchase);
  const searchTerm = usePurchaseStore((state) => state.searchTerm);
  const setSearchTerm = usePurchaseStore((state) => state.setSearchTerm);
  const selectedPeriod = usePurchaseStore((state) => state.selectedPeriod);
  const setSelectedPeriod = usePurchaseStore((state) => state.setSelectedPeriod);

  const products = useProductStore((state) => state.products || []);

  const [supplierName, setSupplierName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Boleto');
  const [cart, setCart] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState('');

  const { totalPurchasesValue, totalItemsPurchased, totalOrders, averageOrderValue } = getMetrics();
  const filteredPurchases = getFilteredPurchases();

  // Opções para o Select de Forma de Pagamento
  const paymentOptions = [
    { value: 'Boleto', label: 'Boleto Bancário' },
    { value: 'Pix', label: 'Pix' },
    { value: 'Cartão de Crédito', label: 'Cartão de Crédito' },
    { value: 'Transferência', label: 'Transferência Bancária' },
  ];

  // Opções para o Select de Período (Filtro da Tabela)
  const periodOptions = [
    { value: 'all', label: 'Todos os Períodos' },
    { value: 'today', label: 'Hoje' },
    { value: '7days', label: 'Últimos 7 dias' },
    { value: '30days', label: 'Últimos 30 dias' },
  ];

  // Mapeamento dos produtos para as opções aceitas pelo Select
  const productOptions = products.map((p) => ({
    value: String(p.id),
    label: `${p.name || p.nome} (Estoque: ${p.stock || p.quantidade || 0})`,
  }));

  const handleProductChange = (val) => {
    setSelectedProductId(val);
    const p = products.find((prod) => String(prod.id) === String(val));
    if (p) {
      setCustomPrice(p.price || p.preco || '');
    } else {
      setCustomPrice('');
    }
  };

  const handleAddToCart = () => {
    if (!selectedProductId) return;
    const product = products.find((p) => String(p.id) === String(selectedProductId));
    if (!product) return;

    const qty = Number(selectedQuantity);
    const unitPrice = customPrice !== '' ? Number(customPrice) : (product.price || 0);

    const existingIndex = cart.findIndex((item) => String(item.productId) === String(product.id));

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += qty;
      updatedCart[existingIndex].unitPrice = unitPrice;
      updatedCart[existingIndex].subtotal = updatedCart[existingIndex].quantity * unitPrice;
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name || product.nome,
          unitPrice,
          quantity: qty,
          subtotal: unitPrice * qty,
        },
      ]);
    }

    setSelectedProductId('');
    setSelectedQuantity(1);
    setCustomPrice('');
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.subtotal, 0);

  const handleSubmitPurchase = (e) => {
    e.preventDefault();
    if (!supplierName || cart.length === 0) return;

    addPurchase({
      supplierName,
      paymentMethod,
      items: cart,
      totalAmount: cartTotal,
    });

    setSupplierName('');
    setPaymentMethod('Boleto');
    setCart([]);
    closeModal();
  };

  return (
    <div className="compras">
      {/* Cabeçalho */}
      <header className="compras__header">
        <div>
          <h1>Compras</h1>
          <p>Gerencie os pedidos de compra e reposição de estoque</p>
        </div>
        <Button onClick={openModal} variant="primary">
          <FiPlus /> Nova Compra
        </Button>
      </header>

      {/* Cards de Métricas */}
      <section className="compras__summary">
        <div className="comprasCard">
          <div className="comprasCard__header">
            <span className="comprasCard__title">Total Comprado</span>
            <FiDollarSign className="comprasCard__icon" />
          </div>
          <div className="comprasCard__value">
            R$ {totalPurchasesValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="comprasCard">
          <div className="comprasCard__header">
            <span className="comprasCard__title">Total de Pedidos</span>
            <FiCheckCircle className="comprasCard__icon" />
          </div>
          <div className="comprasCard__value">{totalOrders}</div>
        </div>

        <div className="comprasCard">
          <div className="comprasCard__header">
            <span className="comprasCard__title">Itens Recebidos</span>
            <FiPackage className="comprasCard__icon" />
          </div>
          <div className="comprasCard__value">{totalItemsPurchased} un</div>
        </div>

        <div className="comprasCard">
          <div className="comprasCard__header">
            <span className="comprasCard__title">Média por Pedido</span>
            <FiTruck className="comprasCard__icon" />
          </div>
          <div className="comprasCard__value">
            R$ {averageOrderValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </section>

      {/* Barra de Ferramentas */}
      <div className="compras__toolbar">
        <div className="compras__search">
          <FiSearch />
          <input
            type="text"
            placeholder="Buscar por fornecedor ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="compras__filter">
          <Select
            options={periodOptions}
            value={selectedPeriod}
            onChange={(val) => setSelectedPeriod(val)}
            placeholder="Selecione o período"
          />
        </div>
      </div>

      {/* Tabela de Compras */}
      <div className="compras__content">
        <div className="comprasTable">
          <div className="comprasTable__row comprasTable__row--header">
            <div className="comprasTable__cell">Código / Data</div>
            <div className="comprasTable__cell">Fornecedor</div>
            <div className="comprasTable__cell">Pagamento</div>
            <div className="comprasTable__cell">Qtd. Itens</div>
            <div className="comprasTable__cell">Total</div>
          </div>

          {filteredPurchases.length === 0 ? (
            <div className="compras__empty">
              <h2>Nenhuma compra encontrada</h2>
              <p>Não há registros de compras para os filtros selecionados.</p>
            </div>
          ) : (
            filteredPurchases.map((purchase) => (
              <div key={purchase.id || purchase.code} className="comprasTable__row">
                <div className="comprasTable__cell">
                  <strong>{purchase.code || '#C000'}</strong>
                  <span className="comprasTable__subtext">
                    {new Date(purchase.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="comprasTable__cell">{purchase.supplierName}</div>
                <div className="comprasTable__cell">{purchase.paymentMethod}</div>
                <div className="comprasTable__cell">
                  {purchase.items ? purchase.items.reduce((acc, i) => acc + i.quantity, 0) : 0} un
                </div>
                <div className="comprasTable__cell">
                  <strong>R$ {(purchase.totalAmount || 0).toFixed(2)}</strong>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de Registro de Compra */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          closeModal();
          setCart([]);
          setSupplierName('');
        }} 
        title="Registrar Nova Compra"
      >
        <form onSubmit={handleSubmitPurchase} className="comprasForm">
          <div className="comprasForm__group">
            <label>Nome do Fornecedor</label>
            <input
              type="text"
              required
              className="comprasInput"
              placeholder="Ex: Distribuidora Brasil"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
            />
          </div>

          <div className="comprasForm__group">
            <label>Forma de Pagamento</label>
            <Select
              options={paymentOptions}
              value={paymentMethod}
              onChange={(val) => setPaymentMethod(val)}
              placeholder="Selecione a forma de pagamento"
            />
          </div>

          <div className="comprasCart">
            <h3>Adicionar Produtos ao Pedido</h3>
            <div className="comprasCart__inputs">
              <div style={{ flex: 1, minWidth: '180px' }}>
                <Select
                  options={productOptions}
                  value={selectedProductId}
                  onChange={handleProductChange}
                  placeholder="Selecione um produto..."
                />
              </div>

              <input
                type="number"
                min="1"
                placeholder="Qtd"
                className="comprasInput comprasInput--sm"
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(e.target.value)}
              />

              <input
                type="number"
                step="0.01"
                placeholder="Custo Un."
                className="comprasInput comprasInput--md"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
              />

              <Button type="button" onClick={handleAddToCart} variant="secondary">
                Adicionar
              </Button>
            </div>

            <div className="comprasCart__list">
              {cart.map((item) => (
                <div key={item.productId} className="comprasCart__item">
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.quantity}x R$ {Number(item.unitPrice).toFixed(2)}</span>
                  </div>
                  <div className="comprasCart__itemRight">
                    <strong>R$ {Number(item.subtotal).toFixed(2)}</strong>
                    <button
                      type="button"
                      onClick={() => handleRemoveFromCart(item.productId)}
                      className="comprasRemoveBtn"
                      title="Remover produto"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="comprasCart__total">
              <span>Total da Compra:</span>
              <strong>R$ {cartTotal.toFixed(2)}</strong>
            </div>
          </div>

          <div className="comprasForm__actions">
            <Button type="button" onClick={closeModal} variant="secondary">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={cart.length === 0}>
              Finalizar Compra
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ComprasPage;