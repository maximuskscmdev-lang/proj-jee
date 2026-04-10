# JEE Pulse: High-Performance Advanced Prep App

A robust, modern, and interactive study center for JEE Advanced, built as a high-fidelity simulator and analytics engine.

## 1. Project Overview

**JEE Pulse** is a Local-First Web Application designed to be an all-in-one coach for JEE Advanced preparation. It replaces the need for expensive online platforms by providing a lag-free, high-fidelity exam simulation environment, deep performance analytics, and a smart, data-driven study schedule.

### Core Goals:
- **Simulation:** 1:1 replica of the actual JEE Advanced Computer Based Test (CBT) interface.
- **Analysis:** Topic-wise heatmaps, rank prediction, and "time-bleed" detection.
- **Discipline:** A schedule builder that adapts based on real performance data.
- **Access:** Completely free, offline-capable, and private (data stays on your device).

---

## 2. System Architecture

The app is built using a **Focused Modules** architecture to minimize distractions and maximize deep-work efficiency.

### 2.1 Modules:
1.  **The Exam Simulator (Mode: TEST):** High-fidelity exam engine with a virtual calculator, question palette, and official marking schemes.
2.  **The Performance Analyst (Mode: ANALYZE):** Dashboard showing heatmaps for sub-topic accuracy (Physics, Chemistry, Math), time-per-question, and rank trends.
3.  **The Smart Disciplinarian (Mode: STUDY):** Adaptive daily schedule builder with auto-revision reminders.
4.  **The Concept Library (Mode: LIBRARY):** Fast, searchable repository of PYQs (2015-2025), formula sheets, and concept visualizations.

### 2.2 Tech Stack:
- **Frontend:** React 19 (Modern, high-performance UI).
- **Typing:** TypeScript (Robust, error-free code).
- **Styling:** Vanilla CSS (Native speed, precise pixel control, Dark Mode support).
- **Storage:** IndexedDB (Local-First data persistence; no server needed).
- **Reporting:** `jspdf` for PDF generation (Export results and analytics).

---

## 3. Detailed Feature Specifications

### Phase 1: The Core Loop (MVP)
*   **Exact CBT Replica:** The header, timer, and question navigation must match the actual exam to build muscle memory.
*   **Marking System:** Support for Single Correct, Multiple Correct (with partial marking), Integer-type, and Matrix Match.
*   **Heatmap Analytics:** Topic-wise accuracy grid (Green for >80%, Yellow for 40-80%, Red for <40%).
*   **Time Tracking:** Measuring time spent per question vs. average successful attempts.

### Phase 2: The Smart Disciplinarian
*   **Daily Action Plan:** A timeline view of "What to study now" based on weak spots identified in Phase 1.
*   **Space-Repetition Logic:** Automatically surfacing Red/Yellow topics for revision every 3-7 days.
*   **Gamification:** Daily streaks and "Mastery Levels" for each subject.

### Phase 3: The Librarian
*   **PYQ Archive:** Categorized question bank with smart search (e.g., search for "Rotational Mechanics 2018").
*   **Formula Quick-Sheets:** Pop-up references accessible during "Practice" mode (but disabled in "Test" mode).

---

## 4. Data Flow & Privacy

- **Input:** User interacts with questions in the Simulator.
- **Persistence:** All attempts, marks, and timing data are saved instantly to `IndexedDB`.
- **Analysis:** The Analyst module reads raw attempt data and computes real-time aggregates for the Heatmap and Schedule.
- **Export:** Results can be exported as high-quality PDFs for record-keeping or printing.

---

## 5. Visual Identity & UI

- **Theme:** Minimalist, high-contrast, professional "Blue & Slate" default theme.
- **Dark Mode:** High-performance dark theme using CSS variables for night-time study sessions.
- **Interaction:** Instant feedback transitions, keyboard shortcuts (Alt+S for Save & Next, etc.).

---

## 6. Testing & Validation Strategy

- **UI Accuracy:** Side-by-side comparison with official mock tests.
- **Performance:** Ensure <100ms response time for question switching.
- **Data Integrity:** Unit tests for marking schemes (ensuring partial marking logic is 100% accurate).
- **Edge Cases:** Handling page refreshes during active mock tests without data loss.
