"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, Plus, Search, User, LogIn, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PublicPortfolioCard } from "@/components/PublicPortfolioCard"
import { portfolioService, type PublicPortfolio } from "@/lib/services/portfolio.service"
import { isLoggedIn } from "@/lib/utils/auth"

export default function HomePage() {
  const [portfolios, setPortfolios] = useState<PublicPortfolio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication status
    setIsAuthenticated(isLoggedIn())

    // Fetch all portfolios
    fetchAllPortfolios()
  }, [])

  const fetchAllPortfolios = async () => {
    try {
      setIsLoading(true)
      const data = await portfolioService.getAllPortfolios()
      setPortfolios(data)
    } catch (error) {
      console.error("Failed to fetch portfolios:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter portfolios based on search query
  const filteredPortfolios = portfolios.filter(
    (portfolio) =>
      portfolio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      portfolio.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      portfolio.tools.some((tool) => tool.toLowerCase().includes(searchQuery.toLowerCase())) ||
      portfolio.userId.userName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Simple, Clean Hero Section */}
      <div className="relative bg-blue-600">
        {/* Auth Icons */}
        <div className="absolute top-4 right-6 z-10 flex gap-3">
          {isAuthenticated ? (
            <Link href="/dashboard" className="group relative">
              <div className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="absolute right-0 top-full mt-1 w-max bg-gray-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Dashboard
              </span>
            </Link>
          ) : (
            <>
              <Link href="/login" className="group relative">
                <div className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <LogIn className="h-5 w-5 text-white" />
                </div>
                <span className="absolute right-0 top-full mt-1 w-max bg-gray-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Sign In
                </span>
              </Link>
              <Link href="/register" className="group relative">
                <div className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <UserPlus className="h-5 w-5 text-white" />
                </div>
                <span className="absolute right-0 top-full mt-1 w-max bg-gray-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Create Account
                </span>
              </Link>
            </>
          )}
        </div>

        {/* Hero Content with Geometric Design */}
        <div className="container mx-auto px-6 pt-16 pb-20 relative z-0">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-blue-500 opacity-30"></div>
            <div className="absolute bottom-10 right-1/4 w-32 h-32 rounded-full bg-indigo-500 opacity-20"></div>
            <div className="absolute top-1/3 right-10 w-16 h-16 rounded-full bg-blue-400 opacity-20"></div>
            <div className="absolute bottom-1/4 left-1/3 w-24 h-24 rounded-full bg-indigo-400 opacity-15"></div>
          </div>

          {/* Text Content */}
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl font-bold text-white mb-3">Discover Amazing Portfolios</h1>
            <p className="text-xl text-blue-100">Explore creative work from professionals across various fields</p>
          </div>
        </div>

        {/* Simple Diagonal Cut */}
        <div className="h-16 bg-white relative">
          <div className="absolute -top-16 left-0 right-0 h-16 bg-blue-600 skew-y-3 transform origin-left"></div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search portfolios by title, tools, or creator..."
            className="pl-10 py-6 text-base rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Portfolios List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : filteredPortfolios.length > 0 ? (
          <div className="space-y-6">
            {filteredPortfolios.map((portfolio) => (
              <PublicPortfolioCard key={portfolio._id} portfolio={portfolio} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No portfolios found</h3>
            <p className="text-gray-500">
              {searchQuery ? "Try adjusting your search terms" : "There are no portfolios available at the moment"}
            </p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16 mt-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to showcase your work?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community and create your own portfolio to share with the world
          </p>

          {isAuthenticated ? (
            <Link href="/portfolio/create">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Create New Portfolio
              </Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
