

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
let completedSessions = 0;

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
            console.log("Completed sessions:", completedSessions);

            console.log("Study session completed!");
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
