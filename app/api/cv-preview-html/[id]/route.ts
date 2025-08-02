import { type NextRequest, NextResponse } from "next/server"
import { getCVById } from "@/lib/cv-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "CV ID is required" }, { status: 400 })
    }

    const cvData = getCVById(id)
    if (!cvData) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 })
    }

    const htmlContent = generatePreviewHTML(cvData)

    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    console.error("Error generating CV preview:", error)
    return NextResponse.json({ error: "Failed to generate CV preview" }, { status: 500 })
  }
}

function generatePreviewHTML(cvData: any): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cvData.name} - CV Preview</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8fafc;
            padding: 20px;
        }
        
        .cv-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .profile-image {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            margin: 0 auto 20px;
            border: 4px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        .header h1 {
            font-size: 2.5em;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .header .role {
            font-size: 1.3em;
            opacity: 0.9;
            margin-bottom: 15px;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
            font-size: 0.95em;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px;
        }
        
        .section {
            margin-bottom: 35px;
        }
        
        .section h2 {
            font-size: 1.5em;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 20px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .summary {
            font-size: 1.1em;
            line-height: 1.8;
            color: #475569;
            text-align: justify;
        }
        
        .experience-item, .education-item {
            margin-bottom: 25px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
        }
        
        .experience-item h3, .education-item h3 {
            font-size: 1.2em;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px;
        }
        
        .experience-item .company, .education-item .school {
            font-weight: 500;
            color: #2563eb;
            margin-bottom: 5px;
        }
        
        .experience-item .duration, .education-item .duration {
            font-size: 0.9em;
            color: #64748b;
            margin-bottom: 10px;
        }
        
        .experience-item .description, .education-item .description {
            color: #475569;
            line-height: 1.6;
        }
        
        .skills-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .skill-tag {
            background: #dbeafe;
            color: #1e40af;
            padding: 8px 16px;
            border-radius: 25px;
            font-size: 0.9em;
            font-weight: 500;
            transition: all 0.2s;
        }
        
        .skill-tag:hover {
            background: #2563eb;
            color: white;
        }
        
        .languages, .certifications {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
        }
        
        .languages span, .certifications span {
            background: #f0fdf4;
            color: #166534;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            border: 1px solid #bbf7d0;
        }
        
        @media (max-width: 768px) {
            body {
                padding: 10px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .contact-info {
                flex-direction: column;
                align-items: center;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="cv-container">
        <div class="header">
            <img src="${cvData.profileImageUrl || "/placeholder-user.jpg"}" alt="${cvData.name}" class="profile-image" onerror="this.style.display='none'">
            <h1>${cvData.name}</h1>
            <div class="role">${cvData.role}</div>
            <div class="contact-info">
                <span>📧 ${cvData.email}</span>
                <span>📱 ${cvData.phone}</span>
                <span>📍 ${cvData.location}</span>
            </div>
        </div>

        <div class="content">
            <div class="section">
                <h2>Professional Summary</h2>
                <div class="summary">
                    ${cvData.summary || `Experienced ${cvData.role} with ${cvData.experienceYears} years of expertise in modern technologies and best practices.`}
                </div>
            </div>

            <div class="section">
                <h2>Professional Experience</h2>
                ${
                  cvData.experience
                    ?.map(
                      (exp) => `
                    <div class="experience-item">
                        <h3>${exp.position}</h3>
                        <div class="company">${exp.company}</div>
                        <div class="duration">${exp.startDate} - ${exp.endDate}</div>
                        <div class="description">${exp.description}</div>
                    </div>
                `,
                    )
                    .join("") || "<p>No experience data available</p>"
                }
            </div>

            <div class="section">
                <h2>Education</h2>
                ${
                  cvData.education
                    ?.map(
                      (edu) => `
                    <div class="education-item">
                        <h3>${edu.degree}</h3>
                        <div class="school">${edu.school}</div>
                        <div class="duration">${edu.startDate} - ${edu.endDate}</div>
                        ${edu.description ? `<div class="description">${edu.description}</div>` : ""}
                    </div>
                `,
                    )
                    .join("") || "<p>No education data available</p>"
                }
            </div>

            <div class="section">
                <h2>Skills</h2>
                <div class="skills-list">
                    ${cvData.skills?.map((skill) => `<span class="skill-tag">${skill}</span>`).join("") || "<p>No skills listed</p>"}
                </div>
            </div>

            ${
              cvData.languages?.length
                ? `
            <div class="section">
                <h2>Languages</h2>
                <div class="languages">
                    ${cvData.languages.map((lang) => `<span>${lang}</span>`).join("")}
                </div>
            </div>
            `
                : ""
            }

            ${
              cvData.certifications?.length
                ? `
            <div class="section">
                <h2>Certifications</h2>
                <div class="certifications">
                    ${cvData.certifications.map((cert) => `<span>${cert}</span>`).join("")}
                </div>
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
