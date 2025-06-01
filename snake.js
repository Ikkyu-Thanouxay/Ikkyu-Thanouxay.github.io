// Snake Game with Level and Mode
let snake, food, dx, dy, score, gameInterval, isGameOver, speed, mode, started;
const box = 20;
const canvasSize = 400;
const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('snakeScore');
const levelSelect = document.getElementById('level');
const modeSelect = document.getElementById('mode');

const levelSettings = {
    easy: { speed: 150, score: 1 },
    normal: { speed: 100, score: 2 },
    hard: { speed: 60, score: 3 }
};

function startSnakeGame() {
    snake = [{x: 9*box, y: 10*box}];
    dx = 0; dy = 0; // Don't move until key pressed
    score = 0;
    isGameOver = false;
    started = false;
    food = randomFood();
    mode = modeSelect.value;
    speed = levelSettings[levelSelect.value].speed;
    scoreDisplay.textContent = 'Score: 0';
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(drawSnakeGame, speed);
    document.onkeydown = direction;
}

function randomFood() {
    return {
        x: Math.floor(Math.random()* (canvasSize/box)) * box,
        y: Math.floor(Math.random()* (canvasSize/box)) * box
    };
}

function direction(e) {
    if (isGameOver) return;
    if (["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        if (!started) {
            started = true;
            if (e.key === 'ArrowLeft') { dx = -box; dy = 0; }
            else if (e.key === 'ArrowUp') { dx = 0; dy = -box; }
            else if (e.key === 'ArrowRight') { dx = box; dy = 0; }
            else if (e.key === 'ArrowDown') { dx = 0; dy = box; }
            return;
        }
    }
    if (e.key === 'ArrowLeft' && dx === 0) { dx = -box; dy = 0; }
    else if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -box; }
    else if (e.key === 'ArrowRight' && dx === 0) { dx = box; dy = 0; }
    else if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = box; }
}

function drawSnakeGame() {
    ctx.fillStyle = '#0f2027';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? '#7fffd4' : '#2c5364';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = '#232526';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }
    ctx.fillStyle = '#fff';
    ctx.fillRect(food.x, food.y, box, box);
    let headX = snake[0].x + dx;
    let headY = snake[0].y + dy;
    // Teleport mode
    if (mode === 'teleport') {
        if (headX < 0) headX = canvasSize - box;
        if (headY < 0) headY = canvasSize - box;
        if (headX >= canvasSize) headX = 0;
        if (headY >= canvasSize) headY = 0;
    }
    if (headX === food.x && headY === food.y) {
        snake.unshift({x: headX, y: headY});
        score += levelSettings[levelSelect.value].score;
        scoreDisplay.textContent = 'Score: ' + score;
        food = randomFood();
    } else {
        snake.pop();
        snake.unshift({x: headX, y: headY});
    }
    // Collision
    if (mode === 'classic' && (headX < 0 || headY < 0 || headX >= canvasSize || headY >= canvasSize)) {
        gameOver();
        return;
    }
    if (collision(headX, headY)) {
        gameOver();
        return;
    }
}

function collision(x, y) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === x && snake[i].y === y) return true;
    }
    return false;
}

function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    ctx.fillStyle = '#fff';
    ctx.font = '2rem Roboto, Arial';
    ctx.fillText('Game Over', 120, 200);
}

levelSelect.onchange = startSnakeGame;
modeSelect.onchange = startSnakeGame;

window.onload = startSnakeGame;
