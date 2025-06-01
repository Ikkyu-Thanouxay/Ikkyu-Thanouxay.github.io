// Smooth scroll for navigation links
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Simple form handler (no backend, just a placeholder)
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for reaching out! (Form not connected)');
        form.reset();
    });
});

// Modal logic for Snake Game
function openSnakeGameModal(e) {
    e.preventDefault();
    document.getElementById('snakeGameModal').style.display = 'flex';
    startSnakeGame();
}
function closeSnakeGameModal() {
    document.getElementById('snakeGameModal').style.display = 'none';
    stopSnakeGame();
}
// Snake Game Implementation
let snake, food, dx, dy, score, gameInterval, isGameOver;
const canvas = document.getElementById('snakeCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const box = 20;
const canvasSize = 400;
function startSnakeGame() {
    snake = [{x: 9*box, y: 10*box}];
    dx = box; dy = 0;
    score = 0;
    isGameOver = false;
    food = randomFood();
    document.getElementById('snakeScore').textContent = 'Score: 0';
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(drawSnakeGame, 100);
    document.onkeydown = direction;
}
function stopSnakeGame() {
    if (gameInterval) clearInterval(gameInterval);
    document.onkeydown = null;
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
        e.preventDefault(); // Prevent page scrolling
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
    if (headX === food.x && headY === food.y) {
        snake.unshift({x: headX, y: headY});
        score++;
        document.getElementById('snakeScore').textContent = 'Score: ' + score;
        food = randomFood();
    } else {
        snake.pop();
        snake.unshift({x: headX, y: headY});
    }
    // Collision
    if (headX < 0 || headY < 0 || headX >= canvasSize || headY >= canvasSize || collision(headX, headY)) {
        isGameOver = true;
        clearInterval(gameInterval);
        ctx.fillStyle = '#fff';
        ctx.font = '2rem Roboto, Arial';
        ctx.fillText('Game Over', 120, 200);
    }
}
function collision(x, y) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === x && snake[i].y === y) return true;
    }
    return false;
}
// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('snakeGameModal');
    if (event.target === modal) {
        closeSnakeGameModal();
    }
};
