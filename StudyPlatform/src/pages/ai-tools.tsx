"use client"

import { AlertCircle, ArrowLeft, BookOpen, FileText, Image, Loader, Upload } from "lucide-react"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function AITools() {
  const { user } = useAuth()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [file, setFile] = useState<File | null>(null)
  const [extractedText, setExtractedText] = useState<string>("")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [prompt, setPrompt] = useState<string>("")
  const [isExtracting, setIsExtracting] = useState<boolean>(false)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      await extractTextFromFile(selectedFile)
    }
  }

  // Extract text from uploaded file
  const extractTextFromFile = async (file: File) => {
    setIsExtracting(true)
    setError(null)

    try {
      // Simulate text extraction (in a real app, you'd call your backend API)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, generate some text based on the file name
      const text = `This is the extracted content from ${file.name}. In a real implementation, this would be the actual text extracted from your document using backend services. The text would then be used to generate an AI image that helps visualize the key concepts in your document.`

      setExtractedText(text)
      setPrompt(
        `Create a clear, educational diagram or illustration that explains the following concept: ${text.substring(0, 500)}. The image should be simple, informative, and help visualize the key ideas.`,
      )
    } catch (err: never) {
      setError(`Failed to extract text: ${err.message}`)
      console.error(err)
    } finally {
      setIsExtracting(false)
    }
  }

  // Handle prompt change
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
  }

  // Generate image using AI
  const handleGenerateImage = async () => {
    if (!prompt) {
      setError("Please upload a document or enter a prompt first.")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Simulate API call to generate image (in a real app, you'd call your backend API)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // For demo purposes, use a placeholder image
      setGeneratedImage("/placeholder.svg?height=512&width=512")
    } catch (err: any) {
      setError(`Failed to generate image: ${err.message}`)
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
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
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="bg-white border-bottom py-2 mb-4 shadow-sm">
        <div className="container px-4">
          <ol className="breadcrumb mb-0 py-1">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              AI Tools
            </li>
          </ol>
        </div>
      </nav>

      <div className="container px-4 py-2">
        <div className="d-flex align-items-center mb-4">
          <Link to="/" className="btn btn-outline-secondary me-3">
            <ArrowLeft size={16} className="me-1" />
            Back to Dashboard
          </Link>
          <h2 className="mb-0">AI Tools</h2>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white pt-4 pb-3 border-0">
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle bg-purple bg-opacity-10 p-3 me-3"
                    style={{ backgroundColor: "rgba(128, 0, 128, 0.1)" }}
                  >
                    <Image size={24} style={{ color: "purple" }} />
                  </div>
                  <div>
                    <h5 className="card-title mb-0">AI Image Generator</h5>
                    <p className="card-subtitle text-muted small">Upload a document to generate an explanatory image</p>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    {/* Document Upload */}
                    <div className="mb-4">
                      <label htmlFor="documentUpload" className="form-label">
                        Upload Document
                      </label>
                      <div className="input-group mb-3">
                        <input
                          type="file"
                          className="form-control"
                          id="documentUpload"
                          accept=".pdf,.docx,.txt"
                          onChange={handleFileChange}
                          disabled={isExtracting || isGenerating}
                        />
                        <label className="input-group-text" htmlFor="documentUpload">
                          <Upload size={18} />
                        </label>
                      </div>
                      <small className="text-muted">Supported formats: PDF, DOCX, TXT</small>
                    </div>

                    {/* Loading indicator for text extraction */}
                    {isExtracting && (
                      <div className="d-flex align-items-center mb-4">
                        <Loader size={18} className="me-2 animate-spin" />
                        <span>Extracting text from document...</span>
                      </div>
                    )}

                    {/* Extracted Text */}
                    {extractedText && (
                      <div className="mb-4">
                        <label className="form-label">Extracted Content</label>
                        <div className="border rounded p-3 bg-light" style={{ maxHeight: "200px", overflowY: "auto" }}>
                          <p className="mb-0 small">{extractedText}</p>
                        </div>
                      </div>
                    )}

                    {/* AI Prompt */}
                    <div className="mb-4">
                      <label htmlFor="aiPrompt" className="form-label">
                        AI Prompt
                      </label>
                      <textarea
                        id="aiPrompt"
                        className="form-control"
                        rows={4}
                        value={prompt}
                        onChange={handlePromptChange}
                        placeholder="Enter or modify the prompt for image generation"
                        disabled={isGenerating}
                      ></textarea>
                      <small className="text-muted">You can edit this prompt to customize the generated image</small>
                    </div>

                    {/* Generate Button */}
                    <button
                      className="btn btn-primary d-flex align-items-center justify-content-center"
                      onClick={handleGenerateImage}
                      disabled={!prompt || isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader size={18} className="me-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Image size={18} className="me-2" />
                          Generate Image
                        </>
                      )}
                    </button>

                    {/* Error Message */}
                    {error && (
                      <div className="alert alert-danger d-flex align-items-center mt-3" role="alert">
                        <AlertCircle size={18} className="me-2" />
                        <div>{error}</div>
                      </div>
                    )}
                  </div>

                  {/* Generated Image */}
                  <div className="col-md-6">
                    <div className="d-flex flex-column align-items-center justify-content-center h-100">
                      {generatedImage ? (
                        <div className="text-center">
                          <h6 className="mb-3">Generated Image</h6>
                          <img
                            src={generatedImage || "/placeholder.svg"}
                            alt="AI Generated Visualization"
                            className="img-fluid rounded shadow-sm"
                            style={{ maxHeight: "400px" }}
                          />
                          <div className="mt-3">
                            <a
                              href={generatedImage}
                              download="ai-generated-image.png"
                              className="btn btn-outline-primary btn-sm"
                            >
                              Download Image
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-muted">
                          <div
                            className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                            style={{ width: "100px", height: "100px" }}
                          >
                            <Image size={40} className="text-secondary" />
                          </div>
                          <p>Upload a document and click "Generate Image" to create a visual representation</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white pt-4 pb-3 border-0">
                <h5 className="card-title mb-0">How It Works</h5>
                <p className="card-subtitle text-muted small">Understanding the AI image generation process</p>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="text-center">
                      <div
                        className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3"
                        style={{ width: "80px", height: "80px" }}
                      >
                        <FileText size={32} className="text-primary" />
                      </div>
                      <h5>1. Upload Document</h5>
                      <p className="text-muted small">
                        Upload your PDF, DOCX, or TXT file to extract the text content.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center">
                      <div
                        className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3"
                        style={{ width: "80px", height: "80px" }}
                      >
                        <BookOpen size={32} className="text-primary" />
                      </div>
                      <h5>2. Review & Edit Prompt</h5>
                      <p className="text-muted small">
                        The system extracts text and creates a prompt. You can edit it to focus on specific concepts.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center">
                      <div
                        className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3"
                        style={{ width: "80px", height: "80px" }}
                      >
                        <Image size={32} className="text-primary" />
                      </div>
                      <h5>3. Generate Image</h5>
                      <p className="text-muted small">
                        Our AI creates a visual representation of the concepts in your document.
                      </p>
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
              <p className="mb-0 text-muted small">© 2023 StudyPlatform. All rights reserved.</p>
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

