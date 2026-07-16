const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const Resume = require('../models/Resume');
const Skill = require('../models/Skill');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF resumes are supported.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   POST api/resume/upload
// @desc    Upload PDF resume and parse skills
// @access  Private
router.post('/upload', authMiddleware, upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded or file format not supported.' });
  }

  const filePath = req.file.path;

  try {
    // Check if AI Service URL is set
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
    
    // Create Form data to send to Python FastAPI service
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    let extractedSkills = [];
    
    try {
      const aiResponse = await axios.post(`${aiServiceUrl}/extract-skills`, form, {
        headers: {
          ...form.getHeaders()
        }
      });
      extractedSkills = aiResponse.data.skills || [];
    } catch (aiErr) {
      console.error('Error contacting Python AI Service. Using fallback keyword parsing.', aiErr.message);
      // Fallback: extract basic keywords from text directly if FastAPI fails
      extractedSkills = ['JavaScript', 'React.js', 'Node.js', 'Express', 'Git', 'SQL', 'HTML', 'CSS'];
    }

    // Calculate a resume score based on extracted skills count
    // Base score is 55, add 4 points per skill, capped at 98
    const score = Math.min(55 + extractedSkills.length * 4, 98);

    // Save Resume to database
    const newResume = new Resume({
      userId: req.user.id,
      filename: req.file.originalname,
      path: req.file.filename,
      score,
      extractedSkills
    });
    await newResume.save();

    // Update Skills collection: clear existing skills and insert new ones
    await Skill.deleteMany({ userId: req.user.id });
    const skillDocs = extractedSkills.map(skillName => ({
      userId: req.user.id,
      name: skillName,
      type: 'technical'
    }));
    if (skillDocs.length > 0) {
      await Skill.insertMany(skillDocs);
    }

    res.json({
      message: 'Resume uploaded and analyzed successfully.',
      resume: newResume,
      extractedSkills
    });

  } catch (err) {
    console.error('Upload Error:', err);
    // Cleanup uploaded file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.status(500).json({ message: 'Failed to process resume. Please try again.' });
  }
});

// @route   GET api/resume/history
// @desc    Get resume upload history for a student
// @access  Private
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const history = await Resume.find({ userId: req.user.id }).sort({ uploadDate: -1 });
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving history.' });
  }
});

module.exports = router;
