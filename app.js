(function () {
  "use strict";

  const grid = document.getElementById("achievements");
  const filtersBar = document.getElementById("filters");
  const toastStack = document.getElementById("toast-stack");

  const STORAGE_KEY = "xbox-achievements-state";

  const rarityLabel = {
    comun: "Común",
    rara: "Rara",
    epica: "Épica",
    legendaria: "Legendaria",
  };

  let currentFilter = "all";

  // ---- Persistencia ----------------------------------------------------
  // Guardamos un mapa { id: { unlocked, date } } en localStorage y lo
  // fusionamos sobre los datos base de achievements.js.
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      ACHIEVEMENTS.forEach((a) => {
        if (saved[a.id]) {
          a.unlocked = !!saved[a.id].unlocked;
          a.date = saved[a.id].date || "";
        }
      });
    } catch (e) {
      /* estado corrupto: ignoramos y seguimos con los datos base */
    }
  }

  function saveState() {
    const map = {};
    ACHIEVEMENTS.forEach((a) => {
      map[a.id] = { unlocked: a.unlocked, date: a.date };
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch (e) {
      /* almacenamiento no disponible: la sesión seguirá funcionando igual */
    }
  }

  function todayStr() {
    const meses = ["ene", "feb", "mar", "abr", "may", "jun",
      "jul", "ago", "sep", "oct", "nov", "dic"];
    const d = new Date();
    return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
  }

  // ---- Render ----------------------------------------------------------
  function cardTemplate(a) {
    const stateClass = a.unlocked ? "unlocked" : "locked";
    const icon = a.unlocked ? a.icon : "🔒";
    const statusText = a.unlocked ? "Desbloqueado" : "Bloqueado";
    const dateHtml = a.unlocked && a.date
      ? `<span class="date">${a.date}</span>`
      : "";

    return `
      <article class="achievement ${stateClass}" data-state="${stateClass}"
               data-id="${a.id}" role="button" tabindex="0"
               aria-pressed="${a.unlocked}"
               title="Clic para ${a.unlocked ? "bloquear" : "desbloquear"}">
        <div class="ach-icon">${icon}</div>
        <div class="ach-body">
          <div class="ach-head">
            <span class="ach-title">${a.title}</span>
            <span class="ach-gs"><span class="mini-g">G</span>${a.gamerscore}</span>
          </div>
          <p class="ach-desc">${a.description}</p>
          <div class="ach-meta">
            <span class="rarity ${a.rarity}">${rarityLabel[a.rarity] || a.rarity}</span>
            <span class="status-tag">${statusText}</span>
            ${dateHtml}
          </div>
        </div>
      </article>
    `;
  }

  function render() {
    const list = ACHIEVEMENTS.filter((a) => {
      if (currentFilter === "unlocked") return a.unlocked;
      if (currentFilter === "locked") return !a.unlocked;
      return true;
    });

    grid.innerHTML = list.length
      ? list.map(cardTemplate).join("")
      : `<p style="color:var(--text-dim)">No hay logros en esta categoría.</p>`;
  }

  function updateStats(animate) {
    const total = ACHIEVEMENTS.length;
    const unlocked = ACHIEVEMENTS.filter((a) => a.unlocked);
    const earnedGs = unlocked.reduce((sum, a) => sum + a.gamerscore, 0);
    const percent = total ? Math.round((unlocked.length / total) * 100) : 0;

    const gsEl = document.getElementById("gamerscore-value");
    gsEl.textContent = earnedGs;
    document.getElementById("unlocked-count").textContent = unlocked.length;
    document.getElementById("total-count").textContent = total;
    document.getElementById("progress-percent").textContent = percent + "%";
    document.getElementById("progress-fill").style.width = percent + "%";

    if (animate) {
      gsEl.classList.remove("gs-bump");
      void gsEl.offsetWidth; // reinicia la animación
      gsEl.classList.add("gs-bump");
    }
  }

  // ---- Toggle ----------------------------------------------------------
  function toggleAchievement(id) {
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    if (!a) return;

    const wasUnlocked = a.unlocked;
    a.unlocked = !a.unlocked;
    a.date = a.unlocked ? todayStr() : "";

    saveState();
    render();
    updateStats(!wasUnlocked);

    if (!wasUnlocked) {
      showUnlockToast(a);
    }
  }

  // ---- Notificación estilo Xbox ---------------------------------------
  function showUnlockToast(a) {
    const toast = document.createElement("div");
    toast.className = "xbox-toast";
    toast.innerHTML = `
      <div class="toast-orb">
        <div class="orb-ring"></div>
        <div class="orb-core">${a.icon}</div>
        <div class="orb-flash"></div>
      </div>
      <div class="toast-text">
        <span class="toast-top">Logro desbloqueado</span>
        <span class="toast-title">${a.title}</span>
      </div>
      <div class="toast-gs"><span class="mini-g">G</span>${a.gamerscore}</div>
    `;
    toastStack.appendChild(toast);

    // dispara animación de entrada en el siguiente frame
    requestAnimationFrame(() => toast.classList.add("show"));

    // salida y limpieza
    setTimeout(() => {
      toast.classList.remove("show");
      toast.classList.add("hide");
      toast.addEventListener("transitionend", () => toast.remove(), { once: true });
    }, 4200);
  }

  // ---- Eventos ---------------------------------------------------------
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".achievement");
    if (!card) return;
    toggleAchievement(Number(card.dataset.id));
  });

  grid.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest(".achievement");
    if (!card) return;
    e.preventDefault();
    toggleAchievement(Number(card.dataset.id));
  });

  filtersBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    filtersBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });

  // ---- Init ------------------------------------------------------------
  loadState();
  updateStats(false);
  render();
})();
