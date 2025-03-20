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

