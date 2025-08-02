"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Key, ExternalLink, CheckCircle, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"

export default function SetupInstructions() {
  // Check if we're in the browser to avoid hydration issues
  const [hasApiKey, setHasApiKey] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check API key status by making a test request
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        setHasApiKey(data.ai?.status === "available")
      })
      .catch(() => setHasApiKey(false))
  }, [])

  if (!isClient) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Alert className={hasApiKey ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
        <div className="flex items-center gap-2">
          {hasApiKey ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
          )}
          <AlertDescription className={hasApiKey ? "text-green-800" : "text-yellow-800"}>
            {hasApiKey
              ? "✅ OpenAI API key is configured. Full AI capabilities are available."
              : "⚠️ OpenAI API key is missing or invalid. The app will use demo responses."}
          </AlertDescription>
        </div>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Key Setup
          </CardTitle>
          <CardDescription>
            Configure your OpenAI API key to enable full AI-powered CV screening capabilities.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">
                1
              </Badge>
              <div>
                <p className="font-medium">Get an OpenAI API Key</p>
                <p className="text-sm text-gray-600">
                  Visit{" "}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    OpenAI Platform <ExternalLink className="w-3 h-3" />
                  </a>{" "}
                  to create a free API key
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">
                2
              </Badge>
              <div>
                <p className="font-medium">Add Environment Variable</p>
                <p className="text-sm text-gray-600 mb-2">Add your API key as an environment variable:</p>
                <code className="block bg-gray-100 p-2 rounded text-sm">OPENAI_API_KEY=your_api_key_here</code>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">
                3
              </Badge>
              <div>
                <p className="font-medium">Restart the Application</p>
                <p className="text-sm text-gray-600">
                  Restart your development server to load the new environment variable
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Alternative: Free API Options</h4>
            <p className="text-sm text-gray-600 mb-2">You can also use free API keys from:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                •{" "}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google AI Studio
                </a>{" "}
                (free with limited use)
              </li>
              <li>
                •{" "}
                <a
                  href="https://openrouter.ai/settings/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  OpenRouter
                </a>{" "}
                (many models are free)
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Demo Mode Features</CardTitle>
          <CardDescription>
            Even without an API key, you can still explore the application with these features:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Search CV database with keyword matching
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Generate mock CV profiles
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Upload and process PDF files
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              View system status and statistics
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
