window.Dashboard = window.Dashboard || {};

window.Dashboard.quotes = (() => {
  const { fitQuoteText, shuffleArray } = window.Dashboard.helpers;

  const DEFAULT_CATEGORIES = new Set(["motivation", "life"]);

  let quotes = [];
  let allCategories = [];
  let activeCategories = new Set(DEFAULT_CATEGORIES);
  let shuffledQuotes = [];
  let quoteIndex = 0;

  async function init() {
    window.addEventListener("resize", refitCurrentQuote);
    await loadQuotes();
  }

  async function loadQuotes() {
    try {
      const res = await fetch("quotes.json");
      if (!res.ok) throw new Error("quotes.json fetch failed: " + res.status);

      const data = await res.json();
      quotes = data.flatMap(group =>
        group.quotes.map(content => ({ category: group.category, content }))
      );

      buildCategoryFilters();
      rebuildQuotePool(false);
      show();
    } catch (err) {
      console.error("Could not load quotes.json:", err);
    }
  }

  function buildCategoryFilters() {
    allCategories = [...new Set(quotes.map(q => q.category).filter(Boolean))];
    activeCategories = new Set(allCategories.filter(cat => DEFAULT_CATEGORIES.has(cat)));
    if (activeCategories.size === 0 && allCategories.length > 0) activeCategories.add(allCategories[0]);

    const bar = document.getElementById("category-filters");
    bar.innerHTML = "";

    allCategories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "cat-btn" + (activeCategories.has(cat) ? " active" : "");
      btn.textContent = cat;
      btn.dataset.cat = cat;
      btn.addEventListener("click", () => toggleCategory(cat, btn));
      bar.appendChild(btn);
    });
  }

  function toggleCategory(cat, btn) {
    const isActive = activeCategories.has(cat);
    if (isActive && activeCategories.size === 1) return;

    if (isActive) {
      activeCategories.delete(cat);
      btn.classList.remove("active");
    } else {
      activeCategories.add(cat);
      btn.classList.add("active");
    }

    rebuildQuotePool(true);
  }

  function rebuildQuotePool(showImmediately) {
    const filtered = quotes.filter(q => activeCategories.has(q.category));
    shuffledQuotes = shuffleArray(filtered);
    quoteIndex = 0;
    updateDots();
    if (showImmediately) show();
  }

  function show() {
    const quoteElement = document.getElementById("quote");
    const currentQuote = shuffledQuotes[quoteIndex];
    if (!quoteElement || !currentQuote) return;

    quoteElement.classList.remove("visible");

    setTimeout(() => {
      quoteElement.innerHTML = currentQuote.content;
      fitQuoteText(quoteElement);
      requestAnimationFrame(() => quoteElement.classList.add("visible"));
    }, 300);

    quoteIndex = (quoteIndex + 1) % shuffledQuotes.length;
    updateDots();
  }

  function updateDots() {
    const el = document.getElementById("quote-dots");
    if (!el) return;

    if (shuffledQuotes.length === 0) {
      el.textContent = "0 / 0";
      return;
    }

    const current = quoteIndex === 0 ? shuffledQuotes.length : quoteIndex;
    el.textContent = current + " / " + shuffledQuotes.length;
  }

  function refitCurrentQuote() {
    const quote = document.getElementById("quote");
    if (quote.innerHTML) fitQuoteText(quote);
  }

  return {
    init,
    show
  };
})();
