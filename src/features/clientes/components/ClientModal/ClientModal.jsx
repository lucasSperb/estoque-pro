import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import Button from "../../../../components/ui/Button/Button";
import "./ClientModal.css";

function ClientModal({ open, client, onClose, onSave }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");

  useEffect(() => {
    if (!open) return;

    if (client) {
      setNome(client.nome || "");
      setEmail(client.email || "");
      setTelefone(client.telefone || "");
      setCidade(client.cidade || "");
      setUf(client.uf || "");
    } else {
      setNome("");
      setEmail("");
      setTelefone("");
      setCidade("");
      setUf("");
    }
  }, [open, client]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();

    if (!nome.trim()) return;

    onSave({
      ...(client ? { id: client.id } : {}),
      nome: nome.trim(),
      email: email.trim(),
      telefone: telefone.trim(),
      cidade: cidade.trim(),
      uf: uf.trim().toUpperCase(),
    });

    onClose();
  }

  return (
    <div className="clientModal__overlay">
      <div className="clientModal">
        <div className="clientModal__header">
          <h2>{client ? "Editar Cliente" : "Novo Cliente"}</h2>
          <button type="button" className="clientModal__close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="clientModal__body">
          <div className="clientModal__field">
            <label>Nome Completo *</label>
            <input
              type="text"
              placeholder="Digite o nome do cliente"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="clientModal__row">
            <div className="clientModal__field">
              <label>E-mail</label>
              <input
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="clientModal__field">
              <label>Telefone / WhatsApp</label>
              <input
                type="text"
                placeholder="(00) 00000-0000"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>
          </div>

          <div className="clientModal__row">
            <div className="clientModal__field">
              <label>Cidade</label>
              <input
                type="text"
                placeholder="Digite a cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
            </div>

            <div className="clientModal__field">
              <label>UF</label>
              <input
                type="text"
                maxLength="2"
                placeholder="Ex: SP"
                value={uf}
                onChange={(e) => setUf(e.target.value)}
              />
            </div>
          </div>

          <div className="clientModal__footer">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClientModal;