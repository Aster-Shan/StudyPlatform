export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    bio?: string
    profilePictureUrl?: string
    academicInterests?: string[]
    using2FA: boolean
  }
  
  export interface Document {
    id: number
    name: string
    description?: string
    fileType: string
    fileSize: number
    uploadedAt: string
    userId: string
  }
  
  