  // quotes.json — edit that file to add/remove/change quotes, no need to touch script.js
  let quotes = [];

//#region quotes + images

  // GitHub API: auto-fetch image list from repo folder.
  // clockPosition is read from the filename prefix: top_, center_, or bottom_.
  // Add new images by dropping them in the repo with the right prefix — no code changes needed.
  const GITHUB_API_URL = "https://api.github.com/repos/Quangsumi/pi_dashboard/contents/images";
  const RAW_BASE       = "https://raw.githubusercontent.com/Quangsumi/pi_dashboard/main/images/";
  const IMAGE_EXTS     = new Set(["gif", "webp", "jpg", "jpeg", "png"]);
  const VIDEO_EXTS     = new Set(["mp4", "webm", "mov", "ogg"]);

  let shuffledImages = [];
  let imageIndex = 0;

  const MEDIA_LIST_KEY = "pi_dashboard_media_list";

  async function loadImagesFromGitHub() {
    try {
      const res = await fetch(GITHUB_API_URL);
      if (!res.ok) throw new Error("GitHub API error: " + res.status);
      const files = await res.json();

      const loaded = files
        .filter(f => {
          const ext = f.name.split('.').pop().toLowerCase();
          return f.type === "file" && (IMAGE_EXTS.has(ext) || VIDEO_EXTS.has(ext));
        })
        .map(f => {
          const name = f.name.toLowerCase();
          let clockPosition = "top";
          if (name.startsWith("center")) clockPosition = "center";
          else if (name.startsWith("bottom")) clockPosition = "bottom";
          const ext = f.name.split('.').pop().toLowerCase();
          const isVideo = VIDEO_EXTS.has(ext);
          return { url: f.download_url, clockPosition, isVideo };
        });

      if (loaded.length === 0) throw new Error("No media found in repo");

      // Save list to localStorage so we can survive future network failures
      try {
        localStorage.setItem(MEDIA_LIST_KEY, JSON.stringify(loaded));
      } catch (e) {
        console.warn("localStorage unavailable, skipping save:", e);
      }

      shuffledImages = shuffleArray(loaded);
      console.log(`✅ Loaded ${shuffledImages.length} media files from GitHub`);
      cacheImages(shuffledImages);
      showImage();

    } catch (err) {
      console.error("❌ GitHub fetch failed:", err);

      // Fall back to last known list from localStorage
      try {
        const saved = localStorage.getItem(MEDIA_LIST_KEY);
        if (saved) {
          const loaded = JSON.parse(saved);
          shuffledImages = shuffleArray(loaded);
          console.log(`⚠️ Using cached media list (${shuffledImages.length} files) from localStorage`);
          showImage(); // files themselves are in Cache API already
        } else {
          console.error("❌ No fallback media list in localStorage — nothing to show");
        }
      } catch (e) {
        console.error("❌ localStorage read failed:", e);
      }
    }
  }

  // ── Category filter ──────────────────────────────────
  let allCategories = [];
  let activeCategories = new Set();

  function buildCategoryFilters() {
    // Derive categories now that quotes are loaded
    allCategories = [...new Set(quotes.map(q => q.category).filter(Boolean))];
    activeCategories = new Set(allCategories);
    const bar = document.getElementById("category-filters");
    bar.innerHTML = "";
    allCategories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "cat-btn active";
      btn.textContent = cat;
      btn.dataset.cat = cat;
      btn.addEventListener("click", () => {
        const isActive = activeCategories.has(cat);
        if (isActive && activeCategories.size === 1) return; // keep at least one on
        if (isActive) {
          activeCategories.delete(cat);
          btn.classList.remove("active");
        } else {
          activeCategories.add(cat);
          btn.classList.add("active");
        }
        rebuildQuotePool();
      });
      bar.appendChild(btn);
    });
  }

  function rebuildQuotePool() {
    const filtered = quotes.filter(q => activeCategories.has(q.category));
    shuffledQuotes = shuffleArray(filtered);
    quoteIndex = 0;
    updateDots();
    showQuote(); // immediately show a quote from the new pool
  }

  let shuffledQuotes = shuffleArray([...quotes]);
  let quoteIndex = 0;

  function buildDots() {
    updateDots();
  }

  function updateDots() {
    const el = document.getElementById("quote-dots");
    const current = (quoteIndex === 0 ? shuffledQuotes.length : quoteIndex);
    el.textContent = current + " / " + shuffledQuotes.length;
  }

  // Load quotes from external file, then boot the quote system
  fetch('quotes.json')
    .then(res => {
      if (!res.ok) throw new Error("quotes.json fetch failed: " + res.status);
      return res.json();
    })
    .then(data => {
      // Flatten grouped format [{category, quotes:[...]}] into [{category, content}, ...]
      quotes = data.flatMap(group =>
        group.quotes.map(content => ({ category: group.category, content }))
      );
      buildCategoryFilters();
      shuffledQuotes = shuffleArray([...quotes]);
      showQuote();
      buildDots();
    })
    .catch(err => {
      console.error("❌ Could not load quotes.json:", err);
    });

  loadImagesFromGitHub();

  setInterval(() => { randomTheme(); showQuote(); showImage(); }, 600000);     // every 10 min

  document.getElementById("nextArrow").addEventListener("click", refreshContent);

  function showQuote() {
    const quoteElement = document.getElementById("quote");
    const currentQuote = shuffledQuotes[quoteIndex];

    quoteElement.classList.remove("visible");

    setTimeout(() => {
      quoteElement.innerHTML = currentQuote.content;
      fitQuoteText(quoteElement);
      requestAnimationFrame(() => quoteElement.classList.add("visible"));
    }, 300);

    quoteIndex = (quoteIndex + 1) % shuffledQuotes.length;
    updateDots();
  }

  function showImage() {
    const clockElement = document.getElementById("hanoi-clock");
    const currentItem  = shuffledImages[imageIndex];
    const { url, clockPosition, isVideo } = currentItem;

    function revealWith(src) {
      if (isVideo) {
        // Hide both img elements, show and play the video
        const imgA = document.getElementById("randomImage");
        const imgB = document.getElementById("randomImageNext");
        const vid  = document.getElementById("randomVideo");

        imgA.classList.remove("active");
        imgB.classList.remove("active");

        vid.src = src;
        vid.classList.add("active");
        vid.load();
        vid.play().catch(() => {}); // suppress autoplay errors
      } else {
        // Hide video, crossfade between the two img elements
        const vid     = document.getElementById("randomVideo");
        vid.classList.remove("active");
        vid.pause();
        vid.src = "";

        const imgActive = document.getElementById("randomImage");
        const imgNext   = document.getElementById("randomImageNext");

        imgNext.src = src;
        imgNext.onload = () => {
          imgNext.classList.add("active");
          imgActive.classList.remove("active");
          imgActive.id = "randomImageNext";
          imgNext.id   = "randomImage";
        };
      }
    }

    if (!('caches' in window)) {
      revealWith(url);
    } else {
      caches.open('image-cache-v1')
        .then(cache => cache.match(url))
        .then(response => {
          if (response) {
            return response.blob().then(blob => revealWith(URL.createObjectURL(blob)));
          } else {
            revealWith(url);
          }
        })
        .catch(() => revealWith(url));
    }

    clockElement.classList.remove("clock-top", "clock-center", "clock-bottom");
    clockElement.classList.add(`clock-${clockPosition}`);
    imageIndex = (imageIndex + 1) % shuffledImages.length;
  }

  function fitQuoteText(quoteEl) {
    const panel = document.getElementById('left');
    const reservedPx = 80; // top category label + bottom counter
    const maxHeight = panel.clientHeight - reservedPx;
    if (maxHeight <= 0) return;

    const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const ceilPx = 2 * rootPx; // 2rem ceiling

    // Binary search: largest font size where quote fits panel height
    let lo = 10, hi = ceilPx;
    for (let i = 0; i < 12; i++) {
      const mid = (lo + hi) / 2;
      quoteEl.style.fontSize = mid + "px";
      if (quoteEl.scrollHeight <= maxHeight) lo = mid; else hi = mid;
    }
    quoteEl.style.fontSize = Math.floor(lo) + "px";
  }

  function refreshContent() {
    randomTheme();
    showQuote();
    showImage();
  }

  // Re-fit quote text if window is resized
  window.addEventListener('resize', () => {
    const quote = document.getElementById('quote');
    if (quote.innerHTML) fitQuoteText(quote);
  });

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  async function cacheImages(imageList) {
    if (!('caches' in window)) return;
    const cache = await caches.open("image-cache-v1");
    let total = 0;
    for (const item of imageList) {
      const url = item.url;
      const match = await cache.match(url);
      if (!match) {
        const response = await fetch(url).catch(err => { console.warn("❌ Fetch failed:", url, err); return null; });
        if (response && response.ok) {
          await cache.put(url, response.clone());
          total++;
          console.log(`Cached (${item.isVideo ? "video" : "image"}):`, url);
        }
      }
      // Slightly longer delay for videos to avoid hammering on a Pi
      await new Promise(res => setTimeout(res, item.isVideo ? 2000 : 1000));
    }
    console.log(`✅ Total media cached: ${total}`);
  }

//#endregion

//#region World clocks
  const places = [
    { name: "California", tz: "America/Los_Angeles" },
    { name: "New York",   tz: "America/New_York" },
    { name: "London",     tz: "Europe/London" },
    { name: "Berlin",     tz: "Europe/Berlin" },
    { name: "Riyadh",     tz: "Asia/Riyadh" },
    { name: "Beijing",    tz: "Asia/Shanghai" },
    { name: "Tokyo",      tz: "Asia/Tokyo" },
    { name: "Sydney",     tz: "Australia/Sydney" }
  ];

  // Build clock cards once — only update time text each tick
  function buildClockCards() {
    const container = document.getElementById("clocks");
    container.innerHTML = "";
    places.forEach(place => {
      const card = document.createElement("div");
      card.className = "clock-card";

      const city = document.createElement("span");
      city.className = "clock-city";
      city.textContent = place.name;

      const time = document.createElement("span");
      time.className = "clock-time";
      time.dataset.tz = place.tz; // store tz for tick updates

      card.appendChild(city);
      card.appendChild(time);
      container.appendChild(card);
    });
  }

  function updateClocks() {
    const now = new Date();
    document.querySelectorAll(".clock-time").forEach(el => {
      el.textContent = now.toLocaleTimeString("en-US", {
        timeZone: el.dataset.tz,
        hour: "2-digit",
        minute: "2-digit"
      });
    });
  }

  buildClockCards();
  updateClocks();
  updateHanoiClock();
  setInterval(updateClocks, 1000);
  setInterval(updateHanoiClock, 1000);

  function updateHanoiClock() {
    const now = new Date();
    const options = {
      timeZone: "Asia/Bangkok",
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    };

    const formatted = new Intl.DateTimeFormat("en-GB", options).format(now);
    const parts = formatted.split(", ");
    const timePart = parts.length === 3 ? parts[2] : "";
    const datePart = parts.length === 3 ? `${parts[0]}, ${parts[1]}` : formatted;

    // Build time with blinking colon
    const timeFmt = timePart.replace(/:/g, (m, offset, str) => {
      // only blink first colon (between HH and MM)
      return `<span class="colon">:</span>`;
    }).replace(/<span class="colon">:<\/span>/, (m, i) => m); // keep all

    // Actually just format HH:MM with blink on colon, ignore seconds display
    const [hh, mm] = timePart.split(":").slice(0, 2);
    const timeHTML = `${hh}<span class="colon">:</span>${mm}`;

    document.getElementById("hanoi-clock").innerHTML = `
      <div>${timeHTML}</div>
      <div style="font-size: 1.1rem; opacity: 0.75; margin-top: 2px;">${datePart}</div>
    `;
  }
//#endregion

//#region Theme
  const themes = [
    "amber", "glass", "ink",
    "forest", "rose", "slate",
    "dusk", "copper", "arctic", "ember"
  ];

  let currentThemeIndex = 0;

  function applyTheme(name) {
    document.documentElement.setAttribute("data-theme", name);
  }

  function randomTheme() {
    // Pick a different theme from the current one
    let next;
    do { next = Math.floor(Math.random() * themes.length); } while (next === currentThemeIndex);
    currentThemeIndex = next;
    applyTheme(themes[currentThemeIndex]);
  }

  // Shuffle button — bottom-left of center panel
  document.getElementById("themeShuffleBtn").addEventListener("click", randomTheme);

  // Dim button — toggles a dark overlay over the whole dashboard
  const dimBtn     = document.getElementById("dimBtn");
  const dimOverlay = document.getElementById("dim-overlay");

  dimBtn.addEventListener("click", () => {
    const isDimmed = dimOverlay.classList.toggle("active");
    dimBtn.classList.toggle("active", isDimmed);
  });

  // Auto-change theme whenever content refreshes
  // (hooked into refreshContent which fires on arrow click, quote timer, image timer)
//#endregion

