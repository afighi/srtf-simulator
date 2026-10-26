# Shortest Remaining Time First (SRTF) Simulator

An interactive web-based simulator for the Shortest Remaining Time First (SRTF) CPU scheduling algorithm, complete with a visual Gantt chart, step-by-step process metrics table, and overall performance statistics.

This project was developed for the **Platform Technologies** course during the 2nd year of college.

---

## Overview

Shortest Remaining Time First (SRTF) is the preemptive variant of Shortest Job First (SJF) scheduling. In this algorithm, the process with the smallest remaining execution (burst) time is selected to run next. If a newly arrived process requires less time to complete than the currently executing process, the CPU preempts the current job and allocates the CPU to the new one.

This simulator allows users to input custom arrival times and burst times, simulates the execution timeline tick by tick, visualizes the process flow on a Gantt chart, and calculates critical scheduling metrics including Turnaround Time, Waiting Time, and CPU Utilization.

---

## Features

- **Preemptive SRTF Algorithm**: Accurately simulates preemption and CPU idle time.
- **Dynamic Gantt Chart**: Generates a color-coded timeline illustrating the exact execution intervals for each process and idle states.
- **Detailed Process Table**: Computes and displays:
  - Arrival Time (AT)
  - Burst Time (BT)
  - End Time / Completion Time (ET)
  - Turnaround Time (TT = ET - AT)
  - Waiting Time (WT = TT - BT)
- **Summary Metrics**: Calculates Average Turnaround Time, Average Waiting Time, and CPU Utilization percentage.
- **Input Validation**: Ensures valid numeric inputs, positive burst times, and equal counts of arrival and burst times.
- **Reset Functionality**: Quick reset button to clear inputs, charts, and calculation tables.

---

## Scheduling Formulas

The simulator uses standard operating system scheduling metrics:

1. **Turnaround Time (TT)**:
   ```
   Turnaround Time = End Time (ET) - Arrival Time (AT)
   ```

2. **Waiting Time (WT)**:
   ```
   Waiting Time = Turnaround Time (TT) - Burst Time (BT)
   ```

3. **Average Turnaround Time**:
   ```
   Average Turnaround Time = (Sum of all Turnaround Times) / (Total Number of Processes)
   ```

4. **Average Waiting Time**:
   ```
   Average Waiting Time = (Sum of all Waiting Times) / (Total Number of Processes)
   ```

5. **CPU Utilization**:
   ```
   CPU Utilization = (Total Busy CPU Time / Total Schedule Time) * 100
   ```

---

## Example Walkthrough

### Inputs

- **Arrival Times**: `0 1 2 3`
- **Burst Times**: `8 4 9 5`

### Execution Timeline

1. **Time 0**: Process P1 arrives (burst: 8, remaining: 8). P1 starts execution.
2. **Time 1**: Process P2 arrives (burst: 4). Remaining time for P1 is 7. Since P2 (4) < P1 (7), P1 is preempted and P2 runs.
3. **Time 2**: Process P3 arrives (burst: 9). Remaining time for P2 is 3. P2 continues.
4. **Time 3**: Process P4 arrives (burst: 5). Remaining time for P2 is 2. P2 continues.
5. **Time 5**: P2 completes. Shortest remaining among ready processes {P1: 7, P3: 9, P4: 5} is P4. P4 runs.
6. **Time 10**: P4 completes. Shortest remaining among {P1: 7, P3: 9} is P1. P1 runs.
7. **Time 17**: P1 completes. P3 runs.
8. **Time 26**: P3 completes.

---

## Tech Stack

- **HTML5**: Semantic document structure and controls.
- **CSS3**: Clean user interface, layout containers, and styling for table and Gantt chart.
- **JavaScript (ES6)**: Preemptive scheduling engine, input validation, and DOM rendering.

---

## Getting Started

### Prerequisites

No external dependencies, package managers, or compilers are required. Any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, etc.) can run the project.

### Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/afighi/srtf-simulator.git
   ```

2. Navigate into the project directory:
   ```bash
   cd srtf-simulator
   ```

3. Open `index.html` directly in your browser:
   - Double click `index.html` in your file explorer, or
   - Right-click and choose "Open With" -> Your preferred web browser.

Alternatively, you can serve it using a local static server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve .
```
Then visit `http://localhost:8000` in your web browser.

---

## Project Structure

```
srtf-simulator/
├── index.html     # Application markup and input/output structure
├── style.css      # Layout, card containers, and Gantt chart styling
├── script.js     # SRTF algorithm logic, validation, and chart generation
└── README.md      # Project documentation
```

---

## Academic Context

This project was built for academic requirements in the **Platform Technologies** subject (2nd Year). It demonstrates fundamental CPU scheduling concepts, preemption handling, and performance evaluation in modern computer systems.
