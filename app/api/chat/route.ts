import { type NextRequest, NextResponse } from "next/server"
import { getAllCVs } from "@/lib/cv-data"
import { cvStorage } from "./generate-cvs/route"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    console.log("Processing chat message:", message)

    // Get all CVs from both sources
    const libraryCVs = getAllCVs()
    const generatedCVs = Array.from(cvStorage.values())
    const allCVs = [...libraryCVs, ...generatedCVs]

    // Simple keyword matching for demo purposes
    const keywords = message.toLowerCase().split(" ")
    const matchingCVs = allCVs.filter((cv) => {
      const searchText =
        `${cv.name} ${cv.role} ${cv.skills?.join(" ") || ""} ${cv.companies?.join(" ") || ""} ${cv.summary || ""}`.toLowerCase()
      return keywords.some((keyword) => searchText.includes(keyword))
    })

    // Generate response based on query type
    let response = ""
    let suggestions = []

    if (keywords.some((k) => ["react", "javascript", "frontend", "js"].includes(k))) {
      const reactDevs = matchingCVs.filter(
        (cv) =>
          cv.skills?.some((skill) => skill.toLowerCase().includes("react")) ||
          cv.role?.toLowerCase().includes("frontend"),
      )

      response = `I found ${reactDevs.length} React/Frontend developers in the database. Here are some highlights:\n\n`

      reactDevs.slice(0, 3).forEach((cv, index) => {
        response += `${index + 1}. **${cv.name}** - ${cv.role}\n`
        response += `   Skills: ${cv.skills?.slice(0, 5).join(", ") || "N/A"}\n`
        response += `   Experience: ${cv.experienceYears || "N/A"} years\n\n`
      })

      suggestions = [
        "Show me Python developers",
        "Find senior engineers with 5+ years experience",
        "Who has worked at Glovo or Typeform?",
        "Show me data scientists",
      ]
    } else if (keywords.some((k) => ["python", "backend", "django", "flask"].includes(k))) {
      const pythonDevs = matchingCVs.filter(
        (cv) =>
          cv.skills?.some((skill) => skill.toLowerCase().includes("python")) ||
          cv.role?.toLowerCase().includes("backend"),
      )

      response = `I found ${pythonDevs.length} Python/Backend developers. Here are the top candidates:\n\n`

      pythonDevs.slice(0, 3).forEach((cv, index) => {
        response += `${index + 1}. **${cv.name}** - ${cv.role}\n`
        response += `   Skills: ${cv.skills?.slice(0, 5).join(", ") || "N/A"}\n`
        response += `   Companies: ${cv.companies?.slice(0, 2).join(", ") || "N/A"}\n\n`
      })

      suggestions = [
        "Find React developers",
        "Show me DevOps engineers",
        "Who has AWS experience?",
        "Find candidates from Barcelona universities",
      ]
    } else if (keywords.some((k) => ["senior", "lead", "manager", "experience"].includes(k))) {
      const seniorCandidates = matchingCVs.filter(
        (cv) =>
          cv.role?.toLowerCase().includes("senior") ||
          cv.role?.toLowerCase().includes("lead") ||
          (cv.experienceYears && cv.experienceYears >= 5),
      )

      response = `I found ${seniorCandidates.length} senior-level candidates with significant experience:\n\n`

      seniorCandidates.slice(0, 3).forEach((cv, index) => {
        response += `${index + 1}. **${cv.name}** - ${cv.role}\n`
        response += `   Experience: ${cv.experienceYears || "N/A"} years\n`
        response += `   Key Skills: ${cv.skills?.slice(0, 4).join(", ") || "N/A"}\n\n`
      })

      suggestions = [
        "Show me junior developers",
        "Find candidates with startup experience",
        "Who has management experience?",
        "Show me full-stack developers",
      ]
    } else {
      response = `I searched through ${allCVs.length} CVs and found ${matchingCVs.length} potential matches for "${message}".\n\n`

      if (matchingCVs.length > 0) {
        response += "Here are some relevant candidates:\n\n"
        matchingCVs.slice(0, 3).forEach((cv, index) => {
          response += `${index + 1}. **${cv.name}** - ${cv.role}\n`
          response += `   Location: ${cv.location || "N/A"}\n`
          response += `   Skills: ${cv.skills?.slice(0, 4).join(", ") || "N/A"}\n\n`
        })
      } else {
        response +=
          "No exact matches found. Try searching for specific skills like 'React', 'Python', or job roles like 'Senior Developer'."
      }

      suggestions = [
        "Show me React developers",
        "Find Python engineers",
        "Who has worked at tech companies?",
        "Show me candidates with 5+ years experience",
      ]
    }

    return NextResponse.json({
      response,
      suggestions,
      matchCount: matchingCVs.length,
      totalCVs: allCVs.length,
    })
  } catch (error) {
    console.error("Error processing chat message:", error)
    return NextResponse.json(
      {
        error: "Failed to process message",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
