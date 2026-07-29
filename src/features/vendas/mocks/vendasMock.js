export const vendasMock = [
  {
    id: 'v-101',
    clienteId: 'c-1',
    clienteNome: 'Maria Silva',
    data: '2026-07-28T14:30:00.000Z',
    itens: [
      {
        produtoId: 'p-1',
        produtoNome: 'Natura Essencial Masculino 100ml',
        quantidade: 1,
        precoUnitario: 189.9,
        subtotal: 189.9
      }
    ],
    desconto: 0,
    total: 189.9,
    formaPagamento: 'PIX',
    status: 'concluida',
    observacao: 'Cliente preferiu pagar via PIX'
  },
  {
    id: 'v-102',
    clienteId: 'c-2',
    clienteNome: 'João Oliveira',
    data: '2026-07-27T10:15:00.000Z',
    itens: [
      {
        produtoId: 'p-2',
        produtoNome: 'Batom Make B. Boticário Red',
        quantidade: 2,
        precoUnitario: 49.9,
        subtotal: 99.8
      }
    ],
    desconto: 9.8,
    total: 90.0,
    formaPagamento: 'Cartão de Crédito',
    status: 'concluida',
    observacao: ''
  }
];