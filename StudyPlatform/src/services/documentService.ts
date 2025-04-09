import type { Document } from "../types"
import api from "./api"

export const uploadDocument = async (file: File, description?: string, isPublic = false) => {
  const formData = new FormData()
  formData.append("file", file)

  if (description) {
    formData.append("description", description)
  }

  // Ensure isPublic is properly converted to string
  formData.append("isPublic", String(isPublic))

  console.log("FormData isPublic value:", String(isPublic)) // Debug log

  const response = await api.post("/api/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

export const getUserDocuments = async (): Promise<Document[]> => {
  const response = await api.get("/api/documents")
  return response.data
}

export const searchDocuments = async (query: string): Promise<Document[]> => {
  const response = await api.get(`/api/documents/search?q=${encodeURIComponent(query)}`)
  return response.data
}

export const getPublicDocuments = async (): Promise<Document[]> => {
  const response = await api.get("/api/documents/public")
  return response.data
}

export const getDocumentById = async (id: number): Promise<Document> => {
  const response = await api.get(`/api/documents/${id}`)
  return response.data
}

export const getDocumentStats = async () => {
  const response = await api.get("/api/documents/stats")
  return response.data
}

export const getDocumentActivityStats = async (id: number) => {
  const response = await api.get(`/api/documents/${id}/activity`)
  return response.data
}

export const updateDocumentVisibility = async (id: number, isPublic: boolean) => {
  const response = await api.put(`/api/documents/${id}/visibility?isPublic=${isPublic}`)
  return response.data
}

export const deleteDocument = async (id: number) => {
  const response = await api.delete(`/api/documents/${id}`)
  return response.data
}

export const getDownloadUrl = (id: number) => {
  return `${api.defaults.baseURL}/api/documents/${id}/download`
}

export async function getDocumentSummary(documentId: number) {
  const response = await fetch(`/api/documents/${documentId}/summary`)

  // Check if response is JSON
  const contentType = response.headers.get("content-type")
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("API returned non-JSON response. The summary API endpoint may not be implemented yet.")
  }

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || `Failed to fetch document summary: ${response.status}`)
  }

  return await response.json()
}

/**
 * Save a custom summary for a document
 * @param documentId The ID of the document
 * @param summaryText The custom summary text
 * @returns The updated document
 */
export async function saveDocumentSummary(documentId: number, summaryText: string) {
  const response = await fetch(`/api/documents/${documentId}/summary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ summary: summaryText }),
  })

  // Check if response is JSON
  const contentType = response.headers.get("content-type")
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("API returned non-JSON response. The summary API endpoint may not be implemented correctly.")
  }

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || `Failed to save summary: ${response.status}`)
  }

  return await response.json()
}
