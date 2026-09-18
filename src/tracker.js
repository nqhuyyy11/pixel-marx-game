/**
 * Pixel Marx MLN111 - Student Progress Tracker & Leaderboard Client
 * Manages player identity (MSSV, Name), 10-minute deadline timer, heartbeat syncing, and win logging.
 */
(() => {
  'use strict';

  const STORAGE_KEY = 'pixelMarxStudentProfile';
  const LOCAL_LEADERBOARD_KEY = 'pixelMarxLocalWinners';
  const HEARTBEAT_INTERVAL = 4000; // 4 seconds
  const MAX_DEADLINE_SECONDS = 600; // 10 minutes limit

  class PlayerTracker {
    constructor() {
      this.profile = this.loadProfile();
      this.startTime = null;
      this.elapsedSeconds = 0;
      this.maxDeadlineSeconds = MAX_DEADLINE_SECONDS;
      this.timerInterval = null;
      this.heartbeatInterval = null;
      this.currentChapter = 0;
      this.currentScore = 0;
      this.currentHp = 100;
      this.isGameActive = false;
      this.isGameWon = false;
      this.isTimedOut = false;
      this.socket = null;
      this.apiBase = window.location.origin.startsWith('http') ? window.location.origin : '';
      
      this.initWebSocket();
    }

    loadProfile() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    }

    saveProfile(studentId, fullName, classGroup) {
      this.profile = {
        studentId: String(studentId).trim().toUpperCase(),
        fullName: String(fullName).trim(),
        classGroup: String(classGroup || '').trim(),
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
      } catch (e) {
        // storage fallback
      }
      return this.profile;
    }

    clearProfile() {
      this.profile = null;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    }

    hasProfile() {
      return !!(this.profile && this.profile.studentId && this.profile.fullName);
    }

    initWebSocket() {
      if (!window.WebSocket || !this.apiBase) return;
      try {
        const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${proto}//${window.location.host}/ws`;
        this.socket = new WebSocket(wsUrl);

        this.socket.onclose = () => {
          setTimeout(() => this.initWebSocket(), 5000);
        };
      } catch (e) {
        // Fallback to pure HTTP API
      }
    }

    formatTime(seconds) {
      const s = Math.max(0, Math.floor(seconds || 0));
      const mins = Math.floor(s / 60);
      const secs = Math.floor(s % 60);
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    getPhilosophicalTitle(seconds) {
      if (seconds <= 300) return '🥇 Bậc Thầy Biện Chứng';
      if (seconds <= 420) return '🥈 Triết Gia Xuất Sắc';
      if (seconds <= 600) return '🥉 Vượt Qua Deadline';
      return 'Trễ Deadline';
    }

    // Called when player starts playing
    startGame(chapterIndex = 0) {
      this.isGameActive = true;
      this.isGameWon = false;
      this.isTimedOut = false;
      this.currentChapter = chapterIndex;
      this.currentScore = 0;
      this.currentHp = 100;
      this.elapsedSeconds = 0;
      this.startTime = Date.now();

      // Start elapsed timer & deadline countdown
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        if (this.isGameActive && !this.isGameWon && !this.isTimedOut) {
          this.elapsedSeconds += 1;
          this.updateHUDTimer();

          // Check deadline expiration (10 minutes)
          if (this.elapsedSeconds >= this.maxDeadlineSeconds) {
            this.handleTimeout();
          }
        }
      }, 1000);

      // Start heartbeat
      if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = setInterval(() => {
        this.sendHeartbeat();
      }, HEARTBEAT_INTERVAL);

      // Inform server
      if (this.hasProfile()) {
        this.apiCall('/api/player/join', {
          studentId: this.profile.studentId,
          fullName: this.profile.fullName,
          classGroup: this.profile.classGroup,
        });
      }

      this.updateHUDTimer();
    }

    handleTimeout() {
      this.isTimedOut = true;
      this.isGameActive = false;
      if (this.timerInterval) clearInterval(this.timerInterval);
      if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);

      if (this.hasProfile()) {
        this.apiCall('/api/player/progress', {
          studentId: this.profile.studentId,
          chapterIndex: this.currentChapter,
          score: this.currentScore,
          hp: this.currentHp,
          elapsedTime: this.elapsedSeconds,
          status: 'timeout',
        });
      }

      if (window.onGameDeadlineTimeout) {
        window.onGameDeadlineTimeout();
      }
    }

    // Called on chapter change
    enterChapter(chapterIndex) {
      this.currentChapter = chapterIndex;
      this.sendHeartbeat();
    }

    // Called on score or HP change
    updateState(score, hp) {
      if (typeof score === 'number') this.currentScore = score;
      if (typeof hp === 'number') this.currentHp = hp;
    }

    // Called when game is finished / won
    finishGame(finalScore) {
      if (this.isGameWon || this.isTimedOut) return;
      this.isGameWon = true;
      this.isGameActive = false;
      this.currentChapter = 3; // Win
      if (typeof finalScore === 'number') this.currentScore = finalScore;

      if (this.timerInterval) clearInterval(this.timerInterval);
      if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);

      const totalTime = this.elapsedSeconds;
      const score = this.currentScore;
      const title = this.getPhilosophicalTitle(totalTime);

      if (this.hasProfile()) {
        this.apiCall('/api/player/finish', {
          studentId: this.profile.studentId,
          finalScore: score,
          totalTime: totalTime,
          title: title,
        }).then(res => {
          if (res && res.rank) {
            this.showWinBanner(res.rank, totalTime, score, title);
          }
        }).catch(() => {
          this.saveLocalWinRecord(totalTime, score, title);
        });
      } else {
        this.saveLocalWinRecord(totalTime, score, title);
      }
    }

    saveLocalWinRecord(totalTime, score, title) {
      const record = {
        studentId: this.profile ? this.profile.studentId : 'SV-ANONYMOUS',
        fullName: this.profile ? this.profile.fullName : 'Sinh viên FPT',
        classGroup: this.profile ? this.profile.classGroup : '',
        totalTime,
        timeFormatted: this.formatTime(totalTime),
        score,
        title: title || this.getPhilosophicalTitle(totalTime),
        completedAt: new Date().toISOString(),
      };
      try {
        const raw = localStorage.getItem(LOCAL_LEADERBOARD_KEY);
        const list = raw ? JSON.parse(raw) : [];
        list.push(record);
        localStorage.setItem(LOCAL_LEADERBOARD_KEY, JSON.stringify(list));
      } catch (e) {}
    }

    sendHeartbeat() {
      if (!this.hasProfile() || !this.isGameActive) return;
      this.apiCall('/api/player/progress', {
        studentId: this.profile.studentId,
        chapterIndex: this.currentChapter,
        score: this.currentScore,
        hp: this.currentHp,
        elapsedTime: this.elapsedSeconds,
        status: this.isGameWon ? 'won' : (this.isTimedOut ? 'timeout' : 'playing'),
      });
    }

    updateHUDTimer() {
      const timerNode = document.getElementById('hudLiveTimer');
      const remainNode = document.getElementById('hudRemainTimer');
      const remain = Math.max(0, this.maxDeadlineSeconds - this.elapsedSeconds);

      if (timerNode) {
        timerNode.textContent = this.formatTime(this.elapsedSeconds);
      }

      if (remainNode) {
        remainNode.textContent = this.formatTime(remain);
        if (remain <= 60) {
          remainNode.style.color = 'var(--red)';
        } else if (remain <= 180) {
          remainNode.style.color = 'var(--yellow)';
        } else {
          remainNode.style.color = 'var(--cyan)';
        }
      }
    }

    showWinBanner(rank, totalTime, score, title) {
      const timeStr = this.formatTime(totalTime);
      const msg = `🎉 CHÚC MỪNG BẠN ĐÃ PHÁ ĐẢO!\n🏆 Danh hiệu: ${title}\n🏅 Xếp hạng: #${rank}\n⏱️ Thời gian: ${timeStr} / 10:00\n⭐ Điểm số: ${score}`;
      console.log(msg);
    }

    async apiCall(endpoint, body) {
      try {
        const res = await fetch(`${this.apiBase}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        return await res.json();
      } catch (err) {
        return null;
      }
    }

    async getLeaderboard() {
      try {
        const res = await fetch(`${this.apiBase}/api/leaderboard`);
        const json = await res.json();
        return json.winners || [];
      } catch (err) {
        try {
          const raw = localStorage.getItem(LOCAL_LEADERBOARD_KEY);
          return raw ? JSON.parse(raw) : [];
        } catch (e) {
          return [];
        }
      }
    }
  }

  window.playerTracker = new PlayerTracker();
})();
