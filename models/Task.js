const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  timeRange: {
    type: String,
    required: true,
    trim: true
  },
  // 24-hour format HH:MM for easy comparison and live countdown
  startTime: {
    type: String,
    default: ''
  },
  endTime: {
    type: String,
    default: ''
  },
  durationMinutes: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['morning', 'internship', 'evening'],
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  isAllDay: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', TaskSchema);
