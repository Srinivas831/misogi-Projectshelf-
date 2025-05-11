"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { portfolioService, type Portfolio } from "@/lib/services/portfolio.service"
import { ClassicPreview } from "@/components/portfolio-previews/ClassicPreview"
import { MinimalistPreview } from "@/components/portfolio-previews/MinimalistPreview"
import { ModernPreview } from "@/components/portfolio-previews/ModernPreview"
import { Button } from "@/components/ui/button"

export default function PortfolioDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userName = params.userName as string
  const slug = params.slug as string

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await portfolioService.getPortfolioByUserNameAndSlug(userName, slug)
        setPortfolio(data)
      } catch (err) {
        console.error("Error fetching portfolio:", err)
        setError(err instanceof Error ? err.message : "Failed to load portfolio")
      } finally {
        setIsLoading(false)
      }
    }

    if (userName && slug) {
      fetchPortfolio()
    }
  }, [userName, slug])

  // Function to render the appropriate preview based on theme
  const renderPortfolioPreview = () => {
    if (!portfolio) return null

    switch (portfolio.theme) {
      case "minimalist":
        return <MinimalistPreview portfolio={portfolio} />
      case "modern":
        return <ModernPreview portfolio={portfolio} />
      case "classic":
      default:
        return <ClassicPreview portfolio={portfolio} />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <div className="bg-red-50 p-6 rounded-lg inline-block mb-6">
          <svg className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-bold text-red-800 mb-2">Portfolio Not Found</h2>
          <p className="text-red-600">{error}</p>
        </div>
        <Link href="/">
          <Button className="bg-blue-500 hover:bg-blue-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <div className="bg-yellow-50 p-6 rounded-lg inline-block mb-6">
          <svg className="h-12 w-12 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-bold text-yellow-800 mb-2">No Portfolio Data</h2>
          <p className="text-yellow-600">The portfolio could not be loaded.</p>
        </div>
        <Link href="/">
          <Button className="bg-blue-500 hover:bg-blue-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-blue-500 hover:text-blue-700 transition-colors">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{portfolio.title}</h1>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                {portfolio.theme || "Classic"} Template
              </span>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-3">By</span>
                <span className="text-sm font-medium text-blue-600">
                  {typeof portfolio.userId === "object" ? portfolio.userId.userName : "Unknown User"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">{renderPortfolioPreview()}</div>
        </div>
      </div>
    </div>
  )
}
