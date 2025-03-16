import axios from "axios"
import { AlertCircle, Shield } from 'lucide-react'
import React, { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token")
    }
  }, [token])

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
  
    if (password !== confirmPassword) {
      return setError("Passwords do not match")
    }
  
    setLoading(true)
  
    // Add this to see what's being sent
    console.log("Sending data:", {
      token: token,
      newPassword: password
    });
  
    try {
      const response = await axios.post(
        `http://localhost:8080/api/users/reset-password?token=${token}&newPassword=${password}`,
        {},  // Empty body
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      console.log("Response:", response);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: unknown) {
      console.error("Error:", error);
      
      if (axios.isAxiosError(error) && error.response) {
        // This is an Axios error with a response
        console.log("Error response:", error.response.data);
        setError(error.response.data?.message || 'Failed to reset password');
      } else {
        // This is some other type of error
        setError('Failed to reset password');
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="vh-100 vw-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container" style={{ maxWidth: "1500px" }}>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-7">
            <div className="card border-0 shadow-lg" style={{ borderRadius: "15px" }}>
              <div
                className="card-header border-0 text-white py-5"
                style={{
                  background: "linear-gradient(135deg, #000000 0%, #2c3e50 100%)",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  borderTopLeftRadius: "15px",
                  borderTopRightRadius: "15px",
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h3 className="mb-1 fw-bold" style={{ fontSize: "1.8rem" }}>
                      Reset Password
                    </h3>
                    <p className="mb-0 opacity-75" style={{ fontSize: "1rem" }}>
                      Enter your new password below
                    </p>
                  </div>
                  <div className="rounded-circle bg-white bg-opacity-10 p-3">
                    <Shield size={28} className="text-white" />
                  </div>
                </div>
              </div>

              <div className="card-body p-5">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center">
                    <AlertCircle size={20} className="me-2" />
                    <div>{error}</div>
                  </div>
                )}

                {success ? (
                  <div className="alert alert-success">
                    <p>Your password has been reset successfully. You will be redirected to the login page.</p>
                  </div>
                ) : (
                  <form className="mb-4" onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="password" className="form-label" style={{ fontSize: "1.2rem" }}>
                        New Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ fontSize: "1rem" }}
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="form-label" style={{ fontSize: "1.2rem" }}>
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ fontSize: "1rem" }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-3 mb-4"
                      disabled={loading || !token}
                      style={{ fontSize: "1.2rem" }}
                    >
                      {loading ? "Resetting..." : "Reset Password"}
                    </button>
                  </form>
                )}

                <div className="d-flex justify-content-between align-items-center mt-4">
                  <p className="text-center text-gray-500">
                    Remember your password?{" "}
                    <Link to="/login" className="text-primary">
                      Back to login
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}