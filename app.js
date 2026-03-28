const firebaseConfig = { apiKey: "AIzaSyBRHHvX9TMDsJQ8PzD7FMsq00VMUVnx_UI", databaseURL: "https://titan-tech-hub-default-rtdb.firebaseio.com" };
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const themes = { 'HACK': '#00ff41', 'REPAIRS': '#ff0000', 'SOFTWARE': '#00f2ff', 'ALL': '#00ff41' };

document.addEventListener('DOMContentLoaded', () => {
    runBoot(); loadCatalog();
    setInterval(() => { document.getElementById('live-clock').innerText = new Date().toLocaleTimeString(); }, 1000);
});

function runBoot() {
    setTimeout(() => { document.getElementById('splash').style.display = 'none'; }, 2000);
}

function renderGrid(data, filter = 'ALL') {
    const grid = document.getElementById('catalog-grid'); grid.innerHTML = "";
    document.documentElement.style.setProperty('--matrix-color', themes[filter] || '#00ff41');
    Object.keys(data).forEach(id => {
        const item = data[id];
        if (filter !== 'ALL' && item.cat !== filter) return;
        grid.innerHTML += `<div class="item-card" onclick="selectItem('${item.name}', '${item.price}')">
            <div class="matrix-container"><div class="matrix-col">101</div></div>
            <div class="titan-logo-css logo-small"></div>
            <div style="padding:10px;"><b>${item.name}</b><br><span style="color:#B01E23">${item.price}</span></div>
        </div>`;
    });
}

function loadCatalog() { db.ref('catalog').on('value', snap => { renderGrid(snap.val() || {}); }); }
function selectItem(n, p) { 
    document.getElementById('cart-bar').classList.remove('cart-hidden');
    document.getElementById('cart-item-name').innerText = n;
    window.active = {n, p};
}
function checkout() { window.open(`https://wa.me/263715913665?text=ORDER: ${window.active.n}`); }
