import { useState } from "react";
import { FiPlus } from "react-icons/fi";

import Button from "../../../components/ui/Button/Button";
import useProductStore from "../../../store/useProductStore";
import useStockStore from "../../../store/useStockStore";

import StockSummary from "../components/StockSummary/StockSummary";
import StockTable from "../components/StockTable/StockTable";
import StockMovementModal from "../components/StockMovementModal/StockMovementModal";

import "../styles/Estoque.css";

function Estoque() {
  const [movementOpen, setMovementOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Escuta a lista de produtos reativa da store diretamente
  const products = useProductStore((state) => state.products) || [];
  const updateProduct = useProductStore((state) => state.updateProduct);

  const addMovement = useStockStore((state) => state.addMovement);

  // ⚠️ REMOVIDO: O useEffect com loadProducts() foi removido para evitar
  // que o estado seja resetado logo após a montagem do componente.

  function handleMovement(product) {
    setSelectedProduct(product);
    setMovementOpen(true);
  }

  async function handleSaveMovement(movementData) {
    const { productId, type, quantity, observation } = movementData;

    const targetProduct = products.find((p) => String(p.id) === String(productId));
    if (!targetProduct) return;

    const currentStock = Number(targetProduct.estoque || 0);
    let newStock = currentStock;

    if (type === "entrada") {
      newStock = currentStock + quantity;
    } else if (type === "saida") {
      newStock = Math.max(0, currentStock - quantity);
    } else if (type === "ajuste") {
      newStock = quantity;
    }

    if (updateProduct) {
      await updateProduct({
        ...targetProduct,
        estoque: newStock,
      });
    }

    if (addMovement) {
      addMovement({
        productId,
        productName: targetProduct.nome,
        type,
        quantity,
        previousStock: currentStock,
        newStock,
        observation,
        createdAt: new Date().toISOString(),
      });
    }

    setMovementOpen(false);
    setSelectedProduct(null);
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
            setMovementOpen(true);
          }}
        >
          Nova Movimentação
        </Button>
      </div>

      <StockSummary />

      <div className="estoque__content">
        <StockTable
          products={products}
          onMovement={handleMovement}
        />
      </div>

      <StockMovementModal
        open={movementOpen}
        product={selectedProduct}
        onClose={() => {
          setMovementOpen(false);
          setSelectedProduct(null);
        }}
        onSave={handleSaveMovement}
      />
    </div>
  );
}

export default Estoque;