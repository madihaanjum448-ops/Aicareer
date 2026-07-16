const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true }
});

const WeekSchema = new mongoose.Schema({
  week: { type: Number, required: true },
  title: { type: String, required: true },
  topics: [{ type: String }],
  project: { type: String },
  resources: [ResourceSchema],
  estimatedHours: { type: Number, default: 10 },
  completed: { type: Boolean, default: false }
});

const RoadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  careerGoal: {
    type: String,
    required: true
  },
  weeks: [WeekSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);
