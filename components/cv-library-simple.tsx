"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CV {
  id: string
  name: string
  role: string
  email: string
  phone: string
  location: string
  skills: string[]
  experience: any[]
  education: any[]
  summary: string
  profileImageUrl?: string
  type: "generated" | "uploaded"
  createdAt: string
  template?: string
}

// PDF Preview Component for uploaded CVs
function PDFPreviewContent({ cvId }: { cvId: string }) {
  return (
    <div className="w-full h-full bg-gray-100">
      <iframe
        src={`/api/upload-cv-preview/${cvId}`}
        className="w-full h-full border-none"
        title="CV Preview"
        style={{ minHeight: "600px" }}
      />
    </div>
  )
}

// HTML Preview Component for generated CVs
function HTMLPreviewContent({ cvId }: { cvId: string }) {
  return (
    <div className="w-full h-full bg-gray-100">
      <iframe
        src={`/api/cv-preview-html/${cvId}`}
        className="w-full h-full border-none"
        title="CV Preview"
        style={{ minHeight: "600px" }}
      />
    </div>
  )
}

export default function CVLibrarySimple() {
  const [cvs, setCvs] = useState<CV[]>([])
  const [filteredCvs, setFilteredCvs] = useState<CV[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<"all" | "generated" | "uploaded">("all")
  const [loading, setLoading] = useState(true)
  const [previewCV, setPreviewCV] = useState<CV | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const fetchCVs = async () => {
    try {
      const response = await fetch("/api/cv-library")
      if (response.ok) {
        const data = await response.json()
        setCvs(data.cvs || [])
      }
    } catch (error) {
      console.error("Error fetching CVs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCVs()

    // Auto-refresh every 5 seconds to pick up new CVs
    const interval = setInterval(fetchCVs, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let filtered = cvs

    if (selectedType !== "all") {
      filtered = filtered.filter((cv) => cv.type === selectedType)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (cv) =>
          cv.name.toLowerCase().includes(term) ||
          cv.role.toLowerCase().includes(term) ||
          cv.email.toLowerCase().includes(term) ||
          cv.location.toLowerCase().includes(term) ||
          cv.skills.some((skill) => skill.toLowerCase().includes(term)),
      )
    }

    setFilteredCvs(filtered)
  }, [cvs, searchTerm, selectedType])

  const handleDownload = async (cv: CV) => {
    setDownloadingId(cv.id)

    try {
      const downloadUrl = cv.type === "uploaded" ? `/api/upload-cv-pdf/${cv.id}` : `/api/download-cv/${cv.id}`

      const response = await fetch(downloadUrl)

      if (!response.ok) {
        throw new Error("Failed to download CV")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `${cv.name.replace(/\s+/g, "_")}_CV.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading CV:", error)
      alert("Failed to download CV. Please try again.")
    } finally {
      setDownloadingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading CV Library...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search CVs by name, role, email, location, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedType === "all" ? "default" : "outline"}
            onClick={() => setSelectedType("all")}
            size="sm"
          >
            All ({cvs.length})
          </Button>
          <Button
            variant={selectedType === "generated" ? "default" : "outline"}
            onClick={() => setSelectedType("generated")}
            size="sm"
          >
            Generated ({cvs.filter((cv) => cv.type === "generated").length})
          </Button>
          <Button
            variant={selectedType === "uploaded" ? "default" : "outline"}
            onClick={() => setSelectedType("uploaded")}
            size="sm"
          >
            Uploaded ({cvs.filter((cv) => cv.type === "uploaded").length})
          </Button>
        </div>
      </div>

      {/* CV Grid */}
      {filteredCvs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No CVs Found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedType !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Generate some CVs or upload PDF files to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCvs.map((cv) => (
            <Card key={cv.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0">
                    {cv.profileImageUrl ? (
                      <img
                        src={cv.profileImageUrl || "/placeholder.svg"}
                        alt={cv.name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          target.nextElementSibling?.classList.remove("hidden")
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm ${
                        cv.profileImageUrl ? "hidden" : ""
                      }`}
                    >
                      {cv.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{cv.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{cv.role}</p>
                    <p className="text-xs text-gray-500 truncate">{cv.location}</p>
                  </div>
                  <Badge variant={cv.type === "generated" ? "default" : "secondary"} className="text-xs">
                    {cv.type}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex flex-wrap gap-1">
                    {cv.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {cv.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{cv.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{cv.summary}</p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setPreviewCV(cv)} className="flex-1">
                    👁️ Preview
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDownload(cv)}
                    disabled={downloadingId === cv.id}
                    className="flex-1"
                  >
                    {downloadingId === cv.id ? (
                      <>
                        <span className="animate-spin mr-1">⏳</span>
                        Downloading...
                      </>
                    ) : (
                      <>📥 Download</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* CV Preview Dialog */}
      <Dialog open={!!previewCV} onOpenChange={() => setPreviewCV(null)}>
        <DialogContent className="max-w-6xl h-[95vh] p-0">
          <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              {previewCV && (
                <>
                  <div className="flex-shrink-0">
                    {previewCV.profileImageUrl ? (
                      <img
                        src={previewCV.profileImageUrl || "/placeholder.svg"}
                        alt={previewCV.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          target.nextElementSibling?.classList.remove("hidden")
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm ${
                        previewCV.profileImageUrl ? "hidden" : ""
                      }`}
                    >
                      {previewCV.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{previewCV.name}</h3>
                    <p className="text-sm text-gray-600">{previewCV.role}</p>
                  </div>
                  <Badge variant={previewCV.type === "generated" ? "default" : "secondary"}>{previewCV.type}</Badge>
                </>
              )}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {previewCV && (
                <Button onClick={() => handleDownload(previewCV)} disabled={downloadingId === previewCV.id} size="sm">
                  {downloadingId === previewCV.id ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Downloading...
                    </>
                  ) : (
                    <>📥 Download PDF</>
                  )}
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setPreviewCV(null)}>
                ❌
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {previewCV &&
              (previewCV.type === "uploaded" ? (
                <PDFPreviewContent cvId={previewCV.id} />
              ) : (
                <HTMLPreviewContent cvId={previewCV.id} />
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
