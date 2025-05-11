import type { Portfolio } from "@/lib/services/portfolio.service"

interface ModernPreviewProps {
  portfolio: Partial<Portfolio>
}

export function ModernPreview({ portfolio }: ModernPreviewProps) {
  // Get the first image as hero if available
  const heroImage = portfolio.media?.images && portfolio.media.images.length > 0 ? portfolio.media.images[0] : null

  return (
    <div className="modern-theme bg-white text-gray-800 rounded-lg shadow-sm overflow-auto max-h-[calc(100vh-200px)]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-8 rounded-t-lg">
        {heroImage && (
          <div className="absolute inset-0 opacity-20 rounded-t-lg overflow-hidden">
            <img src={heroImage || "/placeholder.svg"} alt="Hero background" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-4">{portfolio.title || "Untitled Project"}</h1>
          {portfolio.timeline && <p className="text-indigo-100 font-medium">{portfolio.timeline}</p>}
        </div>
      </div>

      <div className="p-8 grid gap-8">
        {/* Overview Section */}
        {portfolio.overview && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">Overview</h2>
            <div className="prose prose-sm sm:prose-base" dangerouslySetInnerHTML={{ __html: portfolio.overview }} />
          </div>
        )}

        {/* Tools Section */}
        {portfolio.tools && portfolio.tools.length > 0 && portfolio.tools[0] !== "" && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">Tools & Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {portfolio.tools.map(
                (tool, index) =>
                  tool && (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                    >
                      {tool}
                    </span>
                  ),
              )}
            </div>
          </div>
        )}

        {/* Outcomes Section */}
        {(portfolio.outcomes?.metrics || portfolio.outcomes?.testimonials) && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">Outcomes</h2>

            <div className="grid gap-6 md:grid-cols-2">
              {portfolio.outcomes.metrics && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-3 text-gray-800">Metrics</h3>
                  <p className="text-gray-700 whitespace-pre-line">{portfolio.outcomes.metrics}</p>
                </div>
              )}

              {portfolio.outcomes.testimonials && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-3 text-gray-800">Testimonials</h3>
                  <blockquote className="pl-4 border-l-4 border-indigo-200 italic text-gray-700 whitespace-pre-line">
                    {portfolio.outcomes.testimonials}
                  </blockquote>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Media Section */}
        {((portfolio.media?.images && portfolio.media.images.length > 0 && portfolio.media.images[0]) ||
          (portfolio.media?.videos && portfolio.media.videos.length > 0) ||
          (portfolio.media?.links && portfolio.media.links.length > 0)) && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">Media</h2>

            {/* Images */}
            {portfolio.media?.images && portfolio.media.images.length > 0 && portfolio.media.images[0] && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Images</h3>
                <div className="grid grid-cols-2 gap-4">
                  {portfolio.media.images.map(
                    (image, index) =>
                      image && (
                        <div key={index} className="overflow-hidden rounded-lg shadow-sm">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Project image ${index + 1}`}
                            className="w-full h-auto"
                          />
                        </div>
                      ),
                  )}
                </div>
              </div>
            )}

            {/* Videos - Fixed to remove the border appearance */}
            {portfolio.media?.videos && portfolio.media.videos.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Videos</h3>
                <div className="grid grid-cols-1 gap-4">
                  {portfolio.media.videos.map(
                    (video, index) =>
                      video && (
                        <div key={index} className="p-3 bg-white rounded-lg shadow-sm">
                          <a
                            href={video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                          >
                            {video}
                          </a>
                        </div>
                      ),
                  )}
                </div>
              </div>
            )}

            {/* Links */}
            {portfolio.media?.links && portfolio.media.links.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-800">Reference Links</h3>
                <div className="grid grid-cols-1 gap-2">
                  {portfolio.media.links.map(
                    (link, index) =>
                      link && (
                        <div key={index} className="p-3 bg-white rounded-lg shadow-sm">
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                          >
                            {link}
                          </a>
                        </div>
                      ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
