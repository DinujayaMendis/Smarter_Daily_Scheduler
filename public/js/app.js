/**
 * SMARTER DAILY SCHEDULE - CLIENT APPLICATION
 * Features:
 * - Real-time clock and active task detector
 * - Countdown timer for active/upcoming schedule blocks
 * - Time calculations (Total hours, Completed hours, Remaining hours)
 * - Task completion toggle (Tick/untick) with MongoDB persistence
 * - Web Audio API completion chime & Canvas confetti
 * - Full CRUD & Filter capabilities
 */

// Application State
const state = {
  tasks: [],
  activeFilter: 'all',
  editingTaskId: null,
  soundEnabled: true,
  isOnline: false,
  activeTaskId: null
};

// Default image tasks for offline / fallback
const fallbackTasks = [
  { _id: '1', title: 'Wake Up & Hydration', description: 'Start the day with water (3000ml daily hydration goal)', timeRange: '06:30 AM - 06:45 AM', startTime: '06:30', endTime: '06:45', durationMinutes: 15, category: 'morning', completed: false, isAllDay: false, order: 1 },
  { _id: '2', title: 'Home Fitness & Skincare', description: 'Bodyweight workout + Orbitrack cardio & SPF 60 Sunscreen', timeRange: '06:45 AM - 07:20 AM', startTime: '06:45', endTime: '07:20', durationMinutes: 35, category: 'morning', completed: false, isAllDay: false, order: 2 },
  { _id: '3', title: 'Breakfast & Quick Flashcards', description: 'Healthy breakfast & 15-min quick note/flashcard review', timeRange: '07:20 AM - 08:00 AM', startTime: '07:20', endTime: '08:00', durationMinutes: 40, category: 'morning', completed: false, isAllDay: false, order: 3 },
  { _id: '4', title: 'Software Engineering Internship', description: 'Focused coding sprints, meetings & task execution', timeRange: '08:30 AM - 04:30 PM', startTime: '08:30', endTime: '16:30', durationMinutes: 480, category: 'internship', completed: false, isAllDay: false, order: 4 },
  { _id: '5', title: 'Stay Hydrated & Active', description: 'Keep up with time-marker water bottle & short posture breaks', timeRange: 'All Day Habit', startTime: '', endTime: '', durationMinutes: 0, category: 'internship', completed: false, isAllDay: true, order: 5 },
  { _id: '6', title: 'Commute & Unwind', description: 'Travel back home and short mental reset / evening tea', timeRange: '04:30 PM - 05:30 PM', startTime: '16:30', endTime: '17:30', durationMinutes: 60, category: 'evening', completed: false, isAllDay: false, order: 6 },
  { _id: '7', title: 'Study Block 1 (Core Exam Theory)', description: 'Lecture notes, heavy concepts & module summaries', timeRange: '05:30 PM - 07:30 PM', startTime: '17:30', endTime: '19:30', durationMinutes: 120, category: 'evening', completed: false, isAllDay: false, order: 7 },
  { _id: '8', title: 'Dinner & Family Time', description: 'Relaxing dinner and quality chat with family', timeRange: '07:30 PM - 08:30 PM', startTime: '19:30', endTime: '20:30', durationMinutes: 60, category: 'evening', completed: false, isAllDay: false, order: 8 },
  { _id: '9', title: 'Study Block 2 (Past Papers & Practice)', description: 'Past paper questions, active recall & problem solving', timeRange: '08:30 PM - 10:15 PM', startTime: '20:30', endTime: '22:15', durationMinutes: 105, category: 'evening', completed: false, isAllDay: false, order: 9 },
  { _id: '10', title: 'Study Block 3 (Revision & Coding/Labs)', description: 'Light revision, short notes, or practical coding review', timeRange: '10:15 PM - 11:30 PM', startTime: '22:15', endTime: '23:30', durationMinutes: 75, category: 'evening', completed: false, isAllDay: false, order: 10 },
  { _id: '11', title: 'Relax & Plan Next Day', description: 'Listen to favorite music & plan tomorrow\'s study topics', timeRange: '11:30 PM - 12:00 AM', startTime: '23:30', endTime: '24:00', durationMinutes: 30, category: 'evening', completed: false, isAllDay: false, order: 11 },
  { _id: '12', title: 'Quality Sleep (6.5 Hours)', description: 'Deep rest for memory consolidation & next-day energy', timeRange: '12:00 AM - 06:30 AM', startTime: '00:00', endTime: '06:30', durationMinutes: 390, category: 'evening', completed: false, isAllDay: false, order: 12 }
];

// DOM Elements
const elements = {
  currentDateText: document.getElementById('currentDateText'),
  currentTimeText: document.getElementById('currentTimeText'),
  dbStatusBadge: document.getElementById('dbStatusBadge'),
  dbStatusText: document.getElementById('dbStatusText'),
  soundToggleBtn: document.getElementById('soundToggleBtn'),
  soundIcon: document.getElementById('soundIcon'),
  resetDayBtn: document.getElementById('resetDayBtn'),
  restoreDefaultsBtn: document.getElementById('restoreDefaultsBtn'),
  openAddModalBtn: document.getElementById('openAddModalBtn'),
  activeTaskCard: document.getElementById('activeTaskCard'),
  activeBadgeText: document.getElementById('activeBadgeText'),
  activeTimeRange: document.getElementById('activeTimeRange'),
  activeTaskName: document.getElementById('activeTaskName'),
  activeTaskDesc: document.getElementById('activeTaskDesc'),
  activeCountdownDigits: document.getElementById('activeCountdownDigits'),
  activeCountdownBar: document.getElementById('activeCountdownBar'),
  completedTimeDisplay: document.getElementById('completedTimeDisplay'),
  totalScheduledTimeDisplay: document.getElementById('totalScheduledTimeDisplay'),
  timeProgressFill: document.getElementById('timeProgressFill'),
  tasksRatioDisplay: document.getElementById('tasksRatioDisplay'),
  percentTasksDisplay: document.getElementById('percentTasksDisplay'),
  tasksProgressFill: document.getElementById('tasksProgressFill'),
  remainingTimeDisplay: document.getElementById('remainingTimeDisplay'),
  remainingProgressFill: document.getElementById('remainingProgressFill'),
  badgeAllCount: document.getElementById('badgeAllCount'),
  badgeMorningCount: document.getElementById('badgeMorningCount'),
  badgeInternshipCount: document.getElementById('badgeInternshipCount'),
  badgeEveningCount: document.getElementById('badgeEveningCount'),
  morningTasksList: document.getElementById('morningTasksList'),
  internshipTasksList: document.getElementById('internshipTasksList'),
  eveningTasksList: document.getElementById('eveningTasksList'),
  morningDurationSum: document.getElementById('morningDurationSum'),
  internshipDurationSum: document.getElementById('internshipDurationSum'),
  eveningDurationSum: document.getElementById('eveningDurationSum'),
  sectionMorning: document.getElementById('sectionMorning'),
  sectionInternship: document.getElementById('sectionInternship'),
  sectionEvening: document.getElementById('sectionEvening'),
  taskModal: document.getElementById('taskModal'),
  modalTitle: document.getElementById('modalTitle'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  cancelModalBtn: document.getElementById('cancelModalBtn'),
  taskForm: document.getElementById('taskForm'),
  taskIdInput: document.getElementById('taskIdInput'),
  taskTitleInput: document.getElementById('taskTitleInput'),
  taskDescInput: document.getElementById('taskDescInput'),
  taskCategorySelect: document.getElementById('taskCategorySelect'),
  taskTimeRangeInput: document.getElementById('taskTimeRangeInput'),
  taskStartTimeInput: document.getElementById('taskStartTimeInput'),
  taskEndTimeInput: document.getElementById('taskEndTimeInput'),
  taskDurationInput: document.getElementById('taskDurationInput'),
  taskIsAllDayInput: document.getElementById('taskIsAllDayInput'),
  toastContainer: document.getElementById('toastContainer')
};

// ==========================================================================
// 1. CLOCK & ACTIVE TASK COUNTDOWN CALCULATION
// ==========================================================================

function updateLiveClock() {
  const now = new Date();

  // Formatted Date
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  elements.currentDateText.textContent = now.toLocaleDateString('en-US', dateOptions);

  // Formatted Time (with AM/PM & seconds)
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = String(hours % 12 || 12).padStart(2, '0');
  elements.currentTimeText.textContent = `${displayHours}:${minutes}:${seconds} ${ampm}`;

  // Evaluate Active Task & Countdown
  updateActiveTaskCountdown(now);
}

// Convert "HH:MM" to minutes from 00:00
function timeToMinutes(timeStr) {
  if (!timeStr) return null;
  const parts = timeStr.split(':');
  if (parts.length < 2) return null;
  let h = parseInt(parts[0], 10);
  let m = parseInt(parts[1], 10);
  if (h === 24) h = 24; // Handle 24:00 as midnight end
  return h * 60 + m;
}

function updateActiveTaskCountdown(now) {
  if (!state.tasks || state.tasks.length === 0) return;

  const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const currentMinutes = currentSeconds / 60;

  // Filter tasks with valid times
  const timedTasks = state.tasks.filter(t => !t.isAllDay && t.startTime && t.endTime);

  let activeTask = null;
  let nextTask = null;
  let minTimeToNext = Infinity;

  for (const task of timedTasks) {
    let startMin = timeToMinutes(task.startTime);
    let endMin = timeToMinutes(task.endTime);

    if (startMin === null || endMin === null) continue;

    // Handle overnight block (e.g. 00:00 to 06:30 or 23:00 to 06:00)
    if (endMin < startMin) {
      if (currentMinutes >= startMin || currentMinutes < endMin) {
        activeTask = {
          task,
          startMin: currentMinutes < endMin ? startMin - 1440 : startMin,
          endMin: currentMinutes < endMin ? endMin : endMin + 1440
        };
        break;
      }
    } else {
      if (currentMinutes >= startMin && currentMinutes < endMin) {
        activeTask = { task, startMin, endMin };
        break;
      }
    }

    // Check if upcoming
    let diff = startMin - currentMinutes;
    if (diff < 0) diff += 1440; // Next day
    if (diff > 0 && diff < minTimeToNext) {
      minTimeToNext = diff;
      nextTask = task;
    }
  }

  // Update DOM for active task card
  if (activeTask) {
    const { task, startMin, endMin } = activeTask;
    state.activeTaskId = task._id;

    elements.activeBadgeText.textContent = 'ACTIVE NOW';
    elements.activeTimeRange.textContent = task.timeRange;
    elements.activeTaskName.textContent = task.title;
    elements.activeTaskDesc.textContent = task.description || 'Focused block in progress';

    // Calculate Remaining Time down to seconds
    const totalDurationSec = (endMin - startMin) * 60;
    const elapsedSec = (currentMinutes - startMin) * 60;
    const remainingSec = Math.max(0, Math.floor(totalDurationSec - elapsedSec));

    const remH = Math.floor(remainingSec / 3600);
    const remM = Math.floor((remainingSec % 3600) / 60);
    const remS = remainingSec % 60;

    let timeString = '';
    if (remH > 0) {
      timeString = `${remH}h ${remM}m ${remS}s`;
    } else {
      timeString = `${remM}m ${remS}s`;
    }

    elements.activeCountdownDigits.textContent = timeString;
    const progressPercent = Math.min(100, Math.max(0, (elapsedSec / totalDurationSec) * 100));
    elements.activeCountdownBar.style.width = `${progressPercent}%`;

  } else if (nextTask) {
    state.activeTaskId = null;
    elements.activeBadgeText.textContent = 'UPCOMING NEXT';
    elements.activeTimeRange.textContent = `Starts at ${nextTask.startTime}`;
    elements.activeTaskName.textContent = nextTask.title;
    elements.activeTaskDesc.textContent = nextTask.description || 'Upcoming scheduled session';

    const remainingSec = Math.max(0, Math.floor(minTimeToNext * 60 - now.getSeconds()));
    const remH = Math.floor(remainingSec / 3600);
    const remM = Math.floor((remainingSec % 3600) / 60);
    const remS = remainingSec % 60;

    elements.activeCountdownDigits.textContent = remH > 0 ? `${remH}h ${remM}m ${remS}s` : `${remM}m ${remS}s`;
    elements.activeCountdownBar.style.width = '0%';
  } else {
    state.activeTaskId = null;
    elements.activeBadgeText.textContent = 'REST TIME';
    elements.activeTimeRange.textContent = 'All blocks complete';
    elements.activeTaskName.textContent = 'You have completed all scheduled tasks';
    elements.activeTaskDesc.textContent = 'Stay consistent and get plenty of rest!';
    elements.activeCountdownDigits.textContent = '00m 00s';
    elements.activeCountdownBar.style.width = '100%';
  }

  // Update active styling on cards
  document.querySelectorAll('.task-card').forEach(card => {
    const id = card.dataset.id;
    if (state.activeTaskId && id === state.activeTaskId) {
      card.classList.add('is-active');
    } else {
      card.classList.remove('is-active');
    }
  });
}

// ==========================================================================
// 2. TIME CALCULATIONS (Total Hours, Completed Hours, Remaining)
// ==========================================================================

function formatMinutesToHours(minutes) {
  if (!minutes || minutes <= 0) return '0h 00m';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

function updateCalculations() {
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(t => t.completed).length;

  let totalScheduledMinutes = 0;
  let completedMinutes = 0;
  let morningMinutes = 0;
  let internshipMinutes = 0;
  let eveningMinutes = 0;

  state.tasks.forEach(task => {
    const mins = Number(task.durationMinutes) || 0;
    totalScheduledMinutes += mins;

    if (task.completed) {
      completedMinutes += mins;
    }

    if (task.category === 'morning') morningMinutes += mins;
    else if (task.category === 'internship') internshipMinutes += mins;
    else if (task.category === 'evening') eveningMinutes += mins;
  });

  const remainingMinutes = Math.max(0, totalScheduledMinutes - completedMinutes);

  // Completed Time Display
  elements.completedTimeDisplay.textContent = formatMinutesToHours(completedMinutes);
  elements.totalScheduledTimeDisplay.textContent = formatMinutesToHours(totalScheduledMinutes);

  // Time progress bar
  const timePercent = totalScheduledMinutes ? Math.round((completedMinutes / totalScheduledMinutes) * 100) : 0;
  elements.timeProgressFill.style.width = `${timePercent}%`;

  // Tasks ratio display
  elements.tasksRatioDisplay.textContent = `${completedTasks} / ${totalTasks}`;
  const taskPercent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  elements.percentTasksDisplay.textContent = `${taskPercent}%`;
  elements.tasksProgressFill.style.width = `${taskPercent}%`;

  // Remaining time display
  elements.remainingTimeDisplay.textContent = formatMinutesToHours(remainingMinutes);
  const remainingPercent = totalScheduledMinutes ? Math.round((remainingMinutes / totalScheduledMinutes) * 100) : 0;
  elements.remainingProgressFill.style.width = `${remainingPercent}%`;

  // Section time sums
  elements.morningDurationSum.textContent = formatMinutesToHours(morningMinutes);
  elements.internshipDurationSum.textContent = formatMinutesToHours(internshipMinutes);
  elements.eveningDurationSum.textContent = formatMinutesToHours(eveningMinutes);

  // Tab count badges
  elements.badgeAllCount.textContent = totalTasks;
  elements.badgeMorningCount.textContent = state.tasks.filter(t => t.category === 'morning').length;
  elements.badgeInternshipCount.textContent = state.tasks.filter(t => t.category === 'internship').length;
  elements.badgeEveningCount.textContent = state.tasks.filter(t => t.category === 'evening').length;

  // Check for 100% completion celebration!
  if (totalTasks > 0 && completedTasks === totalTasks) {
    launchConfetti();
  }
}

// ==========================================================================
// 3. API & DATABASE INTEGRATION (MongoDB with LocalStorage Fallback)
// ==========================================================================

async function fetchTasks() {
  try {
    const response = await fetch('/api/tasks');
    if (!response.ok) throw new Error('API request failed');

    const result = await response.json();
    if (result.success && Array.isArray(result.data)) {
      state.tasks = result.data;
      setDbStatus(true, 'MongoDB Connected');
      saveToLocalStorage(state.tasks);
      renderTasks();
      updateCalculations();
      return;
    }
  } catch (err) {
    console.warn('MongoDB API unreachable, utilizing cached storage:', err.message);
    setDbStatus(false, 'Local Offline Mode');
    loadFromLocalStorage();
    renderTasks();
    updateCalculations();
  }
}

function setDbStatus(connected, text) {
  state.isOnline = connected;
  elements.dbStatusText.textContent = text;
  if (connected) {
    elements.dbStatusBadge.className = 'db-status-pill connected';
  } else {
    elements.dbStatusBadge.className = 'db-status-pill offline';
  }
}

function saveToLocalStorage(tasks) {
  try {
    localStorage.setItem('smarter_scheduler_tasks', JSON.stringify(tasks));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

function loadFromLocalStorage() {
  try {
    const cached = localStorage.getItem('smarter_scheduler_tasks');
    if (cached) {
      state.tasks = JSON.parse(cached);
    } else {
      state.tasks = [...fallbackTasks];
      saveToLocalStorage(state.tasks);
    }
  } catch (e) {
    state.tasks = [...fallbackTasks];
  }
}

// ==========================================================================
// 4. TASK TICKING (Completion Toggle)
// ==========================================================================

async function toggleTask(id) {
  const task = state.tasks.find(t => t._id === id);
  if (!task) return;

  // Optimistic UI update
  task.completed = !task.completed;
  task.completedAt = task.completed ? new Date().toISOString() : null;

  renderTasks();
  updateCalculations();

  if (task.completed) {
    playCompletionChime();
    showToast(`✓ "${task.title}" completed!`);
  }

  saveToLocalStorage(state.tasks);

  // Sync with MongoDB backend
  try {
    const res = await fetch(`/api/tasks/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to update task in DB');
    const data = await res.json();
    if (data.success && data.data) {
      // Synchronize with server updated state
      const idx = state.tasks.findIndex(t => t._id === id);
      if (idx !== -1) state.tasks[idx] = data.data;
      saveToLocalStorage(state.tasks);
    }
  } catch (err) {
    console.warn('Background sync failed, kept in local state:', err.message);
  }
}

// ==========================================================================
// 5. CRUD OPERATIONS (Add, Edit, Delete, Reset)
// ==========================================================================

async function handleTaskFormSubmit(e) {
  e.preventDefault();

  const id = elements.taskIdInput.value;
  const title = elements.taskTitleInput.value.trim();
  const description = elements.taskDescInput.value.trim();
  const category = elements.taskCategorySelect.value;
  const timeRange = elements.taskTimeRangeInput.value.trim();
  const startTime = elements.taskStartTimeInput.value;
  const endTime = elements.taskEndTimeInput.value;
  const isAllDay = elements.taskIsAllDayInput.checked;

  let durationMinutes = parseInt(elements.taskDurationInput.value, 10);
  if (isNaN(durationMinutes) || durationMinutes <= 0) {
    if (startTime && endTime) {
      const s = timeToMinutes(startTime);
      const e = timeToMinutes(endTime);
      if (s !== null && e !== null) {
        durationMinutes = e >= s ? e - s : (1440 - s) + e;
      } else {
        durationMinutes = 0;
      }
    } else {
      durationMinutes = 0;
    }
  }

  const payload = {
    title,
    description,
    category,
    timeRange,
    startTime,
    endTime,
    durationMinutes,
    isAllDay
  };

  if (id) {
    // Edit existing task
    try {
      if (state.isOnline) {
        const res = await fetch(`/api/tasks/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.success) {
          const idx = state.tasks.findIndex(t => t._id === id);
          if (idx !== -1) state.tasks[idx] = result.data;
        }
      } else {
        const idx = state.tasks.findIndex(t => t._id === id);
        if (idx !== -1) state.tasks[idx] = { ...state.tasks[idx], ...payload };
      }
      showToast('Task updated successfully');
    } catch (err) {
      showToast('Error saving task', 'error');
    }
  } else {
    // Create new task
    try {
      if (state.isOnline) {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.success) {
          state.tasks.push(result.data);
        }
      } else {
        const newTask = {
          _id: 'local_' + Date.now(),
          ...payload,
          completed: false,
          order: state.tasks.length + 1
        };
        state.tasks.push(newTask);
      }
      showToast('New task added to schedule');
    } catch (err) {
      showToast('Error adding task', 'error');
    }
  }

  saveToLocalStorage(state.tasks);
  closeModal();
  renderTasks();
  updateCalculations();
}

function openAddModal() {
  state.editingTaskId = null;
  elements.modalTitle.textContent = 'Add Schedule Task';
  elements.taskIdInput.value = '';
  elements.taskTitleInput.value = '';
  elements.taskDescInput.value = '';
  elements.taskCategorySelect.value = 'morning';
  elements.taskTimeRangeInput.value = '';
  elements.taskStartTimeInput.value = '';
  elements.taskEndTimeInput.value = '';
  elements.taskDurationInput.value = '';
  elements.taskIsAllDayInput.checked = false;

  elements.taskModal.classList.add('open');
  elements.taskModal.setAttribute('aria-hidden', 'false');
  elements.taskTitleInput.focus();
}

function openEditModal(task) {
  state.editingTaskId = task._id;
  elements.modalTitle.textContent = 'Edit Schedule Task';
  elements.taskIdInput.value = task._id;
  elements.taskTitleInput.value = task.title;
  elements.taskDescInput.value = task.description || '';
  elements.taskCategorySelect.value = task.category || 'morning';
  elements.taskTimeRangeInput.value = task.timeRange || '';
  elements.taskStartTimeInput.value = task.startTime || '';
  elements.taskEndTimeInput.value = task.endTime || '';
  elements.taskDurationInput.value = task.durationMinutes || '';
  elements.taskIsAllDayInput.checked = !!task.isAllDay;

  elements.taskModal.classList.add('open');
  elements.taskModal.setAttribute('aria-hidden', 'false');
  elements.taskTitleInput.focus();
}

function closeModal() {
  elements.taskModal.classList.remove('open');
  elements.taskModal.setAttribute('aria-hidden', 'true');
  state.editingTaskId = null;
}

async function deleteTask(id, title) {
  if (!confirm(`Are you sure you want to remove "${title}"?`)) return;

  try {
    if (state.isOnline) {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    }
    state.tasks = state.tasks.filter(t => t._id !== id);
    saveToLocalStorage(state.tasks);
    renderTasks();
    updateCalculations();
    showToast('Task removed from schedule');
  } catch (err) {
    showToast('Error removing task', 'error');
  }
}

async function resetAllTasksForToday() {
  if (!confirm('Reset all tasks for today? (This will uncheck all completed items)')) return;

  try {
    if (state.isOnline) {
      const res = await fetch('/api/tasks/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        state.tasks = data.data;
      }
    } else {
      state.tasks = state.tasks.map(t => ({ ...t, completed: false, completedAt: null }));
    }
    saveToLocalStorage(state.tasks);
    renderTasks();
    updateCalculations();
    showToast('Daily schedule reset for a fresh start!');
  } catch (err) {
    showToast('Failed to reset tasks', 'error');
  }
}

async function restoreDefaultTemplate() {
  if (!confirm('Restore the default schedule from the original image? Any custom tasks will be replaced.')) return;

  try {
    if (state.isOnline) {
      const res = await fetch('/api/tasks/restore-defaults', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        state.tasks = data.data;
      }
    } else {
      state.tasks = [...fallbackTasks];
    }
    saveToLocalStorage(state.tasks);
    renderTasks();
    updateCalculations();
    showToast('Original schedule template restored!');
  } catch (err) {
    showToast('Failed to restore defaults', 'error');
  }
}

// ==========================================================================
// 6. RENDER TASK CARDS
// ==========================================================================

function createTaskCardHTML(task) {
  const badgeClass = task.category === 'morning'
    ? 'badge-morning'
    : task.category === 'internship'
      ? 'badge-internship'
      : 'badge-evening';

  const durationLabel = task.durationMinutes > 0
    ? `${task.durationMinutes >= 60 ? (task.durationMinutes / 60).toFixed(1) + 'h' : task.durationMinutes + 'm'}`
    : (task.isAllDay ? 'All Day' : '');

  const isCompleted = task.completed ? 'is-completed' : '';
  const isActive = (state.activeTaskId && state.activeTaskId === task._id) ? 'is-active' : '';

  return `
    <article class="task-card ${isCompleted} ${isActive}" data-id="${task._id}">
      <div class="task-check-wrap">
        <input 
          type="checkbox" 
          class="custom-checkbox" 
          id="chk_${task._id}"
          ${task.completed ? 'checked' : ''}
          aria-label="Mark ${escapeHtml(task.title)} as done"
        >
      </div>

      <div class="time-badge-wrap">
        <span class="time-badge ${badgeClass}">
          ${escapeHtml(task.timeRange)}
        </span>
      </div>

      <div class="task-content">
        <div class="task-title">
          <span>${escapeHtml(task.title)}</span>
          ${task.completed ? '<span class="completed-tag">✓ Done</span>' : ''}
          ${durationLabel ? `<span class="duration-tag">${durationLabel}</span>` : ''}
        </div>
        <div class="task-desc">${escapeHtml(task.description || '')}</div>
      </div>

      <div class="task-actions">
        <button class="task-action-btn btn-edit" title="Edit task" data-action="edit" data-id="${task._id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="task-action-btn btn-delete" title="Delete task" data-action="delete" data-id="${task._id}" data-title="${escapeHtml(task.title)}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </article>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

function renderTasks() {
  const morningTasks = [];
  const internshipTasks = [];
  const eveningTasks = [];

  state.tasks.forEach(t => {
    if (t.category === 'morning') morningTasks.push(t);
    else if (t.category === 'internship') internshipTasks.push(t);
    else if (t.category === 'evening') eveningTasks.push(t);
  });

  // Morning List
  elements.morningTasksList.innerHTML = morningTasks.length
    ? morningTasks.map(createTaskCardHTML).join('')
    : '<div style="padding: 12px; color: #94a3b8; font-size: 0.85rem;">No morning tasks scheduled</div>';

  // Internship List
  elements.internshipTasksList.innerHTML = internshipTasks.length
    ? internshipTasks.map(createTaskCardHTML).join('')
    : '<div style="padding: 12px; color: #94a3b8; font-size: 0.85rem;">No internship tasks scheduled</div>';

  // Evening List
  elements.eveningTasksList.innerHTML = eveningTasks.length
    ? eveningTasks.map(createTaskCardHTML).join('')
    : '<div style="padding: 12px; color: #94a3b8; font-size: 0.85rem;">No evening tasks scheduled</div>';

  // Apply Filter Visibility
  applyFilter(state.activeFilter);
}

function applyFilter(filter) {
  state.activeFilter = filter;

  document.querySelectorAll('.filter-tab').forEach(tab => {
    if (tab.dataset.category === filter) {
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
    } else {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
    }
  });

  if (filter === 'all') {
    elements.sectionMorning.style.display = 'block';
    elements.sectionInternship.style.display = 'block';
    elements.sectionEvening.style.display = 'block';
  } else if (filter === 'morning') {
    elements.sectionMorning.style.display = 'block';
    elements.sectionInternship.style.display = 'none';
    elements.sectionEvening.style.display = 'none';
  } else if (filter === 'internship') {
    elements.sectionMorning.style.display = 'none';
    elements.sectionInternship.style.display = 'block';
    elements.sectionEvening.style.display = 'none';
  } else if (filter === 'evening') {
    elements.sectionMorning.style.display = 'none';
    elements.sectionInternship.style.display = 'none';
    elements.sectionEvening.style.display = 'block';
  }
}

// ==========================================================================
// 7. WEB AUDIO CHIME & CONFETTI CELEBRATION
// ==========================================================================

function playCompletionChime() {
  if (!state.soundEnabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Gentle melodic 2-note chime (E5 -> A5)
    osc.frequency.setValueAtTime(659.25, now);
    osc.frequency.setValueAtTime(880, now + 0.1);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  } catch (e) {
    // Audio context may require prior user interaction on some browsers
  }
}

function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiCount = 100;
  const particles = [];
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

  for (let i = 0; i < confettiCount; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      w: Math.random() * 8 + 4,
      h: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 16,
      gravity: 0.35,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  let animationFrame;
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeParticles = 0;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.008;

      if (p.opacity > 0) {
        activeParticles++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    });

    if (activeParticles > 0) {
      animationFrame = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  render();
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// ==========================================================================
// 8. EVENT LISTENERS
// ==========================================================================

function setupEventListeners() {
  // Delegate Checkbox Click & Action Buttons
  document.getElementById('scheduleGrid').addEventListener('click', e => {
    // Checkbox click
    if (e.target.classList.contains('custom-checkbox')) {
      const card = e.target.closest('.task-card');
      if (card && card.dataset.id) {
        toggleTask(card.dataset.id);
      }
      return;
    }

    // Action button clicks
    const actionBtn = e.target.closest('.task-action-btn');
    if (actionBtn) {
      const action = actionBtn.dataset.action;
      const id = actionBtn.dataset.id;
      if (action === 'edit') {
        const task = state.tasks.find(t => t._id === id);
        if (task) openEditModal(task);
      } else if (action === 'delete') {
        const title = actionBtn.dataset.title;
        deleteTask(id, title);
      }
    }
  });

  // Filter Tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      applyFilter(tab.dataset.category);
    });
  });

  // Open Add Modal
  elements.openAddModalBtn.addEventListener('click', openAddModal);

  // Close Modal Buttons
  elements.closeModalBtn.addEventListener('click', closeModal);
  elements.cancelModalBtn.addEventListener('click', closeModal);

  // Modal overlay click outside
  elements.taskModal.addEventListener('click', e => {
    if (e.target === elements.taskModal) closeModal();
  });

  // Form submit
  elements.taskForm.addEventListener('submit', handleTaskFormSubmit);

  // Reset day button
  elements.resetDayBtn.addEventListener('click', resetAllTasksForToday);

  // Restore defaults button
  elements.restoreDefaultsBtn.addEventListener('click', restoreDefaultTemplate);

  // Sound toggle button
  elements.soundToggleBtn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    elements.soundIcon.textContent = state.soundEnabled ? '🔔' : '🔕';
    showToast(state.soundEnabled ? 'Sound alerts enabled' : 'Sound alerts muted');
  });

  // Print / Save as PDF button
  const printBtn = document.getElementById('printScheduleBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Scroll to Top button
  const topBtn = document.getElementById('scrollToTopBtn');
  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Keyboard shortcut: Escape to close modal
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && elements.taskModal.classList.contains('open')) {
      closeModal();
    }
  });
}

// ==========================================================================
// 9. INITIALIZATION
// ==========================================================================

function init() {
  setupEventListeners();
  updateLiveClock();
  setInterval(updateLiveClock, 1000); // 1-second pulse for ticking countdown
  fetchTasks();
}

document.addEventListener('DOMContentLoaded', init);
