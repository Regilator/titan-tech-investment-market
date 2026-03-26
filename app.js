const WHATSAPP_LINES = [
    { label: "Admin/Sales", number: "263715913665" },
    { label: "Tech/Partner", number: "263781847711" }
];

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { document.getElementById('splash').style.display = 'none'; }, 2500);
    startCountdown();
    generateDigitalQR();
    loadCatalog();
    document.getElementById('catalog-search').addEventListener('keyup', (e) => {
        const cat = document.querySelector('.tab-btn.active').innerText;
        filterGrid(e.target.value.toLowerCase(), cat);
    });
});

function startCountdown() {
    const launchDate = new Date("April 1, 2026 00:00:00").getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const dist = launchDate - now;
        const d = Math.floor(dist / (1000 * 60 * 60 * 24));
        const h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((dist % (1000 * 60)) / 1000);
        document.getElementById("timer").innerHTML = `${d}d ${h}h ${m}m ${s}s`;
    }, 1000);
}

function generateDigitalQR() {
    document.getElementById('digital-qr').src = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(window.location.href)}`;
}

async function loadCatalog() {
    try {
        const res = await fetch('catalog.txt');
        const data = await res.text();
        const grid = document.getElementById('catalog-grid');
        grid.innerHTML = data.split('\n').filter(l => l.includes('|')).map(line => {
            const [name, price, img, cat] = line.split('|');
            return `<div class="item-card" data-name="${name.toLowerCase()}" data-cat="${cat.trim().toUpperCase()}">
                <img src="${img.trim()}" onerror="this.src='https://via.placeholder.com/150?text=TITAN+TECH'">
                <div class="item-details"><strong>${name}</strong><br><span style="color:var(--red)">${price}</span></div></div>`;
        }).join('');
    } catch (e) { console.error("Sync Error"); }
}

function switchTab(cat) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.innerText === cat));
    filterGrid(document.getElementById('catalog-search').value.toLowerCase(), cat);
}

function filterGrid(q, cat) {
    document.querySelectorAll('.item-card').forEach(card => {
        const match = card.dataset.name.includes(q) && (cat === 'ALL' || card.dataset.cat === cat);
        card.style.display = match ? 'block' : 'none';
    });
}

function sendWhatsAppRequest() {
    const item = prompt("Enquiry for:");
    if (!item) return;
    const choice = prompt("Line 1 (Admin) or 2 (Tech)?");
    const num = (choice === "2") ? WHATSAPP_LINES[1].number : WHATSAPP_LINES[0].number;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent('TITAN REQUEST: ' + item)}`, '_blank');
}

async function shareTerminal() {
    try { await navigator.share({ title: 'TITAN TECH OMEGA', url: window.location.href }); } 
    catch (e) { window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`); }
}

async function downloadDigitalQR() {
    const res = await fetch(document.getElementById('digital-qr').src);
    const blob = await res.blob();
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "Titan_QR.png"; a.click();
}
