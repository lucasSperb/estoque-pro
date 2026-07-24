import { useEffect, useState } from "react";
import {
  FiX,
  FiSave,
} from "react-icons/fi";

import "./ProductForm.css";

const initialState = {
  codigo: "",
  nome: "",
  categoria: "",
  marca: "",
  custo: "",
  preco: "",
  estoque: "",
  estoqueMinimo: "",
  descricao: "",
  imagem: "",
};

function ProductForm({
  open,
  onClose,
  onSave,
  product,
}) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (!open) return;

    if (product) {
      setForm(product);
    } else {
      setForm(initialState);
    }
  }, [product, open]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [open, onClose]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((old) => ({
      ...old,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.codigo.trim()) {
      alert("Informe o código do produto.");
      return;
    }

    if (!form.nome.trim()) {
      alert("Informe o nome do produto.");
      return;
    }

    if (!form.categoria) {
      alert("Selecione uma categoria.");
      return;
    }

    if (Number(form.preco) <= 0) {
      alert("Informe um preço válido.");
      return;
    }

    onSave({
      ...form,
      custo: Number(form.custo),
      preco: Number(form.preco),
      estoque: Number(form.estoque),
      estoqueMinimo: Number(form.estoqueMinimo),
    });
  }

  if (!open) return null;

  return (
    <div
      className="productForm__overlay"
      onClick={onClose}
    >
      <div
        className="productForm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="productForm__header">
          <h2>
            {product
              ? "Editar Produto"
              : "Novo Produto"}
          </h2>

          <button
            type="button"
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="productForm__grid">

            <div>
              <label>Código</label>

              <input
                required
                name="codigo"
                value={form.codigo}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Nome</label>

              <input
                required
                name="nome"
                value={form.nome}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Categoria</label>

              <select
                required
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
              >
                <option value="">
                  Selecione
                </option>

                <option value="Perfumes">
                  Perfumes
                </option>

                <option value="Cabelos">
                  Cabelos
                </option>

                <option value="Hidratantes">
                  Hidratantes
                </option>

                <option value="Banho">
                  Banho
                </option>
              </select>
            </div>

            <div>
              <label>Marca</label>

              <input
                name="marca"
                value={form.marca}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Custo</label>

              <input
                type="number"
                step="0.01"
                name="custo"
                value={form.custo}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Preço</label>

              <input
                required
                type="number"
                step="0.01"
                name="preco"
                value={form.preco}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Estoque</label>

              <input
                type="number"
                name="estoque"
                value={form.estoque}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Estoque mínimo</label>

              <input
                type="number"
                name="estoqueMinimo"
                value={form.estoqueMinimo}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="productForm__textarea">
            <label>Descrição</label>

            <textarea
              rows="5"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
            />
          </div>

          <div className="productForm__footer">

            <button
              type="button"
              className="secondary"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="primary"
            >
              <FiSave />
              Salvar
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;