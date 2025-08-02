import { type NextRequest, NextResponse } from "next/server"
import { getCVById, getDesignTemplate } from "@/lib/cv-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return new NextResponse("CV ID is required", { status: 400 })
    }

    // Get CV from library
    const cv = getCVById(id)

    if (!cv) {
      return new NextResponse("CV not found", { status: 404 })
    }

    // Generate design template based on CV ID
    const seed = Number.parseInt(id.split("-")[0]) || Date.now()
    const template = getDesignTemplate(seed)

    // Generate HTML content for the CV
    const htmlContent = generateCVHTML(cv, template)

    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Error generating CV HTML preview:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

function generateCVHTML(cv: any, template: any): string {
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
            font-family: '${template.fontFamily}', sans-serif;
            line-height: 1.6;
            color: ${template.textColor};
            background: ${template.backgroundColor};
        }
        
        .cv-container {
            max-width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            display: grid;
            grid-template-columns: 300px 1fr;
            overflow: hidden;
        }
        
        .sidebar {
            background: ${template.gradient};
            color: white;
            padding: 40px 30px;
        }
        
        .main-content {
            padding: 40px 30px;
        }
        
        .profile-section {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .profile-image {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid rgba(255,255,255,0.2);
            margin-bottom: 20px;
        }
        
        .profile-name {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .profile-role {
            font-size: 16px;
            opacity: 0.9;
            margin-bottom: 20px;
        }
        
        .contact-info {
            margin-bottom: 30px;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            font-size: 14px;
        }
        
        .contact-icon {
            width: 16px;
            height: 16px;
            margin-right: 12px;
            opacity: 0.8;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
            color: ${template.primaryColor};
            border-bottom: 2px solid ${template.accentColor};
            padding-bottom: 5px;
        }
        
        .sidebar .section-title {
            color: white;
            border-bottom-color: rgba(255,255,255,0.3);
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 8px;
        }
        
        .skill-item {
            background: rgba(255,255,255,0.2);
            padding: 6px 12px;
            border-radius: 15px;
            font-size: 12px;
            text-align: center;
        }
        
        .experience-item, .education-item {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
        }
        
        .experience-item:last-child, .education-item:last-child {
            border-bottom: none;
        }
        
        .item-title {
            font-size: 16px;
            font-weight: 600;
            color: ${template.primaryColor};
            margin-bottom: 4px;
        }
        
        .item-company, .item-school {
            font-size: 14px;
            font-weight: 500;
            color: ${template.secondaryColor};
            margin-bottom: 4px;
        }
        
        .item-duration {
            font-size: 12px;
            color: #666;
            margin-bottom: 8px;
        }
        
        .item-description {
            font-size: 14px;
            line-height: 1.5;
        }
        
        .summary {
            font-size: 14px;
            line-height: 1.6;
            text-align: justify;
            margin-bottom: 25px;
        }
        
        .languages-list, .certifications-list {
            list-style: none;
        }
        
        .languages-list li, .certifications-list li {
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        .languages-list li:before {
            content: "🌐 ";
            margin-right: 8px;
        }
        
        .certifications-list li:before {
            content: "🏆 ";
            margin-right: 8px;
        }
        
        @media print {
            body {
                background: white;
            }
            
            .cv-container {
                box-shadow: none;
                max-width: none;
                width: 100%;
                height: 100vh;
            }
        }
    </style>
</head>
<body>
    <div class="cv-container">
        <div class="sidebar">
            <div class="profile-section">
                <img src="${profileImageUrl}" alt="${name}" class="profile-image" onerror="this.style.display='none'">
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
                <p class="summary">${summary}</p>
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
                        <p class="item-company">${exp.company}</p>
                        <p class="item-duration">${exp.duration} • ${exp.location || location}</p>
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
                        <p class="item-school">${edu.school}</p>
                        <p class="item-duration">${edu.year}</p>
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
