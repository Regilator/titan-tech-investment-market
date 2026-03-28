// TITAN TECH HUB - DYNAMIC ENGINE
const firebaseConfig = {
  apiKey: "AIzaSyBRHHvX9TMDsJQ8PzD7FMsq00VMUVnx_UI",
  databaseURL: "https://titan-tech-hub-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let activeOrder = null;

// MATRIX COLOR MAP BY CATEGORY
const themeColors = {
    'HACK': '#00ff41',      // Hacker Green
    'REPAIRS': '#ff0000',   // Emergency Red
    'SOFTWARE': '#00f2ff',  // Tech Blue
    'GAMES': '#A020F0',     // Titan Purple
    'MOVIES': '#ffd700',    // Cinema Gold
    'ALL': '#00ff41'
};

document.addEventListener('DOMContentLoaded', () => {
    // Hide splash after load
    setTimeout(() => { 
        const splash = document.getElementById('splash');
        if(splash) splash.style.display = 'none'; 
    }, 2000);
    
    loadCatalog();
    startClock();
    generateQR();
});

function startClock() {
    setInterval(() => {
        const clock = document.getElementById('live-clock');
        if(clock) clock.innerText = new Date().toLocaleTimeString('en-GB');
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
    if(!grid) return;
    grid.innerHTML = "";
    
    // Update Global Matrix Color based on Tab
    const activeColor = themeColors[filter] || '#00ff41';
    document.documentElement.style.setProperty('--matrix-color', activeColor);

    Object.keys(data).forEach(id => {
        const item = data[id];
        if (filter !== 'ALL' && item.cat !== filter) return;
        
        // Matrix Rain HTML
        const matrixHTML = `
            <div class="matrix-container">
                <div class="matrix-column" style="left:15%; animation-duration:1.2s;">10101</div>
                <div class="matrix-column" style="left:50%; animation-duration:2.1s;">01101</div>
                <div class="matrix-column" style="left:85%; animation-duration:1.6s;">11001</div>
            </div>`;

        grid.innerHTML += `
            <div class="item-card" onclick="selectItem('${item.name}', '${item.price}')">
                ${matrixHTML}
                <div style="height:120px; display:flex; align-items:center; justify-content:center; background:#000; position:relative;">
                    ${item.img ? `<img src="${item.img}" style="width:100%; height:100%; object-fit:cover; position:absolute; z-index:5;" onerror="this.style.display='none';">` : ''}
                    <div class="titan-logo-css" style="transform:scale(0.5);"></div>
                </div>
                <div style="padding:10px; background:#050505; border-top:1px solid #222; position:relative; z-index:20;">
                    <div style="font-size:10px; height:25px; overflow:hidden; color:#bbb;">${item.name}</div>
                    <div style="color:var(--titan-red); font-weight:bold; margin-top:5px;">${item.price}</div>
                </div>
            </div>`;
    });
}

function switchTab(cat) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if(event) event.target.classList.add('active');
    
    const isVoucher = (cat === 'VOUCHERS');
    const grid = document.getElementById('catalog-grid');
    const vZone = document.getElementById('voucher-zone');
    
    if(grid) grid.style.display = isVoucher ? 'none' : 'grid';
    if(vZone) vZone.style.display = isVoucher ? 'block' : 'none';
    
    if(!isVoucher) {
        const cachedData = JSON.parse(localStorage.getItem('titan_data')) || {};
        renderGrid(cachedData, cat);
    }
}

function selectItem(name, price) {
    activeOrder = { name, price };
    const bar = document.getElementById('cart-bar');
    const totalDisplay = document.getElementById('cart-total');
    if(bar) bar.classList.remove('cart-hidden');
    if(totalDisplay) totalDisplay.innerText = `SELECTED: ${name}`;
}

function checkout() {
    if(!activeOrder) return;
    db.ref('sales').push({ 
        name: activeOrder.name, 
        price: activeOrder.price, 
        time: new Date().toLocaleString() 
    });
    
    const whatsappMsg = `TITAN ORDER:\n---\nItem: ${activeOrder.name}\nPrice: ${activeOrder.price}\n---\nConfirm Order?`;
    window.open(`https://wa.me/263715913665?text=${encodeURIComponent(whatsappMsg)}`);
}

function generateQR() {
    const qrImg = document.getElementById('titan-digital-qr');
    if (qrImg) {
        const siteUrl = window.location.href;
        qrImg.src = `https://quickchart.io/qr?text=${encodeURIComponent(siteUrl)}&size=200&centerImageUrl=https://img.icons8.com/color/96/shield.png`;
    }
}
