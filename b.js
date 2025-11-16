// Всё через чистый JavaScript: лозунги бродят по странице, картинка движется и крутится одновременно, звук играет в фоне
// Просто вставь весь код в консоль браузера!

// Фоновый звук
const audio = document.createElement('audio');
audio.src = 'https://github.com/mea1k/s/raw/refs/heads/main/mark.wav'; // можно заменить на другую mp3/wav ссылку
audio.loop = true;
audio.autoplay = true;
audio.volume = 0.3;
document.body.appendChild(audio);
audio.play().catch(()=>{}); // Автозапуск на некоторых сайтах требует взаимодействия

// Картинка: создаём div, будет двигаться и крутиться
const imgDiv = document.createElement('div');
imgDiv.style.position = 'fixed';
imgDiv.style.zIndex = 10000;
imgDiv.style.pointerEvents = 'none';

const img = document.createElement('img');
img.src = 'https://github.com/mea1k/s/blob/main/photo_2025-09-07_17-27-09.jpg?raw=true';
img.style.width = '200px';
img.style.height = '200px';
img.style.display = 'block';
img.style.boxShadow = '0 0 24px #2a9d8f';
img.style.borderRadius = '24px';
img.style.background = '#fff';
imgDiv.appendChild(img);
document.body.appendChild(imgDiv);

// Картинка: движение и вращение по экрану
let imgX = Math.random() * (window.innerWidth - 220) + 10;
let imgY = Math.random() * (window.innerHeight - 220) + 10;
let imgDX = Math.random() > 0.5 ? 3 : -3;
let imgDY = Math.random() > 0.5 ? 2 : -2;
let imgAngle = 0;

function moveAndRotateImg() {
  imgX += imgDX;
  imgY += imgDY;
  imgAngle += 2;

  // Отскок от краёв
  if (imgX <= 0) { imgX = 0; imgDX *= -1; }
  if (imgX + 200 >= window.innerWidth) { imgX = window.innerWidth - 200; imgDX *= -1; }
  if (imgY <= 0) { imgY = 0; imgDY *= -1; }
  if (imgY + 200 >= window.innerHeight) { imgY = window.innerHeight - 200; imgDY *= -1; }

  imgDiv.style.left = imgX + 'px';
  imgDiv.style.top = imgY + 'px';
  img.style.transform = `rotate(${imgAngle}deg)`;

  requestAnimationFrame(moveAndRotateImg);
}
moveAndRotateImg();

// Лозунги для анимации по всему экрану
const slogans = [
  'МАРК СОШКИН ЛУЧШИЙ ХАКЕР',
  'ТЫ НЕ ВЗЛОМАЕШЬ НАС, МЫ ВЗЛОМАЕМ ТЕБЯ!',
  'ОФМФЫСКШЗЕ'
];

slogans.forEach((text, idx) => {
  const div = document.createElement('div');
  div.textContent = text;
  div.style.position = 'fixed';
  div.style.fontSize = '3.5em';
  div.style.fontWeight = 'bold';
  div.style.color = '#e63946';
  div.style.fontFamily = 'Segoe UI, sans-serif';
  div.style.textShadow = '0 2px 16px #a8dadc, 0 0 18px #fff';
  div.style.zIndex = 10001;
  div.style.pointerEvents = 'none';
  div.style.whiteSpace = 'nowrap';
  document.body.appendChild(div);

  let x = Math.random() * (window.innerWidth - 600) + 50;
  let y = Math.random() * (window.innerHeight - 100) + 20;
  let dx = Math.random() > 0.5 ? 3 + Math.random() * 2 : -3 - Math.random() * 2;
  let dy = Math.random() > 0.5 ? 2 + Math.random() * 2 : -2 - Math.random() * 2;

  function move() {
    const rect = div.getBoundingClientRect();
    x += dx;
    y += dy;

    if (x <= 0) { x = 0; dx *= -1; }
    if (x + rect.width >= window.innerWidth) { x = window.innerWidth - rect.width; dx *= -1; }
    if (y <= 0) { y = 0; dy *= -1; }
    if (y + rect.height >= window.innerHeight) { y = window.innerHeight - rect.height; dy *= -1; }

    div.style.left = x + 'px';
    div.style.top = y + 'px';
    requestAnimationFrame(move);
  }
  move();
});
