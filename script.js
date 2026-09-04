const apps = [
  {
    name: "CapCut Pro",
    cat: "App",
    version: "V1.0.0",
    size: "278 MB",
    icon: '<img src="images.jpeg" alt="CapCut Pro icon">',
    download: "https://github.com/k2modder/K2modder/releases/download/V1.0.0/CapCut.v28.0.0.ULT.A.apk"
  },
  {
    name: "K2 Game",
    cat: "Game",
    version: "2.1",
    size: "85 MB",
    icon: "🎮",
    download: "#"
  },
  {
    name: "K2 Tools",
    cat: "Tools",
    version: "1.4",
    size: "8 MB",
    icon: "🛠️",
    download: "#"
  }
];

function render(list = apps) {
  const grid = document.getElementById("grid");

  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="info-box">
        <h3>No apps found</h3>
        <p>Try searching with a different name.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(app => `
    <article class="card">

      <div class="icon">
        ${app.icon}
      </div>

      <div class="info">
        <h3>${app.name}</h3>
        <p>${app.cat} • v${app.version} • ${app.size}</p>
      </div>

      ${
        app.download !== "#"
        ? `<a class="download" href="${app.download}" target="_blank" rel="noopener">
             Download APK
           </a>`
        : `<a class="download" href="#" onclick="return false;">
             Coming Soon
           </a>`
      }

    </article>
  `).join("");
}

function filterApps() {
  const search = document.getElementById("search");

  if (!search) return;

  const query = search.value.trim().toLowerCase();

  const filtered = apps.filter(app =>
    app.name.toLowerCase().includes(query) ||
    app.cat.toLowerCase().includes(query)
  );

  render(filtered);
}

render();
