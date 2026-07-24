export function getStockStatus(
  estoque,
  estoqueMinimo
) {

  if (estoque === 0) {
    return {
      label: "Esgotado",
      type: "danger"
    };
  }


  if (estoque <= estoqueMinimo) {
    return {
      label: "Baixo",
      type: "warning"
    };
  }


  return {
    label: "Normal",
    type: "success"
  };

}


export function formatCurrency(value) {

  return value.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL"
    }
  );

}