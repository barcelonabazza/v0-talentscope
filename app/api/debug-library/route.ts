import { NextResponse } from "next/server"
import { getAllCVs } from "@/lib/cv-data"

export async function GET() {
  try {
    const cvs = getAllCVs()

    return NextResponse.json({
      message: "Debug CV Library",
      totalCVs: cvs.length,
      cvs: cvs.map((cv) => ({
        id: cv.id,
        name: cv.name,
        role: cv.role,
        hasProfileImage: !!cv.profileImageUrl,
        skillsCount: cv.skills?.length || 0,
        experienceCount: cv.experience?.length || 0,
        educationCount: cv.education?.length || 0,
      })),
      storageKeys: cvs.map((cv) => cv.id),
    })
  } catch (error) {
    console.error("Error in debug-library route:", error)
    return NextResponse.json(
      {
        error: "Failed to debug library",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
