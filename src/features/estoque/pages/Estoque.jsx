import { useState } from "react";
import { FiPlus, FiList, FiClock } from "react-icons/fi";

import Button from "../../../components/ui/Button/Button";
import useProductStore from "../../../store/useProductStore";
import useStockStore from "../../../store/useStockStore";

import StockSummary from "../components/StockSummary/StockSummary";
import StockTable from "../components/StockTable/StockTable";
import StockHistory from "../components/StockHistory/StockHistory";
import StockMovementModal from "../components/StockMovementModal/StockMovementModal";
import ProductDetailsModal from "../../Produtos/components/ProductDetailsModal/ProductDetailsModal";

import "../styles/Estoque.css";

function Estoque() {
  const [activeTab, setActiveTab] = useState("table"); // 'table' | 'history'
  const [movementOpen, setMovementOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [movementType, setMovementType] = useState("entrada");
  
  // Flag para evitar requisições/chamadas duplas consecutivas
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [viewProduct, setViewProduct] = useState(null);

  const products = useProductStore((state) => state.products) || [];
  const updateProduct = useProductStore((state) => state.updateProduct);
  const addMovement = useStockStore((state) => state.addMovement);

  function handleMovement(product, type = "entrada") {
    setSelectedProduct(product);
    setMovementType(type);
    setMovementOpen(true);
  }

  async function handleSaveMovement(movementData) {
    // Se já estiver salvando, bloqueia a segunda chamada!
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { productId, type, quantity, observation } = movementData;

      const targetProduct = products.find((p) => String(p.id) === String(productId));
      if (!targetProduct) return;

      const currentStock = Number(targetProduct.estoque ?? targetProduct.quantidade ?? 0);
      const qtyNumber = Number(quantity) || 0;

      let newStock = currentStock;

      if (type === "entrada") {
        newStock = currentStock + qtyNumber;
      } else if (type === "saida") {
        newStock = Math.max(0, currentStock - qtyNumber);
      } else if (type === "ajuste") {
        newStock = qtyNumber;
      }

      if (updateProduct) {
        await updateProduct({
          ...targetProduct,
          estoque: newStock,
          quantidade: newStock,
        });
      }

      if (addMovement) {
        addMovement({
          productId,
          productName: targetProduct.nome,
          type,
          quantity: qtyNumber,
          previousStock: currentStock,
          newStock,
          observation,
          createdAt: new Date().toISOString(),
        });
      }

      setMovementOpen(false);
      setSelectedProduct(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="estoque">
      <div className="estoque__header">
        <div>
          <h1>Estoque</h1>
          <p>
            Controle entradas, saídas e movimentações dos produtos.
          </p>
        </div>

        <Button
          icon={<FiPlus />}
          onClick={() => {
            setSelectedProduct(null);
            setMovementType("entrada");
            setMovementOpen(true);
          }}
        >
          Nova Movimentação
        </Button>
      </div>

      <StockSummary />

      <div className="estoque__nav">
        <button
          type="button"
          className={`estoque__tab ${activeTab === "table" ? "estoque__tab--active" : ""}`}
          onClick={() => setActiveTab("table")}
        >
          <FiList /> Produtos em Estoque
        </button>

        <button
          type="button"
          className={`estoque__tab ${activeTab === "history" ? "estoque__tab--active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          <FiClock /> Histórico de Movimentações
        </button>
      </div>

      <div className="estoque__content">
        {activeTab === "table" ? (
          <StockTable
            products={products}
            onMovement={handleMovement}
            onView={(product) => setViewProduct(product)}
          />
        ) : (
          <StockHistory />
        )}
      </div>

      <StockMovementModal
        open={movementOpen}
        product={selectedProduct}
        initialType={movementType}
        onClose={() => {
          setMovementOpen(false);
          setSelectedProduct(null);
        }}
        onSave={handleSaveMovement}
      />

      <ProductDetailsModal
        open={!!viewProduct}
        product={viewProduct}
        onClose={() => setViewProduct(null)}
      />
    </div>
  );
}

export default Estoque;