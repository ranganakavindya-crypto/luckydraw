// ===== GLOBAL STATE =====
let currentUser = null;
let ticketsData = [];
let historyData = [];
let todayWinnerData = null;
let playerCount = 0;
let isRegisterMode = false;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    fetchData();
    setupEventListeners();
});

function checkSession() {
    const saved = localStorage.getItem('lx_user');
    if (saved) {
        currentUser = JSON.parse(saved);
        updateLoginUI();
    }
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;

            if (page === 'admin') {
                if (!currentUser || currentUser.role !== 'admin') {
                    showAlert('playAlert', 'Admin access required. Please login as admin.', 'error');
                    openAuthModal(false);
                    return;
                }
            }

            switchPage(page);
        });
    });

    // Auth Modal Buttons
    document.getElementById('loginBtn').addEventListener('click', () => openAuthModal(false));

    document.getElementById('authSubmit').addEventListener('click', handleAuth);

    document.getElementById('authToggle').addEventListener('click', (e) => {
        e.preventDefault();
        isRegisterMode = !isRegisterMode;
        openAuthModal(isRegisterMode);
    });

    // Close Modal
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.getElementById('authModal').addEventListener('click', (e) => {
        if (e.target.id === 'authModal') closeModal();
    });

    // Enter key support
    document.getElementById('authPassword').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAuth();
    });
}

// ===== NAVIGATION =====
function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    const activeLink = document.querySelector(`nav a[data-page="${pageId}"]`);
    if (activeLink) activeLink.classList.add('active');

    if (pageId === 'home') renderHome();
    if (pageId === 'play') renderPlay();
    if (pageId === 'admin') renderAdmin();

    window.scrollTo(0, 0);
}

function closeModal() {
    document.getElementById('authModal').classList.remove('active');
    document.getElementById('authAlert').innerHTML = '';
}

function openAuthModal(register) {
    isRegisterMode = register;
    const modal = document.getElementById('authModal');
    const title = document.getElementById('authTitle');
    const submit = document.getElementById('authSubmit');
    const toggle = document.getElementById('authToggle');
    const alertBox = document.getElementById('authAlert');

    alertBox.innerHTML = '';
    document.getElementById('authUsername').value = '';
    document.getElementById('authPassword').value = '';
    modal.classList.add('active');

    if (register) {
        title.textContent = 'Register';
        submit.textContent = 'Create Account';
        toggle.textContent = 'Have an account? Login';
    } else {
        title.textContent = 'Login';
        submit.textContent = 'Login';
        toggle.textContent = 'Need an account? Register';
    }
}

// ===== AUTHENTICATION =====
function handleAuth() {
    const u = document.getElementById('authUsername').value.trim();
    const p = document.getElementById('authPassword').value;
    const alertBox = document.getElementById('authAlert');

    if (!u || !p) {
        alertBox.innerHTML = '<div class="alert alert-error">Please fill all fields</div>';
        return;
    }

    if (isRegisterMode) {
        registerUser(u, p);
    } else {
        loginUser(u, p);
    }
}

function loginUser(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    fetch('login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            const alertBox = document.getElementById('authAlert');
            if (data.status === 'success') {
                currentUser = data.user;
                localStorage.setItem('lx_user', JSON.stringify(currentUser));
                updateLoginUI();
                closeModal();
                showAlert('playAlert', 'Welcome back, ' + username + '!', 'success');
                switchPage('play');
                fetchData();
            } else {
                alertBox.innerHTML = '<div class="alert alert-error">' + data.message + '</div>';
            }
        })
        .catch(err => {
            document.getElementById('authAlert').innerHTML = '<div class="alert alert-error">Connection error</div>';
        });
}

function registerUser(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    fetch('register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            const alertBox = document.getElementById('authAlert');
            if (data.status === 'success') {
                alertBox.innerHTML = '<div class="alert alert-success">' + data.message + '</div>';
                setTimeout(() => {
                    isRegisterMode = false;
                    openAuthModal(false);
                }, 1500);
            } else {
                alertBox.innerHTML = '<div class="alert alert-error">' + data.message + '</div>';
            }
        })
        .catch(err => {
            document.getElementById('authAlert').innerHTML = '<div class="alert alert-error">Connection error</div>';
        });
}

function logout() {
    currentUser = null;
    localStorage.removeItem('lx_user');
    updateLoginUI();
    switchPage('home');
    alert('Logged out successfully!');
}

function updateLoginUI() {
    const btn = document.getElementById('loginBtn');
    if (currentUser) {
        btn.textContent = 'Logout (' + currentUser.username + ')';
        btn.onclick = logout;
    } else {
        btn.textContent = 'Login';
        btn.onclick = () => openAuthModal(false);
    }
}

// ===== DATA FETCHING =====
function fetchData() {
    fetch('get_data.php')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                ticketsData = data.tickets;
                historyData = data.history;
                todayWinnerData = data.todayWinner;
                playerCount = data.playerCount;

                // Refresh current view
                const activePage = document.querySelector('.page.active').id;
                if (activePage === 'home') renderHome();
                if (activePage === 'play') renderPlay();
                if (activePage === 'admin') renderAdmin();
            }
        })
        .catch(err => console.error('Fetch error:', err));
}

function refreshUserData() {
    if (!currentUser) return;

    const formData = new URLSearchParams();
    formData.append('username', currentUser.username);

    fetch('get_user.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                currentUser.coins = data.user.coins;
                localStorage.setItem('lx_user', JSON.stringify(currentUser));
                renderPlay();
            }
        });
}

// ===== RENDER FUNCTIONS =====

// 1. HOME PAGE
function renderHome() {
    const winnerCard = document.getElementById('todayWinner');
    const numDisplay = document.getElementById('winnerNumDisplay');
    const nameDisplay = document.getElementById('winnerNameDisplay');
    const trophy = document.getElementById('winnerTrophy');
    const congrats = document.getElementById('winnerCongrats');
    const hint = document.getElementById('todayWinnerHint');

    document.getElementById('statPlayers').textContent = playerCount;
    document.getElementById('statDraws').textContent = historyData.length;

    if (todayWinnerData) {
        winnerCard.classList.remove('no-winner');
        numDisplay.textContent = todayWinnerData.win_number;
        nameDisplay.textContent = todayWinnerData.winner_name || "No booked player";
        nameDisplay.classList.add('highlight');
        trophy.textContent = '🏆';
        congrats.textContent = '🎉 Congratulations!';
        hint.textContent = '';
    } else {
        winnerCard.classList.add('no-winner');
        numDisplay.textContent = '--';
        nameDisplay.textContent = 'No winner published yet';
        nameDisplay.classList.remove('highlight');
        trophy.textContent = '⏳';
        congrats.textContent = '';
        hint.textContent = 'Admin selects any number and publishes today\'s winner.';
    }
}

// 2. PLAY PAGE
function renderPlay() {
    const grid = document.getElementById('numberGrid');
    const pName = document.getElementById('playerName');
    const pCoins = document.getElementById('playerCoins');
    const alertBox = document.getElementById('playAlert');

    alertBox.innerHTML = '';

    if (!currentUser) {
        pName.textContent = 'Not logged in';
        pCoins.textContent = '0';
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;color:#94a3b8">🔐 Please login to start playing!</p>';
        return;
    }

    pName.textContent = currentUser.username + ' (' + currentUser.role + ')';
    pCoins.textContent = currentUser.coins;

    grid.innerHTML = '';

    const isDrawClosed = todayWinnerData !== null;

    for (let i = 1; i <= 100; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.textContent = i;

        const isBooked = ticketsData.some(t => t.number == i);

        if (isBooked) {
            tile.classList.add('booked');
            tile.title = "Booked";
            tile.onclick = null;
        } else {
            if (isDrawClosed) {
                tile.style.opacity = '0.5';
                tile.style.cursor = 'not-allowed';
                tile.title = "Draw Closed - Wait for new day";
                tile.onclick = null;
            } else {
                tile.onclick = () => bookTicket(i);
                tile.title = "Click to book (10 coins)";
            }
        }
        grid.appendChild(tile);
    }
}

// 3. ADMIN PAGE
function renderAdmin() {
    if (!currentUser || currentUser.role !== 'admin') {
        document.getElementById('navAdmin').style.display = 'none';
        return;
    }
    document.getElementById('navAdmin').style.display = 'block';

    const select = document.getElementById('adminWinSelect');
    const historyBody = document.getElementById('historyBody');

    // Populate Select
    select.innerHTML = '<option value="">-- Select Winning Number --</option>';
    for (let i = 1; i <= 100; i++) {
        const isBooked = ticketsData.some(t => t.number == i);
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = '#' + i + ' ' + (isBooked ? '(Booked)' : '(Free)');
        select.appendChild(opt);
    }

    // Populate History
    historyBody.innerHTML = '';
    if (historyData.length === 0) {
        historyBody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:20px">No draws yet</td></tr>';
    } else {
        historyData.forEach(h => {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td>' + h.draw_date + '</td>' +
                '<td style="color:var(--gold);font-weight:bold">#' + h.win_number + '</td>' +
                '<td>' + (h.winner_name || 'None') + '</td>' +
                '<td>' + h.ticket_count + '</td>';
            historyBody.appendChild(tr);
        });
    }
}

// ===== ACTIONS =====

function bookTicket(number) {
    if (!currentUser) {
        showAlert('playAlert', 'Please login first!', 'error');
        openAuthModal(false);
        return;
    }

    const formData = new URLSearchParams();
    formData.append('username', currentUser.username);
    formData.append('number', number);

    fetch('book_ticket.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                showAlert('playAlert', '✅ Booked #' + number + '! Good luck! 🍀', 'success');
                currentUser.coins = data.newCoins;
                localStorage.setItem('lx_user', JSON.stringify(currentUser));
                fetchData();
            } else {
                showAlert('playAlert', data.message, 'error');
            }
        })
        .catch(err => {
            showAlert('playAlert', 'Connection error', 'error');
        });
}

function adminPublishWinner() {
    const num = document.getElementById('adminWinSelect').value;
    const alertBox = document.getElementById('adminAlert');

    if (!num) {
        showAlert('adminAlert', 'Please select a number first', 'error');
        return;
    }

    if (!confirm('Publish #' + num + ' as today\'s winner?\n\n⚠️ This will:\n• Show winner on homepage\n• Reset ALL tickets for new day\n• Archive to history')) {
        return;
    }

    const formData = new URLSearchParams();
    formData.append('number', num);

    fetch('publish_winner.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                showAlert('adminAlert', '🏆 Winner Published: ' + data.winner + ' (#' + data.number + ')<br>🔄 New day started!', 'success');
                fetchData();
                switchPage('home');
            } else {
                showAlert('adminAlert', data.message, 'error');
            }
        })
        .catch(err => {
            showAlert('adminAlert', 'Connection error', 'error');
        });
}

function adminAddCoins() {
    const user = document.getElementById('adminUsername').value.trim();
    const coins = document.getElementById('adminCoins').value;
    const alertBox = document.getElementById('adminAlert');

    if (!user || !coins || coins < 1) {
        showAlert('adminAlert', 'Please enter valid username and coins amount', 'error');
        return;
    }

    const formData = new URLSearchParams();
    formData.append('username', user);
    formData.append('coins', coins);

    fetch('add_coin.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                showAlert('adminAlert', '✅ Added ' + coins + ' coins to ' + user, 'success');
                document.getElementById('adminUsername').value = '';
                document.getElementById('adminCoins').value = '';
            } else {
                showAlert('adminAlert', data.message, 'error');
            }
        })
        .catch(err => {
            showAlert('adminAlert', 'Connection error', 'error');
        });
}

function showAlert(elementId, message, type) {
    const el = document.getElementById(elementId);
    el.innerHTML = '<div class="alert alert-' + type + '">' + message + '</div>';
    setTimeout(() => { el.innerHTML = ''; }, 5000);
}