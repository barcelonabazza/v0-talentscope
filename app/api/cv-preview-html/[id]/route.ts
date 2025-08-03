import { type NextRequest, NextResponse } from "next/server"
import { getCVProfile } from "@/lib/cv-data"
import { generateCVHTML } from "@/lib/cv-layouts"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "CV ID is required" }, { status: 400 })
    }

    console.log(`Fetching CV preview for ID: ${id}`)

    // Get CV data from storage
    const cvData = getCVProfile(id)

    if (!cvData) {
      console.log(`CV not found: ${id}`)
      return NextResponse.json({ error: "CV not found" }, { status: 404 })
    }

    // Generate HTML preview
    const htmlContent = generateCVHTML(cvData)

    return new Response(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Error generating CV preview:", error)
    return NextResponse.json(
      {
        error: "Failed to generate CV preview",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
