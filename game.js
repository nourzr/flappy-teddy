const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// FULLSCREEN FIX (important)
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// IMAGES
const teddy = new Image();
teddy.src = "teddy.png";

const cookie = new Image();
cookie.src = "cookie.png";

const skull = new Image();
skull.src = "skull.png";

// GAME STATE
let state = "home";

// TEDDY
let x = 100;
let y = 300;
let velocity = 0;
let gravity = 0.5;

// PIPES
let pipes = [];
let pipeWidth = 70;
let pipeGap = 220;
let speed = 3;

// SCORE
let cookies = 0;
let best = 0;
let newRecord = false;

// FUNNY MESSAGES 😄
let funnyLose = [
  "Teddy got bullied by pipes 💀",
  "He forgot how to fly 😭",
  "Cookies distracted him 🍪",
  "Skill issue detected 🧠",
];

let funnyWin = [
  "Teddy is proud of you 🧸",
  "Cookie addiction level: MAX 🍪",
  "You are the chosen one 😎",
];

function createPipe() {
  return {
    x: canvas.width,
    height: Math.random() * (canvas.height - 200) + 80
  };
}

pipes.push(createPipe());

// RESET
function reset() {
  y = 300;
  velocity = 0;
  pipes = [createPipe()];
  cookies = 0;
  pipeGap = 220;
  newRecord = false;
  state = "playing";
}

// INPUT
function jumpOrStart() {
  if (state === "home") reset();
  else if (state === "playing") velocity = -10;
  else if (state === "gameover") reset();
}

canvas.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  jumpOrStart();
});

document.addEventListener("keydown", e => {
  if (e.code === "Space") jumpOrStart();
});

// COLLISION
function hit(p) {
  return (
    x < p.x + pipeWidth &&
    x + 40 > p.x &&
    (y < p.height || y + 40 > p.height + pipeGap)
  );
}

// GAME LOOP
function update() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // HOME
  if (state === "home") {
    ctx.fillStyle = "white";
    ctx.font = "bold 50px Arial";
    ctx.fillText("Flappy Teddy 🧸", 80, 200);

    ctx.font = "20px Arial";
    ctx.fillText("Tap / Click / SPACE to start", 90, 280);
  }

  // PLAYING
  if (state === "playing") {

    velocity += gravity;
    y += velocity;

    pipes.forEach(p => p.x -= speed);

    if (pipes[pipes.length - 1].x < canvas.width - 200) {
      pipes.push(createPipe());
    }

    if (pipes[0].x < -pipeWidth) {
      pipes.shift();
      cookies++;

      if (cookies % 5 === 0 && pipeGap > 130) {
        pipeGap -= 5;
      }
    }

    // COLLISION
    pipes.forEach(p => {
      if (hit(p)) state = "gameover";
    });

    if (y < 0 || y > canvas.height) state = "gameover";

    // DRAW PIPES (lighter for performance)
    ctx.fillStyle = "#1f8f3a";
    pipes.forEach(p => {
      ctx.fillRect(p.x, 0, pipeWidth, p.height);
      ctx.fillRect(p.x, p.height + pipeGap, pipeWidth, canvas.height);
    });

    // TEDDY
    ctx.drawImage(teddy, x, y, 45, 45);

    // HUD
    ctx.drawImage(cookie, 10, 10, 25, 25);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(cookies, 40, 30);
  }

  // GAME OVER
  if (state === "gameover") {

    if (cookies > best) {
      best = cookies;
      newRecord = true;
    }

    ctx.drawImage(skull, canvas.width / 2 - 30, 120, 60, 60);

    ctx.fillStyle = "white";
    ctx.font = "bold 40px Arial";
    ctx.fillText("You Lost!", canvas.width / 2 - 90, 220);

    // funny message
    let msg = funnyLose[Math.floor(Math.random() * funnyLose.length)];
    ctx.font = "18px Arial";
    ctx.fillText(msg, canvas.width / 2 - 120, 260);

    if (newRecord) {
      ctx.fillText("🔥 NEW HIGH SCORE! 🔥", canvas.width / 2 - 120, 290);
    }

    ctx.font = "20px Arial";
    ctx.fillText("Cookies: " + cookies, canvas.width / 2 - 70, 340);
    ctx.fillText("Best: " + best, canvas.width / 2 - 50, 370);

    ctx.fillText("Tap / SPACE to restart", canvas.width / 2 - 110, 420);
  }

  requestAnimationFrame(update);
}

update();
