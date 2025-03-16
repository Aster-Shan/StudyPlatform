"use client"

import axios from "axios"
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const EmailConfirmation: React.FC = () => {
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const location = useLocation()
  const navigate = useNavigate()
  const token = new URLSearchParams(location.search).get("token")

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error")
        setErrorMessage("No verification token found in URL")
        return
      }

      try {
        // Make sure this URL matches your backend endpoint exactly
        const response = await axios.get(`http://localhost:8080/api/auth/verify-email?token=${token}`)
        console.log("Verification response:", response.data)
        setStatus("success")
      } catch (error) {
        console.error("Verification error:", error)
        setStatus("error")
        if (axios.isAxiosError(error) && error.response) {
          setErrorMessage(`Server error: ${error.response.status} - ${JSON.stringify(error.response.data)}`)
        } else {
          setErrorMessage("Failed to connect to verification server. Please try again later.")
        }
      }
    }

    verifyEmail()
  }, [location, token])

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-5 text-center">
                {status === "verifying" && (
                  <>
                    <div className="spinner-border text-primary mb-4" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <h2 className="mb-3">Verifying Your Email</h2>
                    <p className="text-muted">Please wait while we verify your email address...</p>
                    <p className="small text-muted">Token: {token}</p>
                  </>
                )}

                {status === "success" && (
                  <>
                    <div className="mb-4 text-success">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        fill="currentColor"
                        className="bi bi-check-circle-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                      </svg>
                    </div>
                    <h2 className="mb-3">Email Verified Successfully!</h2>
                    <p className="text-muted mb-4">
                      Your account has been activated. You can now log in to access your account.
                    </p>
                    <button className="btn btn-primary py-2 px-4" onClick={() => navigate("/login")}>
                      Go to Login
                    </button>
                  </>
                )}

                {status === "error" && (
                  <>
                    <div className="mb-4 text-danger">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        fill="currentColor"
                        className="bi bi-x-circle-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                      </svg>
                    </div>
                    <h2 className="mb-3">Verification Failed</h2>
                    <p className="text-muted mb-2">The verification process encountered an error.</p>
                    {errorMessage && <div className="alert alert-danger mb-3">{errorMessage}</div>}
                    <p className="small text-muted mb-4">
                      You can try again or contact support if the problem persists.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                      <button className="btn btn-primary py-2 px-4" onClick={() => navigate("/register")}>
                        Register Again
                      </button>
                      <button className="btn btn-outline-secondary py-2 px-4" onClick={() => navigate("/login")}>
                        Back to Login
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailConfirmation

