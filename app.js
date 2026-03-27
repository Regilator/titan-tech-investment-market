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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let activeOrder = null;
const OPEN_DATE = new Date("April 1, 2026 08:00:00").getTime();

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { 
        document.getElementById('splash').style.opacity = '0';
        setTimeout(() => document.getElementById('splash').style.display = 'none', 500);
    }, 2500);
    
    setInterval(updateCountdown, 1000);
    loadCatalog();

    const qrImg = document.getElementById('titan-digital-qr');
    if(qrImg) {
        qrImg.src = `https://quickchart.io/qr?text=${encodeURIComponent(window.location.href)}&size=150&centerImageUrl=https://img.icons8.com/color/144/iron-man.png`;
    }

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
        localStorage.setItem('titan_cache', JSON.stringify(data));
        renderGrid(data);
    });
}

function renderGrid(data, filter = 'ALL') {
    const grid = document.getElementById('catalog-grid');
    grid.innerHTML = "";
    Object.keys(data).forEach(id => {
        const item = data[id];
        if (filter !== 'ALL' && item.cat !== filter) return;
        
        let imgTag = (item.img && item.img !== "") ? `<img src="${item.img}" onerror="this.src='https://via.placeholder.com/150?text=TITAN'">` : `<div class="titan-logo-css" style="transform:scale(0.7); margin:40px auto;"></div>`;

        grid.innerHTML += `
            <div class="item-card" onclick="selectItem('${item.name}', '${item.price}')">
                ${imgTag}
                <div style="padding:10px;">
                    <div style="font-size:10px; color:white; height:30px; overflow:hidden;">${item.name}</div>
                    <div style="color:red; font-weight:bold; margin-top:5px;">${item.price}</div>
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
    // 1. LOG THE SALE TO FIREBASE ADMIN
    db.ref('sales').push({
        name: activeOrder.name,
        price: activeOrder.price,
        time: new Date().toLocaleString()
    });

    // 2. SEND WHATSAPP MESSAGE
    const text = `TITAN ORDER: ${activeOrder.name} (${activeOrder.price})`;
    window.open(`https://wa.me/263715913665?text=${encodeURIComponent(text)}`);
}

function switchTab(cat) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    const isVoucher = (cat === 'VOUCHERS');
    document.getElementById('catalog-grid').style.display = isVoucher ? 'none' : 'grid';
    document.getElementById('voucher-zone').style.display = isVoucher ? 'block' : 'none';
    document.querySelector('.search-container').style.display = isVoucher ? 'none' : 'block';
    if(!isVoucher) renderGrid(JSON.parse(localStorage.getItem('titan_cache')) || {}, cat);
}

function revealVoucher() {
    const code = document.getElementById('secret-code-input').value.toUpperCase();
    db.ref('vouchers/' + code).once('value').then(snap => {
        if(snap.exists()){
            document.getElementById('voucher-pin-out').innerText = snap.val();
            document.getElementById('reveal-display').style.display = 'block';
        } else { alert("CODE NOT FOUND!"); }
    });
}

function updateCountdown() {
    const gap = OPEN_DATE - new Date().getTime();
    const d = Math.floor(gap / (1000 * 60 * 60 * 24));
    const clock = document.getElementById('countdown-clock');
    if(clock) clock.innerText = `${d}d ${Math.floor((gap % (86400000)) / 3600000)}h ${Math.floor((gap % 3600000) / 60000)}m`;
}
