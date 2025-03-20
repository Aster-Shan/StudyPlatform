"use client"

import { formatDistanceToNow } from "date-fns"
import {
  Archive,
  ArrowDown,
  ArrowUp,
  Clock,
  Filter,
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
  Star,
  Trash2,
  Users,
} from "lucide-react"
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import {
  archiveChatRoom,
  deleteChatRoom,
  getArchivedChatRooms,
  getChatRooms,
  unarchiveChatRoom,
  type ChatRoom,
} from "../services/chatService"
import ConfirmationModal from "./ConfirmationModal"

export default function ChatList() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [archivedRooms, setArchivedRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    confirmButtonText: "",
    confirmButtonVariant: "danger",
    onConfirm: () => {},
  })

  // Action state
  const [actionLoading, setActionLoading] = useState(false)
  const [actionRoomId, setActionRoomId] = useState<string | null>(null)

  useEffect(() => {
    fetchChatRooms()
  }, [user?.id])

  const fetchChatRooms = async () => {
    try {
      setLoading(true)
      const [activeRooms, archived] = await Promise.all([getChatRooms(false), getArchivedChatRooms()])
      setChatRooms(activeRooms || [])
      setArchivedRooms(archived || [])
      setError(null)
    } catch (err) {
      console.error("Error fetching chat rooms:", err)
      setError("Failed to load chat rooms. Please try again.")
      setChatRooms([])
      setArchivedRooms([])
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = () => {
    navigate("/chat/new")
  }

  const handleArchive = (roomId: string, roomName: string) => {
    setModalConfig({
      title: "Archive Conversation",
      message: `Are you sure you want to archive "${roomName}"? You can access it later from the archived section.`,
      confirmButtonText: "Archive",
      confirmButtonVariant: "warning",
      onConfirm: async () => {
        try {
          setActionLoading(true)
          setActionRoomId(roomId)
          const success = await archiveChatRoom(roomId)
          if (success) {
            // Update local state
            const room = chatRooms.find((r) => r.id === roomId)
            if (room) {
              setChatRooms((prev) => prev.filter((r) => r.id !== roomId))
              setArchivedRooms((prev) => [...prev, { ...room, archived: true }])
            }
          }
        } catch (err) {
          console.error("Error archiving chat:", err)
          alert("Failed to archive chat. Please try again.")
        } finally {
          setActionLoading(false)
          setActionRoomId(null)
        }
      },
    })
    setModalOpen(true)
  }

  const handleUnarchive = (roomId: string, roomName: string) => {
    setModalConfig({
      title: "Unarchive Conversation",
      message: `Are you sure you want to unarchive "${roomName}"?`,
      confirmButtonText: "Unarchive",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          setActionLoading(true)
          setActionRoomId(roomId)
          const success = await unarchiveChatRoom(roomId)
          if (success) {
            // Update local state
            const room = archivedRooms.find((r) => r.id === roomId)
            if (room) {
              setArchivedRooms((prev) => prev.filter((r) => r.id !== roomId))
              setChatRooms((prev) => [...prev, { ...room, archived: false }])
            }
          }
        } catch (err) {
          console.error("Error unarchiving chat:", err)
          alert("Failed to unarchive chat. Please try again.")
        } finally {
          setActionLoading(false)
          setActionRoomId(null)
        }
      },
    })
    setModalOpen(true)
  }

  const handleDelete = (roomId: string, roomName: string) => {
    setModalConfig({
      title: "Delete Conversation",
      message: `Are you sure you want to delete "${roomName}"? This action cannot be undone and all messages will be permanently lost.`,
      confirmButtonText: "Delete",
      confirmButtonVariant: "danger",
      onConfirm: async () => {
        try {
          setActionLoading(true)
          setActionRoomId(roomId)
          const success = await deleteChatRoom(roomId)
          if (success) {
            // Update local state
            setChatRooms((prev) => prev.filter((r) => r.id !== roomId))
            setArchivedRooms((prev) => prev.filter((r) => r.id !== roomId))
          }
        } catch (err) {
          console.error("Error deleting chat:", err)
          alert("Failed to delete chat. Please try again.")
        } finally {
          setActionLoading(false)
          setActionRoomId(null)
        }
      },
    })
    setModalOpen(true)
  }

  // Filter chat rooms based on active filter and search term
  const getFilteredRooms = () => {
    let rooms = chatRooms

    if (activeFilter === "archived") {
      rooms = archivedRooms
    }

    // Apply search filter
    return rooms.filter(
      (room) =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.participants.some((p) => `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }

  const filteredRooms = getFilteredRooms()
  const archivedCount = archivedRooms.length

  if (loading) {
    return (
      <div className="row h-100">
        <div className="col-12 d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="row">
        <div className="col-12">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <button className="btn btn-primary" onClick={() => fetchChatRooms()}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="row g-4">
        {/* Left Sidebar - Filters */}
        <div className="col-lg-3 d-none d-lg-block">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                <button
                  className={`list-group-item list-group-item-action d-flex align-items-center ${
                    activeFilter === "all" ? "active" : ""
                  }`}
                  onClick={() => setActiveFilter("all")}
                >
                  <MessageSquare size={18} className="me-3" />
                  <span className="flex-grow-1">All Conversations</span>
                  <span className="badge bg-primary rounded-pill">{chatRooms.length}</span>
                </button>
                <button
                  className={`list-group-item list-group-item-action d-flex align-items-center ${
                    activeFilter === "unread" ? "active" : ""
                  }`}
                  onClick={() => setActiveFilter("unread")}
                >
                  <Clock size={18} className="me-3" />
                  <span className="flex-grow-1">Recent</span>
                  <span className="badge bg-secondary rounded-pill">3</span>
                </button>
                <button
                  className={`list-group-item list-group-item-action d-flex align-items-center ${
                    activeFilter === "starred" ? "active" : ""
                  }`}
                  onClick={() => setActiveFilter("starred")}
                >
                  <Star size={18} className="me-3" />
                  <span className="flex-grow-1">Starred</span>
                  <span className="badge bg-secondary rounded-pill">2</span>
                </button>
                <button
                  className={`list-group-item list-group-item-action d-flex align-items-center ${
                    activeFilter === "archived" ? "active" : ""
                  }`}
                  onClick={() => setActiveFilter("archived")}
                >
                  <Archive size={18} className="me-3" />
                  <span className="flex-grow-1">Archived</span>
                  <span className="badge bg-secondary rounded-pill">{archivedCount}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mt-4">
            <div className="card-header bg-white py-3">
              <h5 className="card-title mb-0 h6">Direct Messages</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {chatRooms
                  .filter((room) => room.participants.length === 1)
                  .slice(0, 5)
                  .map((room) => (
                    <Link
                      key={`direct-${room.id}`}
                      to={`/chat/${room.id}`}
                      className="list-group-item list-group-item-action d-flex align-items-center p-3"
                    >
                      <div className="flex-shrink-0">
                        <div
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                          style={{ width: "36px", height: "36px" }}
                        >
                          {room.participants[0]?.profilePictureUrl ? (
                            <img
                              src={room.participants[0].profilePictureUrl || "/placeholder.svg"}
                              alt={`${room.participants[0].firstName} ${room.participants[0].lastName}`}
                              className="rounded-circle w-100 h-100 object-fit-cover"
                            />
                          ) : (
                            <span className="fw-medium text-secondary">
                              {room.participants[0]?.firstName?.charAt(0)}
                              {room.participants[0]?.lastName?.charAt(0)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ms-3">
                        <p className="mb-0 small">
                          {room.participants[0]?.firstName} {room.participants[0]?.lastName}
                        </p>
                      </div>
                    </Link>
                  ))}
                <Link
                  to="/chat/new"
                  className="list-group-item list-group-item-action text-center text-primary small py-2"
                >
                  View All Direct Messages
                </Link>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mt-4">
            <div className="card-header bg-white py-3">
              <h5 className="card-title mb-0 h6">Group Chats</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {chatRooms
                  .filter((room) => room.participants.length > 1)
                  .slice(0, 3)
                  .map((room) => (
                    <Link
                      key={`group-${room.id}`}
                      to={`/chat/${room.id}`}
                      className="list-group-item list-group-item-action d-flex align-items-center p-3"
                    >
                      <div className="flex-shrink-0">
                        <div
                          className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
                          style={{ width: "36px", height: "36px" }}
                        >
                          <Users size={18} />
                        </div>
                      </div>
                      <div className="ms-3">
                        <p className="mb-0 small">{room.name}</p>
                        <p className="mb-0 text-muted x-small">{room.participants.length} members</p>
                      </div>
                    </Link>
                  ))}
                <Link
                  to="/chat/new"
                  className="list-group-item list-group-item-action text-center text-primary small py-2"
                >
                  View All Group Chats
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Chat List */}
        <div className="col-lg-9">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white p-3 border-bottom">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <h2 className="h5 mb-0">
                  {activeFilter === "archived" ? "Archived Conversations" : "Your Conversations"}
                </h2>
                <button className="btn btn-primary d-flex align-items-center" onClick={handleNewChat}>
                  <Plus size={18} className="me-2" />
                  New Chat
                </button>
              </div>

              <div className="mt-3">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Search size={18} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn btn-outline-secondary d-flex align-items-center" type="button">
                    <Filter size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body p-0">
              {filteredRooms.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-3">
                    <div
                      className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center"
                      style={{ width: "80px", height: "80px" }}
                    >
                      {activeFilter === "archived" ? (
                        <Archive size={40} className="text-muted" />
                      ) : (
                        <MessageSquare size={40} className="text-muted" />
                      )}
                    </div>
                  </div>
                  <h3 className="h5 mb-2">
                    {activeFilter === "archived"
                      ? "No archived conversations"
                      : searchTerm
                        ? "No conversations found"
                        : "No conversations yet"}
                  </h3>
                  <p className="text-muted mb-4">
                    {activeFilter === "archived"
                      ? "Archived conversations will appear here"
                      : searchTerm
                        ? "Try a different search term"
                        : "Start a new chat to connect with others"}
                  </p>
                  {activeFilter !== "archived" && (
                    <button className="btn btn-primary" onClick={handleNewChat}>
                      Start a New Chat
                    </button>
                  )}
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {filteredRooms.map((room) => (
                    <div key={room.id} className="list-group-item border-start-0 border-end-0 p-0">
                      <div className="d-flex position-relative">
                        {/* Chat room link */}
                        <Link
                          to={`/chat/${room.id}`}
                          className="d-flex align-items-center p-3 text-decoration-none text-dark flex-grow-1"
                        >
                          <div className="flex-shrink-0 position-relative">
                            {room.participants.length === 1 ? (
                              <div
                                className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                                style={{ width: "56px", height: "56px" }}
                              >
                                {room.participants[0]?.profilePictureUrl ? (
                                  <img
                                    src={room.participants[0].profilePictureUrl || "/placeholder.svg"}
                                    alt={`${room.participants[0].firstName} ${room.participants[0].lastName}`}
                                    className="rounded-circle w-100 h-100 object-fit-cover"
                                  />
                                ) : (
                                  <span className="fw-medium text-secondary fs-4">
                                    {room.participants[0]?.firstName?.charAt(0)}
                                    {room.participants[0]?.lastName?.charAt(0)}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div
                                className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
                                style={{ width: "56px", height: "56px" }}
                              >
                                <Users size={28} />
                              </div>
                            )}
                            <span
                              className="position-absolute bottom-0 end-0 bg-success rounded-circle p-1 border border-white"
                              style={{ width: "14px", height: "14px" }}
                            ></span>
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <div className="d-flex justify-content-between align-items-center">
                              <h5 className="mb-0 fw-medium">{room.name}</h5>
                              {room.lastMessage && (
                                <small className="text-muted">
                                  {formatDistanceToNow(new Date(room.lastMessage.timestamp), { addSuffix: true })}
                                </small>
                              )}
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              {room.lastMessage ? (
                                <p className="mb-0 text-truncate text-muted small" style={{ maxWidth: "80%" }}>
                                  <span className="fw-medium">
                                    {room.lastMessage.sender.id === user?.id
                                      ? "You"
                                      : `${room.lastMessage.sender.firstName}`}
                                    :
                                  </span>{" "}
                                  {room.lastMessage.content}
                                </p>
                              ) : (
                                <p className="mb-0 text-muted small">No messages yet</p>
                              )}

                              <div>
                                {Math.random() > 0.7 && <span className="badge rounded-pill bg-primary">2</span>}
                              </div>
                            </div>
                          </div>
                        </Link>

                        {/* Action buttons */}
                        <div className="dropdown position-static">
                          <button
                            className="btn btn-light btn-sm position-absolute top-0 end-0 mt-2 me-2"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <MoreVertical size={16} />
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end shadow">
                            {room.archived ? (
                              <li>
                                <button
                                  className="dropdown-item d-flex align-items-center"
                                  onClick={() => handleUnarchive(room.id, room.name)}
                                  disabled={actionLoading && actionRoomId === room.id}
                                >
                                  <ArrowUp size={16} className="me-2 text-success" />
                                  Unarchive
                                  {actionLoading && actionRoomId === room.id && (
                                    <div className="spinner-border spinner-border-sm ms-auto" role="status">
                                      <span className="visually-hidden">Loading...</span>
                                    </div>
                                  )}
                                </button>
                              </li>
                            ) : (
                              <li>
                                <button
                                  className="dropdown-item d-flex align-items-center"
                                  onClick={() => handleArchive(room.id, room.name)}
                                  disabled={actionLoading && actionRoomId === room.id}
                                >
                                  <ArrowDown size={16} className="me-2 text-warning" />
                                  Archive
                                  {actionLoading && actionRoomId === room.id && (
                                    <div className="spinner-border spinner-border-sm ms-auto" role="status">
                                      <span className="visually-hidden">Loading...</span>
                                    </div>
                                  )}
                                </button>
                              </li>
                            )}
                            <li>
                              <hr className="dropdown-divider" />
                            </li>
                            <li>
                              <button
                                className="dropdown-item d-flex align-items-center text-danger"
                                onClick={() => handleDelete(room.id, room.name)}
                                disabled={actionLoading && actionRoomId === room.id}
                              >
                                <Trash2 size={16} className="me-2" />
                                Delete
                                {actionLoading && actionRoomId === room.id && (
                                  <div className="spinner-border spinner-border-sm ms-auto" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                )}
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {filteredRooms.length > 0 && (
              <div className="card-footer bg-white border-top py-3 text-center">
                <p className="text-muted small mb-0">
                  Showing {filteredRooms.length} of{" "}
                  {activeFilter === "archived" ? archivedRooms.length : chatRooms.length} conversations
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        id="confirmationModal"
        title={modalConfig.title}
        message={modalConfig.message}
        confirmButtonText={modalConfig.confirmButtonText}
        confirmButtonVariant={modalConfig.confirmButtonVariant}
        onConfirm={modalConfig.onConfirm}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}

