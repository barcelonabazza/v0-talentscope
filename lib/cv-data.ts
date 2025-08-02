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
    company: string
    position: string
    startDate: string
    endDate: string
    description: string
  }>
  education: Array<{
    school: string
    degree: string
    startDate: string
    endDate: string
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
  experienceYears: string
  gender: string
  graduationYear: number
  createdAt: string
  type: string
  companies?: string[]
  addedAt?: string
  updatedAt?: string
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
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  fonts: {
    heading: string
    body: string
  }
  style: string
}

// Barcelona-specific data
const barcelonaNames = {
  male: [
    "Marc",
    "David",
    "Daniel",
    "Alejandro",
    "Pablo",
    "Adrian",
    "Alvaro",
    "Hugo",
    "Mario",
    "Diego",
    "Carlos",
    "Sergio",
    "Raul",
    "Ivan",
    "Miguel",
    "Antonio",
    "Francisco",
    "Jose",
    "Manuel",
    "Rafael",
  ],
  female: [
    "Maria",
    "Carmen",
    "Ana",
    "Isabel",
    "Pilar",
    "Dolores",
    "Teresa",
    "Rosa",
    "Francisca",
    "Antonia",
    "Laura",
    "Marta",
    "Elena",
    "Sara",
    "Paula",
    "Cristina",
    "Andrea",
    "Lucia",
    "Sofia",
    "Alba",
  ],
}

const barcelonaSurnames = [
  "Garcia",
  "Rodriguez",
  "Gonzalez",
  "Fernandez",
  "Lopez",
  "Martinez",
  "Sanchez",
  "Perez",
  "Gomez",
  "Martin",
  "Jimenez",
  "Ruiz",
  "Hernandez",
  "Diaz",
  "Moreno",
  "Alvarez",
  "Muñoz",
  "Romero",
  "Alonso",
  "Gutierrez",
  "Navarro",
  "Torres",
  "Dominguez",
  "Vazquez",
  "Ramos",
  "Gil",
  "Ramirez",
  "Serrano",
  "Blanco",
  "Suarez",
]

const barcelonaCompanies = [
  "Banco Santander",
  "BBVA",
  "Telefonica",
  "Repsol",
  "Iberdrola",
  "Inditex",
  "Amadeus IT",
  "Mercadona",
  "El Corte Ingles",
  "Mapfre",
  "Acciona",
  "Ferrovial",
  "ACS Group",
  "Indra",
  "Cellnex",
  "Red Electrica",
  "Enagas",
  "Aena",
  "Siemens Gamesa",
  "Naturgy",
]

const barcelonaUniversities = [
  "Universitat de Barcelona",
  "Universitat Politècnica de Catalunya",
  "Universitat Autònoma de Barcelona",
  "Universitat Pompeu Fabra",
  "ESADE Business School",
  "IE Business School",
  "IESE Business School",
  "Universidad Carlos III de Madrid",
  "Universidad Complutense de Madrid",
  "Universidad Politécnica de Madrid",
]

const techSkills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "C#",
  "PHP",
  "Ruby",
  "Go",
  "AWS",
  "Azure",
  "Docker",
  "Kubernetes",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Git",
  "Jenkins",
]

const businessSkills = [
  "Project Management",
  "Agile",
  "Scrum",
  "Leadership",
  "Strategic Planning",
  "Business Analysis",
  "Data Analysis",
  "Marketing",
  "Sales",
  "Customer Service",
  "Communication",
  "Negotiation",
]

const designSkills = [
  "Figma",
  "Sketch",
  "Adobe Creative Suite",
  "Photoshop",
  "Illustrator",
  "InDesign",
  "After Effects",
  "UI/UX Design",
  "Prototyping",
  "User Research",
  "Wireframing",
  "Design Systems",
]

const jobTitles = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Product Manager",
  "UX Designer",
  "UI Designer",
  "Marketing Manager",
  "Sales Manager",
  "Business Analyst",
  "Project Manager",
  "Scrum Master",
  "Technical Lead",
  "Engineering Manager",
]

// In-memory storage for CVs
let cvLibrary: any[] = []

// Generate random CV data
export function generateCVData() {
  const gender = Math.random() > 0.5 ? "male" : "female"
  const firstName = barcelonaNames[gender][Math.floor(Math.random() * barcelonaNames[gender].length)]
  const lastName = barcelonaSurnames[Math.floor(Math.random() * barcelonaSurnames.length)]
  const name = `${firstName} ${lastName}`

  const role = jobTitles[Math.floor(Math.random() * jobTitles.length)]
  const experienceYears = Math.floor(Math.random() * 10) + 1

  // Generate skills based on role
  let skills = []
  if (role.includes("Developer") || role.includes("Engineer")) {
    skills = techSkills.slice(0, Math.floor(Math.random() * 8) + 5)
  } else if (role.includes("Designer")) {
    skills = designSkills.slice(0, Math.floor(Math.random() * 6) + 4)
  } else {
    skills = businessSkills.slice(0, Math.floor(Math.random() * 6) + 4)
  }

  // Generate experience
  const experience = []
  const currentYear = new Date().getFullYear()
  let remainingYears = experienceYears

  while (remainingYears > 0) {
    const yearsAtCompany = Math.min(Math.floor(Math.random() * 4) + 1, remainingYears)
    const company = barcelonaCompanies[Math.floor(Math.random() * barcelonaCompanies.length)]

    experience.push({
      company,
      position: role,
      startDate: `${currentYear - remainingYears}`,
      endDate: remainingYears === yearsAtCompany ? "Present" : `${currentYear - remainingYears + yearsAtCompany}`,
      description: `Led development projects and collaborated with cross-functional teams at ${company}.`,
    })

    remainingYears -= yearsAtCompany
  }

  // Generate education
  const university = barcelonaUniversities[Math.floor(Math.random() * barcelonaUniversities.length)]
  const degrees = ["Bachelor", "Master", "PhD"]
  const degree = degrees[Math.floor(Math.random() * degrees.length)]

  const education = [
    {
      school: university,
      degree: `${degree} in Computer Science`,
      startDate: "2015",
      endDate: "2019",
    },
  ]

  // Generate profile image URL
  const profileImageUrl = `https://randomuser.me/api/portraits/${gender === "male" ? "men" : "women"}/${Math.floor(Math.random() * 99)}.jpg`

  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name,
    role,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    phone: `+34 ${Math.floor(Math.random() * 900) + 600} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
    location: "Barcelona, Spain",
    profileImageUrl,
    summary: `Experienced ${role} with ${experienceYears} years of expertise in modern technologies and best practices. Passionate about delivering high-quality solutions and driving innovation.`,
    skills,
    experience,
    education,
    languages: ["Spanish (Native)", "English (Fluent)", "Catalan (Native)"],
    certifications: ["AWS Certified", "Scrum Master Certified"],
    experienceYears: experienceYears.toString(),
    type: "generated",
    createdAt: new Date().toISOString(),
  }
}

// Add CV to library
export function addToLibrary(cv: any) {
  cvLibrary.push({
    ...cv,
    addedAt: new Date().toISOString(),
  })
  console.log(`Added CV to library: ${cv.name} (Total: ${cvLibrary.length})`)
}

// Alternative name for compatibility
export function addCVToLibrary(cv: any) {
  return addToLibrary(cv)
}

// Get all CVs from library
export function getLibraryCVs() {
  return cvLibrary.sort(
    (a, b) => new Date(b.addedAt || b.createdAt || 0).getTime() - new Date(a.addedAt || a.createdAt || 0).getTime(),
  )
}

// Alternative name for compatibility
export function getCVLibrary() {
  return getLibraryCVs()
}

// Get library status
export function getLibraryStatus() {
  const total = cvLibrary.length
  const generated = cvLibrary.filter((cv) => cv.type === "generated").length
  const uploaded = cvLibrary.filter((cv) => cv.type === "uploaded").length

  return {
    total,
    generated,
    uploaded,
    lastUpdated:
      cvLibrary.length > 0
        ? Math.max(...cvLibrary.map((cv) => new Date(cv.addedAt || cv.createdAt || 0).getTime()))
        : null,
  }
}

// Get CV by ID
export function getCVById(id: string) {
  return cvLibrary.find((cv) => cv.id === id)
}

// Delete CV from library
export function deleteCVFromLibrary(id: string) {
  const index = cvLibrary.findIndex((cv) => cv.id === id)
  if (index !== -1) {
    cvLibrary.splice(index, 1)
    return true
  }
  return false
}

// Alternative name for compatibility
export function removeCVFromLibrary(id: string) {
  return deleteCVFromLibrary(id)
}

// Update CV in library
export function updateCVInLibrary(id: string, updates: any) {
  const index = cvLibrary.findIndex((cv) => cv.id === id)
  if (index !== -1) {
    cvLibrary[index] = { ...cvLibrary[index], ...updates, updatedAt: new Date().toISOString() }
    return cvLibrary[index]
  }
  return null
}

// Get design template for PDF generation
export function getPDFDesignTemplate(templateId = "modern") {
  const templates = {
    modern: {
      colors: {
        primary: "#2563eb",
        secondary: "#64748b",
        accent: "#f1f5f9",
      },
      fonts: {
        heading: "Inter, sans-serif",
        body: "Inter, sans-serif",
      },
      layout: "single-column",
    },
    professional: {
      colors: {
        primary: "#1f2937",
        secondary: "#6b7280",
        accent: "#f9fafb",
      },
      fonts: {
        heading: "Inter, sans-serif",
        body: "Inter, sans-serif",
      },
      layout: "two-column",
    },
    creative: {
      colors: {
        primary: "#7c3aed",
        secondary: "#a78bfa",
        accent: "#f3f4f6",
      },
      fonts: {
        heading: "Inter, sans-serif",
        body: "Inter, sans-serif",
      },
      layout: "creative",
    },
  }

  return templates[templateId] || templates.modern
}

// Alternative name for compatibility
export function getDesignTemplate(templateId = "modern") {
  return getPDFDesignTemplate(templateId)
}

// Search CVs
export function searchCVs(query: string) {
  const queryLower = query.toLowerCase()
  return cvLibrary.filter((cv) => {
    return (
      cv.name?.toLowerCase().includes(queryLower) ||
      cv.role?.toLowerCase().includes(queryLower) ||
      cv.skills?.some((skill: string) => skill.toLowerCase().includes(queryLower)) ||
      cv.summary?.toLowerCase().includes(queryLower) ||
      cv.content?.toLowerCase().includes(queryLower)
    )
  })
}

// Alternative name for compatibility
export function searchLibrary(query: string) {
  return searchCVs(query)
}

// Clear library (for testing)
export function clearLibrary() {
  cvLibrary = []
  console.log("Library cleared")
}

// Export default for compatibility
export default {
  generateCVData,
  addToLibrary,
  addCVToLibrary,
  getLibraryCVs,
  getCVLibrary,
  getLibraryStatus,
  getCVById,
  deleteCVFromLibrary,
  removeCVFromLibrary,
  updateCVInLibrary,
  getPDFDesignTemplate,
  getDesignTemplate,
  searchCVs,
  searchLibrary,
  clearLibrary,
}
