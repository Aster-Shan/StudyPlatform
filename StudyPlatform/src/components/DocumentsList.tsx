"use client"

import { formatDistanceToNow } from "date-fns"
import { Download, FileText, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { deleteDocument, getDownloadUrl, getUserDocuments } from "../services/documentService"
import type { Document } from "../types"

interface DocumentsListProps {
  refreshTrigger?: number
  onDocumentDeleted?: () => void
  documents?: Document[] // Add this prop
}

export default function DocumentsList({ refreshTrigger = 0, onDocumentDeleted, documents: propDocuments }: DocumentsListProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Only fetch documents if they weren't provided as props
    if (!propDocuments) {
      fetchDocuments()
    } else {
      setDocuments(propDocuments)
      setLoading(false)
    }
  }, [refreshTrigger, propDocuments])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const data = await getUserDocuments()
      setDocuments(data)
      setError("")
    } catch (err) {
      setError("Failed to load documents")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!window.confirm("Are you sure you want to delete this document?")) {
      return
    }

    try {
      await deleteDocument(id)
      // Refresh the documents list
      if (propDocuments) {
        // If documents were provided as props, just filter them
        setDocuments(documents.filter(doc => doc.id !== id))
      } else {
        // Otherwise fetch fresh data
        fetchDocuments()
      }
      // Notify parent component if callback provided
      if (onDocumentDeleted) {
        onDocumentDeleted()
      }
    } catch (err) {
      console.error("Failed to delete document:", err)
      alert("Failed to delete document. Please try again.")
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) {
      return <FileText className="h-5 w-5 text-red-500" />
    } else if (fileType.includes("image") || fileType.includes("jpg") || fileType.includes("png")) {
      return <FileText className="h-5 w-5 text-green-500" />
    } else {
      return <FileText className="h-5 w-5 text-blue-500" />
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-5">
        <FileText size={48} className="text-muted mb-3" />
        <h5>No documents found</h5>
        <p className="text-muted">Upload your first document to get started</p>
      </div>
    )
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Size</th>
            <th scope="col">Uploaded</th>
            <th scope="col" className="text-end">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="cursor-pointer">
              <td>
                <Link to={`/documents/${doc.id}`} className="text-decoration-none text-dark d-flex align-items-center">
                  {getFileIcon(doc.fileType)}
                  <span className="ms-2">
                    {doc.name}
                    {doc.isPublic && <span className="badge bg-success ms-2 small">Public</span>}
                  </span>
                </Link>
              </td>
              <td>{doc.fileType.split("/")[1]?.toUpperCase() || doc.fileType}</td>
              <td>{formatFileSize(doc.fileSize)}</td>
              <td>{formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true })}</td>
              <td>
                <div className="d-flex justify-content-end">
                  <a
                    href={getDownloadUrl(doc.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download size={16} />
                  </a>
                  <button onClick={(e) => handleDelete(doc.id, e)} className="btn btn-sm btn-outline-danger">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}