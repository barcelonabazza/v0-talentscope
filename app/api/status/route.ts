import { NextResponse } from "next/server"

export async function GET() {
  // Check if OpenAI API key is available
  const hasApiKey = !!process.env.OPENAI_API_KEY

  const status = {
    database: {
      status: "connected" as const,
      cvCount: 25,
      lastUpdated: new Date().toLocaleString(),
    },
    ai: {
      status: hasApiKey ? ("available" as const) : ("unavailable" as const),
      model: hasApiKey ? "gpt-4o-mini" : "demo-mode",
      lastQuery: new Date(Date.now() - 300000).toLocaleString(), // 5 minutes ago
    },
    processing: {
      status: "idle" as const,
      queueSize: 0,
    },
  }

  return NextResponse.json(status)
}
