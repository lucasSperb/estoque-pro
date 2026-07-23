import {
  FiBell,
  FiSearch,
  FiMenu,
} from "react-icons/fi";

import useLayoutStore from "../../../store/useLayoutStore";

import "./Header.css";

function Header() {
  const toggleCollapsed = useLayoutStore(
    (state) => state.toggleCollapsed
  );

  const toggleMobile = useLayoutStore(
    (state) => state.toggleMobile
  );

  const handleMenuClick = () => {
    if (window.innerWidth <= 900) {
      toggleMobile();
    } else {
      toggleCollapsed();
    }
  };

  return (
    <header className="header">
      <div className="header__left">
        <button
          className="header__menuButton"
          onClick={handleMenuClick}
        >
          <FiMenu />
        </button>

        <div className="header__search">
          <FiSearch />

          <input
            type="text"
            placeholder="Pesquisar..."
          />
        </div>
      </div>

      <div className="header__actions">
        <button className="header__notification">
          <FiBell />
        </button>

        <div className="header__profile">
          <div className="header__avatar">
            L
          </div>

          <div>
            <strong>Lucas</strong>
            <p>Administrador</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;