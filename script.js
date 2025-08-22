// --- Constantes & stockage ---
const PIN = "300408";
const START = new Date("2025-07-22T00:00:00");

// Compliments init (si localStorage vide)
let compliments = JSON.parse(localStorage.getItem("compliments")) || [
  "Julia, je t'aime",
  "Tu es la plus belle chose qui me soit arrivée",
  "Je t'aime mon petit bébé orque",
  "Tu es l'amour de ma vie",
  "Tu es ce qu'il y a de plus cher pour moi",
  "Ya Tebia Lyublyu",
  "Je t'aime mon coeur",
  "Julia, maries moi !",
  "Mon chat",
  "Je t'aime plus que tout",
  "Plus le temps passe, plus je t'aime",
  "Je t'aime ma femme",
  "Je veux passer le restant de ma vie à tes côtés",
  "Ne l'oublies jamais : je veille toujours sur toi",
  "Sans toi je ne suis rien, avec, je suis tout",
  "Je t'aime ma chérie",
  "Je veux dormir à tes côtés",
  "Je ne souhaite que ton bonheur",
  "Je t'aime ma Juju",
  "Tu es si belle",
  "Tu es magnifique",
  "Tu es sublime",
  "Tes yeux sont comme des joyaux inestimables",
  "Ton corps est d'une beauté éblouissante",
  "Tu es la plus belle femme au monde",
  "Chaque photo de toi est une œuvre d'art",
  "*Bisous sur le front*",
  "*Bisous sur la joue*",
  "*Bisous sur les lèvres*",
  "*Bisous dans le cou*",
  "JULIA JE T'AIME !",
  "Mon petit cœur",
  "Tu es mon amoureuse",
  "Coucou mon cœur, j'espère que tu vas bien",
  "Je t'aime mon bébé loup",
  "Je suis amoureux de toi Julia"
];
persist("compliments", compliments);

// Thème
let theme = localStorage.getItem("theme") || "rose";
applyTheme(theme);

// Bisous (persistant local sur l’appareil)
let kisses = parseInt(localStorage.getItem("kisses") || "0", 10);
updateKisses();

// Dates récurrentes
let monthlyDay = parseInt(localStorage.getItem("monthlyDay") || "22", 10); // 22 par défaut
let yearlyDate = localStorage.getItem("yearlyDate") || "2025-07-22";

// --- Utilitaires stockage ---
function persist(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function setStr(key, value) {
  localStorage.setItem(key, value);
}

// --- Sons (Web Audio, pas de fichiers) ---
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function beep(freq=660, duration=80, type="sine", gain=0.05) {
  try {
    audioCtx = audioCtx || new AudioCtx();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = gain;
    o.connect(g); g.connect(audioCtx.destination);
    o.start();
    setTimeout(() => { o.stop(); o.disconnect(); g.disconnect(); }, duration);
  } catch {}
}
function clickSound() { beep(520, 60, "square", 0.04); }
function heartSound() { beep(420, 90, "sine", 0.06); }

// --- Timer “ensemble depuis” ---
function updateTimer() {
  const now = new Date();
  const diff = now - START;
  const days = Math.floor(diff / 86400000);
  const hrs = Math.floor((diff % 86400000) / 3600000);
  const min = Math.floor((diff % 3600000) / 60000);
  const sec = Math.floor((diff % 60000) / 1000);
  document.getElementById("timer").textContent =
    `Ensemble depuis ${days} j ${hrs} h ${min} min ${sec} s`;
}
setInterval(updateTimer, 1000);
updateTimer();

// --- Compliments ---
document.getElementById("btn-compliment").onclick = () => {
  clickSound();
  const el = document.getElementById("compliment");
  el.textContent = compliments.length
    ? compliments[Math.floor(Math.random() * compliments.length)]
    : "Ajoute un compliment pour commencer";
};

// --- Kisses ---
document.getElementById("btn-kiss").onclick = () => {
  kisses += 1;
  setStr("kisses", String(kisses));
  updateKisses();
  heartSound();
  spawnHeart();
};
function updateKisses() {
  const kc = document.getElementById("kisses-count");
  if (kc) kc.textContent = String(kisses);
}

// --- Dev PIN ---
const pinOverlay = document.getElementById("pin-overlay");
document.getElementById("btn-dev").onclick = () => {
  pinOverlay.classList.remove("hidden");
};
document.getElementById("pin-ok").onclick = () => {
  if (document.getElementById("pin-input").value === PIN) {
    pinOverlay.classList.add("hidden");
    openDev();
    clickSound();
    document.getElementById("pin-input").value = "";
  } else {
    beep(200, 120, "sawtooth", 0.06);
  }
};
document.getElementById("pin-cancel").onclick = () => {
  pinOverlay.classList.add("hidden");
};

// --- Dev popup ---
const devPopup = document.getElementById("dev-popup");
document.getElementById("close-dev").onclick = () => { devPopup.classList.add("hidden"); };

function openDev() {
  refreshSelect();
  document.getElementById("theme-select").value = theme;
  document.getElementById("monthly-day").value = monthlyDay;
  document.getElementById("yearly-date").value = yearlyDate;
  devPopup.classList.remove("hidden");
}

// Compliments CRUD
document.getElementById("add").onclick = () => {
  const t = document.getElementById("input-text").value.trim();
  if (t) {
    compliments.push(t); persist("compliments", compliments);
    refreshSelect(); document.getElementById("input-text").value = "";
    clickSound();
  }
};
document.getElementById("edit").onclick = () => {
  const idx = document.getElementById("select-list").selectedIndex;
  const t = document.getElementById("input-text").value.trim();
  if (idx >= 0 && t) {
    compliments[idx] = t; persist("compliments", compliments);
    refreshSelect(); document.getElementById("input-text").value = "";
    clickSound();
  }
};
document.getElementById("del").onclick = () => {
  const idx = document.getElementById("select-list").selectedIndex;
  if (idx >= 0) {
    compliments.splice(idx, 1); persist("compliments", compliments);
    refreshSelect(); clickSound();
  }
};
function refreshSelect() {
  const select = document.getElementById("select-list");
  select.innerHTML = "";
  compliments.forEach(c => {
    const opt = document.createElement("option");
    opt.textContent = c; select.appendChild(opt);
  });
}

// Reset kisses
document.getElementById("reset-kisses").onclick = () => {
  kisses = 0; setStr("kisses", "0"); updateKisses();
  beep(300, 150, "triangle", 0.06);
};

// Thèmes
document.getElementById("theme-select").onchange = (e) => {
  theme = e.target.value; setStr("theme", theme); applyTheme(theme); clickSound();
};
function applyTheme(name) {
  document.body.classList.remove("theme-rose","theme-bleu","theme-nocturne","theme-pastel");
  document.body.classList.add("theme-"+name);
}

// Ciel dynamique
function updateSkyPhase() {
  const h = new Date().getHours();
  let phase = "sky-day";
  if (h >= 5 && h < 8) phase = "sky-morning";
  else if (h >= 8 && h < 18) phase = "sky-day";
  else if (h >= 18 && h < 21) phase = "sky-sunset";
  else phase = "sky-night";
  document.body.classList.remove("sky-morning","sky-day","sky-sunset","sky-night");
  document.body.classList.add(phase);
}
setInterval(updateSkyPhase, 60_000);
updateSkyPhase();

// Coeurs animés (canvas performant)
const canvas = document.getElementById("hearts-canvas");
const ctx = canvas.getContext("2d");
let W = 0, H = 0;
function resize() {
  W = canvas.width = window.innerWidth * devicePixelRatio;
  H = canvas.height = window.innerHeight * devicePixelRatio;
}
window.addEventListener("resize", resize);
resize();

const hearts = [];
function spawnHeart() {
  const x = (Math.random() * window.innerWidth) * devicePixelRatio;
  const y = H + 20;
  hearts.push({
    x, y,
    size: 8 + Math.random()*16,
    vy: 0.8 + Math.random()*1.2,
    vx: (Math.random()-0.5)*0.6,
    alpha: 0.9
  });
  if (hearts.length > 80) hearts.shift();
}
setInterval(() => { if (Math.random() < 0.4) spawnHeart(); }, 500);

function drawHeart(x, y, s, a) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.globalAlpha = a;
  ctx.fillStyle = "rgba(255, 105, 180, 0.9)";
  ctx.beginPath();
  ctx.moveTo(0, -1);
  ctx.bezierCurveTo(-1, -2, -3, -0.5, 0, 2);
  ctx.bezierCurveTo(3, -0.5, 1, -2, 0, -1);
  ctx.fill();
  ctx.restore();
}
function loop() {
  ctx.clearRect(0,0,W,H);
  for (let h of hearts) {
    h.y -= h.vy * devicePixelRatio;
    h.x += h.vx * devicePixelRatio;
    h.alpha -= 0.003;
  }
  for (let h of hearts) drawHeart(h.x, h.y, h.size, Math.max(0, h.alpha));
  requestAnimationFrame(loop);
}
loop();

// Navigation onglets
document.querySelectorAll(".tab[data-target]").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const target = btn.getAttribute("data-target");
    document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
    document.getElementById(target).classList.add("active");
    clickSound();
  });
});

// Calendrier
const calTitle = document.getElementById("cal-title");
const calGrid = document.getElementById("calendar-grid");
let viewYear, viewMonth; // month: 0..11
const WEEKDAYS = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

function startCalendar(date=new Date()) {
  viewYear = date.getFullYear();
  viewMonth = date.getMonth();
  renderCalendar();
}
function renderCalendar() {
  const first = new Date(viewYear, viewMonth, 1);
  const last = new Date(viewYear, viewMonth+1, 0);
  calTitle.textContent = first.toLocaleDateString("fr-FR", { month:"long", year:"numeric" }).replace(/^./, c=>c.toUpperCase());

  calGrid.innerHTML = "";
  WEEKDAYS.forEach(d=>{
    const h = document.createElement("div");
    h.textContent = d; h.className = "cal-head";
    calGrid.appendChild(h);
  });

  let offset = (first.getDay()+6)%7; // Lundi=0
  for(let i=0;i<offset;i++){
    const cell = document.createElement("div");
    cell.className = "cal-cell";
    calGrid.appendChild(cell);
  }

  for(let day=1; day<=last.getDate(); day++){
    const cell = document.createElement("div");
    cell.className = "cal-cell";
    const d = document.createElement("div");
    d.className = "day";
    d.textContent = day;
    cell.appendChild(d);

    const badge = document.createElement("div");
    badge.className = "badge";
    const isMonthly = (day === monthlyDay);
    const isYearly = (new Date(viewYear, viewMonth, day).toISOString().slice(5) === yearlyDate.slice(5));
    if (isMonthly) {
      badge.textContent = "Anniversaire de mois";
      badge.classList.add("monthly");
      cell.appendChild(badge);
    }
    if (isYearly) {
      const b = document.createElement("div");
      b.className = "badge yearly";
      b.textContent = "Anniversaire annuel";
      cell.appendChild(b);
    }

    calGrid.appendChild(cell);
  }
}
document.getElementById("cal-prev").onclick = ()=>{ viewMonth--; if(viewMonth<0){viewMonth=11; viewYear--;} renderCalendar(); clickSound(); };
document.getElementById("cal-next").onclick = ()=>{ viewMonth++; if(viewMonth>11){viewMonth=0; viewYear++;} renderCalendar(); clickSound(); };
startCalendar(new Date());

// Sauvegarde des paramètres dates
document.getElementById("monthly-day").addEventListener("change", (e)=>{
  const v = Math.max(1, Math.min(31, parseInt(e.target.value||"22",10)));
  monthlyDay = v; setStr("monthlyDay", String(v)); renderCalendar(); clickSound();
});
document.getElementById("yearly-date").addEventListener("change", (e)=>{
  yearlyDate = e.target.value || "2025-07-22"; setStr("yearlyDate", yearlyDate); renderCalendar(); clickSound();
});