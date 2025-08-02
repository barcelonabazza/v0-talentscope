import { NextResponse } from "next/server"
import { addToLibrary } from "@/lib/cv-data"

export async function POST() {
  try {
    const testCV = {
      id: `test-${Date.now()}`,
      name: "Test User",
      role: "Test Role",
      email: "test@example.com",
      phone: "+1-555-0123",
      location: "Test Location",
      summary: "This is a test CV to verify the library system is working.",
      skills: ["Testing", "Debugging", "Problem Solving"],
      experience: [
        {
          position: "Test Position",
          company: "Test Company",
          duration: "2020-2023",
          location: "Test Location",
          description: "Test responsibilities and achievements.",
        },
      ],
      education: [
        {
          degree: "Test Degree",
          school: "Test University",
          year: "2020",
          details: "Test education details",
        },
      ],
      languages: ["English"],
      type: "uploaded",
      content: "Test CV content for search functionality",
      createdAt: new Date().toISOString(),
      uploadedAt: new Date().toISOString(),
    }

    addToLibrary(testCV)

    return NextResponse.json({
      success: true,
      message: "Test CV added to library",
      cvId: testCV.id,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 },
    )
  }
}
