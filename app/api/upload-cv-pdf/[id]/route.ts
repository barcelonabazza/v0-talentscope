import { type NextRequest, NextResponse } from "next/server"
import { jsPDF } from "jspdf"
import { getLibraryCVs } from "@/lib/cv-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Find the uploaded CV in the library
    const libraryCVs = getLibraryCVs()
    const cv = libraryCVs.find((cv) => cv.id === params.id && cv.type === "uploaded")

    if (!cv) {
      return NextResponse.json({ error: "Uploaded CV not found" }, { status: 404 })
    }

    // Create PDF using jsPDF with the actual uploaded CV data
    const doc = new jsPDF()

    // Design colors for uploaded CVs
    const primaryColor = [37, 99, 235] // Blue
    const secondaryColor = [59, 130, 246]
    const accentColor = [29, 78, 216]
    const backgroundColor = [241, 245, 249]
    const textColor = [30, 41, 59]

    // Left sidebar background
    doc.setFillColor(backgroundColor[0], backgroundColor[1], backgroundColor[2])
    doc.rect(0, 0, 70, 297, "F")

    // Profile photo placeholder (initials)
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.circle(35, 40, 20, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    const initials = cv.name
      ? cv.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
      : "CV"
    doc.text(initials, 35, 45, { align: "center" })

    // Main content header
    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text(cv.name || "Uploaded CV", 80, 30)

    if (cv.role) {
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
      doc.setFontSize(16)
      doc.setFont("helvetica", "normal")
      doc.text(cv.role, 80, 42)
    }

    // Contact Information in sidebar
    let contactY = 70
    const contactX = 10

    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("CONTACT", contactX, contactY)

    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
    doc.setLineWidth(2)
    doc.line(contactX, contactY + 2, contactX + 50, contactY + 2)

    contactY += 15
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(textColor[0] * 0.7, textColor[1] * 0.7, textColor[2] * 0.7)

    const contactInfo = []
    if (cv.email) contactInfo.push(`Email: ${cv.email}`)
    if (cv.phone) contactInfo.push(`Phone: ${cv.phone}`)
    if (cv.location) contactInfo.push(`Location: ${cv.location}`)
    if (cv.linkedin) contactInfo.push(`LinkedIn: ${cv.linkedin}`)
    if (cv.github) contactInfo.push(`GitHub: ${cv.github}`)

    contactInfo.forEach((info) => {
      const lines = doc.splitTextToSize(info, 55)
      doc.text(lines, contactX, contactY)
      contactY += lines.length * 4 + 2
    })

    // Skills in sidebar
    if (cv.skills && cv.skills.length > 0) {
      contactY += 10
      doc.setTextColor(textColor[0], textColor[1], textColor[2])
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("SKILLS", contactX, contactY)

      doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
      doc.setLineWidth(2)
      doc.line(contactX, contactY + 2, contactX + 50, contactY + 2)

      contactY += 10
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(textColor[0] * 0.7, textColor[1] * 0.7, textColor[2] * 0.7)

      cv.skills.forEach((skill) => {
        doc.text(`• ${skill}`, contactX, contactY)
        contactY += 5
      })
    }

    // Languages in sidebar
    if (cv.languages && cv.languages.length > 0) {
      contactY += 10
      doc.setTextColor(textColor[0], textColor[1], textColor[2])
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("LANGUAGES", contactX, contactY)

      doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
      doc.setLineWidth(2)
      doc.line(contactX, contactY + 2, contactX + 50, contactY + 2)

      contactY += 10
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(textColor[0] * 0.7, textColor[1] * 0.7, textColor[2] * 0.7)

      cv.languages.forEach((lang) => {
        doc.text(`• ${lang}`, contactX, contactY)
        contactY += 5
      })
    }

    // Main content area
    let mainY = 60
    const mainX = 80
    const mainWidth = 115

    // Professional Summary
    if (cv.summary) {
      doc.setTextColor(textColor[0], textColor[1], textColor[2])
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("PROFESSIONAL SUMMARY", mainX, mainY)

      doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
      doc.setLineWidth(2)
      doc.line(mainX, mainY + 2, mainX + 80, mainY + 2)

      mainY += 12
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(textColor[0] * 0.8, textColor[1] * 0.8, textColor[2] * 0.8)
      const summaryLines = doc.splitTextToSize(cv.summary, mainWidth)
      doc.text(summaryLines, mainX, mainY)
      mainY += summaryLines.length * 5 + 15
    }

    // Work Experience
    if (cv.experience && cv.experience.length > 0) {
      doc.setTextColor(textColor[0], textColor[1], textColor[2])
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("WORK EXPERIENCE", mainX, mainY)

      doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
      doc.setLineWidth(2)
      doc.line(mainX, mainY + 2, mainX + 80, mainY + 2)
      mainY += 15

      cv.experience.forEach((job) => {
        if (mainY > 250) {
          doc.addPage()
          doc.setFillColor(backgroundColor[0], backgroundColor[1], backgroundColor[2])
          doc.rect(0, 0, 70, 297, "F")
          mainY = 30
        }

        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(textColor[0], textColor[1], textColor[2])
        doc.text(job.position || job.title || "Position", mainX, mainY)

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
        doc.text(`${job.company || "Company"} | ${job.duration || job.period || "Duration"}`, mainX, mainY + 7)
        if (job.location) {
          doc.text(job.location, mainX, mainY + 14)
          mainY += 20
        } else {
          mainY += 15
        }

        if (job.description) {
          doc.setTextColor(textColor[0] * 0.8, textColor[1] * 0.8, textColor[2] * 0.8)
          const descLines = doc.splitTextToSize(job.description, mainWidth)
          doc.text(descLines, mainX, mainY)
          mainY += descLines.length * 5 + 10
        }
      })
    }

    // Education
    if (cv.education && cv.education.length > 0) {
      if (mainY > 220) {
        doc.addPage()
        doc.setFillColor(backgroundColor[0], backgroundColor[1], backgroundColor[2])
        doc.rect(0, 0, 70, 297, "F")
        mainY = 30
      }

      doc.setTextColor(textColor[0], textColor[1], textColor[2])
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("EDUCATION", mainX, mainY)

      doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
      doc.setLineWidth(2)
      doc.line(mainX, mainY + 2, mainX + 80, mainY + 2)
      mainY += 15

      cv.education.forEach((edu) => {
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(textColor[0], textColor[1], textColor[2])
        doc.text(edu.degree || edu.qualification || "Degree", mainX, mainY)

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
        doc.text(
          `${edu.school || edu.institution || "Institution"} | ${edu.year || edu.period || "Year"}`,
          mainX,
          mainY + 7,
        )

        mainY += 12
        if (edu.details) {
          doc.setTextColor(textColor[0] * 0.8, textColor[1] * 0.8, textColor[2] * 0.8)
          const detailLines = doc.splitTextToSize(edu.details, mainWidth)
          doc.text(detailLines, mainX, mainY)
          mainY += detailLines.length * 5 + 10
        }
      })
    }

    const pdfBuffer = doc.output("arraybuffer")

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${cv.name?.replace(/\s+/g, "_") || "Uploaded_CV"}_CV.pdf"`,
        "Content-Length": pdfBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error("Error generating uploaded CV PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
