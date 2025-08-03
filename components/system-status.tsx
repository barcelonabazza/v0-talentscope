"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Activity,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  FileText,
  Users,
  Clock,
} from "lucide-react"

interface SystemMetrics {
  status: "healthy" | "warning" | "error"
  uptime: string
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  activeConnections: number
  cvLibrarySize: number
  lastBackup: string
  apiResponseTime: number
  errorRate: number
}

interface ServiceStatus {
  name: string
  status: "online" | "offline" | "degraded"
  responseTime: number
  lastCheck: string
}

export default function SystemStatus() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    status: "healthy",
    uptime: "2d 14h 32m",
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 38,
    activeConnections: 127,
    cvLibrarySize: 1247,
    lastBackup: "2024-01-15 03:00:00",
    apiResponseTime: 145,
    errorRate: 0.02,
  })

  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: "CV Generator API",
      status: "online",
      responseTime: 120,
      lastCheck: "2024-01-15 10:30:00",
    },
    {
      name: "PDF Generation Service",
      status: "online",
      responseTime: 890,
      lastCheck: "2024-01-15 10:30:00",
    },
    {
      name: "File Upload Service",
      status: "online",
      responseTime: 67,
      lastCheck: "2024-01-15 10:30:00",
    },
    {
      name: "AI Chat Service",
      status: "degraded",
      responseTime: 2340,
      lastCheck: "2024-01-15 10:29:45",
    },
    {
      name: "Database Connection",
      status: "online",
      responseTime: 23,
      lastCheck: "2024-01-15 10:30:00",
    },
  ])

  const [loading, setLoading] = useState(false)

  const refreshStatus = async () => {
    setLoading(true)
    try {
      // Simulate API call to get system status
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock updated metrics
      setMetrics((prev) => ({
        ...prev,
        cpuUsage: Math.floor(Math.random() * 30) + 30,
        memoryUsage: Math.floor(Math.random() * 20) + 50,
        activeConnections: Math.floor(Math.random() * 50) + 100,
        apiResponseTime: Math.floor(Math.random() * 100) + 100,
      }))

      // Mock updated service status
      setServices((prev) =>
        prev.map((service) => ({
          ...service,
          responseTime: Math.floor(Math.random() * 500) + 50,
          lastCheck: new Date().toISOString().slice(0, 19).replace("T", " "),
        })),
      )
    } catch (error) {
      console.error("Error refreshing status:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
      case "offline":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "online":
        return "bg-green-500"
      case "warning":
      case "degraded":
        return "bg-yellow-500"
      case "error":
      case "offline":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshStatus()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Overall System Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Overview
              </CardTitle>
              <CardDescription>Real-time system health and performance metrics</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(metrics.status)}`}></div>
              <Badge variant={metrics.status === "healthy" ? "default" : "destructive"}>
                {metrics.status.toUpperCase()}
              </Badge>
              <Button variant="outline" size="sm" onClick={refreshStatus} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Uptime</span>
              </div>
              <p className="text-2xl font-bold">{metrics.uptime}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">CPU Usage</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{metrics.cpuUsage}%</p>
                <Progress value={metrics.cpuUsage} className="h-2" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Memory</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{metrics.memoryUsage}%</p>
                <Progress value={metrics.memoryUsage} className="h-2" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Connections</span>
              </div>
              <p className="text-2xl font-bold">{metrics.activeConnections}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Service Status
          </CardTitle>
          <CardDescription>Status of individual system components and APIs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(service.status)}
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-gray-600">
                      Last checked: {new Date(service.lastCheck).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      service.status === "online"
                        ? "default"
                        : service.status === "degraded"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {service.status}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">{service.responseTime}ms</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Application Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Application Metrics
          </CardTitle>
          <CardDescription>CV library and application-specific statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{metrics.cvLibrarySize}</p>
              <p className="text-sm text-gray-600">CVs in Library</p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{metrics.activeConnections}</p>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <Activity className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{metrics.apiResponseTime}ms</p>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{(metrics.errorRate * 100).toFixed(2)}%</p>
              <p className="text-sm text-gray-600">Error Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts and Notifications */}
      {metrics.status !== "healthy" && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            System is experiencing issues. Some services may be degraded. Please check individual service status above.
          </AlertDescription>
        </Alert>
      )}

      {metrics.errorRate > 0.05 && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            High error rate detected ({(metrics.errorRate * 100).toFixed(2)}%). System performance may be impacted.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
