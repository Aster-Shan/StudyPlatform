import type { Comment } from "../types"
import api from "./api"

export const getDocumentComments = async (documentId: number): Promise<Comment[]> => {
  try {
    const response = await api.get(`/api/comments/document/${documentId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching comments:", error)
    return []
  }
}

export const addComment = async (documentId: number, content: string): Promise<Comment> => {
  const response = await api.post("/api/comments", { documentId, content })
  return response.data
}

export const updateComment = async (commentId: number, content: string): Promise<Comment> => {
  // The documentId is required by the backend but not used for updates
  const response = await api.put(`/api/comments/${commentId}`, { content, documentId: 0 })
  return response.data
}

export const deleteComment = async (commentId: number): Promise<void> => {
  try {
    await api.delete(`/api/comments/${commentId}`)
    console.log(`Comment ${commentId} deleted successfully`)
  } catch (error) {
    console.error(`Error deleting comment ${commentId}:`, error)
    throw error
  }
}

