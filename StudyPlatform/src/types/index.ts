export interface User {
 
  id: string
  email: string
  firstName: string
  lastName: string
  bio?: string
  profilePictureUrl?: string
  academicInterests?: string[]
  using2FA: boolean
  role?: string
  createdAt?: string
  updatedAt?: string
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
  isPublic: boolean
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

export interface ChatMessage {
  id: number;
  content: string;
  senderId: string;
  senderName: string;
  roomId: number;
  sentAt: string;
  readBy: string[];
}

export interface ChatRoom {
  id: number;
  name: string;
  description?: string;
  isGroupChat: boolean;
  createdAt: string;
  participants: User[];
  latestMessage?: ChatMessage;
  unreadCount?: number;
  createdBy: string;
}

export interface ForumTopic {
  id: number
  title: string
  content: string
  user: User
  createdAt: string
  updatedAt: string
  viewCount: number
  replyCount: number
  upvotes: number
  downvotes: number
  tags: string[]
}

export interface ForumReply {
  id: number
  content: string
  topicId: number
  user: User
  createdAt: string
  updatedAt: string
  upvotes: number
  downvotes: number
  isAcceptedAnswer: boolean
}

export interface CreateGroupChatRequest {
  name: string
  description: string
  participantIds: string[] // Changed to string[] to match User.id type
}

export interface SendMessageRequest {
  content: string
}

export interface LoginResponse {
  token?: string
  user?: User
  requires2FA?: boolean
  tempToken?: string
  error?: string
  message?: string
  email?: string
}export interface RegisterResponse {
  message?: string
  email?: string
  token?: string
  user?: User
}