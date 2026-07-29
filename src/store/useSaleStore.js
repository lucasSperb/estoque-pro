import { create } from 'zustand';
import useProductStore from './useProductStore';
import useStockStore from './useStockStore';

export const useSaleStore = create((set, get) => ({
  vendas: [],

  adicionarVenda: async (novaVenda) => {
    const productStore = useProductStore.getState();
    const stockStore = useStockStore.getState();

    const produtos = productStore.products || [];
    const updateProduct = productStore.updateProduct;
    const addMovement = stockStore.addMovement;

    for (const item of novaVenda.itens) {
      const targetProduct = produtos.find(
        (p) => String(p.id) === String(item.produtoId)
      );

      if (targetProduct) {
        const currentStock = Number(targetProduct.estoque ?? targetProduct.quantidade ?? 0);
        const qtdVendida = Number(item.quantidade);
        
        // Subtração direta e sem arredondamentos ou acréscimos
        const newStock = Math.max(0, currentStock - qtdVendida);

        if (typeof updateProduct === 'function') {
          await updateProduct({
            ...targetProduct,
            estoque: newStock,
            quantidade: newStock
          });
        } else {
          const produtosAtualizados = produtos.map((p) =>
            String(p.id) === String(targetProduct.id)
              ? { ...p, estoque: newStock, quantidade: newStock }
              : p
          );
          useProductStore.setState({ products: produtosAtualizados });
        }

        if (typeof addMovement === 'function') {
          addMovement({
            productId: targetProduct.id,
            productName: targetProduct.nome || item.produtoNome,
            type: 'saida',
            quantity: qtdVendida,
            previousStock: currentStock,
            newStock: newStock,
            observation: `Venda realizada (${novaVenda.formaPagamento || 'Balcão'}) ${
              novaVenda.observacao ? `- ${novaVenda.observacao}` : ''
            }`,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    const vendaComId = {
      ...novaVenda,
      id: Date.now().toString(),
      data: new Date().toISOString(),
    };

    set((state) => ({
      vendas: [vendaComId, ...state.vendas],
    }));

    return vendaComId;
  },
}));