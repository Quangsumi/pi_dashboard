window.Dashboard = window.Dashboard || {};

window.Dashboard.theme = (() => {
  const THEMES = [
    "amber", "glass", "ink",
    "forest", "rose", "slate",
    "dusk", "copper", "arctic", "ember"
  ];

  let currentThemeIndex = 0;

  function init() {
    document.getElementById("themeShuffleBtn").addEventListener("click", random);

    const dimBtn = document.getElementById("dimBtn");
    const dimOverlay = document.getElementById("dim-overlay");

    dimBtn.addEventListener("click", () => {
      const isDimmed = dimOverlay.classList.toggle("active");
      dimBtn.classList.toggle("active", isDimmed);
    });
  }

  function apply(name) {
    document.documentElement.setAttribute("data-theme", name);
  }

  function random() {
    let next;
    do {
      next = Math.floor(Math.random() * THEMES.length);
    } while (next === currentThemeIndex);

    currentThemeIndex = next;
    apply(THEMES[currentThemeIndex]);
  }

  return {
    init,
    random
  };
})();
