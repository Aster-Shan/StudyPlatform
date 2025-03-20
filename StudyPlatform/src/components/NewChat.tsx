"use client"

import { ArrowLeft, MessageSquare, Search, Shield, UserIcon, Users } from "lucide-react"
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { createChatRoom, getAllUsers } from "../services/chatService"
import type { User } from "../types"

export default function NewChat() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [chatName, setChatName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [creating, setCreating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  useEffect(() => {
    // Load all users from the API
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)
        setDebugInfo(null)

        console.log("Fetching users...")

        // Get users from API or mock data
        const users = await getAllUsers()
        console.log("Users received:", users)

        if (users.length === 0) {
          setDebugInfo("API returned an empty array of users")
        } else {
          setDebugInfo(`Successfully loaded ${users.length} users`)
        }

        // Filter out the current user
        const filteredUsers = users.filter((u) => u.id !== user?.id)
        console.log("Filtered users (excluding current user):", filteredUsers)

        if (filteredUsers.length === 0) {
          setDebugInfo((prev) => `${prev || ""}\nNo users found after filtering (excluding current user)`)
        }

        setAllUsers(filteredUsers)
        setFilteredUsers(filteredUsers)
      } catch (err) {
        console.error("Error in fetchUsers function:", err)
        setError(`Failed to load users: ${err instanceof Error ? err.message : String(err)}`)
        setDebugInfo(`Error in fetchUsers: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [user?.id])

  useEffect(() => {
    // Filter users based on search term
    const filtered = allUsers.filter(
      (user) =>
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }, [searchTerm, allUsers])

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one participant")
      return
    }

    try {
      setCreating(true)
      const newRoom = await createChatRoom(chatName.trim(), selectedUsers, user)
      navigate(`/chat/${newRoom.id}`)
    } catch (err) {
      console.error("Error creating chat:", err)
      alert("Failed to create chat. Please try again.")
      setCreating(false)
    }
  }

  const generateChatName = () => {
    const selectedUserNames = selectedUsers
      .map((id) => {
        const user = allUsers.find((u) => u.id === id)
        return user ? `${user.firstName} ${user.lastName}` : ""
      })
      .filter(Boolean)

    if (selectedUserNames.length === 1) {
      return selectedUserNames[0]
    } else if (selectedUserNames.length > 1) {
      return `${selectedUserNames[0]} and ${selectedUserNames.length - 1} others`
    } else {
      return "New Chat"
    }
  }

  const handleBack = () => {
    navigate("/chat")
  }

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Modern Header with Gradient */}
      <div
        className="w-100 text-white py-4"
        style={{
          background: "linear-gradient(135deg, #000000 0%, #2c3e50 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="container-fluid px-4">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-sm btn-dark bg-opacity-25 me-3 d-flex align-items-center justify-content-center"
                  onClick={handleBack}
                  aria-label="Back to chat list"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h1 className="h3 fw-bold mb-1">New Conversation</h1>
                  <p className="lead opacity-75 mb-0">Create a chat with other users</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
              <div className="d-inline-flex align-items-center p-3 bg-white bg-opacity-10 rounded-3 shadow-sm">
                <div className="me-3 position-relative">
                  {user?.profilePictureUrl ? (
                    <img
                      src={user.profilePictureUrl || "/placeholder.svg"}
                      alt={user.firstName}
                      className="rounded-circle"
                      style={{ width: "48px", height: "48px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                      style={{ width: "48px", height: "48px" }}
                    >
                      <span className="fs-5 text-white fw-bold">
                        {user?.firstName?.charAt(0)}
                        {user?.lastName?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h5 className="mb-0 text-white small">
                    {user?.firstName} {user?.lastName}
                  </h5>
                  <div className="d-flex align-items-center mt-1">
                    <span className="badge bg-success small">Online</span>
                  </div>
                </div>
              </div>
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
            <li className="breadcrumb-item">
              <Link to="/chat" className="text-decoration-none">
                Chat
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              New Conversation
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
                  <span className="text-muted me-3">Quick Tips:</span>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge bg-light text-dark d-flex align-items-center px-3 py-2">
                      <Shield size={14} className="me-1 text-primary" />
                      Select at least one participant
                    </span>
                    <span className="badge bg-light text-dark d-flex align-items-center px-3 py-2">
                      <MessageSquare size={14} className="me-1 text-primary" />
                      Chat name is optional
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <span className="badge bg-primary rounded-pill px-3 py-2">
                    {selectedUsers.length} participants selected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 py-4">
        <div className="container-fluid px-4">
          <div className="row g-4">
            {/* Left Column - Form */}
            <div className="col-lg-5 mb-4 mb-lg-0">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h3 className="h5 fw-bold mb-4">Conversation Details</h3>

                  <div className="mb-4">
                    <label htmlFor="chatName" className="form-label fw-medium">
                      Conversation Name (Optional)
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="chatName"
                      placeholder="Enter a name for this conversation"
                      value={chatName}
                      onChange={(e) => setChatName(e.target.value)}
                    />
                    <div className="form-text">Leave blank to automatically generate a name based on participants</div>
                  </div>

                  {selectedUsers.length > 0 ? (
                    <div className="mb-4">
                      <label className="form-label fw-medium">Selected Participants</label>
                      <div className="p-3 bg-light rounded">
                        <div className="d-flex flex-wrap gap-2">
                          {selectedUsers.map((userId) => {
                            const user = allUsers.find((u) => u.id === userId)
                            if (!user) return null

                            return (
                              <span
                                key={userId}
                                className="badge bg-primary d-flex align-items-center p-2 rounded-pill"
                              >
                                {user.firstName} {user.lastName}
                                <button
                                  type="button"
                                  className="btn-close btn-close-white ms-2"
                                  onClick={() => handleUserSelect(userId)}
                                  aria-label={`Remove ${user.firstName} ${user.lastName}`}
                                  style={{ fontSize: "0.5rem" }}
                                ></button>
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="alert alert-info d-flex align-items-center" role="alert">
                      <Users size={18} className="me-2" />
                      <div>Please select at least one participant to create a conversation.</div>
                    </div>
                  )}

                  {/* Preview Card */}
                  <div className="card bg-light border-0 mb-4">
                    <div className="card-body">
                      <h6 className="card-subtitle mb-2 text-muted small">PREVIEW</h6>
                      <h5 className="card-title">
                        {chatName || (selectedUsers.length > 0 ? generateChatName() : "New Conversation")}
                      </h5>
                      <p className="card-text small text-muted">
                        {selectedUsers.length} participant{selectedUsers.length !== 1 ? "s" : ""}
                      </p>
                      <div className="d-flex mt-2">
                        {selectedUsers.length > 0 ? (
                          selectedUsers.slice(0, 3).map((userId, index) => {
                            const user = allUsers.find((u) => u.id === userId)
                            if (!user) return null

                            return (
                              <div
                                key={userId}
                                className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  marginLeft: index > 0 ? "-10px" : "0",
                                  zIndex: 3 - index,
                                  border: "2px solid #fff",
                                }}
                              >
                                {user.firstName?.charAt(0)}
                              </div>
                            )
                          })
                        ) : (
                          <div
                            className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
                            style={{ width: "32px", height: "32px" }}
                          >
                            <UserIcon size={16} />
                          </div>
                        )}

                        {selectedUsers.length > 3 && (
                          <div
                            className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
                            style={{
                              width: "32px",
                              height: "32px",
                              marginLeft: "-10px",
                              border: "2px solid #fff",
                            }}
                          >
                            +{selectedUsers.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-white p-4 border-top-0">
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-light btn-lg px-4" onClick={handleBack}>
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary btn-lg px-4 d-flex align-items-center"
                      onClick={handleCreateChat}
                      disabled={selectedUsers.length === 0 || creating}
                    >
                      {creating ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Creating...</span>
                          </div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <MessageSquare size={18} className="me-2" />
                          Create Chat
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - User Selection */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white p-4 border-bottom-0">
                  <h3 className="h5 fw-bold mb-3">Select Participants</h3>

                  <div className="input-group input-group-lg">
                    <span className="input-group-text bg-light border-end-0">
                      <Search size={18} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="card-body p-0">
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading users...</span>
                      </div>
                      <p className="mt-3 text-muted">Loading users...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-5">
                      <div className="mb-3 text-danger">
                        <i className="bi bi-exclamation-circle-fill fs-1"></i>
                      </div>
                      <h5 className="text-danger">{error}</h5>
                      <button className="btn btn-outline-primary mt-3" onClick={() => window.location.reload()}>
                        Try Again
                      </button>
                      {debugInfo && (
                        <div className="mt-3 p-3 bg-light rounded text-start">
                          <h6 className="text-muted">Debug Information:</h6>
                          <pre className="mb-0 small text-muted" style={{ whiteSpace: "pre-wrap" }}>
                            {debugInfo}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {filteredUsers.length === 0 ? (
                        <div className="text-center py-5">
                          <div className="mb-3">
                            <div
                              className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center"
                              style={{ width: "80px", height: "80px" }}
                            >
                              <UserIcon size={40} className="text-secondary" />
                            </div>
                          </div>
                          <h5 className="text-muted">No users found</h5>
                          <p className="text-muted mb-0">
                            {searchTerm ? "Try a different search term" : "No users available to chat with"}
                          </p>

                          {/* Debug information */}
                          {debugInfo && (
                            <div className="mt-4 p-3 bg-light rounded mx-auto text-start" style={{ maxWidth: "80%" }}>
                              <h6 className="text-muted">Debug Information:</h6>
                              <pre className="mb-0 small text-muted" style={{ whiteSpace: "pre-wrap" }}>
                                {debugInfo}
                              </pre>
                            </div>
                          )}
                        </div>
                      ) : (
                        filteredUsers.map((user) => (
                          <div
                            key={user.id}
                            className={`list-group-item list-group-item-action d-flex align-items-center p-3 ${
                              selectedUsers.includes(user.id) ? "active" : ""
                            }`}
                            onClick={() => handleUserSelect(user.id)}
                            role="button"
                          >
                            <div className="flex-shrink-0">
                              <div
                                className={`rounded-circle d-flex align-items-center justify-content-center ${
                                  selectedUsers.includes(user.id) ? "bg-white text-primary" : "bg-light text-secondary"
                                }`}
                                style={{ width: "48px", height: "48px" }}
                              >
                                {user.profilePictureUrl ? (
                                  <img
                                    src={user.profilePictureUrl || "/placeholder.svg"}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    className="rounded-circle w-100 h-100 object-fit-cover"
                                  />
                                ) : (
                                  <span className="fw-medium">
                                    {user.firstName?.charAt(0)}
                                    {user.lastName?.charAt(0)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h6 className="mb-0">
                                {user.firstName} {user.lastName}
                              </h6>
                              <p className="mb-0 small text-muted">{user.email}</p>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => {}} // Handled by the parent div click
                                onClick={(e) => e.stopPropagation()}
                                id={`user-${user.id}`}
                              />
                              <label className="form-check-label visually-hidden" htmlFor={`user-${user.id}`}>
                                Select {user.firstName} {user.lastName}
                              </label>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <div className="card-footer bg-white p-4 border-top">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">
                      {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
                    </span>
                    {selectedUsers.length > 0 && (
                      <button
                        className="btn btn-primary d-flex align-items-center"
                        onClick={handleCreateChat}
                        disabled={creating}
                      >
                        <MessageSquare size={18} className="me-2" />
                        Create with {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

