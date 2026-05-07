const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

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
let pipeGap = 220;
let pipeWidth = 70;
let speed = 2;

// SCORE
let cookies = 0;
let best = 0;

// CLOUDS
let clouds = [
  { x: 50, y: 100 },
  { x: 200, y: 150 },
  { x: 350, y: 80 },
];

// CREATE PIPE
function createPipe() {
  return {
    x: 400,
    height: Math.random() * 250 + 100,
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
  state = "playing";
}

// INPUT
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (state === "home") reset();
    else if (state === "playing") velocity = -10;
    else if (state === "gameover") reset();
  }
});

// COLLISION
function hit(pipe) {
  if (
    x < pipe.x + pipeWidth &&
    x + 40 > pipe.x &&
    (y < pipe.height || y + 40 > pipe.height + pipeGap)
  ) {
    return true;
  }
  return false;
}

// LOOP
function update() {
  ctx.clearRect(0, 0, 400, 600);

  // CLOUDS
  clouds.forEach((c) => {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(c.x, c.y, 20, 0, Math.PI * 2);
    ctx.fill();

    c.x -= 0.5;
    if (c.x < -50) c.x = 450;
  });

  if (state === "home") {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Flappy Teddy 🧸", 60, 250);
    ctx.font = "20px Arial";
    ctx.fillText("Press SPACE", 130, 320);
  }

  if (state === "playing") {
    // physics
    velocity += gravity;
    y += velocity;

    // pipes
    pipes.forEach((p) => (p.x -= speed));

    if (pipes[pipes.length - 1].x < 200) {
      pipes.push(createPipe());
    }

    if (pipes[0].x < -70) {
      pipes.shift();
      cookies++;
      if (cookies % 5 === 0 && pipeGap > 130) pipeGap -= 5;
    }

    // collision
    pipes.forEach((p) => {
      if (hit(p)) state = "gameover";
    });

    if (y < 0 || y > 600) state = "gameover";

    // draw pipes
    ctx.fillStyle = "green";
    pipes.forEach((p) => {
      ctx.fillRect(p.x, 0, pipeWidth, p.height);
      ctx.fillRect(p.x, p.height + pipeGap, pipeWidth, 600);
    });

    // teddy
    ctx.drawImage(teddy, x, y, 40, 40);

    // cookies
    ctx.drawImage(cookie, 10, 10, 25, 25);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(cookies, 40, 30);
  }

  if (state === "gameover") {
    if (cookies > best) best = cookies;

    ctx.drawImage(skull, 170, 150, 60, 60);

    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("You Lost!", 120, 250);

    ctx.font = "20px Arial";
    ctx.fillText("Cookies: " + cookies, 140, 300);
    ctx.fillText("Best: " + best, 150, 340);
    ctx.fillText("SPACE to restart", 110, 400);
  }

  requestAnimationFrame(update);
}

update();
