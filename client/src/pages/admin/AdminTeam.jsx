import React, { useEffect, useState } from "react";

import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiBookOpen,
  FiGlobe,
  FiLinkedin,
  FiX,
  FiCheck,
  FiSearch,
  FiRefreshCw,
} from "react-icons/fi";

import { toast } from "react-toastify";
import api from "../../services/api";
import "./AdminTeam.css";

const emptyForm = {
  name: "",
  designation: "",
  email: "",
  phone: "",
  experience: "",
  qualification: "",
  location: "",
  bio: "",
  skills: "",
  image: "",
  linkedin: "",
  website: "",
  isActive: true,
  displayOrder: 0,
};

const AdminTeam = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // ============================================================
  // GET BACKEND URL
  // ============================================================

  const getBackendUrl = () => {
    // First try Axios base URL
    const apiBaseUrl = api?.defaults?.baseURL;

    if (apiBaseUrl) {
      try {
        const url = new URL(
          apiBaseUrl,
          window.location.origin
        );

        let origin = url.origin;

        // Remove trailing slash
        origin = origin.replace(/\/+$/, "");

        return origin;
      } catch (error) {
        console.warn(
          "Unable to parse api.defaults.baseURL:",
          error
        );
      }
    }

    // Try Vite environment variable
    const envApiUrl = import.meta.env.VITE_API_URL;

    if (envApiUrl) {
      try {
        const url = new URL(
          envApiUrl,
          window.location.origin
        );

        let origin = url.origin;

        origin = origin.replace(/\/+$/, "");

        return origin;
      } catch (error) {
        console.warn(
          "Unable to parse VITE_API_URL:",
          error
        );
      }
    }

    // Production fallback
    if (
      window.location.hostname.includes("onrender.com") ||
      window.location.hostname.includes("avs-solar")
    ) {
      return "https://avs-solar-consultancy1.onrender.com";
    }

    // Local development fallback
    return "http://localhost:5000";
  };

  // ============================================================
  // IMAGE URL HELPER
  // ============================================================

  const getImageUrl = (image) => {
    if (!image) return "";

    let imageValue = String(image).trim();

    if (!imageValue) return "";

    // New local browser preview
    if (imageValue.startsWith("blob:")) {
      return imageValue;
    }

    // Already complete URL
    if (
      imageValue.startsWith("http://") ||
      imageValue.startsWith("https://")
    ) {
      return imageValue;
    }

    // Normalize Windows-style slashes
    imageValue = imageValue.replace(/\\/g, "/");

    // Remove accidental API prefix
    if (imageValue.startsWith("/api/uploads/")) {
      imageValue = imageValue.replace(
        "/api/uploads/",
        "/uploads/"
      );
    }

    if (imageValue.startsWith("api/uploads/")) {
      imageValue = imageValue.replace(
        "api/uploads/",
        "uploads/"
      );
    }

    // Ensure leading slash
    if (!imageValue.startsWith("/")) {
      imageValue = `/${imageValue}`;
    }

    const backendUrl = getBackendUrl();

    const finalUrl = `${backendUrl}${imageValue}`;

    console.log("Team image URL:", {
      original: image,
      backendUrl,
      finalUrl,
    });

    return finalUrl;
  };

  // ============================================================
  // LOAD TEAM
  // ============================================================

  const loadTeam = async () => {
    try {
      setLoading(true);

      const response = await api.get("/team");

      console.log("Team API response:", response.data);

      const members =
        response?.data?.team ||
        response?.data?.members ||
        response?.team ||
        response?.members ||
        [];

      setTeam(Array.isArray(members) ? members : []);
    } catch (error) {
      console.error("Load team error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load team members"
      );

      setTeam([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  // ============================================================
  // CLEAN IMAGE PREVIEW
  // ============================================================

  const revokeBlobPreview = () => {
    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  // ============================================================
  // FORM CHANGE
  // ============================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ============================================================
  // IMAGE CHANGE
  // ============================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      );

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Image must be less than 5MB"
      );

      e.target.value = "";
      return;
    }

    // Remove previous preview
    revokeBlobPreview();

    setSelectedImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  // ============================================================
  // OPEN ADD MODAL
  // ============================================================

  const handleAdd = () => {
    revokeBlobPreview();

    setEditingMember(null);
    setForm({ ...emptyForm });
    setSelectedImage(null);
    setImagePreview("");
    setShowModal(true);
  };

  // ============================================================
  // OPEN EDIT MODAL
  // ============================================================

  const handleEdit = (member) => {
    revokeBlobPreview();

    setEditingMember(member);
    setSelectedImage(null);

    const existingImage = member?.image
      ? getImageUrl(member.image)
      : "";

    setImagePreview(existingImage);

    setForm({
      name: member.name || "",
      designation: member.designation || "",
      email: member.email || "",
      phone: member.phone || "",
      experience: member.experience || "",
      qualification:
        member.qualification || "",
      location: member.location || "",
      bio: member.bio || "",

      skills: Array.isArray(member.skills)
        ? member.skills.join(", ")
        : member.skills || "",

      image: member.image || "",

      linkedin: member.linkedin || "",
      website: member.website || "",

      isActive:
        typeof member.isActive === "boolean"
          ? member.isActive
          : true,

      displayOrder:
        member.displayOrder ?? 0,
    });

    setShowModal(true);
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const closeModal = () => {
    if (saving) return;

    revokeBlobPreview();

    setShowModal(false);
    setEditingMember(null);
    setForm({ ...emptyForm });
    setSelectedImage(null);
    setImagePreview("");
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error(
        "Please enter team member name"
      );
      return false;
    }

    if (!form.designation.trim()) {
      toast.error(
        "Please enter designation"
      );
      return false;
    }

    if (!form.email.trim()) {
      toast.error("Please enter email");
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        form.email.trim()
      )
    ) {
      toast.error(
        "Please enter a valid email address"
      );
      return false;
    }

    if (form.phone.trim()) {
      const phoneRegex =
        /^[0-9+\-\s()]{7,20}$/;

      if (
        !phoneRegex.test(
          form.phone.trim()
        )
      ) {
        toast.error(
          "Please enter a valid phone number"
        );
        return false;
      }
    }

    return true;
  };

  // ============================================================
  // SAVE TEAM MEMBER
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "designation",
        form.designation.trim()
      );

      formData.append(
        "email",
        form.email.trim()
      );

      formData.append(
        "phone",
        form.phone.trim()
      );

      formData.append(
        "experience",
        form.experience.trim()
      );

      formData.append(
        "qualification",
        form.qualification.trim()
      );

      formData.append(
        "location",
        form.location.trim()
      );

      formData.append(
        "bio",
        form.bio.trim()
      );

      formData.append(
        "linkedin",
        form.linkedin.trim()
      );

      formData.append(
        "website",
        form.website.trim()
      );

      formData.append(
        "isActive",
        String(Boolean(form.isActive))
      );

      formData.append(
        "displayOrder",
        String(
          Number(form.displayOrder) || 0
        )
      );

      // ----------------------------------------------------------
      // SKILLS
      // ----------------------------------------------------------

      const skillsArray = form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      formData.append(
        "skills",
        JSON.stringify(skillsArray)
      );

      // ----------------------------------------------------------
      // IMAGE
      // ----------------------------------------------------------

      if (selectedImage) {
        console.log(
          "Uploading image:",
          selectedImage.name,
          selectedImage.type,
          selectedImage.size
        );

        formData.append(
          "image",
          selectedImage
        );
      }

      // ----------------------------------------------------------
      // DEBUG FORMDATA
      // ----------------------------------------------------------

      console.log(
        "Saving team member:",
        {
          editing: Boolean(editingMember),
          memberId:
            editingMember?._id,
          hasImage:
            Boolean(selectedImage),
        }
      );

      // ----------------------------------------------------------
      // EDIT
      // ----------------------------------------------------------

      if (editingMember) {
        await api.put(
          `/team/${editingMember._id}`,
          formData
        );

        toast.success(
          "Team member updated successfully"
        );
      }

      // ----------------------------------------------------------
      // ADD
      // ----------------------------------------------------------

      else {
        await api.post(
          "/team",
          formData
        );

        toast.success(
          "Team member added successfully"
        );
      }

      closeModal();

      await loadTeam();
    } catch (error) {
      console.error(
        "Save team member error:",
        error
      );

      console.error(
        "Server response:",
        error?.response?.data
      );

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          `Unable to ${
            editingMember
              ? "update"
              : "add"
          } team member`
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = async (member) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${member.name}"?`
      );

    if (!confirmed) return;

    try {
      await api.delete(
        `/team/${member._id}`
      );

      toast.success(
        "Team member deleted successfully"
      );

      setTeam((prev) =>
        prev.filter(
          (item) =>
            item._id !== member._id
        )
      );
    } catch (error) {
      console.error(
        "Delete team member error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to delete team member"
      );
    }
  };

  // ============================================================
  // TOGGLE STATUS
  // ============================================================

  const handleToggleStatus = async (
    member
  ) => {
    try {
      await api.put(
        `/team/${member._id}/status`
      );

      toast.success(
        member.isActive
          ? "Team member deactivated"
          : "Team member activated"
      );

      await loadTeam();
    } catch (error) {
      console.error(
        "Toggle team member status error:",
        error
      );

      console.error(
        "Server response:",
        error?.response?.data
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update team member"
      );
    }
  };

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredTeam = team.filter(
    (member) => {
      const query =
        search.toLowerCase().trim();

      if (!query) return true;

      return (
        member.name
          ?.toLowerCase()
          .includes(query) ||
        member.designation
          ?.toLowerCase()
          .includes(query) ||
        member.email
          ?.toLowerCase()
          .includes(query) ||
        member.location
          ?.toLowerCase()
          .includes(query) ||
        (Array.isArray(member.skills)
          ? member.skills
              .join(" ")
              .toLowerCase()
              .includes(query)
          : false)
      );
    }
  );

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="admin-team-page">
      {/* HEADER */}

      <div className="admin-team-header">
        <div>
          <h1>Team Management</h1>

          <p>
            Manage your solar consultancy
            team members
          </p>
        </div>

        <button
          type="button"
          className="admin-team-add-btn"
          onClick={handleAdd}
        >
          <FiPlus />
          Add Team Member
        </button>
      </div>

      {/* TOOLBAR */}

      <div className="admin-team-toolbar">
        <div className="admin-team-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search team members..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <button
          type="button"
          className="admin-team-refresh"
          onClick={loadTeam}
          disabled={loading}
          title="Refresh"
        >
          <FiRefreshCw
            className={
              loading
                ? "admin-team-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* STATS */}

      <div className="admin-team-stats">
        <div className="admin-team-stat-card">
          <div className="admin-team-stat-icon">
            <FiUser />
          </div>

          <div>
            <span>Total Members</span>

            <strong>
              {team.length}
            </strong>
          </div>
        </div>

        <div className="admin-team-stat-card">
          <div className="admin-team-stat-icon">
            <FiCheck />
          </div>

          <div>
            <span>Active</span>

            <strong>
              {
                team.filter(
                  (member) =>
                    member.isActive
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="admin-team-stat-card">
          <div className="admin-team-stat-icon">
            <FiX />
          </div>

          <div>
            <span>Inactive</span>

            <strong>
              {
                team.filter(
                  (member) =>
                    !member.isActive
                ).length
              }
            </strong>
          </div>
        </div>
      </div>

      {/* CONTENT */}

      {loading ? (
        <div className="admin-team-loading">
          <div className="admin-team-loader"></div>

          <p>
            Loading team members...
          </p>
        </div>
      ) : filteredTeam.length === 0 ? (
        <div className="admin-team-empty">
          <FiUser />

          <h3>
            {search
              ? "No team members found"
              : "No team members yet"}
          </h3>

          <p>
            {search
              ? "Try changing your search."
              : "Add your first team member to get started."}
          </p>

          {!search && (
            <button
              type="button"
              onClick={handleAdd}
              className="admin-team-add-btn"
            >
              <FiPlus />
              Add Team Member
            </button>
          )}
        </div>
      ) : (
        <div className="admin-team-grid">
          {filteredTeam.map(
            (member) => {
              const memberImageUrl =
                getImageUrl(
                  member.image
                );

              return (
                <div
                  className={`admin-team-card ${
                    !member.isActive
                      ? "admin-team-card-inactive"
                      : ""
                  }`}
                  key={member._id}
                >
                  {/* IMAGE */}

                  <div className="admin-team-card-image">
                    {memberImageUrl ? (
                      <img
                        src={
                          memberImageUrl
                        }
                        alt={
                          member.name ||
                          "Team member"
                        }
                        onLoad={() => {
                          console.log(
                            "Team image loaded:",
                            memberImageUrl
                          );
                        }}
                        onError={(e) => {
                          console.error(
                            "Failed to load team image:",
                            memberImageUrl
                          );

                          e.currentTarget.style.display =
                            "none";

                          const fallback =
                            e.currentTarget
                              .parentElement
                              ?.querySelector(
                                ".admin-team-avatar-fallback"
                              );

                          if (fallback) {
                            fallback.style.display =
                              "flex";
                          }
                        }}
                      />
                    ) : null}

                    <div
                      className="admin-team-avatar-fallback"
                      style={{
                        display:
                          memberImageUrl
                            ? "none"
                            : "flex",
                      }}
                    >
                      <FiUser />
                    </div>

                    <span
                      className={`admin-team-status ${
                        member.isActive
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {member.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  {/* DETAILS */}

                  <div className="admin-team-card-body">
                    <h3>
                      {member.name}
                    </h3>

                    <p className="admin-team-designation">
                      {
                        member.designation
                      }
                    </p>

                    {member.email && (
                      <div className="admin-team-info">
                        <FiMail />

                        <span>
                          {
                            member.email
                          }
                        </span>
                      </div>
                    )}

                    {member.phone && (
                      <div className="admin-team-info">
                        <FiPhone />

                        <span>
                          {
                            member.phone
                          }
                        </span>
                      </div>
                    )}

                    {member.location && (
                      <div className="admin-team-info">
                        <FiMapPin />

                        <span>
                          {
                            member.location
                          }
                        </span>
                      </div>
                    )}

                    {member.experience && (
                      <div className="admin-team-info">
                        <FiBriefcase />

                        <span>
                          {
                            member.experience
                          }
                        </span>
                      </div>
                    )}

                    {member.qualification && (
                      <div className="admin-team-info">
                        <FiBookOpen />

                        <span>
                          {
                            member.qualification
                          }
                        </span>
                      </div>
                    )}

                    {Array.isArray(
                      member.skills
                    ) &&
                      member.skills
                        .length > 0 && (
                        <div className="admin-team-skills">
                          {member.skills
                            .slice(0, 5)
                            .map(
                              (
                                skill,
                                index
                              ) => (
                                <span
                                  key={
                                    index
                                  }
                                >
                                  {
                                    skill
                                  }
                                </span>
                              )
                            )}
                        </div>
                      )}

                    <div className="admin-team-links">
                      {member.linkedin && (
                        <a
                          href={
                            member.linkedin
                          }
                          target="_blank"
                          rel="noreferrer"
                          title="LinkedIn"
                        >
                          <FiLinkedin />
                        </a>
                      )}

                      {member.website && (
                        <a
                          href={
                            member.website
                          }
                          target="_blank"
                          rel="noreferrer"
                          title="Website"
                        >
                          <FiGlobe />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="admin-team-card-actions">
                    <button
                      type="button"
                      className="admin-team-edit-btn"
                      onClick={() =>
                        handleEdit(
                          member
                        )
                      }
                    >
                      <FiEdit2 />
                      Edit
                    </button>

                    <button
                      type="button"
                      className={`admin-team-toggle-btn ${
                        member.isActive
                          ? "deactivate"
                          : "activate"
                      }`}
                      onClick={() =>
                        handleToggleStatus(
                          member
                        )
                      }
                    >
                      {member.isActive
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                    <button
                      type="button"
                      className="admin-team-delete-btn"
                      onClick={() =>
                        handleDelete(
                          member
                        )
                      }
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}

      {/* MODAL */}

      {showModal && (
        <div
          className="admin-team-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target ===
                e.currentTarget &&
              !saving
            ) {
              closeModal();
            }
          }}
        >
          <div className="admin-team-modal">
            {/* MODAL HEADER */}

            <div className="admin-team-modal-header">
              <div>
                <h2>
                  {editingMember
                    ? "Edit Team Member"
                    : "Add Team Member"}
                </h2>

                <p>
                  {editingMember
                    ? "Update team member details"
                    : "Add a new member to your team"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="admin-team-modal-close"
              >
                <FiX />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="admin-team-form"
            >
              {/* BASIC INFORMATION */}

              <div className="admin-team-section">
                <h3>
                  Basic Information
                </h3>

                <div className="admin-team-form-grid">
                  {/* NAME */}

                  <div className="admin-team-field">
                    <label>
                      Full Name *
                    </label>

                    <div className="admin-team-input-wrap">
                      <FiUser />

                      <input
                        type="text"
                        name="name"
                        value={
                          form.name
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                  </div>

                  {/* DESIGNATION */}

                  <div className="admin-team-field">
                    <label>
                      Designation *
                    </label>

                    <div className="admin-team-input-wrap">
                      <FiBriefcase />

                      <input
                        type="text"
                        name="designation"
                        value={
                          form.designation
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="e.g. Solar Consultant"
                        required
                      />
                    </div>
                  </div>

                  {/* EMAIL */}

                  <div className="admin-team-field">
                    <label>
                      Email *
                    </label>

                    <div className="admin-team-input-wrap">
                      <FiMail />

                      <input
                        type="email"
                        name="email"
                        value={
                          form.email
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="member@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* PHONE */}

                  <div className="admin-team-field">
                    <label>
                      Phone
                    </label>

                    <div className="admin-team-input-wrap">
                      <FiPhone />

                      <input
                        type="text"
                        name="phone"
                        value={
                          form.phone
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  {/* EXPERIENCE */}

                  <div className="admin-team-field">
                    <label>
                      Experience
                    </label>

                    <div className="admin-team-input-wrap">
                      <FiBriefcase />

                      <input
                        type="text"
                        name="experience"
                        value={
                          form.experience
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="e.g. 8 Years"
                      />
                    </div>
                  </div>

                  {/* QUALIFICATION */}

                  <div className="admin-team-field">
                    <label>
                      Qualification
                    </label>

                    <div className="admin-team-input-wrap">
                      <FiBookOpen />

                      <input
                        type="text"
                        name="qualification"
                        value={
                          form.qualification
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="e.g. B.Tech Electrical"
                      />
                    </div>
                  </div>

                  {/* LOCATION */}

                  <div className="admin-team-field">
                    <label>
                      Location
                    </label>

                    <div className="admin-team-input-wrap">
                      <FiMapPin />

                      <input
                        type="text"
                        name="location"
                        value={
                          form.location
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="e.g. New Delhi, India"
                      />
                    </div>
                  </div>

                  {/* DISPLAY ORDER */}

                  <div className="admin-team-field">
                    <label>
                      Display Order
                    </label>

                    <input
                      type="number"
                      name="displayOrder"
                      value={
                        form.displayOrder
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* PROFESSIONAL DETAILS */}

              <div className="admin-team-section">
                <h3>
                  Professional Details
                </h3>

                {/* BIO */}

                <div className="admin-team-field">
                  <label>
                    Biography
                  </label>

                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={
                      handleChange
                    }
                    placeholder="Write a short biography..."
                    rows="5"
                  />
                </div>

                {/* SKILLS */}

                <div className="admin-team-field">
                  <label>
                    Skills
                  </label>

                  <input
                    type="text"
                    name="skills"
                    value={
                      form.skills
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Solar Design, Project Management, Engineering"
                  />

                  <small>
                    Separate multiple
                    skills with commas.
                  </small>
                </div>
              </div>

              {/* PROFILE & LINKS */}

              <div className="admin-team-section">
                <h3>
                  Profile & Links
                </h3>

                {/* IMAGE UPLOAD */}

                <div className="admin-team-field">
                  <label>
                    Profile Image
                  </label>

                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={
                      handleImageChange
                    }
                  />

                  {/* IMAGE PREVIEW */}

                  {(imagePreview ||
                    form.image) && (
                    <div className="admin-team-image-preview">
                      <img
                        src={
                          imagePreview ||
                          getImageUrl(
                            form.image
                          )
                        }
                        alt="Profile Preview"
                        onLoad={() => {
                          console.log(
                            "Preview image loaded:",
                            imagePreview ||
                              getImageUrl(
                                form.image
                              )
                          );
                        }}
                        onError={(e) => {
                          console.error(
                            "Failed to load preview image:",
                            e.currentTarget.src
                          );

                          e.currentTarget.style.display =
                            "none";
                        }}
                      />
                    </div>
                  )}

                  <small>
                    Upload JPG, JPEG,
                    PNG or WEBP.
                    Maximum size:
                    5MB.
                  </small>

                  {selectedImage && (
                    <small>
                      Selected:{" "}
                      <strong>
                        {
                          selectedImage.name
                        }
                      </strong>
                    </small>
                  )}
                </div>

                {/* LINKS */}

                <div className="admin-team-form-grid">
                  {/* LINKEDIN */}

                  <div className="admin-team-field">
                    <label>
                      LinkedIn URL
                    </label>

                    <div className="admin-team-input-wrap">
                      <FiLinkedin />

                      <input
                        type="url"
                        name="linkedin"
                        value={
                          form.linkedin
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                  </div>

                  {/* WEBSITE */}

                  <div className="admin-team-field">
                    <label>
                      Website URL
                    </label>

                    <div className="admin-team-input-wrap">
                      <FiGlobe />

                      <input
                        type="url"
                        name="website"
                        value={
                          form.website
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* STATUS */}

              <div className="admin-team-status-row">
                <div>
                  <strong>
                    Member Status
                  </strong>

                  <p>
                    Inactive members will
                    not appear on the
                    public team page.
                  </p>
                </div>

                <label className="admin-team-switch">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={
                      form.isActive
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <span></span>
                </label>
              </div>

              {/* ACTIONS */}

              <div className="admin-team-modal-actions">
                <button
                  type="button"
                  className="admin-team-cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-team-save-btn"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="admin-team-btn-loader"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCheck />

                      {editingMember
                        ? "Update Member"
                        : "Add Member"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeam;