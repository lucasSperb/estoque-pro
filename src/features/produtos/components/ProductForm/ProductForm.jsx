import { useEffect, useState } from "react";
import { FiX, FiSave } from "react-icons/fi";
import Input from "@/components/ui/Input/Input";
import Select from "@/components/ui/Select/Select";
import Button from "@/components/ui/Button/Button";

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

const categoriaOptions = [
  { label: "Perfumes", value: "Perfumes" },
  { label: "Cabelos", value: "Cabelos" },
  { label: "Hidratantes", value: "Hidratantes" },
  { label: "Banho", value: "Banho" },
];

function ProductForm({ open, onClose, onSave, product }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (!open) return;

    if (product) {
      setForm({
        ...initialState,
        ...product,
      });
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

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((old) => ({
      ...old,
      [name]: value,
    }));
  }

  function handleSelectChange(fieldName, value) {
    setForm((old) => ({
      ...old,
      [fieldName]: value,
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

    // Garante a conversão dos campos numéricos para número
    const formattedData = {
      ...form,
      custo: Number(form.custo || 0),
      preco: Number(form.preco || 0),
      estoque: Number(form.estoque || 0),
      estoqueMinimo: Number(form.estoqueMinimo || 0),
    };

    onSave(formattedData);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="productForm__overlay" onClick={onClose}>
      <div className="productForm" onClick={(e) => e.stopPropagation()}>
        <div className="productForm__header">
          <h2>{product ? "Editar Produto" : "Novo Produto"}</h2>

          <button type="button" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="productForm__grid">
            <Input
              label="Código *"
              required
              name="codigo"
              value={form.codigo}
              onChange={handleChange}
            />

            <Input
              label="Nome *"
              required
              name="nome"
              value={form.nome}
              onChange={handleChange}
            />

            <div>
              <label>Categoria *</label>
              <Select
                options={categoriaOptions}
                value={form.categoria}
                placeholder="Selecione"
                onChange={(val) => handleSelectChange("categoria", val)}
              />
            </div>

            <Input
              label="Marca"
              name="marca"
              value={form.marca}
              onChange={handleChange}
            />

            <Input
              label="Custo (R$)"
              type="number"
              step="0.01"
              name="custo"
              value={form.custo}
              onChange={handleChange}
            />

            <Input
              label="Preço (R$) *"
              required
              type="number"
              step="0.01"
              name="preco"
              value={form.preco}
              onChange={handleChange}
            />

            <Input
              label="Estoque"
              type="number"
              name="estoque"
              value={form.estoque}
              onChange={handleChange}
            />

            <Input
              label="Estoque mínimo"
              type="number"
              name="estoqueMinimo"
              value={form.estoqueMinimo}
              onChange={handleChange}
            />
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
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>

            <Button type="submit">
              <FiSave />
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;