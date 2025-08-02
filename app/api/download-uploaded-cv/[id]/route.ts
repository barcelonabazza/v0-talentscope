import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "CV ID is required" }, { status: 400 })
    }

    console.log("Downloading uploaded CV:", id)

    // Check if file exists
    const uploadsDir = path.join(process.cwd(), "uploads")
    const filePath = path.join(uploadsDir, `${id}.pdf`)

    try {
      await fs.access(filePath)
    } catch {
      return NextResponse.json({ error: "CV file not found" }, { status: 404 })
    }

    // Read the file
    const fileBuffer = await fs.readFile(filePath)

    // Get metadata for filename
    const metadataPath = path.join(uploadsDir, "metadata.json")
    let filename = `${id}.pdf`

    try {
      const metadataContent = await fs.readFile(metadataPath, "utf-8")
      const metadata = JSON.parse(metadataContent)
      const cvData = metadata.find((cv: any) => cv.id === id)
      if (cvData && cvData.name) {
        filename = `${cvData.name.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_")}_CV.pdf`
      }
    } catch (error) {
      console.log("Could not read metadata, using default filename")
    }

    // Return the PDF file
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("Error downloading uploaded CV:", error)
    return NextResponse.json({ error: "Failed to download CV" }, { status: 500 })
  }
}
