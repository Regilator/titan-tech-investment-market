/* =======================================================
   TITAN TECH OMEGA - MASTER TERMINAL SCRIPT
   Merged & Optimized for 14 28 Crescent Launch
   ======================================================= */

// 1. MASTER REVIEWS
const reviews = [
    {n: "Tinashe M.", t: "Best tech spot in WP1!", d: "Mar 28, 2026"},
    {n: "Kuda_Gaming", t: "FC 25 squads are 100% updated.", d: "Mar 27, 2026"},
    {n: "Mai Vimbai", t: "The terminal looks amazing. Professional service.", d: "Mar 26, 2026"}
];

// 2. SECURITY PROTOCOL (ToS) LOGIC
function acceptToS() {
    const overlay = document.getElementById('tos-overlay');
    if(overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            // Start loading other data once protocol is accepted
            document.getElementById('status-bar').innerText = "SYSTEM ONLINE - WELCOME";
        }, 500);
    }
}

// 3. TAB NAVIGATION SYSTEM
function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }
    const tablinks = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// 4. BUSINESS STATUS INDICATOR
function updateBusinessStatus() {
    const now = new Date();
    const hour = now.getHours();
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');

    if (dot && text) {
        if (hour >= 8 && hour < 21) {
            dot.style.backgroundColor = "#00ff00"; 
            text.innerText = "🟢 ONLINE | TERMINAL ACTIVE";
            text.style.color = "#00ff00";
        } else {
            dot.style.backgroundColor = "#ff0000"; 
            text.innerText = "🔴 OFFLINE | BACK AT 08:00 AM";
            text.style.color = "#ff0000";
        }
    }
}

// 5. CATALOG DATA LOADER
async function loadData() {
    try {
        const res = await fetch('catalog.txt');
        if (!res.ok) throw new Error('Catalog missing');
        const text = await res.text();
        let current = '';
        
        text.split('\n').forEach(line => {
            const cleanLine = line.trim();
            if (!cleanLine) return;
            if (cleanLine.startsWith('---')) {
                if (cleanLine.includes('MOVIES')) current = 'movies-list';
                else if (cleanLine.includes('TV SHOWS')) current = 'tv-list';
                else if (cleanLine.includes('PC GAMES')) current = 'games-list';
                else if (cleanLine.includes('MOBILE')) current = 'mobile-list';
                else if (cleanLine.includes('MUSIC')) current = 'music-list';
                else if (cleanLine.includes('SOFT')) current = 'software-list';
                else if (cleanLine.includes('HACK')) current = 'dev-list';
            } else if (cleanLine.includes('|')) {
                const [n, p, d, i] = cleanLine.split('|').map(s => s.trim());
                const card = `
                    <div class="product-card ${current === 'dev-list' ? 'dev-card' : ''}">
                        <img src="images/${i}" onerror="this.src='https://via.placeholder.com/200x300?text=TITAN+TECH'">
                        <h4>${n}</h4>
                        <p class="price-tag">${p}</p>
                        <button class="btn wa" onclick="window.location.href='https://wa.me/263785841446?text=Order:${encodeURIComponent(n)}'">GET IT</button>
                    </div>`;
                const container = document.getElementById(current);
                if(container) container.innerHTML += card;
            }
        });
    } catch (e) { 
        console.log("Catalog loading standby..."); 
        document.getElementById('status-bar').innerText = "ERROR: CATALOG.TXT NOT FOUND";
    }
}

// 6. QR GENERATOR
function generateTerminalQR() {
    const qrid = document.getElementById("qrcode");
    if (qrid) {
        new QRCode(qrid, {
            text: "https://regilator.github.io/titan-tech-investment-market/",
            width: 150,
            height: 150,
            colorDark : "#ff0000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    }
}

// 7. INITIALIZATION (The Engine Start)
window.onload = () => {
    updateBusinessStatus();
    loadData();
    generateTerminalQR();

    // Inject Reviews
    const revDiv = document.getElementById('display-reviews');
    if(revDiv) {
        reviews.forEach(r => { 
            revDiv.innerHTML += `<div class="review-item"><b>${r.n}:</b> ${r.t} <br><small style="color:var(--purple);">${r.d}</small></div>`; 
        });
    }
};
