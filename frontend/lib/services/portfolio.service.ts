import axios from "axios"
import { API_URL } from "@/lib/utils/constants"
import { getAuthHeader } from "@/lib/utils/token"

export interface PortfolioMedia {
  videos: string[]
  links: string[]
  images: string[]
}

export interface Portfolio {
  _id: string
  userId: string | { _id: string; userName: string }
  title: string
  overview: string
  timeline: string
  tools: string[]
  theme: string
  slug?: string
  outcomes: {
    metrics: string
    testimonials: string
  }
  media: PortfolioMedia
  createdAt?: string
  updatedAt?: string
  __v?: number
}

export interface PublicPortfolio {
  _id: string
  userId: {
    _id: string
    userName: string
  }
  title: string
  overview: string
  tools: string[]
  slug?: string
}

export interface CreatePortfolioData {
  title: string
  overview: string
  timeline: string
  tools: string[]
  outcomes: {
    metrics: string
    testimonials: string
  }
  media: PortfolioMedia
  theme?: string
}

export type UpdatePortfolioData = CreatePortfolioData

/**
 * Portfolio service for handling portfolio-related API calls
 */
export const portfolioService = {
  /**
   * Get all public portfolios
   */
  async getAllPortfolios(): Promise<PublicPortfolio[]> {
    try {
      console.log("Fetching all portfolios")
      const response = await axios.get<PublicPortfolio[]>(`${API_URL}/all-portfolios`)
      console.log("All portfolios fetched:", response.data)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to fetch portfolios")
      }
      throw new Error("Failed to fetch portfolios. Please try again.")
    }
  },

  /**
   * Get all portfolios for the current user
   */
  async getUserPortfolios(): Promise<Portfolio[]> {
    try {
      const response = await axios.get<Portfolio[]>(`${API_URL}/portfolio/my-portfolios`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to fetch portfolios")
      }
      throw new Error("Failed to fetch portfolios. Please try again.")
    }
  },

  /**
   * Get a specific portfolio by ID
   */
  async getPortfolioById(id: string): Promise<Portfolio> {
    try {
      console.log(`Fetching portfolio with ID: ${id}`)
      const response = await axios.get<Portfolio>(`${API_URL}/portfolio/${id}`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      })
      console.log("Portfolio data fetched:", response.data)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to fetch portfolio")
      }
      throw new Error("Failed to fetch portfolio. Please try again.")
    }
  },

  /**
   * Get a specific portfolio by userName and slug
   */
  async getPortfolioByUserNameAndSlug(userName: string, slug: string): Promise<Portfolio> {
    try {
      console.log(`Fetching portfolio with userName: ${userName} and slug: ${slug}`)
      const response = await axios.get<Portfolio>(`${API_URL}/${userName}/${slug}`)
      console.log("Portfolio data fetched:", response.data)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to fetch portfolio")
      }
      throw new Error("Failed to fetch portfolio. Please try again.")
    }
  },

  /**
   * Create a new portfolio
   */
  async createPortfolio(data: CreatePortfolioData): Promise<Portfolio> {
    try {
      // Set a default theme if not provided
      const portfolioData = {
        ...data,
        theme: data.theme || "classic",
      }

      // Log the request body
      console.log("Creating portfolio with data:", portfolioData)

      const response = await axios.post<Portfolio>(`${API_URL}/portfolio/create`, portfolioData, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      })

      // Log the response
      console.log("Portfolio creation response:", response.data)

      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to create portfolio")
      }
      throw new Error("Failed to create portfolio. Please try again.")
    }
  },

  /**
   * Update an existing portfolio
   */
  async updatePortfolio(id: string, data: UpdatePortfolioData): Promise<Portfolio> {
    try {
      console.log(`Updating portfolio with ID: ${id}`, data)

      const response = await axios.patch<Portfolio>(`${API_URL}/portfolio/edit/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      })

      console.log("Portfolio update response:", response.data)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to update portfolio")
      }
      throw new Error("Failed to update portfolio. Please try again.")
    }
  },

  /**
   * Delete a portfolio by ID
   */
  async deletePortfolio(id: string): Promise<void> {
    try {
      console.log(`Deleting portfolio with ID: ${id}`)

      await axios.delete(`${API_URL}/portfolio/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      })

      console.log("Portfolio deleted successfully")
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to delete portfolio")
      }
      throw new Error("Failed to delete portfolio. Please try again.")
    }
  },
}
