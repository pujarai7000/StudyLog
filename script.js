

console.log("StudyLog JavaScript is working!");

// Connect HTML elements to JavaScript
let startButton = document.getElementById("startBtn");
let timerDisplay = document.getElementById("timerDisplay");
let pauseButton = document.getElementById("pauseBtn");
let resetButton = document.getElementById("resetBtn");
let durationInput = document.getElementById("durationInput");
let subjectInput = document.getElementById("subjectInput");

console.log(startButton);

// Timer variables
let secondsRemaining = 0;
let timer = null;


let today = new Date();

let dateKey = today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");
let storageKey = "sessions-" + dateKey;
let completedSessions = Number(localStorage.getItem(storageKey)) || 0;
let studyHistory = [];
console.log("Today's date:", dateKey);

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

    if (secondsRemaining <= 0) {
        secondsRemaining = Number(durationInput.value) * 60;
    }

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

            completedSessions++;
            localStorage.setItem(storageKey, completedSessions);
            console.log("Completed sessions:", completedSessions);

            let studySession = {
                subject: subject,
                duration: Number(durationInput.value),
                date: dateKey
   };

console.log("Session details:", studySession);

            console.log("Study session completed!");
            studyHistory.push(studySession);

            console.log("Study history:", studyHistory);
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

    secondsRemaining = Number(durationInput.value) * 60;

    let minutes = Math.floor(secondsRemaining / 60);

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") + ":00";
});

// CHANGE STUDY DURATION
durationInput.addEventListener("change", function() {
    clearInterval(timer);
    timer = null;

    let minutes = Number(durationInput.value);
    secondsRemaining = minutes * 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") + ":00";
});
