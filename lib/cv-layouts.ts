import type { CVProfile } from "./cv-data"

export function generateCVHTML(cv: CVProfile): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cv.name} - CV</title>
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
            padding: 60px 80px;
            max-width: 900px;
            margin: 0 auto;
        }
        
        .cv-header {
            display: flex;
            align-items: center;
            margin-bottom: 40px;
            padding: 30px;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 12px;
            border-bottom: 4px solid #2563eb;
        }
        
        .profile-image {
            width: 140px;
            height: 140px;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 40px;
            border: 5px solid #ffffff;
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
        
        .header-info h1 {
            font-size: 2.8rem;
            color: #1f2937;
            margin-bottom: 8px;
            font-weight: 700;
        }
        
        .header-info .title {
            font-size: 1.4rem;
            color: #2563eb;
            font-weight: 600;
            margin-bottom: 15px;
        }
        
        .contact-info {
            display: flex;
            gap: 25px;
            flex-wrap: wrap;
            color: #6b7280;
            font-size: 1rem;
        }
        
        .contact-info span {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
        }
        
        .section {
            margin-bottom: 40px;
            padding: 0 20px;
        }
        
        .section h2 {
            font-size: 1.8rem;
            color: #1f2937;
            margin-bottom: 20px;
            padding-bottom: 8px;
            border-bottom: 3px solid #e5e7eb;
            font-weight: 600;
        }
        
        .summary {
            font-size: 1.2rem;
            line-height: 1.8;
            color: #4b5563;
            padding: 25px;
            background: #f9fafb;
            border-radius: 10px;
            border-left: 5px solid #10b981;
        }
        
        .experience-item, .education-item {
            margin-bottom: 30px;
            padding: 25px;
            background: #ffffff;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            border-left: 5px solid #2563eb;
        }
        
        .experience-header, .education-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
        }
        
        .job-title, .degree {
            font-size: 1.3rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 5px;
        }
        
        .company, .institution {
            color: #2563eb;
            font-weight: 500;
            font-size: 1.1rem;
        }
        
        .date {
            color: #6b7280;
            font-size: 1rem;
            white-space: nowrap;
            font-weight: 500;
            background: #f3f4f6;
            padding: 6px 12px;
            border-radius: 6px;
        }
        
        .description {
            margin-top: 15px;
        }
        
        .description ul {
            list-style: none;
            padding-left: 0;
        }
        
        .description li {
            margin-bottom: 8px;
            padding-left: 25px;
            position: relative;
            font-size: 1rem;
            line-height: 1.6;
        }
        
        .description li:before {
            content: "▸";
            color: #2563eb;
            font-weight: bold;
            position: absolute;
            left: 0;
            font-size: 1.2rem;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
        }
        
        .skill-category {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 25px;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
        }
        
        .skill-tag {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 25px;
            font-size: 0.9rem;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }
        
        .languages {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        
        .language {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            color: #065f46;
            padding: 12px 20px;
            border-radius: 25px;
            font-weight: 500;
            font-size: 1rem;
            border: 1px solid #a7f3d0;
        }
        
        @media print {
            body {
                padding: 40px 60px;
                font-size: 11pt;
                max-width: none;
            }
            
            .cv-header {
                margin-bottom: 30px;
                padding: 20px;
            }
            
            .profile-image {
                width: 120px;
                height: 120px;
                margin-right: 30px;
            }
            
            .header-info h1 {
                font-size: 2.2rem;
            }
            
            .section {
                margin-bottom: 25px;
                padding: 0 10px;
                page-break-inside: avoid;
            }
            
            .experience-item, .education-item {
                margin-bottom: 20px;
                padding: 20px;
                page-break-inside: avoid;
            }
            
            .summary {
                padding: 20px;
            }
        }
        
        @media (max-width: 768px) {
            body {
                padding: 30px 40px;
            }
            
            .cv-header {
                flex-direction: column;
                text-align: center;
                padding: 25px;
            }
            
            .profile-image {
                margin-right: 0;
                margin-bottom: 25px;
            }
            
            .contact-info {
                justify-content: center;
            }
            
            .experience-header, .education-header {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .date {
                margin-top: 8px;
            }
            
            .section {
                padding: 0 10px;
            }
        }
    </style>
</head>
<body>
    <div class="cv-container">
        <header class="cv-header">
            <img src="${cv.profileImageUrl}" alt="${cv.name}" class="profile-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDE0MCAxNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNDAiIGhlaWdodD0iMTQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjcwIiBjeT0iNTAiIHI9IjI1IiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yNSAxMTBDNTAgODUgOTAgODUgMTE1IDExMFYxNDBIMjVWMTEwWiIgZmlsbD0iIzlCOUJBMCIvPgo8L3N2Zz4K'">
            <div class="header-info">
                <h1>${cv.name}</h1>
                <div class="title">${cv.role}</div>
                <div class="contact-info">
                    <span>📧 ${cv.email}</span>
                    <span>📱 ${cv.phone}</span>
                    <span>📍 ${cv.location}</span>
                </div>
            </div>
        </header>

        <section class="section">
            <h2>Professional Summary</h2>
            <div class="summary">${cv.summary}</div>
        </section>

        <section class="section">
            <h2>Work Experience</h2>
            ${cv.experience
              .map(
                (exp) => `
                <div class="experience-item">
                    <div class="experience-header">
                        <div>
                            <div class="job-title">${exp.position}</div>
                            <div class="company">${exp.company}</div>
                        </div>
                        <div class="date">${exp.duration}</div>
                    </div>
                    <div class="description">
                        <ul>
                            ${exp.description.map((desc) => `<li>${desc}</li>`).join("")}
                        </ul>
                    </div>
                </div>
            `,
              )
              .join("")}
        </section>

        <section class="section">
            <h2>Education</h2>
            ${cv.education
              .map(
                (edu) => `
                <div class="education-item">
                    <div class="education-header">
                        <div>
                            <div class="degree">${edu.degree} in ${edu.field}</div>
                            <div class="institution">${edu.institution}</div>
                        </div>
                        <div class="date">${edu.duration}</div>
                    </div>
                </div>
            `,
              )
              .join("")}
        </section>

        <section class="section">
            <h2>Technical Skills</h2>
            <div class="skills-grid">
                <div class="skill-category">
                    <div class="skills-list">
                        ${cv.skills.map((skill) => `<span class="skill-tag">${skill}</span>`).join("")}
                    </div>
                </div>
            </div>
        </section>

        <section class="section">
            <h2>Languages</h2>
            <div class="languages">
                ${cv.languages.map((lang) => `<span class="language">${lang}</span>`).join("")}
            </div>
        </section>
    </div>
</body>
</html>
  `
}
