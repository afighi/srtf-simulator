// Array to store processes and process ID counter
let processes = [];
let processID = 1;

// OnClick function for adding processes
document.getElementById('add-process-btn').onclick = function() {
    const arrivalTimes = document.getElementById('arrival-times').value.trim().split(' ');
    const burstTimes = document.getElementById('burst-times').value.trim().split(' ');

    // Validation: Ensure input fields are not empty
    if (arrivalTimes.length === 0 || burstTimes.length === 0 || arrivalTimes[0] === '' || burstTimes[0] === '') {
        alert('Arrival Times and Burst Times fields should not be empty');
        return;
    }

    // Validation: Check if the number of arrival times matches burst times
    if (arrivalTimes.length !== burstTimes.length) {
        alert('Number of the arrival times and burst times do not match');
        return;
    }

    // Validation: Check for valid numeric values and non-zero burst times
    for (let i = 0; i < arrivalTimes.length; i++) {
        const arrivalTime = parseInt(arrivalTimes[i], 10);
        const burstTime = parseInt(burstTimes[i], 10);

        if (isNaN(arrivalTime) || isNaN(burstTime)) {
            alert('Please enter valid numeric values for Arrival and Burst Times');
            return;
        }

        if (burstTime <= 0) {
            alert(`Burst time for process ${i + 1} must be greater than zero.`);
            return;
        }
    }

    // Populate processes array
    processes = [];
    for (let i = 0; i < arrivalTimes.length; i++) {
        processes[i] = {
            id: processID,
            arrivalTime: parseInt(arrivalTimes[i], 10),
            burstTime: parseInt(burstTimes[i], 10),
            remainingTime: parseInt(burstTimes[i], 10)
        };
        processID++;
    }

    // Display and calculate SRTF
    displayProcesses();
    calculateSRTF();
};

// Clear button functionality
document.getElementById('clear-btn').onclick = function() {
    clearFields();
};

// Clear fields function
function clearFields() {
    // Reset input fields
    document.getElementById('arrival-times').value = '';
    document.getElementById('burst-times').value = '';

    // Clear process table and Gantt chart
    const tableBody = document.getElementById('process-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    const ganttContainer = document.getElementById('gantt-container');
    ganttContainer.innerHTML = '';

    // Clear result fields
    document.getElementById('turnaround-time').textContent = '';
    document.getElementById('waiting-time').textContent = '';
    document.getElementById('cpu-utilization').textContent = '';

    // Reset processes array and processID
    processes = [];
    processID = 1;
}

// Function to display processes in the table
function displayProcesses() {
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    const tableBody = document.getElementById('process-table').getElementsByTagName('tbody')[0];
    let tableHTML = '';

    for (let i = 0; i < processes.length; i++) {
        tableHTML += '<tr>';
        tableHTML += '<td>' + processes[i].id + '</td>';
        tableHTML += '<td>' + processes[i].arrivalTime + '</td>';
        tableHTML += '<td>' + processes[i].burstTime + '</td>';
        tableHTML += '</tr>';
    }
    tableBody.innerHTML = tableHTML;
}

// Shortest Remaining Time First (SRTF) calculation
function calculateSRTF() {
    let time = 0;
    let completedProcesses = [];
    let ganttChart = [];
    let processLog = [];

    while (processes.length > 0) {
        let currentProcess = null;
        let isPreemption = false;

        // Select process with the shortest remaining time
        for (let i = 0; i < processes.length; i++) {
            if (processes[i].arrivalTime <= time && processes[i].remainingTime > 0) {
                if (currentProcess === null || processes[i].remainingTime < currentProcess.remainingTime) {
                    currentProcess = processes[i];
                    isPreemption = true;
                }
            }
        }

        // Handle idle periods if no process is ready
        if (!currentProcess) {
            if (ganttChart.length === 0 || ganttChart[ganttChart.length - 1].processID !== "Idle") {
                ganttChart.push({ processID: "Idle", startTime: time, endTime: time + 1 });
            } else {
                ganttChart[ganttChart.length - 1].endTime++;
            }
            time++;
            continue;
        }

        // Handle process execution and preemption
        if (ganttChart.length === 0 || ganttChart[ganttChart.length - 1].processID !== currentProcess.id) {
            ganttChart.push({
                processID: currentProcess.id,
                startTime: time,
                endTime: time + 1
            });
        } else {
            ganttChart[ganttChart.length - 1].endTime++;
        }

        currentProcess.remainingTime--;
        time++;

        // If process completes, record its metrics
        if (currentProcess.remainingTime === 0) {
            const completionTime = time;
            const turnaroundTime = completionTime - currentProcess.arrivalTime;
            const waitingTime = turnaroundTime - currentProcess.burstTime;

            completedProcesses.push({
                id: currentProcess.id,
                arrivalTime: currentProcess.arrivalTime,
                burstTime: currentProcess.burstTime,
                completionTime: completionTime,
                turnaroundTime: turnaroundTime,
                waitingTime: waitingTime
            });

            // Remove completed process from the list
            processes = processes.filter(p => p.id !== currentProcess.id);
        }
    }

    // Display the Gantt chart and results
    drawGanttChart(ganttChart, time);
    displayResults(completedProcesses);
    calculateMetrics(completedProcesses, time);
}

// Generate random color for each unique process ID
function getRandomColor() {
    const letters = '89ABCDEF'; // Lighter hex values for pastel colors
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}

// Function to draw the Gantt chart
function drawGanttChart(ganttChart, totalTime) {
    const ganttContainer = document.getElementById('gantt-container');
    const processColors = {}; // Store random colors for each process ID

    ganttContainer.innerHTML = ''; // Clear previous content

    // Iterate through Gantt chart data
    for (let i = 0; i < ganttChart.length; i++) {
        const processID = ganttChart[i].processID !== undefined && ganttChart[i].processID !== null
            ? ganttChart[i].processID : 'Idle';
        const processStartTime = ganttChart[i].startTime;
        const processEndTime = ganttChart[i].endTime;

        // Assign random color for each process ID
        if (!processColors[processID]) {
            processColors[processID] = processID === 'Idle' ? '#FFFFFF' : getRandomColor();
        }

        // Create process block and time label
        const processWrapper = document.createElement('div');
        processWrapper.className = 'process-wrapper';

        const processBlock = document.createElement('div');
        processBlock.className = 'process-block';
        processBlock.style.backgroundColor = processColors[processID];
        processBlock.textContent = processID === 'Idle' ? 'Idle' : 'P' + processID;

        const startTimeLabel = document.createElement('div');
        startTimeLabel.className = 'time-label';
        startTimeLabel.textContent = processStartTime;

        // Append process block and start time to wrapper
        processWrapper.appendChild(processBlock);
        processWrapper.appendChild(startTimeLabel);
        ganttContainer.appendChild(processWrapper);
    }

    // Position final end time label after the last block
    const lastProcessBlock = ganttContainer.lastChild;
    const finalEndTimeLabel = document.createElement('div');
    finalEndTimeLabel.className = 'time-label';
    finalEndTimeLabel.textContent = totalTime;

    // Align the final label correctly
    finalEndTimeLabel.style.position = 'absolute';
    finalEndTimeLabel.style.left = `${lastProcessBlock.offsetLeft + lastProcessBlock.offsetWidth}px`;
    finalEndTimeLabel.style.top = '70px'; 
    finalEndTimeLabel.style.width = '70px';

    // Append the final end time to the chart
    ganttContainer.appendChild(finalEndTimeLabel);
}

// Function to display the results in the table
function displayResults(completedProcesses) {
    const tableBody = document.getElementById('process-table').getElementsByTagName('tbody')[0];
    let tableHTML = '';
    let totalTurnaroundTime = 0;
    let totalWaitingTime = 0;
    let totalBurstTime = 0;

    // Sort the completed processes by job number (id)
    completedProcesses.sort((a, b) => a.id - b.id);

    // Loop through sorted completed processes to display results
    for (let i = 0; i < completedProcesses.length; i++) {
        tableHTML += '<tr>';
        tableHTML += '<td>' + (completedProcesses[i].id === 'Idle' ? 'Idle' : 'P' + completedProcesses[i].id) + '</td>';
        tableHTML += '<td>' + completedProcesses[i].arrivalTime + '</td>';
        tableHTML += '<td>' + completedProcesses[i].burstTime + '</td>';
        tableHTML += '<td>' + completedProcesses[i].completionTime + '</td>';
        tableHTML += '<td>' + completedProcesses[i].turnaroundTime + '</td>';
        tableHTML += '<td>' + completedProcesses[i].waitingTime + '</td>';
        tableHTML += '</tr>';

        totalTurnaroundTime += completedProcesses[i].turnaroundTime;
        totalWaitingTime += completedProcesses[i].waitingTime;
        totalBurstTime += completedProcesses[i].burstTime;
    }

    // Compute and display averages
    const avgTurnaroundTime = totalTurnaroundTime / completedProcesses.length;
    const avgWaitingTime = totalWaitingTime / completedProcesses.length;

    tableHTML += '<tr>';
    tableHTML += '<td colspan="2" style="text-align:right"><strong>Total Burst Time:</strong></td>';
    tableHTML += '<td colspan="1" style="text-align:center">' + totalBurstTime + '</td>';
    tableHTML += '<td colspan="1" style="text-align:right"><strong>Average:</strong></td>';
    tableHTML += '<td style="text-align:center">' + totalTurnaroundTime + ' / ' + completedProcesses.length + ' = ' + avgTurnaroundTime.toFixed(2) + '</td>';
    tableHTML += '<td style="text-align:center">' + totalWaitingTime + ' / ' + completedProcesses.length + ' = ' + avgWaitingTime.toFixed(2) + '</td>';
    tableHTML += '</tr>';

    tableBody.innerHTML = tableHTML;
}


// Function to calculate and display the overall metrics
function calculateMetrics(completedProcesses, totalTime) {
    let totalTurnaroundTime = 0;
    let totalWaitingTime = 0;
    let cpuTime = 0;

    // Calculate CPU time, turnaround, and waiting time
    for (let i = 0; i < completedProcesses.length; i++) {
        cpuTime += completedProcesses[i].burstTime;
        totalTurnaroundTime += completedProcesses[i].turnaroundTime;
        totalWaitingTime += completedProcesses[i].waitingTime;
    }

    // Compute averages and CPU utilization
    const avgTurnaroundTime = totalTurnaroundTime / completedProcesses.length;
    const avgWaitingTime = totalWaitingTime / completedProcesses.length;
    const cpuUtilization = (cpuTime / totalTime) * 100;

    // Display metrics
    document.getElementById('turnaround-time').textContent = avgTurnaroundTime.toFixed(2);
    document.getElementById('waiting-time').textContent = avgWaitingTime.toFixed(2);
    document.getElementById('cpu-utilization').textContent = cpuUtilization.toFixed(2) + '%';
}
