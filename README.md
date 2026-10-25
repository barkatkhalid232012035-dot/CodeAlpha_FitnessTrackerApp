# CodeAlpha Fitness Tracker App ⚡

[![CodeAlpha Internship](https://img.shields.io/badge/CodeAlpha-App%20Development%20Internship-0ea5e9.svg)](https://www.codealpha.tech/)
[![Task](https://img.shields.io/badge/Task-3%3A%20Fitness%20Tracker%20App-10b981.svg)](#features)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: Complete](https://img.shields.io/badge/Status-Complete%20%26%20Tested-10b981.svg)](#testing)

A comprehensive, responsive, and visually dynamic Fitness Tracking dashboard built as part of the **CodeAlpha App Development Internship**. Designed for users to track daily workouts, log steps, monitor active duration and calories burned, visualize 7-day progress via dynamic pure SVG charts, and persist all records locally using browser `LocalStorage`.

---

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Internship Context & Compliance](#internship-context--compliance)
- [Key Features](#key-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [How to Run the Application](#how-to-run-the-application)
- [Running Automated Unit Tests](#running-automated-unit-tests)
- [Screenshots & UI Showcase](#screenshots--ui-showcase)
- [Limitations & Future Enhancements](#limitations--future-enhancements)
- [License & Acknowledgments](#license--acknowledgments)

---

## 🎯 Project Overview

Maintaining consistency in physical health requires clear tracking, actionable visual feedback, and quantifiable goals. The **CodeAlpha Fitness Tracker App** serves as a complete personal dashboard:
* **Manual Activity Logging:** Easily record workouts (Running, Cycling, Walking, Swimming, Strength Training, HIIT, Yoga) with duration, auto-estimated or custom calories, steps, dates, and workout notes.
* **Daily Goal Rings:** Circular SVG progress indicators displaying real-time completion percentages against customizable daily targets for steps, calories, and active duration.
* **Dynamic 7-Day Chart:** Interactive pure SVG bar chart illustrating weekly workout trends across duration, calories, or step counts.
* **Weekly Summary Rollup:** Aggregate cards displaying total workouts, cumulative active time, total steps taken, and calories burned over the rolling past week.
* **Persistent Storage:** Completely client-side and offline-capable using browser `LocalStorage`, pre-seeded with starter data so the dashboard is immediately functional.

---

## 🏢 Internship Context & Compliance

This project directly satisfies all the mandatory requirements from the official **CodeAlpha App Development Tasks & Instructions** document:

| Instructor Requirement | Implementation Detail | Status |
| :--- | :--- | :---: |
| **Track daily fitness activities (steps, workouts, calories, etc.)** | Full activity data structure tracking exercise type, minutes, steps, calories burned, date, and notes. | ✅ Complete |
| **Manual data entry modal/form** | Interactive modal form with presets, input validation, and automatic MET calorie estimation. | ✅ Complete |
| **Dashboard or summary screen showing daily & weekly progress** | Metric cards with daily goal progress rings plus a 7-day rolling weekly rollup metrics grid. | ✅ Complete |
| **Visual elements like graphs or progress bars** | Pure dynamic SVG 7-day bar chart (switchable between duration/calories/steps) and circular progress rings. | ✅ Complete |
| **Persistent storage using local storage** | Robust `FitnessStorageService` using `LocalStorage` with JSON serialization, seed data, and schema stability. | ✅ Complete |
| **Distinguishes user-entered data from device sensors** | Explicit `isManual: true` metadata tag on all records; no deceptive claims of hardware pedometer access. | ✅ Complete |

---

## ✨ Key Features

1. **MET-Based Calorie Estimation:** Uses standard scientific Metabolic Equivalent of Task (MET) rates to auto-estimate calories based on exercise type and duration, with full manual override.
2. **Interactive Pure SVG Bar Chart:**
   * Toggle between Duration (mins), Calories (kcal), and Steps.
   * Auto-scaling Y-axis calculated dynamically from data maximums.
   * Highlighted bar representing today's current activity.
3. **Circular SVG Goal Rings:** Animated SVG circles that adjust their `stroke-dashoffset` as you log workouts throughout the day.
4. **Customizable Targets:** Click "Daily Goals" to configure your own targets for steps, calories, and active minutes.
5. **Activity Log Table:** Comprehensive historical ledger with exercise type badges, individual row deletion, and empty-state guidance.

---

## 🛠️ Architecture & Tech Stack

Engineered using clean vanilla web standards with zero bloated third-party dependencies:

* **Markup (HTML5):** Accessible semantic structure with tables, forms, and SVG elements.
* **Styling (CSS3):** Modern dark theme design system, CSS Grid, Flexbox, responsive typography, and smooth transitions.
* **Logic (JavaScript ES6+):**
  * `storage.js` — Handles `LocalStorage` persistence, defaults, and realistic initial starter records.
  * `tracker-model.js` — Business domain model handling validation, MET algorithms, daily progress, and weekly rollups.
  * `chart-renderer.js` — Pure SVG rendering engine generating 7-day bar charts and circular progress rings.
  * `app.js` — Dashboard coordinator managing UI updates, modals, and user events.
* **Testing:** In-browser automated unit and integration test runner (`tests/test-runner.html`).

---

## 📂 Folder Structure

```
CodeAlpha_FitnessTrackerApp/
├── index.html                  # Dashboard, metric cards, chart, logging modal
├── css/
│   └── style.css               # Dashboard layout, responsive grid, progress rings
├── js/
│   ├── app.js                  # Dashboard controller & UI coordinator
│   ├── tracker-model.js        # Activity records, metrics & weekly aggregation
│   ├── chart-renderer.js       # Pure SVG dynamic 7-day bar chart & progress rings
│   └── storage.js              # Persistent storage layer with demo seeds
├── tests/
│   └── test-runner.html        # Automated test suite for calculations & storage
├── .gitignore                  # Clean git configuration
└── README.md                   # Comprehensive professional documentation
```

---

## ⚡ Prerequisites

To run this application, all you need is a modern web browser:
* Google Chrome (v90+)
* Microsoft Edge (v90+)
* Mozilla Firefox (v88+)
* Apple Safari (v14+)

*No Node.js, Python, or compiler installations are required.*

---

## 🚀 How to Run the Application

1. **Clone or Download the Repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/CodeAlpha_FitnessTrackerApp.git
   cd CodeAlpha_FitnessTrackerApp
   ```
2. **Launch the Application:**
   * Double-click `index.html` to open it directly in your browser.
   * Or right-click `index.html` and choose **Open with > Google Chrome** (or Edge/Firefox).

---

## 🧪 Running Automated Unit Tests

This project includes a comprehensive in-browser unit test suite covering calorie calculations, input validation, daily/weekly aggregation, and storage operations.

1. Navigate to the `tests/` folder.
2. Open `test-runner.html` in your web browser.
3. The test suite will execute all 7 test assertions and report pass/fail statuses.

---

## 📸 Screenshots & UI Showcase

```
+-------------------------------------------------------------------------+
|  CodeAlpha Internship • Task 3           [🎯 Daily Goals] [➕ Log Activity]|
|  Fitness Tracker Dashboard                                              |
|                                                                         |
|  +--------------------+   +--------------------+   +--------------------+
|  | TODAY'S STEPS      |   | CALORIES BURNED    |   | ACTIVE WORKOUT     |
|  | 8,700 steps  (87%) |   | 470 kcal     (94%) |   | 65 mins     (100%) |
|  | (SVG Progress Ring)|   | (SVG Progress Ring)|   | (SVG Progress Ring)|
|  +--------------------+   +--------------------+   +--------------------+
|                                                                         |
|  WEEKLY PROGRESS ANALYSIS        [Duration (mins)] [Calories] [Steps]   |
|  +-------------------------------------------------------------------+  |
|  |        ||         ||         ||         ||                        |  |
|  |   ||   ||    ||   ||    ||   ||   [||]  (Interactive SVG Chart)   |  |
|  |  Sun  Mon   Tue  Wed   Thu  Fri  Today                            |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
|  TOTAL WORKOUTS: 7  •  ACTIVE TIME: 245m  •  STEPS: 27,200  •  CAL: 2,180
|                                                                         |
|  ACTIVITY HISTORY LOG                                                   |
|  Date       Type        Duration    Calories    Steps     Notes         |
|  2026-10-23 Running     35 mins     360 kcal    4,800     Morning jog   |
+-------------------------------------------------------------------------+
```

---

## 🔮 Limitations & Future Enhancements

* **Hardware Pedometer / Sensor Integration:** Connecting with the Web Bluetooth API or mobile sensor APIs for live hardware step counting.
* **Export & Import (JSON / CSV):** Allowing users to backup their health data or export it for analysis in spreadsheet tools.
* **Custom Workout Types:** User-defined exercise categories with custom MET calorie burn multipliers.
* **Dark / Light Theme Toggle:** Adding an optional high-contrast daylight theme.

---

## 📄 License & Acknowledgments

* **License:** Distributed under the [MIT License](https://opensource.org/licenses/MIT).
* **Organization:** Developed for the **CodeAlpha App Development Internship Program**.
* **Instructor:** CodeAlpha Academic & Mentorship Team ([www.codealpha.tech](https://www.codealpha.tech/)).
