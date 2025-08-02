#!/usr/bin/env python3
"""
Generate sample CV data for testing the CV screening system.
This script creates realistic CV data with Barcelona-specific information.
"""

import json
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any

# Barcelona tech companies
BARCELONA_COMPANIES = [
    "Glovo", "Typeform", "Wallapop", "TravelPerk", "Factorial", "Holded",
    "Camaloon", "Badi", "Kantox", "Redbooth", "Scytl", "Adevinta",
    "Softonic", "Privalia", "Vueling", "Seat", "Mango", "Desigual",
    "Cuatrecasas", "Banco Sabadell", "CaixaBank", "Agbar", "Naturgy",
    "Almirall", "Grifols", "Fluidra", "Ficosa", "Indra", "Everis"
]

# Remote companies
REMOTE_COMPANIES = [
    "Google", "Microsoft", "Amazon", "Meta", "Netflix", "Spotify",
    "Uber", "Airbnb", "Stripe", "GitHub", "Shopify", "Slack",
    "Zoom", "Figma", "Atlassian", "GitLab", "Notion", "Linear"
]

# Spanish names
FIRST_NAMES = [
    "Maria", "David", "Laura", "Carlos", "Ana", "Miguel", "Elena", "Javier",
    "Carmen", "Antonio", "Isabel", "Francisco", "Pilar", "Manuel", "Rosa",
    "José", "Marta", "Alejandro", "Cristina", "Fernando", "Patricia",
    "Rafael", "Beatriz", "Sergio", "Nuria", "Alberto", "Lucía", "Pablo"
]

LAST_NAMES = [
    "García", "Martínez", "López", "Sánchez", "González", "Pérez",
    "Rodríguez", "Fernández", "Gómez", "Díaz", "Ruiz", "Hernández",
    "Jiménez", "Álvarez", "Moreno", "Muñoz", "Alonso", "Romero"
]

# Job roles
ROLES = [
    "Senior Frontend Developer", "Full Stack Developer", "Data Scientist",
    "Product Manager", "UX/UI Designer", "DevOps Engineer", "Backend Developer",
    "Mobile Developer", "Machine Learning Engineer", "Cloud Architect",
    "Tech Lead", "Software Architect", "QA Engineer"
]

# Skills
SKILLS = [
    "JavaScript", "TypeScript", "Python", "React", "Vue.js", "Angular",
    "Node.js", "Django", "Flask", "PostgreSQL", "MongoDB", "Redis",
    "AWS", "Docker", "Kubernetes", "Git", "Jenkins", "Terraform",
    "Machine Learning", "Data Analysis", "Agile", "Scrum"
]

# Universities
UNIVERSITIES = [
    "Universitat Politècnica de Catalunya (UPC)",
    "Universitat de Barcelona (UB)",
    "Universitat Autònoma de Barcelona (UAB)",
    "Universitat Pompeu Fabra (UPF)",
    "ESADE Business School",
    "IESE Business School"
]

# Barcelona neighborhoods
NEIGHBORHOODS = [
    "Eixample", "Gràcia", "Sarrià-Sant Gervasi", "Sant Martí",
    "Ciutat Vella", "Les Corts", "Sants-Montjuïc", "Poblenou", "El Born"
]

def generate_name() -> Dict[str, str]:
    """Generate a random Spanish name."""
    first_name = random.choice(FIRST_NAMES)
    last_name1 = random.choice(LAST_NAMES)
    last_name2 = random.choice(LAST_NAMES)
    
    # Ensure last names are different
    while last_name2 == last_name1:
        last_name2 = random.choice(LAST_NAMES)
    
    full_name = f"{first_name} {last_name1} {last_name2}"
    
    return {
        "first_name": first_name,
        "last_name1": last_name1,
        "last_name2": last_name2,
        "full_name": full_name
    }

def generate_experience(role: str, years: int) -> List[Dict[str, Any]]:
    """Generate work experience based on role and years."""
    experience = []
    current_year = datetime.now().year
    
    # Current job
    current_company = random.choice(BARCELONA_COMPANIES)
    experience.append({
        "company": current_company,
        "position": role,
        "duration": f"{current_year - min(years, 3)} - Present",
        "location": "Barcelona, Spain",
        "description": f"Leading development initiatives at {current_company}. Responsible for architecture decisions, team mentoring, and delivering high-quality software solutions."
    })
    
    # Previous jobs
    remaining_years = years - 3
    if remaining_years > 0:
        prev_company = random.choice(BARCELONA_COMPANIES + REMOTE_COMPANIES)
        prev_role = role.replace("Senior ", "").replace("Lead ", "")
        
        experience.append({
            "company": prev_company,
            "position": prev_role,
            "duration": f"{current_year - years} - {current_year - 3}",
            "location": "Barcelona, Spain" if prev_company in BARCELONA_COMPANIES else "Remote",
            "description": f"Developed and maintained applications at {prev_company}. Collaborated with cross-functional teams and contributed to product development."
        })
    
    return experience

def generate_education() -> List[Dict[str, Any]]:
    """Generate education information."""
    university = random.choice(UNIVERSITIES)
    graduation_year = random.randint(2015, 2020)
    
    degrees = [
        "Master's in Computer Science",
        "Bachelor's in Computer Engineering",
        "Master's in Data Science",
        "Bachelor's in Software Engineering"
    ]
    
    return [{
        "degree": random.choice(degrees),
        "school": university,
        "year": str(graduation_year),
        "details": "Specialized in software development and modern technologies"
    }]

def generate_cv(cv_id: str) -> Dict[str, Any]:
    """Generate a complete CV."""
    name_data = generate_name()
    role = random.choice(ROLES)
    years_experience = random.randint(3, 12)
    neighborhood = random.choice(NEIGHBORHOODS)
    
    # Generate skills (5-10 random skills)
    cv_skills = random.sample(SKILLS, random.randint(5, 10))
    
    # Generate companies worked at
    companies = random.sample(BARCELONA_COMPANIES, random.randint(2, 4))
    
    # Professional summary
    summary = f"Experienced {role} with {years_experience}+ years in Barcelona's tech ecosystem. Graduated from {random.choice(UNIVERSITIES)} and built expertise at companies like {', '.join(companies[:2])}. Passionate about technology innovation and delivering high-quality solutions."
    
    cv_data = {
        "id": cv_id,
        "name": name_data["full_name"],
        "role": role,
        "email": f"{name_data['first_name'].lower()}.{name_data['last_name1'].lower()}@email.com",
        "phone": f"+34 6{random.randint(10, 99)} {random.randint(100, 999)} {random.randint(100, 999)}",
        "location": f"{neighborhood}, Barcelona",
        "linkedin": f"linkedin.com/in/{name_data['first_name'].lower()}-{name_data['last_name1'].lower()}",
        "github": f"github.com/{name_data['first_name'].lower()}{name_data['last_name1'].lower()}",
        "portfolio": f"{name_data['first_name'].lower()}{name_data['last_name1'].lower()}.dev",
        "summary": summary,
        "skills": cv_skills,
        "experience": generate_experience(role, years_experience),
        "education": generate_education(),
        "languages": ["Spanish (Native)", "English (Fluent)", "Catalan (Fluent)"],
        "certifications": [
            "AWS Certified Developer",
            "Google Analytics Certified"
        ],
        "companies": companies,
        "university": random.choice(UNIVERSITIES),
        "experienceYears": f"{years_experience} years",
        "createdAt": datetime.now().isoformat(),
        "type": "generated",
        "status": "completed",
        "profileImageUrl": f"https://randomuser.me/api/portraits/{'women' if name_data['first_name'] in ['Maria', 'Laura', 'Ana', 'Elena', 'Carmen', 'Isabel', 'Pilar', 'Rosa', 'Marta', 'Cristina', 'Patricia', 'Beatriz', 'Nuria', 'Lucía'] else 'men'}/{random.randint(1, 99)}.jpg"
    }
    
    return cv_data

def main():
    """Generate sample CVs and save to JSON file."""
    print("Generating sample CV data...")
    
    # Generate 20 sample CVs
    cvs = []
    for i in range(20):
        cv_id = f"sample-{datetime.now().timestamp()}-{i}"
        cv = generate_cv(cv_id)
        cvs.append(cv)
        print(f"Generated CV {i+1}: {cv['name']} - {cv['role']}")
    
    # Save to JSON file
    output_file = "sample_cvs.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(cvs, f, indent=2, ensure_ascii=False)
    
    print(f"\nGenerated {len(cvs)} sample CVs and saved to {output_file}")
    print("\nSample CV summary:")
    for cv in cvs[:5]:  # Show first 5
        print(f"- {cv['name']}: {cv['role']} at {cv['experience'][0]['company']}")

if __name__ == "__main__":
    main()
