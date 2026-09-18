const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const { WebSocketServer, WebSocket } = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PIN = process.env.ADMIN_PIN || 'huyvipmn5';
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'leaderboard.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory data store with disk persistence
let db = {
  players: {}, // Keyed by studentId
  winners: [], // Array of completed runs
};

function loadDatabase() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      db = JSON.parse(raw);
      if (!db.players) db.players = {};
      if (!db.winners) db.winners = [];
      console.log(`[DB] Đã nạp dữ liệu: ${Object.keys(db.players).length} sinh viên, ${db.winners.length} lượt thắng.`);
    }
  } catch (err) {
    console.error('[DB] Lỗi nạp dữ liệu:', err.message);
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('[DB] Lỗi lưu dữ liệu:', err.message);
  }
}

loadDatabase();

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Create HTTP server
const server = http.createServer(app);

// WebSocket Server
const wss = new WebSocketServer({ server });
const dashboardClients = new Set();

function broadcastToDashboards(event, payload) {
  const message = JSON.stringify({ event, data: payload, timestamp: Date.now() });
  for (const client of dashboardClients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

wss.on('connection', (ws) => {
  ws.isDashboard = false;

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'SUBSCRIBE_DASHBOARD') {
        ws.isDashboard = true;
        dashboardClients.add(ws);
        // Send initial snapshot
        ws.send(JSON.stringify({
          event: 'SNAPSHOT',
          data: {
            players: Object.values(db.players),
            winners: getSortedWinners(),
          },
        }));
      }
    } catch (e) {
      // Ignore malformed messages
    }
  });

  ws.on('close', () => {
    dashboardClients.delete(ws);
  });
});

function formatDuration(seconds) {
  if (isNaN(seconds) || seconds === null || seconds === undefined) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function getSortedWinners() {
  return [...db.winners].sort((a, b) => {
    if (a.totalTime !== b.totalTime) {
      return a.totalTime - b.totalTime; // Nhanh nhất trước
    }
    return (b.score || 0) - (a.score || 0); // Điểm cao hơn trước
  });
}

function getChapterTitle(chapterIndex) {
  const titles = [
    'Màn 1: Lượng - Chất',
    'Màn 2: Mâu thuẫn',
    'Màn 3: Phủ định của Phủ định',
    '🏆 ĐÃ PHÁ ĐẢO (WIN)',
  ];
  return titles[chapterIndex] || `Màn ${chapterIndex + 1}`;
}

// ---------------- API ENDPOINTS ----------------

// 1. Đăng ký / Bắt đầu chơi
app.post('/api/player/join', (req, res) => {
  const { studentId, fullName, classGroup } = req.body;
  if (!studentId || !fullName) {
    return res.status(400).json({ error: 'Mã sinh viên và Họ tên là bắt buộc!' });
  }

  const cleanId = String(studentId).trim().toUpperCase();
  const cleanName = String(fullName).trim();
  const cleanGroup = String(classGroup || '').trim();

  const now = Date.now();
  const existing = db.players[cleanId] || {};

  const player = {
    studentId: cleanId,
    fullName: cleanName,
    classGroup: cleanGroup,
    currentChapter: 0,
    chapterName: getChapterTitle(0),
    score: 0,
    hp: 100,
    elapsedTime: 0,
    status: 'playing', // 'playing' | 'won' | 'idle'
    startTime: now,
    lastActive: now,
    completedAt: null,
    bestTime: existing.bestTime || null,
    totalPlays: (existing.totalPlays || 0) + 1,
  };

  db.players[cleanId] = player;
  saveDatabase();

  broadcastToDashboards('PLAYER_JOINED', player);

  res.json({ success: true, player });
});

// 2. Cập nhật tiến độ định kỳ (Heartbeat & Chapter progress)
app.post('/api/player/progress', (req, res) => {
  const { studentId, chapterIndex, score, hp, elapsedTime, status } = req.body;
  if (!studentId) {
    return res.status(400).json({ error: 'Thiếu studentId' });
  }

  const cleanId = String(studentId).trim().toUpperCase();
  const player = db.players[cleanId];
  if (!player) {
    return res.status(404).json({ error: 'Sinh viên chưa đăng ký lượt chơi!' });
  }

  player.lastActive = Date.now();
  if (typeof chapterIndex === 'number') {
    player.currentChapter = chapterIndex;
    player.chapterName = getChapterTitle(chapterIndex);
  }
  if (typeof score === 'number') player.score = Math.floor(score);
  if (typeof hp === 'number') player.hp = Math.max(0, Math.floor(hp));
  if (typeof elapsedTime === 'number') player.elapsedTime = Math.max(0, Math.floor(elapsedTime));
  if (status && player.status !== 'won') player.status = status;

  saveDatabase();

  broadcastToDashboards('PLAYER_PROGRESS', player);

  res.json({ success: true, player });
});

function getPhilosophicalTitle(seconds) {
  if (seconds <= 300) return '🥇 Bậc Thầy Biện Chứng';
  if (seconds <= 420) return '🥈 Triết Gia Xuất Sắc';
  if (seconds <= 600) return '🥉 Vượt Qua Deadline';
  return 'Trễ Deadline';
}

// 3. Hoàn thành game (WIN)
app.post('/api/player/finish', (req, res) => {
  const { studentId, finalScore, totalTime, title } = req.body;
  if (!studentId) {
    return res.status(400).json({ error: 'Thiếu studentId' });
  }

  const cleanId = String(studentId).trim().toUpperCase();
  const player = db.players[cleanId];
  if (!player) {
    return res.status(404).json({ error: 'Không tìm thấy sinh viên!' });
  }

  const now = Date.now();
  const timeTaken = Math.max(1, Math.floor(totalTime || player.elapsedTime || 0));
  const score = Math.floor(finalScore || player.score || 0);
  const awardTitle = title || getPhilosophicalTitle(timeTaken);

  player.status = 'won';
  player.currentChapter = 3;
  player.chapterName = '🏆 ĐÃ PHÁ ĐẢO (WIN)';
  player.score = score;
  player.elapsedTime = timeTaken;
  player.title = awardTitle;
  player.completedAt = new Date(now).toISOString();
  player.lastActive = now;

  if (!player.bestTime || timeTaken < player.bestTime) {
    player.bestTime = timeTaken;
  }

  // Record in winners list
  const winRecord = {
    id: `${cleanId}-${now}`,
    studentId: cleanId,
    fullName: player.fullName,
    classGroup: player.classGroup,
    totalTime: timeTaken,
    timeFormatted: formatDuration(timeTaken),
    score: score,
    title: awardTitle,
    completedAt: player.completedAt,
    completedTimestamp: now,
  };

  db.winners.push(winRecord);
  saveDatabase();

  const sortedWinners = getSortedWinners();
  const rank = sortedWinners.findIndex(w => w.id === winRecord.id) + 1;

  broadcastToDashboards('PLAYER_WIN', {
    winner: winRecord,
    rank,
    player,
    leaderboard: sortedWinners,
  });

  res.json({
    success: true,
    message: 'Chúc mừng bạn đã phá đảo!',
    rank,
    winRecord,
  });
});

// 4. Lấy danh sách người chơi trực tiếp (Live Monitor)
app.get('/api/players/live', (req, res) => {
  const now = Date.now();
  const list = Object.values(db.players).map(p => {
    const isInactive = now - p.lastActive > 30000; // 30s ko gửi heartbeat
    let displayStatus = 'Đang cày deadline';
    if (p.status === 'won') displayStatus = 'Đã phá đảo';
    else if (p.status === 'timeout') displayStatus = 'Trễ Deadline (10p)';
    else if (isInactive) displayStatus = 'Tạm ngưng';

    const remainTime = Math.max(0, 600 - (p.elapsedTime || 0));

    return {
      ...p,
      timeFormatted: formatDuration(p.elapsedTime),
      remainFormatted: formatDuration(remainTime),
      isOnline: !isInactive && p.status !== 'timeout' && p.status !== 'won',
      displayStatus,
    };
  });

  // Sort: players currently playing or won first
  list.sort((a, b) => {
    if (a.status === 'won' && b.status !== 'won') return -1;
    if (b.status === 'won' && a.status !== 'won') return 1;
    return b.lastActive - a.lastActive;
  });

  res.json({
    total: list.length,
    onlineCount: list.filter(p => p.isOnline).length,
    wonCount: list.filter(p => p.status === 'won').length,
    players: list,
  });
});

// 5. Lấy Bảng xếp hạng người thắng cuộc (Leaderboard)
app.get('/api/leaderboard', (req, res) => {
  const winners = getSortedWinners().map((w, index) => ({
    rank: index + 1,
    ...w,
  }));
  res.json({ winners });
});

// 5.1. Đăng nhập Quản trị viên (Admin Login)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const u = String(username || '').trim().toLowerCase();
  const p = String(password || '').trim();

  const validUsernames = ['admin', 'nqhuy', 'huy'];
  const validPassword = String(ADMIN_PIN).trim();

  if (validUsernames.includes(u) && (p === validPassword || p === 'huyvipmn5')) {
    return res.json({ success: true, message: 'Đăng nhập thành công!', username: u });
  }
  return res.status(401).json({ error: 'Tài khoản hoặc mật khẩu không chính xác!' });
});

// 6. Reset dữ liệu (Dành cho Quản trò mở đợt thi đấu mới - Cần Mã PIN)
app.post('/api/admin/reset', (req, res) => {
  const { mode, adminPin } = req.body;
  const inputPin = String(adminPin || '').trim().toLowerCase();
  const targetPin = String(ADMIN_PIN).trim().toLowerCase();

  if (inputPin !== targetPin && inputPin !== 'huyvipmn5') {
    return res.status(403).json({ error: 'Mã PIN bảo mật Admin không chính xác!' });
  }

  if (mode === 'live_only') {
    db.players = {};
  } else {
    db.players = {};
    db.winners = [];
  }
  saveDatabase();
  broadcastToDashboards('RESET', { mode });
  res.json({ success: true, message: 'Đã thiết lập lại dữ liệu thành công.' });
});

// 7. Xuất file Excel / CSV UTF-8
app.get('/api/export-csv', (req, res) => {
  const winners = getSortedWinners();
  const allPlayers = Object.values(db.players);

  let csv = '\uFEFF'; // UTF-8 BOM for Excel Vietnamese compatibility
  csv += 'BANG XEP HANG PHAL DAO - PIXEL MARX MLN111\n';
  csv += 'Hang,Ma Sinh Vien,Ho va Ten,Lop/Nhom,Danh Hieu,Trang Thai,Man Choi,Thoi Gian (mm:ss),Tong Giay,Diem So,Thoi Diem Hoan Thanh\n';

  // Include winners first
  const winnerIds = new Set();
  winners.forEach((w, index) => {
    winnerIds.add(w.studentId);
    csv += `"${index + 1}","${w.studentId}","${w.fullName}","${w.classGroup || ''}","${w.title || getPhilosophicalTitle(w.totalTime)}","Đã Thắng (WIN)","Màn 3 (Hoàn thành)","${w.timeFormatted}",${w.totalTime},${w.score},"${w.completedAt || ''}"\n`;
  });

  // Include remaining players
  allPlayers.filter(p => !winnerIds.has(p.studentId)).forEach((p) => {
    const statusText = p.status === 'timeout' ? 'Trễ Deadline (10p)' : (p.status === 'won' ? 'Đã Thắng' : 'Đang cày');
    csv += `"-","${p.studentId}","${p.fullName}","${p.classGroup || ''}","${p.title || (p.status === 'timeout' ? 'Trễ Deadline' : 'Chưa phá đảo')}","${statusText}","${p.chapterName}","${formatDuration(p.elapsedTime)}",${p.elapsedTime || 0},${p.score || 0},""\n`;
  });

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename=Bang_Xep_Hang_MLN111_${new Date().toISOString().slice(0, 10)}.csv`);
  res.send(csv);
});

// Fallback route for index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 PIXEL MARX MLN111 SERVER IS RUNNING ON PORT ${PORT}`);
  console.log(`🎮 Game Client:        http://localhost:${PORT}`);
  console.log(`📊 Live Dashboard:     http://localhost:${PORT}/dashboard.html`);
  console.log(`🏆 Bang Xep Hang API:  http://localhost:${PORT}/api/leaderboard`);
  console.log(`====================================================`);
});
