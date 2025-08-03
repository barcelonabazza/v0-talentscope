import { type NextRequest, NextResponse } from "next/server"
import { getAllCVs, deleteCVProfile } from "@/lib/cv-data"
import { cvStorage } from "./generate-cvs/route"

export async function GET() {
  try {
    // Get CVs from both sources
    const libraryCVs = getAllCVs()
    const generatedCVs = Array.from(cvStorage.values())

    // Combine and deduplicate
    const allCVs = [...libraryCVs, ...generatedCVs]
    const uniqueCVs = allCVs.filter((cv, index, self) => index === self.findIndex((c) => c.id === cv.id))

    console.log(`Retrieved ${uniqueCVs.length} CVs from library`)

    return NextResponse.json({
      success: true,
      cvs: uniqueCVs,
      total: uniqueCVs.length,
      debug: {
        totalCVs: uniqueCVs.length,
        uploadedCount: uniqueCVs.filter((cv) => cv.type === "uploaded").length,
        generatedCount: uniqueCVs.filter((cv) => cv.type === "generated").length,
        typeCounts: uniqueCVs.reduce(
          (acc, cv) => {
            acc[cv.type || "unknown"] = (acc[cv.type || "unknown"] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ),
      },
    })
  } catch (error) {
    console.error("Error fetching CV library:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch CV library",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "CV ID is required" }, { status: 400 })
    }

    // Try to delete from both storages
    const deletedFromLibrary = deleteCVProfile(id)
    const deletedFromGenerated = cvStorage.delete(id)

    if (deletedFromLibrary || deletedFromGenerated) {
      console.log(`Deleted CV: ${id}`)
      return NextResponse.json({ success: true, message: "CV deleted successfully" })
    } else {
      return NextResponse.json({ error: "CV not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error deleting CV:", error)
    return NextResponse.json(
      {
        error: "Failed to delete CV",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
