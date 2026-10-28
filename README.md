# ⏱️ Smarter Daily Scheduler (Daily Routine & Exam Prep Tracker)

A modern, high-performance daily schedule web application built with **HTML5**, **Vanilla CSS3**, **JavaScript**, and **MongoDB**. Designed with an elegant, crisp **White Theme** aesthetic that brings the schedule chart to life with real-time active task tracking, countdown calculations, interactive task ticking (checkmarks), sound effects, and full persistence.

---

## 🌟 Key Features

1. **Exact Schedule Template (from image)**:
   - **Morning Routine & Fitness (06:30 AM - 08:00 AM)**: Emerald Green accent
   - **Internship & Work Hours (08:30 AM - 04:30 PM)**: Electric Blue accent
   - **Evening, Final Exam Prep & Wind Down (04:30 PM - 12:00 AM)**: Royal Purple accent

2. **White Theme Aesthetics**:
   - Clean, light UI with soft mesh gradients, crisp white cards, refined border-radii, and subtle drop shadows.
   - High-contrast, easy-to-read typography powered by Google's *Plus Jakarta Sans* and *JetBrains Mono*.

3. **Time Calculations ("time count eka gananya karanna")**:
   - **Live Active Task Tracker**: Automatically detects what task should be happening right now according to your device clock and highlights it with an animated pulsing indicator (`ACTIVE NOW`).
   - **Live Countdown Timer**: Counts down the exact minutes and seconds remaining in the current active block or until the next block begins.
   - **Total Planned Time**: Shows total hours scheduled (24h 00m).
   - **Completed Time**: Dynamically sums completed hours and minutes as you check off tasks.
   - **Remaining Time**: Calculates how many hours and minutes are left for the day.
   - **Daily Progress Bar**: Real-time progress bar showing percentage of completed tasks and time.

4. **Interactive Task Ticking ("task eka tick karanna")**:
   - Custom animated checkbox for every task.
   - Strike-through and badge update on completion.
   - Web Audio API melodic completion chime (no external audio files required!).
   - Confetti celebration when all daily tasks are completed.

5. **MongoDB Database Integration**:
   - Persistent task storage using Mongoose & MongoDB.
   - Automatically seeds default schedule if the database is empty.
   - Automatic offline fallback using LocalStorage if MongoDB is temporarily unavailable.

6. **Full Customization**:
   - Add new custom tasks / blocks with duration calculations.
   - Edit existing task titles, time ranges, and notes.
   - Delete tasks.
   - "Reset Day" button to uncheck all tasks for a fresh morning.
   - "Restore Image Template" button to reset everything back to the original schedule.

7. **📊 Visual Analytics & Reports Dashboard (`analytics.html`)**:
   - **Timeframe Filtering**: Seamlessly toggle between **Daily**, **Weekly (7 Days)**, and **Monthly (30 Days)** views.
   - **Interactive Charts (powered by Chart.js 4.4)**:
     - 📈 **Hours Tracked vs Scheduled**: Combo Bar and Line chart showing daily execution volume.
     - 🍩 **Time Allocation Donut**: Visual routine share across Morning, Internship, Exam Prep, and Sleep pillars.
     - 📊 **Exam Prep Intensity Breakdown**: Stacked bar chart for Core Theory, Past Papers, and Labs/Revision.
     - 📉 **Completion Rate Trend**: Smooth area line chart tracking consistency against high-performance goals.
   - **Schedule Consistency Matrix**: Comprehensive adherence table displaying task completion frequencies and badges.
   - **One-Click Export**: Print or save comprehensive analytical reports as clean PDFs.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher installed)
- **MongoDB** running locally on port `27017` (e.g. `mongodb://127.0.0.1:27017`)

### 2. Installation
All dependencies are already installed in this directory:
```bash
npm install
```

### 3. Start the Application
Run the server:
```bash
npm start
```
or with automatic reload:
```bash
npm run dev
```

### 4. Open in Browser
Visit:
```
http://localhost:3000
```

---

## ⚡ Deploying to Vercel (Production)

This project is pre-configured for seamless **Vercel Serverless** deployment via `vercel.json` and `api/index.js`.

### Step 1: Set Up MongoDB Atlas (Cloud Database)
Since Vercel runs in the cloud, it cannot connect to your local `127.0.0.1:27017`. You need a free cloud MongoDB:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a user (username & password).
4. Under **Network Access**, click **Add IP Address** and choose **Allow Access From Anywhere** (`0.0.0.0/0`).
5. Click **Connect** &rarr; **Drivers** and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/smarter_scheduler?retryWrites=true&w=majority
   ```

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Add Vercel serverless configuration"
git push origin <your-branch>
```

### Step 3: Deploy on Vercel
1. Log in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** &rarr; **Project**.
3. Import your GitHub repository (`Smarter_Daily_Scheduler`).
4. In the **Environment Variables** section, add:
   - **Key**: `MONGODB_URI`
   - **Value**: Your MongoDB Atlas connection string from Step 1.
5. Click **Deploy**!
6. Vercel will build and assign you a live HTTPS production URL (e.g., `https://smarter-daily-scheduler.vercel.app`).

---

## 📁 Project Structure

```
Smarter_Daily_Scheduler/
├── models/
│   └── Task.js              # Mongoose schema for schedule tasks
├── public/
│   ├── css/
│   │   └── style.css        # Modern White Theme stylesheet & animations
│   ├── js/
│   │   └── app.js           # Real-time clock, countdowns, time math & API calls
│   └── index.html           # Semantic HTML5 layout
├── package.json             # Project dependencies and start scripts
├── server.js                # Express & MongoDB backend API
└── README.md                # Documentation
```

---

## 📡 REST API Endpoints

- `GET /api/tasks` - Fetch all tasks (auto-seeds defaults on first run)
- `PATCH /api/tasks/:id/toggle` - Tick / untick task completion
- `POST /api/tasks` - Add a new task
- `PUT /api/tasks/:id` - Update existing task details
- `DELETE /api/tasks/:id` - Delete a task
- `POST /api/tasks/reset` - Reset all tasks for a fresh day (uncheck all)
- `POST /api/tasks/restore-defaults` - Restore original schedule from image
- `GET /api/stats` - Fetch computed time statistics (scheduled, completed, remaining minutes)