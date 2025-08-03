export interface CVProfile {
  id: string
  name: string
  role: string
  email: string
  phone: string
  location: string
  profileImageUrl: string
  summary: string
  experience: Array<{
    position: string
    company: string
    duration: string
    location: string
    description: string[]
  }>
  education: Array<{
    degree: string
    field: string
    institution: string
    duration: string
    location: string
  }>
  skills: string[]
  languages: string[]
  linkedin: string
  github: string
  portfolio: string
  gender?: string
  age?: number
  experienceYears?: number
  companies?: string[]
  university?: string
}

// In-memory storage for CVs
const cvStorage = new Map<string, CVProfile>()

// Barcelona tech companies
const barcelonaCompanies = [
  "Glovo",
  "Typeform",
  "Wallapop",
  "Letgo",
  "Travelperk",
  "Factorial",
  "Holded",
  "Camaloon",
  "Redbooth",
  "Kantox",
  "Carto",
  "Splice Machine",
  "Scytl",
  "Akamon Entertainment",
  "Social Point",
  "King Digital Entertainment",
  "Ubisoft Barcelona",
  "Gameloft",
  "Socialpoint",
  "Miniclip",
  "Sage",
  "Zurich Insurance",
  "Nestlé",
  "Danone",
  "Roche",
  "Novartis",
  "Amazon",
  "Microsoft",
  "Google",
  "Meta",
  "Apple",
  "IBM",
  "Oracle",
  "Accenture",
  "Deloitte",
  "PwC",
  "KPMG",
  "EY",
  "McKinsey & Company",
]

// Barcelona universities
const barcelonaUniversities = [
  "Universitat de Barcelona (UB)",
  "Universitat Autònoma de Barcelona (UAB)",
  "Universitat Politècnica de Catalunya (UPC)",
  "Universitat Pompeu Fabra (UPF)",
  "ESADE Business School",
  "IE University",
  "IESE Business School",
  "Universitat Ramon Llull (URL)",
  "Universitat Oberta de Catalunya (UOC)",
  "EAE Business School",
]

// Tech roles
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
  "Cloud Architect",
  "Tech Lead",
  "Engineering Manager",
  "Data Engineer",
  "Machine Learning Engineer",
  "Cybersecurity Specialist",
  "QA Engineer",
  "Site Reliability Engineer",
]

// Skills by category
const skillsByCategory = {
  frontend: [
    "React",
    "Vue.js",
    "Angular",
    "TypeScript",
    "JavaScript",
    "HTML5",
    "CSS3",
    "Sass",
    "Tailwind CSS",
    "Next.js",
  ],
  backend: ["Node.js", "Python", "Java", "C#", "Go", "Ruby", "PHP", "Express.js", "Django", "Spring Boot"],
  database: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Elasticsearch", "DynamoDB", "Cassandra"],
  cloud: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform", "Jenkins", "GitLab CI"],
  mobile: ["React Native", "Flutter", "Swift", "Kotlin", "Xamarin", "Ionic"],
  data: ["Python", "R", "SQL", "Pandas", "NumPy", "TensorFlow", "PyTorch", "Spark", "Tableau", "Power BI"],
}

// Male and female names for better photo matching
const maleNames = [
  "Alejandro García",
  "Carlos Rodríguez",
  "David López",
  "Daniel Martín",
  "Pablo González",
  "Adrián Sánchez",
  "Álvaro Pérez",
  "Sergio Gómez",
  "Jorge Jiménez",
  "Rubén Ruiz",
  "Iván Hernández",
  "Miguel Díaz",
  "Óscar Moreno",
  "Raúl Muñoz",
  "Fernando Álvarez",
  "Marc Fernández",
  "Jordi Romero",
  "Xavier Navarro",
  "Pau Torres",
  "Oriol Domínguez",
]

const femaleNames = [
  "María García",
  "Carmen Rodríguez",
  "Josefa López",
  "Isabel Martín",
  "Ana González",
  "Cristina Sánchez",
  "Marta Pérez",
  "Elena Gómez",
  "Laura Jiménez",
  "Sara Ruiz",
  "Andrea Hernández",
  "Paula Díaz",
  "Lucía Moreno",
  "Carla Muñoz",
  "Natalia Álvarez",
  "Núria Fernández",
  "Mireia Romero",
  "Laia Navarro",
  "Júlia Torres",
  "Ariadna Domínguez",
]

// Generate seeded random number
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Generate seeded random integer between min and max
function seededRandomInt(seed: number, min: number, max: number): number {
  return Math.floor(seededRandom(seed) * (max - min + 1)) + min
}

// Generate seeded random choice from array
function seededChoice<T>(seed: number, array: T[]): T {
  const index = seededRandomInt(seed, 0, array.length - 1)
  return array[index]
}

// Generate realistic profile image URL
function generateProfileImageUrl(seed: number, gender: string, age: number): string {
  // Use randomuser.me API for realistic photos
  const genderParam = gender === "male" ? "men" : "women"
  const photoId = seededRandomInt(seed, 1, 99)
  return `https://randomuser.me/api/portraits/${genderParam}/${photoId}.jpg`
}

// Generate professional summary
function generateSummary(role: string, experienceYears: number, skills: string[], seed: number): string {
  const summaryTemplates = [
    `Experienced ${role.toLowerCase()} with ${experienceYears}+ years of expertise in developing scalable applications and leading technical initiatives. Proven track record in ${skills.slice(0, 3).join(", ")} with a passion for innovation and continuous learning.`,
    `Results-driven ${role.toLowerCase()} specializing in ${skills.slice(0, 2).join(" and ")} with ${experienceYears} years of experience in the Barcelona tech ecosystem. Strong background in agile methodologies and cross-functional collaboration.`,
    `Senior ${role.toLowerCase()} with extensive experience in ${skills.slice(0, 3).join(", ")} and a proven ability to deliver high-quality solutions. ${experienceYears} years of experience working with international teams and cutting-edge technologies.`,
    `Passionate ${role.toLowerCase()} with ${experienceYears}+ years of experience building robust applications using ${skills.slice(0, 2).join(" and ")}. Committed to writing clean, maintainable code and mentoring junior developers.`,
  ]

  return seededChoice(seed + 100, summaryTemplates)
}

// Generate work experience
function generateExperience(role: string, experienceYears: number, seed: number): CVProfile["experience"] {
  const experience: CVProfile["experience"] = []
  let currentYear = 2024
  let remainingYears = experienceYears

  // Generate 2-4 positions
  const numPositions = Math.min(seededRandomInt(seed + 200, 2, 4), Math.ceil(experienceYears / 2))

  for (let i = 0; i < numPositions; i++) {
    const yearsAtCompany = Math.min(
      seededRandomInt(seed + 300 + i, 1, Math.max(1, Math.floor(remainingYears / (numPositions - i)))),
      remainingYears,
    )

    const company = seededChoice(seed + 400 + i, barcelonaCompanies)
    const startYear = currentYear - yearsAtCompany
    const endYear = i === 0 ? "Present" : currentYear.toString()

    const seniority = i === 0 ? "Senior" : i === 1 ? "Mid-level" : "Junior"
    const position = role.includes("Senior") ? role : `${seniority} ${role.replace("Senior ", "")}`

    const responsibilities = [
      `Led development of scalable web applications serving 100K+ users`,
      `Collaborated with cross-functional teams to deliver features on time`,
      `Implemented CI/CD pipelines reducing deployment time by 60%`,
      `Mentored junior developers and conducted code reviews`,
      `Optimized application performance resulting in 40% faster load times`,
      `Designed and implemented RESTful APIs and microservices architecture`,
      `Participated in agile development processes and sprint planning`,
    ]

    experience.push({
      position,
      company,
      duration: `${startYear} - ${endYear}`,
      location: "Barcelona, Spain",
      description: [
        seededChoice(seed + 500 + i, responsibilities),
        seededChoice(
          seed + 600 + i,
          responsibilities.filter((_, idx) => idx !== (seed + 500 + i) % responsibilities.length),
        ),
        seededChoice(
          seed + 700 + i,
          responsibilities.filter(
            (_, idx) =>
              idx !== (seed + 500 + i) % responsibilities.length && idx !== (seed + 600 + i) % responsibilities.length,
          ),
        ),
      ],
    })

    currentYear = startYear
    remainingYears -= yearsAtCompany
  }

  return experience
}

// Generate education
function generateEducation(seed: number): CVProfile["education"] {
  const degrees = [
    { degree: "Master's Degree", field: "Computer Science" },
    { degree: "Bachelor's Degree", field: "Software Engineering" },
    { degree: "Bachelor's Degree", field: "Computer Science" },
    { degree: "Master's Degree", field: "Data Science" },
    { degree: "Bachelor's Degree", field: "Information Technology" },
  ]

  const selectedDegree = seededChoice(seed + 800, degrees)
  const university = seededChoice(seed + 900, barcelonaUniversities)
  const graduationYear = seededRandomInt(seed + 1000, 2010, 2020)

  return [
    {
      degree: selectedDegree.degree,
      field: selectedDegree.field,
      institution: university,
      duration: `${graduationYear - 4} - ${graduationYear}`,
      location: "Barcelona, Spain",
    },
  ]
}

// Generate skills based on role
function generateSkills(role: string, seed: number): string[] {
  const skills: string[] = []

  // Add role-specific skills
  if (role.includes("Frontend") || role.includes("Full Stack")) {
    skills.push(
      ...seededChoice(seed + 1100, [skillsByCategory.frontend.slice(0, 4), skillsByCategory.frontend.slice(2, 6)]),
    )
  }

  if (role.includes("Backend") || role.includes("Full Stack")) {
    skills.push(
      ...seededChoice(seed + 1200, [skillsByCategory.backend.slice(0, 3), skillsByCategory.backend.slice(1, 4)]),
    )
  }

  if (role.includes("Data")) {
    skills.push(...seededChoice(seed + 1300, [skillsByCategory.data.slice(0, 4), skillsByCategory.data.slice(2, 6)]))
  }

  if (role.includes("Mobile")) {
    skills.push(
      ...seededChoice(seed + 1400, [skillsByCategory.mobile.slice(0, 3), skillsByCategory.mobile.slice(1, 4)]),
    )
  }

  // Add database and cloud skills
  skills.push(...skillsByCategory.database.slice(0, 2))
  skills.push(...skillsByCategory.cloud.slice(0, 3))

  // Remove duplicates and return
  return [...new Set(skills)].slice(0, 12)
}

export function generateCVData(id: string): CVProfile {
  // Check if CV already exists in storage
  if (cvStorage.has(id)) {
    return cvStorage.get(id)!
  }

  // Parse seed from ID
  const seed = Number.parseInt(id.split("-")[1]) || Math.floor(Math.random() * 10000)

  // Generate gender and age
  const gender = seededRandom(seed) > 0.5 ? "male" : "female"
  const age = seededRandomInt(seed + 50, 25, 44)
  const experienceYears = seededRandomInt(seed + 60, 3, Math.min(15, age - 22))

  // Generate name based on gender
  const name = gender === "male" ? seededChoice(seed + 10, maleNames) : seededChoice(seed + 20, femaleNames)

  // Generate role and other details
  const role = seededChoice(seed + 30, techRoles)
  const profileImageUrl = generateProfileImageUrl(seed + 40, gender, age)

  // Generate email from name
  const emailName = name
    .toLowerCase()
    .replace(/\s+/g, ".")
    .replace(/[áàä]/g, "a")
    .replace(/[éèë]/g, "e")
    .replace(/[íìï]/g, "i")
    .replace(/[óòö]/g, "o")
    .replace(/[úùü]/g, "u")
  const emailDomains = ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com"]
  const email = `${emailName}@${seededChoice(seed + 70, emailDomains)}`

  // Generate phone
  const phone = `+34 ${seededRandomInt(seed + 80, 600, 699)} ${seededRandomInt(seed + 90, 100, 999)} ${seededRandomInt(seed + 95, 100, 999)}`

  // Generate skills and experience
  const skills = generateSkills(role, seed)
  const experience = generateExperience(role, experienceYears, seed)
  const education = generateEducation(seed)

  // Extract companies from experience
  const companies = experience.map((exp) => exp.company)
  const university = education[0]?.institution || ""

  const cv: CVProfile = {
    id,
    name,
    role,
    email,
    phone,
    location: "Barcelona, Spain",
    profileImageUrl,
    summary: generateSummary(role, experienceYears, skills, seed),
    experience,
    education,
    skills,
    languages: ["Spanish (Native)", "English (Fluent)", "Catalan (Fluent)"],
    linkedin: `https://linkedin.com/in/${emailName}`,
    github: `https://github.com/${emailName.split(".")[0]}`,
    portfolio: `https://${emailName.split(".")[0]}.dev`,
    gender,
    age,
    experienceYears,
    companies,
    university,
  }

  // Store in memory
  cvStorage.set(id, cv)
  console.log(`Generated and stored CV: ${cv.name} (${cv.id})`)

  return cv
}

export function addToLibrary(cvData: CVProfile): void {
  cvStorage.set(cvData.id, cvData)
  console.log(`Added CV to library: ${cvData.name} (${cvData.id})`)
}

export function getCVProfile(id: string): CVProfile | null {
  const cv = cvStorage.get(id)
  if (cv) {
    console.log(`Retrieved CV from library: ${cv.name} (${cv.id})`)
    return cv
  } else {
    console.log(`CV not found in library: ${id}`)
    return null
  }
}

export function getAllCVs(): CVProfile[] {
  const cvs = Array.from(cvStorage.values())
  console.log(`Retrieved ${cvs.length} CVs from library`)
  return cvs
}

export function deleteCVProfile(id: string): boolean {
  const deleted = cvStorage.delete(id)
  if (deleted) {
    console.log(`Deleted CV from library: ${id}`)
  } else {
    console.log(`Failed to delete CV (not found): ${id}`)
  }
  return deleted
}

export function searchCVs(query: string): CVProfile[] {
  const allCVs = getAllCVs()
  const searchTerms = query.toLowerCase().split(" ")

  return allCVs.filter((cv) => {
    const searchableText =
      `${cv.name} ${cv.role} ${cv.skills.join(" ")} ${cv.companies?.join(" ") || ""} ${cv.summary}`.toLowerCase()
    return searchTerms.some((term) => searchableText.includes(term))
  })
}
