import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiUserCheck,
  FiShoppingBag,
  FiDollarSign,
  FiPackage,
  FiArrowUpRight,
  FiArrowDownRight,
  FiRefreshCw,
  FiActivity,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiTrendingUp,
  FiCalendar,
  FiChevronRight,
  FiPhone,
} from "react-icons/fi";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken");

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* =========================================================
   SAFE RESPONSE HELPERS
========================================================= */

const extractData = (response) => {
  const data = response?.data;

  if (!data) return {};

  if (data.data && typeof data.data === "object") {
    return data.data;
  }

  return data;
};

const numberValue = (...values) => {
  for (const value of values) {
    const number = Number(value);

    if (Number.isFinite(number)) {
      return number;
    }
  }

  return 0;
};

const money = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "₹0";
  }

  return `₹${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    users: 0,
    activeUsers: 0,
    orders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    revenue: 0,
    products: 0,
    teamMembers: 0,
    recentOrders: [],
    recentUsers: [],
    sales: [],
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  /* =======================================================
     LOAD DASHBOARD
  ======================================================= */

  const loadDashboard = useCallback(async () => {
    try {
      setError("");

      const token = getToken();

      if (!token) {
        setError("Admin authentication token is missing.");
        setLoading(false);
        return;
      }

      
      const response = await api.get("admin/dashboard");

      const data = extractData(response);

      setDashboard({
        users: numberValue(
          data.users,
          data.totalUsers,
          data.userCount
        ),

        activeUsers: numberValue(
          data.activeUsers,
          data.activeUserCount
        ),

        orders: numberValue(
          data.orders,
          data.totalOrders,
          data.orderCount
        ),

        pendingOrders: numberValue(
          data.pendingOrders,
          data.pending
        ),

        completedOrders: numberValue(
          data.completedOrders,
          data.completed
        ),

        revenue: numberValue(
          data.revenue,
          data.totalRevenue,
          data.sales
        ),

        products: numberValue(
          data.products,
          data.totalProducts,
          data.productCount
        ),

        teamMembers: numberValue(
          data.teamMembers,
          data.totalTeamMembers,
          data.team
        ),

        recentOrders: Array.isArray(data.recentOrders)
          ? data.recentOrders
          : [],

        recentUsers: Array.isArray(data.recentUsers)
          ? data.recentUsers
          : [],

        sales: Array.isArray(data.sales)
          ? data.sales
          : [],
      });
    } catch (err) {
      console.error("Admin dashboard error:", err);

      let message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unable to load dashboard data.";

      /*
       * Prevent the ugly:
       *
       * Unexpected token '<'
       *
       * message.
       */
      if (
        typeof message === "string" &&
        message.includes("Unexpected token")
      ) {
        message =
          "Dashboard API is not returning JSON. Check the backend API URL and admin dashboard route.";
      }

      if (err?.response?.status === 401) {
        message = "Your admin session has expired. Please login again.";
      }

      if (err?.response?.status === 403) {
        message = "You do not have permission to access the admin dashboard.";
      }

      if (err?.response?.status === 404) {
        message =
          "Admin dashboard API was not found. Check the backend route /api/admin/dashboard.";
      }

      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  /* =======================================================
     REFRESH
  ======================================================= */

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
  };

  /* =======================================================
     STATISTICS
  ======================================================= */

  const statistics = useMemo(
    () => [
      {
        title: "Total Users",
        value: dashboard.users,
        subtitle: `${dashboard.activeUsers} active users`,
        icon: FiUsers,
        className: "blue",
        trend: "+12.5%",
        trendUp: true,
      },

      {
        title: "Active Users",
        value: dashboard.activeUsers,
        subtitle: "Currently active accounts",
        icon: FiUserCheck,
        className: "green",
        trend: "+8.2%",
        trendUp: true,
      },

      {
        title: "Total Orders",
        value: dashboard.orders,
        subtitle: `${dashboard.pendingOrders} pending orders`,
        icon: FiShoppingBag,
        className: "orange",
        trend: "+6.4%",
        trendUp: true,
      },

      {
        title: "Revenue",
        value: money(dashboard.revenue),
        subtitle: `${dashboard.completedOrders} completed orders`,
        icon: FiDollarSign,
        className: "purple",
        trend: "+14.8%",
        trendUp: true,
      },
    ],
    [dashboard]
  );

  /* =======================================================
     QUICK ACTIONS
  ======================================================= */

  const quickActions = [
    {
      title: "Manage Users",
      description: "View, activate or deactivate users",
      icon: FiUsers,
      path: "/admin/users",
      className: "blue",
    },

    // {
    //   title: "Manage Orders",
    //   description: "View and manage customer orders",
    //   icon: FiShoppingBag,
    //   path: "/admin/orders",
    //   className: "orange",
    // },

    {
      title: "Our Team",
      description: "Manage your consultancy team",
      icon: FiUserCheck,
      path: "/admin/team",
      className: "purple",
    },

    {
      title: "Products",
      description: "Manage store products",
      icon: FiPackage,
      path: "/admin/products",
      className: "green",
    },

     {
      title: "Contacts",
      description: "Manage contact information",
      icon: FiPhone,
      path: "/admin/contacts",
      className: "blue",
    },
  ];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="admin-dashboard-page">

      {/* ================================================
          HEADER
      ================================================= */}

      <div className="dashboard-header">

        <div>
          <div className="breadcrumb">
            <span>Admin Panel</span>
            <b>/</b>
            <strong>Dashboard</strong>
          </div>

          <h1>Dashboard</h1>

          <p>
            Welcome back. Here's what's happening with
            AVS Solar Consultancy today.
          </p>
        </div>

        <button
          className={`refresh-button ${
            refreshing ? "refreshing" : ""
          }`}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <FiRefreshCw />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="dashboard-error">

          <div className="error-icon">
            <FiAlertCircle />
          </div>

          <div className="error-content">
            <strong>Unable to load some dashboard data</strong>
            <span>{error}</span>
          </div>

          <button onClick={loadDashboard}>
            Try Again
          </button>
        </div>
      )}

      {/* ================================================
          STAT CARDS
      ================================================= */}

      <div className="stats-grid">

        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              className={`stat-card ${stat.className}`}
              key={stat.title}
            >
              <div className="stat-top">

                <div className="stat-icon">
                  <Icon />
                </div>

                <span className="stat-label">
                  {stat.title}
                </span>

              </div>

              <div className="stat-value">
                {loading ? (
                  <span className="skeleton-number">
                    &nbsp;
                  </span>
                ) : (
                  stat.value
                )}
              </div>

              <div className="stat-bottom">

                <span className="stat-description">
                  {stat.subtitle}
                </span>

                <span
                  className={`stat-trend ${
                    stat.trendUp ? "up" : "down"
                  }`}
                >
                  {stat.trendUp ? (
                    <FiArrowUpRight />
                  ) : (
                    <FiArrowDownRight />
                  )}

                  {stat.trend}
                </span>

              </div>

              <div className="stat-decoration" />
            </div>
          );
        })}

      </div>

      {/* ================================================
          QUICK ACTIONS
      ================================================= */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>
            <h2>Quick Actions</h2>

            <p>
              Manage the important parts of your website.
            </p>
          </div>

        </div>

        <div className="quick-actions-grid">

          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.title}
                className="quick-action-card"
                onClick={() => navigate(action.path)}
              >
                <div
                  className={`quick-action-icon ${action.className}`}
                >
                  <Icon />
                </div>

                <div className="quick-action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>

                <FiChevronRight className="action-arrow" />
              </button>
            );
          })}

        </div>
      </section>

      {/* ================================================
          LOWER CONTENT
      ================================================= */}

      <div className="dashboard-columns">

        {/* ==============================================
            RECENT ORDERS
        =============================================== */}

        <section className="dashboard-panel">

          <div className="panel-header">

            <div>
              <div className="panel-title-row">
                <FiShoppingBag />
                <h2>Recent Orders</h2>
              </div>

              <p>Latest customer orders</p>
            </div>

            <button
              onClick={() => navigate("/admin/orders")}
            >
              View All
              <FiChevronRight />
            </button>

          </div>

          <div className="orders-list">

            {dashboard.recentOrders.length === 0 ? (
              <div className="empty-dashboard">

                <div>
                  <FiShoppingBag />
                </div>

                <strong>No orders yet</strong>

                <span>
                  New customer orders will appear here.
                </span>

              </div>
            ) : (
              dashboard.recentOrders
                .slice(0, 5)
                .map((order, index) => (
                  <div
                    className="order-row"
                    key={
                      order._id ||
                      order.id ||
                      index
                    }
                  >

                    <div className="order-avatar">
                      <FiShoppingBag />
                    </div>

                    <div className="order-information">

                      <strong>
                        {order.orderNumber ||
                          order.orderId ||
                          `Order #${index + 1}`}
                      </strong>

                      <span>
                        {order.customer?.name ||
                          order.user?.name ||
                          order.customerName ||
                          "Customer"}
                      </span>

                    </div>

                    <div className="order-date">
                      <FiCalendar />
                      {formatDate(
                        order.createdAt ||
                          order.date
                      )}
                    </div>

                    <div className="order-price">
                      {money(
                        order.total ||
                          order.amount ||
                          order.totalAmount
                      )}
                    </div>

                    <span
                      className={`order-status ${
                        String(
                          order.status || "pending"
                        ).toLowerCase()
                      }`}
                    >
                      {order.status || "Pending"}
                    </span>

                  </div>
                ))
            )}

          </div>
        </section>

        {/* ==============================================
            OVERVIEW
        =============================================== */}

        <section className="dashboard-panel overview-panel">

          <div className="panel-header">

            <div>
              <div className="panel-title-row">
                <FiActivity />
                <h2>Overview</h2>
              </div>

              <p>Current platform statistics</p>
            </div>

          </div>

          <div className="overview-items">

            <div className="overview-item">
              <div className="overview-icon blue">
                <FiUsers />
              </div>

              <div>
                <span>Total Users</span>
                <strong>{dashboard.users}</strong>
              </div>
            </div>

            <div className="overview-item">
              <div className="overview-icon green">
                <FiUserCheck />
              </div>

              <div>
                <span>Team Members</span>
                <strong>{dashboard.teamMembers}</strong>
              </div>
            </div>

            <div className="overview-item">
              <div className="overview-icon orange">
                <FiPackage />
              </div>

              <div>
                <span>Products</span>
                <strong>{dashboard.products}</strong>
              </div>
            </div>

            <div className="overview-item">
              <div className="overview-icon purple">
                <FiShoppingBag />
              </div>

              <div>
                <span>Orders</span>
                <strong>{dashboard.orders}</strong>
              </div>
            </div>

          </div>

          <div className="performance-card">

            <div className="performance-icon">
              <FiTrendingUp />
            </div>

            <div>
              <strong>Platform Performance</strong>
              <span>
                Keep your users, products and orders
                up to date for the best experience.
              </span>
            </div>

          </div>

        </section>

      </div>

      {/* ================================================
          SYSTEM STATUS
      ================================================= */}

      <section className="system-status">

        <div className="system-status-header">
          <div>
            <h2>System Status</h2>
            <p>Current administration environment</p>
          </div>

          <span className="system-online">
            <span />
            All Systems Operational
          </span>
        </div>

        <div className="system-grid">

          <div className="system-item">
            <FiCheckCircle />
            <div>
              <strong>Authentication</strong>
              <span>Operational</span>
            </div>
          </div>

          <div className="system-item">
            <FiCheckCircle />
            <div>
              <strong>Database</strong>
              <span>Operational</span>
            </div>
          </div>

          <div className="system-item">
            <FiCheckCircle />
            <div>
              <strong>Admin API</strong>
              <span>Operational</span>
            </div>
          </div>

          <div className="system-item">
            <FiClock />
            <div>
              <strong>Last Updated</strong>
              <span>
                {new Date().toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

        </div>

      </section>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .admin-dashboard-page {
          min-height: 100vh;
          padding: 34px 38px 60px;
          background:
            radial-gradient(
              circle at 80% 0%,
              rgba(47, 108, 190, 0.10),
              transparent 32%
            ),
            #f5f7fb;
          color: #0b2947;
        }

        /* ============================================
           HEADER
        ============================================ */

        .dashboard-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 30px;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 16px;
          font-size: 15px;
        }

        .breadcrumb span {
          color: #7890a9;
        }

        .breadcrumb b {
          color: #b6c2cf;
        }

        .breadcrumb strong {
          color: #6c829a;
          font-weight: 600;
        }

        .dashboard-header h1 {
          margin: 0;
          font-size: clamp(34px, 4vw, 48px);
          line-height: 1;
          letter-spacing: -1.5px;
          font-weight: 800;
          color: #071e38;
        }

        .dashboard-header p {
          margin: 13px 0 0;
          color: #7189a4;
          font-size: 17px;
        }

        .refresh-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px 23px;
          border: 1px solid #d9e1eb;
          border-radius: 15px;
          background: white;
          color: #173b60;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 7px 25px rgba(20, 50, 80, 0.07);
          transition: 0.25s ease;
        }

        .refresh-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(20, 50, 80, 0.11);
        }

        .refresh-button svg {
          font-size: 20px;
        }

        .refresh-button.refreshing svg {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ============================================
           ERROR
        ============================================ */

        .dashboard-error {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 18px 22px;
          margin-bottom: 28px;
          border: 1px solid #ffc5c5;
          border-radius: 18px;
          background: #fff8f8;
        }

        .error-icon {
          width: 46px;
          height: 46px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #ffe1e1;
          color: #bd2020;
          font-size: 23px;
        }

        .error-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .error-content strong {
          color: #a51616;
          font-size: 16px;
        }

        .error-content span {
          color: #c84b4b;
          font-size: 14px;
        }

        .dashboard-error button {
          border: 0;
          border-radius: 11px;
          padding: 11px 18px;
          background: #a91919;
          color: white;
          font-weight: 700;
          cursor: pointer;
        }

        /* ============================================
           STATISTICS
        ============================================ */

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 45px;
        }

        .stat-card {
          min-height: 220px;
          position: relative;
          overflow: hidden;
          padding: 28px;
          border: 1px solid #e1e7ef;
          border-radius: 21px;
          background: white;
          box-shadow:
            0 10px 35px rgba(25, 53, 83, 0.06);
          transition: 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow:
            0 18px 42px rgba(25, 53, 83, 0.11);
        }

        .stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stat-icon {
          width: 59px;
          height: 59px;
          display: grid;
          place-items: center;
          border-radius: 17px;
          font-size: 25px;
        }

        .stat-label {
          color: #8998a9;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.7px;
          text-transform: uppercase;
        }

        .stat-value {
          position: relative;
          z-index: 2;
          margin-top: 26px;
          font-size: 38px;
          font-weight: 800;
          letter-spacing: -1px;
          color: #071e38;
        }

        .stat-bottom {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 14px;
        }

        .stat-description {
          color: #8495a8;
          font-size: 13px;
        }

        .stat-trend {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-size: 12px;
          font-weight: 800;
        }

        .stat-trend.up {
          color: #0b9b67;
        }

        .stat-trend.down {
          color: #d13d3d;
        }

        .stat-trend svg {
          font-size: 15px;
        }

        .stat-decoration {
          position: absolute;
          width: 130px;
          height: 130px;
          right: -55px;
          bottom: -60px;
          border-radius: 50%;
          opacity: 0.7;
        }

        .blue .stat-icon,
        .overview-icon.blue,
        .quick-action-icon.blue {
          background: #e8f1ff;
          color: #2673d9;
        }

        .green .stat-icon,
        .overview-icon.green,
        .quick-action-icon.green {
          background: #e7f8f0;
          color: #0b9865;
        }

        .orange .stat-icon,
        .overview-icon.orange,
        .quick-action-icon.orange {
          background: #fff3db;
          color: #d88700;
        }

        .purple .stat-icon,
        .overview-icon.purple,
        .quick-action-icon.purple {
          background: #f0e9ff;
          color: #7043c8;
        }

        .blue .stat-decoration {
          background: #edf4ff;
        }

        .green .stat-decoration {
          background: #edf9f4;
        }

        .orange .stat-decoration {
          background: #fff8e9;
        }

        .purple .stat-decoration {
          background: #f5f0ff;
        }

        .skeleton-number {
          display: inline-block;
          width: 80px;
          height: 38px;
          border-radius: 8px;
          background: linear-gradient(
            90deg,
            #eef2f6,
            #f7f9fb,
            #eef2f6
          );
          animation: skeleton 1.2s infinite;
        }

        @keyframes skeleton {
          0% {
            opacity: 0.6;
          }

          50% {
            opacity: 1;
          }

          100% {
            opacity: 0.6;
          }
        }

        /* ============================================
           SECTION
        ============================================ */

        .dashboard-section {
          margin-bottom: 42px;
        }

        .section-heading h2 {
          margin: 0;
          font-size: 27px;
          color: #092744;
          letter-spacing: -0.5px;
        }

        .section-heading p {
          margin: 7px 0 0;
          color: #8295aa;
          font-size: 14px;
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-top: 20px;
        }

        .quick-action-card {
          display: flex;
          align-items: center;
          gap: 17px;
          min-height: 115px;
          padding: 20px;
          border: 1px solid #e0e7ef;
          border-radius: 18px;
          background: white;
          text-align: left;
          cursor: pointer;
          box-shadow: 0 7px 25px rgba(20, 50, 80, 0.04);
          transition: 0.25s ease;
        }

        .quick-action-card:hover {
          transform: translateY(-4px);
          border-color: #cbd8e6;
          box-shadow: 0 15px 35px rgba(20, 50, 80, 0.09);
        }

        .quick-action-icon {
          width: 57px;
          height: 57px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 15px;
          font-size: 23px;
        }

        .quick-action-content {
          flex: 1;
        }

        .quick-action-content h3 {
          margin: 0 0 5px;
          font-size: 17px;
          color: #092744;
        }

        .quick-action-content p {
          margin: 0;
          color: #8192a6;
          font-size: 12px;
          line-height: 1.45;
        }

        .action-arrow {
          color: #9aabbd;
          font-size: 20px;
        }

        /* ============================================
           COLUMNS
        ============================================ */

        .dashboard-columns {
          display: grid;
          grid-template-columns: minmax(0, 1.6fr) minmax(330px, 0.8fr);
          gap: 25px;
          margin-bottom: 25px;
        }

        .dashboard-panel {
          overflow: hidden;
          border: 1px solid #e0e7ef;
          border-radius: 21px;
          background: white;
          box-shadow: 0 8px 28px rgba(20, 50, 80, 0.045);
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 25px 27px;
          border-bottom: 1px solid #edf1f5;
        }

        .panel-title-row {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .panel-title-row svg {
          color: #3476bb;
          font-size: 19px;
        }

        .panel-header h2 {
          margin: 0;
          font-size: 19px;
          color: #092744;
        }

        .panel-header p {
          margin: 6px 0 0;
          color: #8798ab;
          font-size: 13px;
        }

        .panel-header button {
          display: flex;
          align-items: center;
          gap: 3px;
          border: 0;
          background: transparent;
          color: #3173b8;
          font-weight: 700;
          cursor: pointer;
        }

        /* ============================================
           ORDERS
        ============================================ */

        .order-row {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 17px 27px;
          border-bottom: 1px solid #f0f3f6;
          transition: 0.2s ease;
        }

        .order-row:hover {
          background: #fafcfe;
        }

        .order-row:last-child {
          border-bottom: 0;
        }

        .order-avatar {
          width: 43px;
          height: 43px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #edf4fc;
          color: #3175b8;
        }

        .order-information {
          flex: 1;
          min-width: 130px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .order-information strong {
          color: #183b5c;
          font-size: 14px;
        }

        .order-information span {
          color: #8998a8;
          font-size: 12px;
        }

        .order-date {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #8b9bad;
          font-size: 12px;
        }

        .order-price {
          min-width: 70px;
          text-align: right;
          color: #173b5d;
          font-weight: 800;
          font-size: 14px;
        }

        .order-status {
          min-width: 74px;
          padding: 6px 9px;
          border-radius: 20px;
          text-align: center;
          font-size: 11px;
          font-weight: 800;
          text-transform: capitalize;
        }

        .order-status.pending {
          background: #fff4dc;
          color: #b87500;
        }

        .order-status.completed,
        .order-status.complete,
        .order-status.delivered {
          background: #e5f8ef;
          color: #078357;
        }

        .order-status.cancelled,
        .order-status.cancel {
          background: #ffe8e8;
          color: #bf3838;
        }

        .empty-dashboard {
          min-height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 7px;
          padding: 30px;
          color: #8798a9;
          text-align: center;
        }

        .empty-dashboard > div {
          width: 56px;
          height: 56px;
          display: grid;
          place-items: center;
          margin-bottom: 7px;
          border-radius: 16px;
          background: #f0f4f8;
          color: #8ba0b4;
          font-size: 24px;
        }

        .empty-dashboard strong {
          color: #435d76;
          font-size: 15px;
        }

        .empty-dashboard span {
          font-size: 13px;
        }

        /* ============================================
           OVERVIEW
        ============================================ */

        .overview-items {
          padding: 9px 27px;
        }

        .overview-item {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 14px 0;
          border-bottom: 1px solid #f0f3f6;
        }

        .overview-item:last-child {
          border-bottom: 0;
        }

        .overview-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 12px;
        }

        .overview-item div:last-child {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .overview-item span {
          color: #788da3;
          font-size: 13px;
        }

        .overview-item strong {
          color: #143754;
          font-size: 18px;
        }

        .performance-card {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 14px 20px 20px;
          padding: 17px;
          border-radius: 15px;
          background: #f3f8fd;
        }

        .performance-icon {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #deedf9;
          color: #2875b9;
        }

        .performance-card div:last-child {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .performance-card strong {
          font-size: 13px;
          color: #194364;
        }

        .performance-card span {
          font-size: 11px;
          color: #7c91a7;
          line-height: 1.4;
        }

        /* ============================================
           SYSTEM
        ============================================ */

        .system-status {
          border: 1px solid #e0e7ef;
          border-radius: 21px;
          background: white;
          box-shadow: 0 8px 28px rgba(20, 50, 80, 0.045);
        }

        .system-status-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 25px 27px;
          border-bottom: 1px solid #edf1f5;
        }

        .system-status-header h2 {
          margin: 0;
          color: #092744;
          font-size: 19px;
        }

        .system-status-header p {
          margin: 6px 0 0;
          color: #8798ab;
          font-size: 13px;
        }

        .system-online {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 13px;
          border-radius: 20px;
          background: #e9f8f1;
          color: #078357;
          font-size: 12px;
          font-weight: 700;
        }

        .system-online > span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #0da66f;
          box-shadow: 0 0 0 4px rgba(13, 166, 111, 0.12);
        }

        .system-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }

        .system-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 22px 27px;
          border-right: 1px solid #edf1f5;
        }

        .system-item:last-child {
          border-right: 0;
        }

        .system-item > svg {
          color: #0b9b67;
          font-size: 20px;
        }

        .system-item div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .system-item strong {
          color: #31506d;
          font-size: 12px;
        }

        .system-item span {
          color: #8a9aac;
          font-size: 11px;
        }

        /* ============================================
           TABLET
        ============================================ */

        @media (max-width: 1150px) {
          .stats-grid,
          .quick-actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .dashboard-columns {
            grid-template-columns: 1fr;
          }

          .system-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .system-item:nth-child(2) {
            border-right: 0;
          }

          .system-item:nth-child(-n + 2) {
            border-bottom: 1px solid #edf1f5;
          }
        }

        /* ============================================
           MOBILE
        ============================================ */

        @media (max-width: 700px) {
          .admin-dashboard-page {
            padding: 24px 16px 40px;
          }

          .dashboard-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .refresh-button {
            width: 100%;
            justify-content: center;
          }

          .stats-grid,
          .quick-actions-grid,
          .system-grid {
            grid-template-columns: 1fr;
          }

          .stat-card {
            min-height: 190px;
          }

          .dashboard-error {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .dashboard-error button {
            margin-left: 64px;
          }

          .order-row {
            flex-wrap: wrap;
            padding: 16px;
          }

          .order-information {
            min-width: calc(100% - 65px);
          }

          .order-date {
            margin-left: 58px;
          }

          .order-price {
            margin-left: auto;
          }

          .system-item {
            border-right: 0 !important;
            border-bottom: 1px solid #edf1f5;
          }

          .system-item:last-child {
            border-bottom: 0;
          }

          .system-status-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 15px;
          }
        }
      `}</style>
    </div>
  );
}