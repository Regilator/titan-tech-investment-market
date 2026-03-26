const WHATSAPP_LINES = [
    { label: "LINE 1 (Admin/Sales)", number: "263715913665" },
    { label: "LINE 2 (Tech/Partner)", number: "263781847711" }
];

document.addEventListener('DOMContentLoaded', () => {
    // Hide splash
    setTimeout(() => { document.getElementById('splash').style.opacity = '0'; 
        setTimeout(() => { document.getElementById('splash').style.display = 'none'; }, 800);
    }, 2500);

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
        if (dist < 0) {
            document.getElementById("timer").innerHTML = "TERMINAL ONLINE";
            return;
        }
        const d = Math.floor(dist / (1000 * 60 * 60 * 24));
        const h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((dist % (1000 * 60)) / 1000);
        document.getElementById("timer").innerHTML = `${d}d ${h}h ${m}m ${s}s`;
    }, 1000);
}

function generateDigitalQR() {
    const currentUrl = window.location.href;
    document.getElementById('digital-qr').src = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(currentUrl)}`;
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
    } catch (e) { console.error("Catalog Fetch Failed."); }
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
    const item = prompt("What are you looking for?");
    if (!item) return;
    const choice = prompt("Select Service Line:\n1. Admin/Sales (0715913665)\n2. Tech/Partner (0781847711)");
    const num = (choice === "2") ? WHATSAPP_LINES[1].number : WHATSAPP_LINES[0].number;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent('TITAN OMEGA REQUEST: ' + item)}`, '_blank');
}

async function shareTerminal() {
    try {
        await navigator.share({ title: 'TITAN TECH OMEGA', text: 'Professional Tech Services in Harare!', url: window.location.href });
    } catch (e) { window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`); }
}

async function downloadDigitalQR() {
    const res = await fetch(document.getElementById('digital-qr').src);
    const blob = await res.blob();
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "Titan_Tech_QR.png"; a.click();
}
