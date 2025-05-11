/**
 * Get the authentication token from localStorage
 * @returns The authentication token or null if not found
 */
export const getToken = (): string | null => {
  if (typeof window === "undefined") {
    return null
  }

  return localStorage.getItem("token")
}

/**
 * Get the authorization header with the Bearer token
 * @returns The authorization header object or empty object if no token
 */
export const getAuthHeader = (): Record<string, string> => {
  const token = getToken()

  if (!token) {
    return {}
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}
