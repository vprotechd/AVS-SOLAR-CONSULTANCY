import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiUserCheck,
  FiShoppingBag,
  FiClipboard,
  FiPhone,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import "./Admin.css";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("role");
    localStorage.removeItem("isAdmin");

  navigate("/", { replace: true });
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FiGrid />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <FiUsers />,
    },
    {
      name: "Our Team",
      path: "/admin/team",
      icon: <FiUserCheck />,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <FiShoppingBag />,
    },
    {
      name: "Contacts",
      path: "/admin/contacts",
      icon: <FiPhone />,
    },
  ];

  return (
    <div className="admin-wrapper">

      {/* MOBILE HEADER */}
      <header className="admin-mobile-header">
        <div className="admin-logo">
          AVS <span>SOLAR</span>
        </div>

        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          {sidebarOpen ? <FiX /> : <FiMenu />}
        </button>
      </header>

      {/* SIDEBAR */}
      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="admin-brand">
          <div className="brand-title">
            AVS
          </div>

          <div className="brand-subtitle">
            SOLAR CONSULTANCY
          </div>

          <div className="admin-badge">
            ADMIN PANEL
          </div>
        </div>

        <nav className="admin-navigation">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin/dashboard"}
              className={({ isActive }) =>
                `admin-nav-link ${
                  isActive ? "active" : ""
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">
                {item.icon}
              </span>

              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <button
            type="button"
            className="admin-logout"
            onClick={logout}
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}