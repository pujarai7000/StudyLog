console.log("StudyLog JavaScript is working!");


let startButton = document.getElementById("startBtn");
let timerDisplay = document.getElementById("timerDisplay");
let pauseButton = document.getElementById("pauseBtn");
let resetButton = document.getElementById("resetBtn");
let durationInput = document.getElementById("durationInput");
console.log(startButton);

let secondsRemaining = 0
let timer = null;

startButton.addEventListener("click", function()

 {  

    if (timer !== null) {
        return;
    }
    

    if (secondsRemaining <= 0) {
    secondsRemaining = Number(durationInput.value) * 60;
}
    
    timer = setInterval(function()  {
        secondsRemaining--

        console.log(secondsRemaining);
       
        let minutes = Math.floor(secondsRemaining / 60);
        let seconds = secondsRemaining % 60;
        timerDisplay.textContent =
             String(minutes).padStart(2, "0") + ":" +
             String(seconds).padStart(2, "0");
        if (secondsRemaining <= 0) {
            clearInterval(timer);
            timer=null;
            console.log("Study session completed!");
}
    }, 1000);
});
pauseButton.addEventListener("click", function() {
    clearInterval(timer);
    timer = null;

});

resetButton.addEventListener("click", function() {
    clearInterval(timer);
    timer = null;
    secondsRemaining = Number (durationInput.value) * 60;

    let minutes =Math.floor(secondsRemaining/60);
    timerDisplay.textContent = String(minutes).padStart(2, "0") + ":00";
});



durationInput.addEventListener("change", function() {
    clearInterval(timer);
    timer = null;

    let minutes = Number(durationInput.value);
    secondsRemaining = minutes * 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") + ":00";


    
});





