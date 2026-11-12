const canvas = document.querySelector("#screen");
const ctx = canvas.getContext("2d");
const stage = document.querySelector(".stage");
const btn_top = document.querySelector("#top");
const btn_left = document.querySelector("#left");
const btn_right = document.querySelector("#right");
const btn_bottom = document.querySelector("#bottom");

let W = 0;
let H = 0;
let S = 1;

const BASE_H = 400;

let ship = [];
let alien_x = 0;
let alien_y = 0;
let alien_r = 140;
let dx_alien = 0;
let dy_alien = 0;
const SPEED = 0.28 * 60;
let speed_aur = 0;
let person_x = 0;
let person_y = 260;
let person_r = 140;

const colors = [
  "#000000",
  "#0000FF",
  "rgba(255, 255, 255, 0.7)",
  "rgba(255, 255, 255, 0.1)",
  "rgba(0, 0, 255, 0.7)",
  "rgba(0, 0, 0, 0)",
  "#898989",
  "#A9A9A9",
  "#28a745"
];

const photos = [
  "../Media/2314481C-E8DF-425E-A25E-C8CC4C204CA2.png",
  "../Media/29DF7D88-6EEE-49A2-ABA3-B7A63AE007C6.png"
];

const alien = new Image();
alien.src = photos[0];
const person = new Image();
person.src = photos[1];

const setDir = (x, y) => { dx_alien = x; dy_alien = y; };
btn_top.onclick = () => setDir(0, -1);
btn_left.onclick = () => setDir(-1, 0);
btn_right.onclick = () => setDir(1, 0);
btn_bottom.onclick = () => setDir(0, 1);

const KEYMAP = {
  ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
  w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0]
};

document.addEventListener("keydown", (e) => {
  const k = KEYMAP[e.key];
  if (!k) return;
  e.preventDefault();
  setDir(k[0], k[1]);
});

function makeStars() {
  ship = [];
  for (let i = 0; i < 100; i++) {
    ship.unshift({
      ship_x: Math.random() * W,
      ship_y: Math.random() * 0.7 * H,
      ship_r: Math.random() * 2 * Math.max(S, 0.8)
    });
  };
};

function resize() {
  const oldW = W || 1;
  const oldH = H || 1;
  const rect = stage.getBoundingClientRect();
  W = Math.max(1, Math.round(rect.width));
  H = Math.max(1, Math.round(rect.height));
  S = Math.min(1.6, Math.max(0.5, H / BASE_H));

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  alien_r = person_r = Math.min(Math.round(140 * S), Math.round(W * 0.4), Math.round(H * 0.6));
  person_x = 0;
  person_y = H - person_r;

  alien_x = Math.min(Math.max(0, alien_x * (W / oldW)), W - alien_r);
  alien_y = Math.min(Math.max(0, alien_y * (H / oldH)), H - alien_r);
  makeStars();
};

function mou(y, c, a, l) {
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let mo = 0; mo < W + 5; mo += 5) {
    ctx.lineTo(mo, y + Math.sin(mo * l) * a);
  };
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fillStyle = c;
  ctx.fill();
};

let last = 0;
function skyShip(now) {
  const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
  last = now;

  ctx.clearRect(0, 0, W, H);
  const SKY = ctx.createLinearGradient(0, 0, 0, H);
  SKY.addColorStop(0, colors[0]);
  SKY.addColorStop(0.5, colors[1]);
  SKY.addColorStop(1, colors[0]);
  ctx.fillStyle = SKY;
  ctx.fillRect(0, 0, W, H);

  ship.forEach((sh) => {
    ctx.beginPath();
    ctx.arc(sh.ship_x, sh.ship_y, sh.ship_r, 0, Math.PI * 2, true);
    ctx.fillStyle = colors[2];
    ctx.fill();
  });

  speed_aur += 0.12 * dt;
  ctx.beginPath();
  const step = W > 900 ? 3 : 2;
  for (let aur = 0; aur <= W + step; aur += step) {
    const yaur = H * 0.25 + Math.sin(aur * 0.01 + speed_aur) * 80 * S;
    if (aur === 0) ctx.moveTo(aur, yaur);
    else ctx.lineTo(aur, yaur);
  };
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  const AUR_G = ctx.createLinearGradient(0, H * 0.2, 0, H);
  AUR_G.addColorStop(0, colors[3]);
  AUR_G.addColorStop(0.5, colors[4]);
  AUR_G.addColorStop(1, colors[5]);
  ctx.shadowColor = colors[6];
  ctx.shadowBlur = 40 * S;
  ctx.fillStyle = AUR_G;
  ctx.fill();
  ctx.shadowBlur = 0;

  mou(H - 180 * S, colors[6], 75 * S, 0.01);
  mou(H - 130 * S, colors[7], 50 * S, 0.01);
  mou(H - 90 * S, colors[8], 35 * S, 0.01);

  if (alien.complete && alien.naturalWidth) ctx.drawImage(alien, alien_x, alien_y, alien_r, alien_r);
  if (person.complete && person.naturalWidth) ctx.drawImage(person, person_x, person_y, person_r, person_r);

  alien_x += dx_alien * SPEED * S * dt;
  alien_y += dy_alien * SPEED * S * dt;

  if (alien_y < 0) { alien_y = 0; dy_alien = 0; }
  if (alien_x < 0) { alien_x = 0; dx_alien = 0; }
  if (alien_x + alien_r > W) { alien_x = W - alien_r; }
  if (alien_y + alien_r > H) { alien_y = H - alien_r; }

  requestAnimationFrame(skyShip);
};

resize();
alien_x = 0;
alien_y = 0;
requestAnimationFrame(skyShip);

let rT;
window.addEventListener("resize", () => {
  clearTimeout(rT);
  rT = setTimeout(resize, 80);
});

window.addEventListener("orientationchange", () => setTimeout(resize, 200));
if (typeof ResizeObserver !== "undefined") {
  new ResizeObserver(() => { clearTimeout(rT); rT = setTimeout(resize, 80); }).observe(stage);
};