import { type NextRequest, NextResponse } from "next/server"
import { getCVById, getDesignTemplate } from "@/lib/cv-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    console.log(`Download request for CV ID: ${id}`)

    if (!id) {
      console.error("No CV ID provided")
      return new NextResponse("CV ID is required", { status: 400 })
    }

    // Get CV from library
    const cv = getCVById(id)

    if (!cv) {
      console.error(`CV not found for ID: ${id}`)
      return new NextResponse("CV not found", { status: 404 })
    }

    console.log(`Found CV: ${cv.name} (type: ${cv.type})`)

    // For uploaded CVs, return the original PDF
    if (cv.type === "uploaded" && cv.pdfData) {
      console.log("Returning uploaded PDF data")
      const pdfBuffer = Buffer.from(cv.pdfData, "base64")

      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${cv.name.replace(/\s+/g, "_")}_CV.pdf"`,
          "Cache-Control": "public, max-age=3600",
        },
      })
    }

    // For generated CVs, create HTML that can be printed to PDF
    console.log("Generating HTML for generated CV")
    const seed = Number.parseInt(id.split("-")[0]) || Date.now()
    const template = getDesignTemplate(seed)

    const htmlContent = generatePrintableHTML(cv, template)

    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="${cv.name.replace(/\s+/g, "_")}_CV.html"`,
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Error in download-cv route:", error)
    return new NextResponse(`Internal server error: ${error.message}`, { status: 500 })
  }
}

function generatePrintableHTML(cv: any, template: any): string {
  const {
    name,
    role,
    email,
    phone,
    location,
    linkedin,
    github,
    portfolio,
    summary,
    skills = [],
    experience = [],
    education = [],
    languages = [],
    certifications = [],
    profileImageUrl,
  } = cv

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - CV</title>
    <link href="https://fonts.googleapis.com/css2?family=${template.fontFamily.replace(" ", "+")}:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: '${template.fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: ${template.textColor};
            background: white;
            font-size: 12px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        .cv-container {
            width: 100%;
            max-width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: white;
            display: grid;
            grid-template-columns: 280px 1fr;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .sidebar {
            background: ${template.gradient};
            color: white;
            padding: 30px 25px;
        }
        
        .main-content {
            padding: 30px 25px;
            background: white;
        }
        
        .profile-section {
            text-align: center;
            margin-bottom: 25px;
        }
        
        .profile-image {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid rgba(255,255,255,0.9);
            margin-bottom: 15px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .profile-fallback {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 700;
            margin: 0 auto 15px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .profile-name {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 6px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        
        .profile-role {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 15px;
        }
        
        .contact-info {
            margin-bottom: 25px;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            font-size: 11px;
            padding: 6px;
            border-radius: 4px;
            background: rgba(255,255,255,0.1);
            word-break: break-all;
        }
        
        .contact-icon {
            width: 16px;
            height: 16px;
            margin-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.2);
            border-radius: 3px;
            font-size: 8px;
            flex-shrink: 0;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 15px;
            color: ${template.primaryColor};
            border-bottom: 2px solid ${template.accentColor};
            padding-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .sidebar .section-title {
            color: white;
            border-bottom-color: rgba(255,255,255,0.3);
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
            gap: 6px;
            margin-bottom: 15px;
        }
        
        .skill-item {
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: 500;
            text-align: center;
            border: 1px solid rgba(255,255,255,0.3);
        }
        
        .experience-item, .education-item {
            margin-bottom: 18px;
            padding: 12px;
            border-left: 4px solid ${template.accentColor};
            background: ${template.backgroundColor};
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .item-title {
            font-size: 13px;
            font-weight: 600;
            color: ${template.primaryColor};
            margin-bottom: 4px;
            line-height: 1.3;
        }
        
        .item-company, .item-school {
            font-size: 11px;
            font-weight: 500;
            color: ${template.secondaryColor};
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .item-duration {
            font-size: 9px;
            color: ${template.secondaryColor};
            font-weight: 500;
            margin-bottom: 8px;
            display: inline-block;
            background: white;
            padding: 2px 6px;
            border-radius: 8px;
            border: 1px solid ${template.accentColor};
        }
        
        .item-description {
            font-size: 10px;
            line-height: 1.4;
            color: ${template.textColor};
            text-align: justify;
        }
        
        .summary {
            font-size: 11px;
            line-height: 1.5;
            text-align: justify;
            margin-bottom: 20px;
            background: ${template.backgroundColor};
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid ${template.accentColor};
        }
        
        .languages-list, .certifications-list {
            list-style: none;
        }
        
        .languages-list li, .certifications-list li {
            margin-bottom: 8px;
            font-size: 10px;
            position: relative;
            padding: 6px 8px 6px 20px;
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
        }
        
        .languages-list li:before {
            content: "🌐";
            position: absolute;
            left: 6px;
            font-size: 8px;
        }
        
        .certifications-list li:before {
            content: "🏆";
            position: absolute;
            left: 6px;
            font-size: 8px;
        }
        
        @page {
            size: A4;
            margin: 0.5in;
        }
        
        @media print {
            body {
                font-size: 11px;
            }
            
            .cv-container {
                width: 100%;
                height: 100vh;
                box-shadow: none;
            }
        }
        
        .print-instructions {
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 8px;
            padding: 20px;
            margin: 20px auto;
            max-width: 600px;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .print-button {
            background: #0ea5e9;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin: 10px;
        }
        
        .print-button:hover {
            background: #0284c7;
        }
        
        @media print {
            .print-instructions {
                display: none;
            }
        }
    </style>
    <script>
        function printToPDF() {
            window.print();
        }
        
        // Auto-trigger print dialog after page loads
        window.addEventListener('load', function() {
            setTimeout(function() {
                printToPDF();
            }, 1000);
        });
    </script>
</head>
<body>
    <div class="print-instructions">
        <h2 style="color: #0ea5e9; margin-bottom: 10px;">📄 CV Ready for Download</h2>
        <p style="margin-bottom: 15px;">This CV is formatted for printing to PDF. Click the button below or use Ctrl+P (Cmd+P on Mac) to save as PDF.</p>
        <button class="print-button" onclick="printToPDF()">🖨️ Print to PDF</button>
        <p style="font-size: 14px; color: #666; margin-top: 10px;">
            <strong>Tip:</strong> In the print dialog, select "Save as PDF" as your destination for best results.
        </p>
    </div>

    <div class="cv-container">
        <div class="sidebar">
            <div class="profile-section">
                ${
                  profileImageUrl
                    ? `<img src="${profileImageUrl}" alt="${name}" class="profile-image">`
                    : `
                <div class="profile-fallback">
                    ${name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)}
                </div>`
                }
                <h1 class="profile-name">${name}</h1>
                <p class="profile-role">${role}</p>
            </div>
            
            <div class="contact-info">
                <div class="contact-item">
                    <span class="contact-icon">📧</span>
                    <span>${email}</span>
                </div>
                <div class="contact-item">
                    <span class="contact-icon">📱</span>
                    <span>${phone}</span>
                </div>
                <div class="contact-item">
                    <span class="contact-icon">📍</span>
                    <span>${location}</span>
                </div>
                ${
                  linkedin
                    ? `
                <div class="contact-item">
                    <span class="contact-icon">💼</span>
                    <span>${linkedin}</span>
                </div>
                `
                    : ""
                }
                ${
                  github
                    ? `
                <div class="contact-item">
                    <span class="contact-icon">💻</span>
                    <span>${github}</span>
                </div>
                `
                    : ""
                }
                ${
                  portfolio
                    ? `
                <div class="contact-item">
                    <span class="contact-icon">🌐</span>
                    <span>${portfolio}</span>
                </div>
                `
                    : ""
                }
            </div>
            
            ${
              skills.length > 0
                ? `
            <div class="section">
                <h2 class="section-title">Skills</h2>
                <div class="skills-grid">
                    ${skills.map((skill) => `<div class="skill-item">${skill}</div>`).join("")}
                </div>
            </div>
            `
                : ""
            }
            
            ${
              languages.length > 0
                ? `
            <div class="section">
                <h2 class="section-title">Languages</h2>
                <ul class="languages-list">
                    ${languages.map((lang) => `<li>${lang}</li>`).join("")}
                </ul>
            </div>
            `
                : ""
            }
            
            ${
              certifications.length > 0
                ? `
            <div class="section">
                <h2 class="section-title">Certifications</h2>
                <ul class="certifications-list">
                    ${certifications.map((cert) => `<li>${cert}</li>`).join("")}
                </ul>
            </div>
            `
                : ""
            }
        </div>
        
        <div class="main-content">
            ${
              summary
                ? `
            <div class="section">
                <h2 class="section-title">Professional Summary</h2>
                <div class="summary">${summary}</div>
            </div>
            `
                : ""
            }
            
            ${
              experience.length > 0
                ? `
            <div class="section">
                <h2 class="section-title">Professional Experience</h2>
                ${experience
                  .map(
                    (exp) => `
                    <div class="experience-item">
                        <h3 class="item-title">${exp.position}</h3>
                        <p class="item-company">🏢 ${exp.company} • ${exp.location || location}</p>
                        <span class="item-duration">${exp.duration}</span>
                        <p class="item-description">${exp.description}</p>
                    </div>
                `,
                  )
                  .join("")}
            </div>
            `
                : ""
            }
            
            ${
              education.length > 0
                ? `
            <div class="section">
                <h2 class="section-title">Education</h2>
                ${education
                  .map(
                    (edu) => `
                    <div class="education-item">
                        <h3 class="item-title">${edu.degree}</h3>
                        <p class="item-school">🎓 ${edu.school}</p>
                        <span class="item-duration">${edu.year}</span>
                        ${edu.description ? `<p class="item-description">${edu.description}</p>` : ""}
                    </div>
                `,
                  )
                  .join("")}
            </div>
            `
                : ""
            }
        </div>
    </div>
</body>
</html>
  `
}
