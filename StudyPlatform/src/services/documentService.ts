import type { Document } from "../types"
import api from "./api"

export const uploadDocument = async (file: File, description?: string) => {
  const formData = new FormData()
  formData.append("file", file)

  if (description) {
    formData.append("description", description)
  }

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

export const getDocumentStats = async () => {
  const response = await api.get("/api/documents/stats")
  return response.data
}

export const deleteDocument = async (id: number) => {
  const response = await api.delete(`/api/documents/${id}`)
  return response.data
}

export const getDownloadUrl = (id: number) => {
  return `${api.defaults.baseURL}/api/documents/${id}/download`
}

