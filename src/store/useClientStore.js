import { create } from "zustand";
import { initialClients } from "../features/clientes/mocks/clientsMock";

const useClientStore = create((set, get) => ({
  clients: initialClients,

  addClient: (newClientData) => {
    const newClient = {
      id: `cli-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...newClientData,
    };

    set((state) => ({
      clients: [newClient, ...state.clients],
    }));

    return newClient;
  },

  updateClient: (updatedData) => {
    set((state) => ({
      clients: state.clients.map((client) =>
        String(client.id) === String(updatedData.id)
          ? { ...client, ...updatedData }
          : client
      ),
    }));
  },

  deleteClient: (id) => {
    set((state) => ({
      clients: state.clients.filter((c) => String(c.id) !== String(id)),
    }));
  },

  getClientById: (id) => {
    return get().clients.find((c) => String(c.id) === String(id));
  },
}));

export default useClientStore;