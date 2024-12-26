// Lấy phần tử hiển thị điểm
const scoreElement = document.getElementById("score");
let score = parseInt(scoreElement.textContent); // Lấy điểm hiện tại


let walletPublicKey = null;

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLOR_MAPPING = [
    'red',
    'orange',
    'green',
    'purple',
    'blue',
    'cyan',
    'yellow',
    'white',
];
const BRICK_LAYOUT = [
    [
        [
            [1, 7, 7],
            [1, 1, 1],
            [7, 7, 7],
        ],
        [
            [7, 1, 1],
            [7, 1, 7],
            [7, 1, 7],
        ],
        [
            [7, 7, 7],
            [1, 1, 1],
            [7, 7, 1],
        ],
        [
            [7, 1, 7],
            [7, 1, 7],
            [1, 1, 7],
        ],
    ],
    [
        [
            [7, 1, 7],
            [7, 1, 7],
            [7, 1, 1],
        ],
        [
            [7, 7, 7],
            [1, 1, 1],
            [1, 7, 7],
        ],
        [
            [1, 1, 7],
            [7, 1, 7],
            [7, 1, 7],
        ],
        [
            [7, 7, 1],
            [1, 1, 1],
            [7, 7, 7],
        ],
    ],
    [
        [
            [1, 7, 7],
            [1, 1, 7],
            [7, 1, 7],
        ],
        [
            [7, 1, 1],
            [1, 1, 7],
            [7, 7, 7],
        ],
        [
            [7, 1, 7],
            [7, 1, 1],
            [7, 7, 1],
        ],
        [
            [7, 7, 7],
            [7, 1, 1],
            [1, 1, 7],
        ],
    ],
    [
        [
            [7, 1, 7],
            [1, 1, 7],
            [1, 7, 7],
        ],
        [
            [1, 1, 7],
            [7, 1, 1],
            [7, 7, 7],
        ],
        [
            [7, 7, 1],
            [7, 1, 1],
            [7, 1, 7],
        ],
        [
            [7, 7, 7],
            [1, 1, 7],
            [7, 1, 1],
        ],
    ],
    [
        [
            [7, 7, 7, 7],
            [1, 1, 1, 1],
            [7, 7, 7, 7],
            [7, 7, 7, 7],
        ],
        [
            [7, 7, 1, 7],
            [7, 7, 1, 7],
            [7, 7, 1, 7],
            [7, 7, 1, 7],
        ],
        [
            [7, 7, 7, 7],
            [7, 7, 7, 7],
            [1, 1, 1, 1],
            [7, 7, 7, 7],
        ],
        [
            [7, 1, 7, 7],
            [7, 1, 7, 7],
            [7, 1, 7, 7],
            [7, 1, 7, 7],
        ],
    ],
    [
        [
            [7, 7, 7, 7],
            [7, 1, 1, 7],
            [7, 1, 1, 7],
            [7, 7, 7, 7],
        ],
        [
            [7, 7, 7, 7],
            [7, 1, 1, 7],
            [7, 1, 1, 7],
            [7, 7, 7, 7],
        ],
        [
            [7, 7, 7, 7],
            [7, 1, 1, 7],
            [7, 1, 1, 7],
            [7, 7, 7, 7],
        ],
        [
            [7, 7, 7, 7],
            [7, 1, 1, 7],
            [7, 1, 1, 7],
            [7, 7, 7, 7],
        ],
    ],
    [
        [
            [7, 1, 7],
            [1, 1, 1],
            [7, 7, 7],
        ],
        [
            [7, 1, 7],
            [7, 1, 1],
            [7, 1, 7],
        ],
        [
            [7, 7, 7],
            [1, 1, 1],
            [7, 1, 7],
        ],
        [
            [7, 1, 7],
            [1, 1, 7],
            [7, 1, 7],
        ],
    ],
];
const KEY_CODES = {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',
};
const WHITE_COLOR_ID = 7;
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;
class Board {
    ctx;
    grid;
    score;
    gameOver;
    isPlaying;
    clearAudio;
    constructor(ctx) {
        this.ctx = ctx;
        this.grid = this.generateWhiteBoard();
        this.score = 0;
        this.gameOver = false;
        this.isPlaying = false;
        this.clearAudio = new Audio('../sounds/clear.wav');

    }
    reset() {
        this.score = 0;
        this.grid = this.generateWhiteBoard();
        this.gameOver = false;
        this.drawBoard();
    }

    generateWhiteBoard() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(WHITE_COLOR_ID));
    }
    drawCell(xAxis, yAxis, colorId) {
        this.ctx.fillStyle =
            COLOR_MAPPING[colorId] || COLOR_MAPPING[WHITE_COLOR_ID];
        this.ctx.fillRect(xAxis * BLOCK_SIZE, yAxis * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        this.ctx.fillStyle = 'black';
        this.ctx.strokeRect(xAxis * BLOCK_SIZE, yAxis * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
    drawBoard() {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[0].length; col++) {
                this.drawCell(col, row, this.grid[row][col]);
            }
        }
    }
    handleCompleteRows() {
        const latestGrid = board.grid.filter((row) => {
            return row.some((col) => col === WHITE_COLOR_ID);
        });
        const newScore = ROWS - latestGrid.length;
        const newRows = Array.from({ length: newScore }, () => Array(COLS).fill(WHITE_COLOR_ID));
        if (newScore) {
            board.grid = [...newRows, ...latestGrid];
            this.handleScore(newScore * 10);
            this.clearAudio.play();
            console.log({ latestGrid });
        }
    }

    handleScore(newScore) {
        this.score += newScore;
        document.getElementById('score').innerHTML = this.score.toString();
        console.log("Điểm hiện tại:", this.score);
    }
    handleGameOver() {
        this.gameOver = true;
        this.isPlaying = false;
        alert('GAME OVER!!!');
    }
}
class Brick {
    id;
    layout;
    activeIndex;
    colPos;
    rowPos;
    constructor(id) {
        this.id = id;
        this.layout = BRICK_LAYOUT[id];
        this.activeIndex = 0;
        this.colPos = 3;
        this.rowPos = -2;
    }
    draw() {
        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
                if (this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID) {
                    board.drawCell(col + this.colPos, row + this.rowPos, this.id);
                }
            }
        }
    }
    clear() {
        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
                if (this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID) {
                    board.drawCell(col + this.colPos, row + this.rowPos, WHITE_COLOR_ID);
                }
            }
        }
    }
    moveLeft() {
        if (!this.checkCollision(this.rowPos, this.colPos - 1, this.layout[this.activeIndex])) {
            this.clear();
            this.colPos--;
            this.draw();
        }
    }
    moveRight() {
        if (!this.checkCollision(this.rowPos, this.colPos + 1, this.layout[this.activeIndex])) {
            this.clear();
            this.colPos++;
            this.draw();
        }
    }
    moveDown() {
        if (!this.checkCollision(this.rowPos + 1, this.colPos, this.layout[this.activeIndex])) {
            this.clear();
            this.rowPos++;
            this.draw();
            return;
        }
        this.handleLanded();
        generateNewBrick();
    }
    rotate() {
        if (!this.checkCollision(this.rowPos, this.colPos, this.layout[(this.activeIndex + 1) % 4])) {
            this.clear();
            this.activeIndex = (this.activeIndex + 1) % 4;
            this.draw();
        }
    }
    checkCollision(nextRow, nextCol, nextLayout) {
        for (let row = 0; row < nextLayout.length; row++) {
            for (let col = 0; col < nextLayout[0].length; col++) {
                if (nextLayout[row][col] !== WHITE_COLOR_ID && nextRow >= 0) {
                    if (col + nextCol < 0 ||
                        col + nextCol >= COLS ||
                        row + nextRow >= ROWS ||
                        board.grid[row + nextRow][col + nextCol] !== WHITE_COLOR_ID)
                        return true;
                }
            }
        }
        return false;
    }
    handleLanded() {
        if (this.rowPos <= 0) {
            board.handleGameOver();
            return;
        }
        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
                if (this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID) {
                    board.grid[row + this.rowPos][col + this.colPos] = this.id;
                }
            }
        }
        board.handleCompleteRows();
        board.drawBoard();
    }
}
function generateNewBrick() {
    brick = new Brick(Math.floor(Math.random() * 10) % BRICK_LAYOUT.length);
}
let brick;
let board = new Board(ctx);
board.drawBoard();
document.getElementById('play').addEventListener('click', () => {
    board.reset();
    board.isPlaying = true;
    generateNewBrick();
    const refresh = startGame(() => {
        if (!board.gameOver) {
            brick.moveDown();
        } else {
            clearInterval(refresh);
        }
    }, 1000);
});
document.addEventListener('keydown', (e) => {
    if (!board.gameOver && board.isPlaying && !isPaused) {
        switch (e.code) {
            case KEY_CODES.LEFT:
                brick.moveLeft();
                break;
            case KEY_CODES.RIGHT:
                brick.moveRight();
                break;
            case KEY_CODES.DOWN:
                brick.moveDown();
                break;
            case KEY_CODES.UP:
                brick.rotate();
                break;
            default:
                break;
        }
    }
});

// Biến trạng thái
let isPaused = false;
let gameInterval; // Biến lưu interval của game

// Hàm để chạy game
function startGame() {
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        if (!isPaused && !board.gameOver) {
            brick.moveDown();
        }
    }, 1000); // Tốc độ game (1 giây)
}


// Hàm tạm dừng game
function pauseGame() {
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
}


// Hàm chuyển đổi trạng thái
function togglePauseResume() {
    if (isPaused) {
        startGame();
        isPaused = false;
        document.getElementById('pause-resume').innerText = 'Tạm dừng';
    } else {
        pauseGame();
        isPaused = true;
        document.getElementById('pause-resume').innerText = 'Tiếp tục';
    }
}

// Lắng nghe sự kiện nhấn nút "Tạm dừng/ Tiếp tục"
document.getElementById('pause-resume').addEventListener('click', togglePauseResume);


// Kết nối ví Phantom
document.getElementById("connect-wallet").addEventListener("click", async () => {


    if (window.solana && window.solana.isPhantom) {
        try {
            const response = await window.solana.connect();
            walletPublicKey = response.publicKey.toString();
            alert(`Đã kết nối ví: ${walletPublicKey}`);
        } catch (error) {
            alert("Kết nối ví không thành công.");
        }
    } else {
        alert("Vui lòng cài đặt ví Phantom.");
    }
});

(async () => {
    const balance = await connection.getBalance(from.publicKey);
    console.log(`Số dư tài khoản nguồn: ${balance / 1e9} SOL`);
})();


// Đổi điểm thành token
document.getElementById("redeem-points").addEventListener("click", async () => {
    // Kiểm tra ví công khai đã được kết nối chưa
    if (!walletPublicKey) {
        alert("Vui lòng kết nối ví.");
        return;
    }

    // Lấy điểm từ đối tượng Board
    const currentScore = board.score; // Sử dụng đúng giá trị từ board
    console.log("Điểm hiện tại: ", currentScore);
    console.log("Ví công khai: ", walletPublicKey);

    // Kiểm tra điểm
    if (currentScore <= 0) {
        alert("Bạn không có đủ điểm để đổi.");
        return;
    }

    // Gửi yêu cầu đến server để đổi điểm
    try {
        const response = await fetch("http://localhost:3000/redeem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ score: currentScore, walletPublicKey }),
        });

        const data = await response.json();

        // Kiểm tra phản hồi từ server
        if (response.ok) {
            if (data.success) {
                // Nếu đổi điểm thành công, reset điểm và thông báo
                board.score = 0; // Reset điểm từ đối tượng board
                scoreElement.textContent = board.score;
                alert(`Bạn đã đổi ${data.tokenAmount} SOL. Số điểm đã được reset.`);
            } else {
                alert("Đổi điểm thất bại. Lỗi: " + data.message);
            }
        } else {
            alert("Yêu cầu không hợp lệ. Vui lòng kiểm tra lại.");
        }
    } catch (error) {
        console.error("Lỗi khi gửi yêu cầu:", error);
        alert("Đã xảy ra lỗi khi kết nối đến server.");
    }
});
