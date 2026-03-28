const firebaseConfig = {
    apiKey: "AIzaSyBRHHvX9TMDsJQ8PzD7FMsq00VMUVnx_UI",
    databaseURL: "https://titan-tech-hub-default-rtdb.firebaseio.com"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const categoryThemes = {
    'HACK': '#00ff41', 'REPAIRS': '#ff0000', 'SOFTWARE': '#00f2ff',
    'GAMES': '#A020F0', 'ALL': '#00ff41'
};

document.addEventListener('DOMContentLoaded', () => {
    runBootSequence();
    loadCatalog();
    setInterval(() => {
        document.getElementById('live-clock').innerText = new Date().toLocaleTimeString('en-GB');
    }, 1000);
});

function runBootSequence() {
    const lines = [
        "> INITIALIZING OMEGA_OS...",
        "> CONNECTING TO FIREBASE...",
        "> LOADING TITAN_DATABASE...",
        "> STATUS: SECURE",
        "> WELCOME, LOD OF TECH"
    ];
    let i = 0;
    const interval = setInterval(() => {
        document.getElementById('boot-text').innerText = lines[i];
        i++;
        if(i >= lines.length) {
            clearInterval(interval);
            setTimeout(() => document.getElementById('splash').style.display = 'none', 500);
        }
    }, 400);
}

function renderGrid(data, filter = 'ALL') {
    const grid = document.getElementById('catalog-grid');
    grid.innerHTML = "";
    document.documentElement.style.setProperty('--matrix-color', categoryThemes[filter] || '#00ff41');

    Object.keys(data).forEach(id => {
        const item = data[id];
        if (filter !== 'ALL' && item.cat !== filter) return;
        
        grid.innerHTML += `
            <div class="item-card" onclick="selectItem('${item.name}', '${item.price}')">
                <div class="matrix-container">
                    <div class="matrix-col" style="left:20%">101</div>
                    <div class="matrix-col" style="left:50%">011</div>
                    <div class="matrix-col" style="left:80%">110</div>
                </div>
                <div style="height:110px; display:flex; align-items:center; justify-content:center; background:#000; position:relative;">
                    ${item.img ? `<img src="${item.img}" style="width:100%;height:100%;object-fit:cover;position:absolute;z-index:5;" onerror="this.style.display='none'">` : ''}
                    <div class="titan-logo-css logo-small"></div>
                </div>
                <div style="padding:10px; background:#080808; position:relative; z-index:10;">
                    <div style="font-size:10px; color:#888;">${item.name}</div>
                    <div style="color:var(--titan-red); font-weight:bold; margin-top:5px;">${item.price}</div>
                </div>
            </div>`;
    });
}

// ADMIN & UI LOGIC
function switchTab(cat) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    const isAdmin = (cat === 'ADMIN');
    document.getElementById('catalog-grid').style.display = isAdmin ? 'none' : 'grid';
    document.getElementById('admin-portal').style.display = isAdmin ? 'block' : 'none';
    if(!isAdmin) renderGrid(JSON.parse(localStorage.getItem('titan_data')) || {}, cat);
}

function unlockAdmin() {
    if(document.getElementById('admin-pin').value === "Reggiex123x123") {
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-controls').style.display = 'block';
        db.ref('sales').on('value', snap => {
            let total = 0;
            snap.forEach(s => total += parseFloat(s.val().price.replace('$','')) || 0);
            document.getElementById('total-revenue').innerText = "$" + total.toFixed(2);
        });
    }
}

function uploadItem() {
    const name = document.getElementById('itemName').value;
    const price = document.getElementById('itemPrice').value;
    const cat = document.getElementById('itemCat').value;
    db.ref('catalog').push({ name, price, cat: cat.toUpperCase(), img: "" });
    alert("DEPLOYED");
}

function selectItem(n, p) {
    document.getElementById('cart-bar').classList.remove('cart-hidden');
    document.getElementById('cart-item-name').innerText = n;
    window.activeOrder = { n, p };
}

function checkout() {
    const msg = `TITAN ORDER: ${window.activeOrder.n} (${window.activeOrder.p})`;
    window.open(`https://wa.me/263715913665?text=${encodeURIComponent(msg)}`);
}

function loadCatalog() {
    db.ref('catalog').on('value', snap => {
        localStorage.setItem('titan_data', JSON.stringify(snap.val()));
        renderGrid(snap.val() || {});
    });
}
