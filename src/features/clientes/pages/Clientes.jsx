import { useState, useMemo } from "react";
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";

import Button from "../../../components/ui/Button/Button";
import ConfirmDialog from "../../../components/ui/ConfirmDialog/ConfirmDialog";
import useClientStore from "../../../store/useClientStore";

import ClientModal from "../components/ClientModal/ClientModal";
import "../styles/Clientes.css";

function Clientes() {
  const clients = useClientStore((state) => state.clients || []);
  const addClient = useClientStore((state) => state.addClient);
  const updateClient = useClientStore((state) => state.updateClient);
  const deleteClient = useClientStore((state) => state.deleteClient);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchName = (c.nome || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchEmail = (c.email || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchPhone = (c.telefone || "").includes(searchTerm);
      return matchName || matchEmail || matchPhone;
    });
  }, [clients, searchTerm]);

  function handleOpenCreate() {
    setSelectedClient(null);
    setModalOpen(true);
  }

  function handleOpenEdit(client) {
    setSelectedClient(client);
    setModalOpen(true);
  }

  function handleSave(clientData) {
    if (clientData.id) {
      updateClient(clientData);
    } else {
      addClient(clientData);
    }
  }

  function handleConfirmDelete() {
    if (clientToDelete) {
      deleteClient(clientToDelete.id);
      setClientToDelete(null);
    }
  }

  return (
    <div className="clientes">
      <div className="clientes__header">
        <div>
          <h1>Clientes</h1>
          <p>Gerencie sua carteira de clientes e dados de contato.</p>
        </div>

        <Button icon={<FiPlus />} onClick={handleOpenCreate}>
          Novo Cliente
        </Button>
      </div>

      <div className="clientes__filters">
        <div className="clientes__search">
          <FiSearch className="clientes__searchIcon" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredClients.length === 0 ? (
        <div className="clientes__empty">
          <h3>Nenhum cliente encontrado</h3>
          <p>
            {searchTerm
              ? "Tente ajustar os termos da pesquisa."
              : "Clique em 'Novo Cliente' para cadastrar seu primeiro cliente."}
          </p>
        </div>
      ) : (
        <div className="clientesTable">
          <div className="clientesTable__head">
            <div>Nome</div>
            <div>E-mail</div>
            <div>Telefone</div>
            <div>Localização</div>
            <div>Ações</div>
          </div>

          {filteredClients.map((client) => (
            <div key={client.id} className="clientesTable__row">
              <div data-label="Nome">
                <strong>{client.nome}</strong>
              </div>
              <div data-label="E-mail">{client.email || "-"}</div>
              <div data-label="Telefone">{client.telefone || "-"}</div>
              <div data-label="Localização">
                {client.cidade
                  ? `${client.cidade}${client.uf ? ` / ${client.uf}` : ""}`
                  : "-"}
              </div>
              <div data-label="Ações" className="clientesTable__actions">
                <button
                  type="button"
                  title="Editar"
                  onClick={() => handleOpenEdit(client)}
                >
                  <FiEdit2 />
                </button>
                <button
                  type="button"
                  className="delete"
                  title="Excluir"
                  onClick={() => setClientToDelete(client)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ClientModal
        open={modalOpen}
        client={selectedClient}
        onClose={() => {
          setModalOpen(false);
          setSelectedClient(null);
        }}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!clientToDelete}
        title="Excluir Cliente"
        message={`Deseja realmente excluir o cliente "${clientToDelete?.nome}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setClientToDelete(null)}
      />
    </div>
  );
}

export default Clientes;