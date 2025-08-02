import { NextResponse } from "next/server"
import { getLibraryStatus, getLibraryCVs } from "@/lib/cv-data"

export async function GET() {
  try {
    const status = getLibraryStatus()
    const cvs = getLibraryCVs()

    return NextResponse.json({
      status: "Library Debug Info",
      librarySize: status.size,
      totalCVs: cvs.length,
      cvSummary: cvs.map((cv) => ({
        id: cv.id,
        name: cv.name,
        type: cv.type,
        hasContent: !!cv.content,
        addedAt: cv.addedToLibrary || cv.createdAt,
      })),
      fullStatus: status,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
