

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

console.log(startButton);

// Timer variables
let secondsRemaining = 0;
let timer = null;
let sessionStarted = false;



let today = new Date();

let dateKey = today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");
let storageKey = "sessions-" + dateKey;
let completedSessions = Number(localStorage.getItem(storageKey)) || 0;

let studyHistory = JSON.parse(localStorage.getItem("studyHistory")) || [];
function displaySession(session) {
    let listItem = document.createElement("li");

    listItem.textContent = session.subject + " - " +
        session.duration + " minutes - " +
        (session.status || "Completed");

    historyList.appendChild(listItem);
    
   
}

// Display previously saved sessions
studyHistory.forEach(function(session) {
    displaySession(session);
})


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

// Save study history permanently
            localStorage.setItem("studyHistory", JSON.stringify(studyHistory));
            displaySession(studySession);
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
    console.log("Partial study time:", studiedSeconds);

    let partialSession = {
        subject: subjectInput.value,
        
        duration: Number((studiedSeconds / 60).toFixed(2)),
        date: dateKey,
        status: "Partial"
    };

    console.log("Partial session:", partialSession);
    studyHistory.push(partialSession);

    localStorage.setItem("studyHistory", JSON.stringify(studyHistory));

    displaySession(partialSession);

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


endButton.addEventListener("click", function() {
    
if (sessionStarted === false) {
    return;
}

    clearInterval(timer);
    timer = null;
    sessionStarted = false;

    let plannedSeconds = Number(durationInput.value) * 60;
    let studiedSeconds= plannedSeconds - secondsRemaining;

    console.log("Actual study time in seconds:", studiedSeconds);

    if (studiedSeconds > 0) {
    console.log("Saving partial session...");

    let partialSession = {
        subject: subjectInput.value,
        duration: Number((studiedSeconds / 60).toFixed(2)),
        date: dateKey,
        status: "Partial"
    };

    console.log("Ended session:", partialSession);
    studyHistory.push(partialSession);
    localStorage.setItem("studyHistory", JSON.stringify(studyHistory));

    let listItem = document.createElement("li");

    listItem.textContent = partialSession.subject + " - " +
    partialSession.duration + " minutes - " +
    partialSession.status;

    historyList.appendChild(listItem);
}



    secondsRemaining = 0;

    console.log("Study session ended!");
});