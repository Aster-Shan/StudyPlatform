"use client"

import { FileText, Upload, X } from "lucide-react"
import React, { useRef, useState } from "react"
import { uploadDocument } from "../services/documentService"

interface DocumentUploadProps {
  onUploadSuccess: () => void
}

export default function DocumentUpload({ onUploadSuccess }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    setError("")

    try {
      console.log("Uploading document with isPublic:", isPublic) // Debug log
      await uploadDocument(file, description, isPublic)
      setFile(null)
      setDescription("")
      setIsPublic(false)
      onUploadSuccess()
    } catch (err) {
      console.error("Upload failed:", err)
      setError("Failed to upload document. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const removeFile = () => {
    setFile(null)
  }

  return (
    <div>
      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {!file ? (
          <div
            className={`border-2 border-dashed rounded-lg p-5 text-center ${
              dragActive ? "border-primary bg-primary bg-opacity-10" : "border-gray-300"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
            />

            <div className="mb-3 flex justify-center">
              <Upload size={48} className="text-primary" />
            </div>
            <h5 className="mb-2 font-medium">Drag and drop your file here</h5>
            <p className="text-muted mb-4">or</p>
            <button
              type="button"
              onClick={handleButtonClick}
              className="btn btn-primary d-inline-flex align-items-center"
            >
              <FileText size={16} className="me-2" />
              Browse Files
            </button>
            <p className="mt-3 text-muted small">
              Supported file types: PDF, Word, Excel, PowerPoint, Text, and Images
            </p>
          </div>
        ) : (
          <div className="mb-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <FileText size={24} className="text-primary me-3" />
                    <div>
                      <h6 className="mb-0">{file.name}</h6>
                      <p className="text-muted small mb-0">
                        {(file.size / 1024).toFixed(2)} KB • {file.type || "Unknown type"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="btn btn-sm btn-outline-danger d-flex align-items-center"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-3 mt-4">
              <label htmlFor="description" className="form-label">
                Description (optional)
              </label>
              <textarea
                id="description"
                className="form-control"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for your document..."
              ></textarea>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button type="button" onClick={removeFile} className="btn btn-outline-secondary" disabled={uploading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={uploading}>
                {uploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Uploading...
                  </>
                ) : (
                  "Upload Document"
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

