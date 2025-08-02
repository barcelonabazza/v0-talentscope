// Shared layout rendering logic for both HTML and PDF
export interface CVLayoutData {
  cvData: any
  design: any
}

export function renderSidebarLeftLayout(data: CVLayoutData, format: "html" | "pdf") {
  const { cvData, design } = data

  if (format === "html") {
    return `
      <div style="
        display: grid;
        grid-template-columns: 250px 1fr;
        min-height: 600px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: ${design.textColor};
        background: white;
        box-shadow: 0 0 20px rgba(0,0,0,0.1);
        border-radius: 8px;
        overflow: hidden;
      ">
        <!-- Left Sidebar -->
        <div style="
          background: ${design.backgroundColor};
          padding: 30px 20px;
        ">
          <!-- Profile Photo -->
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="${cvData.profileImageUrl}" alt="${cvData.name}" style="
              width: 120px;
              height: 120px;
              border-radius: 50%;
              object-fit: cover;
              border: 4px solid white;
              margin: 0 auto 20px;
              display: block;
            " onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div style="
              width: 120px;
              height: 120px;
              border-radius: 50%;
              background: ${design.primaryColor};
              color: white;
              display: none;
              align-items: center;
              justify-content: center;
              font-size: 36px;
              font-weight: bold;
              margin: 0 auto 20px;
            ">${cvData.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)}</div>
          </div>
          
          <!-- Contact Section -->
          <div style="margin-bottom: 30px;">
            <h2 style="
              font-size: 18px;
              font-weight: bold;
              color: ${design.primaryColor};
              margin-bottom: 15px;
              padding-bottom: 5px;
              border-bottom: 2px solid ${design.accentColor};
              text-transform: uppercase;
              letter-spacing: 1px;
            ">Contact</h2>
            <div style="font-size: 14px; line-height: 1.8;">
              <div style="margin-bottom: 8px; word-break: break-all;">
                <strong style="color: ${design.primaryColor};">Email:</strong><br>${cvData.email}
              </div>
              <div style="margin-bottom: 8px;">
                <strong style="color: ${design.primaryColor};">Phone:</strong><br>${cvData.phone}
              </div>
              <div style="margin-bottom: 8px;">
                <strong style="color: ${design.primaryColor};">Location:</strong><br>${cvData.location}
              </div>
              <div style="margin-bottom: 8px; word-break: break-all;">
                <strong style="color: ${design.primaryColor};">LinkedIn:</strong><br>${cvData.linkedin}
              </div>
              <div style="margin-bottom: 8px; word-break: break-all;">
                <strong style="color: ${design.primaryColor};">GitHub:</strong><br>${cvData.github}
              </div>
              <div style="margin-bottom: 8px; word-break: break-all;">
                <strong style="color: ${design.primaryColor};">Portfolio:</strong><br>${cvData.portfolio}
              </div>
            </div>
          </div>
          
          <!-- Skills Section -->
          <div style="margin-bottom: 30px;">
            <h2 style="
              font-size: 18px;
              font-weight: bold;
              color: ${design.primaryColor};
              margin-bottom: 15px;
              padding-bottom: 5px;
              border-bottom: 2px solid ${design.accentColor};
              text-transform: uppercase;
              letter-spacing: 1px;
            ">Skills</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${
                cvData.skills && Array.isArray(cvData.skills)
                  ? cvData.skills
                      .map(
                        (skill) => `
                <span style="
                  background: ${design.primaryColor};
                  color: white;
                  padding: 4px 12px;
                  border-radius: 20px;
                  font-size: 12px;
                  font-weight: 500;
                ">${skill}</span>
              `,
                      )
                      .join("")
                  : ""
              }
            </div>
          </div>
          
          <!-- Languages Section -->
          <div style="margin-bottom: 30px;">
            <h2 style="
              font-size: 18px;
              font-weight: bold;
              color: ${design.primaryColor};
              margin-bottom: 15px;
              padding-bottom: 5px;
              border-bottom: 2px solid ${design.accentColor};
              text-transform: uppercase;
              letter-spacing: 1px;
            ">Languages</h2>
            ${
              cvData.languages && Array.isArray(cvData.languages)
                ? cvData.languages
                    .map(
                      (lang) => `
              <div style="
                margin-bottom: 8px;
                padding-left: 15px;
                position: relative;
                font-size: 14px;
              ">
                <span style="
                  position: absolute;
                  left: 0;
                  color: ${design.accentColor};
                  font-weight: bold;
                ">•</span>
                ${lang}
              </div>
            `,
                    )
                    .join("")
                : ""
            }
          </div>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 30px;">
          <!-- Header -->
          <div style="margin-bottom: 30px;">
            <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 10px; color: ${design.textColor};">${cvData.name}</h1>
            <p style="font-size: 18px; color: ${design.secondaryColor}; margin-bottom: 20px;">${cvData.role}</p>
          </div>
          
          <!-- Professional Summary -->
          <div style="margin-bottom: 30px;">
            <h2 style="
              font-size: 18px;
              font-weight: bold;
              color: ${design.primaryColor};
              margin-bottom: 15px;
              padding-bottom: 5px;
              border-bottom: 2px solid ${design.accentColor};
              text-transform: uppercase;
              letter-spacing: 1px;
            ">Professional Summary</h2>
            <p style="line-height: 1.6; color: ${design.textColor};">${cvData.summary}</p>
          </div>
          
          <!-- Work Experience -->
          <div style="margin-bottom: 30px;">
            <h2 style="
              font-size: 18px;
              font-weight: bold;
              color: ${design.primaryColor};
              margin-bottom: 15px;
              padding-bottom: 5px;
              border-bottom: 2px solid ${design.accentColor};
              text-transform: uppercase;
              letter-spacing: 1px;
            ">Work Experience</h2>
            ${
              cvData.experience && Array.isArray(cvData.experience)
                ? cvData.experience
                    .map(
                      (job) => `
              <div style="
                margin-bottom: 25px;
                padding-bottom: 20px;
                border-bottom: 1px solid #eee;
              ">
                <h3 style="
                  font-size: 18px;
                  font-weight: bold;
                  color: ${design.textColor};
                  margin-bottom: 5px;
                ">${job.position || ""}</h3>
                <p style="
                  color: ${design.secondaryColor};
                  font-weight: 500;
                  margin-bottom: 10px;
                  font-size: 14px;
                ">${job.company || ""} | ${job.duration || ""} | ${job.location || ""}</p>
                <p style="
                  color: #666;
                  line-height: 1.6;
                  font-size: 14px;
                ">${job.description || ""}</p>
              </div>
            `,
                    )
                    .join("")
                : ""
            }
          </div>
          
          <!-- Education -->
          <div style="margin-bottom: 30px;">
            <h2 style="
              font-size: 18px;
              font-weight: bold;
              color: ${design.primaryColor};
              margin-bottom: 15px;
              padding-bottom: 5px;
              border-bottom: 2px solid ${design.accentColor};
              text-transform: uppercase;
              letter-spacing: 1px;
            ">Education</h2>
            ${
              cvData.education && Array.isArray(cvData.education)
                ? cvData.education
                    .map(
                      (edu) => `
              <div style="margin-bottom: 20px;">
                <h3 style="
                  font-size: 16px;
                  font-weight: bold;
                  color: ${design.textColor};
                  margin-bottom: 5px;
                ">${edu.degree || ""}</h3>
                <p style="
                  color: ${design.secondaryColor};
                  font-weight: 500;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">${edu.school || ""} | ${edu.year || ""}</p>
                <p style="
                  color: #666;
                  font-size: 14px;
                ">${edu.details || ""}</p>
              </div>
            `,
                    )
                    .join("")
                : ""
            }
          </div>
        </div>
      </div>
    `
  }

  // PDF rendering logic will be handled in the PDF route
  return null
}

export function renderSidebarRightLayout(data: CVLayoutData, format: "html" | "pdf") {
  const { cvData, design } = data

  if (format === "html") {
    return `
      <div style="
        display: grid;
        grid-template-columns: 1fr 250px;
        min-height: 600px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: ${design.textColor};
        background: white;
        box-shadow: 0 0 20px rgba(0,0,0,0.1);
        border-radius: 8px;
        overflow: hidden;
      ">
        <!-- Main Content -->
        <div style="padding: 30px;">
          <!-- Header -->
          <div style="margin-bottom: 30px;">
            <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 10px; color: ${design.textColor};">${cvData.name}</h1>
            <p style="font-size: 18px; color: ${design.secondaryColor}; margin-bottom: 20px;">${cvData.role}</p>
          </div>
          
          <!-- Professional Summary -->
          <div style="margin-bottom: 30px;">
            <h2 style="
              font-size: 18px;
              font-weight: bold;
              color: ${design.primaryColor};
              margin-bottom: 15px;
              padding-bottom: 5px;
              border-bottom: 2px solid ${design.accentColor};
              text-transform: uppercase;
              letter-spacing: 1px;
            ">Professional Summary</h2>
            <p style="line-height: 1.6; color: ${design.textColor};">${cvData.summary}</p>
          </div>
          
          <!-- Work Experience -->
          <div style="margin-bottom: 30px;">
            <h2 style="
              font-size: 18px;
              font-weight: bold;
              color: ${design.primaryColor};
              margin-bottom: 15px;
              padding-bottom: 5px;
              border-bottom: 2px solid ${design.accentColor};
              text-transform: uppercase;
              letter-spacing: 1px;
            ">Work Experience</h2>
            ${
              cvData.experience && Array.isArray(cvData.experience)
                ? cvData.experience
                    .map(
                      (job) => `
              <div style="
                margin-bottom: 25px;
                padding-bottom: 20px;
                border-bottom: 1px solid #eee;
              ">
                <h3 style="
                  font-size: 18px;
                  font-weight: bold;
                  color: ${design.textColor};
                  margin-bottom: 5px;
                ">${job.position || ""}</h3>
                <p style="
                  color: ${design.secondaryColor};
                  font-weight: 500;
                  margin-bottom: 10px;
                  font-size: 14px;
                ">${job.company || ""} | ${job.duration || ""} | ${job.location || ""}</p>
                <p style="
                  color: #666;
                  line-height: 1.6;
                  font-size: 14px;
                ">${job.description || ""}</p>
              </div>
            `,
                    )
                    .join("")
                : ""
            }
          </div>
          
          <!-- Education -->
          <div style="margin-bottom: 30px;">
            <h2 style="
              font-size: 18px;
              font-weight: bold;
              color: ${design.primaryColor};
              margin-bottom: 15px;
              padding-bottom: 5px;
              border-bottom: 2px solid ${design.accentColor};
              text-transform: uppercase;
              letter-spacing: 1px;
            ">Education</h2>
            ${
              cvData.education && Array.isArray(cvData.education)
                ? cvData.education
                    .map(
                      (edu) => `
              <div style="margin-bottom: 20px;">
                <h3 style="
                  font-size: 16px;
                  font-weight: bold;
                  color: ${design.textColor};
                  margin-bottom: 5px;
                ">${edu.degree || ""}</h3>
                <p style="
                  color: ${design.secondaryColor};
                  font-weight: 500;
                  margin-bottom: 8px;
                  font-size: 14px;
                ">${edu.school || ""} | ${edu.year || ""}</p>
                <p style="
                  color: #666;
                  font-size: 14px;
                ">${edu.details || ""}</p>
              </div>
            `,
                    )
                    .join("")
                : ""
            }
          </div>
        </div>
        
        <!-- Right Sidebar -->
        <div style="
          background: ${design.backgroundColor};
          padding: 30px 20px;
        ">
          <!-- Profile Photo -->
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="${cvData.profileImageUrl}" alt="${cvData.name}" style="
              width: 120px;
              height: 120px;
              border-radius: 50%;
              object-fit: cover;
              border: 4px solid white;
              margin: 0 auto 20px;
              display: block;
            " onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div style="
              width: 120px;
              height: 120px;
              border-radius: 50%;
              background: ${design.primaryColor};
              color: white;
              display: none;
              align-items: center;
              justify-content: center;
              font-size: 36px;
              font-weight: bold;
              margin: 0 auto 20px;
            ">${cvData.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)}</div>
          </div>
          
          <!-- Contact Section -->
          <div style="margin-bottom: 30px;">
            <h2 style="
              font-size: 18px;
              font-weight: bold;
              color: ${design.primaryColor};
              margin-bottom: 15px;
              padding-bottom: 5px;
              border-bottom: 2px solid ${design.accentColor};
              text-transform: uppercase;
              letter-spacing: 1px;
            ">Contact</h2>
            <div style="font-size: 14px; line-height: 1.8;">
              <div style="margin-bottom: 8px; word-break: break-all;">
                <strong style="color: ${design.primaryColor};">Email:</strong><br>${cvData.email}
              </div>
              <div style="margin-bottom: 8px;">
                <strong style="color: ${design.primaryColor};">Phone:</strong><br>${cvData.phone}
              </div>
              <div style="margin-bottom: 8px;">
                <strong style="color: ${design.primaryColor};">Location:</strong><br>${cvData.location}
              </div>
              <div style="margin-bottom: 8px; word-break: break-all;">
                <strong style="color: ${design.primaryColor};">LinkedIn:</strong><br>${cvData.linkedin}
              </div>
              <div style="margin-bottom: 8px; word-break: break-all;">
                <strong style="color: ${design.primaryColor};">GitHub:</strong><br>${cvData.github}
              </div>
              <div style="margin-bottom: 8px; word-break: break-all;">
                <strong style="color: ${design.primaryColor};">Portfolio:</strong><br>${cvData.portfolio}
              </div>
            </div>
          </div>
          
          <!-- Skills Section -->
          <div style="margin-bottom: 30px;">
            <h2 style="
              font-size: 18px;
              font-weight: bold;
              color: ${design.primaryColor};
              margin-bottom: 15px;
              padding-bottom: 5px;
              border-bottom: 2px solid ${design.accentColor};
              text-transform: uppercase;
              letter-spacing: 1px;
            ">Skills</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${
                cvData.skills && Array.isArray(cvData.skills)
                  ? cvData.skills
                      .map(
                        (skill) => `
                <span style="
                  background: ${design.primaryColor};
                  color: white;
                  padding: 4px 12px;
                  border-radius: 20px;
                  font-size: 12px;
                  font-weight: 500;
                ">${skill}</span>
              `,
                      )
                      .join("")
                  : ""
              }
            </div>
          </div>
          
          <!-- Languages Section -->
          <div style="margin-bottom: 30px;">
            <h2 style="
              font-size: 18px;
              font-weight: bold;
              color: ${design.primaryColor};
              margin-bottom: 15px;
              padding-bottom: 5px;
              border-bottom: 2px solid ${design.accentColor};
              text-transform: uppercase;
              letter-spacing: 1px;
            ">Languages</h2>
            ${
              cvData.languages && Array.isArray(cvData.languages)
                ? cvData.languages
                    .map(
                      (lang) => `
              <div style="
                margin-bottom: 8px;
                padding-left: 15px;
                position: relative;
                font-size: 14px;
              ">
                <span style="
                  position: absolute;
                  left: 0;
                  color: ${design.accentColor};
                  font-weight: bold;
                ">•</span>
                ${lang}
              </div>
            `,
                    )
                    .join("")
                : ""
            }
          </div>
        </div>
      </div>
    `
  }

  return null
}

export function renderHeaderTopLayout(data: CVLayoutData, format: "html" | "pdf") {
  const { cvData, design } = data

  if (format === "html") {
    return `
      <div style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: ${design.textColor};
        background: white;
        box-shadow: 0 0 20px rgba(0,0,0,0.1);
        border-radius: 8px;
        overflow: hidden;
        min-height: 600px;
      ">
        <!-- Header Section -->
        <div style="
          background: ${design.primaryColor};
          color: white;
          padding: 40px 30px;
          text-align: center;
        ">
          <img src="${cvData.profileImageUrl}" alt="${cvData.name}" style="
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid white;
            margin: 0 auto 20px;
            display: block;
          " onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div style="
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            color: white;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            font-weight: bold;
            margin: 0 auto 20px;
          ">${cvData.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)}</div>
          <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 10px; color: white;">${cvData.name}</h1>
          <p style="font-size: 18px; color: rgba(255,255,255,0.9); margin-bottom: 20px;">${cvData.role}</p>
        </div>
        
        <!-- Content Grid -->
        <div style="
          display: grid;
          grid-template-columns: 250px 1fr;
          min-height: 400px;
        ">
          <!-- Left Sidebar -->
          <div style="
            background: ${design.backgroundColor};
            padding: 30px 20px;
          ">
            <!-- Contact Section -->
            <div style="margin-bottom: 30px;">
              <h2 style="
                font-size: 18px;
                font-weight: bold;
                color: ${design.primaryColor};
                margin-bottom: 15px;
                padding-bottom: 5px;
                border-bottom: 2px solid ${design.accentColor};
                text-transform: uppercase;
                letter-spacing: 1px;
              ">Contact</h2>
              <div style="font-size: 14px; line-height: 1.8;">
                <div style="margin-bottom: 8px; word-break: break-all;">
                  <strong style="color: ${design.primaryColor};">Email:</strong><br>${cvData.email}
                </div>
                <div style="margin-bottom: 8px;">
                  <strong style="color: ${design.primaryColor};">Phone:</strong><br>${cvData.phone}
                </div>
                <div style="margin-bottom: 8px;">
                  <strong style="color: ${design.primaryColor};">Location:</strong><br>${cvData.location}
                </div>
                <div style="margin-bottom: 8px; word-break: break-all;">
                  <strong style="color: ${design.primaryColor};">LinkedIn:</strong><br>${cvData.linkedin}
                </div>
                <div style="margin-bottom: 8px; word-break: break-all;">
                  <strong style="color: ${design.primaryColor};">GitHub:</strong><br>${cvData.github}
                </div>
                <div style="margin-bottom: 8px; word-break: break-all;">
                  <strong style="color: ${design.primaryColor};">Portfolio:</strong><br>${cvData.portfolio}
                </div>
              </div>
            </div>
            
            <!-- Skills Section -->
            <div style="margin-bottom: 30px;">
              <h2 style="
                font-size: 18px;
                font-weight: bold;
                color: ${design.primaryColor};
                margin-bottom: 15px;
                padding-bottom: 5px;
                border-bottom: 2px solid ${design.accentColor};
                text-transform: uppercase;
                letter-spacing: 1px;
              ">Skills</h2>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${
                  cvData.skills && Array.isArray(cvData.skills)
                    ? cvData.skills
                        .map(
                          (skill) => `
                  <span style="
                    background: ${design.primaryColor};
                    color: white;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 500;
                  ">${skill}</span>
                `,
                        )
                        .join("")
                    : ""
                }
              </div>
            </div>
            
            <!-- Languages Section -->
            <div style="margin-bottom: 30px;">
              <h2 style="
                font-size: 18px;
                font-weight: bold;
                color: ${design.primaryColor};
                margin-bottom: 15px;
                padding-bottom: 5px;
                border-bottom: 2px solid ${design.accentColor};
                text-transform: uppercase;
                letter-spacing: 1px;
              ">Languages</h2>
              ${
                cvData.languages && Array.isArray(cvData.languages)
                  ? cvData.languages
                      .map(
                        (lang) => `
                <div style="
                  margin-bottom: 8px;
                  padding-left: 15px;
                  position: relative;
                  font-size: 14px;
                ">
                  <span style="
                    position: absolute;
                    left: 0;
                    color: ${design.accentColor};
                    font-weight: bold;
                  ">•</span>
                  ${lang}
                </div>
              `,
                      )
                      .join("")
                  : ""
              }
            </div>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 30px;">
            <!-- Professional Summary -->
            <div style="margin-bottom: 30px;">
              <h2 style="
                font-size: 18px;
                font-weight: bold;
                color: ${design.primaryColor};
                margin-bottom: 15px;
                padding-bottom: 5px;
                border-bottom: 2px solid ${design.accentColor};
                text-transform: uppercase;
                letter-spacing: 1px;
              ">Professional Summary</h2>
              <p style="line-height: 1.6; color: ${design.textColor};">${cvData.summary}</p>
            </div>
            
            <!-- Work Experience -->
            <div style="margin-bottom: 30px;">
              <h2 style="
                font-size: 18px;
                font-weight: bold;
                color: ${design.primaryColor};
                margin-bottom: 15px;
                padding-bottom: 5px;
                border-bottom: 2px solid ${design.accentColor};
                text-transform: uppercase;
                letter-spacing: 1px;
              ">Work Experience</h2>
              ${
                cvData.experience && Array.isArray(cvData.experience)
                  ? cvData.experience
                      .map(
                        (job) => `
                <div style="
                  margin-bottom: 25px;
                  padding-bottom: 20px;
                  border-bottom: 1px solid #eee;
                ">
                  <h3 style="
                    font-size: 18px;
                    font-weight: bold;
                    color: ${design.textColor};
                    margin-bottom: 5px;
                  ">${job.position || ""}</h3>
                  <p style="
                    color: ${design.secondaryColor};
                    font-weight: 500;
                    margin-bottom: 10px;
                    font-size: 14px;
                  ">${job.company || ""} | ${job.duration || ""} | ${job.location || ""}</p>
                  <p style="
                    color: #666;
                    line-height: 1.6;
                    font-size: 14px;
                  ">${job.description || ""}</p>
                </div>
              `,
                      )
                      .join("")
                  : ""
              }
            </div>
            
            <!-- Education -->
            <div style="margin-bottom: 30px;">
              <h2 style="
                font-size: 18px;
                font-weight: bold;
                color: ${design.primaryColor};
                margin-bottom: 15px;
                padding-bottom: 5px;
                border-bottom: 2px solid ${design.accentColor};
                text-transform: uppercase;
                letter-spacing: 1px;
              ">Education</h2>
              ${
                cvData.education && Array.isArray(cvData.education)
                  ? cvData.education
                      .map(
                        (edu) => `
                <div style="margin-bottom: 20px;">
                  <h3 style="
                    font-size: 16px;
                    font-weight: bold;
                    color: ${design.textColor};
                    margin-bottom: 5px;
                  ">${edu.degree || ""}</h3>
                  <p style="
                    color: ${design.secondaryColor};
                    font-weight: 500;
                    margin-bottom: 8px;
                    font-size: 14px;
                  ">${edu.school || ""} | ${edu.year || ""}</p>
                  <p style="
                    color: #666;
                    font-size: 14px;
                  ">${edu.details || ""}</p>
                </div>
              `,
                      )
                      .join("")
                  : ""
              }
            </div>
          </div>
        </div>
      </div>
    `
  }

  return null
}

export function renderCVLayout(cvData: any, design: any, format: "html" | "pdf") {
  const layoutData = { cvData, design }

  switch (design.layout) {
    case "sidebar-left":
      return renderSidebarLeftLayout(layoutData, format)
    case "sidebar-right":
      return renderSidebarRightLayout(layoutData, format)
    case "header-top":
      return renderHeaderTopLayout(layoutData, format)
    case "two-column":
      return renderSidebarLeftLayout(layoutData, format) // Use sidebar-left as fallback
    case "traditional":
      return renderHeaderTopLayout(layoutData, format) // Use header-top as fallback
    case "asymmetric":
      return renderSidebarRightLayout(layoutData, format) // Use sidebar-right as fallback
    case "grid-layout":
      return renderSidebarLeftLayout(layoutData, format) // Use sidebar-left as fallback
    case "timeline":
      return renderHeaderTopLayout(layoutData, format) // Use header-top as fallback
    case "magazine":
      return renderSidebarRightLayout(layoutData, format) // Use sidebar-right as fallback
    case "technical":
      return renderSidebarLeftLayout(layoutData, format) // Use sidebar-left as fallback
    default:
      return renderSidebarLeftLayout(layoutData, format)
  }
}
