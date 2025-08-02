import { type NextRequest, NextResponse } from "next/server"
import { generateCVData, addToLibrary } from "@/lib/cv-data"

// Barcelona-based data for realistic CVs
const BARCELONA_NAMES = {
  male: [
    "Marc García",
    "David López",
    "Jordi Martín",
    "Alex Rodríguez",
    "Pau Fernández",
    "Oriol Sánchez",
    "Roger Pérez",
    "Arnau González",
    "Pol Martínez",
    "Jan Romero",
    "Nil Moreno",
    "Biel Muñoz",
    "Iker Álvarez",
    "Adrià Jiménez",
    "Sergi Ruiz",
  ],
  female: [
    "Laura García",
    "Marta López",
    "Anna Martín",
    "Clara Rodríguez",
    "Núria Fernández",
    "Irene Sánchez",
    "Alba Pérez",
    "Júlia González",
    "Carla Martínez",
    "Laia Romero",
    "Noa Moreno",
    "Emma Muñoz",
    "Aina Álvarez",
    "Clàudia Jiménez",
    "Marina Ruiz",
  ],
}

const TECH_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Product Manager",
  "UX/UI Designer",
  "Mobile Developer",
  "Software Architect",
  "QA Engineer",
  "Machine Learning Engineer",
  "Cloud Engineer",
  "Cybersecurity Specialist",
  "Technical Lead",
  "Scrum Master",
]

const BARCELONA_COMPANIES = [
  "Glovo",
  "Typeform",
  "Wallapop",
  "King Digital Entertainment",
  "Sage",
  "Vueling",
  "Privalia",
  "Letgo",
  "Social Point",
  "Factorial",
  "TravelPerk",
  "Holded",
  "Redbooth",
  "Kantox",
  "Carto",
  "Flywire",
  "Badi",
  "Cornerjob",
  "Jobandtalent",
  "Cabify",
]

const TECH_SKILLS = [
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
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
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
  "REST API",
  "Git",
  "Jenkins",
  "Terraform",
  "Ansible",
  "Linux",
]

const UNIVERSITIES = [
  "Universitat Politècnica de Catalunya (UPC)",
  "Universitat de Barcelona (UB)",
  "Universitat Autònoma de Barcelona (UAB)",
  "Universitat Pompeu Fabra (UPF)",
  "ESADE Business School",
  "IE University",
  "Universidad Carlos III de Madrid",
  "Universidad Politécnica de Madrid",
]

const DEGREES = [
  "Computer Science Engineering",
  "Software Engineering",
  "Telecommunications Engineering",
  "Industrial Engineering",
  "Data Science",
  "Information Systems",
  "Cybersecurity",
  "Artificial Intelligence",
  "Business Administration",
  "Digital Marketing",
]

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function generateRandomCV(index: number): any {
  const gender = Math.random() > 0.5 ? "male" : "female"
  const name = getRandomElement(BARCELONA_NAMES[gender])
  const role = getRandomElement(TECH_ROLES)
  const age = 22 + Math.floor(Math.random() * 18) // 22-40 years old
  const experienceYears = Math.max(1, age - 22 - Math.floor(Math.random() * 3))

  // Generate profile image URL from RandomUser.me
  const profileImageUrl = `https://randomuser.me/api/portraits/${gender === "male" ? "men" : "women"}/${
    Math.floor(Math.random() * 99) + 1
  }.jpg`

  const skills = getRandomElements(TECH_SKILLS, 5 + Math.floor(Math.random() * 8))
  const companies = getRandomElements(BARCELONA_COMPANIES, 2 + Math.floor(Math.random() * 3))

  // Generate experience
  const experience = []
  for (let i = 0; i < Math.min(experienceYears / 2 + 1, 4); i++) {
    const company = companies[i] || getRandomElement(BARCELONA_COMPANIES)
    const startYear = 2024 - experienceYears + i * 2
    const endYear = i === 0 ? "Present" : startYear + 1 + Math.floor(Math.random() * 2)

    experience.push({
      position: i === 0 ? role : getRandomElement(TECH_ROLES),
      company,
      duration: `${startYear} - ${endYear}`,
      location: "Barcelona, Spain",
      description: generateJobDescription(role, company),
    })
  }

  // Generate education
  const university = getRandomElement(UNIVERSITIES)
  const degree = getRandomElement(DEGREES)
  const graduationYear = 2024 - experienceYears - Math.floor(Math.random() * 2)

  const education = [
    {
      degree: `Bachelor's in ${degree}`,
      school: university,
      year: `${graduationYear - 4} - ${graduationYear}`,
      description: `Specialized in ${getRandomElements(skills, 3).join(", ")}`,
    },
  ]

  // Generate languages
  const languages = ["Spanish (Native)", "Catalan (Native)", "English (Fluent)"]
  if (Math.random() > 0.7) {
    languages.push(getRandomElement(["French (Intermediate)", "German (Basic)", "Italian (Intermediate)"]))
  }

  // Generate certifications
  const certifications = []
  if (Math.random() > 0.5) {
    certifications.push(
      ...getRandomElements(
        [
          "AWS Certified Solutions Architect",
          "Google Cloud Professional",
          "Microsoft Azure Fundamentals",
          "Certified Kubernetes Administrator",
          "Scrum Master Certification",
          "PMP Certification",
        ],
        1 + Math.floor(Math.random() * 2),
      ),
    )
  }

  const firstName = name.split(" ")[0].toLowerCase()
  const lastName = name.split(" ")[1].toLowerCase()

  return {
    id: `${Date.now() + index}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    role,
    email: `${firstName}.${lastName}@email.com`,
    phone: `+34 ${Math.floor(Math.random() * 900) + 600} ${Math.floor(Math.random() * 900) + 100} ${
      Math.floor(Math.random() * 900) + 100
    }`,
    location: "Barcelona, Spain",
    linkedin: `linkedin.com/in/${firstName}-${lastName}`,
    github: `github.com/${firstName}${lastName}`,
    portfolio: `${firstName}${lastName}.dev`,
    profileImageUrl,
    gender,
    age,
    experienceYears,
    summary: generateSummary(name, role, experienceYears, skills.slice(0, 4)),
    skills,
    experience,
    education,
    languages,
    certifications,
    companies: companies.slice(0, 3),
    university,
    type: "generated",
    uploadDate: new Date().toISOString(),
  }
}

function generateJobDescription(role: string, company: string): string {
  const descriptions = {
    "Frontend Developer": [
      `Developed responsive web applications using React and TypeScript, improving user engagement by 40% at ${company}.`,
      `Built modern UI components with Vue.js and implemented state management solutions, serving 100K+ daily users.`,
      `Collaborated with design teams to create pixel-perfect interfaces and optimize performance across all devices.`,
    ],
    "Backend Developer": [
      `Designed and implemented scalable REST APIs using Node.js and Express, handling 1M+ requests daily at ${company}.`,
      `Optimized database queries and implemented caching strategies, reducing response times by 60%.`,
      `Built microservices architecture using Docker and Kubernetes for improved system reliability.`,
    ],
    "Full Stack Developer": [
      `Developed end-to-end web applications using React, Node.js, and PostgreSQL at ${company}.`,
      `Implemented CI/CD pipelines and automated testing, reducing deployment time by 50%.`,
      `Led technical decisions for new features and mentored junior developers on best practices.`,
    ],
    "DevOps Engineer": [
      `Managed cloud infrastructure on AWS, implementing auto-scaling solutions that reduced costs by 30% at ${company}.`,
      `Automated deployment processes using Jenkins and Terraform, improving deployment frequency by 200%.`,
      `Monitored system performance and implemented logging solutions for better observability.`,
    ],
    "Data Scientist": [
      `Built machine learning models using Python and TensorFlow, improving prediction accuracy by 25% at ${company}.`,
      `Analyzed large datasets to identify business insights and created automated reporting dashboards.`,
      `Collaborated with product teams to implement A/B testing frameworks and data-driven decision making.`,
    ],
  }

  const roleDescriptions = descriptions[role] || descriptions["Full Stack Developer"]
  return getRandomElement(roleDescriptions)
}

function generateSummary(name: string, role: string, experience: number, skills: string[]): string {
  const summaries = [
    `Passionate ${role} with ${experience}+ years of experience building scalable web applications. Expertise in ${skills.join(
      ", ",
    )} and strong problem-solving skills. Based in Barcelona with experience in fast-paced startup environments.`,
    `Experienced ${role} specializing in ${skills
      .slice(0, 3)
      .join(
        ", ",
      )} with a track record of delivering high-quality solutions. ${experience} years of experience in the Barcelona tech scene, passionate about clean code and user experience.`,
    `Senior ${role} with ${experience}+ years building innovative digital products. Expert in ${skills
      .slice(0, 4)
      .join(", ")} and agile methodologies. Strong background in Barcelona's vibrant tech ecosystem.`,
  ]

  return getRandomElement(summaries)
}

export async function POST(request: NextRequest) {
  try {
    const { count = 5 } = await request.json()

    if (count < 1 || count > 20) {
      return NextResponse.json({ error: "Count must be between 1 and 20" }, { status: 400 })
    }

    const generatedCVs = []

    for (let i = 0; i < count; i++) {
      const cvData = generateCVData()
      addToLibrary(cvData)
      generatedCVs.push(cvData)
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${count} CVs successfully`,
      cvs: generatedCVs,
      count: generatedCVs.length,
    })
  } catch (error) {
    console.error("Error generating CVs:", error)
    return NextResponse.json({ error: "Failed to generate CVs" }, { status: 500 })
  }
}
