// Tetris Game Implementation
const canvas = document.getElementById('tetrisCanvas');
const ctx = canvas.getContext('2d');
const ROWS = 20;
const COLS = 12;
const BLOCK_SIZE = 20;
const COLORS = [
    null,
    '#7fffd4', // I
    '#ffb347', // J
    '#ff6961', // L
    '#fdfd96', // O
    '#779ecb', // S
    '#966fd6', // T
    '#77dd77'  // Z
];

const SHAPES = [
    [],
    [[1,1,1,1]], // I
    [[2,0,0],[2,2,2]], // J
    [[0,0,3],[3,3,3]], // L
    [[4,4],[4,4]], // O
    [[0,5,5],[5,5,0]], // S
    [[0,6,0],[6,6,6]], // T
    [[7,7,0],[0,7,7]]  // Z
];

let board, piece, nextPiece, score, dropInterval, gameOver;

function resetBoard() {
    board = Array.from({length: ROWS}, () => Array(COLS).fill(0));
}

function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x*BLOCK_SIZE, y*BLOCK_SIZE, BLOCK_SIZE-1, BLOCK_SIZE-1);
    ctx.strokeStyle = '#232526';
    ctx.strokeRect(x*BLOCK_SIZE, y*BLOCK_SIZE, BLOCK_SIZE-1, BLOCK_SIZE-1);
}

function drawBoard() {
    ctx.fillStyle = '#0f2027';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x]) {
                drawBlock(x, y, COLORS[board[y][x]]);
            }
        }
    }
}

function randomPiece() {
    const type = Math.floor(Math.random() * 7) + 1;
    const shape = SHAPES[type];
    return {
        x: Math.floor(COLS/2) - Math.ceil(shape[0].length/2),
        y: 0,
        type: type,
        shape: shape
    };
}

function collide(px, py, shape) {
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] !== 0) {
                const newY = py + y;
                const newX = px + x;
                if (newY >= ROWS || // Bottom boundary
                    newX < 0 || // Left boundary
                    newX >= COLS || // Right boundary
                    (newY >= 0 && board[newY][newX])) { // Collision with placed pieces
                    return true;
                }
            }
        }
    }
    return false;
}

function mergePiece() {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                if (piece.y + y >= 0) { // Only merge if within bounds
                    board[piece.y + y][piece.x + x] = value;
                }
            }
        });
    });
}

function rotate(shape) {
    const newShape = shape[0].map((_, i) => 
        shape.map(row => row[i]).reverse()
    );
    return newShape;
}

function draw() {
    drawBoard();
    if (piece) {
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    drawBlock(piece.x + x, piece.y + y, COLORS[value]);
                }
            });
        });
    }
}

function drop() {
    const nextY = piece.y + 1;
    if (!collide(piece.x, nextY, piece.shape)) {
        piece.y = nextY;
    } else {
        mergePiece();
        clearLines();
        if (piece.y <= 0) {
            // Game Over
            gameOver = true;
            ctx.fillStyle = '#fff';
            ctx.font = '2rem Roboto, Arial';
            ctx.fillText('Game Over', 30, 200);
            if (dropInterval) clearInterval(dropInterval);
            return;
        }
        piece = nextPiece;
        nextPiece = randomPiece();
    }
    draw();
}

function clearLines() {
    let lines = 0;
    outer: for (let y = ROWS - 1; y >= 0; y--) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x] === 0) {
                continue outer;
            }
        }
        const row = board.splice(y, 1)[0];
        board.unshift(new Array(COLS).fill(0));
        y++;
        lines++;
    }
    if (lines > 0) {
        score += [0, 40, 100, 300, 1200][lines];
        document.getElementById('tetrisScore').textContent = 'Score: ' + score;
    }
}

function move(dx, dy) {
    const newX = piece.x + dx;
    const newY = piece.y + dy;
    if (!collide(newX, newY, piece.shape)) {
        piece.x = newX;
        piece.y = newY;
        draw();
        return true;
    }
    return false;
}

function handleKey(e) {
    if (gameOver) return;
    
    if (["ArrowLeft","ArrowRight","ArrowDown","z","x","Z","X"," "].includes(e.key)) {
        e.preventDefault();
    }
    
    switch(e.key) {
        case 'ArrowLeft':
            move(-1, 0);
            break;
        case 'ArrowRight':
            move(1, 0);
            break;
        case 'ArrowDown':
            move(0, 1);
            break;
        case 'z':
        case 'Z': {
            const rotated = rotate(piece.shape);
            if (!collide(piece.x, piece.y, rotated)) {
                piece.shape = rotated;
                draw();
            }
            break;
        }
        case 'x':
        case 'X': {
            const rotated = rotate(rotate(rotate(piece.shape)));
            if (!collide(piece.x, piece.y, rotated)) {
                piece.shape = rotated;
                draw();
            }
            break;
        }
        case ' ':
            while(move(0, 1));
            drop();
            break;
    }
}

function startTetrisGame() {
    resetBoard();
    gameOver = false;
    score = 0;
    document.getElementById('tetrisScore').textContent = 'Score: 0';
    piece = randomPiece();
    nextPiece = randomPiece();
    if (dropInterval) clearInterval(dropInterval);
    dropInterval = setInterval(() => {
        if (!gameOver) drop();
    }, 500);
    document.onkeydown = handleKey;
    draw();
}

window.onload = startTetrisGame;
