import { type NextRequest, NextResponse } from "next/server"
import { getLibraryCVs, getLibraryStatus, deleteCVFromLibrary } from "@/lib/cv-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeStats = searchParams.get("stats") === "true"

    const cvs = getLibraryCVs()
    const response: any = { cvs }

    if (includeStats) {
      response.stats = getLibraryStatus()
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching CV library:", error)
    return NextResponse.json({ error: "Failed to fetch CV library" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "CV ID is required" }, { status: 400 })
    }

    const deleted = deleteCVFromLibrary(id)

    if (!deleted) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "CV deleted successfully" })
  } catch (error) {
    console.error("Error deleting CV:", error)
    return NextResponse.json({ error: "Failed to delete CV" }, { status: 500 })
  }
}
