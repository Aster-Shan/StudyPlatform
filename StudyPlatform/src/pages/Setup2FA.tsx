import { AlertCircle, KeyRound, LogOut, Shield, User } from 'lucide-react';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function Setup2FA() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [secret, setSecret] = useState("");
  const [qrCodeData, setQrCodeData] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const setup2FA = async () => {
      if (user?.using2FA) return;

      setLoading(true);
      try {
        const response = await api.post("/api/2fa/setup");
        setSecret(response.data.secret);
        setQrCodeData(response.data.qrCodeData);
      } catch (err) {
        setError("Failed to set up 2FA. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    setup2FA();
  }, [user]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setVerifying(true);

    try {
      await api.post("/api/2fa/verify", null, {
        params: { code: verificationCode },
      });

      setSuccess(true);
      updateUser({ using2FA: true });

      setTimeout(() => {
        navigate("/profile");
      }, 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to enable 2FA. Please try again.');
      } else {
        setError("Failed to enable 2FA. Please try again.");
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      await api.post("/api/2fa/disable");
      updateUser({ using2FA: false });
      navigate("/profile");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to disable 2FA. Please try again.');
      } else {
        setError('Failed to disable 2FA. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="vh-100 vw-100 d-flex justify-content-center align-items-center bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Custom Navbar */}
      <header className="navbar navbar-light bg-white border-bottom">
        <div className="container ms-2">
          {/* Brand */}
          <Link to="/" className="navbar-brand fw-bold">
            UserManagement
          </Link>

          {/* Nav links */}
          <ul className="navbar-nav me-auto d-flex flex-row">
            {user ? (
              <>
                <li className="nav-item me-3">
                  <Link to="/" className="nav-link">
                    Home
                  </Link>
                </li>
                <li className="nav-item me-3">
                  <Link to="/documents" className="nav-link">
                    Documents
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link active">
                    Profile
                  </Link>
                </li>
              </>
            ) : (
              <></>
            )}
          </ul>

          {/* Auth buttons or user info */}
          {user ? (
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center me-3">
                <div className="d-flex align-items-center justify-content-center bg-light rounded-circle me-2" style={{ width: "32px", height: "32px" }}>
                  {user.profilePictureUrl ? (
                    <img
                      src={user.profilePictureUrl || "/placeholder.svg"}
                      alt={user.firstName}
                      className="rounded-circle w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <span className="fw-medium text-secondary">
                      {user.firstName?.charAt(0)}
                      {user.lastName?.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="d-none d-md-inline">{user.firstName}</span>
              </div>
              <button 
                className="btn btn-danger btn-sm d-flex align-items-center"
                onClick={handleLogout}
              >
                <LogOut size={16} className="me-2" />
                <span className="d-none d-md-inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="d-flex">
              <Link to="/login" className="btn btn-outline-secondary me-2">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </header>
      
      <div className="flex-grow-1">
        {/* Header with Gradient */}
        <div className="w-100 text-white py-4" 
             style={{ 
               background: "linear-gradient(135deg, #000000 0%, #2c3e50 100%)",
               borderBottom: "1px solid rgba(255,255,255,0.1)"
             }}>
          <div className="container px-4">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h1 className="display-5 fw-bold mb-1">Two-Factor Authentication</h1>
                <p className="lead opacity-75 mb-0">
                  {user?.using2FA
                    ? "Manage your two-factor authentication settings"
                    : "Set up two-factor authentication for your account"}
                </p>
              </div>
              <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                <Link to="/profile" className="btn btn-light d-inline-flex align-items-center">
                  <User size={18} className="me-2" />
                  <span>Back to Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container px-4 py-4">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-bottom-0 pt-4">
                  <div className="d-flex align-items-center">
                    <Shield size={20} className="text-primary me-2" />
                    <h5 className="card-title mb-0">
                      {user?.using2FA ? "Manage 2FA" : "Setup Two-Factor Authentication"}
                    </h5>
                  </div>
                  <p className="card-subtitle text-muted small mt-1">
                    {user?.using2FA
                      ? "Your account is protected with an additional layer of security"
                      : "Add an extra layer of security to your account"}
                  </p>
                </div>
                
                <div className="card-body">
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                      <AlertCircle size={18} className="me-2" />
                      <div>{error}</div>
                    </div>
                  )}

                  {success ? (
                    <div className="alert alert-success mb-4" role="alert">
                      <p className="mb-0">Two-factor authentication has been enabled successfully. You will be redirected to your profile.</p>
                    </div>
                  ) : user?.using2FA ? (
                    <div className="mb-4">
                      <div className="d-flex align-items-center p-3 bg-light rounded mb-4">
                        <KeyRound size={20} className="text-success me-3" />
                        <p className="mb-0">
                          Two-factor authentication is currently <span className="fw-bold">enabled</span> for your account.
                        </p>
                      </div>
                      
                      <div className="alert alert-warning mb-4" role="alert">
                        <h6 className="alert-heading fw-bold">Important</h6>
                        <p className="mb-0">
                          Disabling two-factor authentication will make your account less secure. 
                          Only proceed if you're sure you want to remove this additional protection.
                        </p>
                      </div>
                      
                      <button
                        className="btn btn-danger w-100"
                        onClick={handleDisable2FA}
                      >
                        Disable Two-Factor Authentication
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4">
                        <h6 className="fw-bold mb-3">1. Scan QR Code</h6>
                        <p className="text-muted small mb-3">
                          Scan this QR code with your authenticator app (like Google Authenticator, Authy, or Microsoft Authenticator).
                        </p>
                        {loading ? (
                          <div className="d-flex justify-content-center p-4">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        ) : (
                          <div className="d-flex justify-content-center p-4 bg-light rounded">
                            {qrCodeData ? (
                              <img src={qrCodeData || "/placeholder.svg"} alt="QR Code for 2FA" width={200} height={200} className="img-fluid" />
                            ) : (
                              <div className="d-flex align-items-center justify-content-center bg-secondary text-white" style={{ width: "200px", height: "200px" }}>
                                QR Code
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <h6 className="fw-bold mb-3">2. Manual Setup</h6>
                        <p className="text-muted small mb-3">
                          If you can't scan the QR code, enter this code manually in your app:
                        </p>
                        <div className="bg-light p-3 rounded text-center font-monospace">
                          {secret || "Loading..."}
                        </div>
                      </div>

                      <form onSubmit={handleVerify}>
                        <div className="mb-4">
                          <h6 className="fw-bold mb-3">3. Verify Setup</h6>
                          <p className="text-muted small mb-3">
                            Enter the 6-digit code from your authenticator app to verify setup:
                          </p>
                          <input
                            type="text"
                            className="form-control text-center font-monospace"
                            placeholder="000000"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            maxLength={6}
                            pattern="[0-9]*"
                            inputMode="numeric"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="btn btn-primary w-100"
                          disabled={verifying || !secret}
                        >
                          {verifying ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Verifying...
                            </>
                          ) : (
                            "Verify & Enable 2FA"
                          )}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
                
                <div className="card-footer bg-white border-top-0 text-center py-3">
                  <div className="d-flex justify-content-center align-items-center">
                    <Shield size={16} className="text-primary me-2" />
                    <span className="text-muted small">
                      Two-factor authentication adds an extra layer of security to your account
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-top py-3 mt-auto">
        <div className="container px-4">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0 text-muted small">© 2023 UserManagement. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <ul className="list-inline mb-0">
                <li className="list-inline-item"><a href="#" className="text-muted small">Privacy Policy</a></li>
                <li className="list-inline-item"><span className="text-muted">•</span></li>
                <li className="list-inline-item"><a href="#" className="text-muted small">Terms of Service</a></li>
                <li className="list-inline-item"><span className="text-muted">•</span></li>
                <li className="list-inline-item"><a href="#" className="text-muted small">Contact Support</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}