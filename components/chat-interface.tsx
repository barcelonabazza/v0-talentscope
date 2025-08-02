"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: string[]
  timestamp: Date
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        'Hello! I\'m your AI HR assistant. I can help you find information about candidates from the CV database. Try asking questions like "Who has Python experience?" or "Which candidates graduated from MIT?"',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.isApiKeyError) {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content:
              "🔑 **API Key Required**\n\nTo use the full AI capabilities, you need to add your OpenAI API key:\n\n1. Get a free API key from [OpenAI](https://platform.openai.com/api-keys)\n2. Add it as `OPENAI_API_KEY` environment variable\n3. Restart the application\n\nFor now, I'll provide demo responses based on the CV database.",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, errorMessage])
          return
        }
        throw new Error(data.error || "Failed to get response")
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        sources: data.sources,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I encountered an error while processing your request. Please make sure the system is properly configured.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const sampleQuestions = [
    "Who has experience with Python?",
    "Which candidates have a Master's degree?",
    "Show me candidates with more than 5 years of experience",
    "Who worked at Google or Microsoft?",
    "Which candidates speak multiple languages?",
  ]

  return (
    <div className="space-y-4">
      {/* Sample Questions */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Try these sample questions:</h3>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((question, index) => (
            <Button key={index} variant="outline" size="sm" onClick={() => setInput(question)} className="text-xs">
              {question}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {message.role === "user" ? "👤" : "🤖"}
              </div>
              <Card className={`${message.role === "user" ? "bg-blue-500 text-white" : "bg-white"}`}>
                <CardContent className="p-3">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Sources:</p>
                      <div className="flex flex-wrap gap-1">
                        {message.sources.map((source, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            📄 {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">🤖</div>
            <Card className="bg-white">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="animate-spin text-lg">⏳</div>
                  <p className="text-sm text-gray-500">Thinking...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the CVs..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          📤
        </Button>
      </form>
    </div>
  )
}
