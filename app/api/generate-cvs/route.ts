import { type NextRequest, NextResponse } from "next/server"
import { generateCVData, addToLibrary } from "@/lib/cv-data"

// In-memory storage for generated CVs
const cvStorage = new Map<string, any>()

// Sample data for generating realistic Barcelona tech CVs
const firstNames = [
  "Alex",
  "Maria",
  "David",
  "Sofia",
  "Carlos",
  "Elena",
  "Miguel",
  "Laura",
  "Pablo",
  "Ana",
  "Jorge",
  "Carmen",
  "Luis",
  "Isabel",
  "Antonio",
  "Marta",
  "Francisco",
  "Cristina",
  "Manuel",
  "Beatriz",
]

const lastNames = [
  "García",
  "Rodríguez",
  "González",
  "Fernández",
  "López",
  "Martínez",
  "Sánchez",
  "Pérez",
  "Gómez",
  "Martín",
  "Jiménez",
  "Ruiz",
  "Hernández",
  "Díaz",
  "Moreno",
  "Muñoz",
  "Álvarez",
  "Romero",
  "Alonso",
  "Gutiérrez",
]

const techRoles = [
  "Senior Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Product Manager",
  "UX/UI Designer",
  "Mobile Developer",
  "Cloud Architect",
  "Tech Lead",
  "Engineering Manager",
  "Data Engineer",
  "Machine Learning Engineer",
  "QA Engineer",
]

const techSkills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Vue.js",
  "Angular",
  "Node.js",
  "Python",
  "Java",
  "C#",
  "PHP",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "GraphQL",
  "REST APIs",
  "Microservices",
  "CI/CD",
  "Git",
  "Agile",
  "Scrum",
  "TDD",
  "Jest",
  "Cypress",
]

const barcelonaCompanies = [
  "Glovo",
  "Typeform",
  "Wallapop",
  "Factorial",
  "TravelPerk",
  "Holded",
  "Camaloon",
  "Redbooth",
  "Kantox",
  "Carto",
  "King Digital Entertainment",
  "Sage",
  "Vueling",
  "Mango",
  "Desigual",
  "CaixaBank",
  "Telefónica",
]

const universities = [
  "Universitat Politècnica de Catalunya",
  "Universitat de Barcelona",
  "Universitat Autònoma de Barcelona",
  "Universitat Pompeu Fabra",
  "ESADE Business School",
  "IE University",
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { count = 5 } = body

    if (!count || count < 1 || count > 50) {
      return NextResponse.json({ error: "Count must be between 1 and 50" }, { status: 400 })
    }

    console.log(`Starting generation of ${count} CVs`)

    // Create a readable stream for Server-Sent Events
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      start(controller) {
        const generateCVs = async () => {
          try {
            for (let i = 0; i < count; i++) {
              // Generate unique ID
              const cvId = `cv-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`

              // Generate comprehensive CV data using the sophisticated system
              const cvData = generateCVData(cvId)

              // Add to library storage
              addToLibrary(cvData)

              console.log(`Generated CV ${i + 1}/${count}: ${cvData.name}`)

              // Send progress update with the generated CV data
              const progressData = {
                type: "progress",
                current: i + 1,
                total: count,
                cv: {
                  id: cvData.id,
                  name: cvData.name,
                  role: cvData.role,
                  email: cvData.email,
                  location: cvData.location,
                  profileImageUrl: cvData.profileImageUrl,
                  gender: cvData.gender,
                  age: cvData.age,
                  experienceYears: cvData.experienceYears,
                  summary: cvData.summary,
                  skills: cvData.skills,
                  companies: cvData.companies,
                  university: cvData.university,
                },
              }

              controller.enqueue(encoder.encode(`data: ${JSON.stringify(progressData)}\n\n`))

              // Small delay to show progress and prevent overwhelming the client
              await new Promise((resolve) => setTimeout(resolve, 200))
            }

            // Send completion message
            const completeData = {
              type: "complete",
              message: `Successfully generated ${count} professional CVs`,
            }

            controller.enqueue(encoder.encode(`data: ${JSON.stringify(completeData)}\n\n`))
            controller.close()

            console.log(`Completed generation of ${count} CVs`)
          } catch (error) {
            console.error("Error during CV generation:", error)

            const errorData = {
              type: "error",
              message: error instanceof Error ? error.message : "Unknown error occurred during CV generation",
            }

            controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`))
            controller.close()
          }
        }

        generateCVs()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  } catch (error) {
    console.error("Error in generate-cvs route:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Export the storage for other routes to access
export { cvStorage }
