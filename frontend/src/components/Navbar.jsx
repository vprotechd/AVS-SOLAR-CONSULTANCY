import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/imagesss.png";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";
import { Briefcase, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // =========================================================
  // CHECK ADMIN LOGIN
  // =========================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    let user = {};

    try {
      user = JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      user = {};
    }

    if (token && user?.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  // =========================================================
  // SCROLL EFFECT
  // =========================================================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =========================================================
  // BODY SCROLL WHEN MOBILE MENU OPEN
  // =========================================================

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("menu-open");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    }

    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  // =========================================================
  // CLOSE MOBILE MENU
  // =========================================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsAdmin(false);
    setMenuOpen(false);

    window.location.href = "/";
  };

  // =========================================================
  // USER
  // =========================================================

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  const isSuperAdmin =
    user?.role === "superadmin" ||
    user?.role === "admin";

  return (
    <>
      {/* =====================================================
          NAVBAR
          ===================================================== */}

      <nav className={`main-navbar ${scrolled ? "scrolled" : ""}`}>

        <div className="navbar-container">

          {/* =================================================
              LOGO
              ================================================= */}

          <Link
            to="/"
            className="navbar-logo"
            onClick={closeMenu}
          >
            <img
              src={logo}
              alt="VProTech Digital"
            />
          </Link>


          {/* =================================================
              DESKTOP NAVIGATION
              ================================================= */}

          <ul
            className={`nav-links ${
              menuOpen ? "active" : ""
            }`}
          >

            {/* =================================================
                ADMIN LINKS
                ================================================= */}

            {isSuperAdmin && (
              <>
                <li className="admin-nav-item">
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `nav-link ${
                        isActive ? "active" : ""
                      }`
                    }
                    onClick={closeMenu}
                  >
                    AdminDashboard
                  </NavLink>
                </li>

                <li className="admin-nav-item">
                  <NavLink
                    to="/admin/add-blog"
                    className={({ isActive }) =>
                      `nav-link ${
                        isActive ? "active" : ""
                      }`
                    }
                    onClick={closeMenu}
                  >
                    Add Blog
                  </NavLink>
                </li>

                <li className="admin-nav-item">
                  <NavLink
                    to="/admin/jobs"
                    className={({ isActive }) =>
                      `nav-link admin-job-link ${
                        isActive ? "active" : ""
                      }`
                    }
                    onClick={closeMenu}
                  >
                    <Briefcase size={16} />
                    <span>Manage Jobs</span>
                  </NavLink>
                </li>
              </>
            )}


            {/* =================================================
                REGISTER INTERNSHIP
                ================================================= */}

            <li>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `nav-link internship-link ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={closeMenu}
              >
                Register For Internship
              </NavLink>
            </li>


            {/* =================================================
                HOME
                ================================================= */}

            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={closeMenu}
              >
                Home
              </NavLink>
            </li>


            {/* =================================================
                ABOUT
                ================================================= */}

            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `nav-link ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={closeMenu}
              >
                About
              </NavLink>
            </li>


            {/* =================================================
                SERVICES
                ================================================= */}

            <li>
              <NavLink
                to="/services"
                className={({ isActive }) =>
                  `nav-link ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={closeMenu}
              >
                Services
              </NavLink>
            </li>


            {/* =================================================
                BLOGS
                ================================================= */}

            <li>
              <NavLink
                to="/blogs"
                className={({ isActive }) =>
                  `nav-link ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={closeMenu}
              >
                Blogs
              </NavLink>
            </li>


            {/* =================================================
                CAREERS
                ================================================= */}

            <li>
              <NavLink
                to="/careers"
                className={({ isActive }) =>
                  `nav-link ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={closeMenu}
              >
                Careers
              </NavLink>
            </li>


            {/* =================================================
                CONTACT
                ================================================= */}

            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `nav-link ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={closeMenu}
              >
                Contact
              </NavLink>
            </li>


            {/* =================================================
                MOBILE ONLY BUTTONS
                ================================================= */}

            <li className="mobile-only-actions">

              <button
                type="button"
                className="mobile-search-button"
              >
                <FiSearch size={18} />
                <span>Search</span>
              </button>

              <Link
                to="/contact"
                className="mobile-start-button"
                onClick={closeMenu}
              >
                <span>Get Started</span>
                <ArrowUpRight size={17} />
              </Link>

            </li>


            {/* =================================================
                LOGOUT
                ================================================= */}

            {isSuperAdmin && (
              <li className="logout-wrapper">

                <button
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  Logout
                </button>

              </li>
            )}

          </ul>


          {/* =================================================
              RIGHT SIDE DESKTOP ACTIONS
              ================================================= */}

          <div className="navbar-actions">

           


            {/* GET STARTED */}

            <Link
              to="/contact"
              className="get-started-button"
            >
              <span>Get Started</span>

              <ArrowUpRight size={17} />
            </Link>


            {/* MOBILE MENU */}

            <button
              type="button"
              className="mobile-menu-icon"
              onClick={() =>
                setMenuOpen((prev) => !prev)
              }
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? (
                <FiX size={25} />
              ) : (
                <FiMenu size={25} />
              )}
            </button>

          </div>

        </div>

      </nav>


      {/* =====================================================
          MOBILE OVERLAY
          ===================================================== */}

      <div
        className={`mobile-overlay ${
          menuOpen ? "show" : ""
        }`}
        onClick={closeMenu}
      />

    </>
  );
}