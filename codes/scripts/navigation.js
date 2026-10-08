// Change this public setting if you choose a different Pi-hole hostname.
window.PI_DASHBOARD_NAVIGATION = window.PI_DASHBOARD_NAVIGATION || {
  homelabUrl: "https://homelab-dashboard.lab/"
};

(() => {
  const link = document.getElementById("homelab-dashboard-link");
  if (link) link.href = window.PI_DASHBOARD_NAVIGATION.homelabUrl;
})();
