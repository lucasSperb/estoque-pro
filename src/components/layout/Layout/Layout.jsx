import { Outlet } from "react-router-dom";

import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

import useLayoutStore from "../../../store/useLayoutStore";

import "./Layout.css";

function Layout() {
  const collapsed = useLayoutStore((state) => state.collapsed);

  const mobileOpen = useLayoutStore((state) => state.mobileOpen);

  const closeMobile = useLayoutStore((state) => state.closeMobile);

  return (
    <div className="layout">
      <Sidebar />

      {mobileOpen && (
        <div
          className="layout__overlay"
          onClick={closeMobile}
        />
      )}

      <div
        className={`layout__content ${
          collapsed
            ? "layout__content--collapsed"
            : "layout__content--expanded"
        }`}
      >
        <Header />

        <main className="layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;