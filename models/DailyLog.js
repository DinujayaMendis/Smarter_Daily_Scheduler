const mongoose = require('mongoose');

const DailyLogSchema = new mongoose.Schema({
  date: {
    type: String, // YYYY-MM-DD
    required: true,
    unique: true,
    index: true
  },
  totalScheduledMinutes: {
    type: Number,
    default: 1410
  },
  completedMinutes: {
    type: Number,
    default: 0
  },
  totalTasks: {
    type: Number,
    default: 12
  },
  completedTasks: {
    type: Number,
    default: 0
  },
  completionRate: {
    type: Number,
    default: 0
  },
  completedTaskTitles: [{
    type: String
  }],
  categoryBreakdown: {
    morningMinutes: { type: Number, default: 0 },
    internshipMinutes: { type: Number, default: 0 },
    eveningMinutes: { type: Number, default: 0 },
    sleepMinutes: { type: Number, default: 390 }
  },
  studyBlocks: {
    theoryMinutes: { type: Number, default: 0 },
    pastPapersMinutes: { type: Number, default: 0 },
    revisionLabsMinutes: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DailyLog', DailyLogSchema);
