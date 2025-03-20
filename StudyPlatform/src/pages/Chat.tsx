"use client"

import {
  Bell,
  ChevronRight,
  HomeIcon,
  Menu,
  MessageSquare,
  Plus,
  Search,
  Shield,
  User,
  Users,
  Video,
} from "lucide-react"
import React, { useEffect, useState } from "react"
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import ChatList from "../components/ChatList"
import ChatRoom from "../components/ChatRoom"
import NewChat from "../components/NewChat"
import { useAuth } from "../contexts/AuthContext"

export default function Chat() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Simulate loading time (remove this in production)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path ? "active" : ""
  }

  // If no user, show loading
  if (!user) {
    return (
      <div className="vh-100 vw-100 d-flex justify-content-center align-items-center bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="vh-100 vw-100 d-flex justify-content-center align-items-center bg-light">
        <div className="d-flex flex-column align-items-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Enhanced Navbar */}
      <header className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top">
        <div className="container-fluid px-4">
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
                  <ChevronRight size={18} className="me-2 d-none d-sm-inline" />
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
                <Link to="/forum" className={`nav-link d-flex align-items-center ${isActive("/forum")}`}>
                  <Users size={18} className="me-2 d-none d-sm-inline" />
                  Forum
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
                        <Video size={16} className="text-success" />
                      </div>
                      <div>
                        <p className="mb-0 small">Video call invitation</p>
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
                  <div
                    className="d-flex align-items-center justify-content-center bg-light rounded-circle me-2"
                    style={{ width: "32px", height: "32px" }}
                  >
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
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userDropdown">
                  <li>
                    <Link to="/profile" className="dropdown-item d-flex align-items-center">
                      <User size={16} className="me-2" />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item d-flex align-items-center" onClick={() => navigate("/login")}>
                      <ChevronRight size={16} className="me-2" />
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
              <ChevronRight size={18} className="me-3" />
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
              to="/forum"
              className={`list-group-item list-group-item-action d-flex align-items-center ${isActive("/forum")}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Users size={18} className="me-3" />
              Forum
            </Link>
            <Link
              to="/video"
              className={`list-group-item list-group-item-action d-flex align-items-center ${isActive("/video")}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Video size={18} className="me-3" />
              Video Conferencing
            </Link>
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

      <div className="flex-grow-1">
        {/* Modern Header with Gradient */}
        <div
          className="w-100 text-white py-5"
          style={{
            background: "linear-gradient(135deg, #000000 0%, #2c3e50 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div className="container-fluid px-4">
            <div className="row align-items-center">
              <div className="col-lg-7">
                <h1 className="display-5 fw-bold mb-1">Chat</h1>
                <p className="lead opacity-75 mb-0">Connect with friends</p>
                <div className="d-flex align-items-center mt-3">
                  <span className="badge bg-success d-flex align-items-center px-3 py-2">
                    <Shield size={14} className="me-1" />
                    End-to-End Encrypted
                  </span>
                  <span className="ms-3 text-white-50">
                    Last message: {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
              <div className="col-lg-5 text-lg-end mt-4 mt-lg-0">
                <button
                  className="btn btn-primary btn-lg d-inline-flex align-items-center"
                  onClick={() => navigate("/chat/new")}
                >
                  <Plus size={20} className="me-2" />
                  New Conversation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="bg-white border-bottom py-2">
          <div className="container-fluid px-4">
            <ol className="breadcrumb mb-0 py-1">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none">
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Chat
              </li>
            </ol>
          </div>
        </nav>

        {/* Quick Actions Bar */}
        <div className="bg-white border-bottom shadow-sm py-3">
          <div className="container-fluid px-4">
            <div className="row">
              <div className="col-12">
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <div className="d-flex align-items-center mb-2 mb-md-0">
                    <span className="text-muted me-3">Quick Actions:</span>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary d-flex align-items-center"
                        onClick={() => navigate("/chat/new")}
                      >
                        <Plus size={16} className="me-2" />
                        New Chat
                      </button>
                      <button className="btn btn-sm btn-outline-secondary d-flex align-items-center">
                        <Search size={16} className="me-2" />
                        Search Messages
                      </button>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="dropdown">
                      <button
                        className="btn btn-sm btn-light dropdown-toggle d-flex align-items-center"
                        type="button"
                        id="filterDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <Users size={16} className="me-2" />
                        Filter
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="filterDropdown">
                        <li>
                          <a className="dropdown-item" href="#">
                            All Conversations
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Unread
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Recent
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Archived
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container-fluid px-4 py-4 flex-grow-1">
          <Routes>
            <Route index element={<ChatList />} />
            <Route path="new" element={<NewChat />} />
            <Route path=":roomId" element={<ChatRoom />} />
          </Routes>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-top py-3 mt-auto">
        <div className="container-fluid px-4">
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
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

