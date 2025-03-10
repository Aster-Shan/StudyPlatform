"use client"

import { ChevronDown, LogOut, Menu, Settings, User, X } from "lucide-react"
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="border-b bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="container flex h-16 items-center justify-between py-4 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold">
            UserManagement
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link to="/" className="text-sm font-medium transition-colors hover:text-blue-600">
                Home
              </Link>
              <Link to="/documents" className="text-sm font-medium transition-colors hover:text-blue-600">
                Documents
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium transition-colors hover:text-blue-600">
                Login
              </Link>
              <Link to="/register" className="text-sm font-medium transition-colors hover:text-blue-600">
                Register
              </Link>
            </>
          )}
        </nav>

        {user ? (
          <div className="relative">
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {user.profilePictureUrl ? (
                  <img
                    src={user.profilePictureUrl || "/placeholder.svg"}
                    alt={user.firstName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-medium text-gray-700">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </span>
                )}
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </div>
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                    </div>
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setIsProfileMenuOpen(false)
                      handleLogout()
                    }}
                  >
                    <div className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Log in
              </button>
            </Link>
            <Link to="/register">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                Sign up
              </button>
            </Link>
          </div>
        )}

        <button className="md:hidden focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-4 border-t border-gray-100">
          <nav className="flex flex-col space-y-4">
            {user ? (
              <>
                <Link to="/" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
                <Link to="/documents" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                  Documents
                </Link>
                <Link to="/profile" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                  Profile
                </Link>
                <button
                  className="text-sm font-medium text-left text-red-600"
                  onClick={() => {
                    setIsMenuOpen(false)
                    handleLogout()
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

