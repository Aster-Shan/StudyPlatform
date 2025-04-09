"use client"

import { useEffect } from "react"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import "./App.css"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./contexts/AuthContext"
import "./index.css"
import Chat from "./pages/Chat"
import DocumentDetail from "./pages/DocumentDetail"
import Documents from "./pages/Documents"
import EmailConfirmation from "./pages/EmailConfirmation"
import ForgotPassword from "./pages/ForgotPassword"
import Forum from "./pages/Forum"
import ForumTopic from "./pages/ForumTopic"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Register from "./pages/Register"
import ResetPassword from "./pages/ResetPassword"
import Setup2FA from "./pages/Setup2FA"
import VideoConferencing from "./pages/VideoConferencing"
import AITools from "./pages/ai-tools"; // Import the new AI Tools page

// Import bootstrap JS only (CSS will be imported in a separate file)
import "bootstrap/dist/css/bootstrap.css"
import React from "react"

function App() {
  useEffect(() => {
   
  }, [])

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <main className="container mx-auto py-8 px-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/Setup2FA"
                element={
                  <ProtectedRoute>
                    <Setup2FA />
                  </ProtectedRoute>
                }
              />
              <Route path="/confirm" element={<EmailConfirmation />} />
              <Route
                path="/documents"
                element={
                  <ProtectedRoute>
                    <Documents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents/:id"
                element={
                  <ProtectedRoute>
                    <DocumentDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat/*"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/forum"
                element={
                  <ProtectedRoute>
                    <Forum />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/forum/topic/:id"
                element={
                  <ProtectedRoute>
                    <ForumTopic />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/video/*"
                element={
                  <ProtectedRoute>
                    <VideoConferencing />
                  </ProtectedRoute>
                }
              />
              {/* Add the new AI Tools route */}
              <Route
                path="/ai-tools"
                element={
                  <ProtectedRoute>
                    <AITools />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

