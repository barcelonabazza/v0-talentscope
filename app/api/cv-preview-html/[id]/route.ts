import { type NextRequest, NextResponse } from "next/server"
import { getCVProfile, generateCVData } from "@/lib/cv-data"
import { generateCVHTML } from "@/lib/cv-layouts"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "CV ID is required" }, { status: 400 })
    }

    console.log(`Fetching CV preview for ID: ${id}`)

    // Try to get CV from storage first
    let cv = getCVProfile(id)

    // If not found, generate it
    if (!cv) {
      console.log(`CV not found in storage, generating new CV for ID: ${id}`)
      cv = generateCVData(id)
    }

    if (!cv) {
      console.log(`Failed to generate CV for ID: ${id}`)
      return NextResponse.json({ error: "CV not found" }, { status: 404 })
    }

    console.log(`Generating HTML preview for CV: ${cv.name}`)

    // Generate HTML
    const htmlContent = generateCVHTML(cv)

    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Error in cv-preview-html route:", error)
    return NextResponse.json(
      {
        error: "Failed to generate CV preview",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
