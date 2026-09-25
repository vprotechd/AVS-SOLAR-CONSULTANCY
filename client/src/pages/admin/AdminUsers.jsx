import React, { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiUser,
  FiMail,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiTrash2,
  FiShield,
  FiUsers,
  FiAlertCircle,
} from "react-icons/fi";
import "./AdminUsers.css";

const API_URL = import.meta.env.VITE_API_URL;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const fetchUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await fetch(`${API_URL}/admin/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "Server returned an invalid response. Check your API URL."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users.");
      }

      const userList =
        data.users ||
        data.data?.users ||
        data.data ||
        [];

      setUsers(Array.isArray(userList) ? userList : []);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError(err.message || "Unable to load users.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserStatus = async (userId, action) => {
    try {
      const token = getToken();

      if (!token) {
        throw new Error("Please login again.");
      }

      const endpoint =
        action === "activate"
          ? `${API_URL}/admin/users/${userId}/activate`
          : `${API_URL}/admin/users/${userId}/deactivate`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Unable to ${action} user.`);
      }

      await fetchUsers(true);
    } catch (err) {
      console.error(`${action} user error:`, err);
      alert(err.message || `Unable to ${action} user.`);
    }
  };

  const deleteUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${user.name || user.fullName || user.email}"?`
    );

    if (!confirmed) return;

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(
        `${API_URL}/admin/users/${user._id || user.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete user.");
      }

      await fetchUsers(true);
    } catch (err) {
      console.error("Delete user error:", err);
      alert(err.message || "Unable to delete user.");
    }
  };

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const name = (
        user.name ||
        user.fullName ||
        user.username ||
        ""
      ).toLowerCase();

      const email = (user.email || "").toLowerCase();

      const role = (user.role || "user").toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        email.includes(query) ||
        role.includes(query);

      const isActive =
        user.isActive !== false &&
        user.status !== "inactive";

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && isActive) ||
        (statusFilter === "inactive" && !isActive);

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const stats = useMemo(() => {
    const total = users.length;

    const active = users.filter(
      (user) =>
        user.isActive !== false &&
        user.status !== "inactive"
    ).length;

    const inactive = total - active;

    const admins = users.filter(
      (user) => user.role === "admin"
    ).length;

    return {
      total,
      active,
      inactive,
      admins,
    };
  }, [users]);

  const getUserName = (user) => {
    return (
      user.name ||
      user.fullName ||
      user.username ||
      "Unnamed User"
    );
  };

  const getInitials = (user) => {
    const name = getUserName(user);

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const isUserActive = (user) => {
    return (
      user.isActive !== false &&
      user.status !== "inactive"
    );
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="admin-users-page">

      {/* HEADER */}
      <div className="admin-users-header">
        <div>
          <div className="admin-users-title-row">
            <div className="admin-users-title-icon">
              <FiUsers />
            </div>

            <div>
              <h1>Users</h1>
              <p>
                Manage registered users and their account access.
              </p>
            </div>
          </div>
        </div>

        <button
          className="users-refresh-btn"
          onClick={() => fetchUsers(true)}
          disabled={refreshing}
        >
          <FiRefreshCw
            className={refreshing ? "spin" : ""}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* STATS */}
      <div className="users-stats-grid">

        <div className="users-stat-card">
          <div className="users-stat-icon">
            <FiUsers />
          </div>

          <div>
            <span>Total Users</span>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="users-stat-card">
          <div className="users-stat-icon active">
            <FiCheckCircle />
          </div>

          <div>
            <span>Active</span>
            <strong>{stats.active}</strong>
          </div>
        </div>

        <div className="users-stat-card">
          <div className="users-stat-icon inactive">
            <FiXCircle />
          </div>

          <div>
            <span>Inactive</span>
            <strong>{stats.inactive}</strong>
          </div>
        </div>

        <div className="users-stat-card">
          <div className="users-stat-icon admin">
            <FiShield />
          </div>

          <div>
            <span>Admins</span>
            <strong>{stats.admins}</strong>
          </div>
        </div>

      </div>

      {/* TOOLBAR */}
      <div className="users-toolbar">

        <div className="users-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search by name, email or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="users-filters">

          <button
            className={statusFilter === "all" ? "active" : ""}
            onClick={() => setStatusFilter("all")}
          >
            All
          </button>

          <button
            className={statusFilter === "active" ? "active" : ""}
            onClick={() => setStatusFilter("active")}
          >
            Active
          </button>

          <button
            className={
              statusFilter === "inactive" ? "active" : ""
            }
            onClick={() => setStatusFilter("inactive")}
          >
            Inactive
          </button>

        </div>

      </div>

      {/* ERROR */}
      {error && (
        <div className="users-error">
          <FiAlertCircle />
          <div>
            <strong>Unable to load users</strong>
            <p>{error}</p>
          </div>

          <button onClick={() => fetchUsers()}>
            Try Again
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="users-loading">

          <div className="users-loader"></div>

          <h3>Loading users...</h3>
          <p>Please wait while we fetch user data.</p>

        </div>
      ) : filteredUsers.length === 0 ? (

        /* EMPTY */
        <div className="users-empty">

          <div className="users-empty-icon">
            <FiUsers />
          </div>

          <h3>
            {users.length === 0
              ? "No users found"
              : "No matching users"}
          </h3>

          <p>
            {users.length === 0
              ? "Registered users will appear here."
              : "Try changing your search or filter."}
          </p>

        </div>

      ) : (

        /* TABLE */
        <div className="users-table-wrapper">

          <table className="users-table">

            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredUsers.map((user) => {

                const userId = user._id || user.id;
                const active = isUserActive(user);
                const isAdmin = user.role === "admin";

                return (
                  <tr key={userId}>

                    {/* USER */}
                    <td>
                      <div className="user-info">

                        {user.profilePicture ||
                        user.profileImage ? (
                          <img
                            src={
                              user.profilePicture ||
                              user.profileImage
                            }
                            alt={getUserName(user)}
                            className="user-avatar-image"
                          />
                        ) : (
                          <div className="user-avatar">
                            {getInitials(user)}
                          </div>
                        )}

                        <div>
                          <strong>
                            {getUserName(user)}
                          </strong>

                          <small>
                            ID:{" "}
                            {String(userId).slice(-8)}
                          </small>
                        </div>

                      </div>
                    </td>

                    {/* EMAIL */}
                    <td>
                      <div className="email-cell">
                        <FiMail />
                        {user.email || "—"}
                      </div>
                    </td>

                    {/* ROLE */}
                    <td>
                      <span
                        className={`role-badge ${
                          isAdmin ? "admin" : "user"
                        }`}
                      >
                        {isAdmin ? (
                          <FiShield />
                        ) : (
                          <FiUser />
                        )}

                        {isAdmin ? "Admin" : "User"}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td>
                      <span
                        className={`status-badge ${
                          active ? "active" : "inactive"
                        }`}
                      >
                        <span className="status-dot"></span>
                        {active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* DATE */}
                    <td>
                      <div className="date-cell">
                        <FiCalendar />
                        {formatDate(
                          user.createdAt ||
                          user.created_at ||
                          user.date
                        )}
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td>

                      <div className="user-actions">

                        {/* Don't allow admin to deactivate/delete self */}
                        {isAdmin ? (
                          <span className="protected-label">
                            <FiShield />
                            Protected
                          </span>
                        ) : (
                          <>
                            {active ? (
                              <button
                                className="action-btn deactivate"
                                title="Deactivate user"
                                onClick={() =>
                                  updateUserStatus(
                                    userId,
                                    "deactivate"
                                  )
                                }
                              >
                                <FiXCircle />
                                Deactivate
                              </button>
                            ) : (
                              <button
                                className="action-btn activate"
                                title="Activate user"
                                onClick={() =>
                                  updateUserStatus(
                                    userId,
                                    "activate"
                                  )
                                }
                              >
                                <FiCheckCircle />
                                Activate
                              </button>
                            )}

                            <button
                              className="action-btn delete"
                              title="Delete user"
                              onClick={() =>
                                deleteUser(user)
                              }
                            >
                              <FiTrash2 />
                            </button>
                          </>
                        )}

                      </div>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>
      )}

      {/* FOOTER */}
      {!loading && users.length > 0 && (
        <div className="users-footer">
          Showing{" "}
          <strong>{filteredUsers.length}</strong>{" "}
          of{" "}
          <strong>{users.length}</strong>{" "}
          users
        </div>
      )}

    </div>
  );
};

export default AdminUsers;