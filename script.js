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

const grid = document.getElementById("grid");
const searchInput = document.getElementById("search");

let activeCategory = "All";


/* =========================
   SECURITY
========================= */

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================
   APP CARD
========================= */

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

    <h3>
      ${escapeHtml(app.name)}
    </h3>

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


/* =========================
   RENDER APPS
========================= */

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
      (app.tag || "")
        .toLowerCase()
        .includes(query);

    return categoryMatch && searchMatch;
  });

  grid.innerHTML = "";

  if (filteredApps.length === 0) {

    grid.innerHTML = `
      <div class="empty-state">

        <strong>
          No apps found
        </strong>

        <span>
          Try another search or category.
        </span>

      </div>
    `;

    return;
  }

  filteredApps.forEach((app) => {
    grid.appendChild(
      createAppCard(app)
    );
  });
}


/* =========================
   CATEGORY FILTER
========================= */

document
  .querySelectorAll(".category")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".category")
          .forEach((item) => {

            item.classList.remove("active");

          });

        button.classList.add("active");

        activeCategory =
          button.dataset.category ||
          button.textContent.trim();

        renderApps();
      }
    );
  });


/* =========================
   SEARCH
========================= */

if (searchInput) {

  searchInput.addEventListener(
    "input",
    renderApps
  );
}


/* =========================
   PREMIUM MOBILE MENU
========================= */

const menuBtn =
  document.querySelector(".menu-btn");

const mobileNav =
  document.querySelector(".mobile-nav");

if (menuBtn && mobileNav) {

  const overlay =
    document.createElement("div");

  overlay.className =
    "menu-overlay";

  document.body.appendChild(
    overlay
  );


  /* OPEN MENU */

  function openMenu() {

    mobileNav.classList.add("open");

    overlay.classList.add("show");

    document.body.classList.add(
      "menu-open"
    );

    menuBtn.setAttribute(
      "aria-expanded",
      "true"
    );
  }


  /* CLOSE MENU */

  function closeMenu() {

    mobileNav.classList.remove("open");

    overlay.classList.remove("show");

    document.body.classList.remove(
      "menu-open"
    );

    menuBtn.setAttribute(
      "aria-expanded",
      "false"
    );
  }


  /* MENU BUTTON */

  menuBtn.addEventListener(
    "click",
    () => {

      if (
        mobileNav.classList.contains(
          "open"
        )
      ) {

        closeMenu();

      } else {

        openMenu();

      }
    }
  );


  /* OVERLAY CLICK */

  overlay.addEventListener(
    "click",
    closeMenu
  );


  /* MENU LINK CLICK */

  mobileNav
    .querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener(
        "click",
        closeMenu
      );

    });


  /* CLOSE BUTTON */

  mobileNav.addEventListener(
    "click",
    (event) => {

      const rect =
        mobileNav.getBoundingClientRect();

      const closeArea =
        event.clientX >
          rect.right - 70 &&
        event.clientY <
          rect.top + 70;

      if (closeArea) {
        closeMenu();
      }

    }
  );


  /* ESC KEY */

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


/* =========================
   DOWNLOAD TRACKING
========================= */

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

    if (
      typeof gtag === "function"
    ) {

      gtag(
        "event",
        "download_click",
        {
          app_name: appName
        }
      );

    }
  }
);


/* =========================
   THEME BUTTON
========================= */

const themeButton =
  document.querySelector(".icon-btn");

if (themeButton) {

  themeButton.addEventListener(
    "click",
    () => {

      document.body.classList.toggle(
        "soft-mode"
      );

      themeButton.textContent =
        document.body.classList.contains(
          "soft-mode"
        )
          ? "☀️"
          : "☾";
    }
  );
}


/* =========================
   INITIAL LOAD
========================= */

renderApps();
