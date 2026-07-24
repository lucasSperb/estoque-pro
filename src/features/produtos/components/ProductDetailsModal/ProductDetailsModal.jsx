import "./ProductDetailsModal.css";

import { FiX } from "react-icons/fi";

import { formatCurrency } from "../../utils/productHelpers";


function ProductDetailsModal({
  open,
  product,
  onClose,
}) {

  if (!open || !product) return null;


  return (
    <div className="productDetails__overlay">

      <div className="productDetails">


        <div className="productDetails__header">

          <div>

            <h2>
              Detalhes do Produto
            </h2>

            <p>
              Informações completas
            </p>

          </div>


          <button
            onClick={onClose}
          >

            <FiX />

          </button>


        </div>



        <div className="productDetails__body">


          <div className="productDetails__item">

            <span>
              Código
            </span>

            <strong>
              {product.codigo}
            </strong>

          </div>



          <div className="productDetails__item">

            <span>
              Produto
            </span>

            <strong>
              {product.nome}
            </strong>

          </div>



          <div className="productDetails__item">

            <span>
              Marca
            </span>

            <strong>
              {product.marca}
            </strong>

          </div>



          <div className="productDetails__item">

            <span>
              Categoria
            </span>

            <strong>
              {product.categoria}
            </strong>

          </div>



          <div className="productDetails__item">

            <span>
              Preço
            </span>

            <strong>
              {formatCurrency(
                Number(product.preco)
              )}
            </strong>

          </div>



          <div className="productDetails__item">

            <span>
              Estoque atual
            </span>

            <strong>
              {product.estoque} unidades
            </strong>

          </div>



          <div className="productDetails__item">

            <span>
              Estoque mínimo
            </span>

            <strong>
              {product.estoqueMinimo}
            </strong>

          </div>



          <div className="productDetails__item">

            <span>
              Status
            </span>

            <strong>
              {product.estoque > product.estoqueMinimo
                ? "Disponível"
                : "Estoque baixo"
              }
            </strong>

          </div>


        </div>


      </div>

    </div>
  );
}


export default ProductDetailsModal;