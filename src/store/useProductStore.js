import { create } from "zustand";
import { persist } from "zustand/middleware";

import productService from "../services/productService";

const useProductStore = create(
  persist(
    (set, get) => ({
      // ==========================
      // ESTADOS
      // ==========================

      products: [],

      loading: false,

      search: "",

      category: "",

      page: 1,

      itemsPerPage: 10,

      // ==========================
      // FILTROS
      // ==========================

      setSearch: (value) =>
        set({
          search: value,
          page: 1,
        }),

      setCategory: (value) =>
        set({
          category: value,
          page: 1,
        }),

      setPage: (page) =>
        set({
          page,
        }),

      nextPage: () =>
        set((state) => ({
          page: state.page + 1,
        })),

      prevPage: () =>
        set((state) => ({
          page:
            state.page > 1
              ? state.page - 1
              : 1,
        })),

      setItemsPerPage: (items) =>
        set({
          itemsPerPage: items,
          page: 1,
        }),

      // ==========================
      // PRODUTOS FILTRADOS
      // ==========================

      getFilteredProducts: () => {
        const {
          products,
          search,
          category,
        } = get();

        return products.filter((product) => {
          const matchesSearch =
            search === "" ||
            product.nome
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            product.codigo
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            product.marca
              .toLowerCase()
              .includes(search.toLowerCase());

          const matchesCategory =
            category === "" ||
            product.categoria === category;

          return (
            matchesSearch &&
            matchesCategory
          );
        });
      },

      // ==========================
      // PAGINAÇÃO
      // ==========================

      getPaginatedProducts: () => {
        const filtered =
          get().getFilteredProducts();

        const page = get().page;

        const items =
          get().itemsPerPage;

        const start =
          (page - 1) * items;

        return filtered.slice(
          start,
          start + items
        );
      },

      getTotalPages: () => {
        const filtered =
          get().getFilteredProducts();

        return Math.ceil(
          filtered.length /
            get().itemsPerPage
        );
      },

      // ==========================
      // CRUD
      // ==========================

      loadProducts: async () => {
        set({
          loading: true,
        });

        try {
          const data =
            await productService.getAll();

          set({
            products: data,
            loading: false,
          });
        } catch (error) {
          console.error(error);

          set({
            loading: false,
          });
        }
      },

      addProduct: async (product) => {
        const novo =
          await productService.create(
            product
          );

        set((state) => ({
          products: [
            ...state.products,
            novo,
          ],
        }));
      },

      updateProduct: async (product) => {
        const atualizado =
          await productService.update(
            product
          );

        set((state) => ({
          products:
            state.products.map((p) =>
              p.id === atualizado.id
                ? atualizado
                : p
            ),
        }));
      },

      deleteProduct: async (id) => {
        await productService.remove(id);

        set((state) => ({
          products:
            state.products.filter(
              (p) => p.id !== id
            ),
        }));
      },
    }),
    {
      name: "estoque-products",
    }
  )
);

export default useProductStore;