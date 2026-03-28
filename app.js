const firebaseConfig = { apiKey: "AIzaSyBRHHvX9TMDsJQ8PzD7FMsq00VMUVnx_UI", databaseURL: "https://titan-tech-hub-default-rtdb.firebaseio.com" };
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- 1. BOOT & COUNTDOWN ---
function runSystem() {
    const launch = new Date("April 1, 2026 00:00:00").getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const d = launch - now;
        const days = Math.floor(d / (1000 * 60 * 60 * 24));
        const hours = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById('countdown').innerText = `LAUNCHING: ${days}d ${hours}h ${mins}m`;
    }, 1000);
}

// --- 2. REPAIR TRACKER ---
function checkRepair() {
    const id = document.getElementById('job-id-input').value.toUpperCase();
    const result = document.getElementById('repair-status-result');
    const text = document.getElementById('status-text');
    
    db.ref('repairs/' + id).once('value', snap => {
        result.style.display = 'block';
        if(snap.exists()) {
            text.innerText = snap.val().status;
            text.style.color = snap.val().status.includes('READY') ? '#00ff41' : '#B01E23';
        } else { text.innerText = "JOB_ID_NOT_FOUND"; text.style.color = "#444"; }
    });
}

// --- 3. QR GENERATOR (Ω EMBED) ---
function genQR(info) {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(info)}&color=B01E23&bgcolor=050505`;
    document.getElementById('qr-code-area').innerHTML = `
        <div style="position:relative; width:80px; height:80px; margin:auto;">
            <img src="${url}" style="width:100%; border:1px solid #B01E23;">
            <div style="position:absolute; top:35%; left:35%; background:#B01E23; color:white; width:24px; height:24px; border-radius:4px; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:14px; border:2px solid #050505;">Ω</div>
        </div>`;
}

// --- 4. CATALOG & SEARCH ---
window.active = {n: "", p: ""};
function selectItem(n, p) {
    window.active = {n, p};
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
                <div class="card-info"><b>${item.name}</b><br><span style="color:#B01E23">${item.price}</span></div>
            </div>`;
        });
    });
}

function switchTab(cat) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    loadCatalog(cat);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => document.getElementById('splash').style.display = 'none', 3000);
    runSystem();
    loadCatalog();
    setInterval(() => document.getElementById('live-clock').innerText = new Date().toLocaleTimeString(), 1000);
});