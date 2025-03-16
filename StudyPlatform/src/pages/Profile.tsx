import { AlertCircle, LogOut, Upload } from 'lucide-react';
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    bio: user?.bio || "",
    academicInterests: user?.academicInterests?.join(", ") || "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const academicInterests = formData.academicInterests
        .split(",")
        .map((interest) => interest.trim())
        .filter((interest) => interest !== "");

      const response = await api.put("/api/users/profile", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        academicInterests,
      });

      updateUser(response.data);
      setSuccess("Profile updated successfully");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to update profile');
      } else {
        setError('Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/api/users/profile/picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      updateUser({ profilePictureUrl: response.data });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to upload image');
      } else {
        setError('Failed to upload image');
      }
    } finally {
      setUploadingImage(false);
    }
  };

  if (!user) {
    return (
      <div className="vh-100 vw-100 d-flex justify-content-center align-items-center bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Custom Navbar */}
      <header className="navbar navbar-light bg-white border-bottom">
        <div className="container ms-2">
          {/* Brand */}
          <Link to="/" className="navbar-brand fw-bold">
            UserManagement
          </Link>

          {/* Nav links */}
          <ul className="navbar-nav me-auto d-flex flex-row">
            {user ? (
              <>
                <li className="nav-item me-3">
                  <Link to="/" className="nav-link">
                    Home
                  </Link>
                </li>
                <li className="nav-item me-3">
                  <Link to="/documents" className="nav-link">
                    Documents
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link active">
                    Profile
                  </Link>
                </li>
              </>
            ) : (
              <></>
            )}
          </ul>

          {/* Auth buttons or user info */}
          {user ? (
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center me-3">
                <div className="d-flex align-items-center justify-content-center bg-light rounded-circle me-2" style={{ width: "32px", height: "32px" }}>
                  {user.profilePictureUrl ? (
                    <img
                      src={user.profilePictureUrl || "/placeholder.svg"}
                      alt={user.firstName}
                      className="rounded-circle w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <span className="fw-medium text-secondary">
                      {user.firstName?.charAt(0)}
                      {user.lastName?.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="d-none d-md-inline">{user.firstName}</span>
              </div>
              <button 
                className="btn btn-outline-danger btn-sm d-flex align-items-center"
                onClick={handleLogout}
              >
                <LogOut size={16} className="me-2" />
                <span className="d-none d-md-inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="d-flex">
              <Link to="/login" className="btn btn-outline-secondary me-2">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </header>
      
      <div className="flex-grow-1">
        {/* Header with Gradient */}
        <div className="w-100 text-white py-4" 
             style={{ 
               background: "linear-gradient(135deg, #000000 0%, #2c3e50 100%)",
               borderBottom: "1px solid rgba(255,255,255,0.1)"
             }}>
          <div className="container px-4">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h1 className="display-5 fw-bold mb-1">Profile Settings</h1>
                <p className="lead opacity-75 mb-0">Manage your account information and preferences</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container px-4 py-4">
          {/* Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "general" ? "active" : ""}`} 
                onClick={() => setActiveTab("general")}
              >
                General
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "security" ? "active" : ""}`} 
                onClick={() => setActiveTab("security")}
              >
                Security
              </button>
            </li>
          </ul>

          {/* Alerts */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
              <AlertCircle size={18} className="me-2" />
              <div>{error}</div>
            </div>
          )}

          {success && (
            <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
              <div>{success}</div>
            </div>
          )}

          {activeTab === "general" && (
            <div className="row g-4">
              {/* Profile Picture */}
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-white border-bottom-0 pt-4">
                    <h5 className="card-title mb-0">Profile Picture</h5>
                    <p className="card-subtitle text-muted small">Update your profile image</p>
                  </div>
                  <div className="card-body d-flex flex-column align-items-center">
                    <div className="mb-4 position-relative">
                      {user.profilePictureUrl ? (
                        <img
                          src={user.profilePictureUrl || "/placeholder.svg"}
                          alt={user.firstName}
                          className="rounded-circle"
                          style={{ width: "120px", height: "120px", objectFit: "cover" }}
                        />
                      ) : (
                        <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" 
                             style={{ width: "120px", height: "120px" }}>
                          <span className="fs-1 text-white">
                            {user.firstName?.charAt(0)}
                            {user.lastName?.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="w-100">
                      <input id="picture" type="file" accept="image/*" className="d-none" onChange={handleImageUpload} />
                      <button
                        className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
                        onClick={() => document.getElementById("picture")?.click()}
                        disabled={uploadingImage}
                      >
                        <Upload size={16} className="me-2" />
                        {uploadingImage ? "Uploading..." : "Upload Image"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="col-md-8">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-white border-bottom-0 pt-4">
                    <h5 className="card-title mb-0">Personal Information</h5>
                    <p className="card-subtitle text-muted small">Update your personal details</p>
                  </div>
                  <div className="card-body">
                    <form id="profile-form" onSubmit={handleSubmit}>
                      <div className="row mb-3">
                        <div className="col-md-6 mb-3 mb-md-0">
                          <label htmlFor="firstName" className="form-label">First Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="lastName" className="form-label">Last Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control bg-light"
                          id="email"
                          value={user.email}
                          disabled
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="bio" className="form-label">Bio</label>
                        <textarea
                          className="form-control"
                          id="bio"
                          name="bio"
                          rows={4}
                          placeholder="Tell us about yourself"
                          value={formData.bio}
                          onChange={handleChange}
                        ></textarea>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="academicInterests" className="form-label">
                          Academic Interests <span className="text-muted small">(comma separated)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="academicInterests"
                          name="academicInterests"
                          placeholder="e.g. Computer Science, Mathematics, Physics"
                          value={formData.academicInterests}
                          onChange={handleChange}
                        />
                      </div>
                    </form>
                  </div>
                  <div className="card-footer bg-white border-top-0 text-end">
                    <button
                      type="submit"
                      form="profile-form"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="row g-4">
              {/* Two-Factor Authentication */}
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-bottom-0 pt-4">
                    <h5 className="card-title mb-0">Two-Factor Authentication</h5>
                    <p className="card-subtitle text-muted small">Add an extra layer of security to your account</p>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">Two-Factor Authentication</h6>
                        <p className="text-muted small mb-0">
                          {user.using2FA
                            ? "Your account is protected with two-factor authentication."
                            : "Protect your account with two-factor authentication."}
                        </p>
                      </div>
                      <div>
                        <span className={`badge ${user.using2FA ? "bg-success" : "bg-secondary"} me-3`}>
                          {user.using2FA ? "Enabled" : "Disabled"}
                        </span>
                        <button
                          className={`btn ${user.using2FA ? "btn-outline-primary" : "btn-primary"}`}
                          onClick={() => (window.location.href = "/setup-2fa")}
                        >
                          {user.using2FA ? "Manage 2FA" : "Enable 2FA"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-bottom-0 pt-4">
                    <h5 className="card-title mb-0">Password</h5>
                    <p className="card-subtitle text-muted small">Change your password</p>
                  </div>
                  <div className="card-body">
                    <form>
                      <div className="mb-3">
                        <label htmlFor="currentPassword" className="form-label">Current Password</label>
                        <input type="password" className="form-control" id="currentPassword" />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input type="password" className="form-control" id="newPassword" />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                        <input type="password" className="form-control" id="confirmPassword" />
                      </div>
                    </form>
                  </div>
                  <div className="card-footer bg-white border-top-0 text-end">
                    <button className="btn btn-primary">Update Password</button>
                  </div>
                </div>
              </div>

              {/* Account Security */}
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-bottom-0 pt-4">
                    <h5 className="card-title mb-0">Security Status</h5>
                    <p className="card-subtitle text-muted small">Your account security overview</p>
                  </div>
                  <div className="card-body">
                    <div className="mb-4">
                      <h6 className="mb-2">Security Score</h6>
                      <div className="progress" style={{ height: "8px" }}>
                        <div 
                          className="progress-bar bg-primary" 
                          role="progressbar" 
                          style={{ width: user.using2FA ? "100%" : "75%" }} 
                          aria-valuenow={user.using2FA ? 100 : 75} 
                          aria-valuemin={0} 
                          aria-valuemax={100}
                        ></div>
                      </div>
                      <p className="text-muted small mt-2">
                        {user.using2FA 
                          ? "Your account has maximum security protection." 
                          : "Enable 2FA to increase your security score."}
                      </p>
                    </div>

                    <div className="list-group list-group-flush">
                      <div className="list-group-item border-0 px-0 d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0">Email Verification</h6>
                          <p className="text-muted small mb-0">Your email is verified</p>
                        </div>
                        <span className="badge bg-success">Verified</span>
                      </div>
                      
                      <div className="list-group-item border-0 px-0 d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0">Two-Factor Authentication</h6>
                          <p className="text-muted small mb-0">Extra account protection</p>
                        </div>
                        <span className={`badge ${user.using2FA ? "bg-success" : "bg-secondary"}`}>
                          {user.using2FA ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                      
                      <div className="list-group-item border-0 px-0 d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0">Password Strength</h6>
                          <p className="text-muted small mb-0">Last updated: 3 days ago</p>
                        </div>
                        <span className="badge bg-warning text-dark">Medium</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-top py-3 mt-auto">
        <div className="container px-4">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0 text-muted small">© 2023 UserManagement. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <ul className="list-inline mb-0">
                <li className="list-inline-item"><a href="#" className="text-muted small">Privacy Policy</a></li>
                <li className="list-inline-item"><span className="text-muted">•</span></li>
                <li className="list-inline-item"><a href="#" className="text-muted small">Terms of Service</a></li>
                <li className="list-inline-item"><span className="text-muted">•</span></li>
                <li className="list-inline-item"><a href="#" className="text-muted small">Contact Support</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}