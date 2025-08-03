"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FileText,
  Search,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  Users,
  Briefcase,
  MapPin,
  Mail,
  Calendar,
  X,
  Plus,
} from "lucide-react"

interface CVProfile {
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

interface CVLibraryResponse {
  cvs: CVProfile[]
  total: number
}

// CV Preview Component
function CVPreviewContent({ cvId }: { cvId: string }) {
  const [cvData, setCvData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  React.useEffect(() => {
    const fetchCVData = async () => {
      try {
        setLoading(true)
        setError(null)

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

export default function CVLibrary() {
  const [cvs, setCvs] = useState<CVProfile[]>([])
  const [filteredCvs, setFilteredCvs] = useState<CVProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [previewCV, setPreviewCV] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchCVs = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/cv-library")
      if (!response.ok) {
        throw new Error(`Failed to fetch CVs: ${response.status}`)
      }

      const data: CVLibraryResponse = await response.json()
      setCvs(data.cvs)
      setFilteredCvs(data.cvs)
    } catch (err) {
      console.error("Error fetching CVs:", err)
      setError("Failed to load CV library")
    } finally {
      setLoading(false)
    }
  }

  const addTestCV = async () => {
    try {
      const response = await fetch("/api/test-add-cv", { method: "POST" })
      if (!response.ok) {
        throw new Error("Failed to add test CV")
      }
      await fetchCVs() // Refresh the list
    } catch (err) {
      console.error("Error adding test CV:", err)
      setError("Failed to add test CV")
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (!term.trim()) {
      setFilteredCvs(cvs)
    } else {
      const filtered = cvs.filter(
        (cv) =>
          cv.name.toLowerCase().includes(term.toLowerCase()) ||
          cv.role.toLowerCase().includes(term.toLowerCase()) ||
          cv.email.toLowerCase().includes(term.toLowerCase()) ||
          cv.skills?.some((skill) => skill.toLowerCase().includes(term.toLowerCase())) ||
          cv.companies?.some((company) => company.toLowerCase().includes(term.toLowerCase())),
      )
      setFilteredCvs(filtered)
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
      a.download = `${cvName.replace(/\s+/g, "_")}_CV.pdf`

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

  const handleDelete = async (cvId: string) => {
    if (!confirm("Are you sure you want to delete this CV?")) {
      return
    }

    setDeletingId(cvId)
    try {
      const response = await fetch(`/api/cv-library?id=${cvId}`, { method: "DELETE" })
      if (!response.ok) {
        throw new Error("Failed to delete CV")
      }
      await fetchCVs() // Refresh the list
    } catch (err) {
      console.error("Error deleting CV:", err)
      setError("Failed to delete CV")
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    fetchCVs()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            CV Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4">⏳</div>
              <p className="text-gray-600">Loading CV library...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            CV Library ({filteredCvs.length})
          </CardTitle>
          <CardDescription>
            Browse, search, and manage your collection of professional CVs with realistic Barcelona tech profiles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, role, skills, or company..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={fetchCVs} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={addTestCV} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Test CV
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {filteredCvs.length === 0 && !loading && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No CVs Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "No CVs match your search criteria." : "Your CV library is empty."}
              </p>
              {!searchTerm && (
                <Button onClick={addTestCV} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Test CV
                </Button>
              )}
            </div>
          )}

          {filteredCvs.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCvs.map((cv) => (
                <Card key={cv.id} className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                  <CardContent className="p-4 flex flex-col h-full">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="relative">
                        <img
                          src={cv.profileImageUrl || "/placeholder.svg?height=48&width=48"}
                          alt={`${cv.name} profile`}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                          onError={(e) => {
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

                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePreview(cv.id)
                        }}
                      >
                        <Eye className="h-3 w-3" />
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
                          <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full" />
                        ) : (
                          <Download className="h-3 w-3" />
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
                        disabled={deletingId === cv.id}
                      >
                        {deletingId === cv.id ? (
                          <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
                    const cv = filteredCvs.find((c) => c.id === previewCV)
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
