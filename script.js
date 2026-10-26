console.log("StudyLog JavaScript is working!");


let startButton = document.getElementById("startBtn");
let timerDisplay = document.getElementById("timerDisplay");
console.log(startButton);

let secondsRemaining = 5;

startButton.addEventListener("click", function()
 {  
    
    let timer = setInterval(function()  {
        secondsRemaining--

        console.log(secondsRemaining);
       
        let minutes = Math.floor(secondsRemaining / 60);
        let seconds = secondsRemaining % 60;
        timerDisplay.textContent =
             String(minutes).padStart(2, "0") + ":" +
             String(seconds).padStart(2, "0");
        if (secondsRemaining <= 0) {
            clearInterval(timer);
            console.log("Study session completed!");
}
    }, 1000);
});
