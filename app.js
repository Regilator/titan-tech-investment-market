const firebaseConfig = {
  apiKey: "AIzaSyBRHHvX9TMDsJQ8PzD7FMsq00VMUVnx_UI",
  databaseURL: "https://titan-tech-hub-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let activeOrder = null;

document.addEventListener('DOMContentLoaded', () => {
    // Hide splash
    setTimeout(() => { document.getElementById('splash').style.opacity = '0'; 
    setTimeout(() => document.getElementById('splash').style.display = 'none', 500); }, 2000);

    loadCatalog();
    generateQR();

    // Search
    document.getElementById('catalog-search').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.item-card').forEach(card => {
            card.style.display = card.innerText.toLowerCase().includes(term) ? 'block' : 'none';
        });
    });
});

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

        // Correctly handle the images you uploaded
        // If the path is assets/movies/pic.png, it will try to find it.
        // If it fails, it shows the Red T logo instead!
        let visual = (item.img && item.img !== "") ? 
            `<img src="${item.img}" onerror="this.outerHTML='<div class=\'titan-logo-css\' style=\'transform:scale(0.6); margin:35px auto;\'></div>'">` : 
            `<div class="titan-logo-css" style="transform:scale(0.6); margin:35px auto;"></div>`;

        grid.innerHTML += `
            <div class="item-card" onclick="selectItem('${item.name}', '${item.price}')">
                ${visual}
                <div style="padding:10px;">
                    <div style="font-size:10px; height:30px; overflow:hidden;">${item.name}</div>
                    <div style="color:#FF0000; font-weight:bold; margin-top:5px;">${item.price}</div>
                </div>
            </div>`;
    });
}

function selectItem(name, price) {
    activeOrder = { name, price };
    document.getElementById('cart-bar').classList.remove('cart-hidden');
    document.getElementById('cart-total').innerText = `Order: ${name}`;
}

function checkout() {
    db.ref('sales').push({ name: activeOrder.name, price: activeOrder.price, time: new Date().toLocaleString() });
    window.open(`https://wa.me/263715913665?text=TITAN+ORDER:+${encodeURIComponent(activeOrder.name)}+(${activeOrder.price})`);
}

function switchTab(cat) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.innerText.includes(cat) || (cat==='ALL' && b.innerText==='ALL')));
    const isV = (cat === 'VOUCHERS');
    document.getElementById('catalog-grid').style.display = isV ? 'none' : 'grid';
    document.getElementById('voucher-zone').style.display = isV ? 'block' : 'none';
    if(!isV) renderGrid(JSON.parse(localStorage.getItem('titan_data')) || {}, cat);
}

function generateQR() {
    const qr = document.getElementById('titan-digital-qr');
    if(qr) qr.src = `https://quickchart.io/qr?text=${encodeURIComponent(window.location.href)}&size=150&centerImageUrl=https://img.icons8.com/color/96/shield.png`;
}

function revealVoucher() {
    const code = document.getElementById('secret-code-input').value.toUpperCase();
    db.ref('vouchers/' + code).once('value').then(snap => {
        if(snap.exists()){
            document.getElementById('voucher-pin-out').innerText = snap.val();
            document.getElementById('reveal-display').style.display = 'block';
        } else { alert("CODE EXPIRED OR INVALID"); }
    });
}
