import api from "../services/api"; // Import the API service
import type { User } from "../types";
import { handleApiError } from "../util/errorHandling";

// Types for chat-specific entities
export interface ChatRoom {
  id: string
  name: string
  lastMessage?: {
    content: string
    timestamp: string
    sender: {
      id: string
      firstName: string
      lastName: string
    }
  }
  participants: {
    id: string
    firstName: string
    lastName: string
    profilePictureUrl?: string | null | undefined
  }[]
  archived?: boolean
  createdAt: string
}

export interface ChatMessage {
  id: string
  content: string
  timestamp: string
  sender: {
    id: string
    firstName: string
    lastName: string
    profilePictureUrl?: string | null | undefined
  }
}

// Local Storage Keys
const CHAT_ROOMS_KEY = "study_platform_chat_rooms"
const CHAT_MESSAGES_KEY = "study_platform_chat_messages"

// Initialize localStorage with sample data if empty
const initializeLocalStorage = () => {
  if (!localStorage.getItem(CHAT_ROOMS_KEY)) {
    const initialChatRooms: ChatRoom[] = [
      {
        id: "1",
        name: "Study Group",
        lastMessage: {
          content: "When is our next meeting?",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          sender: {
            id: "2",
            firstName: "Jane",
            lastName: "Doe",
          },
        },
        participants: [
          {
            id: "2",
            firstName: "Jane",
            lastName: "Doe",
          },
          {
            id: "3",
            firstName: "Bob",
            lastName: "Smith",
          },
        ],
        archived: false,
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
      {
        id: "2",
        name: "Project Team",
        lastMessage: {
          content: "I've uploaded the latest documents",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          sender: {
            id: "4",
            firstName: "Alice",
            lastName: "Johnson",
          },
        },
        participants: [
          {
            id: "4",
            firstName: "Alice",
            lastName: "Johnson",
          },
        ],
        archived: false,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ]
    localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(initialChatRooms))
  }

  if (!localStorage.getItem(CHAT_MESSAGES_KEY)) {
    const initialChatMessages: Record<string, ChatMessage[]> = {
      "1": [
        {
          id: "101",
          content: "Hello everyone!",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          sender: {
            id: "3",
            firstName: "Bob",
            lastName: "Smith",
          },
        },
        {
          id: "102",
          content: "Hi Bob, how are you?",
          timestamp: new Date(Date.now() - 5400000).toISOString(),
          sender: {
            id: "2",
            firstName: "Jane",
            lastName: "Doe",
          },
        },
        {
          id: "103",
          content: "When is our next meeting?",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          sender: {
            id: "2",
            firstName: "Jane",
            lastName: "Doe",
          },
        },
      ],
      "2": [
        {
          id: "201",
          content: "I've started working on the project",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          sender: {
            id: "4",
            firstName: "Alice",
            lastName: "Johnson",
          },
        },
        {
          id: "202",
          content: "Let me know if you need any help",
          timestamp: new Date(Date.now() - 129600000).toISOString(),
          sender: {
            id: "1", // Current user
            firstName: "Current",
            lastName: "User",
          },
        },
        {
          id: "203",
          content: "I've uploaded the latest documents",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          sender: {
            id: "4",
            firstName: "Alice",
            lastName: "Johnson",
          },
        },
      ],
    }
    localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(initialChatMessages))
  }
}

// Initialize on import
initializeLocalStorage()

// Helper functions for localStorage
const getChatRoomsFromStorage = (): ChatRoom[] => {
  const rooms = localStorage.getItem(CHAT_ROOMS_KEY)
  return rooms ? JSON.parse(rooms) : []
}

const saveChatRoomsToStorage = (rooms: ChatRoom[]): void => {
  localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(rooms))
}

const getChatMessagesFromStorage = (): Record<string, ChatMessage[]> => {
  const messages = localStorage.getItem(CHAT_MESSAGES_KEY)
  return messages ? JSON.parse(messages) : {}
}

const saveChatMessagesToStorage = (messages: Record<string, ChatMessage[]>): void => {
  localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages))
}

// API functions
export const getChatRooms = async (includeArchived = false): Promise<ChatRoom[]> => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const rooms = getChatRoomsFromStorage()
        if (includeArchived) {
          resolve(rooms)
        } else {
          resolve(rooms.filter((room) => !room.archived))
        }
      }, 500)
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export const getArchivedChatRooms = async (): Promise<ChatRoom[]> => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const rooms = getChatRoomsFromStorage()
        resolve(rooms.filter((room) => room.archived))
      }, 500)
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export const getChatRoom = async (roomId: string): Promise<ChatRoom | null> => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const rooms = getChatRoomsFromStorage()
        const room = rooms.find((r) => r.id === roomId) || null
        resolve(room)
      }, 500)
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export const getChatMessages = async (roomId: string): Promise<ChatMessage[]> => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allMessages = getChatMessagesFromStorage()
        const messages = allMessages[roomId] || []
        resolve(messages)
      }, 500)
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export const sendChatMessage = async (
  roomId: string,
  content: string,
  currentUser: User | null,
): Promise<ChatMessage> => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMessage: ChatMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          content,
          timestamp: new Date().toISOString(),
          sender: {
            id: currentUser?.id || "1",
            firstName: currentUser?.firstName || "Current",
            lastName: currentUser?.lastName || "User",
            profilePictureUrl: currentUser?.profilePictureUrl,
          },
        }

        // Update messages in storage
        const allMessages = getChatMessagesFromStorage()
        if (!allMessages[roomId]) {
          allMessages[roomId] = []
        }
        allMessages[roomId].push(newMessage)
        saveChatMessagesToStorage(allMessages)

        // Update last message in chat room
        const rooms = getChatRoomsFromStorage()
        const roomIndex = rooms.findIndex((r) => r.id === roomId)
        if (roomIndex !== -1) {
          rooms[roomIndex].lastMessage = {
            content,
            timestamp: new Date().toISOString(),
            sender: {
              id: currentUser?.id || "1",
              firstName: currentUser?.firstName || "Current",
              lastName: currentUser?.lastName || "User",
            },
          }
          saveChatRoomsToStorage(rooms)
        }

        resolve(newMessage)
      }, 300)
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export const createChatRoom = async (
  name: string,
  participantIds: string[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _currentUser: User | null,
): Promise<ChatRoom> => {
  try {
    return new Promise((resolve) => {
      setTimeout(async () => {
        // Get users from the API
        const users = await getAllUsers()

        // Find participants by ID
        const participants = users
          .filter((user) => participantIds.includes(user.id))
          .map((user) => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePictureUrl: user.profilePictureUrl,
          }))

        const newRoom: ChatRoom = {
          id: `room-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: name || generateChatName(participants),
          participants,
          archived: false,
          createdAt: new Date().toISOString(),
        }

        // Add to storage
        const rooms = getChatRoomsFromStorage()
        rooms.unshift(newRoom)
        saveChatRoomsToStorage(rooms)

        // Initialize empty message array for this room
        const allMessages = getChatMessagesFromStorage()
        allMessages[newRoom.id] = []
        saveChatMessagesToStorage(allMessages)

        resolve(newRoom)
      }, 500)
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export const archiveChatRoom = async (roomId: string): Promise<boolean> => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const rooms = getChatRoomsFromStorage()
        const roomIndex = rooms.findIndex((r) => r.id === roomId)
        if (roomIndex !== -1) {
          rooms[roomIndex].archived = true
          saveChatRoomsToStorage(rooms)
          resolve(true)
        } else {
          resolve(false)
        }
      }, 500)
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export const unarchiveChatRoom = async (roomId: string): Promise<boolean> => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const rooms = getChatRoomsFromStorage()
        const roomIndex = rooms.findIndex((r) => r.id === roomId)
        if (roomIndex !== -1) {
          rooms[roomIndex].archived = false
          saveChatRoomsToStorage(rooms)
          resolve(true)
        } else {
          resolve(false)
        }
      }, 500)
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export const deleteChatRoom = async (roomId: string): Promise<boolean> => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Delete room
        const rooms = getChatRoomsFromStorage()
        const updatedRooms = rooms.filter((r) => r.id !== roomId)
        saveChatRoomsToStorage(updatedRooms)

        // Delete messages
        const allMessages = getChatMessagesFromStorage()
        delete allMessages[roomId]
        saveChatMessagesToStorage(allMessages)

        resolve(true)
      }, 500)
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// Helper function to generate a chat name based on participants
const generateChatName = (participants: ChatRoom["participants"]): string => {
  if (participants.length === 0) return "New Chat"
  if (participants.length === 1) return `${participants[0].firstName} ${participants[0].lastName}`
  return `${participants[0].firstName} ${participants[0].lastName} and ${participants.length - 1} others`
}

// Fetch users from the API
export const getAllUsers = async (): Promise<User[]> => {
  try {
    console.log("Making API request to fetch users")

    // Try to get the correct API endpoint
    // You may need to adjust this endpoint based on your actual backend API structure
    const endpoints = ["/api/users", "/api/user/all", "/users", "/api/v1/users"]

    let response = null
    let error = null

    // Try each endpoint until one works
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`)
        response = await api.get(endpoint)
        if (response.status === 200) {
          console.log(`Successful response from ${endpoint}:`, response.data)
          break
        }
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        error = err
        console.log(`Endpoint ${endpoint} failed:`, err)
      }
    }

    // If we got a successful response
    if (response && response.data) {
      if (Array.isArray(response.data)) {
        return response.data
      } else if (response.data.content && Array.isArray(response.data.content)) {
        // Handle case where API returns paginated data
        return response.data.content
      } else if (response.data.users && Array.isArray(response.data.users)) {
        // Handle case where API returns nested data
        return response.data.users
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // Another common API response format
        return response.data.data
      }
    }

    // If we reach here, all endpoints failed or returned unexpected data
    console.warn("All API endpoints failed or returned unexpected data format. Using mock data.")

    // Use mock data as fallback
    return getMockUsers()
  } catch (error) {
    console.error("Error fetching users:", error)
    return getMockUsers() // Always return mock data on error
  }
}

// Mock users for development and testing
const getMockUsers = (): User[] => {
  console.log("Using mock user data")
  return [
    {
      id: "2", firstName: "Jane", lastName: "Doe", email: "jane.doe@example.com", profilePictureUrl: undefined,
      using2FA: false
    },
    {
      id: "3", firstName: "Bob", lastName: "Smith", email: "bob.smith@example.com", profilePictureUrl: undefined,
      using2FA: false
    },
    {
      id: "4",
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice.johnson@example.com",
      profilePictureUrl: undefined,
      using2FA: false
    },
    {
      id: "5", firstName: "John", lastName: "Brown", email: "john.brown@example.com", profilePictureUrl: undefined,
      using2FA: false
    },
    {
      id: "6", firstName: "Emma", lastName: "Wilson", email: "emma.wilson@example.com", profilePictureUrl: undefined,
      using2FA: false
    },
    {
      id: "7",
      firstName: "Michael",
      lastName: "Davis",
      email: "michael.davis@example.com",
      profilePictureUrl: undefined,
      using2FA: false
    },
    {
      id: "8",
      firstName: "Olivia",
      lastName: "Miller",
      email: "olivia.miller@example.com",
      profilePictureUrl: undefined,
      using2FA: false
    },
    {
      id: "9",
      firstName: "William",
      lastName: "Taylor",
      email: "william.taylor@example.com",
      profilePictureUrl: undefined,
      using2FA: false
    },
    {
      id: "10",
      firstName: "Sophia",
      lastName: "Anderson",
      email: "sophia.anderson@example.com",
      profilePictureUrl: undefined,
      using2FA: false
    },
  ]
}

// Get a specific user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const response = await api.get(`/api/users/${userId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error)
    return null
  }
}

