# 🌸 Blossom — Habit Tracker

> A full-featured personal productivity app built with React, Vite, and Recharts. Track daily habits, tasks, finances, and streaks — all stored locally in your browser with zero backend.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2-22b5bf?style=flat)
![LocalStorage](https://img.shields.io/badge/Storage-LocalStorage-f59e0b?style=flat)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## 🖥️ Live Demo

> > https://habit-tracker-dbml.vercel.app/

---

## 📸 Preview

| Dashboard & Calendar | Daily Check-In | Analytics |
|---|---|---|
| Heat-mapped monthly view | Habit questions + diary | Year heatmap + insights |

---

## 🚀 Tech Stack

| Technology | Role |
|---|---|
| **React 18** | Component architecture, hooks, Context API |
| **Vite 5** | Lightning-fast dev server & build tool |
| **Recharts** | Finance and analytics charts |
| **LocalStorage** | Zero-backend persistent data layer |
| **CSS Variables** | Fully custom design system (no UI library) |

---

## ✨ Key Features

- **Monthly Calendar** with GitHub-style productivity heat map (5 intensity levels)
- **Daily Check-In Modal** — 5 habit questions, diary notes, per-day task manager
- **Streak Tracking** — calculated dynamically across all months and years
- **Finance Tracker** — log expenses by category, visualise monthly spending trends
- **Analytics Page** — full-year heatmap, monthly bar chart, top-days leaderboard
- **Multi-year support** — all data keyed as `YYYY-MM-DD`, navigate any month/year
- **100% offline** — no API, no auth, no database; data persists in `localStorage`

---

## 🗂 Project Structure

```
src/
├── context/        # Global state (AppContext) via React Context API
├── hooks/          # Custom hooks (useMonthlyStats, etc.)
├── utils/          # storage.js · dateHelpers.js · scoring.js
├── components/     # Calendar · Sidebar · Modal · Background · Finance · Tasks
├── pages/          # Dashboard · AnalyticsPage
├── App.jsx
└── main.jsx
```

---

## ⚡ Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/habit-tracker.git
cd habit-tracker

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

```bash
# Production build
npm run build
```

---

## 🧮 Productivity Score Logic

Each day is scored **0–5** from a weighted rubric:

| Signal | Weight |
|---|---|
| DSA problem solved | +2 |
| Study intensity (Low / Medium / High) | +1 / +2 / +3 |
| Healthy eating | +2 |
| Exercise | +2 |
| Self-rated productivity (1–5) | +1–5 |
| Task completion ratio | up to +3 |

Score normalised to 0–5 → drives calendar heat map colour intensity.

---

## 💾 Data Schema

All data lives in `localStorage` under `blossom_habit_v3`:

```json
{
  "2025-03-31": {
    "checkin": {
      "dsa": "Yes",
      "study": "High",
      "healthy": "Yes",
      "exercise": "No",
      "productive": 4,
      "diary": "Great focus session today."
    },
    "tasks": [
      { "id": 1711872000000, "text": "Solve 2 LeetCode problems", "done": true }
    ],
    "expenses": [
      { "id": 1711872001000, "amount": 120, "cat": "Food", "note": "Lunch" }
    ]
  }
}
```

---

## 📄 License

MIT — free to use and modify.
