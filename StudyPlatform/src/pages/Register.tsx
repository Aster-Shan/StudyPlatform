"use client"

import { AlertCircle, Shield } from "lucide-react"
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

// Define the response type
interface RegisterResponse {
  message?: string
  email?: string
}

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    return regex.test(password)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match")
    }

    if (!validatePassword(formData.password)) {
      return setError("Password must be at least 8 characters and include at least one letter and one number")
    }

    setLoading(true)

    try {
      // Cast the response to the RegisterResponse type
      const response = (await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      })) as RegisterResponse

      // Navigate to verification pending page instead of home
      navigate("/verification-pending", {
        state: {
          email: formData.email,
          message: response.message || "Registration successful! Please check your email to verify your account.",
        },
      })
    } catch (err: unknown) {
      console.error("Registration error:", err)
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.")
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
                      Create an Account
                    </h3>
                    <p className="mb-0 opacity-75" style={{ fontSize: "1rem" }}>
                      Enter your information to create an account
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
                <form className="mb-4" onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="firstName" className="form-label" style={{ fontSize: "1.2rem" }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      style={{ fontSize: "1rem" }}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="lastName" className="form-label" style={{ fontSize: "1.2rem" }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      style={{ fontSize: "1rem" }}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="form-label" style={{ fontSize: "1.2rem" }}>
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{ fontSize: "1rem" }}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label" style={{ fontSize: "1.2rem" }}>
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{ fontSize: "1rem" }}
                    />
                  </div>

                  <div className="mb-5">
                    <label htmlFor="confirmPassword" className="form-label" style={{ fontSize: "1.2rem" }}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      style={{ fontSize: "1rem" }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 mb-4"
                    disabled={loading}
                    style={{ fontSize: "1.2rem" }}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </form>

                <div className="d-flex justify-content-between align-items-center mt-4">
                  <p className="text-center text-gray-500">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary">
                      Login
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
