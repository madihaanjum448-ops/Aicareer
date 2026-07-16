const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const Skill = require('../models/Skill');
const CareerGoal = require('../models/CareerGoal');
const Roadmap = require('../models/Roadmap');

// Define standard required skills for each career option
const CAREER_SKILLS = {
  'Software Engineer': ['Git', 'Java', 'C++', 'Python', 'Data Structures', 'Algorithms', 'OOP', 'SQL'],
  'Full Stack Developer': ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'HTML', 'CSS', 'Git'],
  'AI Engineer': ['Python', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Gemini API', 'NLP', 'Computer Vision'],
  'Machine Learning Engineer': ['Python', 'Scikit-Learn', 'TensorFlow', 'PyTorch', 'MLOps', 'SQL', 'Statistics'],
  'Data Scientist': ['Python', 'R', 'SQL', 'Pandas', 'NumPy', 'Machine Learning', 'Statistics', 'Data Visualization'],
  'Cyber Security Engineer': ['Networking', 'Linux', 'Penetration Testing', 'Cryptography', 'Security Auditing', 'Firewalls'],
  'Cloud Engineer': ['AWS', 'Azure', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Terraform'],
  'DevOps Engineer': ['CI/CD', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Linux', 'AWS', 'Git']
};

// @route   POST api/career/select
// @desc    Select a career goal, perform skill gap analysis, and generate AI roadmap
// @access  Private
router.post('/select', authMiddleware, async (req, res) => {
  const { career } = req.body;

  if (!career || !CAREER_SKILLS[career]) {
    return res.status(400).json({ message: 'Invalid or missing career selection.' });
  }

  try {
    const userId = req.user.id;
    const requiredSkills = CAREER_SKILLS[career];

    // Fetch user's skills
    const userSkillsDocs = await Skill.find({ userId });
    const userSkills = userSkillsDocs.map(s => s.name.toLowerCase());

    // Compute gap analysis
    const currentSkills = [];
    const missingSkills = [];

    requiredSkills.forEach(reqSkill => {
      // Use simple partial matching
      const reqSkillLower = reqSkill.toLowerCase();
      const hasSkill = userSkills.some(uSkill => 
        uSkill.includes(reqSkillLower) || reqSkillLower.includes(uSkill)
      );
      
      if (hasSkill) {
        currentSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    const matchPercentage = Math.round((currentSkills.length / requiredSkills.length) * 100);

    // Save CareerGoal
    let careerGoal = await CareerGoal.findOne({ userId });
    if (careerGoal) {
      careerGoal.career = career;
      careerGoal.requiredSkills = requiredSkills;
      careerGoal.missingSkills = missingSkills;
      careerGoal.matchPercentage = matchPercentage;
      careerGoal.updatedAt = Date.now();
      await careerGoal.save();
    } else {
      careerGoal = new CareerGoal({
        userId,
        career,
        requiredSkills,
        missingSkills,
        matchPercentage
      });
      await careerGoal.save();
    }

    // Call FastAPI AI service to generate a 12-week roadmap based on missing skills
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
    let roadmapWeeks = [];

    try {
      const aiResponse = await axios.post(`${aiServiceUrl}/generate-roadmap`, {
        career_goal: career,
        missing_skills: missingSkills.length > 0 ? missingSkills : requiredSkills
      });
      roadmapWeeks = aiResponse.data.roadmap || [];
    } catch (aiErr) {
      console.error('Error contacting FastAPI for roadmap. Using fallback generator.', aiErr.message);
      
      // Fallback: Generate mock weeks
      const targetSkills = missingSkills.length > 0 ? missingSkills : requiredSkills;
      for (let w = 1; w <= 12; w++) {
        const skillIndex = (w - 1) % targetSkills.length;
        const skill = targetSkills[skillIndex];
        roadmapWeeks.push({
          week: w,
          title: `Week ${w}: Deep Dive into ${skill}`,
          topics: [`Core principles of ${skill}`, `Advanced patterns & applications`, `Testing and deployment`],
          project: `Build a standalone application implementing ${skill}.`,
          resources: [
            { name: `Official ${skill} Docs`, url: `https://www.google.com/search?q=${skill}+documentation` },
            { name: `FreeCodeCamp ${skill} Guide`, url: `https://www.youtube.com/results?search_query=${skill}+tutorial` }
          ],
          estimatedHours: 8 + (w % 4),
          completed: false
        });
      }
    }

    // Save or update Roadmap in database
    let roadmap = await Roadmap.findOne({ userId });
    if (roadmap) {
      roadmap.careerGoal = career;
      roadmap.weeks = roadmapWeeks;
      await roadmap.save();
    } else {
      roadmap = new Roadmap({
        userId,
        careerGoal: career,
        weeks: roadmapWeeks
      });
      await roadmap.save();
    }

    res.json({
      careerGoal,
      roadmap
    });

  } catch (err) {
    console.error('Career Selection Error:', err);
    res.status(500).json({ message: 'Server error setting career goal.' });
  }
});

// @route   GET api/career/goal
// @desc    Get student's selected career goal and gap details
// @access  Private
router.get('/goal', authMiddleware, async (req, res) => {
  try {
    const careerGoal = await CareerGoal.findOne({ userId: req.user.id });
    res.json(careerGoal || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving career goal.' });
  }
});

// @route   GET api/career/roadmap
// @desc    Get student's roadmap
// @access  Private
router.get('/roadmap', authMiddleware, async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ userId: req.user.id });
    res.json(roadmap || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving roadmap.' });
  }
});

// @route   PUT api/career/roadmap/week/:weekNum/toggle
// @desc    Toggle completion of a roadmap week
// @access  Private
router.put('/roadmap/week/:weekNum/toggle', authMiddleware, async (req, res) => {
  const { weekNum } = req.params;
  const num = parseInt(weekNum);

  try {
    const roadmap = await Roadmap.findOne({ userId: req.user.id });
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found.' });
    }

    const weekItem = roadmap.weeks.find(w => w.week === num);
    if (!weekItem) {
      return res.status(404).json({ message: 'Week not found in roadmap.' });
    }

    weekItem.completed = !weekItem.completed;
    await roadmap.save();

    res.json(roadmap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating progress.' });
  }
});

module.exports = router;
