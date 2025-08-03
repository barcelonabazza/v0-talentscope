import { type NextRequest, NextResponse } from "next/server"

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

function generateRandomCV(id: string) {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const name = `${firstName} ${lastName}`
  const role = techRoles[Math.floor(Math.random() * techRoles.length)]
  const age = 25 + Math.floor(Math.random() * 15) // 25-40 years old
  const experienceYears = Math.max(2, age - 23) // At least 2 years experience
  const gender = Math.random() > 0.5 ? "male" : "female"

  // Generate email
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`

  // Generate profile image URL
  const profileImageUrl = `https://randomuser.me/api/portraits/${gender === "male" ? "men" : "women"}/${Math.floor(Math.random() * 99)}.jpg`

  // Select random skills (6-10 skills)
  const skillCount = 6 + Math.floor(Math.random() * 5)
  const selectedSkills = []
  const skillsCopy = [...techSkills]
  for (let i = 0; i < skillCount && skillsCopy.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * skillsCopy.length)
    selectedSkills.push(skillsCopy.splice(randomIndex, 1)[0])
  }

  // Select random companies (2-4 companies)
  const companyCount = 2 + Math.floor(Math.random() * 3)
  const selectedCompanies = []
  const companiesCopy = [...barcelonaCompanies]
  for (let i = 0; i < companyCount && companiesCopy.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * companiesCopy.length)
    selectedCompanies.push(companiesCopy.splice(randomIndex, 1)[0])
  }

  const university = universities[Math.floor(Math.random() * universities.length)]

  // Generate professional summary
  const summaries = [
    `Experienced ${role.toLowerCase()} with ${experienceYears} years of expertise in modern web technologies. Passionate about creating scalable solutions and leading development teams in Barcelona's tech ecosystem.`,
    `Results-driven ${role.toLowerCase()} specializing in ${selectedSkills.slice(0, 3).join(", ")}. Proven track record of delivering high-quality software solutions in agile environments.`,
    `Senior ${role.toLowerCase()} with extensive experience in full-stack development. Strong problem-solving skills and commitment to writing clean, maintainable code.`,
  ]

  const summary = summaries[Math.floor(Math.random() * summaries.length)]

  return {
    id,
    name,
    role,
    email,
    location: "Barcelona, Spain",
    profileImageUrl,
    gender,
    age,
    experienceYears,
    summary,
    skills: selectedSkills,
    companies: selectedCompanies,
    university,
  }
}

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

              // Generate CV data
              const cvData = generateRandomCV(cvId)

              // Store in memory
              cvStorage.set(cvId, cvData)

              console.log(`Generated CV ${i + 1}/${count}: ${cvData.name}`)

              // Send progress update
              const progressData = {
                type: "progress",
                current: i + 1,
                total: count,
                cv: cvData,
              }

              controller.enqueue(encoder.encode(`data: ${JSON.stringify(progressData)}\n\n`))

              // Small delay to show progress
              await new Promise((resolve) => setTimeout(resolve, 100))
            }

            // Send completion message
            const completeData = {
              type: "complete",
              message: `Successfully generated ${count} CVs`,
            }

            controller.enqueue(encoder.encode(`data: ${JSON.stringify(completeData)}\n\n`))
            controller.close()

            console.log(`Completed generation of ${count} CVs`)
          } catch (error) {
            console.error("Error during CV generation:", error)

            const errorData = {
              type: "error",
              message: error instanceof Error ? error.message : "Unknown error occurred",
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
