const SUPABASE_URL =
  "https://mcjsihyrkzrkvkufvkif.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_rJ3XzXGztJJcf5c_wUG9FA_lZAsqlvf";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

const grid = document.getElementById("grid");
const search = document.getElementById("search");

window.allApps = [];
window.activeCategory = "All";


/* =========================
   SECURITY
========================= */

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* =========================
   CATEGORY FILTER
========================= */

function createCategoryFilter() {

  if (!grid || !grid.parentNode) return;

  const oldFilter =
    document.getElementById("category-filter");

  if (oldFilter) {
    oldFilter.remove();
  }

  const categories = [
    "All",
    ...new Set(
      window.allApps
        .map(app =>
          String(app.category || "").trim()
        )
        .filter(Boolean)
    )
  ];

  const filterBox =
    document.createElement("div");

  filterBox.id = "category-filter";
  filterBox.className = "category-filter";

  filterBox.innerHTML =
    categories.map(function(category) {

      const active =
        category === window.activeCategory
          ? "active"
          : "";

      return `
        <button
          type="button"
          class="category-btn ${active}"
          data-category="${escapeHtml(category)}">
          ${escapeHtml(category)}
        </button>
      `;

    }).join("");

  grid.parentNode.insertBefore(
    filterBox,
    grid
  );

  filterBox
    .querySelectorAll(".category-btn")
    .forEach(function(button) {

      button.addEventListener(
        "click",
        function() {

          window.activeCategory =
            button.dataset.category;

          filterBox
            .querySelectorAll(".category-btn")
            .forEach(function(btn) {
              btn.classList.remove("active");
            });

          button.classList.add("active");

          filterApps();
        }
      );
    });
}


/* =========================
   APP CARD
========================= */

function createAppCard(app) {

  const name =
    escapeHtml(app.name || "Unnamed App");

  const category =
    escapeHtml(app.category || "App");

  const version =
    escapeHtml(app.version || "N/A");

  const size =
    escapeHtml(app.size || "Unknown");

  let icon;

  if (app.icon_url) {

    icon = `
      <img
        src="${escapeHtml(app.icon_url)}"
        alt="${name} icon"
        loading="lazy"
        onerror="
          this.style.display='none';
          this.parentElement.classList.add('icon-fallback');
        "
      >
    `;

  } else {

    icon = `
      <span class="icon-fallback">
        📱
      </span>
    `;
  }


  let downloadButton;

  if (app.download_url) {

    downloadButton = `
      <a
        class="download"
        href="${escapeHtml(app.download_url)}"
        target="_blank"
        rel="noopener noreferrer"
        data-app-name="${name}"
      >
        Download
      </a>
    `;

  } else {

    downloadButton = `
      <span class="download disabled">
        Coming Soon
      </span>
    `;
  }


  return `
    <article class="card">

      <div class="icon">
        ${icon}
      </div>

      <div class="info">

        <span class="app-category">
          ${category}
        </span>

        <h3>
          ${name}
        </h3>

        <p>
          Version ${version}
          <span>•</span>
          ${size}
        </p>

      </div>

      <div class="card-action">
        ${downloadButton}
      </div>

    </article>
  `;
}


/* =========================
   RENDER APPS
========================= */

function renderApps(apps) {

  if (!grid) return;

  if (!apps || apps.length === 0) {

    grid.innerHTML = `
      <div class="info-box">
        <h3>No apps found</h3>

        <p>
          Try another search or choose
          a different category.
        </p>
      </div>
    `;

    return;
  }

  grid.innerHTML =
    apps
      .map(createAppCard)
      .join("");

  setupDownloadTracking();
}


/* =========================
   DOWNLOAD TRACKING
========================= */

function setupDownloadTracking() {

  document
    .querySelectorAll(
      ".download[data-app-name]"
    )
    .forEach(function(button) {

      button.addEventListener(
        "click",
        function() {

          const appName =
            button.dataset.appName;

          console.log(
            "Download clicked:",
            appName
          );

        }
      );
    });
}


/* =========================
   LOAD APPS
========================= */

async function loadApps() {

  if (!grid) return;

  grid.innerHTML = `
    <div class="info-box">
      <h3>Loading apps...</h3>

      <p>
        Please wait.
      </p>
    </div>
  `;

  const {
    data,
    error
  } = await supabaseClient
    .from("apps")
    .select("*")
    .order("created_at", {
      ascending: false
    });


  if (error) {

    console.error(
      "Supabase error:",
      error
    );

    grid.innerHTML = `
      <div class="info-box">
        <h3>Unable to load apps</h3>

        <p>
          Please refresh the page
          and try again.
        </p>
      </div>
    `;

    return;
  }


  window.allApps =
    data || [];

  createCategoryFilter();

  filterApps();
}


/* =========================
   SEARCH + FILTER
========================= */

function filterApps() {

  const query =
    search
      ? search.value
          .trim()
          .toLowerCase()
      : "";


  const filtered =
    window.allApps.filter(
      function(app) {

        const name =
          String(app.name || "")
            .toLowerCase();

        const category =
          String(app.category || "")
            .toLowerCase();


        const matchesSearch =
          !query ||
          name.includes(query) ||
          category.includes(query);


        const matchesCategory =
          window.activeCategory === "All" ||
          String(app.category || "") ===
            window.activeCategory;


        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );


  renderApps(filtered);
}


/* =========================
   SEARCH EVENTS
========================= */

if (search) {

  search.addEventListener(
    "input",
    filterApps
  );
}


/* =========================
   START
========================= */

loadApps();
