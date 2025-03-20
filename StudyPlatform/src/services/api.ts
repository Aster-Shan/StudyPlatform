import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8080",
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Redirect to login or refresh token
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
) // Added missing closing parenthesis here

export default api

