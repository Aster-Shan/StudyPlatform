"use client"

import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, Download, FileArchive, FileImage, FileText, Globe, Lock, Trash2 } from "lucide-react"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import DocumentComments from "../components/DocumentComments"
import DocumentSummary from "../components/DocumentSummary"
import { useAuth } from "../contexts/AuthContext"
import {
  deleteDocument,
  getDocumentActivityStats,
  getDocumentById,
  getDocumentSummary,
  getDownloadUrl,
  updateDocumentVisibility,
} from "../services/documentService"
import type { Document } from "../types"

export default function DocumentDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [documentData, setDocumentData] = useState<Document | null>(null)
  const [activityStats, setActivityStats] = useState<{
    views: number
    downloads: number
    lastAccessed: string
  }>({
    views: 0,
    downloads: 0,
    lastAccessed: "",
  })
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingVisibility, setUpdatingVisibility] = useState(false)
  const [summaryWordCount, setSummaryWordCount] = useState<number | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (id) {
      fetchDocument(Number.parseInt(id))
    }
  }, [id])

  const fetchDocument = async (documentId: number) => {
    try {
      setLoading(true)
      const data = await getDocumentById(documentId)
      console.log("Document data:", data) // Debug log to check document structure
      setDocumentData(data)
      setError("")

      // After fetching document, get activity stats
      fetchActivityStats(documentId)
    } catch (err) {
      setError("Failed to load document")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchActivityStats = async (documentId: number) => {
    try {
      setStatsLoading(true)
      const stats = await getDocumentActivityStats(documentId)
      setActivityStats(stats)
    } catch (err) {
      console.error("Failed to load document activity stats:", err)
      // Don't set error state here to avoid blocking the whole page
    } finally {
      setStatsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!documentData) return

    if (!window.confirm("Are you sure you want to delete this document?")) {
      return
    }

    try {
      await deleteDocument(documentData.id)
      navigate("/documents")
    } catch (err) {
      setError("Failed to delete document")
      console.error(err)
    }
  }

  const toggleVisibility = async () => {
    if (!documentData || user?.id !== documentData.user.id) return

    try {
      setUpdatingVisibility(true)
      const newVisibility = !documentData.isPublic
      await updateDocumentVisibility(documentData.id, newVisibility)

      // Update the document in state
      setDocumentData({
        ...documentData,
        isPublic: newVisibility,
      })
    } catch (err) {
      setError("Failed to update document visibility")
      console.error(err)
    } finally {
      setUpdatingVisibility(false)
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) {
      return <FileText size={24} className="text-danger" />
    } else if (fileType.includes("word") || fileType.includes("doc")) {
      return <FileText size={24} className="text-primary" />
    } else if (fileType.includes("sheet") || fileType.includes("excel") || fileType.includes("xls")) {
      return <FileText size={24} className="text-success" />
    } else if (fileType.includes("image") || fileType.includes("jpg") || fileType.includes("png")) {
      return <FileImage size={24} className="text-success" />
    } else {
      return <FileArchive size={24} className="text-warning" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return bytes + " B"
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + " KB"
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB"
    }
  }

  const formatLastAccessed = (dateString: string) => {
    if (!dateString) return "Never"

    const date = new Date(dateString)
    const now = new Date()

    // If it's today
    if (date.toDateString() === now.toDateString()) {
      return "Today"
    }

    // If it's yesterday
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    }

    // Otherwise, return relative time
    return formatDistanceToNow(date, { addSuffix: true })
  }

  useEffect(() => {
    if (documentData) {
      // Fetch summary to get word count
      const fetchSummaryWordCount = async () => {
        try {
          const summaryData = await getDocumentSummary(documentData.id)
          setSummaryWordCount(summaryData.wordCount || 0)
        } catch (err) {
          console.error("Failed to fetch summary word count:", err)
          setSummaryWordCount(0)
        }
      }

      fetchSummaryWordCount()
    }
  }, [documentData])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error || !documentData) {
    return (
      <div className="alert alert-danger" role="alert">
        <p className="mb-2">{error || "Document not found"}</p>
        <button
          onClick={() => navigate("/documents")}
          className="btn btn-sm btn-outline-danger d-inline-flex align-items-center"
        >
          <ArrowLeft size={16} className="me-2" /> Back to Documents
        </button>
      </div>
    )
  }

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Header with Gradient */}
      <div
        className="w-100 text-white py-4"
        style={{
          background: "linear-gradient(135deg, #000000 0%, #2c3e50 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="container px-4">
          <div className="d-flex align-items-center">
            <button
              onClick={() => navigate("/documents")}
              className="btn btn-link text-white text-decoration-none p-0 d-inline-flex align-items-center me-3"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="fs-4 fw-bold mb-0">{documentData.name}</h1>
              <p className="opacity-75 mb-0 small">
                Uploaded {formatDistanceToNow(new Date(documentData.uploadedAt), { addSuffix: true })}
                {documentData.isPublic ? (
                  <span className="ms-2 badge bg-success d-inline-flex align-items-center">
                    <Globe size={12} className="me-1" /> Public
                  </span>
                ) : (
                  <span className="ms-2 badge bg-secondary d-inline-flex align-items-center">
                    <Lock size={12} className="me-1" /> Private
                  </span>
                )}
              </p>
            </div>
            <div className="ms-auto">
              <div className="d-flex gap-2">
                {user?.id === documentData.user.id && (
                  <button
                    onClick={toggleVisibility}
                    disabled={updatingVisibility}
                    className={`btn btn-sm d-inline-flex align-items-center ${
                      documentData.isPublic ? "btn-outline-warning" : "btn-outline-success"
                    }`}
                  >
                    {updatingVisibility ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : documentData.isPublic ? (
                      <>
                        <Lock size={16} className="me-2" /> Make Private
                      </>
                    ) : (
                      <>
                        <Globe size={16} className="me-2" /> Make Public
                      </>
                    )}
                  </button>
                )}
                <a
                  href={getDownloadUrl(documentData.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-light d-inline-flex align-items-center"
                >
                  <Download size={16} className="me-2" /> Download
                </a>
                {user?.id === documentData.user.id && (
                  <button
                    onClick={handleDelete}
                    className="btn btn-sm btn-outline-light d-inline-flex align-items-center"
                  >
                    <Trash2 size={16} className="me-2" /> Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-4 flex-grow-1">
        <div className="row g-4">
          {/* Document Details Card and Uploader Info Card - Side by Side */}
          <div className="col-md-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-bottom-0 pt-4">
                <div className="d-flex align-items-center">
                  {getFileIcon(documentData.fileType)}
                  <div className="ms-3">
                    <h5 className="card-title mb-0">Document Details</h5>
                    <p className="card-subtitle text-muted small mt-1">Information about this file</p>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="table-responsive">
                      <table className="table table-borderless mb-0">
                        <tbody>
                          <tr>
                            <td className="ps-0 text-muted">Type</td>
                            <td className="text-end pe-0 fw-medium">
                              {documentData.fileType.split("/")[1]?.toUpperCase() || documentData.fileType}
                            </td>
                          </tr>
                          <tr>
                            <td className="ps-0 text-muted">Size</td>
                            <td className="text-end pe-0 fw-medium">{formatFileSize(documentData.fileSize)}</td>
                          </tr>
                          <tr>
                            <td className="ps-0 text-muted">Uploaded</td>
                            <td className="text-end pe-0 fw-medium">
                              {formatDistanceToNow(new Date(documentData.uploadedAt), { addSuffix: true })}
                            </td>
                          </tr>
                          <tr>
                            <td className="ps-0 text-muted">Visibility</td>
                            <td className="text-end pe-0 fw-medium">
                              {documentData.isPublic ? (
                                <span className="badge bg-success d-inline-flex align-items-center">
                                  <Globe size={12} className="me-1" /> Public
                                </span>
                              ) : (
                                <span className="badge bg-secondary d-inline-flex align-items-center">
                                  <Lock size={12} className="me-1" /> Private
                                </span>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="ps-0 text-muted">Summary</td>
                            <td className="text-end pe-0 fw-medium">
                              {summaryWordCount !== null ? summaryWordCount : "Loading..."} words
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {documentData.description && (
                  <div className="mb-4">
                    <h6 className="text-muted small mb-2">Description</h6>
                    <div className="bg-light p-3 rounded">{documentData.description}</div>
                  </div>
                )}

                {/* File Preview (if it's an image) */}
                {documentData.fileType.includes("image") && (
                  <div>
                    <h6 className="text-muted small mb-2">Preview</h6>
                    <div className="border rounded overflow-hidden">
                      <img
                        src={documentData.fileUrl || "/placeholder.svg"}
                        alt={documentData.name}
                        className="img-fluid"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Uploader Info Card and Stats Card */}
          <div className="col-md-4">
            {/* Uploader Info Card */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-bottom-0 pt-4">
                <h5 className="card-title mb-0">Uploaded By</h5>
                <p className="card-subtitle text-muted small mt-1">Document owner</p>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div
                    className="d-flex align-items-center justify-content-center bg-primary rounded-circle me-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    {documentData.user.profilePictureUrl ? (
                      <img
                        src={documentData.user.profilePictureUrl || "/placeholder.svg"}
                        alt={documentData.user.firstName}
                        className="rounded-circle w-100 h-100 object-fit-cover"
                      />
                    ) : (
                      <span className="fs-4 text-white fw-medium">
                        {documentData.user.firstName.charAt(0)}
                        {documentData.user.lastName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h6 className="mb-0 fw-medium">
                      {documentData.user.firstName} {documentData.user.lastName}
                    </h6>
                    <p className="text-muted small mb-0">{documentData.user.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Stats Card with real data */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-bottom-0 pt-4">
                <h5 className="card-title mb-0">Document Stats</h5>
                <p className="card-subtitle text-muted small mt-1">Activity information</p>
              </div>
              <div className="card-body">
                {statsLoading ? (
                  <div className="d-flex justify-content-center py-3">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading stats...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Views</span>
                      <span className="badge bg-primary rounded-pill">{activityStats.views}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Downloads</span>
                      <span className="badge bg-success rounded-pill">{activityStats.downloads}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Last accessed</span>
                      <span className="small">{formatLastAccessed(activityStats.lastAccessed)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Document Summary Section - Full Width */}
          <div className="col-12 mb-4">{documentData && <DocumentSummary documentId={documentData.id} />}</div>

          {/* Comments Section - Full Width */}
          <div className="col-12">{documentData && <DocumentComments documentId={documentData.id} />}</div>
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
