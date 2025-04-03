"use client"
import {
  Bell,
  ChevronRight,
  FileText,
  HomeIcon,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Shield,
  User,
  Video,
  Zap,
} from "lucide-react"
import React, { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import "../App.css"
import ProfileImage from "../components/ProfileImage"
import { useAuth } from "../contexts/AuthContext"

export default function Home() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Function to handle logout
  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // Functions to navigate
  const goToProfile = () => navigate("/profile")
  const goToDocuments = () => navigate("/documents")
  const goToChat = () => navigate("/chat")
  const goToVideo = () => navigate("/video")
  const goToAITools = () => navigate("/ai-tools")

  // Function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path ? "active" : ""
  }

  if (!user) {
    return (
      <div className="vh-100 vw-100 d-flex justify-content-center align-items-center bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  // Get current date for the greeting
  const currentHour = new Date().getHours()
  let greeting = "Good morning"
  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon"
  } else if (currentHour >= 17) {
    greeting = "Good evening"
  }

  return (
    <div className="min-vh-100 bg-light d-flex flex-column w-100">
      {/* Enhanced Navbar */}
      <header className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top w-100">
        <div className="container-fluid px-4 w-100">
          {/* Mobile sidebar toggle */}
          <button className="btn btn-link text-dark me-3 d-lg-none" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </button>

          {/* Brand */}
          <Link to="/" className="navbar-brand fw-bold me-auto me-lg-4">
            StudyPlatform
          </Link>

          {/* Collapsible navigation */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            {/* Main navigation links */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/" className={`nav-link d-flex align-items-center ${isActive("/")}`}>
                  <HomeIcon size={18} className="me-2 d-none d-sm-inline" />
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/documents" className={`nav-link d-flex align-items-center ${isActive("/documents")}`}>
                  <FileText size={18} className="me-2 d-none d-sm-inline" />
                  Documents
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/chat" className={`nav-link d-flex align-items-center ${isActive("/chat")}`}>
                  <MessageSquare size={18} className="me-2 d-none d-sm-inline" />
                  Chat
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/video" className={`nav-link d-flex align-items-center ${isActive("/video")}`}>
                  <Video size={18} className="me-2 d-none d-sm-inline" />
                  Video
                </Link>
              </li>
            </ul>

            {/* Right-aligned items */}
            <div className="d-flex align-items-center">
              {/* Notifications */}
              <div className="dropdown me-3">
                <button
                  className="btn btn-light position-relative"
                  id="notificationsDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <Bell size={18} />
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    2
                  </span>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end shadow"
                  aria-labelledby="notificationsDropdown"
                  style={{ minWidth: "300px" }}
                >
                  <li>
                    <h6 className="dropdown-header">Notifications</h6>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item d-flex align-items-center py-2" href="#">
                      <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                        <MessageSquare size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="mb-0 small">New message from John Doe</p>
                        <p className="text-muted mb-0 x-small">5 minutes ago</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item d-flex align-items-center py-2" href="#">
                      <div className="rounded-circle bg-success bg-opacity-10 p-2 me-3">
                        <FileText size={16} className="text-success" />
                      </div>
                      <div>
                        <p className="mb-0 small">Document shared with you</p>
                        <p className="text-muted mb-0 x-small">1 hour ago</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item text-center small" href="#">
                      View all notifications
                    </a>
                  </li>
                </ul>
              </div>

              {/* User dropdown */}
              <div className="dropdown">
                <button
                  className="btn btn-link text-decoration-none text-dark dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <ProfileImage
                    src={user.profilePictureUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    size={32}
                    className="me-2"
                  />
                  <span className="d-none d-md-inline">{user.firstName}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userDropdown">
                  <li>
                    <button className="dropdown-item d-flex align-items-center" onClick={goToProfile}>
                      <User size={16} className="me-2" />
                      Profile
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item d-flex align-items-center" onClick={goToProfile}>
                      <Settings size={16} className="me-2" />
                      Settings
                    </button>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item d-flex align-items-center" onClick={handleLogout}>
                      <LogOut size={16} className="me-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div className={`offcanvas offcanvas-start ${sidebarOpen ? "show" : ""}`} tabIndex={-1} id="sidebar">
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title">StudyPlatform</h5>
          <button type="button" className="btn-close text-reset" onClick={() => setSidebarOpen(false)}></button>
        </div>
        <div className="offcanvas-body p-0">
          <div className="list-group list-group-flush">
            <Link
              to="/"
              className={`list-group-item list-group-item-action d-flex align-items-center ${isActive("/")}`}
              onClick={() => setSidebarOpen(false)}
            >
              <HomeIcon size={18} className="me-3" />
              Home
            </Link>
            <Link
              to="/documents"
              className={`list-group-item list-group-item-action d-flex align-items-center ${isActive("/documents")}`}
              onClick={() => setSidebarOpen(false)}
            >
              <FileText size={18} className="me-3" />
              Documents
            </Link>
            <Link
              to="/chat"
              className={`list-group-item list-group-item-action d-flex align-items-center ${isActive("/chat")}`}
              onClick={() => setSidebarOpen(false)}
            >
              <MessageSquare size={18} className="me-3" />
              Chat
            </Link>
            <Link
              to="/video"
              className={`list-group-item list-group-item-action d-flex align-items-center ${isActive("/video")}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Video size={18} className="me-3" />
              Video Conferencing
            </Link>
            <hr className="my-2" />
            <Link
              to="/profile"
              className={`list-group-item list-group-item-action d-flex align-items-center ${isActive("/profile")}`}
              onClick={() => setSidebarOpen(false)}
            >
              <User size={18} className="me-3" />
              Profile
            </Link>
            <button
              className="list-group-item list-group-item-action d-flex align-items-center text-danger"
              onClick={handleLogout}
            >
              <LogOut size={18} className="me-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1040 }}
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="content-area">
        {/* Modern Header with Gradient */}
        <div
          className="w-100 text-white py-5"
          style={{
            background: "linear-gradient(135deg, #000000 0%, #2c3e50 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div className="container-fluid px-4 w-100">
            <div className="row align-items-center">
              <div className="col-lg-7">
                <h1 className="display-5 fw-bold mb-1">
                  {greeting}, {user.firstName}!
                </h1>
                <p className="lead opacity-75 mb-0">Welcome to your secure dashboard</p>
                <div className="d-flex align-items-center mt-3">
                  <span className="badge bg-success d-flex align-items-center px-3 py-2">
                    <Shield size={14} className="me-1" />
                    Account Secured
                  </span>
                  <span className="ms-3 text-white-50">
                    Last login: Today at {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
              <div className="col-lg-5 text-lg-end mt-4 mt-lg-0">
                <div className="d-inline-flex align-items-center p-3 bg-white bg-opacity-10 rounded-3 shadow-sm">
                  <div className="me-3 position-relative">
                    <ProfileImage src={user.profilePictureUrl} alt={`${user.firstName} ${user.lastName}`} size={80} />
                    <span
                      className="position-absolute bottom-0 end-0 bg-success rounded-circle p-1 border border-dark"
                      style={{ width: "16px", height: "16px" }}
                    ></span>
                  </div>
                  <div>
                    <h5 className="mb-0 text-white">
                      {user.firstName} {user.lastName}
                    </h5>
                    <p className="mb-1 small text-white text-opacity-75">{user.email}</p>
                    <div className="d-flex align-items-center">
                      <span className="badge bg-success">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="bg-white border-bottom py-2">
          <div className="container-fluid px-4 w-100">
            <ol className="breadcrumb mb-0 py-1">
              <li className="breadcrumb-item active" aria-current="page">
                Home
              </li>
            </ol>
          </div>
        </nav>

        {/* Quick Actions Bar */}
        <div className="bg-white border-bottom shadow-sm py-3">
          <div className="container-fluid px-4 w-100">
            <div className="row">
              <div className="col-12">
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <div className="d-flex align-items-center mb-2 mb-md-0">
                    <span className="text-muted me-3">Quick Actions:</span>
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                        onClick={goToDocuments}
                      >
                        <FileText size={16} className="me-2" />
                        New Document
                      </button>
                      <button className="btn btn-sm btn-outline-secondary d-flex align-items-center" onClick={goToChat}>
                        <MessageSquare size={16} className="me-2" />
                        New Chat
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                        onClick={goToVideo}
                      >
                        <Video size={16} className="me-2" />
                        Start Meeting
                      </button>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <button className="btn btn-sm btn-primary d-flex align-items-center" onClick={goToProfile}>
                      <Settings size={16} className="me-2" />
                      Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container-fluid px-4 py-4 w-100">
          {/* Feature Cards */}
          <div className="row g-4 mb-4 w-100">
            <div className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100 custom-card">
                <div className="card-body p-4 text-center">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-flex mb-3">
                    <MessageSquare size={32} className="text-primary" />
                  </div>
                  <h5 className="card-title">Chat</h5>
                  <p className="card-text text-muted">
                    Connect with other students and teachers through instant messaging.
                  </p>
                  <button onClick={goToChat} className="btn btn-outline-primary mt-2">
                    Open Chat
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100 custom-card">
                <div className="card-body p-4 text-center">
                  <div className="rounded-circle bg-success bg-opacity-10 p-3 d-inline-flex mb-3">
                    <Video size={32} className="text-success" />
                  </div>
                  <h5 className="card-title">Video</h5>
                  <p className="card-text text-muted">Join or create video meetings for real-time collaboration.</p>
                  <button onClick={goToVideo} className="btn btn-outline-success mt-2">
                    Start Video
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100 custom-card">
                <div className="card-body p-4 text-center">
                  <div className="rounded-circle bg-warning bg-opacity-10 p-3 d-inline-flex mb-3">
                    <FileText size={32} className="text-warning" />
                  </div>
                  <h5 className="card-title">Documents</h5>
                  <p className="card-text text-muted">Access and manage your study materials and resources.</p>
                  <button onClick={goToDocuments} className="btn btn-outline-warning mt-2">
                    View Documents
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100 custom-card">
                <div className="card-body p-4 text-center">
                  <div
                    className="rounded-circle bg-purple bg-opacity-10 p-3 d-inline-flex mb-3"
                    style={{ backgroundColor: "rgba(128, 0, 128, 0.1)" }}
                  >
                    <Zap size={32} style={{ color: "purple" }} />
                  </div>
                  <h5 className="card-title">AI Tools</h5>
                  <p className="card-text text-muted">Generate images from documents using our AI-powered tools.</p>
                  <button onClick={goToAITools} className="btn btn-outline-secondary mt-2">
                    Try AI Tools
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="row g-4 mb-4 w-100">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 custom-card">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                      <Shield size={24} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="mb-0">Security Score</h6>
                      <h3 className="mb-0 mt-1">{user.using2FA ? "92" : "68"}/100</h3>
                    </div>
                  </div>
                  <div className="progress" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{ width: user.using2FA ? "92%" : "68%" }}
                      aria-valuenow={user.using2FA ? 92 : 68}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                  <p className="text-muted mt-3 mb-0 small">
                    {user.using2FA
                      ? "Your account is well-protected. Consider updating your password regularly."
                      : "Enable 2FA to increase your security score by 24 points."}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-8">
              <div className="card border-0 shadow-sm h-100 custom-card">
                <div className="card-body p-4">
                  <h5 className="card-title mb-3">Account Activity</h5>
                  <div className="table-responsive">
                    <table className="table table-sm mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">Activity</th>
                          <th scope="col">Device</th>
                          <th scope="col">Location</th>
                          <th scope="col">Date</th>
                          <th scope="col">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Login</td>
                          <td>
                            {navigator.userAgent.includes("Windows")
                              ? "Chrome on Windows"
                              : navigator.userAgent.includes("Mac")
                                ? "Chrome on Mac"
                                : navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad")
                                  ? "Safari on iOS"
                                  : navigator.userAgent.includes("Android")
                                    ? "Chrome on Android"
                                    : "Unknown Device"}
                          </td>
                          <td>New York, US</td>
                          <td>Today, {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                          <td>
                            <span className="badge bg-success">Success</span>
                          </td>
                        </tr>
                        <tr>
                          <td>Document Upload</td>
                          <td>
                            {navigator.userAgent.includes("Windows")
                              ? "Chrome on Windows"
                              : navigator.userAgent.includes("Mac")
                                ? "Chrome on Mac"
                                : navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad")
                                  ? "Safari on iOS"
                                  : navigator.userAgent.includes("Android")
                                    ? "Chrome on Android"
                                    : "Unknown Device"}
                          </td>
                          <td>New York, US</td>
                          <td>Yesterday, 3:45 PM</td>
                          <td>
                            <span className="badge bg-success">Success</span>
                          </td>
                        </tr>
                        <tr>
                          <td>Password Changed</td>
                          <td>
                            {navigator.userAgent.includes("Windows")
                              ? "Firefox on Windows"
                              : navigator.userAgent.includes("Mac")
                                ? "Firefox on Mac"
                                : "Unknown Device"}
                          </td>
                          <td>New York, US</td>
                          <td>{new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}, 10:22 AM</td>
                          <td>
                            <span className="badge bg-success">Success</span>
                          </td>
                        </tr>
                        <tr>
                          <td>Login Attempt</td>
                          <td>Unknown Device</td>
                          <td>Beijing, CN</td>
                          <td>{new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}, 2:17 AM</td>
                          <td>
                            <span className="badge bg-danger">Blocked</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="text-end mt-3">
                    <button className="btn btn-sm btn-link text-decoration-none">View Full Activity Log</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mx-0 w-100">
            {/* Profile Overview Card */}
            <div className="col-md-6 col-xl-4 px-2">
              <div className="card border-0 shadow-sm h-100 custom-card">
                <div className="card-header bg-white border-bottom-0 pt-4 d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="card-title mb-0">Profile Overview</h5>
                    <p className="card-subtitle text-muted small">Your personal information</p>
                  </div>
                  {(() => {
                    // Calculate profile completion percentage
                    const totalFields = 5
                    let completedFields = 0

                    if (user.firstName && user.lastName) completedFields++
                    if (user.email) completedFields++
                    if (user.bio) completedFields++
                    if (user.academicInterests && user.academicInterests.length > 0) completedFields++
                    if (user.profilePictureUrl) completedFields++

                    const completionPercentage = Math.round((completedFields / totalFields) * 100)

                    return (
                      <span className="badge bg-primary bg-opacity-10 text-primary">
                        {completionPercentage}% Complete
                      </span>
                    )
                  })()}
                </div>
                <div className="card-body">
                  {user.bio ? (
                    <div>
                      <h6 className="small fw-bold">Bio</h6>
                      <p className="small text-muted">{user.bio}</p>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="mb-3">
                        <div
                          className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center"
                          style={{ width: "90px", height: "90px" }}
                        >
                          <User size={40} className="text-secondary" />
                        </div>
                      </div>
                      <p className="text-muted">No bio added yet. Add information about yourself.</p>
                      <button className="btn btn-outline-primary btn-sm" onClick={goToProfile}>
                        Add Bio
                      </button>
                    </div>
                  )}
                </div>
                <div className="card-footer bg-white border-top-0 text-end">
                  <button className="btn btn-link text-decoration-none p-0" onClick={goToProfile}>
                    Edit Profile <ChevronRight size={16} className="ms-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Academic Interests Card */}
            <div className="col-md-6 col-xl-4 px-2">
              <div className="card border-0 shadow-sm h-100 custom-card">
                <div className="card-header bg-white border-bottom-0 pt-4">
                  <h5 className="card-title mb-0">Academic Interests</h5>
                  <p className="card-subtitle text-muted small">Your areas of study</p>
                </div>
                <div className="card-body">
                  {user.academicInterests && user.academicInterests.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {user.academicInterests.map((interest, index) => (
                        <span key={index} className="badge bg-primary rounded-pill px-3 py-2">
                          {interest}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="mb-3">
                        <div
                          className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center"
                          style={{ width: "90px", height: "90px" }}
                        >
                          <FileText size={40} className="text-secondary" />
                        </div>
                      </div>
                      <p className="text-muted">No academic interests added yet.</p>
                      <button className="btn btn-outline-primary btn-sm" onClick={goToProfile}>
                        Add Interests
                      </button>
                    </div>
                  )}
                </div>
                <div className="card-footer bg-white border-top-0 text-end">
                  <button className="btn btn-link text-decoration-none p-0" onClick={goToProfile}>
                    Manage Interests <ChevronRight size={16} className="ms-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Account Security Card */}
            <div className="col-md-6 col-xl-4 px-2">
              <div className="card border-0 shadow-sm h-100 custom-card">
                <div className="card-header bg-white border-bottom-0 pt-4">
                  <h5 className="card-title mb-0">Account Security</h5>
                  <p className="card-subtitle text-muted small">Your security settings</p>
                </div>
                <div className="card-body">
                  <div className="list-group list-group-flush">
                    <div className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0">Two-Factor Authentication</h6>
                          <p className="text-muted small mb-0">Enhance your account security</p>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="twoFactorSwitch"
                            checked={user.using2FA}
                            readOnly
                          />
                          <label className="form-check-label visually-hidden" htmlFor="twoFactorSwitch">
                            Toggle 2FA
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0">Password</h6>
                          <p className="text-muted small mb-0">Last updated: 3 days ago</p>
                        </div>
                        <button className="btn btn-outline-secondary btn-sm">Change</button>
                      </div>
                    </div>

                    <div className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0">Email Verification</h6>
                          <p className="text-muted small mb-0">Your email is verified</p>
                        </div>
                        <span className="badge bg-success">Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-white border-top-0 text-end">
                  <button className="btn btn-link text-decoration-none p-0" onClick={goToProfile}>
                    Security Settings <ChevronRight size={16} className="ms-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Features Banner */}
          <div className="row mt-4 mb-5 mx-0 w-100">
            <div className="col-12 px-2">
              <div className="card border-0 shadow-sm overflow-hidden w-100 custom-card">
                <div className="card-body p-0">
                  <div className="row g-0">
                    <div className="col-lg-8 p-4">
                      <h4 className="mb-2">Complete Your Profile</h4>
                      {(() => {
                        // Calculate profile completion percentage based on user data
                        const totalFields = 5 // Total number of profile fields we're checking
                        let completedFields = 0

                        if (user.firstName && user.lastName) completedFields++
                        if (user.email) completedFields++
                        if (user.bio) completedFields++
                        if (user.academicInterests && user.academicInterests.length > 0) completedFields++
                        if (user.profilePictureUrl) completedFields++

                        const completionPercentage = Math.round((completedFields / totalFields) * 100)

                        return (
                          <>
                            <p className="text-muted mb-3">
                              Add more information to your profile to get the most out of our platform. Your profile is
                              currently {completionPercentage}% complete.
                            </p>
                            <div className="progress mb-3" style={{ height: "8px" }}>
                              <div
                                className="progress-bar bg-primary"
                                role="progressbar"
                                style={{ width: `${completionPercentage}%` }}
                                aria-valuenow={completionPercentage}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              ></div>
                            </div>
                            {completionPercentage < 100 && (
                              <div className="mb-3">
                                <p className="small text-muted mb-2">To complete your profile:</p>
                                <ul className="small text-muted ps-3 mb-3">
                                  {!user.bio && <li>Add a personal bio</li>}
                                  {(!user.academicInterests || user.academicInterests.length === 0) && (
                                    <li>Add your academic interests</li>
                                  )}
                                  {!user.profilePictureUrl && <li>Upload a profile picture</li>}
                                </ul>
                              </div>
                            )}
                            <button className="btn btn-primary" onClick={goToProfile}>
                              {completionPercentage < 100 ? "Complete Profile" : "Edit Profile"}
                            </button>
                          </>
                        )
                      })()}
                    </div>
                    <div
                      className="col-lg-4 bg-primary text-white p-4"
                      style={{
                        background: "linear-gradient(45deg, #4b6cb7 0%, #182848 100%)",
                      }}
                    >
                      <h5 className="mb-3">Premium Features Available</h5>
                      <ul className="list-unstyled mb-4">
                        <li className="mb-2 d-flex align-items-center">
                          <span className="me-2">✓</span> Advanced security monitoring
                        </li>
                        <li className="mb-2 d-flex align-items-center">
                          <span className="me-2">✓</span> Priority customer support
                        </li>
                        <li className="d-flex align-items-center">
                          <span className="me-2">✓</span> Unlimited document storage
                        </li>
                      </ul>
                      <button className="btn btn-light">Upgrade Now</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-top py-3 mt-auto">
        <div className="container-fluid px-4 w-100">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0 text-muted small">© 2023 StudyPlatform. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <ul className="list-inline mb-0">
                <li className="list-inline-item">
                  <a href="#" className="text-muted small">
                    Privacy Policy
                  </a>
                </li>
                <li className="list-inline-item">
                  <span className="text-muted">•</span>
                </li>
                <li className="list-inline-item">
                  <a href="#" className="text-muted small">
                    Terms of Service
                  </a>
                </li>
                <li className="list-inline-item">
                  <span className="text-muted">•</span>
                </li>
                <li className="list-inline-item">
                  <a href="#" className="text-muted small">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

