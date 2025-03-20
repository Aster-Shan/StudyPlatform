import api from "./api"

export const createVideoRoom = async (name: string): Promise<{ roomId: string; name: string }> => {
  const response = await api.post("/api/video/rooms", { name })
  return response.data
}

export const getRoomInfo = async (roomId: string): Promise<any> => {
  const response = await api.get(`/api/video/rooms/${roomId}`)
  return response.data
}

export const joinRoom = async (roomId: string, peerId: string): Promise<void> => {
  await api.post(`/api/video/rooms/${roomId}/join`, { peerId })
}

