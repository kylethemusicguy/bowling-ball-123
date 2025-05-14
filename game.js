const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const scoreText = document.getElementById('score');

let score = 0;
let isBowling = false;
let ballX = 100;
let ballY = 100;  // Set ball to the same height as the top pin
let ballSpeedX = 0;
let ballSpeedY = 0;
let power = 5;
let angle = 0;

// Full 10-pin bowling formation
let pins = [
  { x: 650, y: 100 },  // row 1 (1 pin)
  { x: 620, y: 130 }, { x: 680, y: 130 },  // row 2 (2 pins)
  { x: 590, y: 160 }, { x: 650, y: 160 }, { x: 710, y: 160 },  // row 3 (3 pins)
  { x: 560, y: 190 }, { x: 620, y: 190 }, { x: 680, y: 190 }, { x: 740, y: 190 }  // row 4 (4 pins)
];

const ballRadius = 10;

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    angle -= 5; // aim left
  } else if (e.key === 'ArrowRight') {
    angle += 5; // aim right
  } else if (e.key === ' ' && !isBowling) {
    isBowling = true;
    ballSpeedX = Math.cos(angle * Math.PI / 180) * power;
    ballSpeedY = Math.sin(angle * Math.PI / 180) * power;
    power = 5; // reset power
  } else if (e.key === 'r') {
    resetGame(); // reset the game when "r" is pressed
  } else if (e.key === 'k') {
    resetBall(); // reset ball position when "k" is pressed
  }
});

function update() {
  if (isBowling) {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball bounce off walls (left, right, top, bottom)
    if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
      ballSpeedX = -ballSpeedX; // reverse horizontal speed
    }

    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
      ballSpeedY = -ballSpeedY; // reverse vertical speed
    }

    // Collision with pins
    pins.forEach((pin, index) => {
      const dist = Math.hypot(ballX - pin.x, ballY - pin.y);
      if (dist < ballRadius + 10) {
        pins.splice(index, 1); // pin is knocked over
        score += 10;
      }
    });

    if (pins.length === 0) {
      setTimeout(() => {
        alert('You knocked all the pins down!');
        resetBall();
      }, 500);
    }
  }

  draw();
  requestAnimationFrame(update);
}

function resetBall() {
  ballX = 100;
  ballY = 100;  // Ball resets to the height of the first pin (y = 100)
  ballSpeedX = 0;
  ballSpeedY = 0;
  isBowling = false;
  power = 5;
}

function resetGame() {
  score = 0; // reset score
  pins = [
    { x: 650, y: 100 },  // row 1 (1 pin)
    { x: 620, y: 130 }, { x: 680, y: 130 },  // row 2 (2 pins)
    { x: 590, y: 160 }, { x: 650, y: 160 }, { x: 710, y: 160 },  // row 3 (3 pins)
    { x: 560, y: 190 }, { x: 620, y: 190 }, { x: 680, y: 190 }, { x: 740, y: 190 }  // row 4 (4 pins)
  ]; // reset pins
  resetBall(); // reset ball
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.closePath();

  // Draw pins
  pins.forEach(pin => {
    ctx.beginPath();
    ctx.arc(pin.x, pin.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
  });

  // Draw aiming line
  const lineLength = 100; // adjust for how far you want the line to go
  const endX = ballX + Math.cos(angle * Math.PI / 180) * lineLength;
  const endY = ballY + Math.sin(angle * Math.PI / 180) * lineLength;

  ctx.beginPath();
  ctx.moveTo(ballX, ballY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();

  // Update score
  scoreText.innerText = score;
}

update();
