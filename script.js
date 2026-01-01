// --- CONFIGURACIÓN DE LA HISTORIA ---
// type: 'whatsapp', 'disrupt', 'balloon_party', 'game', 'final'

const story = [
    // 1. INTRO WHATSAPP
    { type: 'whatsapp', message: "Se que estos ultimos dias he estado distante y han sido complicada las cosas para ti, quizas solo soy yo sobrepensando cosas o no lo se pero tienes ese poder de hacerme sentir tan bien en un segundo y al siguiente destruime, como dije creo que soy yo que le da muchas vueltas a muchas cosas y me hace alejarme por miedo, perdon sabes que te quiero mucho" },

    // 2. TRANSICIÓN
    { text: "Ahora  unas fotos de una linda y bella dama como tu que me gusta ver...", duration: 3000 },

    // 4. FIESTA DE GLOBOS (PHOTOCARDS)
    // duration: 30s para ver todas las fotos nuevas
    {
        type: 'balloon_party',
        duration: 35000,
        photos: [
            { text: "Eres mi todo ❤️", img: "assets/image.png" },
            { text: "Te amo infinito 💖", img: "assets/image copy.png" },
            { text: "Gracias por existir ✨", img: "assets/image copy 2.png" },
            { text: "Siempre juntos 💑", img: "assets/image copy 3.png" },
            { text: "Eres mi persona favorita 🌹", img: "assets/image copy 4.png" },
            { text: "Me haces muy feliz 😊", img: "assets/image copy 5.png" },
            { text: "Eres el amor de mi vida �", img: "assets/image copy 6.png" },
            { text: "Cada momento contigo es magia ✨", img: "assets/image copy 7.png" },
            { text: "Mi lugar seguro 🏡", img: "assets/image copy 8.png" },
            { text: "Te elijo hoy y siempre 🌸", img: "assets/image copy 9.png" },
            { text: "Tú y yo contra el mundo �", img: "assets/image copy 10.png" },
            { text: "Gracias por tanto amor 💌", img: "assets/image copy 11.png" },
            { text: "Eres mi sueño hecho realidad 💭", img: "assets/image copy 12.png" },
            { text: "No te cambio por nada 💖", img: "assets/image copy 13.png" },
            { text: "Siempre en mi corazón �", img: "assets/image copy 14.png" },
            { text: "Te adoro mi vida 👑", img: "assets/image copy 15.png" }
        ]
    },

    // 5. TRANSICIÓN JUEGO
    { text: "¡Espera! Un último reto... 🎮", duration: 3000 },

    // 6. JUEGO PIXEL ART
    { type: 'game' },

    // 7. FINAL
    { text: "¡FELIZ AÑO!", type: 'final', animation: "animate__jackInTheBox", duration: 15000 }
];

// Configuraciones Globales
const TYPING_SPEED = 80;
const AFTER_TYPING_DELAY = 1500;

// --- LÓGICA DEL PROGRAMA ---

let currentStep = 0;
const container = document.getElementById('story-container');
const whatsappScreen = document.getElementById('whatsapp-screen');
const gameContainer = document.getElementById('game-container');
const waInput = document.getElementById('wa-input');
const waValues = document.getElementById('wa-conversation');
let autoAdvanceTimeout;
let typingInterval;
let balloonInterval;

// Iniciar
processStep(currentStep);

document.body.addEventListener('click', () => {
    if (document.body.classList.contains('red-mode')) {
        clearTimeout(autoAdvanceTimeout);
        advanceStory();
    }
});

function processStep(index) {
    if (index >= story.length) return;

    const step = story[index];

    // Limpieza
    container.innerHTML = '';
    whatsappScreen.classList.add('hidden');
    gameContainer.classList.add('hidden'); // Ocultar juego por defecto
    document.body.className = '';

    if (balloonInterval) clearInterval(balloonInterval);

    // --- TIPO: WHATSAPP ---
    if (step.type === 'whatsapp') {
        whatsappScreen.classList.remove('hidden');
        simulateWhatsApp(step.message, () => {
            setTimeout(advanceStory, 5000);
        });
    }

    // --- TIPO: DISRUPT ---
    else if (step.type === 'disrupt') {
        document.body.className = 'red-mode';
        createCenterText(step.text, 'shake-text animate__animated animate__shakeX');
        setTimeout(advanceStory, step.duration || 3000);
    }

    // --- TIPO: BALLOON PARTY ---
    else if (step.type === 'balloon_party') {
        document.body.className = 'normal-mode';
        startBalloonParty(step.photos, step.duration);
    }

    // --- TIPO: GAME ---
    else if (step.type === 'game') {
        document.body.className = 'normal-mode';
        startGame(); // Inicia el juego y avanza solo cuando gana
    }

    // --- TIPO: NORMAL / FINAL / TRANSICIÓN ---
    else {
        document.body.className = 'normal-mode';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'center-content';
        container.appendChild(contentDiv);

        if (step.text) {
            const textEl = document.createElement(step.type === 'final' ? 'h1' : 'p');
            if (step.type === 'final') {
                textEl.innerText = step.text;
                textEl.className = `animate__animated ${step.animation || 'animate__fadeIn'}`;
                contentDiv.appendChild(textEl);

                // Firework logic
                launchFireworks(); // Launch immediately
                setInterval(launchFireworks, 1500); // And then loop

                // TEXTO FINAL
                const longText = document.createElement('div');
                longText.innerText = "Quiero que sepas que te quiero mucho, más de lo que a veces sé decir con palabras. Eres alguien muy especial para mí y me alegra que estés en mi vida. Y si estás leyendo este mensaje… ya me debes unos tacos.";
                longText.className = "coupon-text animate__animated animate__fadeInUp";
                longText.style.animationDelay = "2s";
                contentDiv.appendChild(longText);
            } else {
                textEl.className = 'typing-text';
                contentDiv.appendChild(textEl);
                typeWriter(textEl, step.text, () => {
                    autoAdvanceTimeout = setTimeout(advanceStory, step.duration || AFTER_TYPING_DELAY);
                });
            }
        }
    }
}

// --- GAME LOGIC ---
// --- GAME LOGIC ---
function startGame() {
    gameContainer.classList.remove('hidden');

    const leftAvatar = document.getElementById('avatar-left');
    const rightAvatar = document.getElementById('avatar-right');
    const mashBtn = document.getElementById('mash-btn');
    const goalHeart = document.querySelector('.heart-goal');

    let progress = 0; // 0 to 50
    const maxProgress = 50; // They meet in the middle (50%)
    let gameWon = false;

    // Reset positions
    leftAvatar.style.left = '0%';
    rightAvatar.style.right = '0%';

    // Decrease progress slowly over time (challenge)
    const decayInterval = setInterval(() => {
        if (gameWon) return;
        if (progress > 0) {
            progress -= 0.5; // Decay rate
            if (progress < 0) progress = 0;
            updatePositions();
        }
    }, 100);

    function updatePositions() {
        leftAvatar.style.left = progress + '%';
        rightAvatar.style.right = progress + '%';

        // Visual feedback on heart
        const scale = 1 + (progress / 50);
        goalHeart.style.transform = `translate(-50%, -50%) scale(${scale})`;
        goalHeart.style.opacity = 0.5 + (progress / 100);
    }

    function handleMash(e) {
        if (gameWon) return;

        // Prevent default touch actions (zooming, etc)
        if (e.type === 'touchstart') e.preventDefault();

        // Add progress
        progress += 3; // Difficulty tuning

        // Visual feedback on button
        mashBtn.style.transform = 'scale(0.9)';
        setTimeout(() => mashBtn.style.transform = 'scale(1)', 50);

        updatePositions();

        // Win condition
        if (progress >= 42) { // 42% is close enough visually (avatars have width)
            winGame();
        }
    }

    function winGame() {
        gameWon = true;
        clearInterval(decayInterval);

        // Final snap
        progress = 45;
        updatePositions();

        // Heart explosion effect
        goalHeart.style.transform = `translate(-50%, -50%) scale(2)`;
        goalHeart.innerText = "💖";

        // Replace button text
        mashBtn.innerText = "¡LO LOGRASTE! 🎉";
        mashBtn.style.background = "#2ecc71";

        // Confetti!
        launchConfetti();

        setTimeout(() => {
            gameContainer.classList.add('hidden');
            advanceStory();
        }, 2500);
    }

    // Event Listeners
    mashBtn.addEventListener('mousedown', handleMash);
    mashBtn.addEventListener('touchstart', handleMash);

    // Allow clicking anywhere for better UX? Maybe just the button is better for clarity.
    // gameContainer.addEventListener('mousedown', handleMash); 
}

// --- HELPER FUNCTIONS ---
function createCenterText(text, className) {
    const div = document.createElement('div');
    div.className = 'center-content';
    const h1 = document.createElement('h1');
    h1.innerText = text;
    h1.className = className;
    div.appendChild(h1);
    container.appendChild(div);
}

function startBalloonParty(photos, duration) {
    let elapsed = 0;
    const spawnRate = 800;

    // Barajar fotos al inicio para que el orden sea sorpresa pero sin repeticiones seguidas
    let photoQueue = [...photos].sort(() => Math.random() - 0.5);
    let photoIndex = 0;

    const spawnBalloon = () => {
        if (elapsed >= duration) return;

        // Usar índice secuencial
        const photo = photoQueue[photoIndex];

        // Avanzar índice y resetear con posible re-barajado
        photoIndex++;
        if (photoIndex >= photoQueue.length) {
            photoIndex = 0;
            // Opcional: Re-barajar si queremos que el siguiente ciclo sea diferente
            // photoQueue.sort(() => Math.random() - 0.5); 
        }

        const card = document.createElement('div');
        card.className = 'photocard';

        const img = document.createElement('img');
        img.src = photo.img;
        card.appendChild(img);

        if (photo.text) {
            const p = document.createElement('p');
            p.innerText = photo.text;
            card.appendChild(p);
        }

        const leftPos = Math.random() * 70 + 5;
        card.style.left = leftPos + '%';

        const animDuration = Math.random() * 5 + 8; // Entre 8 y 13 segundos (lento y suave)
        card.style.animationDuration = animDuration + 's';

        const rot = Math.random() * 10 - 5;
        card.style.transform = `rotate(${rot}deg)`;

        container.appendChild(card);

        setTimeout(() => { if (card.parentNode) card.parentNode.removeChild(card); }, animDuration * 1000);
    };

    balloonInterval = setInterval(() => {
        spawnBalloon();
        elapsed += spawnRate;
        if (elapsed >= duration) {
            clearInterval(balloonInterval);
            setTimeout(advanceStory, 4000);
        }
    }, spawnRate);
    spawnBalloon();
}

function simulateWhatsApp(message, onComplete) {
    let i = 0;
    waInput.value = "";
    waInput.style.height = 'auto'; // Reset height

    function typeChar() {
        waInput.value += message.charAt(i);
        // Auto-resize
        waInput.style.height = 'auto';
        waInput.style.height = waInput.scrollHeight + 'px';

        i++;
        if (i < message.length) {
            setTimeout(typeChar, 50);
        } else {
            setTimeout(() => {
                waInput.value = "";
                waInput.style.height = 'auto'; // Reset after sending
                const msgBubble = document.createElement('div');
                msgBubble.className = 'wa-message out animate__animated animate__fadeInUp';
                msgBubble.innerText = message;
                waValues.appendChild(msgBubble);
                // Auto scroll to bottom
                waValues.scrollTop = waValues.scrollHeight;
                onComplete();
            }, 500);
        }
    }
    setTimeout(typeChar, 1000);
}

function typeWriter(element, text, onComplete) {
    let i = 0;
    element.innerHTML = '';
    typingInterval = setInterval(() => {
        element.innerHTML += text.charAt(i);
        i++;
        if (i > text.length - 1) {
            clearInterval(typingInterval);
            element.classList.remove('typing-text');
            onComplete();
        }
    }, TYPING_SPEED);
}

function advanceStory() {
    currentStep++;
    processStep(currentStep);
}

// --- GLOBOS INFINITOS FINAL ---
function startInfiniteBalloons() {
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#1dd1a1'];

    setInterval(() => {
        const balloon = document.createElement('div');
        balloon.className = 'balloon-color';

        // Color aleatorio
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Posición aleatoria
        const left = Math.random() * 90 + 5;
        balloon.style.left = left + '%';

        // Velocidad aleatoria
        const duration = Math.random() * 5 + 10;
        balloon.style.animationDuration = duration + 's';

        // Tamaño aleatorio
        const scale = Math.random() * 0.5 + 0.8;
        // Transform combina escala y lo necesario para animacion CSS maneja translate
        // OJO: La animación CSS 'floatUpBalloon' usa transform. 
        // Si seteamos transform aqui, sobreescribimos la animacion initial keyframe?
        // Mejor usamos zoom o width/height para el scale, o variable CSS.
        // Vamos a modificar width/height ligeramente
        balloon.style.width = (60 * scale) + 'px';
        balloon.style.height = (75 * scale) + 'px';

        container.appendChild(balloon);

        // Eliminar
        setTimeout(() => {
            if (balloon.parentNode) balloon.parentNode.removeChild(balloon);
        }, duration * 1000);

    }, 400);
}

function launchConfetti() {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    function randomInOut(min, max) { return Math.random() * (max - min) + min; }
    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInOut(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInOut(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

function launchFireworks() {
    var duration = 1500;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    var randomInRange = (min, max) => Math.random() * (max - min) + min;

    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}
