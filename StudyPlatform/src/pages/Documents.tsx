"use client"

import { FileArchive, FileImage, FileIcon as FilePdf, FileText, LogOut, Search, Upload } from "lucide-react"
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import DocumentUpload from "../components/DocumentUpload"
import DocumentsList from "../components/DocumentsList"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
import { getPublicDocuments, searchDocuments } from "../services/documentService"
import type { Document } from "../types"

export default function Documents() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [documentStats, setDocumentStats] = useState({
    total: 0,
    pdf: 0,
    image: 0,
    other: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Document[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showPublicDocuments, setShowPublicDocuments] = useState(false)
  const [publicDocuments, setPublicDocuments] = useState<Document[]>([])
  const [loadingPublic, setLoadingPublic] = useState(false)

  useEffect(() => {
    fetchDocumentStats()
  }, [refreshTrigger])

  const fetchDocumentStats = async () => {
    try {
      setLoading(true)
      const response = await api.get("/api/documents/stats")
      setDocumentStats(response.data)
    } catch (error) {
      console.error("Failed to fetch document statistics:", error)
      // Fallback to default stats if API fails
      setDocumentStats({
        total: 0,
        pdf: 0,
        image: 0,
        other: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      setIsSearching(true)
      const results = await searchDocuments(searchQuery)
      setSearchResults(results)
      setShowPublicDocuments(false)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleShowPublicDocuments = async () => {
    try {
      setLoadingPublic(true)
      const documents = await getPublicDocuments()
      setPublicDocuments(documents)
      setShowPublicDocuments(true)
      setSearchResults([])
      setSearchQuery("")
    } catch (error) {
      console.error("Failed to fetch public documents:", error)
    } finally {
      setLoadingPublic(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setShowPublicDocuments(false)
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1)
    setShowUploadForm(false)
  }

  const toggleUploadForm = () => {
    setShowUploadForm(!showUploadForm)
  }

  if (!user) {
    return (
      <div className="vh-100 vw-100 d-flex justify-content-center align-items-center bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
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
                  <Link to="/documents" className="nav-link active">
                    Documents
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link">
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
                <div
                  className="d-flex align-items-center justify-content-center bg-light rounded-circle me-2"
                  style={{ width: "32px", height: "32px" }}
                >
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
              <button className="btn btn-danger btn-sm d-flex align-items-center" onClick={handleLogout}>
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
        <div
          className="w-100 text-white py-4"
          style={{
            background: "linear-gradient(135deg, #000000 0%, #2c3e50 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div className="container px-4">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h1 className="display-5 fw-bold mb-1">Documents</h1>
                <p className="lead opacity-75 mb-0">Upload and manage your documents</p>
              </div>
              <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                <button
                  className="btn btn-primary d-inline-flex align-items-center"
                  onClick={toggleUploadForm}
                  style={{ backgroundColor: "#0d6efd", color: "white" }}
                >
                  <Upload size={18} className="me-2" />
                  <span>Upload New Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container px-4 py-4">
          {/* Search Section */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-bottom-0 pt-4">
                  <div className="d-flex align-items-center">
                    <Search size={20} className="text-primary me-2" />
                    <h5 className="card-title mb-0">Search Documents</h5>
                  </div>
                  <p className="card-subtitle text-muted small mt-1">Find documents by name or description</p>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSearch} className="mb-3">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search for documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button type="submit" className="btn btn-primary" disabled={isSearching || !searchQuery.trim()}>
                        {isSearching ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Searching...
                          </>
                        ) : (
                          <>
                            <Search size={16} className="me-2" />
                            Search
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm me-2"
                        onClick={handleShowPublicDocuments}
                        disabled={loadingPublic}
                      >
                        {loadingPublic ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Loading...
                          </>
                        ) : (
                          "Browse Public Documents"
                        )}
                      </button>
                      {(searchResults.length > 0 || showPublicDocuments) && (
                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={clearSearch}>
                          Show My Documents
                        </button>
                      )}
                    </div>
                    <div>
                      {searchResults.length > 0 && (
                        <span className="badge bg-primary">{searchResults.length} results found</span>
                      )}
                      {showPublicDocuments && (
                        <span className="badge bg-success">{publicDocuments.length} public documents</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Form Section - Conditionally rendered */}
          {showUploadForm && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-bottom-0 pt-4">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <Upload size={20} className="text-primary me-2" />
                        <h5 className="card-title mb-0">Upload New Document</h5>
                      </div>
                      <button
                        className="btn-close"
                        onClick={() => setShowUploadForm(false)}
                        aria-label="Close"
                      ></button>
                    </div>
                    <p className="card-subtitle text-muted small mt-1">Add a new document to your account</p>
                  </div>
                  <div className="card-body">
                    <DocumentUpload onUploadSuccess={handleUploadSuccess} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Document Stats - Only show when viewing user's own documents */}
          {!searchResults.length && !showPublicDocuments && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-bottom-0 pt-4">
                    <h5 className="card-title mb-0">Document Statistics</h5>
                    <p className="card-subtitle text-muted small mt-1">Overview of your document usage</p>
                  </div>
                  <div className="card-body">
                    {loading ? (
                      <div className="d-flex justify-content-center py-3">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="row g-4">
                        <div className="col-md-3">
                          <div className="border rounded p-3 text-center">
                            <div className="d-flex justify-content-center mb-2">
                              <FileText size={24} className="text-primary" />
                            </div>
                            <h3 className="fw-bold text-primary mb-1">{documentStats.total}</h3>
                            <p className="text-muted small mb-0">Total Documents</p>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="border rounded p-3 text-center">
                            <div className="d-flex justify-content-center mb-2">
                              <FilePdf size={24} className="text-danger" />
                            </div>
                            <h3 className="fw-bold text-danger mb-1">{documentStats.pdf}</h3>
                            <p className="text-muted small mb-0">PDF Files</p>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="border rounded p-3 text-center">
                            <div className="d-flex justify-content-center mb-2">
                              <FileImage size={24} className="text-success" />
                            </div>
                            <h3 className="fw-bold text-success mb-1">{documentStats.image}</h3>
                            <p className="text-muted small mb-0">Image Files</p>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="border rounded p-3 text-center">
                            <div className="d-flex justify-content-center mb-2">
                              <FileArchive size={24} className="text-warning" />
                            </div>
                            <h3 className="fw-bold text-warning mb-1">{documentStats.other}</h3>
                            <p className="text-muted small mb-0">Other Files</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents List */}
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-bottom-0 pt-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <FileText size={20} className="text-primary me-2" />
                      <h5 className="card-title mb-0">
                        {searchResults.length > 0
                          ? "Search Results"
                          : showPublicDocuments
                            ? "Public Documents"
                            : "Your Documents"}
                      </h5>
                    </div>
                    {!searchResults.length && !showPublicDocuments && (
                      <div>
                        <span className="badge bg-primary rounded-pill">Recent Activity</span>
                      </div>
                    )}
                  </div>
                  <p className="card-subtitle text-muted small mt-1">
                    {searchResults.length > 0
                      ? "Documents matching your search query"
                      : showPublicDocuments
                        ? "Documents shared by other users"
                        : "Manage your uploaded documents"}
                  </p>
                </div>
                <div className="card-body">
                  {searchResults.length > 0 ? (
                    <DocumentsList documents={searchResults} onDocumentDeleted={() => {}} />
                  ) : showPublicDocuments ? (
                    <DocumentsList documents={publicDocuments} onDocumentDeleted={() => {}} />
                  ) : (
                    <DocumentsList refreshTrigger={refreshTrigger} />
                  )}
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
                <li className="list-inline-item">
                  <a href="#" className="text-muted small">
                    Privacy Policy
                  </a>
                </li>
                <li className="list-inline-item">
                  <span className="text-muted">•</span>
                </li>
                <li className="list-inline-item">
                  <a href="#" className="text-muted small">
                    Terms of Service
                  </a>
                </li>
                <li className="list-inline-item">
                  <span className="text-muted">•</span>
                </li>
                <li className="list-inline-item">
                  <a href="#" className="text-muted small">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

