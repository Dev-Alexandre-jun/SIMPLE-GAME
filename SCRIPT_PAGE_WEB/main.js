const canvas = document.querySelector("#screen");
const ctx = canvas.getContext("2d");
const btn_top = document.querySelector("#top");
const btn_left = document.querySelector("#left");
const btn_right = document.querySelector("#right");
const btn_bottom = document.querySelector("#bottom");
canvas.width =  window.innerWidth;
canvas.height = 400;
let ship = [];
let alien_x = 0;
let alien_y = 0;
let alien_r = 140;
let dx_alien = 0;
let dy_alien = 0;
let speed = 0.28;
let speed_aur = 0;
let person_x = 0;
let person_y = 260;
let person_r = 140;
btn_top.onclick = () => {
  dy_alien = -speed;
  dx_alien = 0;
};
btn_left.onclick = () => {
  dx_alien = -speed;
  dy_alien = 0;
};
btn_right.onclick = () => {
  dx_alien = speed;
  dy_alien = 0;
};
btn_bottom.onclick = () => {
  dy_alien = speed;
  dx_alien = 0;
};
let colors = [
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
let photos = [
  "../Media/2314481C-E8DF-425E-A25E-C8CC4C204CA2.png",
  "../Media/29DF7D88-6EEE-49A2-ABA3-B7A63AE007C6.png"
];
for(let ship_ = 0; ship_ < 100; ship_++){
  ship.unshift({
    ship_x: Math.random() * canvas.width,
    ship_y: Math.random() * 0.7 * canvas.height,
    ship_r: Math.random() * 2
  });
};
function mou(y, c, a, l) {
  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  for (let mo = 0; mo < canvas.width; mo += 5) {
    let amoun = y + Math.sin(mo * l) * a;
    ctx.lineTo(mo, amoun);
  };
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  ctx.fillStyle = c;
  ctx.fill();
};
function skyShip(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const SKY = ctx.createLinearGradient(0, 0, 0, canvas.height);
  SKY.addColorStop(0, colors[0]);
  SKY.addColorStop(0.5, colors[1]);
  SKY.addColorStop(1, colors[0]);
  ctx.fillStyle = SKY;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
 ship.forEach((sh) => {
  ctx.beginPath();
  ctx.arc(sh.ship_x, sh.ship_y, sh.ship_r, 0, Math.PI * 2, true);
  ctx.fillStyle = colors[2];
  ctx.fill();
 });
  ctx.beginPath();
  speed_aur += 0.002;
  ctx.moveTo(0, canvas.height);
  for(let aur = 0; aur < canvas.width; aur++){
    let yaur = canvas.height * 0.250 + Math.sin(aur * 0.01 + speed_aur) * 80;
    if(aur === 0){
      ctx.moveTo(aur, yaur);
    }else{
      ctx.lineTo(aur, yaur);
    }
  };
   ctx.lineTo(canvas.width, canvas.height);
   ctx.lineTo(0, canvas.height);
   const AUR_G = ctx.createLinearGradient(0, canvas.height * 0.2, 0, canvas.height);
   AUR_G.addColorStop(0, colors[3]);
   AUR_G.addColorStop(0.5, colors[4]);
   AUR_G.addColorStop(1, colors[5]);
   ctx.shadowColor = colors[6];
   ctx.shadowBlur = 80;
   ctx.fillStyle = AUR_G;
   ctx.fill();
   ctx.shadowBlur = 0;
 mou(canvas.height - 180, colors[6], 75, 0.01);
 mou(canvas.height - 130, colors[7], 50, 0.01);
 mou(canvas.height - 90, colors[8], 35, 0.01);
 ctx.drawImage(alien, alien_x, alien_y, alien_r, alien_r);
 ctx.drawImage(person, person_x, person_y, person_r, person_r);
 alien_x += dx_alien;
 alien_y += dy_alien;
if (alien_y < 0) {
  alien_y = 0;
  dy_alien = 0;
};
if (alien_x < 0) {
  alien_x = 0;
  dx_alien = 0;
};
if (alien_x + alien_r > canvas.width) {
  alien_x = canvas.width - alien_r;
};
if (alien_y + alien_r > canvas.height) {
  alien_y = canvas.height - alien_r;
};
 requestAnimationFrame(skyShip);
};
const alien = new Image();
alien.src = photos[0];
alien.onload = function() {
  skyShip();
};
const person = new Image();
person.src = photos[1];
person.onload = function(){
  skyShip();
};
skyShip();