import { useEffect, useState, useMemo } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";

import useProductStore from "../../../store/useProductStore";

import Button from "../../../components/ui/Button/Button";
import Select from "../../../components/ui/Select/Select";
import Pagination from "../../../components/ui/Pagination/Pagination";
import ConfirmDialog from "../../../components/ui/ConfirmDialog/ConfirmDialog";
import ProductDetailsModal from "../components/ProductDetailsModal/ProductDetailsModal";
import ProductTable from "../components/ProductTable/ProductTable";
import ProductForm from "../components/ProductForm/ProductForm";

import "../styles/Produtos.css";

function Produtos() {
  const [openForm, setOpenForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [page, setPage] = useState(1);

  // ==========================
  // STORE
  // ==========================

  const search = useProductStore((state) => state.search);
  const setSearch = useProductStore((state) => state.setSearch);

  const category = useProductStore((state) => state.category);
  const setCategory = useProductStore((state) => state.setCategory);

  const itemsPerPage = useProductStore((state) => state.itemsPerPage);
  const setItemsPerPage = useProductStore((state) => state.setItemsPerPage);

  const products = useProductStore((state) => state.products || []);

  const addProduct = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  // ⚠️ REMOVIDO: O useEffect com loadProducts() foi apagado para impedir o reset dos dados.

  async function handleSave(product) {
    if (selectedProduct?.id) {
      await updateProduct({
        ...product,
        id: selectedProduct.id,
      });
    } else {
      await addProduct(product);
    }

    setOpenForm(false);
    setSelectedProduct(null);
  }

  function handleDelete(product) {
    setProductToDelete(product);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!productToDelete) return;

    await deleteProduct(productToDelete.id);

    setConfirmOpen(false);
    setProductToDelete(null);
  }

  const categoryOptions = [
    { value: "", label: "Todas categorias" },
    { value: "Perfumes", label: "Perfumes" },
    { value: "Cabelos", label: "Cabelos" },
    { value: "Banho", label: "Banho" },
    { value: "Hidratantes", label: "Hidratantes" },
  ];

  // Filtra a lista de produtos reativamente
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const text = search.trim().toLowerCase();

      const matchesSearch =
        text === "" ||
        product.nome?.toLowerCase().includes(text) ||
        product.codigo?.toLowerCase().includes(text) ||
        product.marca?.toLowerCase().includes(text);

      const matchesCategory =
        category === "" || product.categoria === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  // Reseta para a primeira página se o resultado filtrado for menor que o offset atual
  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, page, itemsPerPage]);

  return (
    <div className="produtos">
      <div className="produtos__header">
        <div>
          <h1>Produtos</h1>
          <p>Gerencie todos os produtos do estoque.</p>
        </div>

        <Button
          icon={<FiPlus />}
          onClick={() => {
            setSelectedProduct(null);
            setOpenForm(true);
          }}
        >
          Novo Produto
        </Button>
      </div>

      <div className="produtos__toolbar">
        <div className="produtos__search">
          <FiSearch />
          <input
            type="text"
            placeholder="Pesquisar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="produtos__filter">
          <Select
            value={category}
            onChange={setCategory}
            placeholder="Todas categorias"
            options={categoryOptions}
          />
        </div>
      </div>

      <section className="produtos__content">
        <ProductTable
          products={paginatedProducts}
          onEdit={(product) => {
            setSelectedProduct(product);
            setOpenForm(true);
          }}
          onView={(product) => {
            setViewProduct(product);
          }}
          onDelete={handleDelete}
        />

        <div className="produtos__footer">
          <div className="produtos__results">
            Exibindo <strong>{paginatedProducts.length}</strong> de{" "}
            {filteredProducts.length} produto(s)
          </div>

          <div className="produtos__perPage">
            <span>Itens por página</span>

            <div className="customSelect">
              <div className="customSelect__value">{itemsPerPage}</div>

              <div className="customSelect__options">
                {[10, 25, 50, 100].map((value) => (
                  <div
                    key={value}
                    className={
                      itemsPerPage === value
                        ? "customSelect__option active"
                        : "customSelect__option"
                    }
                    onClick={() => {
                      setItemsPerPage(value);
                      setPage(1);
                    }}
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </section>

      <ProductForm
        open={openForm}
        product={selectedProduct}
        onClose={() => {
          setOpenForm(false);
          setSelectedProduct(null);
        }}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Excluir produto"
        message={
          productToDelete
            ? `Deseja realmente excluir "${productToDelete.nome}"? Esta ação não poderá ser desfeita.`
            : ""
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
        onCancel={() => {
          setConfirmOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDelete}
      />

      <ProductDetailsModal
        open={!!viewProduct}
        product={viewProduct}
        onClose={() => {
          setViewProduct(null);
        }}
      />
    </div>
  );
}

export default Produtos;