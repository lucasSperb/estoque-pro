import { create } from "zustand";
import { persist } from "zustand/middleware";
import useProductStore from "./useProductStore";

const useStockStore = create(
  persist(
    (set, get) => ({
      loading: false,
      movements: [],
      search: "",
      page: 1,
      itemsPerPage: 10,

      setSearch: (search) => set({ search, page: 1 }),
      setPage: (page) => set({ page }),
      setItemsPerPage: (itemsPerPage) =>
        set({
          itemsPerPage,
          page: 1,
        }),

      getProducts: () => {
        return useProductStore.getState().products || [];
      },

      addMovement: ({ productId, quantity, type, reason = "", observation = "" }) => {
        const productStore = useProductStore.getState();
        const products = productStore.products || [];

        const product = products.find((p) => String(p.id) === String(productId));
        if (!product) return;

        const currentStock = Number(product.estoque ?? product.quantidade ?? 0);
        let newStock = currentStock;
        const qtyNum = Number(quantity || 0);

        switch (type) {
          case "entrada":
            newStock += qtyNum;
            break;

          case "saida":
            newStock -= qtyNum;
            if (newStock < 0) newStock = 0;
            break;

          case "ajuste":
            newStock = qtyNum;
            break;

          default:
            return;
        }

        productStore.updateProduct({
          ...product,
          estoque: newStock,
          quantidade: newStock,
        });

        const movement = {
          id: Date.now(),
          productId,
          productName: product.nome,
          type,
          quantity: qtyNum,
          previousStock: currentStock,
          newStock,
          reason,
          observation,
          date: new Date().toLocaleString("pt-BR"),
        };

        set((state) => ({
          movements: [movement, ...state.movements],
        }));
      },

      getFilteredProducts: () => {
        const products = get().getProducts();
        const text = get().search.trim().toLowerCase();

        return products.filter((product) => {
          if (!text) return true;

          return (
            product.nome?.toLowerCase().includes(text) ||
            product.codigo?.toLowerCase().includes(text) ||
            product.marca?.toLowerCase().includes(text)
          );
        });
      },

      getPaginatedProducts: () => {
        const { page, itemsPerPage } = get();
        const filtered = get().getFilteredProducts();
        const start = (page - 1) * itemsPerPage;

        return filtered.slice(start, start + itemsPerPage);
      },

      getTotalPages: () => {
        return Math.max(
          1,
          Math.ceil(get().getFilteredProducts().length / get().itemsPerPage)
        );
      },

      getSummary: () => {
        const products = get().getProducts();

        let totalProducts = products.length;
        let lowStock = 0;
        let outStock = 0;
        let totalValue = 0;

        products.forEach((product) => {
          const stock = Number(product.estoque ?? product.quantidade ?? 0);
          const minimum = Number(product.estoqueMinimo || 0);
          const price = Number(product.preco || 0);

          totalValue += stock * price;

          if (stock <= 0) {
            outStock++;
          } else if (stock <= minimum) {
            lowStock++;
          }
        });

        return {
          totalProducts,
          lowStock,
          outStock,
          totalValue,
        };
      },
    }),
    {
      name: "estoque-movements",
    }
  )
);

export default useStockStore;