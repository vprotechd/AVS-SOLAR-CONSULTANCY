import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import ScrollToTop from "./components/ScrollToTop";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import Services from "./pages/Services";
import Learn from "./pages/Learn";
import Team from "./pages/Team";
import Store from "./pages/Store";
import ProductDetails from "./pages/ProductDetails";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SolarPanels from "./pages/SolarPanels";
import Sitesurvey from "./pages/Sitesurvey";
import Custom from "./pages/Custom";
import Quotation from "./pages/Quotation";
import Installation from "./pages/installation";
import NetMetering from "./pages/Net";
import After from "./pages/After";
import SolarPanelProduct from "./pages/SolarPanelProduct";
import Checkout from "./pages/Checkout";
import Mounting from "./pages/Mounting";
import Monitoring from "./pages/Monitoring";
import EmailVerified from "./pages/EmailVerified";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminContacts from "./pages/admin/AdminContacts";

import ConsultationDetails from "./pages/ConsultationDetails";
import SiteSurveyDetails from "./pages/SiteSurveyDetails";
import SolarDesignDetails from "./pages/SolarDesignDetails";
import QuotationDetails from "./pages/QuotationDetails";
import InstallationDetails from "./pages/InstallationDetails";
import NetMeteringDetails from "./pages/NetMeteringDetails";
import AfterSalesDetails from "./pages/AfterSalesDetails";
import Contact from "./pages/Contact";


// =====================================================
// GET USER FROM JWT
// =====================================================

const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  localStorage.removeItem("userRole");
  localStorage.removeItem("role");
  localStorage.removeItem("isAdmin");
};

const getUserFromToken = (token) => {
  if (!token || typeof token !== "string") {
    return null;
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return null;
  }

  try {
    const payload = JSON.parse(
      atob(
        parts[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/")
      )
    );

    return payload;
  } catch (error) {
    console.error(
      "Failed to decode JWT:",
      error
    );

    return null;
  }
};


// =====================================================
// APP
// =====================================================

function App() {

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );


  

  // ---------------------------------------------------
  // GET USER
  // ---------------------------------------------------

  const getStoredUser = () => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error(
        "Invalid stored user:",
        error
      );
    }

    return null;
  };


  const storedUser = getStoredUser();

  // JWT is the fallback/source for role
  const jwtUser = getUserFromToken(token);

  const user = {
    ...(storedUser || {}),
    ...(jwtUser || {}),
  };


  // ---------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------

  const logout = () => {
    clearAuthStorage();
    setToken("");

    window.location.href = "/login";
  };


  // ---------------------------------------------------
  // ADMIN CHECK
  // ---------------------------------------------------

  const isAdmin =
    Boolean(token) &&
    user?.role === "admin";

  if (token && !getUserFromToken(token)) {
    clearAuthStorage();
    setToken("");
  }

  console.log(
    "AUTH:",
    {
      tokenExists: Boolean(token),
      storedUser,
      jwtUser,
      role: user?.role,
      isAdmin,
    }
  );


  return (
    <BrowserRouter>

      <ScrollToTop />

     <ToastContainer
  position="top-right"
  autoClose={3000}
  newestOnTop
  closeOnClick
  pauseOnHover
  draggable
  theme="light"
  style={{
    top: "85px",
    right: "20px",
    zIndex: 999999,
  }}
/>


      <Routes>

        {/* =================================================
            LOGIN
        ================================================= */}

        <Route
          path="/login"
          element={
            <Login
              setToken={setToken}
            />
          }
        />


        {/* =================================================
            HOME
        ================================================= */}

        <Route
          path="/"
          element={
            <Home
              token={token}
              logout={logout}
            />
          }
        />


        {/* =================================================
            ABOUT
        ================================================= */}

        <Route
          path="/about"
          element={
            <About
              token={token}
              logout={logout}
            />
          }
        />




        <Route
  path="/solar-journey/consultation"
  element={<ConsultationDetails />}
/>

<Route
  path="/solar-journey/site-survey"
  element={<SiteSurveyDetails />}
/>

<Route
  path="/solar-journey/custom-design"
  element={<SolarDesignDetails />}
/>

<Route
  path="/solar-journey/quotation"
  element={<QuotationDetails />}
/>

<Route
  path="/solar-journey/installation"
  element={<InstallationDetails />}
/>

<Route
  path="/solar-journey/net-metering"
  element={<NetMeteringDetails />}
/>

<Route
  path="/solar-journey/after-sales"
  element={<AfterSalesDetails />}
/>


<Route path="/contact" element={<Contact />} />

        {/* =================================================
            SERVICES
        ================================================= */}

        <Route
          path="/services"
          element={
            <Services
              token={token}
              logout={logout}
            />
          }
        />


        {/* =================================================
            LEARN
        ================================================= */}

        <Route
          path="/learn"
          element={
            <Learn
              token={token}
              logout={logout}
            />
          }
        />


        {/* =================================================
            MOUNTING
        ================================================= */}

        <Route
          path="/mounting"
          element={
            <Mounting
              token={token}
              logout={logout}
            />
          }
        />


        {/* =================================================
            EMAIL VERIFIED
        ================================================= */}

        <Route
          path="/email-verified"
          element={
            <EmailVerified />
          }
        />


        {/* =================================================
            TEAM
        ================================================= */}

        <Route
          path="/team"
          element={
            <Team />
          }
        />


        {/* =================================================
            STORE
        ================================================= */}

        <Route
          path="/store"
          element={
            <Store />
          }
        />

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />


        {/* =================================================
            SOLAR PANELS
        ================================================= */}

        <Route
          path="/solar-panels"
          element={
            <SolarPanels />
          }
        />


        {/* =================================================
            SITE SURVEY
        ================================================= */}

        <Route
          path="/site-survey"
          element={
            <Sitesurvey />
          }
        />


        {/* =================================================
            CUSTOM
        ================================================= */}

        <Route
          path="/custom"
          element={
            <Custom />
          }
        />


        {/* =================================================
            QUOTATION
        ================================================= */}

        <Route
          path="/quotation"
          element={
            <Quotation />
          }
        />


        {/* =================================================
            INSTALLATION
        ================================================= */}

        <Route
          path="/installation"
          element={
            <Installation />
          }
        />


        {/* =================================================
            NET METERING
        ================================================= */}

        <Route
          path="/netmetering"
          element={
            <NetMetering />
          }
        />


        {/* =================================================
            AFTER SUPPORT
        ================================================= */}

        <Route
          path="/after-support"
          element={
            <After />
          }
        />


        {/* =================================================
            SOLAR PANEL PRODUCT
        ================================================= */}

        <Route
          path="/solar-panel-product"
          element={
            <SolarPanelProduct />
          }
        />


        {/* =================================================
            CHECKOUT
        ================================================= */}

        <Route
          path="/checkout"
          element={
            <Checkout />
          }
        />


        {/* =================================================
            MONITORING
        ================================================= */}

        <Route
          path="/monitoring"
          element={
            <Monitoring
              token={token}
              logout={logout}
            />
          }
        />


        {/* =================================================
            FORGOT PASSWORD
        ================================================= */}

        <Route
          path="/forgot-password"
          element={
            <ForgotPassword />
          }
        />


        {/* =================================================
            RESET PASSWORD
        ================================================= */}

        <Route
          path="/reset-password/:token"
          element={
            <ResetPassword />
          }
        />


        {/* =================================================
            ADMIN
        ================================================= */}

{/* =================================================
    ADMIN PANEL
================================================= */}

<Route
  path="/admin"
  element={
    token && user?.role === "admin" ? (
      <AdminLayout />
    ) : (
      <Navigate to="/login" replace />
    )
  }
>
  {/* /admin → /admin/dashboard */}
  <Route
    index
    element={
      <Navigate
        to="/admin/dashboard"
        replace
      />
    }
  />

  {/* /admin/dashboard */}
  <Route
    path="dashboard"
    element={<AdminDashboard />}
  />

  {/* Admin users */}
  <Route
    path="users"
    element={<AdminUsers />}
  />

  <Route
    path="team"
    element={<AdminTeam />}
  />

  <Route
    path="products"
    element={<AdminProducts />}
  />

  <Route
    path="contacts"
    element={<AdminContacts />}
  />

  <Route
    path="orders"
    element={<div>Orders Page</div>}
  />
</Route>

        {/* =================================================
            UNKNOWN ROUTES
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;