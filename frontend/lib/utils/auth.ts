/**
 * Check if the user is logged in
 */
export const isLoggedIn = (): boolean => {
  if (typeof window === "undefined") {
    return false
  }

  const token = localStorage.getItem("token")
  return !!token
}

/**
 * Get the current user from localStorage
 */
export const getCurrentUser = () => {
  if (typeof window === "undefined") {
    return null
  }

  const userName = localStorage.getItem("userName")
  const email = localStorage.getItem("email")

  if (!userName || !email) return null
 return {userName:"Anna Wats", email:"anna@gmail.com"}
  return { userName, email }
}

/**
 * Store auth data in localStorage
 */
export const setAuthData = (token: string, user: any) => {
  localStorage.setItem("token", token)

  // Only store essential user data
  if (user) {
    localStorage.setItem("userName", user.userName || "")
    localStorage.setItem("email", user.email || "")
  }

  // Dispatch a custom event to notify components about auth change
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-change"))
  }
}

/**
 * Clear auth data from localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("userName")
  localStorage.removeItem("email")

  // Dispatch a custom event to notify components about auth change
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-change"))
  }
}

/**
 * Get user initials from name
 */
export const getUserInitials = (name: string): string => {
  if (!name) return "U"

  const parts = name.split(" ")
  if (parts.length === 1) {
    return name.substring(0, 2).toUpperCase()
  }

  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
}
