"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PortfolioCard } from "@/components/PortfolioCard"
import { portfolioService, type Portfolio } from "@/lib/services/portfolio.service"
import { getCurrentUser, isLoggedIn } from "@/lib/utils/auth"
import { useToast } from "@/lib/hooks/use-toast"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [user, setUser] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletingPortfolioId, setDeletingPortfolioId] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    if (!isLoggedIn()) {
      // Redirect to login page if not authenticated
      router.push("/login")
      return
    }

    // Get user data
    const userData = getCurrentUser()
    if (userData) {
      setUser(userData)
    } else {
      // If there's no user data but there is a token, something is wrong
      router.push("/login")
      return
    }

    // Fetch user portfolios
    fetchPortfolios()
  }, [router, toast])

  const fetchPortfolios = async () => {
    try {
      setIsLoading(true)
      const data = await portfolioService.getUserPortfolios()
      setPortfolios(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch portfolios",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditPortfolio = (id: string) => {
    router.push(`/portfolio/edit/${id}`)
  }

  const handleDeletePortfolio = async (id: string) => {
    if (deletingPortfolioId) return

    const confirmed = window.confirm("Are you sure you want to delete this portfolio?")
    if (!confirmed) return

    try {
      setDeletingPortfolioId(id)

      // Call the delete API
      await portfolioService.deletePortfolio(id)

      toast({
        variant: "success",
        title: "Success",
        description: "Portfolio deleted successfully",
      })

      // Refresh the portfolios list
      fetchPortfolios()
    } catch (error) {
      console.error("Delete error:", error)

      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete portfolio",
      })
    } finally {
      setDeletingPortfolioId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Portfolios</h1>
          {user && <p className="mt-1 text-gray-600">Welcome back, {user.userName}!</p>}
        </div>
        <Link href="/portfolio/create">
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Plus className="mr-2 h-4 w-4" />
            Create New Portfolio
          </Button>
        </Link>
      </div>

      {portfolios.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <div className="rounded-full bg-blue-50 p-3">
            <Plus className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No portfolios yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first portfolio project</p>
          <Link href="/portfolio/create" className="mt-6">
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="mr-2 h-4 w-4" />
              Create New Portfolio
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((portfolio) => (
            <div key={portfolio._id} onClick={() => router.push(`/portfolio/${portfolio._id}`)}>
              <PortfolioCard
                portfolio={portfolio}
                onEdit={handleEditPortfolio}
                onDelete={handleDeletePortfolio}
                isDeleting={deletingPortfolioId === portfolio._id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
