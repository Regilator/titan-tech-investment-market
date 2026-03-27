const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const messaging = firebase.messaging();

let cart = [];
const WHATSAPP_LINES = ["263715913665", "263781847711"];

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { document.getElementById('splash').style.display = 'none'; }, 2800);
    updateShopStatus();
    loadCatalog();
    loadLatestAlert();
    generateBrandedQR();
    
    document.getElementById('catalog-search').addEventListener('input', (e) => {
        const activeTab = document.querySelector('.tab-btn.active').innerText;
        filterGrid(e.target.value.toLowerCase(), activeTab);
    });
});

function loadCatalog() {
    db.ref('catalog').on('value', (snapshot) => {
        const data = snapshot.val();
        const grid = document.getElementById('catalog-grid');
        if (!data) return;

        grid.innerHTML = Object.keys(data).map(id => {
            const item = data[id];
            const out = item.stock <= 0;
            let label = (item.cat === "MOVIES") ? "10 FOR $1" : (item.cat === "SERIES") ? "2 SEASONS $1" : item.price || "INQUIRE";
            const trailerBtn = item.vid ? `<button class="tab-btn" style="font-size:8px; margin-top:5px; border-color:var(--purple);" onclick="event.stopPropagation(); playTrailer('${item.vid}')">🎬 TRAILER</button>` : "";

            return `
                <div class="item-card ${out ? 'out-of-stock' : ''}" onclick="${out ? '' : `toggleCart('${item.name}', '${item.price}', '${item.cat}', this)`}">
                    ${out ? '<div class="sold-out-badge">SOLD OUT</div>' : ''}
                    <img src="${item.img}" onerror="this.src='https://via.placeholder.com/150'">
                    <div class="item-details">
                        <strong>${item.name}</strong><br>
                        <span style="color:var(--red); font-weight:bold;">${label}</span><br>
                        ${trailerBtn}
                    </div>
                </div>`;
        }).join('');
    });
}

function generateBrandedQR() {
    // Generates QR Code with Purple markers and space for your logo
    const currentURL = window.location.href;
    const qrImg = document.getElementById('digital-qr');
    qrImg.src = `https://quickchart.io/qr?text=${encodeURIComponent(currentURL)}&size=200&markerColor=%23A020F0&centerImageUrl=https://yourdomain.com/assets/titan-logo.png`;
}

function toggleCart(name, price, cat, el) {
    const idx = cart.findIndex(i => i.name === name);
    if (idx > -1) { cart.splice(idx, 1); el.classList.remove('selected'); }
    else { cart.push({ name, price, cat }); el.classList.add('selected'); }
    updateCartUI();
}

function updateCartUI() {
    const bar = document.getElementById('cart-bar');
    const isMobile = document.getElementById('mobile-service-check').checked;
    if (cart.length > 0) {
        bar.classList.remove('cart-hidden');
        let total = 0;
        let movies = cart.filter(i => i.cat === "MOVIES").length;
        let series = cart.filter(i => i.cat === "SERIES").length;
        total += Math.ceil(movies / 10) + Math.ceil(series / 2);
        cart.filter(i => !['MOVIES','SERIES'].includes(i.cat)).forEach(i => total += (parseFloat(i.price.replace('$','')) || 0));
        document.getElementById('cart-count').innerText = `${cart.length} Items`;
        document.getElementById('cart-total').innerText = isMobile ? `Est: $${total} + Travel` : `Total: $${total}`;
    } else { bar.classList.add('cart-hidden'); }
}

function checkout() {
    const isMobile = document.getElementById('mobile-service-check').checked;
    const num = confirm("Send to Admin (OK) or Tech (Cancel)?") ? WHATSAPP_LINES[0] : WHATSAPP_LINES[1];
    let list = cart.map(i => `- ${i.name}`).join('\n');
    let msg = `TITAN ORDER ⚡\n\n${list}${isMobile ? '\n\n🚀 *REQUEST MOBILE DELIVERY*' : ''}`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`);
}

function playTrailer(id) {
    document.getElementById('video-container').innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1" allow="autoplay" allowfullscreen></iframe>`;
    document.getElementById('trailer-modal').classList.remove('modal-hidden');
}

function closeTrailer() {
    document.getElementById('trailer-modal').classList.add('modal-hidden');
    document.getElementById('video-container').innerHTML = "";
}

function loadLatestAlert() {
    db.ref('latest_alert').on('value', snap => {
        if (snap.val()) document.getElementById('ticker-msg').innerText = `📢 ${snap.val().title}: ${snap.val().body} | DEALS: 10 MOVIES FOR $1...`;
    });
}

function updateShopStatus() { const h = new Date().getHours(); document.getElementById('status-light').className = (h>=8 && h<19) ? 'online' : 'offline'; document.getElementById('status-text').innerText = (h>=8 && h<19) ? 'ONLINE' : 'OFFLINE'; }
function switchTab(cat) { document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.innerText === cat)); filterGrid('', cat); }
function filterGrid(q, cat) { document.querySelectorAll('.item-card').forEach(c => { const m = c.innerText.toLowerCase().includes(q) && (cat==='ALL' || c.innerHTML.includes(cat)); c.style.display = m ? 'block' : 'none'; }); }
function openMap() { window.open("https://www.google.com/maps/search/14+28+Crescent+Warren+Park+1"); }
function clearCart() { cart = []; document.querySelectorAll('.item-card').forEach(c => c.classList.remove('selected')); updateCartUI(); }
function sendGeneralRequest() { const r = prompt("What do you need?"); if(r) window.open(`https://wa.me/${WHATSAPP_LINES[0]}?text=REQUEST: ${r}`); }
