import { NextResponse } from "next/server"
import { generateCVData } from "@/lib/cv-data"

export async function POST() {
  try {
    console.log("Adding test CV to library")

    // Generate a test CV with a unique ID
    const testId = `test-cv-${Date.now()}`
    const testCV = generateCVData(testId)

    console.log(`Generated test CV: ${testCV.name} (${testCV.id})`)

    return NextResponse.json({
      success: true,
      cv: {
        id: testCV.id,
        name: testCV.name,
        role: testCV.role,
        email: testCV.email,
      },
    })
  } catch (error) {
    console.error("Error adding test CV:", error)
    return NextResponse.json(
      {
        error: "Failed to add test CV",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
