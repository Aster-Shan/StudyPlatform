export interface CreateGroupChatRequest {
    name: string
    description: string
    participantIds: string[] // Changed from number[] to string[]
  }
  
  export interface SendMessageRequest {
    content: string
  }
  
  