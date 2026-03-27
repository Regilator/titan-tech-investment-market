const firebaseConfig = {
  apiKey: "AIzaSyBRHHvX9TMDsJQ8PzD7FMsq00VMUVnx_UI",
  databaseURL: "https://titan-tech-hub-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let activeOrder = null;

// COUNTDOWN TO APRIL 1, 2026
const OPEN_DATE = new Date("April 1, 2026 08:00:00").getTime();

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { document.getElementById('splash').style.display = 'none'; }, 2000);
    
    loadCatalog();
    loadReviews();
    startClocks();
    generateStylishQR();

    document.getElementById('catalog-search').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.item-card').forEach(card => {
            card.style.display = card.innerText.toLowerCase().includes(term) ? 'block' : 'none';
        });
    });
});

function startClocks() {
    const liveClock = document.getElementById('live-clock');
    const countdownClock = document.getElementById('countdown-clock');

    setInterval(() => {
        const now = new Date();
        liveClock.innerText = now.toLocaleTimeString('en-GB');

        const diff = OPEN_DATE - now.getTime();
        if (diff > 0) {
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            countdownClock.innerText = `${d}d ${h}h ${m}m ${s}s`;
        } else {
            countdownClock.innerText = "WE ARE LIVE!";
        }
    }, 1000);
}

function generateStylishQR() {
    const qrImg = document.getElementById('titan-digital-qr');
    if (qrImg) {
        const currentUrl = window.location.href;
        // Stylish QR with Round Dots and a Shield/Logo Icon in the center
        const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(currentUrl)}&size=200&dark=000000&light=ffffff&ecLevel=H&centerImageUrl=https://img.icons8.com/color/96/shield.png&margin=1`;
        qrImg.src = qrUrl;
    }
}

function loadCatalog() {
    db.ref('catalog').on('value', snap => {
        const data = snap.val() || {};
        localStorage.setItem('titan_data', JSON.stringify(data));
        renderGrid(data);
    });
}

function renderGrid(data, filter = 'ALL') {
    const grid = document.getElementById('catalog-grid');
    grid.innerHTML = "";
    Object.keys(data).forEach(id => {
        const item = data[id];
        if (filter !== 'ALL' && item.cat !== filter) return;
        
        let visual = (item.img && item.img !== "") ? 
            `<img src="${item.img}" onerror="this.outerHTML='<div class=\'titan-logo-css\' style=\'transform:scale(0.5); margin:35px auto;\'></div>'">` : 
            `<div class="titan-logo-css" style="transform:scale(0.5); margin:35px auto;"></div>`;

        grid.innerHTML += `
            <div class="item-card" onclick="selectItem('${item.name}', '${item.price}')">
                ${visual}
                <div style="padding:10px;">
                    <div style="font-size:10px; height:30px; overflow:hidden;">${item.name}</div>
                    <div style="color:var(--titan-red); font-weight:bold; margin-top:5px;">${item.price}</div>
                </div>
            </div>`;
    });
}

// REVIEWS LOGIC
function submitReview() {
    const name = document.getElementById('revName').value;
    const stars = document.getElementById('revStars').value;
    const text = document.getElementById('revText').value;
    if(!name || !text) return;

    db.ref('pending_reviews').push({ name, stars, text, date: new Date().toLocaleDateString() })
    .then(() => {
        document.getElementById('revStatus').innerText = "Review Sent! ✅";
        document.getElementById('revName').value = ""; document.getElementById('revText').value = "";
    });
}

function loadReviews() {
    db.ref('reviews').on('value', snap => {
        const display = document.getElementById('reviews-display');
        display.innerHTML = "";
        const data = snap.val();
        if(!data) return;
        Object.keys(data).forEach(id => {
            const r = data[id];
            display.innerHTML += `
                <div style="background:#111; padding:10px; border-radius:8px; margin-bottom:10px; border-left:3px solid var(--titan-purple);">
                    <div style="color:gold;">${"⭐".repeat(r.stars)}</div>
                    <div style="font-size:12px; margin:5px 0;">"${r.text}"</div>
                    <small style="color:#555;">- ${r.name}</small>
                </div>`;
        });
    });
}

function selectItem(name, price) {
    activeOrder = { name, price };
    document.getElementById('cart-bar').classList.remove('cart-hidden');
    document.getElementById('cart-total').innerText = `Order: ${name}`;
}

function checkout() {
    db.ref('sales').push({ name: activeOrder.name, price: activeOrder.price, time: new Date().toLocaleString() });
    window.open(`https://wa.me/263715913665?text=TITAN+ORDER:+${encodeURIComponent(activeOrder.name)}`);
}

function switchTab(cat) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    const isV = (cat === 'VOUCHERS');
    document.getElementById('catalog-grid').style.display = isV ? 'none' : 'grid';
    document.getElementById('voucher-zone').style.display = isV ? 'block' : 'none';
    document.getElementById('reviews-section').style.display = isV ? 'none' : 'block';
    if(!isV) renderGrid(JSON.parse(localStorage.getItem('titan_data')) || {}, cat);
}

function revealVoucher() {
    const code = document.getElementById('secret-code-input').value.toUpperCase();
    db.ref('vouchers/' + code).once('value').then(snap => {
        if(snap.exists()){
            document.getElementById('voucher-pin-out').innerText = snap.val();
            document.getElementById('reveal-display').style.display = 'block';
        } else { alert("INVALID CODE"); }
    });
}
