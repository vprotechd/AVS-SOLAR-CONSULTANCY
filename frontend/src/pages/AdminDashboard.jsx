
// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { API_URL } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { userService, contactAdminService } from "../services/api";
import { teamService } from "../services/api";
import ConfirmDialog from "../components/common/ConfirmDialog"; 
// Add these to your existing imports
import { 
  Briefcase as JobIcon, 
  Users as ApplicantsIcon, 
  CheckCircle as ApprovedIcon,
  XCircle as RejectedIcon,
  Clock as PendingIcon,
  Eye as ViewIcon
} from "lucide-react";

import { 
  Users, 
  UserCheck, 
  UserX, 
  Shield, 
  LogOut,
  RefreshCw,
  Trash2,
  CheckCircle,
  XCircle,
  FileText,
  PlusCircle,
  Edit,
  Eye,
  LayoutDashboard,
  GraduationCap,
  Star,
  TrendingUp,
  Award,
  Calendar,
  Mail,
  Phone,
  Briefcase,
  MessageSquare,
  Inbox,
  Reply,
  Archive,
  Clock,
  UserPlus,
  Search,
  Filter 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom"
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState(null);
  const [contactStats, setContactStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [contactFilter, setContactFilter] = useState("all");

  // ===== TEAM MANAGEMENT STATES =====
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamSearchTerm, setTeamSearchTerm] = useState('');
  const [teamFilterDepartment, setTeamFilterDepartment] = useState('all');
  const [teamFilterStatus, setTeamFilterStatus] = useState('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState({ open: false, id: null });
  const [showToggleDialog, setShowToggleDialog] = useState({ open: false, id: null });
  const [teamStats, setTeamStats] = useState(null);


// ===== JOB APPLICATIONS STATES =====
const [applications, setApplications] = useState([]);
const [applicationsLoading, setApplicationsLoading] = useState(false);
const [appFilterStatus, setAppFilterStatus] = useState('all');
const [appSearchTerm, setAppSearchTerm] = useState('');
const [selectedApp, setSelectedApp] = useState(null);
const [showAppDetailsModal, setShowAppDetailsModal] = useState(false);
const [appStats, setAppStats] = useState({
  total: 0,
  pending: 0,
  reviewed: 0,
  shortlisted: 0,
  rejected: 0,
  hired: 0
});


// ===== BLOG MANAGEMENT STATES =====
const [blogs, setBlogs] = useState([]);
const [blogsLoading, setBlogsLoading] = useState(false);
const [blogStats, setBlogStats] = useState({
  total: 0,
  published: 0,
  views: 0
});


// ===== BLOG FUNCTIONS =====
const fetchBlogs = async () => {
  try {
    setBlogsLoading(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No token found, skipping blog fetch');
      setBlogs([]);
      setBlogStats({ total: 0, published: 0, views: 0 });
      setBlogsLoading(false);
      return;
    }
    
    const response = await fetch(`${API_URL}/blogs/admin/all`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Blogs Response Status:', response.status);
    
    if (response.status === 401) {
      console.log('Unauthorized, skipping blog fetch');
      setBlogs([]);
      setBlogStats({ total: 0, published: 0, views: 0 });
      setBlogsLoading(false);
      return;
    }
    
    const data = await response.json();
    console.log('📊 Blogs Data:', data);
    
    // ✅ FIX: Use "blogs" instead of "data"
    if (data.success && Array.isArray(data.blogs)) {
      setBlogs(data.blogs);
      
      // Calculate stats safely
      const published = data.blogs.filter(b => b.isPublished).length || 0;
      const views = data.blogs.reduce((sum, b) => sum + (b.views || 0), 0) || 0;
      
      setBlogStats({
        total: data.blogs.length || 0,
        published: published,
        views: views
      });
    } else {
      // If no blogs or error, set empty state
      setBlogs([]);
      setBlogStats({
        total: 0,
        published: 0,
        views: 0
      });
      if (data.message) {
        console.log('Blogs message:', data.message);
      }
    }
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    toast.error('Failed to load blogs');
    setBlogs([]);
    setBlogStats({
      total: 0,
      published: 0,
      views: 0
    });
  } finally {
    setBlogsLoading(false);
  }
};


// ===== JOB APPLICATIONS FUNCTIONS =====
const fetchApplications = async () => {
  try {
    setApplicationsLoading(true);
    const token = localStorage.getItem('token');
    
  const response = await fetch(`${API_URL}/applications/all`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
    const data = await response.json();
    
    if (data.success) {
      setApplications(data.data);
      updateAppStats(data.data);
    }
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    toast.error('Failed to load applications');
  } finally {
    setApplicationsLoading(false);
  }
};

const updateAppStats = (apps) => {
  setAppStats({
    total: apps.length,
    pending: apps.filter(a => a.status === 'pending').length,
    reviewed: apps.filter(a => a.status === 'reviewed').length,
    shortlisted: apps.filter(a => a.status === 'shortlisted').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
    hired: apps.filter(a => a.status === 'hired').length
  });
};

const updateApplicationStatus = async (id, newStatus) => {
  try {
    const token = localStorage.getItem('token');
   const response = await fetch(`${API_URL}/applications/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    
    const data = await response.json();
    if (data.success) {
      toast.success(`Application ${newStatus}`);
      fetchApplications();
      setShowAppDetailsModal(false);
    }
  } catch (error) {
    toast.error('Failed to update status');
  }
};

// Get filtered applications
const filteredApplications = applications.filter(app => {
  const matchesSearch = app.name?.toLowerCase().includes(appSearchTerm.toLowerCase()) ||
                        app.email?.toLowerCase().includes(appSearchTerm.toLowerCase()) ||
                        app.jobId?.title?.toLowerCase().includes(appSearchTerm.toLowerCase());
  const matchesStatus = appFilterStatus === 'all' || app.status === appFilterStatus;
  return matchesSearch && matchesStatus;
});

  useEffect(() => {
    fetchData();
    fetchTeamData();
     fetchApplications();
      fetchBlogs(); 
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes, contactsRes, contactStatsRes] = await Promise.all([
        userService.getAllUsers(),
        userService.getUserStats(),
        contactAdminService.getAllMessages(),
        contactAdminService.getStats(),
      ]);
      setUsers(usersRes.users || []);
      setStats(statsRes.stats);
      setContacts(contactsRes.messages || []);
      setContactStats(contactStatsRes.stats);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };



  

  // ===== TEAM DATA FETCHING =====
  const fetchTeamData = async () => {
    setTeamLoading(true);
    try {
      const [membersRes, statsRes] = await Promise.all([
        teamService.getAdminTeamMembers(),
        teamService.getTeamStats(),
      ]);
      setTeamMembers(membersRes.members || []);
      setTeamStats(statsRes.stats);
    } catch (error) {
      console.error("Failed to fetch team data:", error);
      toast.error("Failed to load team data");
    } finally {
      setTeamLoading(false);
    }
  };

  // ===== TEAM CRUD OPERATIONS =====
  const handleDeleteTeamMember = async () => {
    try {
      await teamService.deleteTeamMember(showDeleteDialog.id);
      toast.success("Team member deleted successfully");
      setShowDeleteDialog({ open: false, id: null });
      fetchTeamData(); // ✅ FIXED: Changed from fetchTeamMembers to fetchTeamData
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete team member");
    }
  };

  const handleToggleTeamStatus = async () => {
    try {
      await teamService.toggleTeamMemberStatus(showToggleDialog.id);
      toast.success("Team member status updated successfully");
      setShowToggleDialog({ open: false, id: null });
      fetchTeamData(); // ✅ FIXED: Changed from fetchTeamMembers to fetchTeamData
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // ===== TEAM FILTERS =====
  const getFilteredTeamMembers = () => {
    let filtered = teamMembers || [];

    if (teamSearchTerm) {
      filtered = filtered.filter(member =>
        member.name?.toLowerCase().includes(teamSearchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(teamSearchTerm.toLowerCase()) ||
        member.designation?.toLowerCase().includes(teamSearchTerm.toLowerCase())
      );
    }

    if (teamFilterDepartment !== 'all') {
      filtered = filtered.filter(member => member.department === teamFilterDepartment);
    }

    if (teamFilterStatus !== 'all') {
      filtered = filtered.filter(member => 
        teamFilterStatus === 'active' ? member.isActive : !member.isActive
      );
    }

    return filtered;
  };

  const filteredTeamMembers = getFilteredTeamMembers();
  const totalTeamMembers = teamMembers?.length || 0;
  const activeTeamMembers = teamMembers?.filter(m => m.isActive).length || 0;
  const inactiveTeamMembers = teamMembers?.filter(m => !m.isActive).length || 0;
  const featuredTeamMembers = teamMembers?.filter(m => m.featured).length || 0;
  const departments = teamMembers ? [...new Set(teamMembers.map(m => m.department))] : [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleToggleStatus = async (userId) => {
    try {
      await userService.toggleUserStatus(userId);
      toast.success("User status updated");
      fetchData();
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await userService.deleteUser(userId);
      toast.success("User deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await contactAdminService.deleteMessage(contactId);
      toast.success("Message deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const handleUpdateContactStatus = async (contactId, status) => {
    try {
      await contactAdminService.updateStatus(contactId, { status });
      toast.success(`Message marked as ${status}`);
      fetchData();
    } catch (error) {
      toast.error("Failed to update message status");
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }
    try {
      await contactAdminService.updateStatus(selectedContact._id, {
        status: "replied",
        reply: replyText,
      });
      toast.success("Reply sent successfully!");
      setShowReplyModal(false);
      setReplyText("");
      setSelectedContact(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to send reply");
    }
  };

  const navigateToAddBlog = () => {
    navigate("/admin/add-blog");
  };

  const navigateToManageBlogs = () => {
    navigate("/admin/add-blog");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "orange";
      case "read": return "blue";
      case "replied": return "green";
      case "archived": return "gray";
      default: return "gray";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock size={14} />;
      case "read": return <Eye size={14} />;
      case "replied": return <Reply size={14} />;
      case "archived": return <Archive size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (contactFilter === "all") return true;
    return contact.status === contactFilter;
  });

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <Toaster position="top-right" />

      {/* ===== CONFIRM DIALOGS ===== */}
      {/* Team Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteDialog.open}
        onClose={() => setShowDeleteDialog({ open: false, id: null })}
        onConfirm={handleDeleteTeamMember}
        title="Delete Team Member"
        message="Are you sure you want to delete this team member? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="red"
      />

      {/* Team Toggle Status Confirmation Modal */}
      <ConfirmDialog
        isOpen={showToggleDialog.open}
        onClose={() => setShowToggleDialog({ open: false, id: null })}
        onConfirm={handleToggleTeamStatus}
        title="Toggle Status"
        message={`Are you sure you want to ${
          teamMembers?.find(m => m._id === showToggleDialog.id)?.isActive ? 'deactivate' : 'activate'
        } this team member?`}
        confirmText="Confirm"
        cancelText="Cancel"
        confirmColor="yellow"
      />

      {/* Reply Modal */}
      {showReplyModal && selectedContact && (
        <div className="modal-overlay" onClick={() => setShowReplyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reply to {selectedContact.fullname}</h3>
              <button className="modal-close" onClick={() => setShowReplyModal(false)}>
                <XCircle size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="reply-message-preview">
                <p><strong>Subject:</strong> {selectedContact.subject}</p>
                <p><strong>Message:</strong></p>
                <p className="original-message">{selectedContact.message}</p>
              </div>
              <textarea
                className="reply-textarea"
                placeholder="Type your reply here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows="5"
              />
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowReplyModal(false)}>
                Cancel
              </button>
              <button className="submit-btn" onClick={handleReply}>
                <Reply size={18} />
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-brand">
      
          
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>

          <button 
            className={`nav-item ${activeTab === "team" ? "active" : ""}`}
            onClick={() => setActiveTab("team")}
          >
            <Users size={20} />
            <span>Team</span>
          </button>

          <button 
            className={`nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <Users size={20} />
            <span>Users</span>
          </button>
          <button 
            className={`nav-item ${activeTab === "contacts" ? "active" : ""}`}
            onClick={() => setActiveTab("contacts")}
          >
            <MessageSquare size={20} />
            <span>Messages</span>
          </button>
          <button 
            className={`nav-item ${activeTab === "blogs" ? "active" : ""}`}
            onClick={() => setActiveTab("blogs")}
          >
            <FileText size={20} />
            <span>Blogs</span>
          </button>


          <button 
  className={`nav-item ${activeTab === "applications" ? "active" : ""}`}
  onClick={() => setActiveTab("applications")}
>
  <ApplicantsIcon size={20} />
  <span>Applications</span>
  {appStats.pending > 0 && <span className="badge">{appStats.pending}</span>}
</button>
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Header */}
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <div className="admin-actions">
            <button onClick={() => {
              fetchData();
              fetchTeamData();
            }} className="refresh-btn">
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards - Only ONE set */}
<div className="stats-grid">
  <div className="stat-card">
    <div className="stat-icon blue">
      <Users size={24} />
    </div>
    <div className="stat-info">
      <h3 className="stat-number-blue">{stats?.totalUsers || 0}</h3>
      <p>Total Users</p>
    </div>
  </div>
  <div className="stat-card">
    <div className="stat-icon green">
      <UserCheck size={24} />
    </div>
    <div className="stat-info">
      <h3 className="stat-number-green">{stats?.totalActive || 0}</h3>
      <p>Active Users</p>
    </div>
  </div>
  <div className="stat-card">
    <div className="stat-icon purple">
      <Users size={24} />
    </div>
    <div className="stat-info">
      <h3 className="stat-number-purple">{totalTeamMembers}</h3>
      <p>Team Members</p>
    </div>
  </div>
  <div className="stat-card">
    <div className="stat-icon orange">
      <MessageSquare size={24} />
    </div>
    <div className="stat-info">
      <h3 className="stat-number-orange">{contactStats?.totalMessages || 0}</h3>
      <p>Total Messages</p>
    </div>
  </div>
</div>
        {/* Quick Actions - Only ONE set */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <div className="quick-action-card" onClick={() => setActiveTab("team")}>
              <Users size={28} />
              <span>Manage Team</span>
            </div>
            <div className="quick-action-card" onClick={navigateToAddBlog}>
              <PlusCircle size={28} />
              <span>Add New Blog</span>
            </div>
            <div className="quick-action-card" onClick={() => setActiveTab("users")}>
              <Users size={28} />
              <span>Manage Users</span>
            </div>
            <div className="quick-action-card" onClick={() => setActiveTab("contacts")}>
              <MessageSquare size={28} />
              <span>View Messages</span>
            </div>
          </div>
        </div>

        {/* ===== TEAM MANAGEMENT SECTION ===== */}
        {activeTab === "team" && (
          <div className="team-management-section">
            <div className="section-header">
              <h2>Team Management</h2>
              <Link to="/admin/team/create" className="add-btn">
                <UserPlus size={18} />
                Add Team Member
              </Link>
            </div>

            {/* Team Stats */}
            <div className="team-stats-grid">
              <div className="team-stat-card">
                <div className="team-stat-icon total">
                  <Users size={20} />
                </div>
                <div>
                  <h4>Total Members</h4>
                  <p>{totalTeamMembers}</p>
                </div>
              </div>
              <div className="team-stat-card">
                <div className="team-stat-icon active">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h4>Active</h4>
                  <p>{activeTeamMembers}</p>
                </div>
              </div>
              <div className="team-stat-card">
                <div className="team-stat-icon inactive">
                  <UserX size={20} />
                </div>
                <div>
                  <h4>Inactive</h4>
                  <p>{inactiveTeamMembers}</p>
                </div>
              </div>
              <div className="team-stat-card">
                <div className="team-stat-icon featured">
                  <Star size={20} />
                </div>
                <div>
                  <h4>Featured</h4>
                  <p>{featuredTeamMembers}</p>
                </div>
              </div>
            </div>

            {/* Team Filters */}
            <div className="team-filters">
              <div className="search-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={teamSearchTerm}
                  onChange={(e) => setTeamSearchTerm(e.target.value)}
                  className="search-input"
                />
                {teamSearchTerm && (
                  <button onClick={() => setTeamSearchTerm('')} className="clear-search">
                    <XCircle size={16} />
                  </button>
                )}
              </div>

              <div className="filter-group">
                <Filter size={18} className="filter-icon" />
                <select
                  value={teamFilterDepartment}
                  onChange={(e) => setTeamFilterDepartment(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>

                <select
                  value={teamFilterStatus}
                  onChange={(e) => setTeamFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Team Members Table */}
            <div className="team-table-wrapper">
              {teamLoading ? (
                <div className="team-loading">
                  <div className="spinner-small"></div>
                  <p>Loading team members...</p>
                </div>
              ) : filteredTeamMembers.length === 0 ? (
                <div className="empty-state">
                  <Users size={64} />
                  <h3>No team members found</h3>
                  <p>Get started by adding your first team member</p>
                  <Link to="/admin/team/create" className="add-btn">
                    <UserPlus size={18} />
                    Add Team Member
                  </Link>
                </div>
              ) : (
                <table className="team-table">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Designation</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeamMembers.map((member) => (
                      <tr key={member._id}>
                        <td className="member-cell">
                          <img
                            src={member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=4F46E5&color=fff&size=40`}
                            alt={member.name}
                            className="member-avatar"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=4F46E5&color=fff&size=40`;
                            }}
                          />
                          <div>
                            <div className="member-name">{member.name}</div>
                            <div className="member-email">{member.email}</div>
                          </div>
                        </td>
                        <td>{member.designation}</td>
                        <td>
                          <span className="department-tag">{member.department}</span>
                        </td>
                        <td>
                          <span className={`status-badge ${member.isActive ? 'active' : 'inactive'}`}>
                            {member.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          {member.featured && <Star size={16} className="featured-star" />}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Link
                              to={`/admin/team/edit/${member._id}`}
                              className="action-btn edit"
                              title="Edit Member"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={() => setShowToggleDialog({ open: true, id: member._id })}
                              className={`action-btn toggle ${member.isActive ? 'active' : 'inactive'}`}
                              title={member.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {member.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                            </button>
                            <button
                              onClick={() => setShowDeleteDialog({ open: true, id: member._id })}
                              className="action-btn delete"
                              title="Delete Member"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ===== USERS TAB ===== */}
        {activeTab === "users" && (
          <div className="users-table-container">
            <h2>All Users</h2>
            <div className="table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Domain</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="no-users">No users found</td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <span>{u.name}</span>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>{u.phone || "N/A"}</td>
                        <td>{u.domain || "N/A"}</td>
                        <td>
                          <span className={`role-badge ${u.role}`}>
                            {u.role === "admin" ? "Admin" : "User"}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${u.isActive ? "active" : "inactive"}`}>
                            {u.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => handleToggleStatus(u._id)}
                              className={`action-btn ${u.isActive ? "deactivate" : "activate"}`}
                              title={u.isActive ? "Deactivate" : "Activate"}
                            >
                              {u.isActive ? (
                                <XCircle size={16} />
                              ) : (
                                <CheckCircle size={16} />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="action-btn delete"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== CONTACTS TAB ===== */}
        {activeTab === "contacts" && (
          <div className="contacts-section">
            <div className="section-header">
              <h2>Contact Messages</h2>
              <div className="contact-filters">
                <button
                  className={`filter-btn ${contactFilter === "all" ? "active" : ""}`}
                  onClick={() => setContactFilter("all")}
                >
                  All ({contactStats?.totalMessages || 0})
                </button>
                <button
                  className={`filter-btn ${contactFilter === "pending" ? "active" : ""}`}
                  onClick={() => setContactFilter("pending")}
                >
                  Pending ({contactStats?.pending || 0})
                </button>
                <button
                  className={`filter-btn ${contactFilter === "read" ? "active" : ""}`}
                  onClick={() => setContactFilter("read")}
                >
                  Read ({contactStats?.read || 0})
                </button>
                <button
                  className={`filter-btn ${contactFilter === "replied" ? "active" : ""}`}
                  onClick={() => setContactFilter("replied")}
                >
                  Replied ({contactStats?.replied || 0})
                </button>
              </div>
            </div>

            <div className="contacts-list">
              {filteredContacts.length === 0 ? (
                <div className="no-contacts">
                  <Inbox size={48} />
                  <h3>No messages</h3>
                  <p>No contact messages found</p>
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <div key={contact._id} className="contact-card">
                    <div className="contact-header">
                      <div className="contact-info">
                        <h4>{contact.fullname}</h4>
                        <div className="contact-meta">
                          <span><Mail size={14} /> {contact.email}</span>
                          <span><Phone size={14} /> {contact.phone}</span>
                          <span><Calendar size={14} /> {new Date(contact.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="contact-status">
                        <span className={`status-badge ${getStatusColor(contact.status)}`}>
                          {getStatusIcon(contact.status)}
                          {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="contact-body">
                      <p><strong>Subject:</strong> {contact.subject}</p>
                      <p className="contact-message">{contact.message}</p>
                      {contact.reply && (
                        <div className="contact-reply">
                          <p><strong>Reply:</strong> {contact.reply}</p>
                        </div>
                      )}
                    </div>
                    <div className="contact-actions">
                      {contact.status === "pending" && (
                        <button
                          className="action-btn mark-read"
                          onClick={() => handleUpdateContactStatus(contact._id, "read")}
                        >
                          <Eye size={16} />
                          Mark as Read
                        </button>
                      )}
                      {contact.status !== "replied" && contact.status !== "archived" && (
                        <button
                          className="action-btn reply"
                          onClick={() => {
                            setSelectedContact(contact);
                            setShowReplyModal(true);
                          }}
                        >
                          <Reply size={16} />
                          Reply
                        </button>
                      )}
                      {contact.status === "read" && (
                        <button
                          className="action-btn archive"
                          onClick={() => handleUpdateContactStatus(contact._id, "archived")}
                        >
                          <Archive size={16} />
                          Archive
                        </button>
                      )}
                      <button
                        className="action-btn delete"
                        onClick={() => handleDeleteContact(contact._id)}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

       {/* ===== BLOGS TAB ===== */}
{activeTab === "blogs" && (
  <div className="blogs-section">
    <div className="section-header">
      <h2>Blog Management</h2>
      <button className="add-blog-btn" onClick={navigateToAddBlog}>
        <PlusCircle size={18} />
        Add New Blog
      </button>
    </div>

    {/* Blog Stats */}
    <div className="blog-stats-grid">
      <div className="blog-stat-card">
        <div className="blog-stat-icon">
          <FileText size={24} />
        </div>
        <div>
          <h4>Total Blogs</h4>
          <p>{blogStats.total}</p>
        </div>
      </div>
      <div className="blog-stat-card">
        <div className="blog-stat-icon green">
          <CheckCircle size={24} />
        </div>
        <div>
          <h4>Published</h4>
          <p>{blogStats.published}</p>
        </div>
      </div>
      <div className="blog-stat-card">
        <div className="blog-stat-icon yellow">
          <Eye size={24} />
        </div>
        <div>
          <h4>Total Views</h4>
          <p>{blogStats.views}</p>
        </div>
      </div>
    </div>

    {/* Blogs List */}
    {blogsLoading ? (
      <div className="blog-loading">Loading blogs...</div>
    ) : blogs.length === 0 ? (
      <div className="blog-placeholder">
        <FileText size={48} />
        <h3>No blogs yet</h3>
        <p>Create your first blog post</p>
        <button className="add-blog-btn" onClick={navigateToAddBlog}>
          <PlusCircle size={18} />
          Add New Blog
        </button>
      </div>
    ) : (
      <div className="blog-list">
        {blogs.map((blog) => (
          <div key={blog._id} className="blog-card">
            <div className="blog-card-content">
              {/* ✅ Blog Image */}
              {blog.image ? (
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className="blog-thumbnail"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="blog-thumbnail-placeholder">
                  <FileText size={24} />
                </div>
              )}
              
              <div className="blog-info">
                <h4 className="blog-title">{blog.title}</h4>
                <div className="blog-meta">
                  <span>
                    <Calendar size={14} /> 
                    {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <span>
                    <Eye size={14} /> {blog.views || 0} views
                  </span>
                  <span className={`blog-status ${blog.isPublished ? 'published' : 'draft'}`}>
                    {blog.isPublished ? '✅ Published' : '📝 Draft'}
                  </span>
                </div>
              </div>
              <div className="blog-actions">
                <Link to={`/admin/edit-blog/${blog._id}`} className="action-btn edit" title="Edit">
                  <Edit size={16} />
                </Link>
                <button 
                  className="action-btn delete" 
                  title="Delete"
                  onClick={() => {
                    if (window.confirm(`Delete "${blog.title}"?`)) {
                      // Add delete function here
                    }
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

        {/* ===== APPLICATIONS TAB ===== */}
{activeTab === "applications" && (
  <div className="applications-section">
    <div className="section-header">
      <h2>Job Applications</h2>
      <div className="app-stats-summary">
        <span>Total: {appStats.total}</span>
        <span className="pending-count">Pending: {appStats.pending}</span>
        <span className="shortlisted-count">Shortlisted: {appStats.shortlisted}</span>
      </div>
    </div>

    {/* Application Stats */}
    <div className="app-stats-grid">
      <div className="app-stat-card total">
        <ApplicantsIcon size={24} />
        <div>
          <h4>Total</h4>
          <p>{appStats.total}</p>
        </div>
      </div>
      <div className="app-stat-card pending">
        <PendingIcon size={24} />
        <div>
          <h4>Pending</h4>
          <p>{appStats.pending}</p>
        </div>
      </div>
      <div className="app-stat-card shortlisted">
        <ApprovedIcon size={24} />
        <div>
          <h4>Shortlisted</h4>
          <p>{appStats.shortlisted}</p>
        </div>
      </div>
      <div className="app-stat-card hired">
        <Award size={24} />
        <div>
          <h4>Hired</h4>
          <p>{appStats.hired}</p>
        </div>
      </div>
    </div>

    {/* Search & Filter */}
    <div className="app-filters">
      <div className="search-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search by name, email, or job..."
          value={appSearchTerm}
          onChange={(e) => setAppSearchTerm(e.target.value)}
          className="search-input"
        />
        {appSearchTerm && (
          <button onClick={() => setAppSearchTerm('')} className="clear-search">
            <XCircle size={16} />
          </button>
        )}
      </div>
      <select
        value={appFilterStatus}
        onChange={(e) => setAppFilterStatus(e.target.value)}
        className="filter-select"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="reviewed">Reviewed</option>
        <option value="shortlisted">Shortlisted</option>
        <option value="rejected">Rejected</option>
        <option value="hired">Hired</option>
      </select>
    </div>

    {/* Applications List */}
    <div className="app-list">
      {applicationsLoading ? (
        <div className="app-loading">Loading applications...</div>
      ) : filteredApplications.length === 0 ? (
        <div className="empty-state">
          <ApplicantsIcon size={48} />
          <h3>No applications found</h3>
          <p>No job applications have been submitted yet</p>
        </div>
      ) : (
        filteredApplications.map((app) => (
          <div key={app._id} className="app-card">
            <div className="app-card-header">
              <div className="app-info">
                <div className="app-avatar">
                  {app.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4>{app.name}</h4>
                  <div className="app-meta">
                    <span><Mail size={14} /> {app.email}</span>
                    <span><Phone size={14} /> {app.phone}</span>
                    <span><Briefcase size={14} /> {app.jobId?.title || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div className="app-actions">
                <span className={`status-badge ${app.status}`}>
                  {app.status}
                </span>
                <button 
                  className="action-btn view"
                  onClick={() => {
                    setSelectedApp(app);
                    setShowAppDetailsModal(true);
                  }}
                  title="View Details"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>
            <div className="app-card-footer">
              <span><Calendar size={14} /> Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
              <span><Clock size={14} /> Available: {app.availableTime}</span>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
)}


{/* Application Details Modal */}
{showAppDetailsModal && selectedApp && (
  <div className="modal-overlay" onClick={() => setShowAppDetailsModal(false)}>
    <div className="modal-content app-details-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2>Application Details</h2>
        <button className="modal-close" onClick={() => setShowAppDetailsModal(false)}>
          <XCircle size={24} />
        </button>
      </div>

      <div className="app-details">
        <div className="app-detail-section">
          <h3>Applicant Information</h3>
          <div className="app-detail-grid">
            <div><label>Name:</label> <p>{selectedApp.name}</p></div>
            <div><label>Email:</label> <p>{selectedApp.email}</p></div>
            <div><label>Phone:</label> <p>{selectedApp.phone}</p></div>
            <div><label>Available Time:</label> <p>{selectedApp.availableTime}</p></div>
            <div><label>Experience:</label> <p>{selectedApp.experience || 'Not specified'}</p></div>
            <div><label>Status:</label> <p className={`status-badge ${selectedApp.status}`}>{selectedApp.status}</p></div>
          </div>
        </div>

        {selectedApp.coverLetter && (
          <div className="app-detail-section">
            <h3>Cover Letter</h3>
            <p className="cover-letter-text">{selectedApp.coverLetter}</p>
          </div>
        )}

        {selectedApp.resume && (
          <div className="app-detail-section">
            <h3>Resume</h3>
            <a href={`http:///${selectedApp.resume}`} target="_blank" className="resume-link">
              <FileText size={18} />
              Download Resume
            </a>
          </div>
        )}

        <div className="app-detail-section">
          <h3>Update Status</h3>
          <div className="status-update-buttons">
            {['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'].map((status) => (
              <button
                key={status}
                className={`status-btn ${status === selectedApp.status ? 'active' : ''}`}
                onClick={() => updateApplicationStatus(selectedApp._id, status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="modal-actions">
        <button className="cancel-btn" onClick={() => setShowAppDetailsModal(false)}>
          Close
        </button>
      </div>
    </div>
  </div>
)}

        {/* ===== DASHBOARD OVERVIEW ===== */}
        {activeTab === "dashboard" && (
          <div className="dashboard-overview">
            <div className="welcome-section">
              <h2>Welcome back, {user?.name}!</h2>
              <p>Here's what's happening with your platform today.</p>
            </div>
            
            <div className="domain-stats">
              <h3>Users by Domain</h3>
              <div className="domain-grid">
                {stats?.domainStats?.map((item, index) => (
                  <div key={index} className="domain-item">
                    <span className="domain-name">{item._id || "Other"}</span>
                    <span className="domain-count">{item.count}</span>
                  </div>
                ))}
                {(!stats?.domainStats || stats.domainStats.length === 0) && (
                  <p className="no-data">No domain data available</p>
                )}
              </div>
            </div>

            <div className="recent-users">
              <h3>Recent Users</h3>
              <div className="recent-users-list">
                {users.slice(0, 5).map((u) => (
                  <div key={u._id} className="recent-user-item">
                    <div className="recent-user-avatar">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="recent-user-info">
                      <h4>{u.name}</h4>
                      <p>{u.email}</p>
                    </div>
                    <span className={`status-badge small ${u.isActive ? "active" : "inactive"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
                {users.length === 0 && (
                  <p className="no-data">No users registered yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}