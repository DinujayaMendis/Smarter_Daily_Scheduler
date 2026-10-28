require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Task = require('./models/Task');
const connectDB = require('./lib/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files (local and fallback)
app.use(express.static(path.join(__dirname, 'public')));

// Default schedule seed data matching the provided image
const defaultTasks = [
  // Morning Routine & Fitness (06:30 AM - 08:00 AM)
  {
    title: 'Wake Up & Hydration',
    description: 'Start the day with water (3000ml daily hydration goal)',
    timeRange: '06:30 AM - 06:45 AM',
    startTime: '06:30',
    endTime: '06:45',
    durationMinutes: 15,
    category: 'morning',
    order: 1,
    isAllDay: false
  },
  {
    title: 'Home Fitness & Skincare',
    description: 'Bodyweight workout + Orbitrack cardio & SPF 60 Sunscreen',
    timeRange: '06:45 AM - 07:20 AM',
    startTime: '06:45',
    endTime: '07:20',
    durationMinutes: 35,
    category: 'morning',
    order: 2,
    isAllDay: false
  },
  {
    title: 'Breakfast & Quick Flashcards',
    description: 'Healthy breakfast & 15-min quick note/flashcard review',
    timeRange: '07:20 AM - 08:00 AM',
    startTime: '07:20',
    endTime: '08:00',
    durationMinutes: 40,
    category: 'morning',
    order: 3,
    isAllDay: false
  },
  // Internship & Work Hours (08:30 AM - 04:30 PM)
  {
    title: 'Software Engineering Internship',
    description: 'Focused coding sprints, meetings & task execution',
    timeRange: '08:30 AM - 04:30 PM',
    startTime: '08:30',
    endTime: '16:30',
    durationMinutes: 480,
    category: 'internship',
    order: 4,
    isAllDay: false
  },
  {
    title: 'Stay Hydrated & Active',
    description: 'Keep up with time-marker water bottle & short posture breaks',
    timeRange: 'All Day Habit',
    startTime: '',
    endTime: '',
    durationMinutes: 0,
    category: 'internship',
    order: 5,
    isAllDay: true
  },
  // Evening, Final Exam Prep & Wind Down (04:30 PM - 12:00 AM)
  {
    title: 'Commute & Unwind',
    description: 'Travel back home and short mental reset / evening tea',
    timeRange: '04:30 PM - 05:30 PM',
    startTime: '16:30',
    endTime: '17:30',
    durationMinutes: 60,
    category: 'evening',
    order: 6,
    isAllDay: false
  },
  {
    title: 'Study Block 1 (Core Exam Theory)',
    description: 'Lecture notes, heavy concepts & module summaries',
    timeRange: '05:30 PM - 07:30 PM',
    startTime: '17:30',
    endTime: '19:30',
    durationMinutes: 120,
    category: 'evening',
    order: 7,
    isAllDay: false
  },
  {
    title: 'Dinner & Family Time',
    description: 'Relaxing dinner and quality chat with family',
    timeRange: '07:30 PM - 08:30 PM',
    startTime: '19:30',
    endTime: '20:30',
    durationMinutes: 60,
    category: 'evening',
    order: 8,
    isAllDay: false
  },
  {
    title: 'Study Block 2 (Past Papers & Practice)',
    description: 'Past paper questions, active recall & problem solving',
    timeRange: '08:30 PM - 10:15 PM',
    startTime: '20:30',
    endTime: '22:15',
    durationMinutes: 105,
    category: 'evening',
    order: 9,
    isAllDay: false
  },
  {
    title: 'Study Block 3 (Revision & Coding/Labs)',
    description: 'Light revision, short notes, or practical coding review',
    timeRange: '10:15 PM - 11:30 PM',
    startTime: '22:15',
    endTime: '23:30',
    durationMinutes: 75,
    category: 'evening',
    order: 10,
    isAllDay: false
  },
  {
    title: 'Relax & Plan Next Day',
    description: 'Listen to favorite music & plan tomorrow\'s study topics',
    timeRange: '11:30 PM - 12:00 AM',
    startTime: '23:30',
    endTime: '24:00',
    durationMinutes: 30,
    category: 'evening',
    order: 11,
    isAllDay: false
  },
  {
    title: 'Quality Sleep (6.5 Hours)',
    description: 'Deep rest for memory consolidation & next-day energy',
    timeRange: '12:00 AM - 06:30 AM',
    startTime: '00:00',
    endTime: '06:30',
    durationMinutes: 390,
    category: 'evening',
    order: 12,
    isAllDay: false
  }
];

// Helper: Seed initial tasks if empty
async function seedDefaultTasks() {
  try {
    const count = await Task.countDocuments();
    if (count === 0) {
      await Task.insertMany(defaultTasks);
      console.log('Seeded database with default schedule from image!');
    }
  } catch (err) {
    console.warn('Note: Could not seed tasks (DB might not be connected yet):', err.message);
  }
}

// Serverless Middleware to ensure DB connection on API calls
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('API MongoDB connection error:', err.message);
  }
  next();
});

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 1. Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    await seedDefaultTasks();
    const tasks = await Task.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Toggle task completion (Tick / Untick)
app.patch('/api/tasks/:id/toggle', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;
    await task.save();

    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Add a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, timeRange, startTime, endTime, durationMinutes, category, isAllDay } = req.body;
    const maxOrderTask = await Task.findOne().sort({ order: -1 });
    const nextOrder = maxOrderTask ? maxOrderTask.order + 1 : 1;

    const newTask = new Task({
      title,
      description,
      timeRange,
      startTime: startTime || '',
      endTime: endTime || '',
      durationMinutes: Number(durationMinutes) || 0,
      category: category || 'morning',
      isAllDay: !!isAllDay,
      order: nextOrder
    });

    await newTask.save();
    res.status(201).json({ success: true, data: newTask });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 4. Update task details
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 5. Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Reset all tasks for a fresh day (uncheck all)
app.post('/api/tasks/reset', async (req, res) => {
  try {
    await Task.updateMany({}, { $set: { completed: false, completedAt: null } });
    const tasks = await Task.find().sort({ order: 1 });
    res.json({ success: true, message: 'All tasks reset for today', data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Restore original image defaults
app.post('/api/tasks/restore-defaults', async (req, res) => {
  try {
    await Task.deleteMany({});
    await Task.insertMany(defaultTasks);
    const tasks = await Task.find().sort({ order: 1 });
    res.json({ success: true, message: 'Schedule restored to image defaults', data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Time calculations & stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const tasks = await Task.find();
    let totalScheduledMinutes = 0;
    let completedMinutes = 0;
    let totalTasks = tasks.length;
    let completedTasks = 0;

    tasks.forEach(t => {
      totalScheduledMinutes += t.durationMinutes || 0;
      if (t.completed) {
        completedTasks++;
        completedMinutes += t.durationMinutes || 0;
      }
    });

    const remainingMinutes = Math.max(0, totalScheduledMinutes - completedMinutes);
    const percentTasks = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const percentTime = totalScheduledMinutes ? Math.round((completedMinutes / totalScheduledMinutes) * 100) : 0;

    res.json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks: totalTasks - completedTasks,
        totalScheduledMinutes,
        completedMinutes,
        remainingMinutes,
        percentTasks,
        percentTime
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// If running directly (e.g. locally node server.js), start HTTP listener
if (require.main === module) {
  connectDB()
    .then(async () => {
      await seedDefaultTasks();
      app.listen(PORT, () => {
        console.log(`Smarter Daily Scheduler running at http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.warn('Local MongoDB startup failed, starting fallback server:', err.message);
      app.listen(PORT, () => {
        console.log(`Server running in fallback mode at http://localhost:${PORT}`);
      });
    });
}

// Export Express app for Vercel Serverless Function
module.exports = app;
