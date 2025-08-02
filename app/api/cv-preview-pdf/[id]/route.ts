import { type NextRequest, NextResponse } from "next/server"
import { jsPDF } from "jspdf"
import { generateCVData, getPDFDesignTemplate } from "@/lib/cv-data"

// Function to convert image URL to base64
async function getImageAsBase64(imageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) return null

    const arrayBuffer = await response.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    return `data:image/jpeg;base64,${base64}`
  } catch (error) {
    console.error("Error fetching image:", error)
    return null
  }
}

// This generates the actual PDF that will be used for BOTH preview and download
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Use the centralized CV data generation function
    const cvData = generateCVData(params.id)
    const seed = Number.parseInt(params.id.split("-")[0] || "0") || 0
    const design = getPDFDesignTemplate(seed)

    // Create new PDF document
    const doc = new jsPDF()

    // Apply design template colors
    const [primaryR, primaryG, primaryB] = design.primaryColor
    const [secondaryR, secondaryG, secondaryB] = design.secondaryColor
    const [accentR, accentG, accentB] = design.accentColor
    const [bgR, bgG, bgB] = design.backgroundColor
    const [textR, textG, textB] = design.textColor

    // Try to get the profile image as base64
    let profileImageBase64: string | null = null
    if (cvData.profileImageUrl) {
      profileImageBase64 = await getImageAsBase64(cvData.profileImageUrl)
    }

    // Layout-specific rendering - using sidebar-left as the main template
    // Left sidebar design
    doc.setFillColor(bgR, bgG, bgB)
    doc.rect(0, 0, 70, 297, "F")

    // Profile photo - either actual image or placeholder
    if (profileImageBase64) {
      try {
        // Add the actual profile image
        doc.addImage(profileImageBase64, "JPEG", 15, 20, 40, 40, undefined, "FAST")

        // Add a circular mask effect by drawing a white rectangle around it
        doc.setFillColor(bgR, bgG, bgB)
        // Top
        doc.rect(15, 20, 40, 5, "F")
        // Bottom
        doc.rect(15, 55, 40, 5, "F")
        // Left curve
        doc.rect(15, 25, 5, 30, "F")
        // Right curve
        doc.rect(50, 25, 5, 30, "F")
      } catch (imageError) {
        console.error("Error adding image to PDF:", imageError)
        // Fallback to initials circle
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
      }
    } else {
      // Fallback to initials circle
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
    }

    // Header - Name and Role
    doc.setTextColor(textR, textG, textB)
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text(cvData.name, 80, 30)

    doc.setTextColor(secondaryR, secondaryG, secondaryB)
    doc.setFontSize(16)
    doc.setFont("helvetica", "normal")
    doc.text(cvData.role, 80, 42)

    // Contact Information in sidebar
    let contactY = 70
    const contactX = 10

    doc.setTextColor(textR, textG, textB)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("CONTACT", contactX, contactY)

    doc.setDrawColor(accentR, accentG, accentB)
    doc.setLineWidth(2)
    doc.line(contactX, contactY + 2, contactX + 50, contactY + 2)

    contactY += 15
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(textR * 0.7, textG * 0.7, textB * 0.7)

    const contactInfo = [cvData.email, cvData.phone, cvData.location, cvData.linkedin, cvData.github, cvData.portfolio]

    contactInfo.forEach((info) => {
      const lines = doc.splitTextToSize(info, 55)
      doc.text(lines, contactX, contactY)
      contactY += lines.length * 4 + 2
    })

    // Skills
    contactY += 10
    doc.setTextColor(textR, textG, textB)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("SKILLS", contactX, contactY)

    doc.setDrawColor(accentR, accentG, accentB)
    doc.setLineWidth(2)
    doc.line(contactX, contactY + 2, contactX + 50, contactY + 2)

    contactY += 10
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(textR * 0.7, textG * 0.7, textB * 0.7)

    // Ensure skills is an array before iterating
    if (Array.isArray(cvData.skills)) {
      cvData.skills.forEach((skill) => {
        doc.text(`• ${skill}`, contactX, contactY)
        contactY += 5
      })
    }

    // Languages
    contactY += 10
    doc.setTextColor(textR, textG, textB)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("LANGUAGES", contactX, contactY)

    doc.setDrawColor(accentR, accentG, accentB)
    doc.setLineWidth(2)
    doc.line(contactX, contactY + 2, contactX + 50, contactY + 2)

    contactY += 10
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(textR * 0.7, textG * 0.7, textB * 0.7)

    // Ensure languages is an array before iterating
    if (Array.isArray(cvData.languages)) {
      cvData.languages.forEach((lang) => {
        doc.text(`• ${lang}`, contactX, contactY)
        contactY += 5
      })
    }

    // Main content area
    let mainY = 60
    const mainX = 80
    const mainWidth = 115

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
    const summaryLines = doc.splitTextToSize(cvData.summary || "", mainWidth)
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

    // Ensure experience is an array before iterating
    if (Array.isArray(cvData.experience)) {
      cvData.experience.forEach((job) => {
        if (mainY > 250) {
          doc.addPage()
          doc.setFillColor(bgR, bgG, bgB)
          doc.rect(0, 0, 70, 297, "F")
          mainY = 30
        }

        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(textR, textG, textB)
        doc.text(job.position || "", mainX, mainY)

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(secondaryR, secondaryG, secondaryB)
        doc.text(`${job.company || ""} | ${job.duration || ""}`, mainX, mainY + 7)
        doc.text(job.location || "", mainX, mainY + 14)

        mainY += 20
        doc.setTextColor(textR * 0.8, textG * 0.8, textB * 0.8)
        const descLines = doc.splitTextToSize(job.description || "", mainWidth)
        doc.text(descLines, mainX, mainY)
        mainY += descLines.length * 5 + 10
      })
    }

    // Education
    if (mainY > 220) {
      doc.addPage()
      doc.setFillColor(bgR, bgG, bgB)
      doc.rect(0, 0, 70, 297, "F")
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

    // Ensure education is an array before iterating
    if (Array.isArray(cvData.education)) {
      cvData.education.forEach((edu) => {
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(textR, textG, textB)
        doc.text(edu.degree || "", mainX, mainY)

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(secondaryR, secondaryG, secondaryB)
        doc.text(`${edu.school || ""} | ${edu.year || ""}`, mainX, mainY + 7)

        mainY += 12
        doc.setTextColor(textR * 0.8, textG * 0.8, textB * 0.8)
        const detailLines = doc.splitTextToSize(edu.details || "", mainWidth)
        doc.text(detailLines, mainX, mainY)
        mainY += detailLines.length * 5 + 10
      })
    }

    // Generate PDF buffer
    const pdfBuffer = doc.output("arraybuffer")

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="preview.pdf"',
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Error generating PDF preview:", error)
    return NextResponse.json({ error: "Failed to generate PDF preview" }, { status: 500 })
  }
}
