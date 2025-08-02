import { type NextRequest, NextResponse } from "next/server"
import { getCVLibrary, addCVToLibrary, deleteCVFromLibrary } from "@/lib/cv-data"

export async function GET() {
  try {
    const library = getCVLibrary()
    console.log(`Returning ${library.length} CVs from library`)
    return NextResponse.json({ cvs: library })
  } catch (error) {
    console.error("Error fetching CV library:", error)
    return NextResponse.json({ error: "Failed to fetch CV library" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cvData = await request.json()
    console.log(`Adding CV to library: ${cvData.name}`)
    addCVToLibrary(cvData)
    return NextResponse.json({ success: true, message: "CV added to library" })
  } catch (error) {
    console.error("Error adding CV to library:", error)
    return NextResponse.json({ error: "Failed to add CV to library" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "CV ID is required" }, { status: 400 })
    }

    console.log(`Deleting CV from library: ${id}`)
    const success = deleteCVFromLibrary(id)

    if (!success) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "CV deleted from library" })
  } catch (error) {
    console.error("Error deleting CV from library:", error)
    return NextResponse.json({ error: "Failed to delete CV from library" }, { status: 500 })
  }
}
