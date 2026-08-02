import { create } from 'zustand';

// Tenta recuperar do localStorage ou usa os valores padrão
const getInitialSettings = () => {
  const saved = localStorage.getItem('app_settings');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Erro ao ler configurações salvas:', e);
    }
  }
  return {
    profile: {
      companyName: 'Minha Empresa Ltda',
      email: 'admin@empresa.com',
      cnpj: '00.000.000/0001-00',
    },
    notifications: {
      lowStockAlert: true,
      minStockThreshold: 5,
      emailAlerts: false,
    },
    appearance: {
      theme: 'dark',
      compactView: false,
    },
  };
};

export const useSettingsStore = create((set, get) => {
  const initial = getInitialSettings();

  // Aplica o tema imediatamente ao carregar a store
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', initial.appearance.theme);
  }

  return {
    ...initial,

    // Ações
    updateProfile: (profileData) => {
      set((state) => {
        const updated = { ...state.profile, ...profileData };
        get().saveToStorage({ profile: updated });
        return { profile: updated };
      });
    },

    updateNotifications: (notifData) => {
      set((state) => {
        const updated = { ...state.notifications, ...notifData };
        get().saveToStorage({ notifications: updated });
        return { notifications: updated };
      });
    },

    updateAppearance: (appData) => {
      set((state) => {
        const updated = { ...state.appearance, ...appData };
        if (updated.theme) {
          document.documentElement.setAttribute('data-theme', updated.theme);
        }
        get().saveToStorage({ appearance: updated });
        return { appearance: updated };
      });
    },

    saveAllSettings: (allSettings) => {
      set(allSettings);
      localStorage.setItem('app_settings', JSON.stringify(allSettings));
      if (allSettings.appearance?.theme) {
        document.documentElement.setAttribute('data-theme', allSettings.appearance.theme);
      }
    },

    saveToStorage: (partial) => {
      const current = {
        profile: get().profile,
        notifications: get().notifications,
        appearance: get().appearance,
        ...partial,
      };
      localStorage.setItem('app_settings', JSON.stringify(current));
    },
  };
});

export default useSettingsStore;