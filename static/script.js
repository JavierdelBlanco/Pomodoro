// Selección de elementos del DOM
const timerDisplay = document.getElementById('timer');
const pomodoroState = document.getElementById('state');
const playButton = document.getElementById('play');
const resetButton = document.getElementById('reset');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notification-text');
const closeNotify = document.getElementById('close-notification');

// Configuración de tiempos (en minutos)
const timeFocus = 40;
const timeRelax = 10;

// Variables de estado
let timeLeft = timeFocus * 60; 
let timerId = null;
let state = 'Focus'; // 0: Trabajo (Focus), 1: Descanso (Relax)
let save_state = 'Focus';

//Actualiza el texto del cronómetro en pantalla con formato MM:SS
function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

//-- Notificacion--

//Muestra la notificación visual con un mensaje personalizado
function showNotification(mensaje) {
    notificationText.textContent = mensaje;
    notification.classList.remove('hidden');
    
    let audio = new Audio('/static/sounds/notification.mp3');
    audio.play().catch(error => {
        console.log("El navegador bloqueó el audio hasta que interactúes con la página:", error);
    });

    // Autocierre después de 5 segundos
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 5000);
}

//Botón Close Notify
closeNotify.addEventListener('click', () => {
    notification.classList.add('hidden');
});

function updateStateColor() {
    // Primero quitamos todas las posibles clases de color
    pomodoroState.classList.remove('focus-mode', 'relax-mode', 'pause-mode', 'start-mode');

    // Aplicamos la que corresponde según el texto
    if (state === 'Focus') {
        pomodoroState.classList.add('focus-mode');
    } else if (state === 'Relax') {
        pomodoroState.classList.add('relax-mode');
    } else if (state === 'Pause'){
        pomodoroState.classList.add('pause-mode');
    }else{
        pomodoroState.classList.add('start-mode');
    }
}

//Lógica para iniciar el conteo
function startCountdown() {
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft === 0) {
            stopCountdown(); 
            handlePhaseChange();
        }
    }, 1000);
    playButton.textContent = "⏸";
    pomodoroState.textContent = save_state;
    state = save_state
    updateStateColor();
}


//Lógica para detener el conteo
function stopCountdown() {
    clearInterval(timerId);
    timerId = null;
    playButton.textContent = "▶";
    pomodoroState.textContent = 'Pause';
    save_state = state
    state = 'Pause';
    updateStateColor();
}

//Lógica para resetar el conteo
function resetCountdown() {
    clearInterval(timerId);
    timerId = null;
    playButton.textContent = "▶";
    pomodoroState.textContent = '---';
    updateStateColor();
}

//Gestiona el cambio entre las fases de trabajo y descanso
function handlePhaseChange() {
    if (save_state === 'Focus') {
        // Terminó el periodo de trabajo
        showNotification("¡Tiempo cumplido! Hora de un descanso.🍅 ");
        save_state = 'Relax';
        timeLeft = timeRelax * 60;
    } else {
        // Terminó el periodo de descanso
        showNotification("¡Descanso terminado! A darle con todo.💪 ");
        save_state = 'Focus';
        timeLeft = timeFocus * 60;
        
    }
    pomodoroState.textContent = state;
    startCountdown();
    updateDisplay();
}

// --- EVENTOS DE LOS BOTONES ---

// Botón Play 
playButton.addEventListener('click', () => {
    if (timerId === null) {
        startCountdown();
    } else {
        stopCountdown();
    }
});

// Botón Reset
resetButton.addEventListener('click', () => {
    resetCountdown();

    state = 'Start';
    updateStateColor();

    state = 'Focus';
    timeLeft = timeFocus * 60;
    updateDisplay();
});

// Inicializar la pantalla al cargar
updateDisplay();