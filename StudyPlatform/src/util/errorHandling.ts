export const handleApiError = (error: unknown): never => {
    console.error("API Error:", error)
  
    // You can add more sophisticated error handling here
    if (error instanceof Error) {
      console.error("Error message:", error.message)
    } else {
      console.error("Unknown error type:", error)
    }
  
    throw error
  }
  
  