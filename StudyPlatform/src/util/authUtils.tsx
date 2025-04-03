"use client"

import React from "react"

/**
 * Utility to check if the user is authenticated with the backend
 * @returns Promise that resolves to true if authenticated, false otherwise
 */
export const checkAuthentication = async (): Promise<boolean> => {
  try {
    // Make a request to a protected endpoint on your backend
    const response = await fetch("http://localhost:8080/api/auth/check", {
      credentials: "include", // Include cookies
    })

    return response.ok
  } catch (error) {
    console.error("Error checking authentication:", error)
    return false
  }
}

/**
 * Opens the authentication page in a new window/tab
 */
export const openAuthPage = () => {
  window.open("http://localhost:8080/oauth2/authorization/google", "_blank")
}

/**
 * Utility component to show a login button when not authenticated
 */
export const AuthPrompt: React.FC = () => {
  return (
    <div className="alert alert-warning">
      <p>You need to be logged in to view all content.</p>
      <button className="btn btn-primary" onClick={openAuthPage}>
        Login with Google
      </button>
    </div>
  )
}

