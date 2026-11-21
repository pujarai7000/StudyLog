
console.log("StudyLog JavaScript is working!");

// Connect HTML elements to JavaScript
let startButton = document.getElementById("startBtn");
let timerDisplay = document.getElementById("timerDisplay");
let pauseButton = document.getElementById("pauseBtn");
let resetButton = document.getElementById("resetBtn");
let endButton = document.getElementById("endBtn");
let durationInput = document.getElementById("durationInput");
let subjectInput = document.getElementById("subjectInput");
let historyList = document.getElementById("historyList");
let sessionCount = document.getElementById("sessionCount");
let historyDate = document.getElementById("historyDate");
let totalStudyTime = document.getElementById("totalStudyTime");
let weeklyTotal = document.getElementById("weeklyTotal");
let streakDisplay = document.getElementById("streakDisplay");
let subjectTotals =document.getElementById("subjectTotals");


console.log(startButton);

// Timer variables
let secondsRemaining = 0;
let timer = null;
let sessionStarted = false;

// Today's date
let today = new Date();

let dateKey = today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");

// Set date picker to today
historyDate.value = dateKey;

// Load saved study history
let studyHistory = JSON.parse(localStorage.getItem("studyHistory")) || [];




function calculateTotalStudyTime() {
    let totalMinutes = 0;
    let completedCount = 0;

    studyHistory.forEach(function(session) {
        if (session.date === dateKey) {
            totalMinutes += session.duration;

            // Only sessions without the "Partial" status count as completed
            if (session.status !== "Partial") {
                completedCount++;
            }
        }
    });

    sessionCount.textContent = "Completed Sessions: " + completedCount;

    totalStudyTime.textContent =
        "Total Studied Today: " + Number(totalMinutes.toFixed(2)) + " minutes";

    // Daily Study Goal
    
    const dailyGoal = Number(localStorage.getItem("dailyGoal")) || 150;

    const goalProgress = document.getElementById("goalProgress");
    const progressFill = document.getElementById("progressFill");

    const progressPercentage = Math.min(
        (totalMinutes / dailyGoal) * 100,
        100
    );

    goalProgress.textContent =
        Number(totalMinutes.toFixed(2)) + " / " + dailyGoal + " minutes";

    progressFill.style.width = progressPercentage + "%";
}

calculateTotalStudyTime();



// Display one study session
function displaySession(session) {
    let listItem = document.createElement("li");

    listItem.textContent = session.subject + " - " +
        session.duration + " minutes - " +
        (session.status || "Completed");

    // Only sessions that exist in the database (have an id) can be deleted
    if (session.id) {
        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {
            deleteSession(session.id);
        });

        listItem.appendChild(deleteButton);
    }

    historyList.appendChild(listItem);
}

// Delete a session from the server, then from the page
function deleteSession(id) {
    if (!confirm("Delete this session?")) {
        return;
    }

    fetch("http://localhost:5000/sessions/" + id, { method: "DELETE" })
        .then(function(response) {
            if (!response.ok) {
                alert("Could not delete the session.");
                return;
            }

            // Keep every session except the one we deleted
            studyHistory = studyHistory.filter(function(session) {
                return session.id !== id;
            });

            localStorage.setItem("studyHistory", JSON.stringify(studyHistory));
            refreshAll();
        });
}

// Display sessions for the selected date
function showHistoryByDate(selectedDate) {
    historyList.innerHTML = "";

    studyHistory.forEach(function(session) {
        if (session.date === selectedDate) {
            displaySession(session);
        }
    });
}

// Save a partial study session (used by Reset and End)
function savePartialSession(studiedSeconds) {
    let partialSession = {
        subject: subjectInput.value,
        duration: Number((studiedSeconds / 60).toFixed(2)),
        date: dateKey,
        status: "Partial"
    };

    console.log("Partial session saved:", partialSession);

    studyHistory.push(partialSession);
    sendSessionToServer(partialSession);

    localStorage.setItem(
        "studyHistory",
        JSON.stringify(studyHistory)
    );

    showHistoryByDate(historyDate.value);
    calculateTotalStudyTime();
    calculateWeeklyTotal();
    calculateStreak();
    calculateSubjectTotals();
    renderHeatmap();
}

// Add up the minutes of every saved session
function calculateWeeklyTotal() {
    let totalMinutes = 0;

    let cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 6);

    // Write the cutoff as "YYYY-MM-DD" text, same format as session.date
    let cutoffKey = cutoff.getFullYear() + "-" +
        String(cutoff.getMonth() + 1).padStart(2, "0") + "-" +
        String(cutoff.getDate()).padStart(2, "0");

    console.log("Cutoff key:", cutoffKey);

    studyHistory.forEach(function(session) {
        // Count only sessions from the cutoff day up to today
        if (session.date >= cutoffKey && session.date <= dateKey) {
            totalMinutes += session.duration;
        }
    });

    weeklyTotal.textContent =
        "Last 7 Days: " + Number(totalMinutes.toFixed(2)) + " minutes";
}

calculateWeeklyTotal();

// Collect the unique days you studied (step 1 of the streak)
function calculateStreak() {
    let days = new Set();

    studyHistory.forEach(function(session) {
        days.add(session.date);
    });

    let streak = 0;
    let checkDate = new Date();

    // Count backward from today while each day is a study day
    while (true) {
        let checkKey = checkDate.getFullYear() + "-" +
            String(checkDate.getMonth() + 1).padStart(2, "0") + "-" +
            String(checkDate.getDate()).padStart(2, "0");

        if (!days.has(checkKey)) {
            break;
        }

        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
    }

    streakDisplay.textContent = "Streak: " + streak + " days";
}

calculateStreak();

// Add up minutes for each subject and show them in the list
function calculateSubjectTotals() {
    let totals = {};

    studyHistory.forEach(function(session) {
        // "Math " and "math" should count as the same subject
        let key = session.subject.trim().toLowerCase();

        // First time we see a subject, start it at 0 (avoids undefined + number = NaN)
        totals[key] = (totals[key] || 0) + session.duration;
    });

    subjectTotals.innerHTML = "";

    Object.entries(totals).forEach(function(entry) {
        // Show the subject with a capital first letter, e.g. "math" -> "Math"
        let subject = entry[0].charAt(0).toUpperCase() + entry[0].slice(1);
        let minutes = entry[1];

        let listItem = document.createElement("li");
        listItem.textContent = subject + ": " + Number(minutes.toFixed(2)) + " minutes";
        subjectTotals.appendChild(listItem);
    });
}

calculateSubjectTotals();


// Heatmap: one square per day for the last 20 weeks, shaded by minutes studied
const HEATMAP_WEEKS = 20;

function dateToKey(d) {
    return d.getFullYear() + "-" +
        String(d.getMonth() + 1).padStart(2, "0") + "-" +
        String(d.getDate()).padStart(2, "0");
}

function heatLevel(minutes) {
    if (minutes <= 0) return 0;
    if (minutes < 30) return 1;
    if (minutes < 60) return 2;
    if (minutes < 120) return 3;
    return 4;
}

function renderHeatmap() {
    const grid = document.getElementById("heatmapGrid");
    grid.innerHTML = "";

    // Total minutes per day
    const minutesByDay = {};
    studyHistory.forEach(function(session) {
        minutesByDay[session.date] =
            (minutesByDay[session.date] || 0) + session.duration;
    });

    // Start on the Sunday (HEATMAP_WEEKS - 1) weeks before this week's Sunday
    const start = new Date();
    start.setDate(start.getDate() - start.getDay() - (HEATMAP_WEEKS - 1) * 7);

    const todayKey = dateToKey(new Date());

    for (let i = 0; i < HEATMAP_WEEKS * 7; i++) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        const key = dateToKey(day);

        const cell = document.createElement("div");
        cell.className = "heat-cell";

        if (key > todayKey) {
            cell.classList.add("future");
        } else {
            const minutes = minutesByDay[key] || 0;
            cell.classList.add("level-" + heatLevel(minutes));
            cell.title = key + ": " + Number(minutes.toFixed(2)) + " minutes";
        }

        grid.appendChild(cell);
    }
}

renderHeatmap();

// Display today's history when the page loads
showHistoryByDate(historyDate.value);



// Update history when the user selects another date
historyDate.addEventListener("change", function() {
    showHistoryByDate(historyDate.value);
});

console.log("Today's date:", dateKey);

function sendSessionToServer(session) {
    fetch("http://localhost:5000/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session)
    })
        .then(function(response) { return response.json(); })
        .then(function(saved) {
            // Remember the database id so this session can be deleted right away
            session.id = saved.id;
            localStorage.setItem("studyHistory", JSON.stringify(studyHistory));
            showHistoryByDate(historyDate.value);
        });
}


// START BUTTON
startButton.addEventListener("click", function() {

    if (timer !== null) {
        return;
    }

    let subject = subjectInput.value;
    console.log("Studying:", subject);

    if (subject.trim() === "") {
        alert("Please enter a study subject!");
        return;
    }
    if (Number(durationInput.value) <= 0) {
    alert("Please enter a valid study duration!");
    return;
    }


    if (secondsRemaining <= 0) {
        secondsRemaining = Number(durationInput.value) * 60;
    }

    sessionStarted = true;

    timer = setInterval(function() {
        secondsRemaining--;

        console.log(secondsRemaining);

        let minutes = Math.floor(secondsRemaining / 60);
        let seconds = secondsRemaining % 60;

        timerDisplay.textContent =
            String(minutes).padStart(2, "0") + ":" +
            String(seconds).padStart(2, "0");

        if (secondsRemaining <= 0) {
            clearInterval(timer);
            timer = null;
            sessionStarted = false;

            let studySession = {
                subject: subject,
                duration: Number(durationInput.value),
                date: dateKey,
                status: "Completed"
            };

            console.log("Session details:", studySession);
            console.log("Study session completed!");

            studyHistory.push(studySession);
            sendSessionToServer(studySession);

            console.log("Study history:", studyHistory);

            // Save study history
            localStorage.setItem(
                "studyHistory",
                JSON.stringify(studyHistory)
            );

            // Refresh only the selected date's history
            showHistoryByDate(historyDate.value);
            calculateTotalStudyTime();
            calculateWeeklyTotal();
            calculateStreak();
            calculateSubjectTotals();
            renderHeatmap();
        }

    }, 1000);
});

// PAUSE BUTTON
pauseButton.addEventListener("click", function() {
    clearInterval(timer);
    timer = null;
});

// RESET BUTTON
resetButton.addEventListener("click", function() {
    clearInterval(timer);
    timer = null;

    let plannedSeconds = Number(durationInput.value) * 60;
    let studiedSeconds = plannedSeconds - secondsRemaining;
    let shouldSave = sessionStarted && studiedSeconds > 0;

    sessionStarted = false;

    if (shouldSave) {
        savePartialSession(studiedSeconds);
    }

    secondsRemaining = Number(durationInput.value) * 60;

    let minutes = Math.floor(secondsRemaining / 60);

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") + ":00";
});

// CHANGE STUDY DURATION
durationInput.addEventListener("change", function() {
    clearInterval(timer);
    timer = null;
    sessionStarted = false;

    let minutes = Number(durationInput.value);
    secondsRemaining = minutes * 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") + ":00";
});

// END SESSION BUTTON
endButton.addEventListener("click", function() {

    if (sessionStarted === false) {
        return;
    }

    clearInterval(timer);
    timer = null;
    sessionStarted = false;

    let plannedSeconds = Number(durationInput.value) * 60;
    let studiedSeconds = plannedSeconds - secondsRemaining;

    console.log("Actual study time in seconds:", studiedSeconds);

    if (studiedSeconds > 0) {
        savePartialSession(studiedSeconds);
    }

    secondsRemaining = 0;

    console.log("Study session ended!");
});



const quotes = [
    "Those who keep learning will keep rising in life",
    "Every page you study is a step closer to your dream",
    "Nothing will work unless you do.",
    "One focused hour can make a difference.",
    "A war against yourself .",
    "Keep going. You're building something meaningful.",
    "You are the greatest project you'll ever work on."
];

const dailyQuote = document.getElementById("dailyQuote");



const quoteToday = new Date();

const dayNumber = Math.floor(
    new Date(
        quoteToday.getFullYear(),
        quoteToday.getMonth(),
        quoteToday.getDate()
    ).getTime() / 86400000
);


const quoteIndex = dayNumber % quotes.length;

dailyQuote.textContent = quotes[quoteIndex];
console.log("Daily quote element:", dailyQuote);


const dailyGoalInput = document.getElementById("dailyGoalInput");
const saveGoalBtn = document.getElementById("saveGoalBtn");

// Display the previously saved goal
dailyGoalInput.value = localStorage.getItem("dailyGoal") || 150;

saveGoalBtn.addEventListener("click", function() {
    const newGoal = Number(dailyGoalInput.value);

    if (newGoal <= 0 || !Number.isFinite(newGoal)) {
        alert("Please enter a valid study goal.");
        return;
    }

    localStorage.setItem("dailyGoal", newGoal);

    calculateTotalStudyTime();
});


function refreshAll() {
    showHistoryByDate(historyDate.value);
    calculateTotalStudyTime();
    calculateWeeklyTotal();
    calculateStreak();
    calculateSubjectTotals();
    renderHeatmap();
}

// Load history from the server (falls back to localStorage if it's offline)
fetch("http://localhost:5000/sessions")
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if (data.length === 0 && studyHistory.length > 0) {
            // One-time migration: upload sessions saved before the backend existed
            studyHistory.forEach(sendSessionToServer);
            return;
        }

        studyHistory = data;
        localStorage.setItem("studyHistory", JSON.stringify(studyHistory));
        refreshAll();
    })
    .catch(function(error) {
        console.log("Server unavailable, using localStorage:", error);
    });
