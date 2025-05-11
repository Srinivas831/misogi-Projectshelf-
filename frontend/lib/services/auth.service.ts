import axios from "axios"
import { API_URL } from "@/lib/utils/constants"

export interface RegisterData {
  name: string
  email: string
  password: string
  role?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  message: string
  token?: string
  user: {
    userName: string
    email: string
    password: string
    _id: string
    createdAt: string
    __v: number
    role?: string
  }
}

/**
 * Authentication service for handling auth-related API calls
 */
export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const requestBody: Record<string, string> = {
      userName: data.name,
      email: data.email,
      password: data.password,
    }

    // Only add role if it's provided
    if (data.role) {
      requestBody.role = data.role
    }

    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Registration failed")
      }
      throw new Error("Registration failed. Please try again.")
    }
  },

  /**
   * Login a user
   */
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Login failed")
      }
      throw new Error("Login failed. Please try again.")
    }
  },
}
