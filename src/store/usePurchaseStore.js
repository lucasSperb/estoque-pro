import { create } from 'zustand';
import useStockStore from "./useStockStore";
import useProductStore from "./useProductStore";

const initialPurchasesMock = [
  {
    id: 'PURCHASE-1',
    code: '#C100001',
    supplierName: 'Distribuidora Central Ltda',
    paymentMethod: 'Boleto',
    totalAmount: 1250.00,
    createdAt: new Date().toISOString(),
    items: [
      { productId: '1', name: 'Produto Exemplo', quantity: 10, unitPrice: 125.00, subtotal: 1250.00 }
    ]
  }
];

export const usePurchaseStore = create((set, get) => ({
  purchases: initialPurchasesMock,
  searchTerm: '',
  selectedPeriod: 'all',
  currentPage: 1,
  itemsPerPage: 8,
  isModalOpen: false,

  setSearchTerm: (term) => set({ searchTerm: term, currentPage: 1 }),
  setSelectedPeriod: (period) => set({ selectedPeriod: period, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  addPurchase: (newPurchaseData) => {
    const newPurchase = {
      id: `PURCHASE-${Date.now()}`,
      code: `#C${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      status: 'completed',
      ...newPurchaseData,
    };

    set((state) => ({
      purchases: [newPurchase, ...state.purchases],
      isModalOpen: false,
    }));

    const stockStore = useStockStore.getState();
    const productStore = useProductStore.getState();

    if (newPurchase.items && Array.isArray(newPurchase.items)) {
      newPurchase.items.forEach((item) => {
        if (stockStore && stockStore.addMovement) {
          stockStore.addMovement({
            productId: item.productId,
            productName: item.name,
            type: 'entrada',
            quantity: item.quantity,
            origin: 'Compra',
            date: newPurchase.createdAt,
          });
        }

        if (productStore && productStore.updateProduct) {
          const currentProduct = (productStore.products || []).find(
            (p) => String(p.id) === String(item.productId)
          );
          
          if (currentProduct) {
            const currentStock = currentProduct.stock || currentProduct.quantidade || 0;
            productStore.updateProduct({
              ...currentProduct,
              stock: currentStock + Number(item.quantity),
            });
          }
        }
      });
    }
  },

  getMetrics: () => {
    const { purchases } = get();
    
    const totalPurchasesValue = purchases.reduce((acc, purchase) => acc + (purchase.totalAmount || 0), 0);
    const totalItemsPurchased = purchases.reduce((acc, purchase) => {
      return acc + (purchase.items ? purchase.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0) : 0);
    }, 0);
    
    const totalOrders = purchases.length;
    const averageOrderValue = totalOrders > 0 ? totalPurchasesValue / totalOrders : 0;

    return {
      totalPurchasesValue,
      totalItemsPurchased,
      totalOrders,
      averageOrderValue,
    };
  },

  getFilteredPurchases: () => {
    const { purchases, searchTerm, selectedPeriod } = get();

    return purchases.filter((purchase) => {
      const matchesSearch =
        (purchase.supplierName && purchase.supplierName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (purchase.code && purchase.code.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedPeriod === 'all') return true;

      const purchaseDate = new Date(purchase.createdAt);
      const now = new Date();

      if (selectedPeriod === 'today') {
        return purchaseDate.toDateString() === now.toDateString();
      }

      if (selectedPeriod === '7days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return purchaseDate >= sevenDaysAgo;
      }

      if (selectedPeriod === '30days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return purchaseDate >= thirtyDaysAgo;
      }

      return true;
    });
  },
}));

export default usePurchaseStore;