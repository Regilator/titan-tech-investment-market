/* ==========================================
   TITAN TECH OMEGA - MASTER CONTROL SCRIPT
   OPENING 1 APRIL 2026 | WARREN PARK 1
   ========================================== */

// 1. CUSTOMER INTEL (REVIEWS)
const reviews = [
    {n: "Tinashe M.", t: "Got early access to the movie catalog. 4K quality is insane!", d: "Mar 28, 2026"},
    {n: "Kuda_Gaming", t: "Beta tested the FC 25 squads. Everything is up to date.", d: "Mar 27, 2026"},
    {n: "Mai Vimbai", t: "The terminal at 14 28 Crescent looks amazing. Ready for April 1st!", d: "Mar 25, 2026"},
    {n: "Anon_Dev", t: "Testing the Python & Termux scripts. Regilator is the real Lod of Tech.", d: "Mar 20, 2026"},
    {n: "Victor", t: "WP1 finally has a real tech hub. Reliable mobile service.", d: "Mar 15, 2026"}
];

// 2. CATALOG LOADER (FETCH FROM catalog.txt)
async function loadData() {
    try {
        const res = await fetch('catalog.txt');
        const text = await res.text();
        let current = '';

        text.split('\n').forEach(line => {
            const cleanLine = line.trim();
            if (!cleanLine) return;
            if (cleanLine.startsWith('---')) {
                if (line.includes('MOVIES')) current = 'movies-list';
                else if (line.includes('TV SHOWS')) current = 'tv-list';
                else if (line.includes('PC GAMES')) current = 'games-list';
                else if (line.includes('MOBILE')) current = 'mobile-list';
                else if (line.includes('MUSIC')) current = 'music-list';
                else if (line.includes('SOFTWARE')) current = 'software-list';
                else if (line.includes('CODING')) current = 'dev-list';
            } else if (cleanLine.includes('|')) {
                const [n, p, d, i] = cleanLine.split('|').map(item => item.trim());
                const isDev = p.toUpperCase().includes('CONTACT');
                const waLink = `https://wa.me/263785841446?text=Order:${encodeURIComponent(n)}`;

                const card = `<div class="product-card ${isDev ? 'dev-card' : ''}">
                    <img src="images/${i}" onerror="this.src='https://via.placeholder.com/200x300?text=TITAN'">
                    <h4>${n}</h4>
                    <p class="price-tag">${p}</p>
                    <button class="btn" style="background:var(--red); width:90%; margin:8px auto; cursor:pointer;" onclick="window.location.href='${waLink}'">${isDev ? 'REQUEST' : 'GET IT'}</button>
                </div>`;
                const container = document.getElementById(current);
                if(container) container.innerHTML += card;
            }
        });
    } catch (e) { console.error("Catalog Error:", e); }
}

// 3. TAB NAVIGATION
function openTab(evt, name) {
    let content = document.getElementsByClassName("tab-content");
    for (let i = 0; i < content.length; i++) content[i].classList.remove("active");
    let btns = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < btns.length; i++) btns[i].classList.remove("active");
    
    const target = document.getElementById(name);
    if(target) target.classList.add("active");
    evt.currentTarget.classList.add("active");
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 4. SECURITY PROTOCOL (ToS)
function acceptToS() {
    const tos = document.getElementById('tos-overlay');
    if(tos) tos.style.display = 'none';
    localStorage.setItem('titan_tos_accepted', 'true');
}

// 5. OMEGA QR GENERATOR
function generateTerminalQR() {
    const qrid = document.getElementById("qrcode");
    if (qrid) {
        // Change 'titantech' to your actual repo name if it differs!
        const apkUrl = "https://regilator.github.io/titantech/downloads/TitanTech.apk";
        new QRCode(qrid, {
            text: apkUrl,
            width: 160,
            height: 160,
            colorDark : "#ff0000",
            colorLight : "#000000",
            correctLevel : QRCode.CorrectLevel.H
        });
    }
}

// 6. INITIALIZATION (ON LOAD)
window.onload = () => {
    // A. Splash Screen Delay (2.5s)
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if(splash) splash.style.display = 'none';
    }, 2500);

    // B. Run Core Functions
    loadData();
    generateTerminalQR();

    // C. Check ToS Storage
    if (localStorage.getItem('titan_tos_accepted') === 'true') {
        const tos = document.getElementById('tos-overlay');
        if(tos) tos.style.display = 'none';
    }
    
    // D. Launch Countdown & Status
    const today = new Date();
    const launchDate = new Date('2026-04-01');
    const statusBar = document.getElementById('status-bar');

    if (statusBar) {
        if (today < launchDate) {
            statusBar.innerHTML = `⚠️ GRAND OPENING: 1 APRIL 2026 | 14 28 Crescent`;
            statusBar.style.color = "var(--purple)";
        } else {
            const hour = today.getHours();
            statusBar.innerText = hour >= 8 && hour < 21 ? "🟢 ONLINE | 14 28 Crescent" : "🔴 CLOSED | Back at 08:00";
        }
    }

    // E. Populate Reviews
    const revDiv = document.getElementById('display-reviews');
    if(revDiv) {
        reviews.forEach(r => { 
            revDiv.innerHTML += `
                <div class="review-item">
                    <div style="display:flex; justify-content:space-between; font-size:0.6rem; color:var(--purple); margin-bottom:4px;">
                        <b>${r.n}</b>
                        <span style="opacity:0.7;">${r.d}</span>
                    </div>
                    <div style="color:#ccc; font-size:0.75rem; line-height:1.3;">${r.t}</div>
                </div>`; 
        });
    }
};
