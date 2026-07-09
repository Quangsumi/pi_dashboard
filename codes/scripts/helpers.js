window.Dashboard = window.Dashboard || {};

window.Dashboard.helpers = (() => {
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function fitQuoteText(quoteEl) {
    const panel = document.getElementById("left");
    const reservedPx = 80;
    const maxHeight = panel.clientHeight - reservedPx;
    if (maxHeight <= 0) return;

    const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const ceilPx = 2 * rootPx;

    let lo = 10;
    let hi = ceilPx;
    for (let i = 0; i < 12; i++) {
      const mid = (lo + hi) / 2;
      quoteEl.style.fontSize = mid + "px";
      if (quoteEl.scrollHeight <= maxHeight) lo = mid;
      else hi = mid;
    }
    quoteEl.style.fontSize = Math.floor(lo) + "px";
  }


  return {
    fitQuoteText,
    shuffleArray
  };
})();
