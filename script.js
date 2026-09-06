/* =========================================
   K2MODDER - MAIN JAVASCRIPT
========================================= */


/* =========================================
   APP DATA
========================================= */

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


/* =========================================
   ELEMENTS
========================================= */

const grid = document.getElementById("grid");
const searchInput = document.getElementById("search");

let activeCategory = "All";


/* =========================================
   SECURITY
========================================= */

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================================
   APP CARD
========================================= */

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


/* =========================================
   RENDER APPS
========================================= */

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
        <strong>No apps found</strong>
        <span>Try another search or category.</span>
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


/* =========================================
   CATEGORY FILTER
========================================= */

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
        button.dataset.category ||
        button.textContent.trim();

      renderApps();

    });

  });


/* =========================================
   SEARCH
========================================= */

if (searchInput) {

  searchInput.addEventListener(
    "input",
    renderApps
  );

}


/* =========================================
   MOBILE MENU
   NEW DRAWER SYSTEM
========================================= */

(function setupMobileMenu() {

  const menuButton =
    document.querySelector(".menu-btn");

  const oldMobileNav =
    document.querySelector(".mobile-nav");

  if (!menuButton) return;


  /* ---------------------------------------
     Hide old menu system
  --------------------------------------- */

  if (oldMobileNav) {

    oldMobileNav.style.display = "none";

    oldMobileNav.classList.remove("open");

  }


  /* ---------------------------------------
     Prevent duplicate menu
  --------------------------------------- */

  const existingDrawer =
    document.getElementById("k2-mobile-drawer");

  if (existingDrawer) {
    existingDrawer.remove();
  }

  const existingOverlay =
    document.getElementById("k2-menu-overlay");

  if (existingOverlay) {
    existingOverlay.remove();
  }


  /* ---------------------------------------
     Create overlay
  --------------------------------------- */

  const overlay =
    document.createElement("div");

  overlay.id =
    "k2-menu-overlay";


  Object.assign(overlay.style, {

    position: "fixed",

    inset: "0",

    width: "100%",

    height: "100%",

    background: "rgba(0,0,0,0.65)",

    backdropFilter: "blur(4px)",

    WebkitBackdropFilter: "blur(4px)",

    opacity: "0",

    visibility: "hidden",

    pointerEvents: "none",

    transition: "opacity 0.28s ease",

    zIndex: "9990"

  });


  document.body.appendChild(overlay);


  /* ---------------------------------------
     Create drawer
  --------------------------------------- */

  const drawer =
    document.createElement("aside");

  drawer.id =
    "k2-mobile-drawer";

  drawer.setAttribute(
    "aria-hidden",
    "true"
  );


  Object.assign(drawer.style, {

    position: "fixed",

    top: "0",

    right: "0",

    width: "min(320px, 84vw)",

    height: "100vh",

    background:
      "linear-gradient(160deg, #0b1f3d 0%, #050d1b 100%)",

    borderLeft:
      "1px solid #287cff",

    boxShadow:
      "-20px 0 70px rgba(0,0,0,0.75)",

    zIndex: "9999",

    transform:
      "translateX(105%)",

    transition:
      "transform 0.3s cubic-bezier(.4,0,.2,1)",

    overflowY: "auto",

    overflowX: "hidden",

    padding:
      "28px 18px 30px",

    boxSizing: "border-box"

  });


  /* ---------------------------------------
     Drawer header
  --------------------------------------- */

  const drawerHeader =
    document.createElement("div");

  Object.assign(drawerHeader.style, {

    display: "flex",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: "28px"

  });


  const drawerTitle =
    document.createElement("div");

  drawerTitle.textContent =
    "K2MODDER";

  Object.assign(drawerTitle.style, {

    color: "#ffffff",

    fontSize: "21px",

    fontWeight: "900",

    letterSpacing: "0.5px"

  });


  const closeButton =
    document.createElement("button");

  closeButton.type = "button";

  closeButton.textContent = "×";

  closeButton.setAttribute(
    "aria-label",
    "Close menu"
  );


  Object.assign(closeButton.style, {

    width: "42px",

    height: "42px",

    borderRadius: "50%",

    border: "1px solid #315985",

    background: "#0d2442",

    color: "#ffffff",

    fontSize: "29px",

    lineHeight: "1",

    cursor: "pointer",

    display: "grid",

    placeItems: "center"

  });


  drawerHeader.appendChild(
    drawerTitle
  );

  drawerHeader.appendChild(
    closeButton
  );

  drawer.appendChild(
    drawerHeader
  );


  /* ---------------------------------------
     Menu label
  --------------------------------------- */

  const menuLabel =
    document.createElement("div");

  menuLabel.textContent =
    "MENU";

  Object.assign(menuLabel.style, {

    color: "#6eaaff",

    fontSize: "11px",

    fontWeight: "800",

    letterSpacing: "2px",

    marginBottom: "12px"

  });

  drawer.appendChild(menuLabel);


  /* ---------------------------------------
     Menu links
  --------------------------------------- */

  const links = [
    {
      text: "Home",
      href: "index.html"
    },
    {
      text: "Apps",
      href: "#apps"
    },
    {
      text: "Games",
      href: "#games"
    },
    {
      text: "About",
      href: "about.html"
    },
    {
      text: "Privacy",
      href: "privacy.html"
    },
    {
      text: "Contact",
      href: "contact.html"
    },
    {
      text: "Admin",
      href: "admin/"
    }
  ];


  links.forEach((item) => {

    const link =
      document.createElement("a");

    link.href = item.href;

    link.textContent = item.text;


    Object.assign(link.style, {

      display: "flex",

      alignItems: "center",

      minHeight: "54px",

      width: "100%",

      boxSizing: "border-box",

      padding: "0 17px",

      marginBottom: "10px",

      borderRadius: "14px",

      border: "1px solid #193b63",

      background: "#081a31",

      color: "#d2def0",

      textDecoration: "none",

      fontSize: "16px",

      fontWeight: "700",

      transition:
        "background .2s ease, border-color .2s ease"

    });


    link.addEventListener(
      "touchstart",
      () => {
        link.style.background =
          "#12345e";

        link.style.borderColor =
          "#3185ff";
      },
      { passive: true }
    );


    link.addEventListener(
      "click",
      () => {
        closeMenu();
      }
    );


    drawer.appendChild(link);

  });


  /* ---------------------------------------
     Add drawer
  --------------------------------------- */

  document.body.appendChild(drawer);


  /* ---------------------------------------
     Open menu
  --------------------------------------- */

  function openMenu() {

    drawer.style.transform =
      "translateX(0)";

    overlay.style.opacity =
      "1";

    overlay.style.visibility =
      "visible";

    overlay.style.pointerEvents =
      "auto";

    drawer.setAttribute(
      "aria-hidden",
      "false"
    );

    menuButton.setAttribute(
      "aria-expanded",
      "true"
    );

    document.body.style.overflow =
      "hidden";
  }


  /* ---------------------------------------
     Close menu
  --------------------------------------- */

  function closeMenu() {

    drawer.style.transform =
      "translateX(105%)";

    overlay.style.opacity =
      "0";

    overlay.style.visibility =
      "hidden";

    overlay.style.pointerEvents =
      "none";

    drawer.setAttribute(
      "aria-hidden",
      "true"
    );

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

    document.body.style.overflow =
      "";
  }


  /* ---------------------------------------
     Menu button
  --------------------------------------- */

  menuButton.addEventListener(
    "click",
    (event) => {

      event.preventDefault();

      const isOpen =
        drawer.getAttribute(
          "aria-hidden"
        ) === "false";

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }

    }
  );


  /* ---------------------------------------
     Overlay
  --------------------------------------- */

  overlay.addEventListener(
    "click",
    closeMenu
  );


  /* ---------------------------------------
     Close button
  --------------------------------------- */

  closeButton.addEventListener(
    "click",
    closeMenu
  );


  /* ---------------------------------------
     ESC
  --------------------------------------- */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        drawer.getAttribute(
          "aria-hidden"
        ) === "false"
      ) {

        closeMenu();

      }

    }
  );


})();


/* =========================================
   DOWNLOAD TRACKING
========================================= */

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


/* =========================================
   THEME BUTTON
========================================= */

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


/* =========================================
   INITIAL LOAD
========================================= */

renderApps();
