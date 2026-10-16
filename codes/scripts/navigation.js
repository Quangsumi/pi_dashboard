// Change this public setting if you choose a different Pi-hole hostname.
// parentOrigins allowlists pages that may frame this dashboard; only listed
// kiosk shells get to receive postMessage requests from inside the frame.
window.PI_DASHBOARD_NAVIGATION = window.PI_DASHBOARD_NAVIGATION || {
  homelabUrl: "https://homelab-dashboard.lab/",
  parentOrigins: ["https://homelab-dashboard.lab"],
};

(() => {
  const link = document.getElementById("homelab-dashboard-link");
  if (link) link.href = window.PI_DASHBOARD_NAVIGATION.homelabUrl;
  if (window.parent === window) return; // Standalone tab: ordinary navigation.
  // Inside the Homelab kiosk this page runs fullscreen in an iframe; navigating
  // the frame itself would strand it, so ask the shell to reveal its dashboard.
  const parentOrigin = new URLSearchParams(window.location.search).get("parent");
  if (
    !parentOrigin ||
    !window.PI_DASHBOARD_NAVIGATION.parentOrigins.includes(parentOrigin)
  )
    return;
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.parent.postMessage(
      { source: "pi-dashboard", kind: "show-homelab" },
      parentOrigin,
    );
  });
})();
