"use client"

import { formatDistanceToNow } from "date-fns"
import { Edit, MessageSquare, MoreVertical, Send, Trash } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { addComment, deleteComment, getDocumentComments, updateComment } from "../services/commentService"
import type { Comment } from "../types"

interface DocumentCommentsProps {
  documentId: number
}

export default function DocumentComments({ documentId }: DocumentCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [editingComment, setEditingComment] = useState<{ id: number; content: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const { user } = useAuth()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchComments()

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [documentId])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const data = await getDocumentComments(documentId)
      setComments(data)
      setError("")
    } catch (err) {
      setError("Failed to load comments")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const comment = await addComment(documentId, newComment)
      setComments([comment, ...comments])
      setNewComment("")
    } catch (err) {
      setError("Failed to add comment")
      console.error(err)
    }
  }

  const handleUpdateComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingComment || !editingComment.content.trim()) return

    try {
      const updatedComment = await updateComment(editingComment.id, editingComment.content)
      setComments(comments.map((comment) => (comment.id === updatedComment.id ? updatedComment : comment)))
      setEditingComment(null)
    } catch (err) {
      setError("Failed to update comment")
      console.error(err)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return

    try {
      setIsDeleting(commentId)
      await deleteComment(commentId)
      setComments(comments.filter((comment) => comment.id !== commentId))
      setOpenDropdown(null)
    } catch (err) {
      setError("Failed to delete comment")
      console.error(err)
    } finally {
      setIsDeleting(null)
    }
  }

  const toggleDropdown = (commentId: number) => {
    setOpenDropdown(openDropdown === commentId ? null : commentId)
  }

  return (
    <div className="mt-4">
      {/* Discussion Header */}
      <div
        className="p-3 d-flex align-items-center"
        style={{
          backgroundColor: "#0f1924",
          color: "white",
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px",
        }}
      >
        <MessageSquare size={18} className="me-2" />
        <span>Discussion</span>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="p-3 text-danger"
          style={{
            backgroundColor: "#f8d7da",
            borderLeft: "1px solid #dee2e6",
            borderRight: "1px solid #dee2e6",
          }}
        >
          {error}
        </div>
      )}

      {/* Comment Input */}
      <div
        className="p-3 d-flex align-items-start gap-2"
        style={{
          borderLeft: "1px solid #dee2e6",
          borderRight: "1px solid #dee2e6",
          borderBottom: loading || comments.length === 0 ? "none" : "1px solid #dee2e6",
        }}
      >
        <div className="flex-shrink-0">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle bg-secondary text-white"
            style={{ width: "32px", height: "32px", fontSize: "14px" }}
          >
            {user?.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl || "/placeholder.svg"}
                alt={user.firstName}
                className="rounded-circle w-100 h-100 object-fit-cover"
              />
            ) : (
              <span>{user?.firstName?.charAt(0).toUpperCase() || "U"}</span>
            )}
          </div>
        </div>
        <div className="flex-grow-1">
          <form onSubmit={handleAddComment}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts on this document..."
              className="form-control border mb-2"
              rows={2}
              style={{ resize: "none" }}
            />
            <div className="d-flex justify-content-end">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="btn d-flex align-items-center"
                style={{
                  backgroundColor: "#6c8dff",
                  color: "white",
                }}
              >
                <Send size={16} className="me-2" />
                Post Comment
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Loading or Empty State */}
      {loading ? (
        <div
          className="p-3 text-center"
          style={{
            borderLeft: "1px solid #dee2e6",
            borderRight: "1px solid #dee2e6",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <div className="spinner-border spinner-border-sm text-secondary" role="status">
            <span className="visually-hidden">Loading comments...</span>
          </div>
        </div>
      ) : comments.length === 0 ? (
        <div
          className="p-5 text-center text-muted"
          style={{
            borderLeft: "1px solid #dee2e6",
            borderRight: "1px solid #dee2e6",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <MessageSquare size={24} className="mb-2 d-block mx-auto" />
          <p className="mb-0">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="comment-list">
          {comments.map((comment, index) => (
            <div
              key={comment.id}
              className="p-3 d-flex gap-2"
              style={{
                borderLeft: "1px solid #dee2e6",
                borderRight: "1px solid #dee2e6",
                borderBottom: "1px solid #dee2e6",
                borderTop: index === 0 ? "1px solid #dee2e6" : "none",
              }}
            >
              <div className="flex-shrink-0">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle bg-secondary text-white"
                  style={{ width: "32px", height: "32px", fontSize: "14px" }}
                >
                  {comment.user.profilePictureUrl ? (
                    <img
                      src={comment.user.profilePictureUrl || "/placeholder.svg"}
                      alt={comment.user.firstName}
                      className="rounded-circle w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <span>{comment.user.firstName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span className="fw-medium">
                      {comment.user.firstName} {comment.user.lastName}
                    </span>
                    <span className="text-muted ms-2 small">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      {comment.updatedAt !== comment.createdAt && " (edited)"}
                    </span>
                  </div>
                  {user?.id === comment.user.id && (
                    <div className="position-relative" ref={dropdownRef}>
                      <button
                        className="btn btn-sm btn-link text-muted p-0"
                        type="button"
                        onClick={() => toggleDropdown(comment.id)}
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openDropdown === comment.id && (
                        <div
                          className="position-absolute end-0 mt-1 py-1 bg-white rounded shadow-sm"
                          style={{
                            zIndex: 1000,
                            minWidth: "120px",
                            border: "1px solid rgba(0,0,0,.15)",
                          }}
                        >
                          <button
                            className="dropdown-item d-flex align-items-center px-3 py-2"
                            onClick={() => {
                              setEditingComment({ id: comment.id, content: comment.content })
                              setOpenDropdown(null)
                            }}
                          >
                            <Edit size={14} className="me-2" />
                            <span>Edit</span>
                          </button>
                          <button
                            className="dropdown-item d-flex align-items-center px-3 py-2 text-danger"
                            onClick={() => handleDeleteComment(comment.id)}
                            disabled={isDeleting === comment.id}
                          >
                            <Trash size={14} className="me-2" />
                            <span>{isDeleting === comment.id ? "Deleting..." : "Delete"}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {editingComment?.id === comment.id ? (
                  <form onSubmit={handleUpdateComment} className="mt-2">
                    <textarea
                      value={editingComment.content}
                      onChange={(e) => setEditingComment({ ...editingComment, content: e.target.value })}
                      className="form-control mb-2"
                      rows={2}
                      style={{ resize: "none" }}
                    />
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingComment(null)}
                        className="btn btn-sm btn-outline-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-sm"
                        style={{ backgroundColor: "#6c8dff", color: "white" }}
                      >
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="mb-0 mt-1">{comment.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

