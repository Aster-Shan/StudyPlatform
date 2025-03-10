
import React from "react"

import { useState } from "react"
import DocumentUpload from "../components/DocumentUpload"
import DocumentsList from "../components/DocumentsList"

export default function Documents() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Documents</h1>
        <p className="text-gray-500">Upload and manage your documents</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <DocumentUpload onUploadSuccess={handleUploadSuccess} />
        <DocumentsList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  )
}

