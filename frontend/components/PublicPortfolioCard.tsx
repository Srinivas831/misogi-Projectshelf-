"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import type { PublicPortfolio } from "@/lib/services/portfolio.service"

interface PublicPortfolioCardProps {
  portfolio: PublicPortfolio
}

export function PublicPortfolioCard({ portfolio }: PublicPortfolioCardProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  // Function to strip HTML tags from overview
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "")
  }

  // Function to create a slug from the title
  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
  }

  const handleCardClick = () => {
    const userName = portfolio.userId.userName
    // Use the slug from the portfolio if available, otherwise create one from the title
    const slug = portfolio.slug || createSlug(portfolio.title)

    router.push(`/${userName}/${slug}`)
  }

  return (
    <motion.div
      className="w-full mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 cursor-pointer ${
          isHovered ? "shadow-md border-blue-100 transform translate-y-[-2px]" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Subtle gradient background that appears on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Content positioned above the gradient */}
        <div className="relative z-10">
          {/* Title and Author row */}
          <div className="flex flex-wrap items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-800 pr-4">{portfolio.title}</h2>
            <div className="flex items-center text-sm text-gray-600 mt-1 sm:mt-0">
              <User className="h-4 w-4 mr-1 text-blue-500" />
              <span>{portfolio.userId.userName}</span>
            </div>
          </div>

          {/* Overview */}
          <p className="text-gray-600 mb-4 line-clamp-3">{stripHtml(portfolio.overview)}</p>

          {/* Tools */}
          {portfolio.tools && portfolio.tools.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-gray-700">Tools:</span>
              <div className="flex flex-wrap gap-2">
                {portfolio.tools.map((tool, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      isHovered ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* View details button that appears on hover */}
          <div
            className={`absolute bottom-6 right-6 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            }`}
          >
            <div className="flex items-center text-blue-500 font-medium">
              <span className="mr-1">View details</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
