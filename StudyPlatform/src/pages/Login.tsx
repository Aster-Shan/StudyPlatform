import { Shield } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 vw-100 d-flex align-items-center justify-content-center bg-light" >
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
                    <h3 className="mb-1 fw-bold" style={{ fontSize: '1.8rem' }}>Sign In</h3>
                    <p className="mb-0 opacity-75" style={{ fontSize: '1rem' }}>Access your account securely</p>
                  </div>
                  <div className="rounded-circle bg-white bg-opacity-10 p-3">
                    <Shield size={28} className="text-white" />
                  </div>
                </div>
              </div>

              <div className="card-body p-5">
                {error && <div className="alert alert-danger">{error}</div>}
                <form className="mb-4" onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label" style={{ fontSize: '1.2rem' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ fontSize: '1rem' }}
                    />
                  </div>

                  <div className="mb-5">
                    <div className="d-flex justify-content-between">
                      <label htmlFor="password" className="form-label" style={{ fontSize: '1.2rem' }}>
                        Password
                      </label>
                      <Link to="/forgot-password" className="text-primary text-decoration-none" style={{ fontSize: '1rem' }}>
                        Forgot?
                      </Link>
                    </div>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ fontSize: '1rem' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100 py-3 mb-4" disabled={loading} style={{ fontSize: '1.2rem' }}>
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </form>

                <div className="text-center">
                  <p className="mb-0" style={{ fontSize: '1rem' }}>
                    Don't have an account? {" "}
                    <Link to="/register" className="text-primary text-decoration-none">
                      Sign up
                    </Link>
                  </p>
                </div>
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
