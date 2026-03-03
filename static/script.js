const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const timeFocus = 40;
const timeRelax = 10;

let timeLeft = timeFocus * 60; // 25 minutos en segundos
let timerId = null;
let state = 1; // Estado 1: trabajo , Estado 0: descanso

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Botón Iniciar
startButton.addEventListener('click', () => {
    if (timerId === null) {
        timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft === 0) {
            if (state == 1){
                alert("¡A descansar!");
                state = 0
                timeLeft = timeRelax * 60
            }else{              
                alert("¡A Trabajar!");
                state = 1
                timeLeft = timeFocus* 60
            }
        }}, 1000);
    }
});

// Botón Pausar
pauseButton.addEventListener('click', () => {
    clearInterval(timerId); // Detiene el intervalo
    timerId = null;         // Permite que el botón Iniciar vuelva a funcionar
});

// Botón Reiniciar
resetButton.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    timeLeft = timeFocus * 60;     // Volvemos al tiempo inicial
    updateDisplay();
});