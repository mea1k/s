// === Стили ===
const style = document.createElement('style');
style.textContent = `
  body {
    margin: 0;
    font-family: monospace;
    background-color: black;
    color: lime;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    overflow: hidden;
    transition: transform 0.2s ease;
  }

  h1 {
    font-size: 3rem;
    animation: flicker 1s infinite;
    text-align: center;
  }

  @keyframes flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.1; }
  }
`;
document.head.appendChild(style);

// === Текст ===
document.body.innerHTML = "<h1>🤣 Прикол! Ты в ловушке!</h1>";

// === Вращение экрана ===
let angle = 0;
setInterval(() => {
  angle += 10;
  document.body.style.transform = `rotate(${angle}deg)`;
}, 100);

// === Popup RickRoll ===
function openPop() {
  try {
    window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
  } catch (e) {}
}
for (let i = 0; i < 5; i++) {
  setTimeout(openPop, i * 500);
}

// === Бесконечный alert ===
setTimeout(function alertLoop() {
  alert("АХАХА ПОПАЛСЯ!");
  setTimeout(alertLoop, 1500);
}, 2000);
