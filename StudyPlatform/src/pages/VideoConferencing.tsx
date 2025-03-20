"use client"

import { LogOut, Video } from "lucide-react"
import React, { useEffect } from "react"
import { Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom"
import VideoConference from "../components/VideoConference"
import VideoRooms from "../components/VideoRooms"
import { useAuth } from "../contexts/AuthContext"

// This component is used to extract the roomId from URL params
const VideoConferenceWrapper = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()

  // Handle leaving the room by navigating to the home page
  const handleLeaveRoom = () => {
    // Navigate to the home page instead of the video page
    navigate("/")
  }

  return <VideoConference roomId={roomId || ""} onLeaveRoom={handleLeaveRoom} />
}

export default function VideoConferencing() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === "/video") {
      document.title = "Video Conferencing | Study Platform"
    } else {
      document.title = "Meeting | Study Platform"
    }
  }, [location])

  const handleLogout = () => {
    logout()
    navigate("/login")
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

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Modern Header with Gradient */}
      <header
        className="navbar navbar-expand-lg navbar-dark"
        style={{
          background: "linear-gradient(135deg, #000000 0%, #2c3e50 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="container">
          {/* Brand */}
          <a href="/" className="navbar-brand fw-bold">
            StudyPlatform
          </a>

          {/* Nav links */}
          <ul className="navbar-nav me-auto d-flex flex-row">
            <li className="nav-item me-3">
              <a href="/" className="nav-link text-white opacity-75 hover-opacity-100">
                Home
              </a>
            </li>
            <li className="nav-item me-3">
              <a href="/documents" className="nav-link text-white opacity-75 hover-opacity-100">
                Documents
              </a>
            </li>
            <li className="nav-item me-3">
              <a href="/chat" className="nav-link text-white opacity-75 hover-opacity-100">
                Chat
              </a>
            </li>
            <li className="nav-item me-3">
              <a href="/video" className="nav-link text-white">
                <Video size={16} className="me-1" /> Video
              </a>
            </li>
            <li className="nav-item">
              <a href="/profile" className="nav-link text-white opacity-75 hover-opacity-100">
                Profile
              </a>
            </li>
          </ul>

          {/* User info */}
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center me-3">
              <div
                className="d-flex align-items-center justify-content-center bg-dark bg-opacity-50 rounded-circle me-2 border border-secondary"
                style={{ width: "38px", height: "38px" }}
              >
                {user.profilePictureUrl ? (
                  <img
                    src={user.profilePictureUrl || "/placeholder.svg"}
                    alt={user.firstName}
                    className="rounded-circle w-100 h-100 object-fit-cover"
                  />
                ) : (
                  <span className="fw-medium text-white">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </span>
                )}
              </div>
              <span className="d-none d-md-inline text-white">{user.firstName}</span>
            </div>
            <button className="btn btn-outline-light btn-sm d-flex align-items-center" onClick={handleLogout}>
              <LogOut size={16} className="me-2" />
              <span className="d-none d-md-inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Page Title Section */}
      <div className="bg-light py-4 border-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="h3 mb-0">Video Conferencing</h1>
              <p className="text-muted mb-0">Connect with others through video meetings</p>
            </div>
            <div className="col-md-6">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 justify-content-md-end">
                  <li className="breadcrumb-item">
                    <a href="/" className="text-decoration-none">
                      Home
                    </a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Video
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4 flex-grow-1">
        <Routes>
          <Route path="/" element={<VideoRooms />} />
          <Route path="/:roomId" element={<VideoConferenceWrapper />} />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-auto">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0 small">© 2023 StudyPlatform. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <ul className="list-inline mb-0">
                <li className="list-inline-item">
                  <a href="#" className="text-white-50 small text-decoration-none">
                    Privacy Policy
                  </a>
                </li>
                <li className="list-inline-item">
                  <span className="text-white-50">•</span>
                </li>
                <li className="list-inline-item">
                  <a href="#" className="text-white-50 small text-decoration-none">
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

