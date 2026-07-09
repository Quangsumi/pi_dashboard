window.Dashboard = window.Dashboard || {};

window.Dashboard.media = (() => {
  const { shuffleArray } = window.Dashboard.helpers;

  const MEDIA_PATH = "../media/";

  let shuffledMedia = [];
  let mediaIndex = 0;
  let revealToken = 0;

  async function init() {
    await loadFromFolder();
  }

  async function loadFromFolder() {
    try {
      const res = await fetch(MEDIA_PATH);
      if (!res.ok) throw new Error("Media folder fetch failed: " + res.status);

      const listingText = await res.text();
      const loaded = parseMediaListing(listingText);
      if (loaded.length === 0) throw new Error("No media files found in " + MEDIA_PATH);

      shuffledMedia = shuffleArray(loaded);
      console.log(`Loaded ${shuffledMedia.length} local media files`);
      show();
    } catch (err) {
      console.error("Could not load local media folder:", err);
    }
  }

  function parseMediaListing(listingText) {
    const fileNames = parseJsonMediaListing(listingText) || parseHtmlMediaListing(listingText);
    const seen = new Set();

    return fileNames
      .filter(fileName => fileName && !seen.has(fileName) && seen.add(fileName))
      .map(mediaItemFromFileName);
  }

  function parseJsonMediaListing(listingText) {
    try {
      const entries = JSON.parse(listingText);
      if (!Array.isArray(entries)) return null;
      return entries
        .filter(entry => entry && (!entry.type || entry.type === "file"))
        .map(entry => entry.name)
        .filter(Boolean);
    } catch (e) {
      return null;
    }
  }

  function parseHtmlMediaListing(listingText) {
    const doc = new DOMParser().parseFromString(listingText, "text/html");
    return [...doc.querySelectorAll("a[href]")]
      .map(link => fileNameFromMediaHref(link.getAttribute("href")))
      .filter(Boolean);
  }

  function fileNameFromMediaHref(href) {
    if (!href || href.startsWith("#")) return "";

    let mediaUrl;
    let linkUrl;
    try {
      mediaUrl = new URL(MEDIA_PATH, window.location.href);
      linkUrl = new URL(href, mediaUrl);
    } catch (e) {
      return "";
    }

    if (linkUrl.origin !== mediaUrl.origin) return "";

    const mediaPath = mediaUrl.pathname.endsWith("/") ? mediaUrl.pathname : mediaUrl.pathname + "/";
    const mediaFolderName = mediaPath.split("/").filter(Boolean).pop();
    const cleanHrefParts = href.split(/[?#]/)[0].split("/").filter(part => part && part !== ".");
    if (cleanHrefParts.length === 1 && cleanHrefParts[0] === mediaFolderName) return "";
    if (linkUrl.pathname === mediaPath || linkUrl.pathname === mediaPath.slice(0, -1)) return "";
    if (!linkUrl.pathname.startsWith(mediaPath)) return "";

    const relativePath = linkUrl.pathname.slice(mediaPath.length);
    if (!relativePath || relativePath.endsWith("/") || relativePath.includes("/")) return "";

    try {
      return decodeURIComponent(relativePath);
    } catch (e) {
      return relativePath;
    }
  }

  function mediaItemFromFileName(fileName) {
    const lowerName = fileName.toLowerCase();
    let clockPosition = "top";
    if (lowerName.startsWith("center")) clockPosition = "center";
    else if (lowerName.startsWith("bottom")) clockPosition = "bottom";

    return {
      url: MEDIA_PATH + encodeURIComponent(fileName),
      clockPosition
    };
  }

  function show(attempts = 0) {
    if (shuffledMedia.length === 0) return;
    if (attempts >= shuffledMedia.length) {
      console.warn("No playable media found in local media folder");
      return;
    }

    const currentItem = shuffledMedia[mediaIndex];
    mediaIndex = (mediaIndex + 1) % shuffledMedia.length;
    const token = ++revealToken;

    updateClockPosition(currentItem.clockPosition);
    revealWith(currentItem, token, attempts);
  }

  function updateClockPosition(clockPosition) {
    const clockElement = document.getElementById("hanoi-clock");
    clockElement.classList.remove("clock-top", "clock-center", "clock-bottom");
    clockElement.classList.add(`clock-${clockPosition}`);
  }

  function revealWith(item, token, attempts) {
    tryShowImage(item.url, token).catch(() => {
      if (token !== revealToken) return;
      tryShowVideo(item.url, token, attempts);
    });
  }

  function tryShowImage(src, token) {
    return new Promise((resolve, reject) => {
      const vid = document.getElementById("randomVideo");
      const imgActive = document.getElementById("randomImage");
      const imgNext = document.getElementById("randomImageNext");

      imgNext.onload = () => {
        if (token !== revealToken) return resolve();

        vid.classList.remove("active");
        vid.pause();
        vid.src = "";

        imgNext.classList.add("active");
        imgActive.classList.remove("active");
        imgActive.id = "randomImageNext";
        imgNext.id = "randomImage";
        resolve();
      };

      imgNext.onerror = () => {
        if (token !== revealToken) return resolve();
        reject(new Error("Not an image"));
      };

      imgNext.src = src;
    });
  }

  function tryShowVideo(src, token, attempts) {
    const imgA = document.getElementById("randomImage");
    const imgB = document.getElementById("randomImageNext");
    const vid = document.getElementById("randomVideo");

    const cleanup = () => {
      vid.onloadeddata = null;
      vid.onerror = null;
    };

    vid.onloadeddata = () => {
      if (token !== revealToken) {
        cleanup();
        return;
      }

      imgA.classList.remove("active");
      imgB.classList.remove("active");
      vid.classList.add("active");
      vid.play().catch(() => {});
      cleanup();
    };

    vid.onerror = () => {
      cleanup();
      if (token === revealToken) {
        console.warn("Skipping unsupported media:", src);
        show(attempts + 1);
      }
    };

    vid.classList.remove("active");
    vid.pause();
    vid.src = src;
    vid.load();
  }

  return {
    init,
    parseMediaListing,
    show
  };
})();
