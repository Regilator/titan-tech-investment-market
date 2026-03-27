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
let activeItem = null;

const OPEN_DATE = new Date("April 1, 2026 08:00:00").getTime();

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { document.getElementById('splash').style.display = 'none'; }, 2500);
    setInterval(updateCountdown, 1000);
    loadCatalog();
});

function loadCatalog() {
    db.ref('catalog').on('value', snap => {
        const data = snap.val() || {};
        renderGrid(data);
    });
}

function renderGrid(data, cat = 'ALL') {
    const grid = document.getElementById('catalog-grid');
    grid.innerHTML = "";
    Object.keys(data).forEach(id => {
        const item = data[id];
        if (cat !== 'ALL' && item.cat !== cat) return;
        
        const img = item.img || "https://via.placeholder.com/150?text=TITAN";
        grid.innerHTML += `
            <div class="item-card" onclick="selectItem('${item.name}', '${item.price}')">
                <img src="${img}">
                <div style="padding:10px;">
                    <div style="font-size:10px; color:white; height:30px;">${item.name}</div>
                    <div style="color:red; font-weight:bold;">${item.price}</div>
                </div>
            </div>`;
    });
}

function selectItem(name, price) {
    activeItem = {name, price};
    document.getElementById('cart-bar').classList.remove('cart-hidden');
    document.getElementById('cart-total').innerText = `Total: ${price}`;
}

function checkout() {
    const msg = `TITAN ORDER: ${activeItem.name} (${activeItem.price})`;
    window.open(`https://wa.me/263715913665?text=${encodeURIComponent(msg)}`);
}

function switchTab(cat) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    db.ref('catalog').once('value', snap => renderGrid(snap.val(), cat));
}

function updateCountdown() {
    const gap = OPEN_DATE - new Date().getTime();
    const d = Math.floor(gap / (1000 * 60 * 60 * 24));
    const h = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((gap % (1000 * 60)) / 1000);
    document.getElementById('countdown-clock').innerText = `${d}d ${h}h ${m}m ${s}s`;
}
