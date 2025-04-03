import type { ActivityLog } from "./activity"

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
  activityLog?: ActivityLog[]
}

