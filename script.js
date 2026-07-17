const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");
const year = document.querySelector("[data-year]");

document.documentElement.classList.add("js");

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

const scrollToHashTarget = () => {
  if (!window.location.hash || window.location.hash.length < 2) {
    return;
  }

  const target = document.querySelector(window.location.hash);

  if (target) {
    window.requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    window.setTimeout(() => target.scrollIntoView({ block: "start" }), 100);
  }
};

scrollToHashTarget();
window.addEventListener("DOMContentLoaded", scrollToHashTarget);
window.addEventListener("load", scrollToHashTarget);
window.addEventListener("hashchange", scrollToHashTarget);

const accordion = document.querySelector("[data-accordion]");

if (accordion) {
  const cards = [...accordion.querySelectorAll(".partner-card")];
  const triggers = [...accordion.querySelectorAll("[data-accordion-trigger]")];

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const card = trigger.closest(".partner-card");

      cards.forEach((item) => {
        const isCurrent = item === card;
        item.classList.toggle("is-open", isCurrent);
        item.querySelector("[data-accordion-trigger]")?.setAttribute("aria-expanded", String(isCurrent));
      });
    });
  });
}

const readinessCheck = document.querySelector("[data-readiness-check]");

if (readinessCheck) {
  const result = readinessCheck.querySelector("[data-readiness-result]");
  const resultCopy = {
    early: {
      label: "Early Interest",
      text:
        "The opportunity has attention, but the institutional deployment path remains under-formed. The next step is not broader promotion. It is clarification of the use case, ownership, mandate, and decision path.",
    },
    structuring: {
      label: "Structuring Required",
      text:
        "Several important elements are emerging, but further structuring is required before significant commitment. Focus on unresolved ownership, approval, risk, and post-pilot responsibility.",
    },
    emerging: {
      label: "Deployment Path Emerging",
      text:
        "The opportunity has identifiable institutional evidence, ownership, and decision logic. The next commitment should still be bounded, explicit, and linked to clear progression criteria.",
    },
  };

  const updateReadinessResult = () => {
    const selected = [...readinessCheck.querySelectorAll("input[type='radio']:checked")];
    const yesCount = selected.filter((input) => input.value === "yes").length;

    if (!selected.length) {
      result.innerHTML =
        '<p class="result-label">Answer the questions to see the diagnostic result.</p><p>No answers are submitted, stored, or used for tracking.</p>';
      return;
    }

    const state = yesCount <= 2 ? resultCopy.early : yesCount <= 5 ? resultCopy.structuring : resultCopy.emerging;
    result.innerHTML = `<p class="result-label">${state.label}</p><p>${state.text}</p>`;
  };

  readinessCheck.addEventListener("change", updateReadinessResult);
  readinessCheck.addEventListener("reset", () => {
    window.setTimeout(updateReadinessResult, 0);
  });
}

const analysisToggle = document.querySelector("[data-analysis-toggle]");
const analysisBody = document.querySelector("#full-analysis-body");
const analysisContents = document.querySelector(".article-contents");

if (analysisToggle && analysisBody) {
  const setAnalysisOpen = (isOpen) => {
    analysisToggle.setAttribute("aria-expanded", String(isOpen));
    analysisToggle.textContent = isOpen ? "Collapse full analysis" : "Read the full analysis";
    analysisBody.hidden = !isOpen;
  };

  analysisToggle.addEventListener("click", () => {
    const isOpen = analysisToggle.getAttribute("aria-expanded") === "true";
    setAnalysisOpen(!isOpen);
  });

  analysisContents?.addEventListener("click", (event) => {
    const link = event.target instanceof HTMLAnchorElement ? event.target : null;

    if (!link || !link.hash) {
      return;
    }

    if (analysisBody.hidden) {
      event.preventDefault();
      setAnalysisOpen(true);
      document.querySelector(link.hash)?.scrollIntoView({ block: "start" });
    }
  });
}

const printButton = document.querySelector("[data-print-button]");

if (printButton) {
  printButton.addEventListener("click", () => {
    document.documentElement.dataset.printRequested = "true";
    window.print();
  });
}

window.addEventListener("load", () => {
  const analytics = document.createElement("script");
  analytics.src = "https://static.cloudflareinsights.com/beacon.min.js";
  analytics.dataset.cfBeacon = JSON.stringify({ token: "e6acd1382fbc4f65a9bbfd2862b6fac0" });
  document.body.append(analytics);
});
