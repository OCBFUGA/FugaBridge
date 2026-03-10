const slides = document.querySelectorAll('.slide');
const progressBar = document.getElementById('progress-bar');
const narrationText = document.getElementById('narration-text');
const playBtn = document.getElementById('play-pause-btn');

const scripts = [
    "Olá, sou Janio Fuga. Apresento o FugaBridge: O Oráculo de Inteligência Descentralizada que une Bittensor à L2.",
    "O problema é claro: Modelos de IA precisam de feedback humano (RLHF), mas incentivar isso em escala é impossível sem pagamentos instantâneos.",
    "A solução: FugaBridge. Usamos o FugaClaw para orquestrar avaliações via redes de mensageria, pagando micro-recompensas em Arbitrum.",
    "Vejam na prática: O Dashboard monitora em tempo real a integridade da subnet, as escolhas humanas e os pagamentos autenticados na rede Sepolia.",
    "Nossa visão final: Criar o primeiro protocolo de 'Proof of Human Cognition', transformando feedback em um ativo digital verificável."
];

let currentSlide = 0;
let isPlaying = false;
let progressInterval = null;
let slideTimeout = null;

function updateSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    slides[index].classList.add('active');
    narrationText.innerText = scripts[index];

    // Reset Progress Bar
    progressBar.style.width = '0%';
}

function startSlideTimer() {
    const duration = parseInt(slides[currentSlide].getAttribute('data-duration'));
    let startTime = Date.now();

    progressInterval = setInterval(() => {
        let elapsed = Date.now() - startTime;
        let progress = (elapsed / duration) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }, 50);

    slideTimeout = setTimeout(() => {
        nextSlide();
    }, duration);
}

function nextSlide() {
    clearInterval(progressInterval);
    clearTimeout(slideTimeout);

    currentSlide = (currentSlide + 1) % slides.length;
    updateSlide(currentSlide);

    if (isPlaying) startSlideTimer();
}

function prevSlide() {
    clearInterval(progressInterval);
    clearTimeout(slideTimeout);

    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlide(currentSlide);

    if (isPlaying) startSlideTimer();
}

playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playBtn.innerText = isPlaying ? 'Pause Pitch' : 'Resume Pitch';

    if (isPlaying) {
        startSlideTimer();
    } else {
        clearInterval(progressInterval);
        clearTimeout(slideTimeout);
    }
});

document.getElementById('next-btn').addEventListener('click', nextSlide);
document.getElementById('prev-btn').addEventListener('click', prevSlide);

// Init
updateSlide(0);
