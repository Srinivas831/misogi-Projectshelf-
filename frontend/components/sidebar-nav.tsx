"use client"

import { Home, LayoutGrid, LogOut, User } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { clearAuthData, getCurrentUser, getUserInitials, isLoggedIn } from "@/lib/utils/auth"
import { useToast } from "@/lib/hooks/use-toast"

export function SidebarNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [authenticated, setAuthenticated] = useState(false)
  const [userInitials, setUserInitials] = useState("")

  // Function to check auth status and update state
  const checkAuthStatus = () => {
    const loggedIn = isLoggedIn()
    setAuthenticated(loggedIn)

    if (loggedIn) {
      const user = getCurrentUser()
      if (user && user.userName) {
        setUserInitials(getUserInitials(user.userName))
      }
    }
  }

  useEffect(() => {
    // Check auth status on initial render
    checkAuthStatus()

    // Set up an interval to periodically check auth status
    const interval = setInterval(checkAuthStatus, 1000)

    // Add event listener for storage changes (in case of logout in another tab)
    window.addEventListener("storage", checkAuthStatus)

    return () => {
      clearInterval(interval)
      window.removeEventListener("storage", checkAuthStatus)
    }
  }, [])

  // Force check auth status when pathname changes (e.g., after navigation)
  useEffect(() => {
    checkAuthStatus()
  }, [pathname])

  const handleLogout = () => {
    clearAuthData()
    setAuthenticated(false)
    setUserInitials("")

    toast({
      variant: "success",
      title: "Logged Out",
      description: "You have been successfully logged out",
    })

    router.push("/login")
  }

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutGrid,
    },
  ]

  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-white border-r flex flex-col items-center py-6">
      <div className="flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <div key={item.name} className="relative group mb-6">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-md transition-colors",
                  isActive ? "bg-blue-500 text-white" : "text-gray-500 hover:bg-gray-100",
                )}
              >
                <item.icon className="h-5 w-5" />
              </Link>

              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                {item.name}
              </div>
            </div>
          )
        })}
      </div>

      {/* User and Logout Section */}
      <div className="mt-auto">
        {authenticated ? (
          <>
            {/* User Icon with Initials */}
            <div className="relative group mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white">
                {userInitials}
              </div>

              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                {getCurrentUser()?.userName || "User"}
              </div>
            </div>

            {/* Logout Button */}
            <div className="relative group">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>

              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                Logout
              </div>
            </div>
          </>
        ) : (
          <div className="relative group">
            <Link
              href="/login"
              className="flex items-center justify-center w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
              Login
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
