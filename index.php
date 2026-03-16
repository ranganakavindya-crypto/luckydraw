<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>LuckyX - Daily 100 Box Draw</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Navigation -->
    <nav>
        <div class="logo">Lucky<span>X</span></div>
        <ul>
            <li><a href="#" data-page="home" class="active">Home</a></li>
            <li><a href="#" data-page="play">Play</a></li>
            <li><a href="#" data-page="admin" id="navAdmin">Admin</a></li>
            <li><a href="#" data-page="support">Support</a></li>
        </ul>
        <button id="loginBtn">Login</button>
    </nav>

    <!-- Main Content -->
    <main>
        <!-- HOME PAGE -->
        <section id="home" class="page active">
            <div class="hero">
                <div class="hero-main">
                    <h1 class="hero-title">Pick <span>your number</span> and watch the reveal.</h1>
                    <p class="text-muted">
                        Players choose a number from 1–100 using coins. Admin publishes the winning number daily.
                    </p>
                    <div class="hero-cta">
                        <button class="btn btn-primary" onclick="switchPage('play')">🎮 Start Playing</button>
                        <button class="btn btn-outline" onclick="switchPage('support')">❓ How It Works</button>
                    </div>
                </div>

                <div class="hero-side">
                    <h3>🏆 Today's Winner</h3>
                    <div id="todayWinner" class="winner-card no-winner">
                        <div class="winner-card-content">
                            <div class="winner-label">Winning Number</div>
                            <div class="winner-number-badge">
                                <span class="winner-number" id="winnerNumDisplay">--</span>
                            </div>
                            <div class="winner-trophy" id="winnerTrophy">⏳</div>
                            <div class="winner-name" id="winnerNameDisplay">No winner published yet</div>
                            <div class="winner-congrats" id="winnerCongrats"></div>
                        </div>
                    </div>
                    <hr>
                    <small id="todayWinnerHint">Admin selects any number and publishes today's winner.</small>
                </div>
            </div>

            <div class="stats">
                <div class="stat-card">
                    <div class="stat-val" id="statPlayers">0</div>
                    <div class="stat-lbl">Total Players</div>
                </div>
                <div class="stat-card">
                    <div class="stat-val" id="statDraws">0</div>
                    <div class="stat-lbl">Draws Completed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-val">100</div>
                    <div class="stat-lbl">Numbers Available</div>
                </div>
            </div>
        </section>

        <!-- PLAY PAGE -->
        <section id="play" class="page">
            <div class="play-header">
                <div class="player-info">
                    <span>👤 <strong id="playerName">Not logged in</strong></span>
                    <span class="player-coins">💰 <span id="playerCoins">0</span></span>
                </div>
                <button class="btn btn-outline" onclick="switchPage('home')">← Back</button>
            </div>
            <div id="playAlert"></div>
            <h3 class="section-title">Select Your Number (10 coins)</h3>
            <div id="numberGrid"></div>
        </section>

        <!-- ADMIN PAGE -->
        <section id="admin" class="page">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px">
                <h2 class="section-title" style="margin:0">⚙️ Admin Panel</h2>
                <button class="btn btn-outline" onclick="switchPage('home')">← Back</button>
            </div>
            <div id="adminAlert"></div>
            <div class="admin-panel">
                <h3 style="margin-bottom:16px">🎯 Publish Winner</h3>
                <div class="admin-row">
                    <select id="adminWinSelect">
                        <option value="">-- Select Number --</option>
                    </select>
                    <button class="btn btn-primary" onclick="adminPublishWinner()">✨ Publish</button>
                </div>
            </div>
            <div class="admin-panel">
                <h3 style="margin-bottom:16px">👥 Add Coins</h3>
                <div class="admin-row">
                    <input type="text" id="adminUsername" placeholder="Username">
                    <input type="number" id="adminCoins" placeholder="Amount" style="width:100px;flex:0">
                    <button class="btn btn-outline" onclick="adminAddCoins()">➕ Add</button>
                </div>
            </div>
            <div class="admin-panel">
                <h3 style="margin-bottom:16px">📜 History</h3>
                <div class="table-container">
                    <table class="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Number</th>
                                <th>Winner</th>
                                <th>Tickets</th>
                            </tr>
                        </thead>
                        <tbody id="historyBody"></tbody>
                    </table>
                </div>
            </div>
        </section>

        <!-- SUPPORT PAGE -->
        <section id="support" class="page">
            <h2 class="section-title">❓ How to Play</h2>
            <div style="background:rgba(30,41,59,0.8);padding:20px;border-radius:var(--radius)">
                <ol style="padding-left:20px;line-height:1.8">
                    <li><strong>Login or Register</strong> – Create your account to start playing</li>
                    <li><strong>Get Coins</strong> – New users get 10 free coins automatically</li>
                    <li><strong>Pick a Number</strong> – Choose any unbooked number from 1–100 (10 coins/ticket)</li>
                    <li><strong>Wait for Draw</strong> – At day's end, admin publishes the winning number</li>
                    <li><strong>Check Homepage</strong> – Winners are announced ONLY on the Home page</li>
                    <li><strong>New Day, New Chance</strong> – After winner publish, all numbers reset for fresh play</li>
                </ol>
                <p style="color:#94a3b8;border-top:1px solid rgba(148,163,184,0.3);padding-top:16px;margin-top:16px">
                    💡 <strong>Pro Tip:</strong> Book multiple numbers to increase your chances! Coins are virtual and for entertainment only.
                </p>
            </div>
            <button class="btn btn-primary" style="margin-top:20px" onclick="switchPage('play')">🎮 Play Now</button>
        </section>
    </main>

    <!-- Auth Modal -->
    <div id="authModal" class="modal">
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">&times;</button>
            <h3 id="authTitle">Login</h3>
            <div id="authAlert"></div>
            <div class="form-group">
                <label>Username</label>
                <input type="text" id="authUsername" placeholder="Enter username">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="authPassword" placeholder="Enter password">
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary" id="authSubmit">Login</button>
                <button class="btn btn-outline" id="authToggle">Need account? Register</button>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer>
        <p>🎰 LuckyX Daily Draw </p>
        <p style="margin-top:6px">Developed By AR Soft Pvt(Ltd).</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>