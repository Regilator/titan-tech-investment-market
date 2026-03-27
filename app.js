// --- TITAN TECH CONFIG (FIREBASE COMPAT) ---
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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let cartItem = null;
const OPEN_DATE = new Date("April 1, 2026 08:00:00").getTime();

document.addEventListener('DOMContentLoaded', () => {
    // 1. Hide Splash Screen (2.5s)
    setTimeout(() => { 
        const splash = document.getElementById('splash');
        if(splash) splash.style.display = 'none'; 
    }, 2500);
    
    // 2. Start Countdown
    setInterval(updateCountdown, 1000);
    
    // 3. Load Real-time Catalog
    loadCatalog();
    
    // 4. PRE-GENERATE DIGITAL QR (POINTS TO YOUR SITE URL)
    const siteUrl = window.location.href; //lodoftech.github.io/titan-tech-hub
    const qrImg = document.getElementById('titan-digital-qr');
    if(qrImg) {
        // QuickChart API creates the custom purple QR with a Titan logo
        qrImg.src = `https://quickchart.io/qr?text=${encodeURIComponent(siteUrl)}&size=150&margin=0&light=ffffff&ecLevel=Q&format=png&centerImageUrl=https://img.icons8.com/color/144/iron-man.png&markerColor=%23A020F0`;
    }

    // 5. Search Logic
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

function loadCatalog() {
    db.ref('catalog').on('value', snap => {
        const data = snap.val() || {};
        // Cache the catalog in local storage for offline use
        localStorage.setItem('titan_catalog_cache', JSON.stringify(data));
        
        // Initial render: show 'ALL' items
        renderGrid(data);
    });
}

function renderGrid(data, category = 'ALL') {
    const grid = document.getElementById('catalog-grid');
    grid.innerHTML = "";
    
    Object.keys(data).forEach(id => {
        const item = data[id];
        
        // Filter by chosen category
        if (category !== 'ALL' && item.cat !== category) return;
        
        // Use default T logo if no img provided in JSON
        let visual = (item.img && item.img !== "") ? 
                     `<img src="${item.img}" onerror="this.src='https://via.placeholder.com/150?text=TITAN'">` : 
                     `<div class="titan-logo-css" style="transform:scale(0.8); margin:45px auto;"></div>`;

        grid.innerHTML += `
            <div class="item-card" onclick="selectItemForCart('${item.name}', '${item.price}')">
                ${visual}
                <div style="padding:10px;">
                    <div style="font-size:10px; font-weight:bold; height:30px; overflow:hidden; color:white;">${item.name}</div>
                    <div style="color:#FF0000; font-weight:bold; margin-top:5px;">${item.price}</div>
                </div>
            </div>`;
    });
}

function selectItemForCart(name, price) {
    cartItem = { name, price };
    const cartBar = document.getElementById('cart-bar');
    const totalDisp = document.getElementById('cart-total');
    
    if(cartBar) cartBar.classList.remove('cart-hidden');
    if(totalDisp) totalDisp.innerText = `Order: ${name} (${price})`;
}

function checkout() {
    const msg = `TITAN ORDER: ${cartItem.name} (${cartItem.price})`;
    window.open(`https://wa.me/263715913665?text=${encodeURIComponent(msg)}`);
}

function switchTab(cat) {
    // 1. Update active tab styling
    document.querySelectorAll('.tab-btn').forEach(b => {
        const isMatch = b.innerText.includes(cat) || (cat === 'ALL' && b.innerText === 'ALL');
        b.classList.toggle('active', isMatch);
    });
    
    // 2. Hide/Show the main catalog grid
    const grid = document.getElementById('catalog-grid');
    const searchBar = document.querySelector('.search-container');
    grid.style.display = (cat === 'VOUCHERS') ? 'none' : 'grid';
    searchBar.style.display = (cat === 'VOUCHERS') ? 'none' : 'block';

    // 3. Hide/Show the new Voucher/QR Portal zone
    const voucherZone = document.getElementById('voucher-zone');
    voucherZone.style.display = (cat === 'VOUCHERS') ? 'block' : 'none';
    
    // 4. If showing regular catalog, re-render filtered list
    if (cat !== 'VOUCHERS') {
        const data = JSON.parse(localStorage.getItem('titan_catalog_cache')) || {};
        renderGrid(data, cat);
    }
}

function updateCountdown() {
    const gap = OPEN_DATE - new Date().getTime();
    const d = Math.floor(gap / (1000 * 60 * 60 * 24));
    const h = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((gap % (1000 * 60)) / 1000);
    const clock = document.getElementById('countdown-clock');
    if(clock) clock.innerText = `${d}d ${h}h ${m}m ${s}s`;
}
