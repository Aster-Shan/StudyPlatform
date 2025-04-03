"use client"

import { User } from "lucide-react"
import React from "react"
import { Link, Route, Routes } from "react-router-dom"
import ChatList from "../components/ChatList"
import ChatRoom from "../components/ChatRoom"
import NewChat from "../components/NewChat"
import ProfileImage from "../components/ProfileImage"
import { useAuth } from "../contexts/AuthContext"

const Chat: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="min-vh-100 bg-light d-flex flex-column w-100">
      {/* Enhanced Navbar - Similar to Home */}
      <header className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top w-100">
        <div className="container-fluid px-4 w-100">
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
                <Link to="/" className="nav-link d-flex align-items-center">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/chat" className="nav-link d-flex align-items-center active">
                  Chat
                </Link>
              </li>
            </ul>

            {/* Right-aligned items */}
            <div className="d-flex align-items-center">
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
                    src={user?.profilePictureUrl}
                    alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
                    size={32}
                    className="me-2"
                  />
                  <span className="d-none d-md-inline">{user?.firstName}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userDropdown">
                  <li>
                    <a className="dropdown-item d-flex align-items-center" href="/profile">
                      <User size={16} className="me-2" />
                      Profile
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="bg-white border-bottom py-2">
        <div className="container-fluid px-4 w-100">
          <ol className="breadcrumb mb-0 py-1">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Chat
            </li>
          </ol>
        </div>
      </nav>

      <div className="flex-grow-1 w-100">
        {/* Main Content */}
        <div className="container-fluid px-4 py-4 w-100">
          <Routes>
            <Route index element={<ChatList />} />
            <Route path="new" element={<NewChat />} />
            <Route path=":roomId" element={<ChatRoom />} />
          </Routes>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-top py-3 mt-auto w-100">
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
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Chat

