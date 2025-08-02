"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database, Upload, MessageSquare, FileText } from "lucide-react"

interface SystemStatus {
  database: "connected" | "disconnected" | "error"
  aiService: "available" | "unavailable" | "limited"
  pdfProcessing: "available" | "unavailable" | "error"
  fileStorage: "available" | "unavailable" | "error"
  cvLibrary: {
    status: "available" | "error"
    count: number
    lastUpdated: string
  }
  lastCheck: string
}

export default function SystemStatus() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkSystemStatus = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/status")
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setStatus(data)
    } catch (err) {
      console.error("Error checking system status:", err)
      setError(err instanceof Error ? err.message : "Failed to check system status")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkSystemStatus()
    // Check status every 30 seconds
    const interval = setInterval(checkSystemStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
      case "available":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "disconnected":
      case "unavailable":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "limited":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <XCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
      case "available":
        return "default"
      case "disconnected":
      case "unavailable":
        return "destructive"
      case "limited":
        return "secondary"
      default:
        return "destructive"
    }
  }

  if (loading && !status) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">System Status</h3>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm text-blue-800">Checking system status...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">System Status</h3>
          <p className="text-sm text-blue-800">Monitor the health and availability of all system components.</p>
        </div>

        <Alert>
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Status Check Failed:</strong> {error}
            <Button onClick={checkSystemStatus} variant="outline" size="sm" className="ml-2 bg-transparent">
              <RefreshCw className="w-4 h-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!status) {
    return null
  }

  const overallHealth =
    status.database === "connected" &&
    status.fileStorage === "available" &&
    status.pdfProcessing === "available" &&
    status.cvLibrary.status === "available"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">System Status</h3>
            <p className="text-sm text-blue-800">Monitor the health and availability of all system components.</p>
          </div>
          <Button onClick={checkSystemStatus} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {overallHealth ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <AlertCircle className="w-6 h-6 text-yellow-500" />
            )}
            Overall System Health
            <Badge variant={overallHealth ? "default" : "secondary"}>
              {overallHealth ? "Healthy" : "Issues Detected"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-2">Last checked: {new Date(status.lastCheck).toLocaleString()}</p>
          {!overallHealth && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Some system components are experiencing issues. Check individual service status below.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Individual Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Database */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(status.database)}
                <Badge variant={getStatusColor(status.database) as any}>{status.database}</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600">
              {status.database === "connected"
                ? "Database connection is healthy and responsive."
                : "Database connection issues detected."}
            </p>
          </CardContent>
        </Card>

        {/* AI Service */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                AI Service
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(status.aiService)}
                <Badge variant={getStatusColor(status.aiService) as any}>{status.aiService}</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600">
              {status.aiService === "available"
                ? "AI services are fully operational."
                : status.aiService === "limited"
                  ? "AI services available with limitations."
                  : "AI services are currently unavailable."}
            </p>
          </CardContent>
        </Card>

        {/* PDF Processing */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                PDF Processing
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(status.pdfProcessing)}
                <Badge variant={getStatusColor(status.pdfProcessing) as any}>{status.pdfProcessing}</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600">
              {status.pdfProcessing === "available"
                ? "PDF text extraction and processing is working correctly."
                : "PDF processing services are experiencing issues."}
            </p>
          </CardContent>
        </Card>

        {/* File Storage */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                File Storage
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(status.fileStorage)}
                <Badge variant={getStatusColor(status.fileStorage) as any}>{status.fileStorage}</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600">
              {status.fileStorage === "available"
                ? "File upload and storage systems are operational."
                : "File storage systems are experiencing issues."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CV Library Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              CV Library
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.cvLibrary.status)}
              <Badge variant={getStatusColor(status.cvLibrary.status) as any}>{status.cvLibrary.status}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Total CVs</p>
              <p className="text-2xl font-bold text-blue-600">{status.cvLibrary.count}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Last Updated</p>
              <p className="text-sm text-gray-600">{new Date(status.cvLibrary.lastUpdated).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
