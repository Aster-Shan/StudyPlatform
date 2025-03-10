import type { Document } from "../types"
import api from "./api"

export const uploadDocument = async (file: File, description?: string): Promise<Document> => {
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

export const getDocument = async (id: number): Promise<Document> => {
  const response = await api.get(`/api/documents/${id}`)
  return response.data
}

export const deleteDocument = async (id: number): Promise<void> => {
  await api.delete(`/api/documents/${id}`)
}

export const getDownloadUrl = (id: number): string => {
  return `${process.env.NEXT_PUBLIC_API_URL}/api/documents/${id}/download`
}

