"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import CVGenerator from "@/components/cv-generator"
import CVUploader from "@/components/cv-uploader"
import CVLibrary from "@/components/cv-library"
import ChatInterface from "@/components/chat-interface"
import { Users, Upload, Database, MessageSquare, Sparkles } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState("generate")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Static Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">TalentScope</h1>
              </div>
              <Badge variant="secondary" className="text-xs">
                v2.0
              </Badge>
              <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                Demo
              </Badge>
            </div>
            <div className="text-sm text-gray-600">AI-Powered CV Screening & Generation Platform</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Professional CV Management Platform</h2>
          <p className="text-lg text-gray-600">
            Generate realistic Barcelona tech CVs, upload existing resumes, manage your CV library, and query candidates
            with AI-powered search.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Generate CVs
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload CVs
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              CV Library
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              AI Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  CV Generation
                </CardTitle>
                <CardDescription>
                  Generate realistic Barcelona tech professional CVs with AI-powered profiles, comprehensive experience
                  data, and modern design templates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CVGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  CV Upload & Processing
                </CardTitle>
                <CardDescription>
                  Upload existing CVs in PDF format for text extraction, data parsing, and integration into the
                  searchable database.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CVUploader />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  CV Library Management
                </CardTitle>
                <CardDescription>
                  Browse, search, and manage your collection of generated and uploaded CVs with advanced filtering and
                  preview capabilities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CVLibrary />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  AI-Powered CV Search
                </CardTitle>
                <CardDescription>
                  Query your CV database using natural language. Ask about specific skills, experience levels,
                  companies, or any other criteria to find matching candidates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatInterface />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
