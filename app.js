let currentCategory = 'ALL';

// TITAN TECH OFFICIAL BUSINESS LINES
const WHATSAPP_LINES = [
    { label: "Line 1 (Sales)", number: "263715913665" },
    { label: "Line 2 (Tech)", number: "263719597612" }
];

document.addEventListener('DOMContentLoaded', () => {
    // Splash Handler
    setTimeout(() => {
        document.getElementById('splash').style.opacity = '0';
        setTimeout(() => { document.getElementById('splash').style.display = 'none'; }, 600);
    }, 2800);

    // Initializers
    if(localStorage.getItem('titan_omega_auth')) {
        document.getElementById('tos-overlay').style.display = 'none';
    }
    
    updateStatus();
    loadCatalog();
    
    document.getElementById('catalog-search').addEventListener('keyup', (e) => {
        filterGrid(e.target.value.toLowerCase());
    });
});

function switchTab(cat) {
    currentCategory = cat.toUpperCase();
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toUpperCase() === currentCategory);
    });
    filterGrid(document.getElementById('catalog-search').value.toLowerCase());
}

async function loadCatalog() {
    try {
        const res = await fetch('catalog.txt');
        const data = await res.text();
        const grid = document.getElementById('catalog-grid');
        grid.innerHTML = data.split('\n').filter(l => l.includes('|')).map(line => {
            const [n, p, i, c] = line.split('|');
            return `
                <div class="item-card" data-name="${n.toLowerCase()}" data-cat="${c.trim().toUpperCase()}" onclick="generateReceipt('${n}', '${p}')">
                    <img src="${i.trim()}" loading="lazy" onerror="this.src='https://via.placeholder.com/150?text=TITAN+TECH'">
                    <div class="item-details"><h4>${n}</h4><p class="item-price">${p}</p></div>
                </div>`;
        }).join('');
        filterGrid('');
    } catch (e) { console.error("Database Sync Failed."); }
}

function filterGrid(query) {
    document.querySelectorAll('.item-card').forEach(card => {
        const nameMatch = card.dataset.name.includes(query);
        const catMatch = (currentCategory === 'ALL' || card.dataset.cat === currentCategory);
        card.style.display = (nameMatch && catMatch) ? 'block' : 'none';
    });
}

function sendWhatsAppRequest() {
    const item = prompt("What are you looking for?");
    if (!item) return;
    const choice = prompt("Select Line (Type 1 or 2):\n1. Sales / Inquiries\n2. Tech Support / Flashing");
    let line = (choice === "2") ? WHATSAPP_LINES[1].number : WHATSAPP_LINES[0].number;
    const msg = encodeURIComponent(`TITAN TECH REQUEST: Is [${item}] available at the shop?`);
    window.open(`https://wa.me/${line}?text=${msg}`, '_blank');
}

function generateReceipt(n, p) {
    const cust = prompt("Customer Name:");
    if (!cust) return;
    document.getElementById('rec-cust').innerText = cust.toUpperCase();
    document.getElementById('rec-item').innerText = n.toUpperCase();
    document.getElementById('rec-price').innerText = p;
    document.getElementById('rec-date').innerText = new Date().toLocaleDateString();
    document.getElementById('receipt-modal').style.display = 'flex';
}

function closeReceipt() { document.getElementById('receipt-modal').style.display = 'none'; }
function acceptTerms() { localStorage.setItem('titan_omega_auth', 'true'); document.getElementById('tos-overlay').style.display = 'none'; }
function updateStatus() {
    const h = new Date().getHours();
    const s = document.getElementById('status-indicator');
    s.innerHTML = (h >= 8 && h < 21) ? '<span style="color:#00ff88">● ONLINE</span>' : '<span style="color:#ff4444">○ OFFLINE</span>';
}

if ('serviceWorker' in navigator) { navigator.serviceWorker.register('sw.js'); }
