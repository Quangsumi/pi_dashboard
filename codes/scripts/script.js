(() => {
  const { clocks, media, quotes, theme } = window.Dashboard;

  const CONTENT_REFRESH_MS = 10 * 60 * 1000;
  const PAGE_RELOAD_MS = 3 * 60 * 60 * 1000;

  function refreshContent() {
    theme.random();
    quotes.show();
    media.show();
  }

  function init() {
    theme.init();
    clocks.init();
    quotes.init();
    media.init();

    document.getElementById("nextArrow").addEventListener("click", refreshContent);
    setInterval(refreshContent, CONTENT_REFRESH_MS);
    setTimeout(() => location.reload(), PAGE_RELOAD_MS);
  }

  init();
})();
