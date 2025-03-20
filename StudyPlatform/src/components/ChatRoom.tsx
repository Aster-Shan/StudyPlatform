"use client"

import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, Send } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import {
  getChatMessages,
  getChatRoom,
  sendChatMessage,
  type ChatMessage,
  type ChatRoom as ChatRoomType,
} from "../services/chatService"

export default function ChatRoom() {
  const { roomId } = useParams<{ roomId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [room, setRoom] = useState<ChatRoomType | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!roomId) return

    const fetchRoomAndMessages = async () => {
      try {
        setLoading(true)
        const [roomData, messagesData] = await Promise.all([getChatRoom(roomId), getChatMessages(roomId)])

        if (!roomData) {
          setError("Chat room not found")
          return
        }

        setRoom(roomData)
        setMessages(messagesData)
        setError(null)
      } catch (err) {
        console.error("Error fetching chat data:", err)
        setError("Failed to load chat. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchRoomAndMessages()
  }, [roomId])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roomId || !newMessage.trim() || sending) return

    try {
      setSending(true)
      const sentMessage = await sendChatMessage(roomId, newMessage.trim(), user)
      setMessages((prev) => [...prev, sentMessage])
      setNewMessage("")
    } catch (err) {
      console.error("Error sending message:", err)
      alert("Failed to send message. Please try again.")
    } finally {
      setSending(false)
    }
  }

  const handleBack = () => {
    navigate("/chat")
  }

  if (loading) {
    return (
      <div className="col-12 d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="col-12">
        <div className="alert alert-danger" role="alert">
          {error || "Chat room not found"}
        </div>
        <button className="btn btn-primary" onClick={handleBack}>
          Back to Chats
        </button>
      </div>
    )
  }

  return (
    <div className="col-12 col-lg-8 col-xl-6 mx-auto d-flex flex-column" style={{ height: "calc(100vh - 200px)" }}>
      {/* Chat Header */}
      <div className="bg-white border rounded-top p-3 d-flex align-items-center">
        <button
          className="btn btn-sm btn-light me-3 d-flex align-items-center justify-content-center"
          onClick={handleBack}
          aria-label="Back to chat list"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="h5 mb-0">{room.name}</h2>
          <p className="text-muted small mb-0">
            {room.participants.length} participant{room.participants.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-grow-1 bg-light border-start border-end p-3 overflow-auto">
        {messages.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted mb-0">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.sender.id === user?.id

            return (
              <div
                key={message.id}
                className={`d-flex mb-3 ${isCurrentUser ? "justify-content-end" : "justify-content-start"}`}
              >
                <div
                  className={`${isCurrentUser ? "bg-primary text-white" : "bg-white"} rounded-3 p-3 shadow-sm`}
                  style={{ maxWidth: "75%" }}
                >
                  {!isCurrentUser && <p className="fw-medium small mb-1">{message.sender.firstName}</p>}
                  <p className="mb-1">{message.content}</p>
                  <p className="text-end mb-0 small opacity-75">
                    {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border rounded-bottom p-3">
        <form onSubmit={handleSendMessage} className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
          />
          <button
            type="submit"
            className="btn btn-primary d-flex align-items-center justify-content-center"
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Sending...</span>
              </div>
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

