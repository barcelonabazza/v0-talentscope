"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  FileText,
  Download,
  Eye,
  Trash2,
  Search,
  MapPin,
  Briefcase,
  GraduationCap,
  Loader2,
  X,
  Calendar,
} from "lucide-react"

interface LibraryCV {
  id: string
  name: string
  role: string
  experience?: string
  location?: string
  summary?: string
  companies?: string[]
  university?: string
  profileImageUrl?: string
  gender?: string
  type: "generated" | "uploaded"
  createdAt: string
  addedToLibrary?: string
}

// CV Preview Component
function CVPreviewContent({ cv }: { cv: LibraryCV }) {
  const [cvData, setCvData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCVData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/cv-preview-html/${cv.id}`)
        if (!response.ok) {
          throw new Error("Failed to load preview")
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

    if (cv.id) {
      fetchCVData()
    }
  }, [cv.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
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
            <X className="w-12 h-12 mx-auto mb-2" />
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
    </div>
  )
}

export default function CVLibrary() {
  const [cvs, setCvs] = useState<LibraryCV[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "generated" | "uploaded">("all")
  const [previewCV, setPreviewCV] = useState<LibraryCV | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    fetchCVs()
    // Set up interval to refresh CVs every 5 seconds to catch new uploads
    const interval = setInterval(fetchCVs, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchCVs = async () => {
    try {
      setLoading(true)
      console.log("Fetching CVs from library...")

      const response = await fetch("/api/cv-library")
      if (response.ok) {
        const data = await response.json()
        console.log("Received CV data:", data)
        setCvs(data.cvs || [])
        setDebugInfo(data.debug)
      } else {
        console.error("Failed to fetch CVs:", response.status, response.statusText)
      }
    } catch (error) {
      console.error("Error fetching CVs:", error)
    } finally {
      setLoading(false)
    }
  }

  // Add manual refresh button for debugging
  const handleManualRefresh = () => {
    console.log("Manual refresh triggered")
    fetchCVs()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this CV from the library?")) return

    try {
      const response = await fetch("/api/cv-library", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setCvs(cvs.filter((cv) => cv.id !== id))
      }
    } catch (error) {
      console.error("Error deleting CV:", error)
    }
  }

  const handleDownload = async (cv: LibraryCV) => {
    setDownloadingId(cv.id)

    try {
      const response = await fetch(`/api/download-cv/${cv.id}`)

      if (!response.ok) {
        throw new Error("Failed to download PDF")
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
      console.error("Error downloading PDF:", error)
      alert("Failed to download PDF. Please try again.")
    } finally {
      setDownloadingId(null)
    }
  }

  const filteredCVs = cvs.filter((cv) => {
    const matchesSearch =
      cv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cv.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cv.companies?.some((company) => company.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFilter = filterType === "all" || cv.type === filterType

    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading CV library...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">CV Library</h3>
            <p className="text-sm text-blue-800">
              All generated and uploaded CVs are stored here. You can search, filter, preview, and download any CV from
              your library.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleManualRefresh} variant="outline" size="sm">
              🔄 Refresh
            </Button>
            <Button onClick={() => window.open("/api/debug-library", "_blank")} variant="outline" size="sm">
              🐛 Debug
            </Button>
          </div>
        </div>
        {debugInfo && (
          <div className="mt-2 text-xs text-blue-700 bg-blue-100 p-2 rounded">
            <strong>Debug Info:</strong> {debugInfo.totalCVs} total CVs, {debugInfo.uploadedCount} uploaded,{" "}
            {debugInfo.generatedCount} generated
            <br />
            <strong>Types:</strong> {JSON.stringify(debugInfo.typeCounts)}
          </div>
        )}
      </div>

      {/* Add a test section if no CVs are found */}
      {!loading && cvs.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">No CVs Found</h3>
          <p className="text-sm text-yellow-800 mb-3">
            The CV library appears to be empty. This could indicate an issue with CV storage or retrieval.
          </p>
          <div className="flex gap-2">
            <Button onClick={handleManualRefresh} size="sm" variant="outline">
              Try Refresh
            </Button>
            <Button
              onClick={() => {
                // Add a test CV to verify the system works
                fetch("/api/test-add-cv", { method: "POST" })
                  .then(() => {
                    alert("Test CV added, refreshing...")
                    fetchCVs()
                  })
                  .catch((err) => alert("Test failed: " + err.message))
              }}
              size="sm"
              variant="outline"
            >
              Add Test CV
            </Button>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="search">Search CVs</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="search"
              placeholder="Search by name, role, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="filter">Filter by Type</Label>
          <select
            id="filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as "all" | "generated" | "uploaded")}
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All CVs</option>
            <option value="generated">Generated CVs</option>
            <option value="uploaded">Uploaded CVs</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{cvs.length}</div>
            <div className="text-sm text-gray-600">Total CVs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {cvs.filter((cv) => cv.type === "generated").length}
            </div>
            <div className="text-sm text-gray-600">Generated</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {cvs.filter((cv) => cv.type === "uploaded").length}
            </div>
            <div className="text-sm text-gray-600">Uploaded</div>
          </CardContent>
        </Card>
      </div>

      {/* CV Grid */}
      {filteredCVs.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No CVs Found</h3>
          <p className="text-gray-500">
            {searchTerm || filterType !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Generate or upload some CVs to get started."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            CV Library ({filteredCVs.length} {filteredCVs.length === 1 ? "CV" : "CVs"})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCVs.map((cv) => (
              <Card
                key={cv.id}
                className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
                onClick={() => setPreviewCV(cv)}
              >
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={cv.profileImageUrl || "/placeholder.svg"}
                      alt={`${cv.name} profile`}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        const fallback = target.nextElementSibling as HTMLDivElement
                        if (fallback) fallback.style.display = "flex"
                      }}
                    />
                    <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm hidden flex-shrink-0">
                      {cv.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-lg truncate">{cv.name}</h4>
                      <p className="text-blue-600 font-medium text-sm truncate">{cv.role}</p>
                      {cv.location && (
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{cv.location}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant={cv.type === "generated" ? "default" : "secondary"} className="flex-shrink-0">
                        {cv.type}
                      </Badge>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(cv.addedToLibrary || cv.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    {cv.experience && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Briefcase className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{cv.experience} experience</span>
                      </p>
                    )}

                    {cv.university && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{cv.university.split(" ")[0]}...</span>
                      </p>
                    )}

                    {cv.companies && cv.companies.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Experience at:</p>
                        <div className="flex flex-wrap gap-1">
                          {cv.companies.slice(0, 2).map((company, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {company}
                            </Badge>
                          ))}
                          {cv.companies.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{cv.companies.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {cv.summary && <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{cv.summary}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPreviewCV(cv)
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(cv)
                      }}
                      disabled={downloadingId === cv.id}
                    >
                      {downloadingId === cv.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(cv.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* CV Preview Dialog */}
      <Dialog open={!!previewCV} onOpenChange={() => setPreviewCV(null)}>
        <DialogContent className="max-w-6xl h-[95vh] p-0">
          <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              {previewCV && (
                <>
                  <img
                    src={previewCV.profileImageUrl || "/placeholder.svg"}
                    alt={`${previewCV.name} profile`}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  />
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
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </>
                  )}
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setPreviewCV(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-auto bg-gray-100 p-4">{previewCV && <CVPreviewContent cv={previewCV} />}</div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
