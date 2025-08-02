"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, Download, Eye, Briefcase, MapPin, Mail, Calendar, X } from "lucide-react"

interface GeneratedCV {
  id: string
  name: string
  role: string
  email: string
  location: string
  profileImageUrl?: string
  gender?: string
  age?: number
  experienceYears?: number
  summary?: string
  skills?: string[]
  companies?: string[]
  university?: string
}

interface GenerationProgress {
  current: number
  total: number
  isGenerating: boolean
  generatedCVs: GeneratedCV[]
  error?: string
}

// CV Preview Component - Fixed to handle HTML preview properly
function CVPreviewContent({ cvId }: { cvId: string }) {
  const [cvData, setCvData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  React.useEffect(() => {
    const fetchCVData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch the HTML content
        const response = await fetch(`/api/cv-preview-html/${cvId}`)
        if (!response.ok) {
          throw new Error(`Failed to load preview: ${response.status}`)
        }

        const htmlContent = await response.text()
        setCvData(htmlContent)
      } catch (err) {
        console.error("Error loading CV preview:", err)
        setError("Failed to load CV preview")
      } finally {
        setLoading(false)
      }
    }

    if (cvId) {
      fetchCVData()
    }
  }, [cvId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading CV preview...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <div className="text-6xl mb-2">❌</div>
            <p className="font-semibold">Preview Error</p>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
      <div dangerouslySetInnerHTML={{ __html: cvData }} className="cv-preview-content" />
      <style jsx>{`
        .cv-preview-content {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .cv-preview-content body {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  )
}

export default function CVGenerator() {
  const [count, setCount] = useState(5)
  const [progress, setProgress] = useState<GenerationProgress>({
    current: 0,
    total: 0,
    isGenerating: false,
    generatedCVs: [],
  })
  const [previewCV, setPreviewCV] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (count < 1 || count > 50) {
      setProgress((prev) => ({ ...prev, error: "Count must be between 1 and 50" }))
      return
    }

    setProgress({
      current: 0,
      total: count,
      isGenerating: true,
      generatedCVs: [],
      error: undefined,
    })

    try {
      const response = await fetch("/api/generate-cvs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ count }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error("No response body")
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6))

              if (data.type === "progress") {
                setProgress((prev) => ({
                  ...prev,
                  current: data.current,
                  generatedCVs: [...prev.generatedCVs, data.cv],
                }))
              } else if (data.type === "complete") {
                setProgress((prev) => ({
                  ...prev,
                  isGenerating: false,
                }))
              } else if (data.type === "error") {
                setProgress((prev) => ({
                  ...prev,
                  error: data.message,
                  isGenerating: false,
                }))
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e)
            }
          }
        }
      }
    } catch (error) {
      console.error("Error generating CVs:", error)
      setProgress((prev) => ({
        ...prev,
        error: "Failed to generate CVs. Please try again.",
        isGenerating: false,
      }))
    }
  }

  const handlePreview = (cvId: string) => {
    setPreviewCV(cvId)
  }

  const handleDownload = async (cvId: string, cvName: string) => {
    setDownloadingId(cvId)
    try {
      console.log(`Attempting to download CV: ${cvId}`)

      const response = await fetch(`/api/download-cv/${cvId}`)
      console.log(`Download response status: ${response.status}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Download failed: ${response.status} - ${errorText}`)
        throw new Error(`Failed to download PDF: ${response.status}`)
      }

      const blob = await response.blob()
      console.log(`Downloaded blob size: ${blob.size} bytes, type: ${blob.type}`)

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url

      // Determine file extension based on content type
      const fileExtension = blob.type === "application/pdf" ? "pdf" : "html"
      a.download = `${cvName.replace(/\s+/g, "_")}_CV.${fileExtension}`

      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      console.log(`Download completed successfully`)
    } catch (error) {
      console.error("Error downloading PDF:", error)
      alert(`Failed to download file: ${error.message}`)
    } finally {
      setDownloadingId(null)
    }
  }

  const progressPercentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Professional CV Generator
          </CardTitle>
          <CardDescription>
            Generate realistic Barcelona tech professional CVs with AI-powered human profile photos, comprehensive
            experience data, and modern design templates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="count">Number of CVs to generate</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="50"
                value={count}
                onChange={(e) => setCount(Number.parseInt(e.target.value) || 1)}
                disabled={progress.isGenerating}
                className="mt-1"
              />
            </div>
            <Button onClick={handleGenerate} disabled={progress.isGenerating} className="mt-6" size="lg">
              {progress.isGenerating ? "Generating Professional CVs..." : "Generate CVs"}
            </Button>
          </div>

          {progress.isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Creating professional CVs with realistic photos...</span>
                <span>
                  {progress.current} / {progress.total}
                </span>
              </div>
              <Progress value={progressPercentage} className="w-full" />
            </div>
          )}

          {progress.error && (
            <Alert variant="destructive">
              <AlertDescription>{progress.error}</AlertDescription>
            </Alert>
          )}

          {progress.generatedCVs.length > 0 && !progress.isGenerating && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Successfully generated {progress.generatedCVs.length} professional CVs with realistic human profile
                photos! They are now available in the CV Library.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Show generated CVs during and after generation */}
      {progress.generatedCVs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated CVs ({progress.generatedCVs.length})</CardTitle>
            <CardDescription>Preview and download your generated CVs with realistic profile photos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {progress.generatedCVs.map((cv) => (
                <Card key={cv.id} className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                  <CardContent className="p-4 flex flex-col h-full">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="relative">
                        <img
                          src={cv.profileImageUrl || "/placeholder.svg?height=48&width=48"}
                          alt={`${cv.name} profile`}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                          onError={(e) => {
                            // Fallback to initials if image fails to load
                            const target = e.target as HTMLImageElement
                            target.style.display = "none"
                            const fallback = target.nextElementSibling as HTMLDivElement
                            if (fallback) fallback.style.display = "flex"
                          }}
                        />
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold text-sm hidden flex-shrink-0">
                          {cv.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)}
                        </div>
                        {cv.gender && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-gray-200">
                            <span className="text-xs">{cv.gender === "male" ? "👨" : "👩"}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-lg truncate">{cv.name}</h4>
                        <p className="text-blue-600 font-medium text-sm truncate">{cv.role}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {cv.age && (
                            <Badge variant="outline" className="text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              {cv.age}y
                            </Badge>
                          )}
                          {cv.experienceYears && (
                            <Badge variant="outline" className="text-xs">
                              <Briefcase className="h-3 w-3 mr-1" />
                              {cv.experienceYears}y exp
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{cv.location}</span>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{cv.email}</span>
                      </div>

                      {cv.companies && cv.companies.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Experience at:</p>
                          <div className="flex flex-wrap gap-1">
                            {cv.companies.slice(0, 2).map((company, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {company}
                              </Badge>
                            ))}
                            {cv.companies.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{cv.companies.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {cv.skills && cv.skills.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Top skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {cv.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {cv.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{cv.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {cv.summary && (
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mt-2">{cv.summary}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePreview(cv.id)
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownload(cv.id, cv.name)
                        }}
                        disabled={downloadingId === cv.id}
                      >
                        {downloadingId === cv.id ? (
                          <>
                            <div className="animate-spin h-3 w-3 mr-1 border border-white border-t-transparent rounded-full" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CV Preview Dialog */}
      <Dialog open={!!previewCV} onOpenChange={() => setPreviewCV(null)}>
        <DialogContent className="max-w-6xl h-[95vh] p-0">
          <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              {previewCV && (
                <>
                  <Users className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold">Professional CV Preview</h3>
                    <p className="text-sm text-gray-600">High-quality professional resume</p>
                  </div>
                </>
              )}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {previewCV && (
                <Button
                  onClick={() => {
                    const cv = progress.generatedCVs.find((c) => c.id === previewCV)
                    if (cv) handleDownload(previewCV, cv.name)
                  }}
                  disabled={downloadingId === previewCV}
                  size="sm"
                >
                  {downloadingId === previewCV ? (
                    <>
                      <div className="animate-spin h-3 w-3 mr-2 border border-white border-t-transparent rounded-full" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-3 w-3 mr-2" />
                      Download
                    </>
                  )}
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setPreviewCV(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-auto bg-gray-100 p-4">
            {previewCV && <CVPreviewContent cvId={previewCV} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
