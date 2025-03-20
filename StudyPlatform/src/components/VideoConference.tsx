"use client"

import axios from "axios"
import { ArrowLeft, Mic, MicOff, Monitor, Video, VideoOff } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import { Button, Card } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"

interface VideoConferenceProps {
  roomId: string
  onLeaveRoom: () => void
}

interface Participant {
  id: string
  name: string
  stream?: MediaStream
}

const VideoConference: React.FC<VideoConferenceProps> = ({ roomId, onLeaveRoom }) => {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [roomName, setRoomName] = useState("")
  const { user, token } = useAuth()

  // WebSocket connection reference
  const socketRef = useRef<WebSocket | null>(null)
  // Peer connections
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({})
  // Local video reference
  const localVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Initialize the room
    initializeRoom()

    // Cleanup function
    return () => {
      // Close all peer connections
      Object.values(peerConnections.current).forEach((connection) => {
        connection.close()
      })

      // Stop local stream
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.stop()
        })
      }

      // Close WebSocket connection
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [roomId])

  const initializeRoom = async () => {
    try {
      setLoading(true)

      // Get room details
      try {
        const roomResponse = await axios.get(`/api/video/rooms/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setRoomName(roomResponse.data.name)
      } catch (roomErr) {
        console.warn("Could not fetch room details:", roomErr)
        // Set a default room name if we can't get it from the API
        setRoomName(`Room ${roomId}`)
      }

      // Get local media stream
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        })

        setLocalStream(stream)

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
      } catch (mediaErr) {
        console.error("Error accessing media devices:", mediaErr)
        setError("Could not access camera or microphone. Please check your device permissions.")
        return
      }

      // Connect to WebSocket server
      connectToServer()

      setError(null)
    } catch (err) {
      console.error("Error initializing video room:", err)
      setError("Failed to initialize video conference. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const connectToServer = () => {
    // In a real implementation, this would connect to your WebSocket server
    // For this example, we'll simulate participants joining

    // Simulate other participants (in a real app, this would come from WebSocket)
    const simulatedParticipants: Participant[] = [
      {
        id: user?.id || "current-user",
        name: `${user?.firstName || "You"} ${user?.lastName || ""}`,
        stream: localStream || undefined,
      },
      {
        id: "simulated-user-1",
        name: "John Doe",
      },
      {
        id: "simulated-user-2",
        name: "Jane Smith",
      },
    ]

    setParticipants(simulatedParticipants)
  }

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing and revert to camera
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.stop()
        })
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        })

        setLocalStream(stream)

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        setIsScreenSharing(false)
      } catch (err) {
        console.error("Error reverting to camera:", err)
      }
    } else {
      // Start screen sharing
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        })

        // Keep audio from the current stream
        if (localStream) {
          const audioTrack = localStream.getAudioTracks()[0]
          if (audioTrack) {
            screenStream.addTrack(audioTrack)
          }

          // Stop video tracks from the current stream
          localStream.getVideoTracks().forEach((track) => {
            track.stop()
          })
        }

        setLocalStream(screenStream)

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream
        }

        // Handle the case when user stops sharing via the browser UI
        screenStream.getVideoTracks()[0].onended = () => {
          toggleScreenShare()
        }

        setIsScreenSharing(true)
      } catch (err) {
        console.error("Error sharing screen:", err)
      }
    }
  }

  const handleLeaveRoom = async () => {
    try {
      // Clean up resources before leaving
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.stop()
        })
        setLocalStream(null)
      }

      // Close all peer connections
      Object.values(peerConnections.current).forEach((connection) => {
        connection.close()
      })
      peerConnections.current = {}

      // Close WebSocket connection
      if (socketRef.current) {
        socketRef.current.close()
        socketRef.current = null
      }

      // No need to make the API call that was causing the 404 error
      console.log("Leaving room and navigating to home page")

      // Call the onLeaveRoom callback to navigate to the home page
      onLeaveRoom()
    } catch (err) {
      console.error("Error leaving room:", err)
      // Even if there's an error, we should still try to leave the room
      onLeaveRoom()
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Connecting to meeting...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body p-5 text-center">
          <div className="display-1 text-danger mb-4">
            <i className="bi bi-exclamation-triangle-fill"></i>
          </div>
          <h2 className="h4 mb-3">Connection Error</h2>
          <p className="text-muted mb-4">{error}</p>
          <Button variant="primary" size="lg" onClick={onLeaveRoom} className="px-4">
            <ArrowLeft size={18} className="me-2" />
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="card border-0 shadow-sm">
      <div
        className="card-header bg-dark text-white p-4"
        style={{
          background: "linear-gradient(135deg, #000000 0%, #2c3e50 100%)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="h4 mb-1">{roomName}</h2>
            <p className="mb-0 text-white-50">
              {participants.length} participant{participants.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button variant="outline-light" onClick={handleLeaveRoom} className="d-flex align-items-center">
            <ArrowLeft size={18} className="me-2" />
            Leave Meeting
          </Button>
        </div>
      </div>

      <div className="card-body p-4">
        <div className="mb-4 bg-light p-3 rounded d-flex justify-content-center">
          <div className="btn-group">
            <Button
              variant={isMuted ? "danger" : "primary"}
              onClick={toggleMute}
              className="d-flex align-items-center px-3 py-2"
            >
              {isMuted ? (
                <>
                  <MicOff size={18} className="me-2" />
                  Unmute
                </>
              ) : (
                <>
                  <Mic size={18} className="me-2" />
                  Mute
                </>
              )}
            </Button>
            <Button
              variant={isVideoOff ? "danger" : "primary"}
              onClick={toggleVideo}
              className="d-flex align-items-center px-3 py-2"
            >
              {isVideoOff ? (
                <>
                  <VideoOff size={18} className="me-2" />
                  Start Video
                </>
              ) : (
                <>
                  <Video size={18} className="me-2" />
                  Stop Video
                </>
              )}
            </Button>
            <Button
              variant={isScreenSharing ? "danger" : "primary"}
              onClick={toggleScreenShare}
              className="d-flex align-items-center px-3 py-2"
            >
              <Monitor size={18} className="me-2" />
              {isScreenSharing ? "Stop Sharing" : "Share Screen"}
            </Button>
          </div>
        </div>

        <div className="row g-4">
          {/* Local video (you) */}
          <div className="col-md-6 col-lg-4">
            <Card className="border-0 shadow-sm h-100">
              <div className="position-relative">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="card-img-top rounded-top"
                  style={{ height: "240px", objectFit: "cover", backgroundColor: "#000" }}
                />
                <div className="position-absolute bottom-0 start-0 p-2 bg-dark bg-opacity-75 text-white rounded-bottom-start">
                  <div className="d-flex align-items-center">
                    {isMuted && <MicOff size={14} className="me-1 text-danger" />}
                    <span>You</span>
                  </div>
                </div>
              </div>
              <Card.Footer className="bg-light border-top py-2 px-3">
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">Local Camera</small>
                  <div>
                    {isMuted && <span className="badge bg-danger me-1">Muted</span>}
                    {isVideoOff && <span className="badge bg-warning text-dark">Video Off</span>}
                  </div>
                </div>
              </Card.Footer>
            </Card>
          </div>

          {/* Other participants */}
          {participants
            .filter((p) => p.id !== user?.id)
            .map((participant) => (
              <div key={participant.id} className="col-md-6 col-lg-4">
                <Card className="border-0 shadow-sm h-100">
                  <div className="position-relative">
                    <div
                      className="card-img-top bg-dark d-flex align-items-center justify-content-center text-white rounded-top"
                      style={{ height: "240px" }}
                    >
                      <div className="text-center">
                        <div
                          className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto mb-2"
                          style={{ width: "80px", height: "80px", fontSize: "2rem" }}
                        >
                          {participant.name.charAt(0)}
                        </div>
                        <div>{participant.name}</div>
                      </div>
                    </div>
                    <div className="position-absolute bottom-0 start-0 p-2 bg-dark bg-opacity-75 text-white rounded-bottom-start">
                      <span>{participant.name}</span>
                    </div>
                  </div>
                  <Card.Footer className="bg-light border-top py-2 px-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">Remote Participant</small>
                      <span className="badge bg-success">Connected</span>
                    </div>
                  </Card.Footer>
                </Card>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default VideoConference

