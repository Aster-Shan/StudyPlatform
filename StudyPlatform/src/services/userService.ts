import type { User } from "../types"
import api from "./api"

export async function getAllUsers(): Promise<User[]> {
  const response = await api.get<User[]>("/api/users")
  return response.data
}

export async function getUserById(userId: number): Promise<User> {
  const response = await api.get<User>(`/api/users/${userId}`)
  return response.data
}

export async function updateUserProfile(userData: Partial<User>): Promise<User> {
  const response = await api.put<User>("/api/users/profile", userData)
  return response.data
}

