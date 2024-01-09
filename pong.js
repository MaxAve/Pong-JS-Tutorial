const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Paddle sizes
const paddleWidth = 20;
const paddleHeight = 100;

// Paddles
const paddle1X = 30;
const paddle2X = canvas.width - 30 - paddleWidth;
let paddle1Y = canvas.height / 2 - paddleHeight / 2;
let paddle2Y = canvas.height / 2 - paddleHeight / 2;
let paddle1VelocitY = 0;

// Ball
let ballSize = 20;
let ballX = canvas.width/2 - ballSize/2;
let ballY = canvas.height/2 - ballSize/2;

// Ball velocity
let ballVelocityX = -7;
let ballVelocityY = Math.floor(Math.random() * 20) - 10;

// Moves paddle 1
function movePaddle1(moveBy) {
    paddle1Y += moveBy; // Move paddle

    // Don't let paddles go beyond the canvas
    if((paddle1Y + paddleHeight) > canvas.height) {
        paddle1Y = canvas.height - paddleHeight;
    } else if(paddle1Y < 0) {
        paddle1Y = 0;
    }
}

function moveBallToCenter() {
    ballX = canvas.width/2 - ballSize/2;
    ballY = canvas.height/2 - ballSize/2;
}

// Moves paddle 2
function movePaddle2(moveBy) {
    paddle2Y += moveBy; // Move paddle

    // Don't let paddles go beyond the canvas
    if((paddle2Y + paddleHeight) > canvas.height) {
        paddle2Y = canvas.height - paddleHeight;
    } else if(paddle2Y < 0) {
        paddle2Y = 0;
    }
}

// Checks for collisions and makes ball bounce if there are any
function checkBallCollisions() {
    // Check if the ball is on the edge of the canvas
    if(ballX <= 0 || (ballX + ballSize) >= canvas.width) {
        ballVelocityY = (Math.floor(Math.random() * 7) - 3.5) * 3;
        moveBallToCenter();
    }
    if(ballY <= 0 || (ballY + ballSize) >= canvas.height) {
        ballVelocityY = -ballVelocityY; // Reverse Y velocity which makes it look as if the ball is bouncing off the wall
    }

    // Check collisions with paddle 1
    if(ballX <= paddle1X + paddleWidth && ballY <= (paddle1Y + paddleHeight) && (ballY + ballSize) >= paddle1Y) {
        ballVelocityX = Math.abs(ballVelocityX);
    }

    // Check collisions with paddle 2
    if((ballX + ballSize) >= paddle2X && ballY <= (paddle2Y + paddleHeight) && (ballY + ballSize) >= paddle2Y) {
        ballVelocityX = -Math.abs(ballVelocityX);
    }
}

// Mouse position
let mouseX = 0;
let mouseY = 0;

// Get mouse position
canvas.addEventListener('mousemove', function (event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

// Move paddle 1 with arrow keys
document.onkeydown = function(e) {
  if(e.keyCode === 38) {
      paddle1VelocitY = -10;
  } else if(e.keyCode === 40) {
      paddle1VelocitY = 10;
  }
};

document.onkeyup = (e) => {
    paddle1VelocitY = 0;
}

// Game loop
function gameLoop() {
    // Update ball position based on its current velocity
    ballX += ballVelocityX;
    ballY += ballVelocityY;

    paddle1Y += paddle1VelocitY;

    // Move paddle 2 automatically
    paddle2Y = ballY - paddleHeight / 2;

    // Bounce ball on collision
    checkBallCollisions();

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    ctx.fillStyle = 'white'; // Set the color to white

    // Draw paddle 1
    ctx.beginPath();
    ctx.rect(paddle1X, paddle1Y, paddleWidth, paddleHeight);
    ctx.fill();

    // Draw paddle 2
    ctx.beginPath();
    ctx.rect(paddle2X, paddle2Y, paddleWidth, paddleHeight);
    ctx.fill();

    // Draw ball
    ctx.beginPath();
    ctx.rect(ballX, ballY, ballSize, ballSize);
    ctx.fill();

    // Animate next frame
    window.requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();