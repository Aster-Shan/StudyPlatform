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
    fileUrl: string
    user: User
    isPublic : boolean
  }
  
  
export interface Comment {
  id: number
  content: string
  document: Document
  user: User
  createdAt: string
  updatedAt: string
}

export interface DocumentActivityStats {
  views: number
  downloads: number
  lastAccessed: string
}