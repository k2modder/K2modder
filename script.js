const apps=[
{name:"K2 Demo App",cat:"App",version:"1.0",size:"12 MB",icon:"📱"},
{name:"K2 Game",cat:"Game",version:"2.1",size:"85 MB",icon:"🎮"},
{name:"K2 Tools",cat:"Tools",version:"1.4",size:"8 MB",icon:"🛠️"}
];
function render(list=apps){const g=document.getElementById("grid");g.innerHTML=list.map(a=>`<article class="card"><div class="icon">${a.icon}</div><h3>${a.name}</h3><div class="meta">${a.cat} · v${a.version} · ${a.size}</div><a class="download" href="#" onclick="alert('Add your APK file/link here.');return false">Download APK</a></article>`).join("")||'<p class="empty">No apps found.</p>'}
function filterApps(){const q=document.getElementById("search").value.toLowerCase();render(apps.filter(a=>a.name.toLowerCase().includes(q)||a.cat.toLowerCase().includes(q)))}
render();