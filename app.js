const WHATSAPP_LINES = [
    { label: "Admin", number: "263715913665" },
    { label: "Tech", number: "263781847711" }
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Splash Screen
    setTimeout(() => {
        const splash = document.getElementById('splash');
        if(splash) {
            splash.style.opacity = '0';
            setTimeout(() => splash.style.display = 'none', 800);
        }
    }, 2800);

    // 2. Start Systems
    startCountdown();
    generateBrandedQR();
    loadCatalog();

    // 3. Search Listener
    const searchInput = document.getElementById('catalog-search');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const activeTab = document.querySelector('.tab-btn.active');
            const currentTab = activeTab ? activeTab.innerText : 'ALL';
            filterGrid(e.target.value.toLowerCase(), currentTab);
        });
    }
});

function startCountdown() {
    const launchDate = new Date("April 1, 2026 00:00:00").getTime();
    const timerElement = document.getElementById("timer");
    if(!timerElement) return;

    setInterval(() => {
        const now = new Date().getTime();
        const dist = launchDate - now;
        if (dist < 0) {
            timerElement.innerHTML = "OMEGA ONLINE";
            return;
        }
        const d = Math.floor(dist / (1000 * 60 * 60 * 24));
        const h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((dist % (1000 * 60)) / 1000);
        timerElement.innerHTML = `${d}d ${h}h ${m}m ${s}s`;
    }, 1000);
}

function generateBrandedQR() {
    const qrImg = document.getElementById('digital-qr');
    if(!qrImg) return;
    const siteUrl = window.location.href;
    const logoUrl = "https://regilator.github.io/titan-tech-investment-market/assets/titan-logo.png";
    const qrApi = `https://quickchart.io/qr?text=${encodeURIComponent(siteUrl)}&size=350&centerImageUrl=${encodeURIComponent(logoUrl)}&centerImageWidth=70&centerImageHeight=70&markerColor=%23A020F0`;
    qrImg.src = qrApi;
}

async function loadCatalog() {
    try {
        const res = await fetch('catalog.txt');
        if (!res.ok) throw new Error('Catalog missing');
        const text = await res.text();
        const grid = document.getElementById('catalog-grid');
        
        grid.innerHTML = text.split('\n')
            .filter(line => line.includes('|'))
            .map(line => {
                const parts = line.split('|');
                if (parts.length < 4) return '';
                
                const name = parts[0].trim();
                const price = parts[1].trim();
                const imgPath = parts[2].trim();
                const category = parts[3].trim().toUpperCase();

                return `
                    <div class="item-card" data-name="${name.toLowerCase()}" data-cat="${category}">
                        <img src="${imgPath}" loading="lazy" onerror="this.src='https://via.placeholder.com/150?text=TITAN+TECH'">
                        <div class="item-details">
                            <strong>${name}</strong><br>
                            <span style="color:var(--red); font-weight:bold;">${price}</span>
                        </div>
                    </div>`;
            }).join('');
    } catch (err) { 
        console.error("Catalog Error:", err);
    }
}

function switchTab(cat) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText === cat);
    });
    const searchVal = document.getElementById('catalog-search')?.value.toLowerCase() || "";
    filterGrid(searchVal, cat);
}

function filterGrid(query, cat) {
    document.querySelectorAll('.item-card').forEach(card => {
        const nameMatch = card.dataset.name.includes(query);
        const catMatch = (cat === 'ALL' || card.dataset.cat === cat);
        card.style.display = (nameMatch && catMatch) ? 'block' : 'none';
    });
}
