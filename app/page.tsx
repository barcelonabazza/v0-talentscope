import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CVGenerator from "@/components/cv-generator"
import CVUploader from "@/components/cv-uploader"
import CVLibrarySimple from "@/components/cv-library-simple"
import ChatInterface from "@/components/chat-interface"
import SystemStatus from "@/components/system-status"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered CV Screening Tool</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate realistic  CVs, upload and analyze existing CVs, and use AI to screen candidates efficiently. Perfect for HR teams and recruiters.
          </p>
        </div>

        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="generate">Generate CVs</TabsTrigger>
            <TabsTrigger value="upload">Upload CVs</TabsTrigger>
            <TabsTrigger value="library">CV Library</TabsTrigger>
            <TabsTrigger value="chat">AI Chat</TabsTrigger>
            <TabsTrigger value="status">System Status</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="mt-6">
            <CVGenerator />
          </TabsContent>

          <TabsContent value="upload" className="mt-6">
            <CVUploader />
          </TabsContent>

          <TabsContent value="library" className="mt-6">
            <CVLibrarySimple />
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <ChatInterface />
          </TabsContent>

          <TabsContent value="status" className="mt-6">
            <SystemStatus />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
