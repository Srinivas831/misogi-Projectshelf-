"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ChevronLeft,
  Loader2,
  Plus,
  Trash2,
  LinkIcon,
  ImageIcon,
  Video,
  Info,
  FileText,
  Calendar,
  Target,
  Wrench,
  BarChart,
  MessageSquareQuote,
  Eye,
  Palette,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/lib/hooks/use-toast"
import {
  portfolioService,
  type Portfolio,
  type CreatePortfolioData,
  type UpdatePortfolioData,
} from "@/lib/services/portfolio.service"
import { RichTextEditor } from "@/components/RichTextEditor"
import { ClassicPreview } from "@/components/portfolio-previews/ClassicPreview"
import { MinimalistPreview } from "@/components/portfolio-previews/MinimalistPreview"

interface FormData {
  title: string
  overview: string
  timeline: string
  tools: string[]
  outcomes: {
    metrics: string
    testimonials: string
  }
  media: {
    images: string[]
    videos: string[]
    links: string[]
  }
  theme: "classic" | "modern" | "minimalist"
}

interface PortfolioFormProps {
  mode: "create" | "edit"
  initialData?: Portfolio
  portfolioId?: string
}

export function PortfolioForm({ mode, initialData, portfolioId }: PortfolioFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [isLoading, setIsLoading] = useState(mode === "edit" && !initialData)

  // Initial form state
  const initialFormData: FormData = {
    title: "",
    overview: "",
    timeline: "",
    tools: [""],
    outcomes: {
      metrics: "",
      testimonials: "",
    },
    media: {
      images: [""],
      videos: [],
      links: [],
    },
    theme: "classic",
  }

  const [formData, setFormData] = useState<FormData>(initialFormData)

  // Fetch portfolio data if in edit mode and no initial data provided
  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (mode === "edit" && portfolioId && !initialData) {
        try {
          setIsLoading(true)
          const portfolio = await portfolioService.getPortfolioById(portfolioId)

          // Handle potential differences in data structure
          const formattedData: FormData = {
            title: portfolio.title || "",
            overview: portfolio.overview || "",
            timeline: portfolio.timeline || "",
            tools: portfolio.tools?.length ? portfolio.tools : [""],
            outcomes: {
              metrics: portfolio.outcomes?.metrics || "",
              testimonials: portfolio.outcomes?.testimonials || "",
            },
            media: {
              images: portfolio.media?.images?.length ? portfolio.media.images : [""],
              videos: portfolio.media?.videos || [],
              links: portfolio.media?.links || [],
            },
            theme: (portfolio.theme as "classic" | "modern" | "minimalist") || "classic",
          }

          setFormData(formattedData)
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to fetch portfolio data",
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    // If initial data is provided, use it
    if (mode === "edit" && initialData) {
      const formattedData: FormData = {
        title: initialData.title || "",
        overview: initialData.overview || "",
        timeline: initialData.timeline || "",
        tools: initialData.tools?.length ? initialData.tools : [""],
        outcomes: {
          metrics: initialData.outcomes?.metrics || "",
          testimonials: initialData.outcomes?.testimonials || "",
        },
        media: {
          images: initialData.media?.images?.length ? initialData.media.images : [""],
          videos: initialData.media?.videos || [],
          links: initialData.media?.links || [],
        },
        theme: (initialData.theme as "classic" | "modern" | "minimalist") || "classic",
      }

      setFormData(formattedData)
    } else {
      fetchPortfolioData()
    }
  }, [mode, portfolioId, initialData, toast])

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof FormData) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    })
  }

  // Handle theme change
  const handleThemeChange = (theme: "classic" | "modern" | "minimalist") => {
    setFormData({
      ...formData,
      theme,
    })
  }

  // Handle outcomes input changes
  const handleOutcomesChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof typeof formData.outcomes,
  ) => {
    setFormData({
      ...formData,
      outcomes: {
        ...formData.outcomes,
        [field]: e.target.value,
      },
    })
  }

  // Handle rich text editor changes
  const handleRichTextChange = (value: string) => {
    setFormData({
      ...formData,
      overview: value,
    })
  }

  // Handle tool input changes
  const handleToolChange = (index: number, value: string) => {
    const updatedTools = [...formData.tools]
    updatedTools[index] = value
    setFormData({
      ...formData,
      tools: updatedTools,
    })
  }

  // Add a new tool input
  const addTool = () => {
    setFormData({
      ...formData,
      tools: [...formData.tools, ""],
    })
  }

  // Remove a tool input
  const removeTool = (index: number) => {
    const updatedTools = [...formData.tools]
    updatedTools.splice(index, 1)
    setFormData({
      ...formData,
      tools: updatedTools.length ? updatedTools : [""],
    })
  }

  // Handle media input changes
  const handleMediaChange = (index: number, value: string, mediaType: "images" | "videos" | "links") => {
    const updatedMedia = { ...formData.media }
    updatedMedia[mediaType][index] = value
    setFormData({
      ...formData,
      media: updatedMedia,
    })
  }

  // Add a new media input
  const addMedia = (mediaType: "images" | "videos" | "links") => {
    const updatedMedia = { ...formData.media }
    updatedMedia[mediaType] = [...updatedMedia[mediaType], ""]
    setFormData({
      ...formData,
      media: updatedMedia,
    })
  }

  // Remove a media input
  const removeMedia = (index: number, mediaType: "images" | "videos" | "links") => {
    const updatedMedia = { ...formData.media }
    updatedMedia[mediaType].splice(index, 1)
    if (updatedMedia[mediaType].length === 0 && mediaType === "images") {
      updatedMedia[mediaType] = [""] // Always keep at least one image input
    }
    setFormData({
      ...formData,
      media: updatedMedia,
    })
  }

  // Toggle preview visibility on small screens
  const togglePreview = () => {
    setShowPreview(!showPreview)
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.title.trim() || !formData.overview.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Title and overview are required fields",
      })
      return
    }

    // Filter out empty values
    const cleanedFormData = {
      ...formData,
      tools: formData.tools.filter((tool) => tool.trim() !== ""),
      media: {
        images: formData.media.images.filter((url) => url.trim() !== ""),
        videos: formData.media.videos.filter((url) => url.trim() !== ""),
        links: formData.media.links.filter((url) => url.trim() !== ""),
      },
      // Ensure theme is set correctly
      theme: formData.theme || "classic",
    }

    try {
      setIsSubmitting(true)

      if (mode === "create") {
        // Create new portfolio
        await portfolioService.createPortfolio(cleanedFormData as CreatePortfolioData)
        toast({
          variant: "success",
          title: "Success",
          description: "Portfolio created successfully",
        })
      } else if (mode === "edit" && portfolioId) {
        // Update existing portfolio
        await portfolioService.updatePortfolio(portfolioId, cleanedFormData as UpdatePortfolioData)
        toast({
          variant: "success",
          title: "Success",
          description: "Portfolio updated successfully",
        })
      }

      // Redirect to dashboard after successful operation
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (error) {
      console.error("Portfolio operation error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${mode} portfolio`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading portfolio data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-blue-500 hover:text-blue-700 transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-gray-800">
          {mode === "create" ? "Create New Portfolio" : "Edit Portfolio"}
        </h1>
        <p className="mt-2 text-gray-600">
          {mode === "create"
            ? "Showcase your work by creating a detailed portfolio entry"
            : "Update your portfolio details and preview changes in real-time"}
        </p>
      </div>

      {/* Theme Selection and Preview Toggle */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-gray-50 p-4">
        <div>
          <h2 className="flex items-center text-lg font-medium text-gray-800">
            <Palette className="mr-2 h-5 w-5 text-blue-500" />
            Select Theme
          </h2>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => handleThemeChange("classic")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                formData.theme === "classic" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Classic
            </button>
            <button
              type="button"
              onClick={() => handleThemeChange("minimalist")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                formData.theme === "minimalist" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Minimalist
            </button>
            <button
              type="button"
              onClick={() => handleThemeChange("modern")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                formData.theme === "modern" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Modern
            </button>
          </div>
        </div>

        <Button type="button" variant="outline" onClick={togglePreview} className="md:hidden flex items-center gap-2">
          <Eye className="h-4 w-4" />
          {showPreview ? "Hide Preview" : "Show Preview"}
        </Button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Form Section */}
        <div className={`w-full ${showPreview ? "lg:w-1/2" : "lg:w-full"}`}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-6 flex items-center">
                <FileText className="mr-3 h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
              </div>

              <div className="mb-6">
                <Label htmlFor="title" className="mb-2 block text-base font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange(e, "title")}
                  placeholder="e.g., E-commerce Website Redesign"
                  required
                  className="w-full text-base"
                />
              </div>

              <div className="mb-6">
                <Label htmlFor="overview" className="mb-2 block text-base font-medium text-gray-700">
                  Overview <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <RichTextEditor
                    value={formData.overview}
                    onChange={handleRichTextChange}
                    placeholder="Provide a detailed description of your project..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="timeline" className="mb-2 block text-base font-medium text-gray-700">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                    Timeline
                  </div>
                </Label>
                <Input
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) => handleChange(e, "timeline")}
                  placeholder="e.g., January 2023 - March 2023"
                  className="w-full"
                />
              </div>
            </div>

            {/* Outcomes Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-6 flex items-center">
                <Target className="mr-3 h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">Outcomes</h2>
              </div>

              <div className="mb-6">
                <Label htmlFor="metrics" className="mb-2 block text-base font-medium text-gray-700">
                  <div className="flex items-center">
                    <BarChart className="mr-2 h-4 w-4 text-blue-500" />
                    Metrics
                  </div>
                </Label>
                <Textarea
                  id="metrics"
                  value={formData.outcomes.metrics}
                  onChange={(e) => handleOutcomesChange(e, "metrics")}
                  placeholder="What measurable results did your project achieve? (e.g., 'Increased user retention by 30%')"
                  className="w-full min-h-[100px]"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Include quantitative results like performance improvements, user growth, or efficiency gains.
                </p>
              </div>

              <div>
                <Label htmlFor="testimonials" className="mb-2 block text-base font-medium text-gray-700">
                  <div className="flex items-center">
                    <MessageSquareQuote className="mr-2 h-4 w-4 text-blue-500" />
                    Testimonials
                  </div>
                </Label>
                <Textarea
                  id="testimonials"
                  value={formData.outcomes.testimonials}
                  onChange={(e) => handleOutcomesChange(e, "testimonials")}
                  placeholder="Any testimonials or feedback you received? (e.g., 'This project saved us hundreds of hours of manual work.' – Product Manager)"
                  className="w-full min-h-[100px]"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Include quotes from clients, users, or team members about the impact of your work.
                </p>
              </div>
            </div>

            {/* Tools Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-6 flex items-center">
                <Wrench className="mr-3 h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">Tools & Technologies</h2>
              </div>

              <div className="space-y-4">
                {formData.tools.map((tool, index) => (
                  <div key={`tool-${index}`} className="flex items-center gap-3">
                    <Input
                      value={tool}
                      onChange={(e) => handleToolChange(index, e.target.value)}
                      placeholder="e.g., React, Figma, Node.js"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeTool(index)}
                      disabled={formData.tools.length === 1 && index === 0}
                      className="h-10 w-10 shrink-0 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addTool}
                className="mt-4 w-full border-dashed border-blue-200 text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Tool
              </Button>
            </div>

            {/* Media Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-6 flex items-center">
                <Info className="mr-3 h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">Media</h2>
              </div>

              {/* Images */}
              <div className="mb-8">
                <h3 className="mb-4 flex items-center text-lg font-medium text-gray-700">
                  <ImageIcon className="mr-2 h-5 w-5 text-blue-500" />
                  Images
                </h3>

                <div className="space-y-4">
                  {formData.media.images.map((url, index) => (
                    <div key={`image-${index}`} className="flex items-center gap-3">
                      <Input
                        value={url}
                        onChange={(e) => handleMediaChange(index, e.target.value, "images")}
                        placeholder="Enter image URL"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeMedia(index, "images")}
                        disabled={formData.media.images.length === 1 && index === 0}
                        className="h-10 w-10 shrink-0 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addMedia("images")}
                  className="mt-4 w-full border-dashed border-blue-200 text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Image URL
                </Button>
              </div>

              {/* Videos */}
              <div className="mb-8">
                <h3 className="mb-4 flex items-center text-lg font-medium text-gray-700">
                  <Video className="mr-2 h-5 w-5 text-blue-500" />
                  Videos
                </h3>

                <div className="space-y-4">
                  {formData.media.videos.map((url, index) => (
                    <div key={`video-${index}`} className="flex items-center gap-3">
                      <Input
                        value={url}
                        onChange={(e) => handleMediaChange(index, e.target.value, "videos")}
                        placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeMedia(index, "videos")}
                        className="h-10 w-10 shrink-0 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {formData.media.videos.length === 0 && (
                  <div className="mb-4 rounded-md bg-gray-50 p-4 text-sm text-gray-600">
                    <p>No video links added yet. Add a video URL to showcase your work in action.</p>
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addMedia("videos")}
                  className="mt-4 w-full border-dashed border-blue-200 text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Video URL
                </Button>
              </div>

              {/* Links */}
              <div>
                <h3 className="mb-4 flex items-center text-lg font-medium text-gray-700">
                  <LinkIcon className="mr-2 h-5 w-5 text-blue-500" />
                  Reference Links
                </h3>

                <div className="space-y-4">
                  {formData.media.links.map((url, index) => (
                    <div key={`link-${index}`} className="flex items-center gap-3">
                      <Input
                        value={url}
                        onChange={(e) => handleMediaChange(index, e.target.value, "links")}
                        placeholder="Enter reference URL"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeMedia(index, "links")}
                        className="h-10 w-10 shrink-0 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {formData.media.links.length === 0 && (
                  <div className="mb-4 rounded-md bg-gray-50 p-4 text-sm text-gray-600">
                    <p>No reference links added yet. Add links to related resources or live demos.</p>
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addMedia("links")}
                  className="mt-4 w-full border-dashed border-blue-200 text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Reference URL
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link href="/dashboard">
                <Button type="button" variant="outline" className="px-6 py-2 text-base transition-all">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-blue-500 px-6 py-2 text-base hover:bg-blue-600 transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {mode === "create" ? "Creating..." : "Updating..."}
                  </>
                ) : mode === "create" ? (
                  "Create Portfolio"
                ) : (
                  "Update Portfolio"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <div className="sticky top-6 w-full lg:w-1/2">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center text-lg font-medium text-gray-800">
                  <Eye className="mr-2 h-5 w-5 text-blue-500" />
                  Preview
                </h2>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 capitalize">
                  {formData.theme} Theme
                </span>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                {formData.theme === "classic" ? (
                  <ClassicPreview portfolio={formData as Partial<Portfolio>} />
                ) : (
                  <MinimalistPreview portfolio={formData as Partial<Portfolio>} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
