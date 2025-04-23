"use client"

import axios from "axios"
import { CheckCircle, Loader, XCircle } from "lucide-react"
import React, { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

export default function VerificationSuccess() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState("loading") // loading, success, error
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error")
        setMessage("Verification token is missing")
        return
      }

      try {
        const response = await axios.get(`/api/auth/verify-email?token=${token}`)
        setStatus("success")
        setMessage(response.data.message || "Email verified successfully!")

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login")
        }, 3000)
      } catch (error) {
        setStatus("error")
        if (axios.isAxiosError(error) && error.response) {
          setMessage(error.response.data.message || "Verification failed")
        } else {
          setMessage("Verification failed. Please try again.")
        }
      }
    }

    verifyEmail()
  }, [token, navigate])

  return (
    <div className="vh-100 vw-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container" style={{ maxWidth: "1500px" }}>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-7">
            <div className="card border-0 shadow-lg" style={{ borderRadius: "15px" }}>
              <div className="card-body p-5 text-center">
                {status === "loading" && (
                  <>
                    <Loader size={60} className="text-primary mb-4 animate-spin" />
                    <h2 className="mb-3">Verifying your email...</h2>
                    <p>Please wait while we verify your email address.</p>
                  </>
                )}

                {status === "success" && (
                  <>
                    <CheckCircle size={60} className="text-success mb-4" />
                    <h2 className="mb-3">Email Verified!</h2>
                    <p>{message}</p>
                    <p className="mt-3">Redirecting to login page...</p>
                    <Link to="/login" className="btn btn-primary mt-3">
                      Go to Login
                    </Link>
                  </>
                )}

                {status === "error" && (
                  <>
                    <XCircle size={60} className="text-danger mb-4" />
                    <h2 className="mb-3">Verification Failed</h2>
                    <p>{message}</p>
                    <Link to="/login" className="btn btn-primary mt-3">
                      Back to Login
                    </Link>
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
