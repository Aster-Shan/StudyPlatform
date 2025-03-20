import api from "./api"

// Helper methods for common API operations
export const apiHelpers = {
  // GET request with error handling
  async get<T>(url: string, params?: never): Promise<T> {
    try {
      const response = await api.get<T>(url, { params })
      return response.data
    } catch (error) {
      console.error(`GET request failed for ${url}:`, error)
      throw error
    }
  },

  // POST request with error handling
  async post<T, D = never>(url: string, data?: D): Promise<T> {
    try {
      const response = await api.post<T>(url, data)
      return response.data
    } catch (error) {
      console.error(`POST request failed for ${url}:`, error)
      throw error
    }
  },

  // PUT request with error handling
  async put<T, D = never>(url: string, data?: D): Promise<T> {
    try {
      const response = await api.put<T>(url, data)
      return response.data
    } catch (error) {
      console.error(`PUT request failed for ${url}:`, error)
      throw error
    }
  },

  // DELETE request with error handling
  async delete<T>(url: string): Promise<T> {
    try {
      const response = await api.delete<T>(url)
      return response.data
    } catch (error) {
      console.error(`DELETE request failed for ${url}:`, error)
      throw error
    }
  },
}

