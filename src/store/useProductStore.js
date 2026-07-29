import { create } from "zustand";
import { persist } from "zustand/middleware";

import productService from "../services/productService";

const useProductStore = create(
  persist(
    (set, get) => ({
      products: [],
      loading: false,
      search: "",
      category: "",
      page: 1,
      itemsPerPage: 10,

      setSearch: (value) =>
        set({ search: value, page: 1 }),

      setCategory: (value) =>
        set({ category: value, page: 1 }),

      setPage: (page) => set({ page }),

      nextPage: () => set((state) => ({ page: state.page + 1 })),

      prevPage: () =>
        set((state) => ({ page: state.page > 1 ? state.page - 1 : 1 })),

      setItemsPerPage: (items) =>
        set({ itemsPerPage: items, page: 1 }),

      getFilteredProducts: () => {
        const { products, search, category } = get();

        return (products || []).filter((product) => {
          const matchesSearch =
            search === "" ||
            product.nome?.toLowerCase().includes(search.toLowerCase()) ||
            product.codigo?.toLowerCase().includes(search.toLowerCase()) ||
            product.marca?.toLowerCase().includes(search.toLowerCase());

          const matchesCategory =
            category === "" || product.categoria === category;

          return matchesSearch && matchesCategory;
        });
      },

      getPaginatedProducts: () => {
        const filtered = get().getFilteredProducts();
        const { page, itemsPerPage } = get();
        const start = (page - 1) * itemsPerPage;
        return filtered.slice(start, start + itemsPerPage);
      },

      getTotalPages: () => {
        const filtered = get().getFilteredProducts();
        return Math.ceil(filtered.length / get().itemsPerPage);
      },

      loadProducts: async () => {
        set({ loading: true });
        try {
          const data = await productService.getAll();
          set({ products: data || [], loading: false });
        } catch (error) {
          console.error(error);
          set({ loading: false });
        }
      },

      addProduct: async (product) => {
        try {
          const novo = await productService.create(product);
          set((state) => ({
            products: [...state.products, novo],
          }));
        } catch (error) {
          console.error(error);
        }
      },

      updateProduct: async (product) => {
        try {
          const atualizado = await productService.update(product);
          set((state) => ({
            products: state.products.map((p) =>
              String(p.id) === String(atualizado.id) ? atualizado : p
            ),
          }));
        } catch (error) {
          console.error(error);
        }
      },

      deleteProduct: async (id) => {
        try {
          await productService.remove(id);
          set((state) => ({
            products: state.products.filter((p) => String(p.id) !== String(id)),
          }));
        } catch (error) {
          console.error(error);
        }
      },
    }),
    {
      name: "estoque-products",
    }
  )
);

export default useProductStore;