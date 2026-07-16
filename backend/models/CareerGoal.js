const mongoose = require('mongoose');

const CareerGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  career: {
    type: String,
    required: true,
    enum: [
      'Software Engineer',
      'Full Stack Developer',
      'AI Engineer',
      'Machine Learning Engineer',
      'Data Scientist',
      'Cyber Security Engineer',
      'Cloud Engineer',
      'DevOps Engineer'
    ]
  },
  requiredSkills: [{
    type: String
  }],
  missingSkills: [{
    type: String
  }],
  matchPercentage: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CareerGoal', CareerGoalSchema);
