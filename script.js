const reviews = [
    {n: "Tinashe M.", t: "Best tech spot in WP1!", d: "Mar 28, 2026"},
    {n: "Kuda_Gaming", t: "FC 25 squads are 100% updated.", d: "Mar 27, 2026"}
];

function acceptToS() {
    const overlay = document.getElementById('tos-overlay');
    if(overlay) {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        setTimeout(() => {
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 500);
    }
}

function openTab(evt, tabName) {
    const contents = document.getElementsByClassName("tab-content");
    for (let content of contents) content.style.display = "none";
    const tabs = document.getElementsByClassName("tab-btn");
    for (let tab of tabs) tab.classList.remove("active");
    
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

function updateBusinessStatus() {
    const hour = new Date().getHours();
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    if (dot && text) {
        if (hour >= 8 && hour < 21) {
            dot.style.background = "#00ff00";
            text.innerText = "🟢 ONLINE | 14 28 CRESCENT";
            text.style.color = "#00ff00";
        } else {
            dot.style.background = "#ff0000";
            text.innerText = "🔴 OFFLINE | BACK AT 08:00 AM";
            text.style.color = "#ff0000";
        }
    }
}

async function loadData() {
    try {
        const res = await fetch('catalog.txt');
        const text = await res.text();
        let currentContainer = '';
        
        text.split('\n').forEach(line => {
            const clean = line.trim();
            if (clean.startsWith('---')) {
                if (clean.includes('MOVIES')) currentContainer = 'movies-list';
                else if (clean.includes('TV SHOWS')) currentContainer = 'tv-list';
                else if (clean.includes('PC GAMES')) currentContainer = 'games-list';
                else if (clean.includes('MOBILE')) currentContainer = 'mobile-list';
                else if (clean.includes('MUSIC')) currentContainer = 'music-list';
                else if (clean.includes('SOFT')) currentContainer = 'software-list';
                else if (clean.includes('HACK')) currentContainer = 'dev-list';
            } else if (clean.includes('|')) {
                const [n, p, d, i] = clean.split('|').map(s => s.trim());
                const card = `
                <div class="product-card">
                    <img src="images/${i}" onerror="this.src='https://via.placeholder.com/200x300?text=TITAN'">
                    <h4>${n}</h4>
                    <p class="price-tag">${p}</p>
                    <button class="btn wa" onclick="window.location.href='https://wa.me/263785841446?text=Order:${encodeURIComponent(n)}'">GET</button>
                </div>`;
                const el = document.getElementById(currentContainer);
                if(el) el.innerHTML += card;
            }
        });
    } catch (e) { console.log("Catalog loading standby..."); }
}

function generateQR() {
    const qrEl = document.getElementById("qrcode");
    if(qrEl) {
        new QRCode(qrEl, {
            text: "https://regilator.github.io/titan-tech-investment-market/",
            width: 120, height: 120, colorDark: "#ff0000", colorLight: "#ffffff"
        });
    }
}

async function shareSite() {
    const shareData = {
        title: 'TITAN TECH OMEGA',
        text: 'The Terminal is LIVE! 14 28 Crescent.',
        url: window.location.href
    };
    try {
        await navigator.share(shareData);
    } catch (err) {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`, '_blank');
    }
}

window.onload = () => {
    updateBusinessStatus();
    loadData();
    generateQR();
    const revDiv = document.getElementById('display-reviews');
    if(revDiv) {
        reviews.forEach(r => { 
            revDiv.innerHTML += `<div class="review-item"><b>${r.n}:</b> ${r.t}</div>`; 
        });
    }
};
