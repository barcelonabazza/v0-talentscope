import { type NextRequest, NextResponse } from "next/server"
import { jsPDF } from "jspdf"

// Store generated CV data to ensure consistency
const cvDataStore = new Map<string, any>()

// Enhanced CV data with Barcelona-specific companies and realistic profiles
const getCVData = (id: string) => {
  // Check if we already have this CV data stored
  if (cvDataStore.has(id)) {
    return cvDataStore.get(id)
  }

  const barcelonaCompanies = [
    "Glovo",
    "Typeform",
    "Wallapop",
    "TravelPerk",
    "Factorial",
    "Holded",
    "Camaloon",
    "Badi",
    "Kantox",
    "Redbooth",
    "Scytl",
    "Adevinta",
    "Softonic",
    "Privalia",
    "Vueling",
    "Seat",
    "Mango",
    "Desigual",
    "Cuatrecasas",
    "Banco Sabadell",
    "CaixaBank",
    "Agbar",
    "Naturgy",
    "Almirall",
    "Grifols",
    "Fluidra",
  ]

  const remoteCompanies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "Netflix",
    "Spotify",
    "Uber",
    "Airbnb",
    "Stripe",
    "GitHub",
    "Shopify",
    "Slack",
    "Zoom",
    "Figma",
  ]

  const universities = [
    "Universitat Politècnica de Catalunya (UPC)",
    "Universitat de Barcelona (UB)",
    "Universitat Autònoma de Barcelona (UAB)",
    "Universitat Pompeu Fabra (UPF)",
    "ESADE Business School",
    "IESE Business School",
    "IE University",
    "Universidad Carlos III de Madrid",
    "Universidad Politécnica de Madrid",
  ]

  const neighborhoods = [
    "Eixample",
    "Gràcia",
    "Sarrià-Sant Gervasi",
    "Sant Martí",
    "Ciutat Vella",
    "Les Corts",
    "Sants-Montjuïc",
    "Horta-Guinardó",
    "Poblenou",
    "El Born",
  ]

  const roles = [
    "Senior Frontend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "Product Manager",
    "UX/UI Designer",
    "DevOps Engineer",
    "Backend Developer",
    "Mobile Developer",
    "Machine Learning Engineer",
    "Cloud Architect",
    "Cybersecurity Specialist",
    "Digital Marketing Manager",
    "Business Analyst",
    "Scrum Master",
    "Tech Lead",
  ]

  // Parse the actual ID to get the correct profile
  const parts = id.split("-")
  const timestamp = parts[0]
  const index = Number.parseInt(parts[1]) || 0

  // Use the same expanded name lists as generate-cvs
  const firstNames = [
    "Maria",
    "David",
    "Laura",
    "Carlos",
    "Ana",
    "Miguel",
    "Elena",
    "Javier",
    "Carmen",
    "Antonio",
    "Isabel",
    "Francisco",
    "Pilar",
    "Manuel",
    "Rosa",
    "José",
    "Dolores",
    "Juan",
    "Antonia",
    "Pedro",
    "Marta",
    "Alejandro",
    "Cristina",
    "Fernando",
    "Patricia",
    "Rafael",
    "Beatriz",
    "Sergio",
    "Nuria",
    "Alberto",
    "Lucía",
    "Pablo",
    "Sofía",
    "Diego",
    "Valentina",
    "Adrián",
    "Isabella",
    "Nicolás",
    "Camila",
    "Sebastián",
    "Gabriela",
    "Mateo",
    "Valeria",
    "Santiago",
    "Natalia",
    "Emilio",
    "Andrea",
    "Ricardo",
    "Paola",
    "Andrés",
  ]

  const lastNames = [
    "García",
    "Martínez",
    "López",
    "Sánchez",
    "González",
    "Pérez",
    "Rodríguez",
    "Fernández",
    "Gómez",
    "Díaz",
    "Ruiz",
    "Hernández",
    "Jiménez",
    "Álvarez",
    "Moreno",
    "Muñoz",
    "Alonso",
    "Romero",
    "Navarro",
    "Gutiérrez",
    "Torres",
    "Domínguez",
    "Vázquez",
    "Ramos",
    "Gil",
    "Ramírez",
    "Serrano",
    "Blanco",
    "Molina",
    "Castro",
    "Ortega",
    "Delgado",
    "Morales",
    "Jiménez",
    "Vargas",
    "Herrera",
    "Medina",
    "Aguilar",
    "Cortés",
    "Silva",
    "Mendoza",
    "Peña",
    "Flores",
    "Reyes",
    "Cruz",
  ]

  // Use the timestamp as seed to recreate the exact same random selections
  const seed = Number.parseInt(timestamp) || Date.now()

  // Recreate the same random selections using the seed
  const firstNameIndex = seed % firstNames.length
  const lastName1Index = (seed * 2) % lastNames.length
  const lastName2Index = (seed * 3) % lastNames.length

  const firstName = firstNames[firstNameIndex]
  const lastName1 = lastNames[lastName1Index]
  const lastName2 = lastNames[lastName2Index]
  const fullName = `${firstName} ${lastName1} ${lastName2}`

  const role = roles[seed % roles.length]
  const experience = Math.floor((seed % 8) + 3) // 3-10 years
  const neighborhood = neighborhoods[seed % neighborhoods.length]
  const university = universities[seed % universities.length]

  const gender = [
    "Maria",
    "Laura",
    "Ana",
    "Elena",
    "Carmen",
    "Isabel",
    "Pilar",
    "Rosa",
    "Dolores",
    "Antonia",
    "Marta",
    "Cristina",
    "Patricia",
    "Beatriz",
    "Nuria",
    "Lucía",
    "Sofía",
    "Valentina",
    "Isabella",
    "Camila",
    "Gabriela",
    "Valeria",
    "Natalia",
    "Andrea",
    "Paola",
    "Andrés",
  ].includes(firstName)
    ? "female"
    : "male"

  const cvData = {
    name: fullName,
    gender,
    role,
    email: `${firstName.toLowerCase()}.${lastName1.toLowerCase()}@email.com`,
    phone: `+34 6${Math.floor((seed % 90) + 10)} ${Math.floor((seed % 900) + 100)} ${Math.floor((seed % 900) + 100)}`,
    location: `${neighborhood}, Barcelona`,
    linkedin: `linkedin.com/in/${firstName.toLowerCase()}-${lastName1.toLowerCase()}-${role.toLowerCase().replace(/\s+/g, "")}`,
    github: `github.com/${firstName.toLowerCase()}${lastName1.toLowerCase()}`,
    portfolio: `${firstName.toLowerCase()}${lastName1.toLowerCase()}.dev`,
    summary: `Experienced ${role} with ${experience}+ years in Barcelona's tech industry. Graduated from ${university} and worked at leading companies. Proven track record of delivering high-quality solutions and driving business growth.`,
    skills: ["React", "TypeScript", "JavaScript", "Python", "Node.js", "AWS", "Docker", "Git"],
    experience: [
      {
        company: barcelonaCompanies[seed % barcelonaCompanies.length],
        position: role,
        duration: "2021 - Present",
        location: "Barcelona, Spain",
        description:
          "Led development of key features and improvements, resulting in increased user engagement. Collaborated with cross-functional teams to deliver high-quality solutions.",
      },
      {
        company: barcelonaCompanies[(seed + 1) % barcelonaCompanies.length],
        position: role.replace("Senior ", ""),
        duration: "2019 - 2021",
        location: "Barcelona, Spain",
        description:
          "Developed and maintained applications. Collaborated with teams to implement designs and optimize performance.",
      },
    ],
    education: [
      {
        degree: "Master's in Computer Science",
        school: university,
        year: "2018",
        details: "Specialized in Web Technologies and Software Engineering",
      },
    ],
    languages: ["Spanish (Native)", "English (Fluent)", "Catalan (Fluent)"],
    certifications: ["AWS Certified Developer", "Google Analytics Certified"],
  }

  // Store the data for consistency
  cvDataStore.set(id, cvData)
  return cvData
}

const getDesignTemplate = (seed: number) => {
  const templates = [
    {
      name: "Modern Blue",
      primaryColor: [41, 128, 185],
      secondaryColor: [52, 152, 219],
      accentColor: [231, 76, 60],
      backgroundColor: [236, 240, 241],
      textColor: [44, 62, 80],
      layout: "sidebar-left",
    },
    {
      name: "Professional Green",
      primaryColor: [39, 174, 96],
      secondaryColor: [46, 204, 113],
      accentColor: [230, 126, 34],
      backgroundColor: [248, 249, 250],
      textColor: [33, 37, 41],
      layout: "sidebar-right",
    },
    {
      name: "Creative Purple",
      primaryColor: [142, 68, 173],
      secondaryColor: [155, 89, 182],
      accentColor: [241, 196, 15],
      backgroundColor: [253, 254, 255],
      textColor: [73, 80, 87],
      layout: "header-top",
    },
    {
      name: "Corporate Navy",
      primaryColor: [52, 73, 94],
      secondaryColor: [44, 62, 80],
      accentColor: [26, 188, 156],
      backgroundColor: [245, 246, 250],
      textColor: [33, 37, 41],
      layout: "sidebar-left",
    },
    {
      name: "Tech Orange",
      primaryColor: [230, 126, 34],
      secondaryColor: [243, 156, 18],
      accentColor: [52, 152, 219],
      backgroundColor: [250, 251, 252],
      textColor: [52, 58, 64],
      layout: "sidebar-right",
    },
  ]

  return templates[seed % templates.length]
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cvData = getCVData(params.id)
    const seed = Number.parseInt(params.id.split("-")[0] || "0") || 0
    const design = getDesignTemplate(seed)

    // Create PDF using the same logic as download route
    const doc = new jsPDF()

    // Apply design template colors
    const [primaryR, primaryG, primaryB] = design.primaryColor
    const [secondaryR, secondaryG, secondaryB] = design.secondaryColor
    const [accentR, accentG, accentB] = design.accentColor
    const [bgR, bgG, bgB] = design.backgroundColor
    const [textR, textG, textB] = design.textColor

    // Layout-specific rendering
    if (design.layout === "sidebar-left") {
      doc.setFillColor(bgR, bgG, bgB)
      doc.rect(0, 0, 70, 297, "F")

      doc.setFillColor(primaryR, primaryG, primaryB)
      doc.circle(35, 40, 20, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      const initials = cvData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
      doc.text(initials, 35, 45, { align: "center" })

      doc.setTextColor(textR, textG, textB)
      doc.setFontSize(24)
      doc.setFont("helvetica", "bold")
      doc.text(cvData.name, 80, 30)

      doc.setTextColor(secondaryR, secondaryG, secondaryB)
      doc.setFontSize(16)
      doc.setFont("helvetica", "normal")
      doc.text(cvData.role, 80, 42)
    } else if (design.layout === "sidebar-right") {
      doc.setFillColor(bgR, bgG, bgB)
      doc.rect(140, 0, 70, 297, "F")

      doc.setFillColor(primaryR, primaryG, primaryB)
      doc.circle(175, 40, 20, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      const initials = cvData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
      doc.text(initials, 175, 45, { align: "center" })

      doc.setTextColor(textR, textG, textB)
      doc.setFontSize(24)
      doc.setFont("helvetica", "bold")
      doc.text(cvData.name, 20, 30)

      doc.setTextColor(secondaryR, secondaryG, secondaryB)
      doc.setFontSize(16)
      doc.setFont("helvetica", "normal")
      doc.text(cvData.role, 20, 42)
    } else {
      doc.setFillColor(primaryR, primaryG, primaryB)
      doc.rect(0, 0, 210, 60, "F")

      doc.setFillColor(255, 255, 255)
      doc.circle(35, 30, 18, "F")
      doc.setTextColor(primaryR, primaryG, primaryB)
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      const initials = cvData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
      doc.text(initials, 35, 35, { align: "center" })

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(22)
      doc.setFont("helvetica", "bold")
      doc.text(cvData.name, 60, 25)

      doc.setFontSize(14)
      doc.setFont("helvetica", "normal")
      doc.text(cvData.role, 60, 35)
    }

    // Contact Information
    let contactY = design.layout === "header-top" ? 80 : 70
    const contactX = design.layout === "sidebar-right" ? 145 : 10

    doc.setTextColor(textR, textG, textB)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("CONTACT", contactX, contactY)

    contactY += 10
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(textR * 0.7, textG * 0.7, textB * 0.7)

    const contactInfo = [cvData.email, cvData.phone, cvData.location, cvData.linkedin, cvData.github, cvData.portfolio]

    contactInfo.forEach((info) => {
      const lines = doc.splitTextToSize(info, design.layout === "sidebar-right" ? 55 : 55)
      doc.text(lines, contactX, contactY)
      contactY += lines.length * 4 + 2
    })

    // Skills
    contactY += 10
    doc.setTextColor(textR, textG, textB)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("SKILLS", contactX, contactY)

    contactY += 10
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(textR * 0.7, textG * 0.7, textB * 0.7)

    cvData.skills.forEach((skill) => {
      doc.text(`• ${skill}`, contactX, contactY)
      contactY += 5
    })

    // Languages
    contactY += 10
    doc.setTextColor(textR, textG, textB)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("LANGUAGES", contactX, contactY)

    contactY += 10
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(textR * 0.7, textG * 0.7, textB * 0.7)

    cvData.languages.forEach((lang) => {
      doc.text(`• ${lang}`, contactX, contactY)
      contactY += 5
    })

    // Main content area
    let mainY = design.layout === "header-top" ? 80 : 60
    const mainX = design.layout === "sidebar-right" ? 20 : 80
    const mainWidth = design.layout === "sidebar-right" ? 115 : 115

    // Professional Summary
    doc.setTextColor(textR, textG, textB)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("PROFESSIONAL SUMMARY", mainX, mainY)

    doc.setDrawColor(accentR, accentG, accentB)
    doc.setLineWidth(2)
    doc.line(mainX, mainY + 2, mainX + 80, mainY + 2)

    mainY += 12
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(textR * 0.8, textG * 0.8, textB * 0.8)
    const summaryLines = doc.splitTextToSize(cvData.summary, mainWidth)
    doc.text(summaryLines, mainX, mainY)
    mainY += summaryLines.length * 5 + 15

    // Work Experience
    doc.setTextColor(textR, textG, textB)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("WORK EXPERIENCE", mainX, mainY)

    doc.setDrawColor(accentR, accentG, accentB)
    doc.setLineWidth(2)
    doc.line(mainX, mainY + 2, mainX + 80, mainY + 2)
    mainY += 15

    cvData.experience.forEach((job) => {
      if (mainY > 250) {
        doc.addPage()
        if (design.layout === "sidebar-left") {
          doc.setFillColor(bgR, bgG, bgB)
          doc.rect(0, 0, 70, 297, "F")
        } else if (design.layout === "sidebar-right") {
          doc.setFillColor(bgR, bgG, bgB)
          doc.rect(140, 0, 70, 297, "F")
        }
        mainY = 30
      }

      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(textR, textG, textB)
      doc.text(job.position, mainX, mainY)

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(secondaryR, secondaryG, secondaryB)
      doc.text(`${job.company} | ${job.duration}`, mainX, mainY + 7)
      doc.text(job.location, mainX, mainY + 14)

      mainY += 20
      doc.setTextColor(textR * 0.8, textG * 0.8, textB * 0.8)
      const descLines = doc.splitTextToSize(job.description, mainWidth)
      doc.text(descLines, mainX, mainY)
      mainY += descLines.length * 5 + 10
    })

    // Education
    if (mainY > 220) {
      doc.addPage()
      if (design.layout === "sidebar-left") {
        doc.setFillColor(bgR, bgG, bgB)
        doc.rect(0, 0, 70, 297, "F")
      } else if (design.layout === "sidebar-right") {
        doc.setFillColor(bgR, bgG, bgB)
        doc.rect(140, 0, 70, 297, "F")
      }
      mainY = 30
    }

    doc.setTextColor(textR, textG, textB)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("EDUCATION", mainX, mainY)

    doc.setDrawColor(accentR, accentG, accentB)
    doc.setLineWidth(2)
    doc.line(mainX, mainY + 2, mainX + 80, mainY + 2)
    mainY += 15

    cvData.education.forEach((edu) => {
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(textR, textG, textB)
      doc.text(edu.degree, mainX, mainY)

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(secondaryR, secondaryG, secondaryB)
      doc.text(`${edu.school} | ${edu.year}`, mainX, mainY + 7)

      mainY += 12
      doc.setTextColor(textR * 0.8, textG * 0.8, textB * 0.8)
      const detailLines = doc.splitTextToSize(edu.details, mainWidth)
      doc.text(detailLines, mainX, mainY)
      mainY += detailLines.length * 5 + 10
    })

    // Certifications
    if (cvData.certifications && cvData.certifications.length > 0) {
      mainY += 5
      doc.setTextColor(textR, textG, textB)
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("CERTIFICATIONS", mainX, mainY)

      doc.setDrawColor(accentR, accentG, accentB)
      doc.setLineWidth(2)
      doc.line(mainX, mainY + 2, mainX + 80, mainY + 2)
      mainY += 12

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(textR * 0.8, textG * 0.8, textB * 0.8)

      cvData.certifications.forEach((cert) => {
        doc.text(`• ${cert}`, mainX, mainY)
        mainY += 6
      })
    }

    const pdfBuffer = doc.output("arraybuffer")

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="preview.pdf"',
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  } catch (error) {
    console.error("Error generating PDF preview:", error)
    return NextResponse.json({ error: "Failed to generate PDF preview" }, { status: 500 })
  }
}
