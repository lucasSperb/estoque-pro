
export function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(date) {
  if (!date) return "-";

  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ==========================
// ESTOQUE
// ==========================

export function getStockStatus(stock, minimum) {
  stock = Number(stock);
  minimum = Number(minimum);

  if (stock <= 0) {
    return {
      label: "Sem estoque",
      type: "danger",
    };
  }

  if (stock <= minimum) {
    return {
      label: "Estoque baixo",
      type: "warning",
    };
  }

  return {
    label: "Disponível",
    type: "success",
  };
}

// ==========================
// MOVIMENTAÇÕES
// ==========================

export function getMovementType(type) {
  switch (type) {
    case "entrada":
      return {
        label: "Entrada",
        color: "success",
      };

    case "saida":
      return {
        label: "Saída",
        color: "danger",
      };

    case "ajuste":
      return {
        label: "Ajuste",
        color: "warning",
      };

    default:
      return {
        label: "Desconhecido",
        color: "default",
      };
  }
}

// ==========================
// RESUMO
// ==========================

export function calculateTotalItems(products) {
  return products.reduce(
    (total, product) => total + Number(product.estoque || 0),
    0
  );
}

export function calculateInventoryValue(products) {
  return products.reduce(
    (total, product) =>
      total +
      Number(product.preco || 0) *
        Number(product.estoque || 0),
    0
  );
}

export function countLowStock(products) {
  return products.filter(
    (product) =>
      Number(product.estoque) <=
      Number(product.estoqueMinimo)
  ).length;
}

export function countOutOfStock(products) {
  return products.filter(
    (product) => Number(product.estoque) === 0
  ).length;
}

// ==========================
// FILTROS
// ==========================

export function filterProducts(
  products,
  search = "",
  category = ""
) {
  const text = search.trim().toLowerCase();

  return products.filter((product) => {
    const matchesSearch =
      text === "" ||
      product.nome?.toLowerCase().includes(text) ||
      product.codigo?.toLowerCase().includes(text) ||
      product.marca?.toLowerCase().includes(text);

    const matchesCategory =
      category === "" ||
      product.categoria === category;

    return matchesSearch && matchesCategory;
  });
}

// ==========================
// ORDENAÇÃO
// ==========================

export function sortProducts(products, field, order = "asc") {
  return [...products].sort((a, b) => {
    let valueA = a[field];
    let valueB = b[field];

    if (typeof valueA === "string") {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA < valueB)
      return order === "asc" ? -1 : 1;

    if (valueA > valueB)
      return order === "asc" ? 1 : -1;

    return 0;
  });
}