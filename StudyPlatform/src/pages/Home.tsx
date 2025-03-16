import { Bell, Calendar, ChevronRight, FileText, LogOut, Settings, Shield, User } from 'lucide-react';
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Function to navigate to profile/settings
  const goToProfile = () => {
    navigate("/profile");
  };
  const goToDocuments = () => {
    navigate("/documents");
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

  // Get current date for the greeting
  const currentHour = new Date().getHours();
  let greeting = "Good morning";
  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon";
  } else if (currentHour >= 17) {
    greeting = "Good evening";
  }

  return (
    <div className="min-vh-100 bg-light d-flex flex-column" >
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
                <li className="nav-item">
                  <Link to="/documents" className="nav-link">
                    Documents
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
        {/* Modern Header with Gradient */}
        <div className="w-100 text-white py-5" 
             style={{ 
               background: "linear-gradient(135deg, #000000 0%, #2c3e50 100%)",
               borderBottom: "1px solid rgba(255,255,255,0.1)"
             }}>
          <div className="container px-4">
            <div className="row align-items-center">
              <div className="col-lg-7">
                <h1 className="display-5 fw-bold mb-1">{greeting}, {user.firstName}!</h1>
                <p className="lead opacity-75 mb-0">Welcome to your secure dashboard</p>
                <div className="d-flex align-items-center mt-3">
                  <span className="badge bg-success d-flex align-items-center px-3 py-2">
                    <Shield size={14} className="me-1" />
                    Account Secured
                  </span>
                  <span className="ms-3 text-white-50">
                    Last login: Today at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
              <div className="col-lg-5 text-lg-end mt-4 mt-lg-0">
                <div className="d-inline-flex align-items-center p-3 bg-white bg-opacity-10 rounded-3 shadow-sm">
                  <div className="me-3 position-relative">
                    {user.profilePictureUrl ? (
                      <img
                        src={user.profilePictureUrl || "/placeholder.svg"}
                        alt={user.firstName}
                        className="rounded-circle"
                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                      />
                    ) : (
                      <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" 
                           style={{ width: "80px", height: "80px" }}>
                        <span className="fs-3 text-white fw-bold">
                          {user.firstName?.charAt(0)}
                          {user.lastName?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <span className="position-absolute bottom-0 end-0 bg-success rounded-circle p-1 border border-dark" 
                          style={{ width: "16px", height: "16px" }}></span>
                  </div>
                  <div>
                    <h5 className="mb-0 text-white">{user.firstName} {user.lastName}</h5>
                    <p className="mb-1 small text-white text-opacity-75">{user.email}</p>
                    <div className="d-flex align-items-center">
                      <span className="badge bg-light text-dark me-2">Premium</span>
                      <span className="badge bg-success">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-white border-bottom shadow-sm py-3">
          <div className="container px-4">
            <div className="row">
              <div className="col-12">
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <div className="d-flex align-items-center mb-2 mb-md-0">
                    <span className="text-muted me-3">Quick Actions:</span>
                    <div className="btn-group">
                    <button 
                        className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                        onClick={goToDocuments}
                      >
                        <FileText size={16} className="me-2" />
                        New Document
                      </button>
                      <button className="btn btn-sm btn-outline-secondary d-flex align-items-center">
                        <Calendar size={16} className="me-2" />
                        Schedule
                      </button>
                      {/* Added onClick handler to actually log out */}
                      <button 
                        className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} className="me-2" />
                        Log Out
                      </button>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <button className="btn btn-sm btn-light position-relative me-3">
                      <Bell size={18} />
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        2
                      </span>
                    </button>
                    {/* Added onClick handler to navigate to profile */}
                    <button 
                      className="btn btn-sm btn-primary d-flex align-items-center"
                      onClick={goToProfile}
                    >
                      <Settings size={16} className="me-2" />
                      Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container px-4 py-4">
          {/* Overview Stats */}
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                      <Shield size={24} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="mb-0">Security Score</h6>
                      <h3 className="mb-0 mt-1">75/100</h3>
                    </div>
                  </div>
                  <div className="progress" style={{ height: "8px" }}>
                    <div className="progress-bar bg-primary" role="progressbar" style={{ width: "75%" }} aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}></div>
                  </div>
                  <p className="text-muted mt-3 mb-0 small">Enable 2FA to increase your security score.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-8">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h5 className="card-title mb-3">Account Activity</h5>
                  <div className="table-responsive">
                    <table className="table table-sm mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">Activity</th>
                          <th scope="col">Device</th>
                          <th scope="col">Date</th>
                          <th scope="col">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Login</td>
                          <td>Chrome on Windows</td>
                          <td>Today, {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                          <td><span className="badge bg-success">Success</span></td>
                        </tr>
                        <tr>
                          <td>Password Changed</td>
                          <td>Chrome on Windows</td>
                          <td>3 days ago</td>
                          <td><span className="badge bg-success">Success</span></td>
                        </tr>
                        <tr>
                          <td>Login Attempt</td>
                          <td>Unknown Device</td>
                          <td>5 days ago</td>
                          <td><span className="badge bg-danger">Failed</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mx-0">
            {/* Profile Overview Card */}
            <div className="col-md-6 col-xl-4 px-2">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-bottom-0 pt-4 d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="card-title mb-0">Profile Overview</h5>
                    <p className="card-subtitle text-muted small">Your personal information</p>
                  </div>
                  <span className="badge bg-primary bg-opacity-10 text-primary">60% Complete</span>
                </div>
                <div className="card-body">
                  {user.bio ? (
                    <div>
                      <h6 className="small fw-bold">Bio</h6>
                      <p className="small text-muted">{user.bio}</p>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="mb-3">
                        <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: "90px", height: "90px" }}>
                          <User size={40} className="text-secondary" />
                        </div>
                      </div>
                      <p className="text-muted">No bio added yet. Add information about yourself.</p>
                      <button className="btn btn-outline-primary btn-sm" onClick={goToProfile}>
                        Add Bio
                      </button>
                    </div>
                  )}
                </div>
                <div className="card-footer bg-white border-top-0 text-end">
                  {/* Added onClick handler to navigate to profile */}
                  <button 
                    className="btn btn-link text-decoration-none p-0"
                    onClick={goToProfile}
                  >
                    Edit Profile <ChevronRight size={16} className="ms-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Academic Interests Card */}
            <div className="col-md-6 col-xl-4 px-2">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-bottom-0 pt-4">
                  <h5 className="card-title mb-0">Academic Interests</h5>
                  <p className="card-subtitle text-muted small">Your areas of study</p>
                </div>
                <div className="card-body">
                  {user.academicInterests && user.academicInterests.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {user.academicInterests.map((interest, index) => (
                        <span key={index} className="badge bg-primary rounded-pill px-3 py-2">
                          {interest}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="mb-3">
                        <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: "90px", height: "90px" }}>
                          <FileText size={40} className="text-secondary" />
                        </div>
                      </div>
                      <p className="text-muted">No academic interests added yet.</p>
                      <button className="btn btn-outline-primary btn-sm" onClick={goToProfile}>
                        Add Interests
                      </button>
                    </div>
                  )}
                </div>
                <div className="card-footer bg-white border-top-0 text-end">
                  {/* Added onClick handler to navigate to profile */}
                  <button 
                    className="btn btn-link text-decoration-none p-0"
                    onClick={goToProfile}
                  >
                    Manage Interests <ChevronRight size={16} className="ms-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Account Security Card */}
            <div className="col-md-6 col-xl-4 px-2">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-bottom-0 pt-4">
                  <h5 className="card-title mb-0">Account Security</h5>
                  <p className="card-subtitle text-muted small">Your security settings</p>
                </div>
                <div className="card-body">
                  <div className="list-group list-group-flush">
                    <div className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0">Two-Factor Authentication</h6>
                          <p className="text-muted small mb-0">Enhance your account security</p>
                        </div>
                        <div className="form-check form-switch">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            role="switch" 
                            id="twoFactorSwitch" 
                            checked={user.using2FA} 
                            readOnly
                          />
                          <label className="form-check-label visually-hidden" htmlFor="twoFactorSwitch">
                            Toggle 2FA
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0">Password</h6>
                          <p className="text-muted small mb-0">Last updated: 3 days ago</p>
                        </div>
                        <button className="btn btn-outline-secondary btn-sm">Change</button>
                      </div>
                    </div>
                    
                    <div className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0">Email Verification</h6>
                          <p className="text-muted small mb-0">Your email is verified</p>
                        </div>
                        <span className="badge bg-success">Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-white border-top-0 text-end">
                  {/* Added onClick handler to navigate to profile */}
                  <button 
                    className="btn btn-link text-decoration-none p-0"
                    onClick={goToProfile}
                  >
                    Security Settings <ChevronRight size={16} className="ms-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Premium Features Banner */}
          <div className="row mt-4 mb-5 mx-0">
            <div className="col-12 px-2">
              <div className="card border-0 shadow-sm overflow-hidden">
                <div className="card-body p-0">
                  <div className="row g-0">
                    <div className="col-lg-8 p-4">
                      <h4 className="mb-2">Complete Your Profile</h4>
                      <p className="text-muted mb-3">
                        Add more information to your profile to get the most out of our platform.
                        Your profile is currently 60% complete.
                      </p>
                      <div className="progress mb-3" style={{ height: "8px" }}>
                        <div className="progress-bar bg-primary" role="progressbar" style={{ width: "60%" }} aria-valuenow={60} aria-valuemin={0} aria-valuemax={100}></div>
                      </div>
                      {/* Added onClick handler to navigate to profile */}
                      <button 
                        className="btn btn-primary"
                        onClick={goToProfile}
                      >
                        Edit Profile
                      </button>
                    </div>
                    <div className="col-lg-4 bg-primary text-white p-4" style={{ 
                      background: "linear-gradient(45deg, #4b6cb7 0%, #182848 100%)"
                    }}>
                      <h5 className="mb-3">Premium Features Available</h5>
                      <ul className="list-unstyled mb-4">
                        <li className="mb-2 d-flex align-items-center">
                          <span className="me-2">✓</span> Advanced security monitoring
                        </li>
                        <li className="mb-2 d-flex align-items-center">
                          <span className="me-2">✓</span> Priority customer support
                        </li>
                        <li className="d-flex align-items-center">
                          <span className="me-2">✓</span> Unlimited document storage
                        </li>
                      </ul>
                      <button className="btn btn-light">Upgrade Now</button>
                    </div>
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