// --- TITAN TECH CONFIG (LOADED BY LOD OF TECH) ---
const firebaseConfig = {
  apiKey: "AIzaSyBRHHvX9TMDsJQ8PzD7FMsq00VMUVnx_UI",
  authDomain: "titan-tech-hub.firebaseapp.com",
  projectId: "titan-tech-hub",
  storageBucket: "titan-tech-hub.firebasestorage.app",
  messagingSenderId: "1003188296562",
  appId: "1:1003188296562:web:6422ed2f8938561bed1beb",
  measurementId: "G-6D5M6B8FBF",
  databaseURL: "https://titan-tech-hub-default-rtdb.firebaseio.com" 
};

// Initialize Firebase (Compat Mode)
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let cart = [];
// Launch Date: April 1, 2026
const OPEN_DATE = new Date("April 1, 2026 08:00:00").getTime();

document.addEventListener('DOMContentLoaded', () => {
    // 1. Splash Screen Logic (2.8s delay)
    setTimeout(() => { 
        const splash = document.getElementById('splash');
        if(splash) splash.style.display = 'none'; 
    }, 2800);
    
    // 2. Countdown Timer
    setInterval(updateCountdown, 1000);
    
    // 3. Data Loading (Online/Offline)
    if (!navigator.onLine) {
        const offlineTag = document.getElementById('offline-tag');
        if(offlineTag) offlineTag.style.display = 'block';
        loadCachedCatalog();
    } else {
        loadCatalog();
    }
    
    generateQR();

    // 4. Real-time Search
    const searchInput = document.getElementById('catalog-search');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase();
            document.querySelectorAll('.item-card').forEach(card => {
                const name = card.innerText.toLowerCase();
                card.style.display = name.includes(q) ? 'block' : 'none';
            });
        });
    }
});

function updateCountdown() {
    const now = new Date().getTime();
    const gap = OPEN_DATE - now;
    const timerElem = document.getElementById('launch-timer');
    
    if (gap < 0) { 
        if(timerElem) timerElem.style.display = 'none'; 
        return; 
    }
    
    const d = Math.floor(gap / (1000 * 60 * 60 * 24));
    const h = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((gap % (1000 * 60)) / 1000);
    
    const clock = document.getElementById('countdown-clock');
    if(clock) clock.innerText = `${d}d ${h}h ${m}m ${s}s`;
}

function loadCatalog() {
    // Listens for changes in Firebase and updates the UI instantly
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
    if(!grid) return;
    grid.innerHTML = "";
    
    Object.keys(data).forEach(id => {
        const item = data[id];
        // Filter by category if one is selected
        if (category !== 'ALL' && item.cat !== category) return;
        
        let visual = (item.img && item.img !== "") ? 
                     `<img src="${item.img}" onerror="this.src='https://via.placeholder.com/150?text=TITAN'">` : 
                     `<div class="titan-logo-css" style="transform:scale(0.8); margin:45px auto;"></div>`;

        grid.innerHTML += `
            <div class="item-card" onclick="toggleCart('${item.name}', '${item.price}')">
                ${visual}
                <div style="padding:10px;">
                    <div style="font-size:11px; font-weight:bold; height:32px; overflow:hidden; color:white;">${item.name}</div>
                    <div style="color:#FF0000; font-weight:bold; margin-top:5px;">${item.price}</div>
                </div>
            </div>`;
    });
}

function switchTab(cat) {
    document.querySelectorAll('.tab-btn').forEach(b => {
        const isMatch = b.innerText.includes(cat) || (cat === 'ALL' && b.innerText === 'ALL');
        b.classList.toggle('active', isMatch);
    });
    
    const vZone = document.getElementById('voucher-zone');
    if(vZone) vZone.style.display = (cat === 'VOUCHERS') ? 'block' : 'none';
    
    const data = JSON.parse(localStorage.getItem('titan_catalog_cache')) || {};
    renderGrid(data, cat);
}

function toggleCart(name, price) {
    cart = [{name, price}];
    const cartBar = document.getElementById('cart-bar');
    const totalDisp = document.getElementById('cart-total');
    if(cartBar) cartBar.classList.remove('cart-hidden');
    if(totalDisp) totalDisp.innerText = `Total: ${price}`;
}

function checkout() {
    // Opens WhatsApp to your specific number with the order details
    const msg = `TITAN ORDER: ${cart[0].name} (${cart[0].price})`;
    window.open(`https://wa.me/263715913665?text=${encodeURIComponent(msg)}`);
}

function generateQR() {
    const url = window.location.href;
    const qrElem = document.getElementById('digital-qr');
    if(qrElem) qrElem.src = `https://quickchart.io/qr?text=${encodeURIComponent(url)}&size=100&markerColor=%23A020F0`;
}
