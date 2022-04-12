var game = document.getElementById("game");
var block = document.getElementById("block");
var hole = document.getElementById("hole");
var character = document.getElementById("character");
var jumping = 0;
var counter = 0;
var ss = document.getElementById("score");
var hs = document.getElementById("HsScore");
hs.innerHTML = "HS:" + localStorage.getItem("highScore");

hole.addEventListener("animationiteration", () => {
  var random = Math.random() * 3;
  var top = random * 100 + 150;
  hole.style.top = -top + "px";
  console.log(top);
  // var random = Math.random() * 150 + 1;
  // hole.style.top = -random + "px";
  counter++;
  highScore(counter);
  ss.innerHTML = counter;
  // ss;
  hs.innerHTML = "HS:" + localStorage.getItem("highScore");

  if (counter >= 10) {
    game.style.backgroundImage = "url('assets/bg1.jpg')";
  }
  if (counter >= 20) {
    game.style.backgroundImage = "url('assets/bg.jpg')";
  }
  if (counter >= 30) {
    game.style.backgroundImage = "url('assets/bg1.jpg')";
  }
  if (counter >= 40) {
    game.style.backgroundImage = "url('assets/bg.jpg')";
  }
  if (counter >= 50) {
    game.style.backgroundImage = "url('assets/bg1.jpg')";
  }
});
function highScore(counter) {
  var saved = 0;
  try {
    saved = parseFloat(localStorage.highScore);
  } catch (e) {
    saved = 0;
  }
  if (!(typeof counter === "undefined")) {
    try {
      counter = parseFloat(counter);
    } catch (e) {
      counter = 0;
    }
    if (counter > saved) {
      saved = counter;
      localStorage.highScore = "" + counter;
    }
  }
  if (isNaN(saved)) {
    saved = 0;
    localStorage.highScore = "0";
  }
  return saved;
}
setInterval(function () {
  var characterTop = parseInt(
    window.getComputedStyle(character).getPropertyValue("top")
  );
  if (jumping == 0) {
    character.style.top = characterTop + 3 + "px";
  }
  var blockLeft = parseInt(
    window.getComputedStyle(block).getPropertyValue("left")
  );
  bb = block.offsetHeight;
  var holeTop = parseInt(window.getComputedStyle(hole).getPropertyValue("top"));
  var cTop = -(500 - characterTop);
  if (
    characterTop > 480 ||
    (blockLeft < 40 &&
      blockLeft > -50 &&
      (cTop < holeTop || cTop > holeTop + 200))
  ) {
    alert("Game Over!!!");
    character.style.top = 100 + "px";
    game.style.backgroundImage = "url('assets/bg.jpg')";
    counter = 0;
    ss.innerHTML = counter;
    block.style.left = 400 + "px";
    hole.style.left = 400 + "px";
  }
}, 10);

function jump() {
  jumping = 1;
  let jumpCount = 0;
  var jumpInterval = setInterval(function () {
    var characterTop = parseInt(
      window.getComputedStyle(character).getPropertyValue("top")
    );
    if (characterTop > 6 && jumpCount < 15) {
      character.style.top = characterTop - 4 + "px";
    }
    if (jumpCount > 20) {
      clearInterval(jumpInterval);
      jumping = 0;
      jumpCount = 0;
    }
    jumpCount++;
  }, 10);
}
document.addEventListener("keyup", function (e) {
  if (e.code === "Space") {
    jump();
  }
});

// Animations
window.onload = (_) => {
  "use strict";

  const rand = (min, max) => Math.random() * (max - min) + min;
  const canvas = {
    elem: document.querySelector("canvas"),
    init() {
      window.addEventListener("resize", (_) => this.resize(), false);
      this.resize();
      return this.elem.getContext("2d");
    },
    resize() {
      const dpr = window.devicePixelRatio || 1.0;
      this.width = this.elem.width = this.elem.offsetWidth * dpr;
      this.height = this.elem.height = this.elem.offsetHeight * dpr;
      this.vIsResize = true;
    },
    get isResize() {
      if (this.vIsResize) {
        this.vIsResize = false;
        return true;
      }
      return false;
    },
  };
  const ctx = canvas.init();
  const flame = document.getElementById("flameparticle");

  class Particle {
    constructor(x, y) {
      this.sx = x;
      this.sy = y;
      this.reset();
    }
    reset() {
      this.x = this.sx;
      this.y = this.sy;
      this.vx = 0;
      this.vy = 0;
      this.startLifespan = 7;
      this.lifespan = this.startLifespan;
      this.decayRate = 0.1;
      this.alpha = 1;
      this.angle = rand(0, Math.PI);
    }
    update() {
      this.vx += rand(-0.18, 0.18);
      this.vy -= this.lifespan / 22;
      this.lifespan -= this.decayRate;
      this.x += this.vx;
      this.y += this.vy;
      const life = this.lifespan / this.startLifespan;
      this.alpha = Math.pow(life, 1.5);
      if (this.isDead()) this.reset();
    }
    isDead() {
      if (this.lifespan < 0) {
        return true;
      }
      return false;
    }
    display() {
      ctx.globalAlpha = this.alpha;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.drawImage(flame, -100, -100, 200, 200);
      ctx.restore();
    }
  }

  const quantity = 70;
  const particles = [];
  let full = false;
  const animate = (_) => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";
    if (!full && particles.length < quantity) {
      particles.push(new Particle(canvas.width * 0.5, canvas.height * 0.8));
      if (particles.length === quantity) full = true;
    }
    if (canvas.isResize) {
      for (const p of particles) {
        p.sx = canvas.width * 0.5;
        p.sy = canvas.height * 0.8;
      }
    }
    for (const p of particles) {
      p.update();
      p.display();
    }
  };
  requestAnimationFrame(animate);
};
