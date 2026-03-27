const firebaseConfig = {
  apiKey: "AIzaSyBRHHvX9TMDsJQ8PzD7FMsq00VMUVnx_UI",
  databaseURL: "https://titan-tech-hub-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let activeOrder = null;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { document.getElementById('splash').style.display = 'none'; }, 2000);
    loadCatalog();
    loadReviews();
    startSystemUpdates();
    generateStylishQR();
});

function startSystemUpdates() {
    setInterval(() => {
        document.getElementById('live-clock').innerText = new Date().toLocaleTimeString('en-GB');
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
        
        // Dynamic Matrix Visual + Digital T Placeholder
        const matrixHTML = `
            <div class="matrix-container">
                <div class="matrix-column" style="left:20%; animation-duration:1.2s;">10110</div>
                <div class="matrix-column" style="left:50%; animation-duration:2s;">00101</div>
                <div class="matrix-column" style="left:80%; animation-duration:1.5s;">11010</div>
            </div>`;

        let visual = (item.img && item.img !== "") ? 
            `<img src="${item.img}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'; this.previousElementSibling.style.display='block';">` : 
            `<div style="display:block;">${matrixHTML}</div>`;

        grid.innerHTML += `
            <div class="item-card" onclick="selectItem('${item.name}', '${item.price}')">
                ${matrixHTML}
                <div class="visual-wrapper" style="height:120px; display:flex; align-items:center; justify-content:center;">
                    ${item.img ? `<img src="${item.img}" onerror="this.style.display='none';">` : ''}
                    <div class="titan-logo-css" style="transform:scale(0.6);"></div>
                </div>
                <div style="padding:10px; background:#000; position:relative; z-index:10;">
                    <div style="font-size:10px; height:30px; overflow:hidden; color:#ccc;">${item.name}</div>
                    <div style="color:var(--titan-red); font-weight:bold; margin-top:5px;">${item.price}</div>
                </div>
            </div>`;
    });
}

function selectItem(name, price) {
    activeOrder = { name, price };
    document.getElementById('cart-bar').classList.remove('cart-hidden');
    document.getElementById('cart-total').innerText = `REQ: ${name}`;
}

function checkout() {
    db.ref('sales').push({ name: activeOrder.name, price: activeOrder.price, time: new Date().toLocaleString() });
    const msg = `TITAN ORDER:\nItem: ${activeOrder.name}\nPrice: ${activeOrder.price}`;
    window.open(`https://wa.me/263715913665?text=${encodeURIComponent(msg)}`);
}

function switchTab(cat) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    const isV = (cat === 'VOUCHERS');
    document.getElementById('catalog-grid').style.display = isV ? 'none' : 'grid';
    document.getElementById('voucher-zone').style.display = isV ? 'block' : 'none';
    if(!isV) renderGrid(JSON.parse(localStorage.getItem('titan_data')) || {}, cat);
}

function generateStylishQR() {
    const qrImg = document.getElementById('titan-digital-qr');
    if (qrImg) {
        qrImg.src = `https://quickchart.io/qr?text=${encodeURIComponent(window.location.href)}&size=200&centerImageUrl=https://img.icons8.com/color/96/shield.png`;
    }
}

// REVIEWS SYSTEM
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
                    <div style="color:gold; font-size:10px;">${"⭐".repeat(r.stars)}</div>
                    <p style="font-size:12px; margin:5px 0;">${r.text}</p>
                    <small style="color:#555;">- ${r.name}</small>
                </div>`;
        });
    });
}
