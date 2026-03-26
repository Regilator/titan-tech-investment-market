const WHATSAPP_LINES = [
    { label: "Admin", number: "263715913665" },
    { label: "Tech", number: "263781847711" }
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Splash Screen
    setTimeout(() => {
        const splash = document.getElementById('splash');
        splash.style.opacity = '0';
        setTimeout(() => splash.style.display = 'none', 800);
    }, 2800);

    // 2. Start Systems
    startCountdown();
    generateBrandedQR();
    loadCatalog();

    // 3. Search Listener
    document.getElementById('catalog-search').addEventListener('input', (e) => {
        const currentTab = document.querySelector('.tab-btn.active').innerText;
        filterGrid(e.target.value.toLowerCase(), currentTab);
    });
});

function startCountdown() {
    const launchDate = new Date("April 1, 2026 00:00:00").getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const dist = launchDate - now;
        if (dist < 0) {
            document.getElementById("timer").innerHTML = "OMEGA ONLINE";
            return;
        }
        const d = Math.floor(dist / (1000 * 60 * 60 * 24));
        const h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((dist % (1000 * 60)) / 1000);
        document.getElementById("timer").innerHTML = `${d}d ${h}h ${m}m ${s}s`;
    }, 1000);
}

function generateBrandedQR() {
    const qrImg = document.getElementById('digital-qr');
    const siteUrl = window.location.href;
    
    // Logo location in your GitHub assets folder
    const logoUrl = "https://regilator.github.io/titan-tech-investment-market/assets/titan-logo.png";
    
    // Branded API call (Purple markers, Black foreground, White background, Central Logo)
    const qrApi = `https://quickchart.io/qr?text=${encodeURIComponent(siteUrl)}&size=350&centerImageUrl=${encodeURIComponent(logoUrl)}&centerImageWidth=70&centerImageHeight=70&markerColor=%23A020F0`;
    
    qrImg.src = qrApi;
}

async function loadCatalog() {
    try {
        const res = await fetch('catalog.txt');
        const text = await res.text();
        const grid = document.getElementById('catalog-grid');
        
        grid.innerHTML = text.split('\n')
            .filter(line => line.includes('|'))
            .map(line => {
                const [name, price, img, cat] = line.split('|');
                return `
                    <div class="item-card" data-name="${name.toLowerCase()}" data-cat="${cat.trim().toUpperCase()}">
                        <img src="${img.trim()}" onerror="this.src='https://via.placeholder.com/150?text=TITAN+TECH'">
                        <div class="item-details">
                            <strong>${name}</strong><br>
                            <span style="color:var(--red); font-weight:bold;">${price}</span>
                        </div>
                    </div>`;
            }).join('');
    } catch (err) { console.error("Catalog Offline"); }
}

function switchTab(cat) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText === cat);
    });
    filterGrid(document.getElementById('catalog-search').value.toLowerCase(), cat);
}

function filterGrid(query, cat) {
    document.querySelectorAll('.item-card').forEach(card => {
        const nameMatch = card.dataset.name.includes(query);
        const catMatch = (cat === 'ALL' || card.dataset.cat === cat);
        card.style.display = (nameMatch && catMatch) ? 'block' : 'none';
    });
}

function sendWhatsAppRequest() {
    const item = prompt("TITAN OMEGA REQUEST:\nWhat are you looking for?");
    if (!item) return;
    const choice = prompt("Select Service Line:\n1. ADMIN (0715913665)\n2. TECH (0781847711)");
    const num = (choice === "2") ? WHATSAPP_LINES[1].number : WHATSAPP_LINES[0].number;
    window.open(`https://wa.me/${num}?text=TITAN%20OMEGA%20REQUEST:%20${encodeURIComponent(item)}`, '_blank');
}

async function shareTerminal() {
    if (navigator.share) {
        await navigator.share({ title: 'TITAN TECH OMEGA', url: window.location.href });
    } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`);
    }
}

async function downloadDigitalQR() {
    const imgUrl = document.getElementById('digital-qr').src;
    const res = await fetch(imgUrl);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Titan_Tech_Omega_QR.png";
    a.click();
}
