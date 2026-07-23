import { NavLink } from "react-router-dom";

import menu from "../../../constants/menu";
import useLayoutStore from "../../../store/useLayoutStore";

import "./Sidebar.css";

function Sidebar() {
    const sidebarOpen = useLayoutStore((state) => state.sidebarOpen);
    const collapsed = useLayoutStore((state) => state.collapsed);
    const mobileOpen = useLayoutStore((state) => state.mobileOpen);

    return (
            <aside
            className={`sidebar
                ${collapsed ? "sidebar--collapsed" : ""}
                ${mobileOpen ? "sidebar--mobile-open" : ""}
            `}
            >
            <div className="sidebar__logo">
                <div className="sidebar__logoIcon">
                    EP
                </div>

                <div>
                    <h2>Estoque Pro</h2>
                    <span>Controle Inteligente</span>
                </div>
            </div>

            <nav className="sidebar__nav">
                {menu.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `sidebar__item ${isActive ? "active" : ""}`
                            }
                        >
                            <span className="sidebar__icon">
                                <Icon />
                            </span>

                            <span>{item.title}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
}

export default Sidebar;