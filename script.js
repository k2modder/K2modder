/* ================================
   K2MODDER STATIC APP SYSTEM
   ================================ */

const apps = [
  {
    id: 1,
    name: "CapCut Pro",
    category: "App",
    tag: "Video Editor",
    version: "1.0.0",
    size: "278 MB",
    icon: "images.jpeg",
    downloadUrl:
      "https://github.com/k2modder/K2modder/releases/download/V1.0.0/CapCut.v28.0.0.ULT.A.apk",
    isNew: true
  }
];

/* ================================
   ELEMENTS
   ================================ */

const grid = document.getElementById("grid");
const searchInput = document.getElementById("search");
const searchForm = document.getElementById("searchForm");
const emptyState = document.getElementById("emptyState");

let activeCategory = "All";

/* ================================
   SECURITY
   ================================ */

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ================================
   APP CARD
   ================================ */

function createAppCard(app) {
  const card = document.createElement("article");

  card.className = "app-card";

  card.innerHTML = `
    <div class="app-top">

      <img
        class="app-icon"
        src="${escapeHtml(app.icon)}"
        alt="${escapeHtml(app.name)} icon"
        loading="lazy"
      >

      ${
        app.isNew
          ? `<span class="badge">NEW</span>`
          : ""
      }

    </div>

    <h3>${escapeHtml(app.name)}</h3>

    <div class="meta">
      ${escapeHtml(app.version)}
      •
      ${escapeHtml(app.size)}
    </div>

    <span class="tag">
      ${escapeHtml(app.tag || app.category)}
    </span>

    <a
      class="download-btn"
      href="${escapeHtml(app.downloadUrl)}"
      target="_blank"
      rel="noopener noreferrer"
      data-app-name="${escapeHtml(app.name)}"
    >
      Download
    </a>
  `;

  return card;
}

/* ================================
   RENDER APPS
   ================================ */

function renderApps() {
  if (!grid) return;

  const query = searchInput
    ? searchInput.value.trim().toLowerCase()
    : "";

  const filteredApps = apps.filter((app) => {

    const categoryMatch =
      activeCategory === "All" ||
      app.category.toLowerCase() ===
        activeCategory.toLowerCase();

    const searchMatch =
      !query ||
      app.name.toLowerCase().includes(query) ||
      app.category.toLowerCase().includes(query) ||
      (app.tag || "").toLowerCase().includes(query);

    return categoryMatch && searchMatch;
  });

  grid.innerHTML = "";

  if (emptyState) {
  if (filteredApps.length === 0) {
    emptyState.hidden = false;
    emptyState.style.display = "flex";
  } else {
    emptyState.hidden = true;
    emptyState.style.display = "none";
  }
  }

  if (filteredApps.length === 0) {
    return;
  }

  filteredApps.forEach((app) => {
    grid.appendChild(createAppCard(app));
  });
}

/* ================================
   CATEGORY FILTER
   ================================ */

document
  .querySelectorAll(".category")
  .forEach((button) => {

    button.addEventListener("click", () => {

      document
        .querySelectorAll(".category")
        .forEach((item) => {
          item.classList.remove("active");
        });

      button.classList.add("active");

      activeCategory =
        button.dataset.category || "All";

      renderApps();

      const appsSection =
        document.getElementById("apps");

      if (appsSection) {
        appsSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });

  });

/* ================================
   SEARCH
   ================================ */

if (searchInput) {

  searchInput.addEventListener(
    "input",
    renderApps
  );

}

if (searchForm) {

  searchForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();

      renderApps();

      const appsSection =
        document.getElementById("apps");

      if (appsSection) {
        appsSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

    }
  );

}

/* ================================
   MOBILE MENU
   ================================ */

const menuBtn =
  document.querySelector(".menu-btn");

const mobileNav =
  document.querySelector(".mobile-nav");

const mobileClose =
  document.querySelector(".mobile-close");

let menuOverlay = null;

if (menuBtn && mobileNav) {

  menuOverlay =
    document.createElement("div");

  menuOverlay.className =
    "menu-overlay";

  document.body.appendChild(menuOverlay);

  function openMenu() {

    mobileNav.classList.add("open");
    menuOverlay.classList.add("show");

    document.body.classList.add(
      "menu-open"
    );

    menuBtn.setAttribute(
      "aria-expanded",
      "true"
    );
  }

  function closeMenu() {

    mobileNav.classList.remove("open");
    menuOverlay.classList.remove("show");

    document.body.classList.remove(
      "menu-open"
    );

    menuBtn.setAttribute(
      "aria-expanded",
      "false"
    );
  }

  menuBtn.addEventListener(
    "click",
    () => {

      if (
        mobileNav.classList.contains("open")
      ) {
        closeMenu();
      } else {
        openMenu();
      }

    }
  );

  if (mobileClose) {

    mobileClose.addEventListener(
      "click",
      closeMenu
    );

  }

  menuOverlay.addEventListener(
    "click",
    closeMenu
  );

  mobileNav
    .querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener(
        "click",
        closeMenu
      );

    });

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        mobileNav.classList.contains("open")
      ) {
        closeMenu();
      }

    }
  );

}

/* ================================
   SEARCH TOGGLE
   ================================ */

const searchToggle =
  document.querySelector(".search-toggle");

if (searchToggle && searchInput) {

  searchToggle.addEventListener(
    "click",
    () => {

      searchInput.focus();

      const hero =
        document.querySelector(".hero");

      if (hero) {
        hero.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

    }
  );

}

/* ================================
   THEME BUTTON
   ================================ */

const themeButton =
  document.querySelector(".theme-btn");

if (themeButton) {

  themeButton.addEventListener(
    "click",
    () => {

      document.body.classList.toggle(
        "soft-mode"
      );

      const isSoft =
        document.body.classList.contains(
          "soft-mode"
        );

      themeButton.textContent =
        isSoft ? "☀️" : "☾";

    }
  );

}

/* ================================
   DOWNLOAD ANALYTICS
   ================================ */

document.addEventListener(
  "click",
  (event) => {

    const downloadButton =
      event.target.closest(
        ".download-btn"
      );

    if (!downloadButton) return;

    const appName =
      downloadButton.dataset.appName ||
      "Unknown";

    if (typeof gtag === "function") {

      gtag("event", "download_click", {
        app_name: appName
      });

    }

  }
);

/* ================================
   BOTTOM NAVIGATION
   ================================ */

document
  .querySelectorAll(".bottom-item")
  .forEach((item) => {

    item.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".bottom-item")
          .forEach((navItem) => {
            navItem.classList.remove("active");
          });

        item.classList.add("active");

      }
    );

  });

/* ================================
   INITIAL LOAD
   ================================ */

renderApps();
