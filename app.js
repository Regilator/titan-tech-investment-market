let cart = [];
const WHATSAPP_LINES = ["263715913665", "263781847711"];

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { document.getElementById('splash').style.display = 'none'; }, 2800);
    updateShopStatus();
    loadCatalog();
    generateBrandedQR();
    
    document.getElementById('catalog-search').addEventListener('input', (e) => {
        const activeTab = document.querySelector('.tab-btn.active').innerText;
        filterGrid(e.target.value.toLowerCase(), activeTab);
    });
});

function updateShopStatus() {
    const hours = new Date().getHours();
    const light = document.getElementById('status-light');
    const text = document.getElementById('status-text');
    if (hours >= 8 && hours < 19) {
        light.className = 'online'; text.innerText = 'ONLINE';
    } else {
        light.className = 'offline'; text.innerText = 'OFFLINE';
    }
}

async function loadCatalog() {
    try {
        const res = await fetch('catalog.txt');
        const text = await res.text();
        const grid = document.getElementById('catalog-grid');
        grid.innerHTML = text.split('\n').filter(l => l.includes('|')).map(line => {
            const [name, price, img, cat] = line.split('|').map(s => s.trim());
            let label = (cat === "MOVIES") ? "10 FOR $1" : (cat === "SERIES" || cat === "TV SHOWS") ? "2 SEASONS $1" : (cat === "GAMES") ? "BY SIZE" : price;
            return `
                <div class="item-card" data-name="${name.toLowerCase()}" data-cat="${cat.toUpperCase()}" onclick="toggleCart('${name}', '${price}', '${cat}', this)">
                    <img src="${img}" onerror="this.src='https://via.placeholder.com/150'">
                    <div class="item-details">
                        <strong>${name}</strong><br>
                        <span style="color:var(--red);">${label}</span>
                    </div>
                </div>`;
        }).join('');
    } catch (e) { console.log("Catalog Error"); }
}

function toggleCart(name, price, cat, el) {
    const idx = cart.findIndex(i => i.name === name);
    if (idx > -1) {
        cart.splice(idx, 1);
        el.classList.remove('selected');
    } else {
        cart.push({ name, price, cat });
        el.classList.add('selected');
    }
    updateCartUI();
}

function updateCartUI() {
    const bar = document.getElementById('cart-bar');
    const count = document.getElementById('cart-count');
    const totalDisp = document.getElementById('cart-total');
    const isMobile = document.getElementById('mobile-service-check').checked;

    if (cart.length > 0) {
        bar.classList.remove('cart-hidden');
        let total = 0;
        let movies = cart.filter(i => i.cat === "MOVIES").length;
        let series = cart.filter(i => i.cat === "SERIES" || i.cat === "TV SHOWS").length;
        let others = cart.filter(i => i.cat !== "MOVIES" && i.cat !== "SERIES" && i.cat !== "TV SHOWS" && i.cat !== "GAMES");

        total += Math.ceil(movies / 10) * 1;
        total += Math.ceil(series / 2) * 1;
        others.forEach(i => total += (parseFloat(i.price.replace('$', '')) || 0));

        count.innerText = `${cart.length} Item(s)`;
        totalDisp.innerText = isMobile ? `Est: $${total} + Travel` : `Est Total: $${total}`;
        totalDisp.style.color = isMobile ? 'var(--purple)' : 'white';
    } else {
        bar.classList.add('cart-hidden');
    }
}

function clearCart() {
    cart = [];
    document.querySelectorAll('.item-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('mobile-service-check').checked = false;
    updateCartUI();
}

function checkout() {
    const isMobile = document.getElementById('mobile-service-check').checked;
    const choice = confirm("Send order to Admin (OK) or Tech (Cancel)?");
    const num = choice ? WHATSAPP_LINES[0] : WHATSAPP_LINES[1];
    let list = cart.map(i => `- ${i.name}`).join('\n');
    let mobileNote = isMobile ? "\n\n🚀 *REQUESTING MOBILE SERVICE*\n📍 My location for fee calculation: " : "";
    let msg = `TITAN ORDER ⚡\n\n${list}${mobileNote}\n\nPlease confirm availability.`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank');
}

function openMap() {
    window.open("https://www.google.com/maps/search/14+28+Crescent+Warren+Park+1+Harare", "_blank");
}

function filterGrid(q, cat) {
    document.querySelectorAll('.item-card').forEach(card => {
        const match = card.dataset.name.includes(q) && (cat === 'ALL' || card.dataset.cat === cat);
        card.style.display = match ? 'block' : 'none';
    });
}

function switchTab(cat) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.innerText === cat));
    filterGrid(document.getElementById('catalog-search').value.toLowerCase(), cat);
}

function generateBrandedQR() {
    const qr = document.getElementById('digital-qr');
    if(qr) qr.src = `https://quickchart.io/qr?text=${encodeURIComponent(window.location.href)}&size=200&markerColor=%23A020F0`;
}

function sendGeneralRequest() {
    const item = prompt("What are you looking for?");
    if(item) window.open(`https://wa.me/${WHATSAPP_LINES[0]}?text=REQUEST: ${item}`);
}
