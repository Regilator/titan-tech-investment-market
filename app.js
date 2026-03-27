// --- CONFIG ---
const firebaseConfig = { /* PASTE YOUR KEYS FROM FIREBASE CONSOLE */ };
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let cart = [];
const OPEN_DATE = new Date("April 1, 2026 08:00:00").getTime();

document.addEventListener('DOMContentLoaded', () => {
    // 1. Splash Logic
    setTimeout(() => { document.getElementById('splash').style.display = 'none'; }, 2800);
    
    // 2. Countdown Logic
    setInterval(updateCountdown, 1000);
    
    // 3. Data Logic
    if (!navigator.onLine) {
        document.getElementById('offline-tag').style.display = 'block';
        loadCachedCatalog();
    } else {
        loadCatalog();
    }
    
    generateQR();

    // 4. Search Filter
    document.getElementById('catalog-search').addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.item-card').forEach(card => {
            card.style.display = card.innerText.toLowerCase().includes(q) ? 'block' : 'none';
        });
    });
});

function updateCountdown() {
    const gap = OPEN_DATE - new Date().getTime();
    if (gap < 0) { document.getElementById('launch-timer').style.display = 'none'; return; }
    const d = Math.floor(gap / (1000 * 60 * 60 * 24));
    const h = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((gap % (1000 * 60)) / 1000);
    document.getElementById('countdown-clock').innerText = `${d}d ${h}h ${m}s ${s}s`;
}

function loadCatalog() {
    db.ref('catalog').on('value', snap => {
        const data = snap.val() || {};
        localStorage.setItem('titan_catalog_cache', JSON.stringify(data));
        renderGrid(data);
    });
}

function loadCachedCatalog() {
    const data = JSON.parse(localStorage.getItem('titan_catalog_cache'));
    if (data) renderGrid(data);
}

function renderGrid(data, category = 'ALL') {
    const grid = document.getElementById('catalog-grid');
    grid.innerHTML = "";
    Object.keys(data).forEach(id => {
        const item = data[id];
        if (category !== 'ALL' && item.cat !== category) return;
        
        let visual = (item.img) ? `<img src="${item.img}" onerror="this.src='https://via.placeholder.com/150?text=TITAN'">` : 
                     (item.cat === 'ENG_SUITE') ? `<div class="titan-digital-suite-icon"></div>` : 
                     `<div class="titan-logo-css" style="transform:scale(0.8); margin:45px auto;"></div>`;

        grid.innerHTML += `
            <div class="item-card" onclick="toggleCart('${item.name}', '${item.price}')">
                ${visual}
                <div style="padding:10px;">
                    <div style="font-size:11px; font-weight:bold; height:32px; overflow:hidden;">${item.name}</div>
                    <div style="color:var(--red); font-weight:bold; margin-top:5px;">${item.price}</div>
                </div>
            </div>`;
    });
}

function switchTab(cat) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.innerText.includes(cat) || (cat === 'ALL' && b.innerText === 'ALL')));
    document.getElementById('voucher-zone').style.display = (cat === 'VOUCHERS') ? 'block' : 'none';
    const data = JSON.parse(localStorage.getItem('titan_catalog_cache')) || {};
    renderGrid(data, cat);
}

function toggleCart(name, price) {
    cart = [{name, price}];
    document.getElementById('cart-bar').classList.remove('cart-hidden');
    document.getElementById('cart-total').innerText = `Total: ${price}`;
}

function checkout() {
    const msg = `TITAN ORDER: ${cart[0].name} (${cart[0].price})`;
    window.open(`https://wa.me/263715913665?text=${encodeURIComponent(msg)}`);
}

function generateQR() {
    document.getElementById('digital-qr').src = `https://quickchart.io/qr?text=${encodeURIComponent(window.location.href)}&size=100&markerColor=%23A020F0`;
}
