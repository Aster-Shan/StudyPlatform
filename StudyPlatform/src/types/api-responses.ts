// Backend API response types
export interface BackendUser {
    id: string
    firstName: string
    lastName: string
    email: string
    profilePictureUrl?: string
    using2FA?: boolean
    role?: string
    createdAt?: string
    updatedAt?: string
  }
  
  export interface BackendMessage {
    id: string
    content: string
    sentAt: string
    senderId: string
    senderName: string
  }
  
  export interface BackendChatRoom {
    id: string
    name: string
    participants: string[] // Array of user IDs
    latestMessage?: {
      content: string
      sentAt: string
      senderId: string
      senderName: string
    }
    createdAt: string
    updatedAt?: string
  }
  
  export interface ChatRoomCreateRequest {
    name: string
    participantIds: string[]
    isPrivate: boolean
  }
  
  export interface MessageCreateRequest {
    content: string
    senderId: string
  }
  
  