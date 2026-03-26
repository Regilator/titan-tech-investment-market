/* =======================================================
   TITAN TECH OMEGA - ELITE SOCIAL TERMINAL
   Official Launch: 1 April 2026 | 14 28 Crescent, WP1
   ======================================================= */

// 1. MASTER REVIEWS (Manually update this list as you get WhatsApps)
const reviews = [
    {n: "Tinashe M.", t: "Best tech spot in WP1!", d: "Mar 28, 2026"},
    {n: "Kuda_Gaming", t: "FC 25 squads are 100% updated.", d: "Mar 27, 2026"},
    {n: "Mai Vimbai", t: "The terminal looks amazing. Professional service.", d: "Mar 26, 2026"}
];

// 2. SOCIAL: SHARE & REWARD SYSTEM
async function shareSite() {
    const shareData = {
        title: 'TITAN TECH OMEGA ⚡',
        text: 'Check out the Digital Terminal at 14 28 Crescent! Movies, Games, and APKs.',
        url: 'https://regilator.github.io/titan-tech-investment-market/'
    };
    try {
        await navigator.share(shareData);
        // Show the reward button after sharing
        document.getElementById('reward-claim').style.display = 'block';
    } catch (err) {
        // Fallback for PC or browsers without native share
        const waLink = `https://wa.me/?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`;
        window.open(waLink, '_blank');
        document.getElementById('reward-claim').style.display = 'block';
    }
}

// 3. SOCIAL: SEND REVIEW TO LOD OF TECH
function sendReview() {
    const name = document.getElementById('rev-name').value;
    const msg = document.getElementById('rev-msg').value;
    
    if(!name || !msg) return alert("Fill in both fields first!");

    const waLink = `https://wa.me/263785841446?text=NEW_REVIEW%0AFrom: ${name}%0AContent: ${msg}`;
    window.open(waLink, '_blank');
    alert("Review sent! Once verified, it will appear on the terminal.");
}

// 4. DATA LOADER (CATALOG)
async function loadData() {
    try {
        const res = await fetch('catalog.txt');
        if (!res.ok) return;
        const text = await res.text();
        let current = '';
        
        text.split('\n').forEach(line => {
            const cleanLine = line.trim();
            if (!cleanLine) return;
            if (cleanLine.startsWith('---')) {
                if (cleanLine.includes('MOVIES')) current = 'movies-list';
                else if (cleanLine.includes('PC GAMES')) current = 'games-list';
                else if (cleanLine.includes('MOBILE')) current = 'mobile-list';
            } else if (cleanLine.includes('|')) {
                const [n, p, d, i] = cleanLine.split('|').map(s => s.trim());
                const card = `<div class="product-card">
                    <img src="images/${i}" onerror="this.src='https://via.placeholder.com/200x300?text=TITAN+TECH'">
                    <h4>${n}</h4>
                    <p class="price-tag">${p}</p>
                    <button class="btn" onclick="window.location.href='https://wa.me/263785841446?text=Order:${encodeURIComponent(n)}'">GET IT</button>
                </div>`;
                const container = document.getElementById(current);
                if(container) container.innerHTML += card;
            }
        });
    } catch (e) { console.log("Catalog loading..."); }
}

// 5. TERMINAL QR GENERATOR (Visit Page Mode)
function generateTerminalQR() {
    const qrid = document.getElementById("qrcode");
    if (qrid) {
        new QRCode(qrid, {
            text: "https://regilator.github.io/titan-tech-investment-market/",
            width: 150,
            height: 150,
            colorDark : "#ff0000",
            colorLight : "#000000",
            correctLevel : QRCode.CorrectLevel.H
        });
    }
}

// 6. INITIALIZATION
window.onload = () => {
    // A. Splash Screen
    setTimeout(() => { 
        const splash = document.getElementById('splash-screen');
        if(splash) splash.style.display = 'none'; 
    }, 2000);
    
    loadData();
    generateTerminalQR();

    // B. Inject Reviews
    const revDiv = document.getElementById('display-reviews');
    if(revDiv) {
        reviews.forEach(r => { 
            revDiv.innerHTML += `<div class="review-item"><b>${r.n}:</b> ${r.t} <br><small style="color:var(--purple);">${r.d}</small></div>`; 
        });
    }
};
