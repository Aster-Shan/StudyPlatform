import { AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/api/auth/forgot-password', null, {
        params: { email },
      });
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to upload document');
      } else {
        setError('Failed to upload document');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 vw-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container" style={{ maxWidth: '1500px' }}>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-7">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '15px' }}>
              <div
                className="card-header border-0 text-white py-5"
                style={{
                  background: "linear-gradient(135deg, #000000 0%, #2c3e50 100%)",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  borderTopLeftRadius: '15px',
                  borderTopRightRadius: '15px'
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h3 className="mb-1 fw-bold" style={{ fontSize: '1.8rem' }}>Forgot Password</h3>
                    <p className="mb-0 opacity-75" style={{ fontSize: '1rem' }}>Enter your email to receive a password reset link</p>
                  </div>
                  <div className="rounded-circle bg-white bg-opacity-10 p-3">
                    <AlertCircle size={28} className="text-white" />
                  </div>
                </div>
              </div>

              <div className="card-body p-5">
                {error && (
                  <div className="alert alert-danger">{error}</div>
                )}

                {success ? (
                  <div className="alert alert-success">
                    If an account exists with that email, we've sent a password reset link. Please check your inbox.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label" style={{ fontSize: '1.2rem' }}>
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-control"
                        style={{ fontSize: '1rem' }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-3 mb-4"
                      disabled={loading}
                      style={{ fontSize: '1.2rem' }}
                    >
                      {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                  </form>
                )}
              </div>

              <div className="text-center mb-5">
              <p className="mb-0" style={{ fontSize: '1rem' }}>
                  Remember your password?{" "}
                  <Link to="/login" className="text-primary text-decoration-none">
                    Back to login
                  </Link>
                </p>
              </div>
            </div>

            <div className="text-center mt-5">
              <p className="small text-muted mb-0" style={{ fontSize: '0.9rem' }}>© 2023 UserManagement. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
