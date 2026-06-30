const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");
const year = document.querySelector("[data-year]");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (header && menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      header.classList.remove("nav-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    }
  });
}

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];

if (sections.length && navLinks.length) {
  const linkById = new Map(navLinks.map((link) => [link.getAttribute("href")?.slice(1), link]));
  const headerOffset = () => (header?.offsetHeight || 0) + 96;

  const updateActiveNav = () => {
    const currentY = window.scrollY + headerOffset();
    let activeId = sections[0].id;

    sections.forEach((section) => {
      if (section.offsetTop <= currentY) {
        activeId = section.id;
      }
    });

    navLinks.forEach((link) => link.classList.remove("is-active"));
    linkById.get(activeId)?.classList.add("is-active");
  };

  updateActiveNav();
  window.addEventListener("scroll", updateActiveNav, { passive: true });
  window.addEventListener("resize", updateActiveNav);
}

window.addEventListener("load", () => {
  const analytics = document.createElement("script");
  analytics.src = "https://static.cloudflareinsights.com/beacon.min.js";
  analytics.dataset.cfBeacon = JSON.stringify({ token: "e6acd1382fbc4f65a9bbfd2862b6fac0" });
  document.body.append(analytics);
});
