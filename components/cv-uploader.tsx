"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface UploadedFile {
  id: string
  name: string
  size: number
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  error?: string
  cvData?: any
  downloadUrl?: string
}

// CV Preview Component for uploaded CVs - Fixed to handle data properly
function CVPreviewContent({ file }: { file: UploadedFile }) {
  if (!file.cvData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-gray-500 mb-4">
            <div className="text-6xl mb-2">📄</div>
            <p className="font-semibold">No Preview Available</p>
          </div>
          <p className="text-gray-600">This CV doesn't have preview data available.</p>
        </div>
      </div>
    )
  }

  const cvData = file.cvData

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "250px 1fr",
          minHeight: "600px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          lineHeight: "1.6",
          color: "#2c3e50",
          background: "white",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {/* Left Sidebar */}
        <div
          style={{
            background: "#ecf0f1",
            padding: "30px 20px",
          }}
        >
          {/* Profile Photo */}
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "#3498db",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "36px",
                fontWeight: "bold",
                margin: "0 auto 20px",
              }}
            >
              {cvData.name
                ? cvData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                : "CV"}
            </div>
          </div>

          {/* Contact Section */}
          <div style={{ marginBottom: "30px" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#2c3e50",
                marginBottom: "15px",
                paddingBottom: "5px",
                borderBottom: "2px solid #3498db",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Contact
            </h2>
            <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
              {cvData.email && (
                <div style={{ marginBottom: "8px", wordBreak: "break-all" }}>
                  <strong style={{ color: "#2c3e50" }}>Email:</strong>
                  <br />
                  {cvData.email}
                </div>
              )}
              {cvData.phone && (
                <div style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "#2c3e50" }}>Phone:</strong>
                  <br />
                  {cvData.phone}
                </div>
              )}
              {cvData.location && (
                <div style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "#2c3e50" }}>Location:</strong>
                  <br />
                  {cvData.location}
                </div>
              )}
            </div>
          </div>

          {/* Skills Section */}
          {cvData.skills && Array.isArray(cvData.skills) && cvData.skills.length > 0 && (
            <div style={{ marginBottom: "30px" }}>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#2c3e50",
                  marginBottom: "15px",
                  paddingBottom: "5px",
                  borderBottom: "2px solid #3498db",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Skills
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {cvData.skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      background: "#2c3e50",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div style={{ padding: "30px" }}>
          {/* Header */}
          <div style={{ marginBottom: "30px" }}>
            <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "10px", color: "#2c3e50" }}>
              {cvData.name || "Uploaded CV"}
            </h1>
            {cvData.role && <p style={{ fontSize: "18px", color: "#34495e", marginBottom: "20px" }}>{cvData.role}</p>}
          </div>

          {/* Professional Summary */}
          {cvData.summary && (
            <div style={{ marginBottom: "30px" }}>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#2c3e50",
                  marginBottom: "15px",
                  paddingBottom: "5px",
                  borderBottom: "2px solid #3498db",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Professional Summary
              </h2>
              <p style={{ lineHeight: "1.6", color: "#2c3e50" }}>{cvData.summary}</p>
            </div>
          )}

          {/* Experience */}
          {cvData.experience && Array.isArray(cvData.experience) && cvData.experience.length > 0 && (
            <div style={{ marginBottom: "30px" }}>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#2c3e50",
                  marginBottom: "15px",
                  paddingBottom: "5px",
                  borderBottom: "2px solid #3498db",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Work Experience
              </h2>
              {cvData.experience.map((job, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "25px",
                    paddingBottom: "20px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#2c3e50",
                      marginBottom: "5px",
                    }}
                  >
                    {job.position || job.title || "Position"}
                  </h3>
                  <p
                    style={{
                      color: "#34495e",
                      fontWeight: "500",
                      marginBottom: "10px",
                      fontSize: "14px",
                    }}
                  >
                    {job.company || "Company"} | {job.duration || job.period || "Duration"}
                  </p>
                  {job.description && (
                    <p
                      style={{
                        color: "#666",
                        lineHeight: "1.6",
                        fontSize: "14px",
                      }}
                    >
                      {job.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {cvData.education && Array.isArray(cvData.education) && cvData.education.length > 0 && (
            <div style={{ marginBottom: "30px" }}>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#2c3e50",
                  marginBottom: "15px",
                  paddingBottom: "5px",
                  borderBottom: "2px solid #3498db",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Education
              </h2>
              {cvData.education.map((edu, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#2c3e50",
                      marginBottom: "5px",
                    }}
                  >
                    {edu.degree || edu.qualification || "Degree"}
                  </h3>
                  <p
                    style={{
                      color: "#34495e",
                      fontWeight: "500",
                      marginBottom: "8px",
                      fontSize: "14px",
                    }}
                  >
                    {edu.school || edu.institution || "Institution"} | {edu.year || edu.period || "Year"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CVUploader() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => file.type === "application/pdf")

    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles)
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    handleFiles(selectedFiles)
  }

  const handleFiles = async (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map((file) => ({
      id: `upload-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      status: "uploading",
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Process each file
    for (const [index, file] of fileList.entries()) {
      const fileId = newFiles[index].id

      try {
        const formData = new FormData()
        formData.append("file", file)

        // Update progress to processing
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "processing", progress: 50 } : f)))

        const response = await fetch("/api/upload-cv", {
          method: "POST",
          body: formData,
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Upload failed")
        }

        // Complete with CV data
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  status: "completed",
                  progress: 100,
                  cvData: result.cvData,
                  downloadUrl: result.downloadUrl,
                }
              : f,
          ),
        )
      } catch (error) {
        console.error("Upload error:", error)
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  status: "error",
                  error: error.message || "Upload failed",
                }
              : f,
          ),
        )
      }
    }
  }

  const handleDownload = async (file: UploadedFile) => {
    if (!file.downloadUrl) return

    setDownloadingId(file.id)

    try {
      const response = await fetch(file.downloadUrl)

      if (!response.ok) {
        throw new Error("Failed to download PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `${file.name}`
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-900 mb-2">CV Upload & Processing</h3>
        <p className="text-sm text-green-800">
          Upload PDF CVs to extract text content, add them to the searchable database, and make them available in the CV
          Library. All uploaded CVs are automatically processed and can be queried via the Chat Interface.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-6xl mb-4">📤</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Upload CV Files</h3>
        <p className="text-gray-600 mb-4">Drag and drop PDF files here, or click to select files</p>
        <input type="file" multiple accept=".pdf" onChange={handleFileInput} className="hidden" id="file-upload" />
        <Button asChild>
          <label htmlFor="file-upload" className="cursor-pointer">
            Select Files
          </label>
        </Button>
        <p className="text-xs text-gray-500 mt-2">Only PDF files are supported</p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Uploaded Files ({files.length})</h3>
          <div className="space-y-2">
            {files.map((file) => (
              <Card key={file.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">📄</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.status === "uploading" || file.status === "processing" ? (
                        <div className="animate-spin text-xl">⏳</div>
                      ) : file.status === "completed" ? (
                        <div className="text-green-500 text-xl">✅</div>
                      ) : (
                        <div className="text-red-500 text-xl">❌</div>
                      )}
                      <Badge
                        variant={
                          file.status === "completed"
                            ? "default"
                            : file.status === "error"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {file.status}
                      </Badge>
                    </div>
                  </div>

                  {(file.status === "uploading" || file.status === "processing") && (
                    <Progress value={file.progress} className="w-full mb-2" />
                  )}

                  {file.error && <p className="text-sm text-red-600 mb-2">{file.error}</p>}

                  {file.status === "completed" && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" onClick={() => setPreviewFile(file)} className="flex-1">
                        👁️ Preview
                      </Button>
                      {file.downloadUrl && (
                        <Button
                          size="sm"
                          onClick={() => handleDownload(file)}
                          disabled={downloadingId === file.id}
                          className="flex-1"
                        >
                          {downloadingId === file.id ? (
                            <>
                              <span className="animate-spin mr-2">⏳</span>
                              Downloading...
                            </>
                          ) : (
                            <>📥 Download</>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* CV Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-6xl h-[95vh] p-0">
          <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              {previewFile && (
                <>
                  <div className="text-2xl">📄</div>
                  <div>
                    <h3 className="font-semibold">{previewFile.cvData?.name || previewFile.name}</h3>
                    <p className="text-sm text-gray-600">{previewFile.cvData?.role || "Uploaded CV"}</p>
                  </div>
                  <Badge variant="secondary">uploaded</Badge>
                </>
              )}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {previewFile && previewFile.downloadUrl && (
                <Button
                  onClick={() => handleDownload(previewFile)}
                  disabled={downloadingId === previewFile.id}
                  size="sm"
                >
                  {downloadingId === previewFile.id ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Downloading...
                    </>
                  ) : (
                    <>📥 Download PDF</>
                  )}
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setPreviewFile(null)}>
                ❌
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-auto bg-gray-100 p-4">
            {previewFile && <CVPreviewContent file={previewFile} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
