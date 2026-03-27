const firebaseConfig = {
  apiKey: "AIzaSyBRHHvX9TMDsJQ8PzD7FMsq00VMUVnx_UI",
  databaseURL: "https://titan-tech-hub-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let activeOrder = null;

const OPEN_DATE = new Date("April 1, 2026 08:00:00").getTime();

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { document.getElementById('splash').style.display = 'none'; }, 2000);
    
    loadCatalog();
    startClocks();
    generateQR();

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
        
        // Dynamic path system + fallback to Red T Logo
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

function generateQR() {
    const qrImg = document.getElementById('titan-digital-qr');
    if (qrImg) {
        const currentUrl = window.location.href;
        qrImg.src = `https://quickchart.io/qr?text=${encodeURIComponent(currentUrl)}&size=150&centerImageUrl=https://img.icons8.com/color/96/shield.png`;
    }
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
