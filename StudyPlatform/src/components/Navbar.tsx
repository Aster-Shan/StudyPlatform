import { ChevronDown, LogOut, Settings, User } from 'lucide-react'
import React, { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  
  // Explicitly typing the dropdownRef
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // TypeScript error fix: Checking if dropdownRef.current is not null
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
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
              <li className="nav-item">
                <Link to="/documents" className="nav-link">
                  Documents
                </Link>
              </li>
            </>
          ) : (
            <></>
          )}
        </ul>

        {/* Auth buttons or user dropdown */}
        {user ? (
          <div className="dropdown" ref={dropdownRef} >
            <button
              className="btn btn-link dropdown-toggle p-0 d-flex align-items-center text-decoration-none"
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              aria-expanded={isProfileMenuOpen} 
              aria-haspopup="true"
              id="userDropdown"
            >
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
              <ChevronDown size={16} />
            </button>

            <ul 
              className={`dropdown-menu dropdown-menu-end ${isProfileMenuOpen ? 'show' : ''}`} 
              style={{ minWidth: "220px" }}
              aria-labelledby="userDropdown"
            >
              <li className="px-3 py-2 border-bottom">
                <p className="mb-0 fw-medium small">{user.firstName} {user.lastName}</p>
                <p className="mb-0 text-muted small">{user.email}</p>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="dropdown-item d-flex align-items-center py-2"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <User size={16} className="me-2" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="dropdown-item d-flex align-items-center py-2"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Settings size={16} className="me-2" />
                  Profile Settings
                </Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center py-2 text-danger"
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                    handleLogout()
                  }}
                >
                  <LogOut size={16} className="me-2" />
                  Log out
                </button>
              </li>
            </ul>
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
  )
}
