window.Dashboard = window.Dashboard || {};

window.Dashboard.clocks = (() => {
  const PLACES = [
    { name: "California", tz: "America/Los_Angeles" },
    { name: "New York", tz: "America/New_York" },
    { name: "London", tz: "Europe/London" },
    { name: "Berlin", tz: "Europe/Berlin" },
    { name: "Riyadh", tz: "Asia/Riyadh" },
    { name: "Beijing", tz: "Asia/Shanghai" },
    { name: "Tokyo", tz: "Asia/Tokyo" },
    { name: "Sydney", tz: "Australia/Sydney" }
  ];

  const WORLD_TIME_FORMATTERS = new Map(
    PLACES.map(place => [
      place.tz,
      new Intl.DateTimeFormat("en-US", {
        timeZone: place.tz,
        hour: "2-digit",
        minute: "2-digit"
      })
    ])
  );

  const HANOI_TIME_FORMATTER = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  function init() {
    buildClockCards();
    buildHanoiClock();
    updateAllClocks();
    scheduleNextMinuteUpdate();
  }

  function buildClockCards() {
    const container = document.getElementById("clocks");
    container.innerHTML = "";

    PLACES.forEach(place => {
      const card = document.createElement("div");
      card.className = "clock-card";

      const city = document.createElement("span");
      city.className = "clock-city";
      city.textContent = place.name;

      const time = document.createElement("span");
      time.className = "clock-time";
      time.dataset.tz = place.tz;

      card.appendChild(city);
      card.appendChild(time);
      container.appendChild(card);
    });
  }

  function buildHanoiClock() {
    document.getElementById("hanoi-clock").innerHTML = `
      <div><span id="hanoi-hour"></span><span class="colon">:</span><span id="hanoi-minute"></span></div>
      <div id="hanoi-date" style="font-size: 1.1rem; opacity: 0.75; margin-top: 2px;"></div>
    `;
  }

  function scheduleNextMinuteUpdate() {
    const now = new Date();
    const delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

    setTimeout(() => {
      updateAllClocks();
      scheduleNextMinuteUpdate();
    }, delay || 60000);
  }

  function updateAllClocks() {
    const now = new Date();
    updateClocks(now);
    updateHanoiClock(now);
  }

  function updateClocks(now) {
    document.querySelectorAll(".clock-time").forEach(el => {
      const formatter = WORLD_TIME_FORMATTERS.get(el.dataset.tz);
      if (formatter) setTextIfChanged(el, formatter.format(now));
    });
  }

  function updateHanoiClock(now) {
    const parts = Object.fromEntries(
      HANOI_TIME_FORMATTER.formatToParts(now)
        .filter(part => part.type !== "literal")
        .map(part => [part.type, part.value])
    );

    setTextIfChanged(document.getElementById("hanoi-hour"), parts.hour);
    setTextIfChanged(document.getElementById("hanoi-minute"), parts.minute);
    setTextIfChanged(
      document.getElementById("hanoi-date"),
      `${parts.weekday}, ${parts.day} ${parts.month} ${parts.year}`
    );
  }

  function setTextIfChanged(el, text) {
    if (el && el.textContent !== text) el.textContent = text;
  }

  return {
    init
  };
})();
