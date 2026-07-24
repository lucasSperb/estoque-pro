import {
  FiEdit2,
  FiTrash2,
  FiEye,
} from "react-icons/fi";

import "./ProductTable.css";

import {
  getStockStatus,
  formatCurrency,
} from "../../utils/productHelpers";


function ProductTable({
  products = [],
  onEdit,
  onView,
  onDelete,
}) {


  if (products.length === 0) {

    return (

      <div className="productTable__empty">

        <h3>
          Nenhum produto encontrado
        </h3>

        <p>
          Tente alterar os filtros ou cadastre um novo produto.
        </p>

      </div>

    );

  }


  return (

    <div className="productTable">

      <table>

        <thead>

          <tr>

            <th>Código</th>

            <th>Produto</th>

            <th>Categoria</th>

            <th>Preço</th>

            <th>Estoque</th>

            <th>Status</th>

            <th>Ações</th>

          </tr>

        </thead>


        <tbody>


          {
            products.map((product) => {


              const status = getStockStatus(
                Number(product.estoque),
                Number(product.estoqueMinimo)
              );


              return (

                <tr key={product.id}>


                  <td data-label="Código">
                    {product.codigo}
                  </td>


                  <td data-label="Produto">

                    <div className="productTable__name">

                      <strong>
                        {product.nome}
                      </strong>

                      <span>
                        {product.marca}
                      </span>

                    </div>

                  </td>


                  <td data-label="Categoria">
                    {product.categoria}
                  </td>


                  <td data-label="Preço">

                    {formatCurrency(
                      Number(product.preco)
                    )}

                  </td>


                  <td data-label="Estoque">
                    {product.estoque}
                  </td>


                  <td data-label="Status">

                    <span
                      className={`status status--${status.type}`}
                    >

                      {status.label}

                    </span>

                  </td>


                  <td data-label="Ações">

                    <div className="productTable__actions">


                      <button
                        title="Visualizar"
                        onClick={() =>
                          onView?.(product)
                        }
                      >

                        <FiEye />

                      </button>



                      <button
                        title="Editar"
                        onClick={() =>
                          onEdit?.(product)
                        }
                      >

                        <FiEdit2 />

                      </button>



                      <button
                        className="danger"
                        title="Excluir"
                        onClick={() =>
                          onDelete?.(product)
                        }
                      >

                        <FiTrash2 />

                      </button>


                    </div>

                  </td>


                </tr>

              );


            })
          }


        </tbody>


      </table>


    </div>

  );

}


export default ProductTable;