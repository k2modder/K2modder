const apps = [
  {
    name: "CapCut Pro",
    cat: "App",
    version: "V1.0.0",
    size: "278 MB",
    icon: '<img src="images.jpeg" alt="CapCut Pro icon" width="62" height="62" style="width:62px!important;height:62px!important;max-width:62px!important;max-height:62px!important;object-fit:cover;border-radius:15px;">',
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
  const g = document.getElementById("grid");

  g.innerHTML = list.map(a => `
    <article class="card">
      <div class="icon">${a.icon}</div>
      <div class="info">
        <h3>${a.name}</h3>
        <p>${a.cat} • v${a.version} • ${a.size}</p>
      </div>
      <a class="download" href="${a.download}" target="_blank">
        Download APK
      </a>
    </article>
  `).join("");
}

function filterApps() {
  const q = document.getElementById("search").value.toLowerCase();
  render(apps.filter(a => a.name.toLowerCase().includes(q)));
}

render();
