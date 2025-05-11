"use client"

import { useState } from "react"
import { Edit, Trash2, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Portfolio } from "@/lib/services/portfolio.service"

interface PortfolioCardProps {
  portfolio: Portfolio
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  isDeleting?: boolean
}

export function PortfolioCard({ portfolio, onEdit, onDelete, isDeleting }: PortfolioCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Function to truncate text to a certain number of words
  const truncateText = (text: string, maxWords: number) => {
    // Remove HTML tags
    const strippedText = text.replace(/<[^>]*>/g, "")
    const words = strippedText.split(/\s+/)
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "..."
    }
    return strippedText
  }

  return (
    <Card
      className="group relative h-full overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Overlay that appears on hover */}
      <div
        className={`absolute inset-0 bg-blue-50/70 z-10 flex items-center justify-center transition-opacity duration-200 ${
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Centered action buttons */}
        <div className="flex gap-3">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(portfolio._id)
              }}
              className="rounded-full bg-white p-3 text-blue-500 shadow-md hover:bg-blue-50 transition-transform hover:scale-110"
              aria-label="Edit portfolio"
              disabled={isDeleting}
            >
              <Edit className="h-5 w-5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(portfolio._id)
              }}
              className="rounded-full bg-white p-3 text-red-500 shadow-md hover:bg-red-50 transition-transform hover:scale-110"
              aria-label="Delete portfolio"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 text-xl">{portfolio.title || "Untitled Project"}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        {/* Overview */}
        <div className="line-clamp-3 text-sm text-gray-600 mb-4">
          {portfolio.overview ? truncateText(portfolio.overview, 30) : "No description provided."}
        </div>

        {/* Tools */}
        {portfolio.tools && portfolio.tools.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {portfolio.tools.slice(0, 3).map((tool, index) => (
              <span key={index} className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                {tool}
              </span>
            ))}
            {portfolio.tools.length > 3 && (
              <span className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800">
                +{portfolio.tools.length - 3} more
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
