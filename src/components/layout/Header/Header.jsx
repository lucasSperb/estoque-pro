import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiSearch,
  FiMenu,
  FiPackage,
  FiAlertCircle,
  FiLayout,
  FiShoppingCart,
  FiBarChart2,
  FiSettings,
  FiUsers,
  FiBox
} from "react-icons/fi";

import useLayoutStore from "../../../store/useLayoutStore";
import useProductStore from "../../../store/useProductStore";
import useSettingsStore from "../../../store/useSettingsStore";

import "./Header.css";

function Header() {
  const navigate = useNavigate();

  const toggleCollapsed = useLayoutStore((state) => state.toggleCollapsed);
  const toggleMobile = useLayoutStore((state) => state.toggleMobile);

  const products = useProductStore((state) => state.products) || [];
  const { profile, notifications: settingsNotifications } = useSettingsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Controle para ocultar o contador após a leitura
  const [hasUnread, setHasUnread] = useState(true);

  const searchRef = useRef(null);
  const notificationRef = useRef(null);

  const appNavigation = [
    { name: "Dashboard / Início", path: "/", icon: <FiLayout /> },
    { name: "Produtos", path: "/produtos", icon: <FiPackage /> },
    { name: "Controle de Estoque", path: "/estoque", icon: <FiBox /> },
    { name: "Ponto de Venda (PDV)", path: "/pdv", icon: <FiShoppingCart /> },
    { name: "Relatórios & Análises", path: "/relatorios", icon: <FiBarChart2 /> },
    { name: "Clientes", path: "/clientes", icon: <FiUsers /> },
    { name: "Configurações do Sistema", path: "/configuracoes", icon: <FiSettings /> },
  ];

  const minStock = settingsNotifications?.minStockThreshold || 5;
  const lowStockProducts = products.filter(
    (p) => Number(p.estoque ?? p.quantidade ?? 0) <= minStock
  );

  const query = searchQuery.trim().toLowerCase();

  const matchedPages = query
    ? appNavigation.filter((nav) => nav.name.toLowerCase().includes(query))
    : [];

  const matchedProducts = query
    ? products.filter(
        (p) =>
          p.nome?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
      )
    : [];

  const totalResults = matchedPages.length + matchedProducts.length;

  // Reativa a notificação não lida caso novas notificações surjam no estoque
  useEffect(() => {
    if (lowStockProducts.length > 0) {
      setHasUnread(true);
    }
  }, [lowStockProducts.length]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleNotifications = () => {
    setShowNotifications((prev) => {
      const nextState = !prev;
      if (nextState) {
        setHasUnread(false); // Oculta o contador de notificações ao abrir
      }
      return nextState;
    });
  };

  const handleMenuClick = () => {
    if (window.innerWidth <= 900) {
      toggleMobile();
    } else {
      toggleCollapsed();
    }
  };

  const handleSelectNavigation = (path) => {
    navigate(path);
    setSearchQuery("");
    setShowSearchDropdown(false);
  };

  const userName = profile?.companyName || "Lucas";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="header">
      <div className="header__left">
        <button
          type="button"
          className="header__menuButton"
          onClick={handleMenuClick}
        >
          <FiMenu />
        </button>

        <div className="header__search" ref={searchRef}>
          <FiSearch />
          <input
            type="text"
            placeholder="Pesquisar em todo o sistema..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
          />

          {showSearchDropdown && searchQuery.trim() && (
            <div className="header__searchDropdown">
              {totalResults > 0 ? (
                <>
                  {matchedPages.length > 0 && (
                    <div className="header__searchGroup">
                      <span className="header__searchGroupTitle">Navegação</span>
                      {matchedPages.map((nav) => (
                        <div
                          key={nav.path}
                          className="header__searchItem"
                          onClick={() => handleSelectNavigation(nav.path)}
                        >
                          <span className="header__searchItemIcon">{nav.icon}</span>
                          <div>
                            <strong>{nav.name}</strong>
                            <p>Ir para esta página</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchedProducts.length > 0 && (
                    <div className="header__searchGroup">
                      <span className="header__searchGroupTitle">Produtos</span>
                      {matchedProducts.map((product) => (
                        <div
                          key={product.id}
                          className="header__searchItem"
                          onClick={() => handleSelectNavigation("/estoque")}
                        >
                          <FiPackage className="header__searchItemIcon" />
                          <div>
                            <strong>{product.nome}</strong>
                            <p>
                              Estoque: {product.estoque ?? product.quantidade ?? 0} un | R${" "}
                              {Number(product.preco ?? product.price ?? 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="header__searchEmpty">
                  Nenhum resultado encontrado para "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="header__actions">
        <div className="header__notificationWrapper" ref={notificationRef}>
          <button
            type="button"
            className="header__notification"
            onClick={handleToggleNotifications}
          >
            <FiBell />
            {settingsNotifications?.lowStockAlert &&
              lowStockProducts.length > 0 &&
              hasUnread && (
                <span className="header__badge">{lowStockProducts.length}</span>
              )}
          </button>

          {showNotifications && (
            <div className="header__notificationDropdown">
              <div className="header__notificationHeader">
                <strong>Notificações</strong>
              </div>

              <div className="header__notificationList">
                {settingsNotifications?.lowStockAlert && lowStockProducts.length > 0 ? (
                  lowStockProducts.map((p) => (
                    <div key={p.id} className="header__notificationItem">
                      <FiAlertCircle className="header__notificationIcon" />
                      <div>
                        <strong>Estoque Baixo: {p.nome}</strong>
                        <p>
                          Apenas {p.estoque ?? p.quantidade ?? 0} unidades em estoque.
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="header__notificationEmpty">
                    Nenhum alerta de estoque no momento.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="header__profile">
          <div className="header__avatar">{userInitial}</div>
          <div>
            <strong>{userName}</strong>
            <p>Administrador</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;