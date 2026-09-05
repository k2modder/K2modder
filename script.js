const SUPABASE_URL =
  "https://mcjsihyrkzrkvkufvkif.supabase.co";

/*
  यहाँ वही Supabase PUBLISHABLE KEY डालो
  जो तुमने admin/dashboard.html में इस्तेमाल की है।

  Service-role / secret key मत डालना।
*/
const SUPABASE_KEY =
  "sb_publishable_rJ3XzXGztJJcf5c_wUG9FA_lZAsqlvf";


const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


const grid = document.getElementById("grid");
const search = document.getElementById("search");


function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function renderApps(apps) {

  if (!grid) return;


  if (!apps || apps.length === 0) {

    grid.innerHTML = `
      <div class="info-box">
        <h3>No apps found</h3>
        <p>Try searching with a different name.</p>
      </div>
    `;

    return;
  }


  grid.innerHTML = apps.map(function(app) {

    const icon = app.icon_url
      ? `
        <img
          src="${escapeHtml(app.icon_url)}"
          alt="${escapeHtml(app.name)}"
          loading="lazy">
      `
      : "📱";


    const downloadButton = app.download_url
      ? `
        <a
          class="download"
          href="${escapeHtml(app.download_url)}"
          target="_blank"
          rel="noopener noreferrer">
          Download
        </a>
      `
      : `
        <span class="download">
          Coming Soon
        </span>
      `;


    return `
      <article class="card">

        <div class="icon">
          ${icon}
        </div>

        <div class="info">

          <h3>
            ${escapeHtml(app.name)}
          </h3>

          <p>
            ${escapeHtml(app.category)}
            • v${escapeHtml(app.version)}
            • ${escapeHtml(app.size)}
          </p>

        </div>

        ${downloadButton}

      </article>
    `;

  }).join("");
}



async function loadApps() {

  if (!grid) return;


  grid.innerHTML = `
    <div class="info-box">
      <h3>Loading apps...</h3>
      <p>Please wait.</p>
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

    console.error(error);

    grid.innerHTML = `
      <div class="info-box">
        <h3>Unable to load apps</h3>
        <p>Please try again later.</p>
      </div>
    `;

    return;
  }


  window.allApps = data || [];

  renderApps(window.allApps);
}



function filterApps() {

  const query =
    search
      ? search.value.trim().toLowerCase()
      : "";


  const filtered =
    (window.allApps || []).filter(function(app) {

      return (
        String(app.name || "")
          .toLowerCase()
          .includes(query)

        ||

        String(app.category || "")
          .toLowerCase()
          .includes(query)
      );

    });


  renderApps(filtered);
}



if (search) {

  search.addEventListener(
    "input",
    filterApps
  );

}


loadApps();
