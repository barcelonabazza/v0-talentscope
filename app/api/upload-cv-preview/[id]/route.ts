import { type NextRequest, NextResponse } from "next/server"
import { getCVById } from "@/lib/cv-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return new NextResponse("CV ID is required", { status: 400 })
    }

    // Get CV from library
    const cv = getCVById(id)

    if (!cv) {
      return new NextResponse("CV not found", { status: 404 })
    }

    // For uploaded CVs, we should have the PDF data stored
    if (cv.type === "uploaded" && cv.pdfData) {
      // Return the actual PDF data
      const pdfBuffer = Buffer.from(cv.pdfData, "base64")

      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${cv.name.replace(/\s+/g, "_")}_CV.pdf"`,
          "Cache-Control": "public, max-age=3600",
        },
      })
    }

    // If no PDF data available, return error
    return new NextResponse("PDF data not available for this CV", { status: 404 })
  } catch (error) {
    console.error("Error serving uploaded CV preview:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
