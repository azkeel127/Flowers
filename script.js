// =========================================================
// FLORES AMARILLAS — "PARA SHA"
// JavaScript: interacción, partículas, movimiento 3D y audio háptico.
// No necesita ninguna librería externa.
// =========================================================

const body = document.body;
const card = document.querySelector("#card");
const stage = document.querySelector("#flowerStage");
const button = document.querySelector("#bloomButton");
const petals = document.querySelector("#petals");
const canvas = document.querySelector("#sparkles");
const ctx = canvas.getContext("2d");

// ---------------------------------------------------------
// 1. Ajustar canvas a cualquier teléfono
// ---------------------------------------------------------
let dpr = Math.min(window.devicePixelRatio || 1, 2);

function resizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

addEventListener("resize", resizeCanvas);
resizeCanvas();

// ---------------------------------------------------------
// 2. Sistema de pequeñas estrellas doradas
// ---------------------------------------------------------
const stars = Array.from({ length: 55 }, () => ({
  x: Math.random() * innerWidth,
  y: Math.random() * innerHeight,
  r: Math.random() * 1.5 + .3,
  phase: Math.random() * Math.PI * 2,
  speed: Math.random() * .02 + .005
}));

function drawStars(time = 0) {
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (const star of stars) {
    const alpha = .18 + (Math.sin(time * star.speed + star.phase) + 1) * .16;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 225, 90, ${alpha})`;
    ctx.fill();
  }

  requestAnimationFrame(drawStars);
}

requestAnimationFrame(drawStars);

// ---------------------------------------------------------
// 3. Pétalos cayendo
// ---------------------------------------------------------
function createPetal(x = Math.random() * innerWidth, instant = false) {
  const petal = document.createElement("i");
  petal.className = "petal";

  petal.style.left = `${x}px`;
  petal.style.setProperty("--drift", `${Math.random() * 180 - 90}px`);
  petal.style.animationDuration = `${Math.random() * 4 + 5}s`;
  petal.style.animationDelay = instant ? `${Math.random() * .7}s` : "0s";
  petal.style.transform = `rotate(${Math.random() * 360}deg)`;

  petals.appendChild(petal);

  petal.addEventListener("animationend", () => petal.remove());
}

// Pocos pétalos permanentes para no castigar el teléfono.
setInterval(() => createPetal(), 950);

// ---------------------------------------------------------
// 4. Botón: explosión de flores
// ---------------------------------------------------------
button.addEventListener("click", () => {
  body.classList.toggle("blooming");

  // Explosión de pétalos desde distintos puntos.
  for (let i = 0; i < 28; i++) {
    setTimeout(() => {
      createPetal(Math.random() * innerWidth, true);
    }, i * 28);
  }

  // Vibración corta si el navegador la permite.
  if ("vibrate" in navigator) {
    navigator.vibrate([18, 35, 18]);
  }

  button.querySelector("span").textContent =
    body.classList.contains("blooming")
      ? "Ahora sí: que florezca todo"
      : "Haz florecer la pantalla";
});

// ---------------------------------------------------------
// 5. Movimiento 3D: sigue el dedo/mouse sin exagerar
// ---------------------------------------------------------
function tilt(clientX, clientY) {
  const rect = card.getBoundingClientRect();
  const x = (clientX - rect.left) / rect.width - .5;
  const y = (clientY - rect.top) / rect.height - .5;

  const rotateX = -y * 5;
  const rotateY = x * 7;

  card.style.transform =
    `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

addEventListener("pointermove", (event) => {
  // Solo hacemos el efecto cuando el puntero está cerca de la tarjeta.
  const rect = card.getBoundingClientRect();

  if (
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom
  ) {
    tilt(event.clientX, event.clientY);
  }
});

addEventListener("pointerup", () => {
  card.style.transform =
    "perspective(900px) rotateX(0deg) rotateY(0deg)";
});

// ---------------------------------------------------------
// 6. Toque: pequeña onda luminosa en el ramo
// ---------------------------------------------------------
stage.addEventListener("pointerdown", (event) => {
  const ripple = document.createElement("div");

  Object.assign(ripple.style, {
    position: "absolute",
    left: `${event.offsetX}px`,
    top: `${event.offsetY}px`,
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    border: "1px solid rgba(255,230,100,.8)",
    boxShadow: "0 0 25px rgba(255,210,40,.7)",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
    animation: "ripple .9s ease-out forwards"
  });

  stage.appendChild(ripple);
  setTimeout(() => ripple.remove(), 900);

  if ("vibrate" in navigator) navigator.vibrate(8);
});

// La animación de la onda se agrega como regla dinámica.
const style = document.createElement("style");
style.textContent = `
@keyframes ripple {
  from { width: 10px; height: 10px; opacity: 1; }
  to { width: 180px; height: 180px; opacity: 0; }
}
`;
document.head.appendChild(style);

// ---------------------------------------------------------
// 7. Primera lluvia suave al abrir
// ---------------------------------------------------------
for (let i = 0; i < 9; i++) {
  setTimeout(() => createPetal(), i * 260);
}
