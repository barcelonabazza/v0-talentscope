import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { getLibraryCVs } from "@/lib/cv-data"

// Mock CV database - In a real implementation, this would be a vector database
const mockCVDatabase = [
  {
    id: "1",
    name: "Sarah Johnson",
    content:
      "Software Engineer with 5 years of experience in Python, React, and Node.js. Graduated from MIT with a Computer Science degree. Previously worked at Google and Microsoft. Fluent in English and Spanish.",
    skills: ["Python", "React", "Node.js", "JavaScript", "AWS"],
    experience: "5 years",
    education: "MIT - Computer Science",
    companies: ["Google", "Microsoft"],
    type: "mock",
  },
  {
    id: "2",
    name: "Michael Chen",
    content:
      "Data Scientist with 7 years of experience in machine learning and analytics. PhD in Statistics from Stanford. Expert in Python, R, and SQL. Previously worked at Netflix and Uber.",
    skills: ["Python", "R", "SQL", "Machine Learning", "Statistics"],
    experience: "7 years",
    education: "Stanford - PhD Statistics",
    companies: ["Netflix", "Uber"],
    type: "mock",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    content:
      "Product Manager with 6 years of experience in tech startups and enterprise software. MBA from Wharton. Led product teams at Airbnb and Salesforce. Specializes in user experience and growth.",
    skills: ["Product Management", "User Experience", "Growth", "Analytics"],
    experience: "6 years",
    education: "Wharton - MBA",
    companies: ["Airbnb", "Salesforce"],
    type: "mock",
  },
  {
    id: "4",
    name: "David Kim",
    content:
      "Full-stack Developer with 4 years of experience. Specializes in JavaScript, TypeScript, and cloud technologies. Bachelor's degree from UC Berkeley. Worked at startups and built several web applications.",
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "AWS", "Docker"],
    experience: "4 years",
    education: "UC Berkeley - Computer Science",
    companies: ["TechStartup Inc", "WebDev Solutions"],
    type: "mock",
  },
  {
    id: "5",
    name: "Lisa Wang",
    content:
      "UX Designer with 5 years of experience in mobile and web design. Master's in Design from RISD. Previously worked at Apple and Adobe. Expert in Figma, Sketch, and user research.",
    skills: ["UX Design", "UI Design", "Figma", "Sketch", "User Research"],
    experience: "5 years",
    education: "RISD - Master's in Design",
    companies: ["Apple", "Adobe"],
    type: "mock",
  },
  {
    id: "6",
    name: "Alex Thompson",
    content:
      "DevOps Engineer with 6 years of experience in cloud infrastructure and automation. Bachelor's from Georgia Tech. Previously worked at AWS and Docker. Expert in Kubernetes, Terraform, and CI/CD.",
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins", "Python"],
    experience: "6 years",
    education: "Georgia Tech - Computer Science",
    companies: ["AWS", "Docker"],
    type: "mock",
  },
  {
    id: "7",
    name: "Maria Garcia",
    content:
      "Marketing Manager with 4 years of experience in digital marketing and growth. MBA from Northwestern. Previously worked at HubSpot and Mailchimp. Specializes in SEO, content marketing, and analytics.",
    skills: ["Digital Marketing", "SEO", "Content Marketing", "Analytics", "Growth Hacking"],
    experience: "4 years",
    education: "Northwestern - MBA",
    companies: ["HubSpot", "Mailchimp"],
    type: "mock",
  },
  {
    id: "8",
    name: "Jennifer Taylor",
    content:
      "Machine Learning Engineer with 6 years of experience in AI and deep learning. Master's degree from Carnegie Mellon. Previously worked at NVIDIA and Tesla. Expert in TensorFlow, PyTorch, and computer vision.",
    skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Computer Vision"],
    experience: "6 years",
    education: "Carnegie Mellon - Master's in AI",
    companies: ["NVIDIA", "Tesla"],
    type: "mock",
  },
  {
    id: "9",
    name: "Christopher Wilson",
    content:
      "Cloud Architect with 8 years of experience in distributed systems and infrastructure. Bachelor's from University of Washington. Previously worked at Amazon and Microsoft. Specializes in AWS, Azure, and microservices.",
    skills: ["AWS", "Azure", "Kubernetes", "Microservices", "Docker", "Terraform"],
    experience: "8 years",
    education: "University of Washington - Computer Science",
    companies: ["Amazon", "Microsoft"],
    type: "mock",
  },
  {
    id: "10",
    name: "Amanda Martinez",
    content:
      "Digital Marketing Manager with 5 years of experience in growth marketing and analytics. MBA from Northwestern. Previously worked at HubSpot and Shopify. Expert in SEO, PPC, and conversion optimization.",
    skills: ["Digital Marketing", "SEO", "PPC", "Analytics", "Growth Marketing"],
    experience: "5 years",
    education: "Northwestern - MBA",
    companies: ["HubSpot", "Shopify"],
    type: "mock",
  },
]

function searchCVs(query: string) {
  const queryLower = query.toLowerCase()

  // Get all CVs from library (includes uploaded and generated CVs)
  const libraryCVs = getLibraryCVs()

  // Combine mock CVs with library CVs for comprehensive search
  const allCVs = [...mockCVDatabase, ...libraryCVs]

  const relevantCVs = allCVs.filter((cv) => {
    // Search in content
    if (cv.content && cv.content.toLowerCase().includes(queryLower)) return true

    // Search in skills
    if (cv.skills && Array.isArray(cv.skills) && cv.skills.some((skill) => skill.toLowerCase().includes(queryLower)))
      return true

    // Search in name
    if (cv.name && cv.name.toLowerCase().includes(queryLower)) return true

    // Search in education
    if (cv.education) {
      if (typeof cv.education === "string" && cv.education.toLowerCase().includes(queryLower)) return true
      if (
        Array.isArray(cv.education) &&
        cv.education.some(
          (edu) =>
            (edu.school && edu.school.toLowerCase().includes(queryLower)) ||
            (edu.degree && edu.degree.toLowerCase().includes(queryLower)),
        )
      )
        return true
    }

    // Search in companies
    if (
      cv.companies &&
      Array.isArray(cv.companies) &&
      cv.companies.some((company) => company.toLowerCase().includes(queryLower))
    )
      return true

    // Search in experience
    if (cv.experience && Array.isArray(cv.experience)) {
      return cv.experience.some(
        (exp) =>
          (exp.company && exp.company.toLowerCase().includes(queryLower)) ||
          (exp.position && exp.position.toLowerCase().includes(queryLower)) ||
          (exp.description && exp.description.toLowerCase().includes(queryLower)),
      )
    }

    // Search in role
    if (cv.role && cv.role.toLowerCase().includes(queryLower)) return true

    return false
  })

  return relevantCVs
}

// Fallback response function when API key is not available
function generateFallbackResponse(message: string, relevantCVs: any[]) {
  const queryLower = message.toLowerCase()

  if (relevantCVs.length === 0) {
    return "I don't have information about that specific topic in the current CV database. Please try asking about skills like Python, React, or companies like Google, Microsoft, etc."
  }

  // Enhanced keyword-based responses
  if (queryLower.includes("python")) {
    const pythonCVs = relevantCVs.filter(
      (cv) =>
        (cv.skills && cv.skills.some && cv.skills.some((skill) => skill.toLowerCase().includes("python"))) ||
        (cv.content && cv.content.toLowerCase().includes("python")),
    )
    return `I found ${pythonCVs.length} candidates with Python experience:\n\n${pythonCVs
      .map(
        (cv) =>
          `• ${cv.name} - ${cv.experience || cv.experienceYears || "Experience not specified"}, ${cv.type === "uploaded" ? "uploaded CV" : cv.type === "generated" ? "generated profile" : "database entry"}`,
      )
      .join("\n")}`
  }

  if (queryLower.includes("upload")) {
    const uploadedCVs = relevantCVs.filter((cv) => cv.type === "uploaded")
    if (uploadedCVs.length > 0) {
      return `I found ${uploadedCVs.length} uploaded CVs:\n\n${uploadedCVs
        .map(
          (cv) =>
            `• ${cv.name} - ${cv.role || "Role not specified"} (uploaded ${cv.uploadedAt ? new Date(cv.uploadedAt).toLocaleDateString() : "recently"})`,
        )
        .join("\n")}`
    }
  }

  if (queryLower.includes("experience") && (queryLower.includes("year") || queryLower.includes("more"))) {
    const experiencedCVs = relevantCVs.filter((cv) => {
      if (cv.experience && typeof cv.experience === "string") {
        const years = Number.parseInt(cv.experience)
        return years >= 5
      }
      if (cv.experienceYears && typeof cv.experienceYears === "string") {
        const years = Number.parseInt(cv.experienceYears)
        return years >= 5
      }
      return false
    })
    return `I found ${experiencedCVs.length} candidates with 5+ years of experience:\n\n${experiencedCVs
      .map(
        (cv) =>
          `• ${cv.name} - ${cv.experience || cv.experienceYears} experience as ${cv.role || "Professional"} (${cv.type})`,
      )
      .join("\n")}`
  }

  if (queryLower.includes("master") || queryLower.includes("phd") || queryLower.includes("degree")) {
    const educatedCVs = relevantCVs.filter((cv) => {
      if (cv.education) {
        if (typeof cv.education === "string") {
          return (
            cv.education.toLowerCase().includes("master") ||
            cv.education.toLowerCase().includes("phd") ||
            cv.education.toLowerCase().includes("mba")
          )
        }
        if (Array.isArray(cv.education)) {
          return cv.education.some(
            (edu) =>
              edu.degree &&
              (edu.degree.toLowerCase().includes("master") ||
                edu.degree.toLowerCase().includes("phd") ||
                edu.degree.toLowerCase().includes("mba")),
          )
        }
      }
      return false
    })
    return `I found ${educatedCVs.length} candidates with advanced degrees:\n\n${educatedCVs
      .map((cv) => {
        let education = cv.education
        if (Array.isArray(education)) {
          education = education[0]?.degree || education[0]?.school || "Advanced degree"
        }
        return `• ${cv.name} - ${education} (${cv.type})`
      })
      .join("\n")}`
  }

  // Generic response with type information
  return `I found ${relevantCVs.length} relevant candidates:\n\n${relevantCVs
    .map((cv) => {
      const typeLabel =
        cv.type === "uploaded" ? "📤 Uploaded" : cv.type === "generated" ? "🤖 Generated" : "💾 Database"
      return `• ${cv.name} - ${cv.role || cv.content?.split(".")[0] || "Professional"} ${typeLabel}`
    })
    .join("\n")}`
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Search for relevant CVs (now includes uploaded CVs)
    const relevantCVs = searchCVs(message)

    try {
      // Prepare context from relevant CVs
      const context = relevantCVs
        .map((cv) => {
          const typeInfo =
            cv.type === "uploaded"
              ? " (Uploaded CV)"
              : cv.type === "generated"
                ? " (Generated Profile)"
                : " (Database Entry)"
          return `Name: ${cv.name}${typeInfo}\nContent: ${cv.content || cv.summary || "No content available"}`
        })
        .join("\n\n")

      const systemPrompt = `You are an AI HR assistant specialized in screening CVs and answering questions about candidates. 

Your role is to:
1. Answer questions strictly based on the provided CV information
2. Be helpful and informative while staying factual
3. If you don't have information about something, clearly state that
4. Provide specific examples and details when available
5. Format your responses clearly and professionally
6. Distinguish between uploaded CVs, generated profiles, and database entries when relevant

Available CV Information:
${context}

If no relevant CVs are found for a query, politely explain that you don't have information about that specific topic in the current CV database.`

      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        system: systemPrompt,
        prompt: message,
        maxTokens: 500,
      })

      // Extract source CVs for the response
      const sources = relevantCVs.map((cv) => cv.name)

      return NextResponse.json({
        response: text,
        sources: sources.length > 0 ? sources : undefined,
      })
    } catch (aiError) {
      console.log("AI API error, falling back to demo mode:", aiError)

      // Use fallback response when AI fails
      const fallbackResponse = generateFallbackResponse(message, relevantCVs)
      const sources = relevantCVs.map((cv) => cv.name)

      return NextResponse.json({
        response:
          fallbackResponse +
          "\n\n⚠️ Note: This is a demo response. For full AI capabilities, please configure your OpenAI API key.",
        sources: sources.length > 0 ? sources : undefined,
        isDemo: true,
      })
    }
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
