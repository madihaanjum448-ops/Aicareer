import os
import json
import logging
from typing import List
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pypdf
import google.generativeai as genai
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load env variables
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    logger.info("Gemini API configured successfully.")
else:
    logger.warning("GEMINI_API_KEY not found in environment variables.")

app = FastAPI(title="CareerPilot AI Service", version="1.0.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RoadmapRequest(BaseModel):
    career_goal: str
    missing_skills: List[str]

@app.get("/")
async def root():
    return {"message": "CareerPilot AI Python Service is running!"}

@app.post("/extract-skills")
async def extract_skills(file: UploadFile = File(...)):
    """
    Extracts text from the uploaded PDF resume, then uses Gemini to parse
    and identify technical and soft skills.
    """
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    try:
        # Extract text from PDF
        pdf_reader = pypdf.PdfReader(file.file)
        full_text = ""
        for page in pdf_reader.pages:
            text = page.extract_text()
            if text:
                full_text += text + "\n"
        
        if not full_text.strip():
            raise HTTPException(status_code=400, detail="The PDF appears to be empty or unscannable.")
            
        logger.info(f"Successfully extracted {len(full_text)} characters of text from PDF.")

        if not api_key:
            # Fallback if no API key is set yet: try to find keywords in text
            logger.warning("No Gemini API key available. Falling back to simple keyword matching.")
            mock_skills = []
            common_skills = [
                "python", "javascript", "react", "node", "express", "mongodb", "sql", "java", "c++",
                "html", "css", "git", "aws", "docker", "kubernetes", "machine learning", "deep learning",
                "tensorflow", "pytorch", "pandas", "numpy", "statistics", "scikit-learn"
            ]
            for skill in common_skills:
                if skill in full_text.lower():
                    # Capitalize nicely
                    mock_skills.append(skill.title() if len(skill) > 3 else skill.upper())
            return {"skills": mock_skills or ["JavaScript", "HTML", "CSS", "Git"]}

        # Call Gemini to extract skills in structured JSON format
        prompt = f"""
You are an expert technical recruiter and AI assistant for a career platform.
Read the following resume text and extract all professional technical skills, programming languages, frameworks, libraries, databases, cloud tools, methodologies, and important soft skills.

Format the output strictly as a JSON object with a single key "skills" containing a list of strings.
Do not include any explanation, markdown formatting (like ```json), or extra text outside the JSON.

Resume text:
\"\"\"
{full_text}
\"\"\"
"""
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        try:
            skills_data = json.loads(response.text.strip())
            extracted_skills = skills_data.get("skills", [])
            # Clean up skills (capitalize nicely)
            extracted_skills = [s.strip() for s in extracted_skills if s.strip()]
            return {"skills": extracted_skills}
        except json.JSONDecodeError as je:
            logger.error(f"JSON Decode Error from Gemini response: {response.text}")
            raise HTTPException(status_code=500, detail="Failed to parse skills from Gemini response.")

    except Exception as e:
        logger.error(f"Error processing resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error parsing resume: {str(e)}")

@app.post("/generate-roadmap")
async def generate_roadmap(request: RoadmapRequest):
    """
    Generates a 12-week learning roadmap using Gemini based on missing skills and a career goal.
    """
    if not api_key:
        logger.warning("No Gemini API key available. Generating a mock 12-week roadmap.")
        # Return a simple mock roadmap
        mock_roadmap = []
        for week in range(1, 13):
            skill_index = (week - 1) % len(request.missing_skills) if request.missing_skills else 0
            skill_name = request.missing_skills[skill_index] if request.missing_skills else "General concepts"
            mock_roadmap.append({
                "week": week,
                "title": f"Week {week}: Master {skill_name} Fundamentals",
                "topics": [
                    f"Introduction to {skill_name} core concepts",
                    f"Best practices and structures for {skill_name}",
                    f"Debugging and troubleshooting {skill_name} systems"
                ],
                "project": f"Build a project demonstrating proficiency in {skill_name}.",
                "resources": [
                    {"name": f"Official {skill_name} Documentation", "url": "https://google.com/search?q=" + skill_name + "+documentation"},
                    {"name": f"FreeCodeCamp {skill_name} Tutorial", "url": "https://www.youtube.com/results?search_query=" + skill_name + "+tutorial"}
                ]
            })
        return {"roadmap": mock_roadmap}

    try:
        # Prompt Gemini to generate a highly detailed 12-week learning roadmap
        prompt = f"""
You are an elite career coach and technology educator.
Generate a highly detailed, comprehensive 12-week learning roadmap for a student who wants to become a "{request.career_goal}".
The student is missing the following key skills: {', '.join(request.missing_skills)}.

Structure the roadmap week-by-week. Every single week from 1 to 12 must be accounted for.
For each week, provide:
1. "week": The week number (integer 1 to 12)
2. "title": A clear, catchy title for that week's topic
3. "topics": A list of 3-5 specific subtopics or concepts to study
4. "project": A concrete, practical mini-project or exercise they should build that week to apply the skills
5. "resources": A list of 2 helpful study resources with "name" and "url" (make these look like real, high-quality resources, e.g. official docs, YouTube tutorials, MDN, FreeCodeCamp)

Ensure the output is strictly a JSON object with a single key "roadmap" containing an array of weekly objects.
Do not include any explanation, markdown formatting (like ```json), or extra text outside the JSON.

JSON Structure:
{{
  "roadmap": [
    {{
      "week": 1,
      "title": "Week 1: ...",
      "topics": ["...", "..."],
      "project": "...",
      "resources": [
        {{"name": "...", "url": "..."}},
        {{"name": "...", "url": "..."}}
      ]
    }}
  ]
}}
"""
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )

        try:
            roadmap_data = json.loads(response.text.strip())
            return roadmap_data
        except json.JSONDecodeError as je:
            logger.error(f"JSON Decode Error from Gemini roadmap response: {response.text}")
            raise HTTPException(status_code=500, detail="Failed to parse roadmap from Gemini response.")

    except Exception as e:
        logger.error(f"Error generating roadmap: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating roadmap: {str(e)}")
