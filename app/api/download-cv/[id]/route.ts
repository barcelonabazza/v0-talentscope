import { type NextRequest, NextResponse } from "next/server"
import { getCVById } from "@/lib/cv-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "CV ID is required" }, { status: 400 })
    }

    // Get CV data
    const cvData = getCVById(id)
    if (!cvData) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 })
    }

    // Generate HTML content for the CV
    const htmlContent = generateCVHTML(cvData)

    // Return HTML file that will auto-trigger print dialog
    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="${cvData.name.replace(/\s+/g, "_")}_CV.html"`,
      },
    })
  } catch (error) {
    console.error("Error downloading CV:", error)
    return NextResponse.json({ error: "Failed to download CV" }, { status: 500 })
  }
}

function generateCVHTML(cvData: any): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cvData.name} - CV</title>
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
            background: white;
        }
        
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .no-print {
                display: none !important;
            }
            
            .cv-container {
                box-shadow: none !important;
                margin: 0 !important;
                padding: 0 !important;
            }
        }
        
        @page {
            size: A4;
            margin: 0.5in;
        }
        
        .print-instructions {
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 8px;
            padding: 16px;
            margin: 20px;
            text-align: center;
            color: #0c4a6e;
        }
        
        .cv-container {
            max-width: 210mm;
            margin: 20px auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            padding: 40px;
        }
        
        .header {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #2563eb;
        }
        
        .profile-image {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 30px;
            border: 4px solid #2563eb;
        }
        
        .profile-info h1 {
            font-size: 2.5em;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 5px;
        }
        
        .profile-info .role {
            font-size: 1.3em;
            color: #2563eb;
            font-weight: 500;
            margin-bottom: 10px;
        }
        
        .contact-info {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            font-size: 0.9em;
            color: #64748b;
        }
        
        .contact-info span {
            display: flex;
            align-items: center;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section h2 {
            font-size: 1.4em;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .summary {
            font-size: 1em;
            line-height: 1.7;
            color: #475569;
            text-align: justify;
        }
        
        .experience-item, .education-item {
            margin-bottom: 20px;
            padding-left: 20px;
            border-left: 3px solid #2563eb;
            position: relative;
        }
        
        .experience-item::before, .education-item::before {
            content: '';
            position: absolute;
            left: -6px;
            top: 5px;
            width: 10px;
            height: 10px;
            background: #2563eb;
            border-radius: 50%;
        }
        
        .experience-item h3, .education-item h3 {
            font-size: 1.1em;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 5px;
        }
        
        .experience-item .company, .education-item .school {
            font-weight: 500;
            color: #2563eb;
            margin-bottom: 3px;
        }
        
        .experience-item .duration, .education-item .duration {
            font-size: 0.9em;
            color: #64748b;
            margin-bottom: 8px;
        }
        
        .experience-item .description, .education-item .description {
            color: #475569;
            line-height: 1.6;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .skill-category h4 {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .skill-tag {
            background: #f1f5f9;
            color: #475569;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            border: 1px solid #e2e8f0;
        }
        
        .languages, .certifications {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .languages span, .certifications span {
            background: #dbeafe;
            color: #1e40af;
            padding: 6px 12px;
            border-radius: 15px;
            font-size: 0.9em;
        }
        
        .two-column {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 40px;
        }
        
        .main-content {
            /* Main content styles */
        }
        
        .sidebar {
            /* Sidebar styles */
        }
    </style>
</head>
<body>
    <div class="print-instructions no-print">
        <h3>📄 CV Ready for Download</h3>
        <p>This page will automatically open the print dialog. Select "Save as PDF" to download your CV.</p>
        <p><strong>Tip:</strong> Make sure to select "More settings" and choose "A4" paper size for best results.</p>
    </div>

    <div class="cv-container">
        <div class="header">
            <img src="${cvData.profileImageUrl || "/placeholder-user.jpg"}" alt="${cvData.name}" class="profile-image" onerror="this.style.display='none'">
            <div class="profile-info">
                <h1>${cvData.name}</h1>
                <div class="role">${cvData.role}</div>
                <div class="contact-info">
                    <span>📧 ${cvData.email}</span>
                    <span>📱 ${cvData.phone}</span>
                    <span>📍 ${cvData.location}</span>
                </div>
            </div>
        </div>

        <div class="two-column">
            <div class="main-content">
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
            </div>

            <div class="sidebar">
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
    </div>

    <script>
        // Auto-trigger print dialog after page loads
        window.addEventListener('load', function() {
            setTimeout(function() {
                window.print();
            }, 1000);
        });
        
        // Handle print dialog close
        window.addEventListener('afterprint', function() {
            // Optional: You could close the window or redirect
            console.log('Print dialog closed');
        });
    </script>
</body>
</html>
  `
}
