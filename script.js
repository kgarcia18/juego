const startButton = document.getElementById('start-button');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const timeUpScreen = document.getElementById('time-up-screen');
const livesUpScreen = document.getElementById('lives-up-screen');
const timeUpFinalScoreDisplay = document.getElementById('time-up-final-score');
const livesUpFinalScoreDisplay = document.getElementById('lives-up-final-score');
const timeUpRestartButton = document.getElementById('restart-button-time-up');
const livesUpRestartButton = document.getElementById('restart-button-lives-up');
const timeDisplay = document.getElementById('time');
const coinsDisplay = document.getElementById('coins');
const finalScoreDisplay = document.getElementById('final-score');
const gameBoard = document.getElementById('game-board');
const matchesList = document.getElementById('matches-list');
const livesCount = document.getElementById('lives-count');
const heart = document.getElementById('heart');

const emojis = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍓'];
let cards = [];
let firstCard = null;
let secondCard = null;
let flippedCards = 0;
let score = 0;
let time = 60;
let lives = 3;
let timer;
let lockBoard = false;

function startGame() {
    score = 0;
    time = 60;
    lives = 10;
    flippedCards = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    coinsDisplay.textContent = score;
    updateTimeDisplay();
    livesCount.textContent = lives;
    heart.style.color = 'red';
    matchesList.innerHTML = '';

    clearInterval(timer); // Detener el temporizador actual antes de iniciar uno nuevo

    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    timeUpScreen.classList.add('hidden');
    livesUpScreen.classList.add('hidden');

    setupGameBoard();
    startTimer();
}

function setupGameBoard() {
    cards = [...emojis, ...emojis].sort(() => 0.5 - Math.random());
    gameBoard.innerHTML = '';
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        card.innerHTML = `<div class="front"></div><div class="back">${emoji}</div>`;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard(event) {
    if (lockBoard) return;
    const card = event.currentTarget;
    if (card === firstCard || card.classList.contains('matched') || card.classList.contains('flipped')) return;

    card.classList.add('flipped');
    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;
        checkMatch();
    }
}

function checkMatch() {
    lockBoard = true;
    if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        score++;
        coinsDisplay.textContent = score;
        flippedCards += 2;
        updateMatchesList(firstCard.dataset.emoji);
        if (flippedCards === cards.length) {
            endGame();
        }
        resetCards();
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetCards();
            loseLife();
        }, 1000);
    }
}

function updateMatchesList(emoji) {
    const listItem = document.createElement('li');
    listItem.textContent = emoji;
    matchesList.appendChild(listItem);
}

function resetCards() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function startTimer() {
    timer = setInterval(() => {
        time--;
        updateTimeDisplay();
        if (time === 0) {
            clearInterval(timer);
            timeUpScreen.classList.remove('hidden');
            endGame();
        }
    }, 1000); // Intervalo de tiempo de 1000 ms (1 segundo)
}

function loseLife() {
    lives--;
    livesCount.textContent = lives;
    if (lives === 0) {
        heart.style.color = 'black';
        livesUpScreen.classList.remove('hidden');
        endGame();
    }
}

function updateTimeDisplay() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedTime = `${padZero(minutes)}:${padZero(seconds)}`;
    timeDisplay.textContent = `⏳ ${formattedTime}`;
}

function padZero(number) {
    return number < 10 ? `0${number}` : number;
}

function endGame() {
    gameScreen.classList.add('hidden');
    finalScoreDisplay.textContent = score;
}

startButton.addEventListener('click', startGame);
timeUpRestartButton.addEventListener('click', function() {
    timeUpScreen.classList.add('hidden');
    startGame();
});

livesUpRestartButton.addEventListener('click', function() {
    livesUpScreen.classList.add('hidden');
    startGame();
});
