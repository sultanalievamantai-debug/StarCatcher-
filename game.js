// document.addEventListener('keydown', function (event) {
//     console.log('Нажата:', event.key, '| код:', event.code)
// })
// document.addEventListener('keydown', function (event) {
//     if (event.code == 'ArrowRight') hero.x += 10;
//     if (event.code == 'ArrowLeft') hero.x -= 10;
//     if (event.code == 'ArrowDown') hero.y += 10;
//     if (event.code == 'ArrowUp') hero.y -= 10;
//     draw()
// })
// document.addEventListener('keyup', function (event) {
//     console.log('Отпустили клавишу:', event.code,)
// })

// function draw() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height)
//     ctx.fillStyle = hero.color
//     ctx.fillRect(hero.x, hero.y, hero.size, hero.size)
// }
// draw()

let canvas = document.getElementById('game')
let ctx = canvas.getContext('2d')

let hero = {
    x: 275,
    y: 175,
    size: 40,
    color: '#4fc3f7',
    vx: 0,
    vy: 0
}

let acceleration = 0.6;
let friction = 0.88;
let maxSpeed = 7;
let star = createStar();
let score = 0;
let timeLeft = 30;
let gameOver = false

let keys = {}
let gameKeys = ['ArrowUp', 'Arrowdown', 'ArrowLeft', 'ArrowRight', 'Space']

document.addEventListener('keydown', function (event) {
    keys[event.code] = true
    if (gameKeys.includes(event.code)) event.preventDefault();
    if (event.code === 'Space' && !event.repeat && gameOver) restart();
})

document.addEventListener('keyup', function (event) {
    keys[event.code] = false
})

window.addEventListener('blur', function() {
    for (let key in keys) keys[key] = false
})

function createStar() {
    return {
        x: 20 + Math.random() * (canvas.width - 40),
        y: 20 + Math.random() * (canvas.height - 40),
        r: 12
    }
}

function touchesStar() {
    let closesX = Math.max(hero.x, Math.min(star.x, hero.x + hero.size))
    let closesY = Math.max(hero.y, Math.min(star.y, hero.y + hero.size))

    let dx = star.x - closesX
    let dy = star.y - closesY
    return dx * dx + dy * dy < star.r * star.r
}

setInterval(function () {
    if (!gameOver) {
        timeLeft--
        if (timeLeft <= 0) gameOver = true
    }
}, 1000)

function update() {
    if (keys["ArrowRight"] || keys['KeyD']) hero.vx += acceleration
    if (keys["ArrowLeft"] || keys['KeyA']) hero.vx -= acceleration
    if (keys["ArrowDown"] || keys['KeyS']) hero.vy += acceleration
    if (keys["ArrowUp"] || keys['KeyW']) hero.vy -= acceleration

    hero.vx *= friction
    hero.vy *= friction

    hero.vx = Math.max(-maxSpeed, Math.min(maxSpeed, hero.vx))
    hero.vy = Math.max(-maxSpeed, Math.min(maxSpeed, hero.vy))

    hero.x += hero.vx
    hero.y += hero.vy

    if (hero.x < 0) { hero.x = 0; hero.vx = 0}

    if (hero.y < 0) { hero.y = 0; hero.vy = 0}

    if (hero.x + hero.size > canvas.width) {
         hero.x = canvas.width - hero.size; hero.vx = 0}

    if (hero.y + hero.size > canvas.height) {
        hero.y = canvas.height - hero.size; hero.vy = 0
    }

    if (touchesStar()) {
        score++
        star = createStar()
    }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "gold";
  ctx.beginPath();
  ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = hero.color;
  ctx.fillRect(hero.x, hero.y, hero.size, hero.size);

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText("⭐ " + score, 15, 30);
  ctx.textAlign = "right";
  ctx.fillText("⏱️ " + timeLeft, canvas.width - 15, 30);

  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "36px Arial";
    ctx.fillText("Время вышло!", canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = "20px Arial";
    ctx.fillText("Собрано звёзд: " + score, canvas.width / 2, canvas.height / 2 + 15);
    ctx.fillText("ПРОБЕЛ — играть снова", canvas.width / 2, canvas.height / 2 + 50);
  }
}

function restart() {
  score = 0;
  timeLeft = 30;
  hero.x = 275; hero.y = 175; hero.vx = 0; hero.vy = 0;
  star = createStar();
  gameOver = false;
}

function loop() {
  if (!gameOver) update();
  draw();
  requestAnimationFrame(loop);
}

loop();
