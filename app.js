const WHATSAPP_LINES = [
    { label: "Admin", number: "263715913665" },
    { label: "Tech", number: "263781847711" }
];

document.addEventListener('DOMContentLoaded', () => {
    // Splash Handler
    setTimeout(() => {
        const splash = document.getElementById('splash');
        if(splash) {
            splash.style.opacity = '0';
            setTimeout(() => splash.style.display = 'none', 800);
        }
    }, 2800);

    updateShopStatus();
    startCountdown();
    generateBrandedQR();
    loadCatalog();
    loadReviews();

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
        light.className = 'online';
        text.innerText = 'TITAN ONLINE';
        text.style.color = '#00ff00';
    } else {
        light.className = 'offline';
        text.innerText = 'TITAN OFFLINE';
        text.style.color = '#ff0000';
    }
}

async function loadCatalog() {
    try {
        const res = await fetch('catalog.txt');
        const text = await res.text();
        const grid = document.getElementById('catalog-grid');
        grid.innerHTML = text.split('\n').filter(l => l.includes('|')).map(line => {
            const [name, price, img, cat] = line.split('|');
            return `
                <div class="item-card" onclick="buyItem('${name.trim()}', '${price.trim()}')" data-name="${name.toLowerCase()}" data-cat="${cat.trim().toUpperCase()}">
                    <img src="${img.trim()}" loading="lazy" onerror="this.src='https://via.placeholder.com/150?text=TITAN+TECH'">
                    <div class="item-details">
                        <strong>${name}</strong><br>
                        <span style="color:var(--red); font-weight:bold;">${price}</span>
                    </div>
                </div>`;
        }).join('');
    } catch (e) { console.error("Catalog Error"); }
}

function buyItem(name, price) {
    const choice = confirm(`Order ${name} for ${price}?\n\nOK = Admin Line\nCancel = Tech Line`);
    const num = choice ? WHATSAPP_LINES[0].number : WHATSAPP_LINES[1].number;
    const msg = `TITAN REQUEST ⚡\nItem: ${name}\nPrice: ${price}\nIs this available?`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank');
}

function sendGeneralRequest() {
    const item = prompt("TITAN OMEGA REQUEST:\nWhat are you looking for?");
    if (item) {
        const choice = confirm("Send to ADMIN (OK) or TECH (Cancel)?");
        const num = choice ? WHATSAPP_LINES[0].number : WHATSAPP_LINES[1].number;
        window.open(`https://wa.me/${num}?text=TITAN CUSTOM REQUEST ⚡\nLooking for: ${item}`, '_blank');
    }
}

function switchTab(cat) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.toggle('active', btn.innerText === cat));
    filterGrid(document.getElementById('catalog-search').value.toLowerCase(), cat);
}

function filterGrid(q, cat) {
    document.querySelectorAll('.item-card').forEach(card => {
        const match = card.dataset.name.includes(q) && (cat === 'ALL' || card.dataset.cat === cat);
        card.style.display = match ? 'block' : 'none';
    });
}

function loadReviews() {
    const reviews = [
        { msg: "Fastest bypass in Harare!", user: "Tinashe M." },
        { msg: "Games working 100% on my PC.", user: "Gift_Tech" },
        { msg: "Titan Tech is the only shop I trust.", user: "Sarah Z." }
    ];
    document.getElementById('reviews-list').innerHTML = reviews.map(r => `
        <div class="review-card"><p>"${r.msg}"</p><span>- ${r.user}</span></div>
    `).join('');
}

function requestReview() {
    const name = prompt("Your Name/Handle:");
    if(name) window.open(`https://wa.me/${WHATSAPP_LINES[0].number}?text=TITAN FEEDBACK ⚡\nName: ${name}\nReview: `);
}

function startCountdown() {
    const launch = new Date("April 1, 2026 00:00:00").getTime();
    setInterval(() => {
        const dist = launch - new Date().getTime();
        const d = Math.floor(dist / (1000 * 60 * 60 * 24));
        const h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((dist % (1000 * 60)) / 1000);
        document.getElementById("timer").innerHTML = dist < 0 ? "TITAN ONLINE" : `${d}d ${h}h ${m}m ${s}s`;
    }, 1000);
}

function generateBrandedQR() {
    const qr = document.getElementById('digital-qr');
    if(qr) qr.src = `https://quickchart.io/qr?text=${encodeURIComponent(window.location.href)}&size=250&markerColor=%23A020F0`;
}
