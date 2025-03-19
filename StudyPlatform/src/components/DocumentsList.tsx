
import { formatDistanceToNow } from "date-fns"
import { AlertCircle, Download, FileText, Trash2 } from "lucide-react"
import React, { useEffect, useState } from "react"
import { deleteDocument, getDownloadUrl, getUserDocuments } from "../services/documentService"
import type { Document } from "../types"

interface DocumentsListProps {
  refreshTrigger?: number
}

export default function DocumentsList({ refreshTrigger = 0 }: DocumentsListProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true)
      try {
        const data = await getUserDocuments()
        setDocuments(data)
        setError("")
      } catch (err: unknown) {
        setError("Failed to load documents")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [refreshTrigger])

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return
    }

    try {
      await deleteDocument(id)
      setDocuments(documents.filter((doc) => doc.id !== id))
    } catch (err) {
      setError("Failed to delete document")
      console.error(err)
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) {
      return <FileText className="h-4 w-4 text-red-500" />
    } else if (fileType.includes("word") || fileType.includes("doc")) {
      return <FileText className="h-4 w-4 text-blue-500" />
    } else if (fileType.includes("sheet") || fileType.includes("excel") || fileType.includes("xls")) {
      return <FileText className="h-4 w-4 text-green-500" />
    } else if (fileType.includes("image") || fileType.includes("jpg") || fileType.includes("png")) {
      return <FileText className="h-4 w-4 text-purple-500" />
    } else {
      return <FileText className="h-4 w-4" />
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold">My Documents</h3>
      </div>
      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800 flex items-start">
            <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-4">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-4 text-gray-500">You haven't uploaded any documents yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Type</th>
                  <th className="text-left py-3 px-4 font-medium">Size</th>
                  <th className="text-left py-3 px-4 font-medium">Uploaded</th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {getFileIcon(doc.fileType)}
                        <span className="ml-2 font-medium">{doc.name}</span>
                      </div>
                      {doc.description && <p className="text-xs text-gray-500 mt-1">{doc.description}</p>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {doc.fileType.split("/")[1]?.toUpperCase() || doc.fileType}
                      </span>
                    </td>
                    <td className="py-3 px-4">{formatFileSize(doc.fileSize)}</td>
                    <td className="py-3 px-4">{formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true })}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                          onClick={() => window.open(getDownloadUrl(doc.id), "_blank")}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

