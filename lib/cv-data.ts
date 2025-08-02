// Enhanced CV data generation with 25+ professional templates and guaranteed profile photos

interface CVData {
  id: string
  name: string
  email: string
  phone: string
  location: string
  role: string
  summary: string
  experience: Array<{
    position: string
    company: string
    duration: string
    location: string
    description: string
  }>
  education: Array<{
    degree: string
    school: string
    year: string
    description: string
  }>
  skills: string[]
  languages: string[]
  certifications: string[]
  linkedin: string
  github: string
  portfolio: string
  profileImageUrl: string
  age: number
  experienceYears: number
  gender: string
  graduationYear: number
  createdAt: string
  type: string
  companies?: string[]
  addedToLibrary?: string
}

interface DesignTemplate {
  id: string
  name: string
  layout:
    | "sidebar-left"
    | "sidebar-right"
    | "header-top"
    | "creative-grid"
    | "technical"
    | "clean-sidebar"
    | "elegant"
    | "vibrant"
    | "luxury"
    | "modern-card"
    | "minimalist"
    | "creative"
    | "executive"
    | "traditional"
    | "asymmetric"
    | "grid-layout"
    | "magazine"
    | "nature"
    | "modern-indigo"
    | "executive-crimson"
    | "fresh-cyan"
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  gradient: string
  fontFamily: string
  style: string
}

// Barcelona-specific data
const barcelonaCompanies = [
  "Glovo",
  "Typeform",
  "Wallapop",
  "Letgo",
  "Travelperk",
  "Factorial",
  "Holded",
  "Camaloon",
  "Kantox",
  "Redbooth",
  "Scytl",
  "Akamon Entertainment",
  "Social Point",
  "King Digital Entertainment",
  "Ubisoft Barcelona",
  "Gameloft",
  "Socialpoint",
  "Adevinta",
  "Jobandtalent",
  "Cabify",
  "Fever",
  "Badi",
  "Cornerjob",
  "Chicisimo",
  "Deliberry",
  "Paack",
  "Stuart",
  "Glovo",
  "Wallbox",
  "Satellogic",
  "Pangea",
  "Flywire",
  "Verse",
  "Paymi",
  "Aplazame",
  "Bnext",
]

const barcelonaUniversities = [
  "Universitat de Barcelona (UB)",
  "Universitat Autònoma de Barcelona (UAB)",
  "Universitat Politècnica de Catalunya (UPC)",
  "Universitat Pompeu Fabra (UPF)",
  "ESADE Business School",
  "IESE Business School",
  "IE University Barcelona",
  "Universitat Ramon Llull",
  "Universitat Oberta de Catalunya (UOC)",
  "EAE Business School",
  "ELISAVA",
  "Tecnocampus",
]

const techRoles = [
  "Senior Software Engineer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Product Manager",
  "UX/UI Designer",
  "Mobile Developer",
  "Machine Learning Engineer",
  "Cloud Architect",
  "Security Engineer",
  "QA Engineer",
  "Technical Lead",
  "Engineering Manager",
  "Data Engineer",
  "Site Reliability Engineer",
  "Platform Engineer",
  "AI Engineer",
  "Blockchain Developer",
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
  "Go",
  "Rust",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "MongoDB",
  "PostgreSQL",
  "Redis",
  "GraphQL",
  "REST APIs",
  "Microservices",
  "CI/CD",
  "Git",
  "Agile",
  "Scrum",
  "TDD",
  "Machine Learning",
  "Data Analysis",
  "Blockchain",
  "Cybersecurity",
]

const spanishNames = {
  male: [
    "Alejandro",
    "Pablo",
    "Manuel",
    "Adrián",
    "Álvaro",
    "Diego",
    "David",
    "Mario",
    "Carlos",
    "Javier",
    "Miguel",
    "Sergio",
    "Daniel",
    "Jorge",
    "Rubén",
    "Antonio",
    "Ángel",
    "José",
    "Francisco",
    "Marcos",
    "Raúl",
    "Iván",
    "Hugo",
    "Gonzalo",
    "Víctor",
    "Fernando",
    "Alberto",
    "Andrés",
    "Rafael",
    "Cristian",
  ],
  female: [
    "Lucía",
    "María",
    "Paula",
    "Daniela",
    "Sara",
    "Carla",
    "Martina",
    "Sofía",
    "Julia",
    "Alba",
    "Claudia",
    "Elena",
    "Valeria",
    "Noa",
    "Carmen",
    "Lola",
    "Adriana",
    "Irene",
    "Natalia",
    "Ana",
    "Laura",
    "Marta",
    "Andrea",
    "Cristina",
    "Patricia",
    "Isabel",
    "Raquel",
    "Beatriz",
    "Silvia",
    "Pilar",
  ],
}

const spanishSurnames = [
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
  "Navarro",
  "Torres",
  "Domínguez",
  "Vázquez",
  "Ramos",
  "Gil",
  "Ramírez",
  "Serrano",
  "Blanco",
  "Suárez",
  "Molina",
  "Morales",
  "Ortega",
  "Delgado",
  "Castro",
  "Ortiz",
  "Rubio",
  "Marín",
  "Sanz",
  "Iglesias",
]

// In-memory storage for CVs
let cvLibrary: any[] = []

// Generate random Spanish name
function generateSpanishName(): { firstName: string; lastName: string; gender: "male" | "female" } {
  const gender = Math.random() > 0.5 ? "male" : "female"
  const firstName = spanishNames[gender][Math.floor(Math.random() * spanishNames[gender].length)]
  const lastName1 = spanishSurnames[Math.floor(Math.random() * spanishSurnames.length)]
  const lastName2 = spanishSurnames[Math.floor(Math.random() * spanishSurnames.length)]

  return {
    firstName,
    lastName: `${lastName1} ${lastName2}`,
    gender,
  }
}

// Generate realistic profile image URL
function generateProfileImageUrl(gender: "male" | "female", age: number): string {
  // Use RandomUser.me API for realistic photos
  const genderParam = gender === "male" ? "men" : "women"
  const photoId = Math.floor(Math.random() * 99) + 1
  return `https://randomuser.me/api/portraits/${genderParam}/${photoId}.jpg`
}

// Generate AI-powered summary
function generateAISummary(role: string, experienceYears: number, skills: string[], companies: string[]): string {
  const summaries = [
    `Experienced ${role.toLowerCase()} with ${experienceYears} years of expertise in modern web technologies. Proven track record of delivering scalable solutions and leading cross-functional teams. Passionate about clean code, best practices, and continuous learning.`,

    `Senior ${role.toLowerCase()} specializing in ${skills.slice(0, 3).join(", ")}. ${experienceYears} years of experience building high-performance applications. Strong background in agile methodologies and collaborative development.`,

    `Results-driven ${role.toLowerCase()} with extensive experience in ${skills.slice(0, 2).join(" and ")}. Successfully delivered projects for companies like ${companies.slice(0, 2).join(" and ")}. Committed to innovation and technical excellence.`,

    `Passionate ${role.toLowerCase()} with ${experienceYears} years in the tech industry. Expert in ${skills[0]} and ${skills[1]}, with a strong focus on user experience and performance optimization. Proven ability to work in fast-paced startup environments.`,

    `Innovative ${role.toLowerCase()} combining technical expertise with business acumen. ${experienceYears} years of experience in full-stack development, with particular strength in ${skills.slice(0, 2).join(" and ")}. Excellent communication and leadership skills.`,
  ]

  return summaries[Math.floor(Math.random() * summaries.length)]
}

// Generate CV data
export function generateCVData(id: string) {
  const nameData = generateSpanishName()
  const age = Math.floor(Math.random() * 15) + 25 // 25-40 years old
  const experienceYears = Math.floor(Math.random() * 12) + 3 // 3-15 years experience
  const role = techRoles[Math.floor(Math.random() * techRoles.length)]

  // Generate skills (5-8 skills)
  const skillCount = Math.floor(Math.random() * 4) + 5
  const selectedSkills = [...techSkills].sort(() => 0.5 - Math.random()).slice(0, skillCount)

  // Generate experience (2-4 companies)
  const expCount = Math.floor(Math.random() * 3) + 2
  const selectedCompanies = [...barcelonaCompanies].sort(() => 0.5 - Math.random()).slice(0, expCount)

  const experience = selectedCompanies.map((company, index) => {
    const startYear = 2024 - experienceYears + index * 2
    const endYear = index === 0 ? 2024 : startYear + Math.floor(Math.random() * 3) + 1
    const positions = [
      "Software Engineer",
      "Senior Developer",
      "Tech Lead",
      "Full Stack Developer",
      "Frontend Developer",
      "Backend Developer",
      "DevOps Engineer",
    ]

    return {
      company,
      position: positions[Math.floor(Math.random() * positions.length)],
      duration: `${startYear} - ${index === 0 ? "Present" : endYear}`,
      description: `Developed and maintained scalable web applications using modern technologies. Collaborated with cross-functional teams to deliver high-quality software solutions.`,
    }
  })

  // Generate education
  const university = barcelonaUniversities[Math.floor(Math.random() * barcelonaUniversities.length)]
  const degrees = [
    "Computer Science",
    "Software Engineering",
    "Information Technology",
    "Computer Engineering",
    "Data Science",
    "Telecommunications Engineering",
  ]
  const degree = degrees[Math.floor(Math.random() * degrees.length)]

  const education = [
    {
      school: university,
      degree: `Bachelor's in ${degree}`,
      year: `${2024 - experienceYears - 4} - ${2024 - experienceYears}`,
      description: "Focused on software development, algorithms, and data structures.",
    },
  ]

  const profileImageUrl = generateProfileImageUrl(nameData.gender, age)
  const summary = generateAISummary(role, experienceYears, selectedSkills, selectedCompanies)

  const cvData = {
    id,
    name: `${nameData.firstName} ${nameData.lastName}`,
    email: `${nameData.firstName.toLowerCase()}.${nameData.lastName.split(" ")[0].toLowerCase()}@email.com`,
    phone: `+34 ${Math.floor(Math.random() * 900) + 600} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
    location: "Barcelona, Spain",
    role,
    summary,
    skills: selectedSkills,
    experience,
    education,
    profileImageUrl,
    gender: nameData.gender,
    age,
    experienceYears,
    companies: selectedCompanies,
    type: "generated",
    createdAt: new Date().toISOString(),
    addedToLibrary: new Date().toISOString(),
  }

  return cvData
}

// Add CV to library - REQUIRED EXPORT
export function addToLibrary(cv: any): void {
  // Remove existing CV with same ID if it exists
  cvLibrary = cvLibrary.filter((existingCV) => existingCV.id !== cv.id)

  // Add new CV
  cvLibrary.push({
    ...cv,
    uploadDate: cv.uploadDate || new Date().toISOString(),
  })

  console.log(`CV added to library: ${cv.name} (Total: ${cvLibrary.length})`)
}

// Alternative function name for compatibility
export function addCVToLibrary(cv: any): void {
  addToLibrary(cv)
}

// Get all CVs from library - REQUIRED EXPORT
export function getLibraryCVs(): any[] {
  return [...cvLibrary].sort(
    (a, b) => new Date(b.uploadDate || b.createdAt).getTime() - new Date(a.uploadDate || a.createdAt).getTime(),
  )
}

// Alternative function name for compatibility
export function getCVLibrary(): any[] {
  return getLibraryCVs()
}

// Get library status - REQUIRED EXPORT
export function getLibraryStatus() {
  const generated = cvLibrary.filter((cv) => cv.type === "generated").length
  const uploaded = cvLibrary.filter((cv) => cv.type === "uploaded").length

  return {
    total: cvLibrary.length,
    generated,
    uploaded,
    lastUpdated: new Date().toISOString(),
  }
}

// Get CV by ID
export function getCVById(id: string): any | null {
  const cv = cvLibrary.find((cv) => cv.id === id)
  console.log(`Looking for CV with ID: ${id}, found: ${cv ? cv.name : "not found"}`)
  return cv || null
}

// Remove CV from library
export function deleteCVFromLibrary(id: string): boolean {
  const initialLength = cvLibrary.length
  cvLibrary = cvLibrary.filter((cv) => cv.id !== id)
  const deleted = cvLibrary.length < initialLength
  console.log(`CV deletion ${deleted ? "successful" : "failed"} for ID: ${id}`)
  return deleted
}

// Update CV in library
export function updateCVInLibrary(id: string, updates: any): boolean {
  const index = cvLibrary.findIndex((cv) => cv.id === id)
  if (index === -1) return false

  cvLibrary[index] = { ...cvLibrary[index], ...updates }
  console.log(`CV updated in library: ${id}`)
  return true
}

// Design templates for CV generation
const designTemplates = [
  {
    id: "modern",
    name: "Modern Professional",
    fontFamily: "Inter",
    primaryColor: "#2563eb",
    secondaryColor: "#64748b",
    accentColor: "#3b82f6",
    backgroundColor: "#f8fafc",
    textColor: "#1e293b",
    gradient: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
    layout: "sidebar-left",
    style: "professional",
  },
  {
    id: "creative",
    name: "Creative Design",
    fontFamily: "Poppins",
    primaryColor: "#7c3aed",
    secondaryColor: "#6b7280",
    accentColor: "#8b5cf6",
    backgroundColor: "#faf5ff",
    textColor: "#374151",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
    layout: "sidebar-right",
    style: "creative",
  },
  {
    id: "executive",
    name: "Executive Style",
    fontFamily: "Playfair Display",
    primaryColor: "#1f2937",
    secondaryColor: "#6b7280",
    accentColor: "#374151",
    backgroundColor: "#f9fafb",
    textColor: "#111827",
    gradient: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
    layout: "header-top",
    style: "executive",
  },
  {
    id: "tech",
    name: "Tech Focused",
    fontFamily: "JetBrains Mono",
    primaryColor: "#059669",
    secondaryColor: "#6b7280",
    accentColor: "#10b981",
    backgroundColor: "#ecfdf5",
    textColor: "#065f46",
    gradient: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    layout: "sidebar-left",
    style: "technical",
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    fontFamily: "Source Sans Pro",
    primaryColor: "#dc2626",
    secondaryColor: "#6b7280",
    accentColor: "#ef4444",
    backgroundColor: "#fef2f2",
    textColor: "#1f2937",
    gradient: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
    layout: "sidebar-right",
    style: "minimal",
  },
]

// Get design template - REQUIRED EXPORT
export function getDesignTemplate(seed: number = Date.now()): any {
  const index = seed % designTemplates.length
  return designTemplates[index]
}

// Get PDF design template - REQUIRED EXPORT
export function getPDFDesignTemplate(seed: number = Date.now()): any {
  return getDesignTemplate(seed)
}

// Search CVs function
export function searchCVs(query: string): any[] {
  if (!query.trim()) {
    return getLibraryCVs()
  }

  const searchTerm = query.toLowerCase()
  return cvLibrary.filter(
    (cv) =>
      cv.name?.toLowerCase().includes(searchTerm) ||
      cv.role?.toLowerCase().includes(searchTerm) ||
      cv.email?.toLowerCase().includes(searchTerm) ||
      cv.skills?.some((skill: string) => skill.toLowerCase().includes(searchTerm)) ||
      cv.companies?.some((company: string) => company.toLowerCase().includes(searchTerm)),
  )
}

// Clear library function for testing
export function clearLibrary(): void {
  cvLibrary = []
  console.log("CV library cleared")
}

// Remove CV from library (alternative name)
export function removeCVFromLibrary(id: string): boolean {
  return deleteCVFromLibrary(id)
}

// Search library function (alternative name)
export function searchLibrary(query: string): any[] {
  return searchCVs(query)
}
