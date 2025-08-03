import { type NextRequest, NextResponse } from "next/server"
import { cvStorage } from "../../generate-cvs/route"

// Generate HTML content for CV
function generateCVHTML(cvData: any): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cvData.name} - CV</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
            padding: 40px;
            max-width: 900px;
            margin: 0 auto;
        }
        
        .cv-header {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 10px;
            border-bottom: 3px solid #2563eb;
        }
        
        .profile-image {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 30px;
            border: 4px solid #ffffff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .header-info h1 {
            font-size: 2.5rem;
            color: #1f2937;
            margin-bottom: 5px;
            font-weight: 700;
        }
        
        .header-info .title {
            font-size: 1.2rem;
            color: #2563eb;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .contact-info {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            color: #6b7280;
            font-size: 0.9rem;
        }
        
        .contact-info span {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section h2 {
            font-size: 1.5rem;
            color: #1f2937;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 2px solid #e5e7eb;
            font-weight: 600;
        }
        
        .summary {
            font-size: 1.1rem;
            line-height: 1.7;
            color: #4b5563;
            padding: 20px;
            background: #f9fafb;
            border-radius: 8px;
            border-left: 4px solid #10b981;
        }
        
        .skills-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .skill-tag {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
        }
        
        .companies-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .company-tag {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .info-item {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            border-left: 3px solid #6366f1;
        }
        
        .info-item h3 {
            font-size: 0.9rem;
            color: #6b7280;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .info-item p {
            font-size: 1rem;
            color: #1f2937;
            font-weight: 500;
        }
        
        @media print {
            body {
                padding: 20px;
                font-size: 10pt;
            }
            
            .cv-header {
                margin-bottom: 20px;
                padding: 15px;
            }
            
            .profile-image {
                width: 100px;
                height: 100px;
                margin-right: 20px;
            }
            
            .header-info h1 {
                font-size: 2rem;
            }
            
            .section {
                margin-bottom: 20px;
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="cv-container">
        <header class="cv-header">
            <img src="${cvData.profileImageUrl}" alt="${cvData.name}" class="profile-image" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDUiIHI9IjIwIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yMCA5NEM0MCA3NCA4MCA3NCAxMDAgOTRWMTIwSDIwVjk0WiIgZmlsbD0iIzlCOUJBMCIvPgo8L3N2Zz4K'">
            <div class="header-info">
                <h1>${cvData.name}</h1>
                <div class="title">${cvData.role}</div>
                <div class="contact-info">
                    <span>📧 ${cvData.email}</span>
                    <span>📍 ${cvData.location}</span>
                    <span>👤 ${cvData.age} years old</span>
                    <span>💼 ${cvData.experienceYears} years experience</span>
                </div>
            </div>
        </header>

        <section class="section">
            <h2>Professional Summary</h2>
            <div class="summary">${cvData.summary}</div>
        </section>

        <section class="section">
            <h2>Technical Skills</h2>
            <div class="skills-grid">
                ${cvData.skills.map((skill: string) => `<span class="skill-tag">${skill}</span>`).join("")}
            </div>
        </section>

        <section class="section">
            <h2>Company Experience</h2>
            <div class="companies-list">
                ${cvData.companies.map((company: string) => `<span class="company-tag">${company}</span>`).join("")}
            </div>
        </section>

        <div class="info-grid">
            <div class="info-item">
                <h3>Education</h3>
                <p>${cvData.university}</p>
            </div>
            <div class="info-item">
                <h3>Location</h3>
                <p>${cvData.location}</p>
            </div>
            <div class="info-item">
                <h3>Experience Level</h3>
                <p>${cvData.experienceYears} years</p>
            </div>
            <div class="info-item">
                <h3>Age</h3>
                <p>${cvData.age} years old</p>
            </div>
        </div>
    </div>
</body>
</html>
  `
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "CV ID is required" }, { status: 400 })
    }

    console.log(`Attempting to download CV: ${id}`)

    // Get CV data from storage
    const cvData = cvStorage.get(id)

    if (!cvData) {
      console.log(`CV not found in storage: ${id}`)
      return NextResponse.json({ error: "CV not found" }, { status: 404 })
    }

    console.log(`Found CV data for: ${cvData.name}`)

    // Generate HTML content
    const htmlContent = generateCVHTML(cvData)

    // Return HTML file for download
    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="${cvData.name.replace(/\s+/g, "_")}_CV.html"`,
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Error in download-cv route:", error)
    return NextResponse.json(
      {
        error: "Failed to download CV",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
