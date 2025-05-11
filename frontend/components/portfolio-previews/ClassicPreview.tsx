import type { Portfolio } from "@/lib/services/portfolio.service"

interface ClassicPreviewProps {
  portfolio: Partial<Portfolio>
}

export function ClassicPreview({ portfolio }: ClassicPreviewProps) {
  // Get the first image as hero if available
  const heroImage = portfolio.media?.images && portfolio.media.images.length > 0 ? portfolio.media.images[0] : null

  return (
    <div className="classic-theme bg-white text-gray-800 p-8 rounded-lg shadow-sm overflow-auto max-h-[calc(100vh-200px)]">
      <h1 className="text-3xl font-bold border-b border-gray-200 pb-4 mb-6">{portfolio.title || "Untitled Project"}</h1>

      {/* Overview Section */}
      {portfolio.overview && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">Overview</h2>
          <div className="prose prose-sm sm:prose-base" dangerouslySetInnerHTML={{ __html: portfolio.overview }} />
        </div>
      )}

      {/* Timeline Section */}
      {portfolio.timeline && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">Timeline</h2>
          <p className="text-gray-700">{portfolio.timeline}</p>
        </div>
      )}

      {/* Tools Section */}
      {portfolio.tools && portfolio.tools.length > 0 && portfolio.tools[0] !== "" && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">Tools & Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {portfolio.tools.map(
              (tool, index) =>
                tool && (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {tool}
                  </span>
                ),
            )}
          </div>
        </div>
      )}

      {/* Outcomes Section */}
      {(portfolio.outcomes?.metrics || portfolio.outcomes?.testimonials) && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">Outcomes</h2>

          {portfolio.outcomes.metrics && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Metrics</h3>
              <p className="text-gray-700 whitespace-pre-line">{portfolio.outcomes.metrics}</p>
            </div>
          )}

          {portfolio.outcomes.testimonials && (
            <div>
              <h3 className="text-lg font-medium mb-2">Testimonials</h3>
              <blockquote className="pl-4 border-l-4 border-gray-200 italic text-gray-700 whitespace-pre-line">
                {portfolio.outcomes.testimonials}
              </blockquote>
            </div>
          )}
        </div>
      )}

      {/* Media Section */}
      {((portfolio.media?.images && portfolio.media.images.length > 0 && portfolio.media.images[0]) ||
        (portfolio.media?.videos && portfolio.media.videos.length > 0) ||
        (portfolio.media?.links && portfolio.media.links.length > 0)) && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">Media</h2>

          {/* Images */}
          {portfolio.media?.images && portfolio.media.images.length > 0 && portfolio.media.images[0] && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Images</h3>
              <div className="grid grid-cols-1 gap-4">
                {portfolio.media.images.map(
                  (image, index) =>
                    image && (
                      <div key={index} className="overflow-hidden rounded-lg border border-gray-200">
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

          {/* Videos */}
          {portfolio.media?.videos && portfolio.media.videos.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Videos</h3>
              <div className="space-y-4">
                {portfolio.media.videos.map(
                  (video, index) =>
                    video && (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <a
                          href={video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
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
              <h3 className="text-lg font-medium mb-3">Reference Links</h3>
              <div className="space-y-2">
                {portfolio.media.links.map(
                  (link, index) =>
                    link && (
                      <div key={index}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
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
  )
}
