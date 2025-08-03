import { type NextRequest, NextResponse } from "next/server"
import { getCVProfile } from "@/lib/cv-data"
import { generateCVHTML as generateCVHTMLFromLib } from "@/lib/cv-layouts"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "CV ID is required" }, { status: 400 })
    }

    console.log(`Downloading CV for ID: ${id}`)

    // Get CV data from storage
    const cvData = getCVProfile(id)

    if (!cvData) {
      console.log(`CV not found for download: ${id}`)
      return NextResponse.json({ error: "CV not found" }, { status: 404 })
    }

    // Generate HTML content
    const htmlContent = generateCVHTMLFromLib(cvData)

    // For now, return HTML file (you can implement PDF generation later)
    const fileName = `${cvData.name.replace(/\s+/g, "_")}_CV.html`

    return new Response(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Error downloading CV:", error)
    return NextResponse.json(
      {
        error: "Failed to download CV",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
