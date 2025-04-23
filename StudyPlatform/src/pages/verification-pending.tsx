"use client"

import { ArrowLeft, Mail } from "lucide-react"
import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import api from "../services/api"

export default function VerificationPending() {
  const location = useLocation()
  const { email, message } = location.state || {}
  const [resendStatus, setResendStatus] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)

  const handleResendVerification = async () => {
    if (!email || isResending) return

    setIsResending(true)
    setResendStatus(null)

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await api.post("/api/auth/resend-verification", { email })
      setResendStatus("success")
    } catch (error) {
      console.error("Failed to resend verification email:", error)
      setResendStatus("error")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="vh-100 vw-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container" style={{ maxWidth: "1500px" }}>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-7">
            <div className="card border-0 shadow-lg" style={{ borderRadius: "15px" }}>
              <div className="card-body p-5 text-center">
                <div
                  className="rounded-circle bg-light mx-auto mb-4 d-flex align-items-center justify-content-center"
                  style={{ width: "80px", height: "80px" }}
                >
                  <Mail size={40} className="text-primary" />
                </div>

                <h2 className="mb-3 fw-bold">Verify Your Email</h2>
                <p className="mb-4">
                  {message ||
                    "We've sent a verification email to your inbox. Please check your email and click the verification link to activate your account."}
                </p>

                {email && (
                  <div className="alert alert-info mb-4">
                    <strong>Email sent to:</strong> {email}
                  </div>
                )}

                {resendStatus === "success" && (
                  <div className="alert alert-success mb-4">Verification email has been resent successfully!</div>
                )}

                {resendStatus === "error" && (
                  <div className="alert alert-danger mb-4">
                    Failed to resend verification email. Please try again later.
                  </div>
                )}

                <div className="d-flex justify-content-center gap-3 mt-4">
                  <Link to="/login" className="btn btn-outline-secondary d-flex align-items-center">
                    <ArrowLeft size={18} className="me-2" />
                    Back to Login
                  </Link>
                  <button
                    className="btn btn-primary"
                    onClick={handleResendVerification}
                    disabled={isResending || !email}
                  >
                    {isResending ? "Sending..." : "Resend Verification Email"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
