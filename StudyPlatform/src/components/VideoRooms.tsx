"use client"

import React from "react"

import { Plus, Video } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createVideoRoom } from "../services/videoService"

export default function VideoRooms() {
  const navigate = useNavigate()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [roomName, setRoomName] = useState("")
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!roomName.trim()) return

    try {
      setCreating(true)
      setError("")

      const room = await createVideoRoom(roomName)
      navigate(`/video/${room.roomId}`)
    } catch (err) {
      console.error("Failed to create room:", err)
      setError("Failed to create video room. Please try again.")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-bottom-0 pt-4">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Video Conferencing</h5>
          <button
            className="btn btn-primary d-flex align-items-center"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <Plus size={16} className="me-2" /> New Meeting
          </button>
        </div>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {showCreateForm && (
          <div className="mb-4">
            <div className="card border">
              <div className="card-body">
                <h6 className="card-title">Create New Meeting</h6>
                <form onSubmit={handleCreateRoom}>
                  <div className="mb-3">
                    <label htmlFor="roomName" className="form-label">
                      Meeting Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="roomName"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="Enter meeting name"
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary me-2"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={!roomName.trim() || creating}>
                      {creating ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Creating...
                        </>
                      ) : (
                        <>Start Meeting</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="text-center py-5">
          <Video size={64} className="text-muted mb-3" />
          <h5>No Active Meetings</h5>
          <p className="text-muted">Create a new meeting to get started</p>
        </div>
      </div>
    </div>
  )
}

