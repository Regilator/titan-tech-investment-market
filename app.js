const firebaseConfig = { apiKey: "AIzaSyBRHHvX9TMDsJQ8PzD7FMsq00VMUVnx_UI", databaseURL: "https://titan-tech-hub-default-rtdb.firebaseio.com" };
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- 1. COUNTDOWN & CLOCK ---
function runSystem() {
    const launch = new Date("April 1, 2026 00:00:00").getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const d = launch - now;
        const days = Math.floor(d / (1000 * 60 * 60 * 24));
        const hours = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById('countdown').innerText = `LAUNCHING: ${days}d ${hours}h ${mins}m`;
        document.getElementById('live-clock').innerText = new Date().toLocaleTimeString();
    }, 1000);
}

// --- 2. REPAIR TRACKER ---
function checkRepair() {
    const id = document.getElementById('job-id-input').value.toUpperCase();
    db.ref('repairs/' + id).once('value', snap => {
        const res = document.getElementById('repair-status-result');
        res.style.display = 'block';
        document.getElementById('status-text').innerText = snap.exists() ? snap.val().status : "NOT_FOUND";
    });
}

// --- 3. QR LOGIC (Ω STAMP) ---
function genQR(info) {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(info)}&color=B01E23&bgcolor=050505`;
    document.getElementById('qr-code-area').innerHTML = `
        <div style="position:relative; width:80px; height:80px; margin:auto;">
            <img src="${url}" style="width:100%; border:1px solid #B01E23;">
            <div style="position:absolute; top:35%; left:35%; background:#B01E23; color:white; width:22px; height:22px; border-radius:4px; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px; border:2px solid #050505;">Ω</div>
        </div>`;
}

// --- 4. CATALOG ---
window.active = {n: "", p: ""};
function selectItem(n, p) {
    window.active = {n, p};
    document.getElementById('selected-label').innerText = `SELECTED: ${n}`;
    document.getElementById('cart-bar').classList.remove('cart-hidden');
    genQR(`TITAN: ${n} - ${p}`);
}

function order(type) {
    const num = (type === 'ADMIN') ? '263715913665' : '263781847711';
    const msg = `🔱 *TITAN_ORDER* %0AITEM: ${window.active.n}%0APRICE: ${window.active.p}`;
    window.open(`https://wa.me/${num}?text=${msg}`);
}

function loadCatalog(filter = 'ALL') {
    db.ref('catalog').on('value', snap => {
        const grid = document.getElementById('catalog-grid'); grid.innerHTML = "";
        snap.forEach(i => {
            const item = i.val();
            if(filter !== 'ALL' && item.cat !== filter) return;
            grid.innerHTML += `<div class="item-card" onclick="selectItem('${item.name}', '${item.price}')">
                <b>${item.name}</b><br><span style="color:#B01E23">${item.price}</span>
            </div>`;
        });
    });
}

function switchTab(cat) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    loadCatalog(cat);
}

let clicks = 0;
function adminGesture() { clicks++; if(clicks === 5) window.location.href = 'admin.html'; setTimeout(()=>clicks=0, 2000); }

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => document.getElementById('splash').style.display = 'none', 3000);
    runSystem(); loadCatalog();
});
