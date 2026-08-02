import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button/Button';
import Select from '../../../components/ui/Select/Select';
import useSettingsStore from '../../../store/useSettingsStore';
import { 
  FiUser, 
  FiBell, 
  FiMoon, 
  FiSave, 
  FiCheck,
  FiRefreshCw
} from 'react-icons/fi';

import '../styles/Configuracoes.css';

export function ConfiguracoesPage() {
  const { 
    profile: storedProfile, 
    notifications: storedNotifications, 
    appearance: storedAppearance,
    saveAllSettings 
  } = useSettingsStore();

  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState(storedProfile);
  const [notifications, setNotifications] = useState(storedNotifications);
  const [appearance, setAppearance] = useState(storedAppearance);

  useEffect(() => {
    setProfile(storedProfile);
    setNotifications(storedNotifications);
    setAppearance(storedAppearance);
  }, [storedProfile, storedNotifications, storedAppearance]);

  const themeOptions = [
    { value: 'dark', label: 'Escuro (Padrão)' },
    { value: 'light', label: 'Claro' },
  ];

  const handleSave = (e) => {
    if (e) e.preventDefault();
    saveAllSettings({ profile, notifications, appearance });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleThemeChange = (newTheme) => {
    setAppearance((prev) => ({ ...prev, theme: newTheme }));
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleReset = () => {
    const defaultSettings = {
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
    setProfile(defaultSettings.profile);
    setNotifications(defaultSettings.notifications);
    setAppearance(defaultSettings.appearance);
    saveAllSettings(defaultSettings);
  };

  return (
    <div className="configuracoes">
      <header className="configuracoes__header">
        <div>
          <h1>Configurações</h1>
          <p>Gerencie preferências do sistema, alertas e informações do perfil</p>
        </div>
        <div className="configuracoes__headerActions">
          <Button onClick={handleReset} variant="secondary">
            <FiRefreshCw /> Restaurar Padrões
          </Button>
          <Button onClick={handleSave} variant="primary">
            {saved ? <FiCheck /> : <FiSave />}
            {saved ? 'Salvo com sucesso!' : 'Salvar Alterações'}
          </Button>
        </div>
      </header>

      <form className="configuracoes__form" onSubmit={handleSave}>
        <section className="configCard">
          <div className="configCard__header">
            <FiUser className="configCard__icon" />
            <h2>Perfil da Empresa</h2>
          </div>
          <div className="configCard__body">
            <div className="configForm__group">
              <label>Nome da Empresa / Razão Social</label>
              <input
                type="text"
                className="configInput"
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                placeholder="Ex: Minha Empresa Ltda"
              />
            </div>
            <div className="configForm__grid">
              <div className="configForm__group">
                <label>E-mail de Contato</label>
                <input
                  type="email"
                  className="configInput"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="contato@empresa.com"
                />
              </div>
              <div className="configForm__group">
                <label>CNPJ / CPF</label>
                <input
                  type="text"
                  className="configInput"
                  value={profile.cnpj}
                  onChange={(e) => setProfile({ ...profile, cnpj: e.target.value })}
                  placeholder="00.000.000/0001-00"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="configCard">
          <div className="configCard__header">
            <FiBell className="configCard__icon" />
            <h2>Alertas & Notificações</h2>
          </div>
          <div className="configCard__body">
            <label className="configForm__toggle">
              <input
                type="checkbox"
                checked={notifications.lowStockAlert}
                onChange={(e) =>
                  setNotifications({ ...notifications, lowStockAlert: e.target.checked })
                }
              />
              <span>Ativar alertas visuais de Estoque Baixo</span>
            </label>

            {notifications.lowStockAlert && (
              <div className="configForm__group configForm__group--nested">
                <label>Limite padrão para considerar estoque baixo (unidades)</label>
                <input
                  type="number"
                  className="configInput configInput--sm"
                  value={notifications.minStockThreshold}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      minStockThreshold: Math.max(1, Number(e.target.value)),
                    })
                  }
                  min="1"
                />
              </div>
            )}

            <label className="configForm__toggle">
              <input
                type="checkbox"
                checked={notifications.emailAlerts}
                onChange={(e) =>
                  setNotifications({ ...notifications, emailAlerts: e.target.checked })
                }
              />
              <span>Receber relatórios semanais por e-mail</span>
            </label>
          </div>
        </section>

        <section className="configCard">
          <div className="configCard__header">
            <FiMoon className="configCard__icon" />
            <h2>Aparência & Interface</h2>
          </div>
          <div className="configCard__body">
            <div className="configForm__group">
              <label>Tema do Sistema</label>
              <div style={{ maxWidth: '300px' }}>
                <Select
                  options={themeOptions}
                  value={appearance.theme}
                  onChange={handleThemeChange}
                  placeholder="Selecione o tema"
                />
              </div>
            </div>

            <label className="configForm__toggle">
              <input
                type="checkbox"
                checked={appearance.compactView}
                onChange={(e) =>
                  setAppearance({ ...appearance, compactView: e.target.checked })
                }
              />
              <span>Modo de exibição compacto para tabelas</span>
            </label>
          </div>
        </section>
      </form>
    </div>
  );
}

export default ConfiguracoesPage;