/* TITAN TECH HUB - OMEGA LOGIC ENGINE v1.0.1
   Lead Developer: Lod of Tech
   Base: Titan Tech Investment (ZW)
*/

// 1. DATABASE CONFIGURATION
const firebaseConfig = {
    apiKey: "AIzaSyBRHHvX9TMDsJQ8PzD7FMsq00VMUVnx_UI",
    databaseURL: "https://titan-tech-hub-default-rtdb.firebaseio.com"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// 2. THEME CONFIGURATION (Matrix Color Mapping)
const categoryThemes = {
    'ALL': '#00ff41',      // Matrix Green
    'REPAIRS': '#ff0000',  // Titan Red
    'HACK': '#00ff41',     // Classic Green
    'SOFTWARE': '#00f2ff', // Neon Blue
    'GAMES': '#A020F0'     // Purple
};

// 3. CORE INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    runBootSequence();
    loadCatalog();
    startClock();
});

// 4. SYSTEM BOOT SEQUENCE
function runBootSequence() {
    const splash = document.getElementById('splash');
    const bootText = document.getElementById('boot-text');
    const statusLogs = [
        "> INITIALIZING OMEGA_OS...",
        "> LOADING DATABASE_NODES...",
        "> SYNCING TITAN_CATALOG...",
        "> WELCOME, LOD OF TECH"
    ];

    let logIndex = 0;
    const logInterval = setInterval(() => {
        bootText.innerText = statusLogs[logIndex];
        logIndex++;
        if (logIndex >= statusLogs.length) {
            clearInterval(logInterval);
            setTimeout(() => {
                splash.style.transition = '0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                splash.style.opacity = '0';
                splash.style.pointerEvents = 'none';
            }, 800);
        }
    }, 400);
}

// 5. CATALOG DATA MANAGEMENT
function loadCatalog() {
    db.ref('catalog').on('value', (snapshot) => {
        const data = snapshot.val() || {};
        // Cache data locally for faster switching
        localStorage.setItem('titan_cache', JSON.stringify(data));
        renderGrid(data);
    }, (error) => {
        console.error("> DB_SYNC_FAILURE:", error);
    });
}

// 6. DYNAMIC UI RENDERING
function renderGrid(data, filter = 'ALL') {
    const grid = document.getElementById('catalog-grid');
    grid.innerHTML = "";

    // Set Dynamic Matrix Color Variable
    const currentTheme = categoryThemes[filter] || '#00ff41';
    document.documentElement.style.setProperty('--matrix-color', currentTheme);

    Object.keys(data).forEach(id => {
        const item = data[id];
        
        // Filter Logic
        if (filter !== 'ALL' && item.cat !== filter) return;

        const card = document.createElement('div');
        card.className = 'item-card';
        card.onclick = () => selectItem(item.name, item.price);
        
        card.innerHTML = `
            <div class="matrix-container">
                <div class="matrix-col" style="left:20%; animation-delay: 0.2s;">10101</div>
                <div class="matrix-col" style="left:50%; animation-delay: 0.5s;">01101</div>
                <div class="matrix-col" style="left:80%; animation-delay: 0.8s;">11001</div>
            </div>
            <div class="card-image-area">
                ${item.img ? `<img src="${item.img}" style="width:100%; height:100%; object-fit:cover; position:absolute;">` : ''}
                <div class="titan-logo-css logo-small"></div>
            </div>
            <div class="card-info">
                <div class="product-title">${item.name}</div>
                <div class="product-price">${item.price}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 7. INTERACTION LOGIC
function selectItem(name, price) {
    const cartBar = document.getElementById('cart-bar');
    const cartName = document.getElementById('cart-item-name');
    
    window.activeOrder = { name, price };
    
    cartName.innerText = name;
    cartBar.classList.remove('cart-hidden');
    
    // Haptic feedback (if available)
    if (window.navigator.vibrate) window.navigator.vibrate(20);
}

function checkout() {
    if (!window.activeOrder) return;

    // 1. Log the Sale to Admin Panel (Firebase)
    db.ref('sales').push({
        name: window.activeOrder.name,
        price: window.activeOrder.price,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        status: "PENDING"
    });

    // 2. Open WhatsApp for fulfillment
    const phoneNumber = "263715913665";
    const message = `🔱 *TITAN_TECH_ORDER* %0A----------------------%0AITEM: ${window.activeOrder.name}%0APRICE: ${window.activeOrder.price}%0A----------------------%0A_Awaiting digital fulfillment._`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

// 8. UTILITIES
function switchTab(cat) {
    // Update active UI button
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Reload from cache
    const cachedData = JSON.parse(localStorage.getItem('titan_cache')) || {};
    renderGrid(cachedData, cat);
}

function searchCatalog() {
    const query = document.getElementById('main-search').value.toLowerCase();
    const cachedData = JSON.parse(localStorage.getItem('titan_cache')) || {};
    const filtered = {};

    Object.keys(cachedData).forEach(id => {
        if (cachedData[id].name.toLowerCase().includes(query)) {
            filtered[id] = cachedData[id];
        }
    });
    
    renderGrid(filtered);
}

function startClock() {
    const clock = document.getElementById('live-clock');
    setInterval(() => {
        const now = new Date();
        clock.innerText = now.toLocaleTimeString('en-GB', { hour12: false });
    }, 1000);
}
