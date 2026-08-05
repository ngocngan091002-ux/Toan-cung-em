/* ==========================================================================
   TOÁN CÙNG EM - STUDENT PORTAL CONTROLLER (DAILY MISSIONS, GAMES, ANTI-CHEAT TEST)
   ========================================================================== */

const StudentPortal = {
  // Test state variables
  testActive: false,
  testQuestions: [],
  currentQuestionIdx: 0,
  userAnswers: {},
  timerInterval: null,
  timeLeftSeconds: 300, // 5 minutes timer
  tabSwitchCount: 0,
  maxAllowedTabSwitches: 3,

  // Initialize Student Portal
  init() {
    this.renderHeaderStats();
    this.renderMissions();
    this.setupAntiCheatListeners();
  },

  // Update Stats in Top Navigation
  renderHeaderStats() {
    const user = Store.data.currentUser;
    const starsEl = document.getElementById('user-stars-count');
    const xpEl = document.getElementById('user-xp-count');
    if (starsEl) starsEl.textContent = user.stars;
    if (xpEl) xpEl.textContent = `${user.xp} XP`;
  },

  // Render Daily Missions List
  renderMissions() {
    const container = document.getElementById('daily-missions-list');
    if (!container) return;

    const missions = Store.data.dailyMissions;
    container.innerHTML = missions.map(m => `
      <div class="mission-item ${m.completed ? 'completed' : ''}">
        <div class="mission-icon">${m.icon}</div>
        <div class="mission-info">
          <div class="mission-name">${m.title}</div>
          <div class="mission-desc">${m.desc} (Thưởng: +${m.xp} XP, +${m.stars} ⭐)</div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${m.completed ? 100 : (m.progress / m.target * 100)}%;"></div>
          </div>
        </div>
        <div>
          ${m.completed 
            ? '<span class="badge-done" style="color: #10B981; font-weight: 800; font-size: 0.9rem;">✅ Đã nhận</span>'
            : `<button class="btn-primary" onclick="StudentPortal.claimMission('${m.id}')">Hoàn thành</button>`
          }
        </div>
      </div>
    `).join('');
  },

  // Claim Mission reward
  claimMission(id) {
    if (Store.completeMission(id)) {
      this.renderHeaderStats();
      this.renderMissions();
      App.showToast('🎉 Chúc mừng bé đã hoàn thành nhiệm vụ và nhận thưởng XP/Sao!');
    }
  },

  // Start Weekly Timed Test
  startWeeklyTest() {
    this.testActive = true;
    this.testQuestions = Store.getTestQuestions(6);
    this.currentQuestionIdx = 0;
    this.userAnswers = {};
    this.tabSwitchCount = 0;
    this.timeLeftSeconds = 300; // 5 minutes

    const mainContainer = document.getElementById('student-tab-content');
    mainContainer.innerHTML = `
      <div class="test-container">
        <div class="test-header">
          <div>
            <h2 style="color: #0F172A; font-size: 1.6rem;">📝 Bài Kiểm Tra Hằng Tuần (Lớp 2)</h2>
            <p style="color: #64748B; font-weight: 600; margin-top: 4px;">Câu hỏi ngẫu nhiên • Tự động chấm điểm • Chống gian lận active</p>
          </div>
          <div style="display: flex; gap: 12px; align-items: center;">
            <div class="anti-cheat-badge">
              🛡️ Anti-Cheat: Bật (Chuyển tab: <span id="tab-switch-counter">0</span>/3)
            </div>
            <div class="timer-box" id="test-timer-display">
              ⏱️ 05:00
            </div>
          </div>
        </div>

        <div id="test-question-area">
          ${this.renderQuestionCard(0)}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px;">
          <button class="btn-secondary" onclick="StudentPortal.prevQuestion()" ${this.currentQuestionIdx === 0 ? 'disabled' : ''}>⬅️ Câu trước</button>
          <div style="font-weight: 800; color: #475569;" id="question-tracker-text">Câu 1 / ${this.testQuestions.length}</div>
          <button class="btn-primary" onclick="StudentPortal.nextQuestion()" id="next-submit-btn">Câu tiếp ➡️</button>
        </div>
      </div>
    `;

    this.startTimer();
    App.showToast('🚀 Bài kiểm tra đã bắt đầu! Chúc bé làm bài đạt điểm cao!');
  },

  // Render individual Question Card
  renderQuestionCard(idx) {
    const q = this.testQuestions[idx];
    const selectedAns = this.userAnswers[q.id];

    return `
      <div class="question-box">
        <div style="font-size: 0.85rem; font-weight: 800; color: #0284C7; text-transform: uppercase; margin-bottom: 8px;">
          📌 Dạng toán: ${q.topic}
        </div>
        <div class="question-text">Câu ${idx + 1}: ${q.question}</div>
        <div class="options-grid">
          ${q.options.map((opt, oIdx) => `
            <button class="option-btn ${selectedAns === oIdx ? 'selected' : ''}" onclick="StudentPortal.selectOption('${q.id}', ${oIdx})">
              <span><strong>${String.fromCharCode(65 + oIdx)}.</strong> ${opt}</span>
              ${selectedAns === oIdx ? '✔' : ''}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  },

  // Select Option for question
  selectOption(qId, optionIdx) {
    this.userAnswers[qId] = optionIdx;
    document.getElementById('test-question-area').innerHTML = this.renderQuestionCard(this.currentQuestionIdx);
  },

  // Next Question or Submit
  nextQuestion() {
    if (this.currentQuestionIdx < this.testQuestions.length - 1) {
      this.currentQuestionIdx++;
      document.getElementById('test-question-area').innerHTML = this.renderQuestionCard(this.currentQuestionIdx);
      document.getElementById('question-tracker-text').textContent = `Câu ${this.currentQuestionIdx + 1} / ${this.testQuestions.length}`;
      if (this.currentQuestionIdx === this.testQuestions.length - 1) {
        document.getElementById('next-submit-btn').textContent = '🏁 Nộp bài thi';
        document.getElementById('next-submit-btn').style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
      }
    } else {
      this.submitTest(false);
    }
  },

  // Previous Question
  prevQuestion() {
    if (this.currentQuestionIdx > 0) {
      this.currentQuestionIdx--;
      document.getElementById('test-question-area').innerHTML = this.renderQuestionCard(this.currentQuestionIdx);
      document.getElementById('question-tracker-text').textContent = `Câu ${this.currentQuestionIdx + 1} / ${this.testQuestions.length}`;
      document.getElementById('next-submit-btn').textContent = 'Câu tiếp ➡️';
      document.getElementById('next-submit-btn').style.background = 'linear-gradient(135deg, #10B981, #059669)';
    }
  },

  // Start Test Timer
  startTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeLeftSeconds--;
      const mins = String(Math.floor(this.timeLeftSeconds / 60)).padStart(2, '0');
      const secs = String(this.timeLeftSeconds % 60).padStart(2, '0');
      const timerEl = document.getElementById('test-timer-display');
      if (timerEl) {
        timerEl.textContent = `⏱️ ${mins}:${secs}`;
      }

      if (this.timeLeftSeconds <= 0) {
        clearInterval(this.timerInterval);
        App.showToast('⏰ Hết giờ làm bài! Hệ thống tự động nộp bài...');
        this.submitTest(true);
      }
    }, 1000);
  },

  // Anti-Cheat Monitor Event Listener (visibilitychange & blur)
  setupAntiCheatListeners() {
    document.addEventListener('visibilitychange', () => {
      if (this.testActive && document.hidden) {
        this.handleAntiCheatViolation();
      }
    });

    window.addEventListener('blur', () => {
      if (this.testActive) {
        this.handleAntiCheatViolation();
      }
    });
  },

  // Handle Tab-Switch / Focus Loss Violation
  handleAntiCheatViolation() {
    this.tabSwitchCount++;
    const counterEl = document.getElementById('tab-switch-counter');
    if (counterEl) counterEl.textContent = this.tabSwitchCount;

    const modal = document.getElementById('anti-cheat-warning-modal');
    const msgEl = document.getElementById('warning-modal-desc');
    if (modal && msgEl) {
      msgEl.textContent = `Bé ơi! Hệ thống ghi nhận bé vừa rời khỏi trang thi (${this.tabSwitchCount}/${this.maxAllowedTabSwitches} lần). Vui lòng tập trung không chuyển tab!`;
      modal.classList.add('active');
    }

    if (this.tabSwitchCount >= this.maxAllowedTabSwitches) {
      setTimeout(() => {
        if (modal) modal.classList.remove('active');
        alert('⚠️ Bé đã vi phạm quá 3 lần rời màn hình thi! Hệ thống tự động khóa & nộp bài.');
        this.submitTest(true, true);
      }, 1000);
    }
  },

  // Close Anti-Cheat Modal
  closeWarningModal() {
    const modal = document.getElementById('anti-cheat-warning-modal');
    if (modal) modal.classList.remove('active');
  },

  // Submit Test & Render Results View
  submitTest(isAuto = false, cheatFlagged = false) {
    clearInterval(this.timerInterval);
    this.testActive = false;

    // Calculate score
    let correctCount = 0;
    const weakTopics = [];

    this.testQuestions.forEach(q => {
      const userAns = this.userAnswers[q.id];
      if (userAns === q.answer) {
        correctCount++;
      } else {
        if (!weakTopics.includes(q.topic)) weakTopics.push(q.topic);
      }
    });

    const score = Number(((correctCount / this.testQuestions.length) * 10).toFixed(2));
    const timeSpent = 300 - this.timeLeftSeconds;

    const submission = {
      id: 'sub_' + Date.now(),
      studentId: Store.data.currentUser.id,
      studentName: Store.data.currentUser.name,
      testTitle: 'Bài kiểm tra Tuần 1',
      score: score,
      correctCount: correctCount,
      totalQuestions: this.testQuestions.length,
      timeSpentSeconds: timeSpent,
      tabSwitchCount: this.tabSwitchCount,
      cheatFlagged: cheatFlagged,
      submittedAt: new Date().toLocaleString('vi-VN'),
      teacherComment: score >= 8 ? 'Con làm bài tuyệt vời! Tiếp tục phát huy nhé 🌟' : 'Con chú ý đọc kỹ đề và kiểm tra lại bài làm nhé!',
      weakTopics: weakTopics
    };

    Store.submitTest(submission);
    this.renderHeaderStats();
    this.renderTestResultView(submission);
  },

  // Render Test Result View
  renderTestResultView(sub) {
    const mainContainer = document.getElementById('student-tab-content');
    mainContainer.innerHTML = `
      <div class="test-container" style="text-align: center;">
        <div style="font-size: 72px; margin-bottom: 12px;">${sub.score >= 8 ? '🏆' : (sub.score >= 5 ? '🌟' : '💪')}</div>
        <h2 style="font-size: 2rem; color: #0F172A; margin-bottom: 8px;">KẾT QUẢ BÀI KIỂM TRA</h2>
        <div style="font-size: 3rem; font-weight: 900; color: #2563EB; margin-bottom: 16px;">
          ${sub.score} / 10 Điểm
        </div>

        <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 28px;">
          <div class="stat-pill">✅ Đúng: ${sub.correctCount}/${sub.totalQuestions} câu</div>
          <div class="stat-pill">⏱️ Thời gian: ${Math.floor(sub.timeSpentSeconds / 60)} phút ${sub.timeSpentSeconds % 60}s</div>
          <div class="stat-pill" style="border-color: ${sub.tabSwitchCount > 0 ? '#FCA5A5' : '#86EFAC'};">
            🛡️ Vi phạm: ${sub.tabSwitchCount} lần
          </div>
        </div>

        <div style="background: #F0FDF4; border: 2px solid #86EFAC; border-radius: 16px; padding: 20px; max-width: 600px; margin: 0 auto 28px auto; text-align: left;">
          <h4 style="color: #166534; margin-bottom: 6px; font-size: 1.1rem;">👩‍🏫 Nhận xét từ Giáo viên:</h4>
          <p style="color: #15803D; font-weight: 700; font-size: 1rem;">"${sub.teacherComment}"</p>
        </div>

        <button class="btn-primary" onclick="App.switchStudentTab('dashboard')">🏠 Về Trang chủ Học tập</button>
      </div>
    `;
  },

  // Interactive Mini-Game Launcher (Jungle Adventure)
  launchJungleGame() {
    const mainContainer = document.getElementById('student-tab-content');
    let score = 0;
    let num1 = Math.floor(Math.random() * 40) + 10;
    let num2 = Math.floor(Math.random() * 40) + 10;
    let correctAns = num1 + num2;

    mainContainer.innerHTML = `
      <div class="test-container" style="text-align: center; background: linear-gradient(180deg, #ECFDF5 0%, #D1FAE5 100%); border-color: #34D399;">
        <div style="font-size: 56px;">🌴 🦁 🌴</div>
        <h2 style="color: #065F46; font-size: 1.8rem; margin-bottom: 6px;">THÁM HIỂM RỪNG XANH TOÁN HỌC</h2>
        <p style="color: #047857; font-weight: 700; margin-bottom: 20px;">Giúp chú Sư tử vượt qua chướng ngại vật bằng cách tính đúng phép tính!</p>

        <div style="background: white; border-radius: 20px; padding: 28px; border: 3px solid #10B981; max-width: 480px; margin: 0 auto 24px auto; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.2);">
          <div style="font-size: 1.1rem; font-weight: 800; color: #059669; margin-bottom: 12px;">Điểm số: <span id="game-score">0</span> XP</div>
          <div style="font-size: 2.5rem; font-weight: 900; color: #064E3B; margin-bottom: 20px;" id="game-math-expr">
            ${num1} + ${num2} = ?
          </div>
          <input type="number" id="game-user-input" class="chat-input" placeholder="Nhập kết quả..." style="font-size: 1.4rem; text-align: center; padding: 12px; width: 80%; border-color: #10B981; margin-bottom: 16px;">
          <br>
          <button class="btn-primary" onclick="StudentPortal.checkGameAnswer(${correctAns})">🚀 Trả lời ngay!</button>
        </div>

        <button class="btn-secondary" onclick="App.switchStudentTab('games')">⬅️ Quay lại Đấu trường Game</button>
      </div>
    `;
  },

  // Check Mini-game answer
  checkGameAnswer(expected) {
    const inputEl = document.getElementById('game-user-input');
    const val = parseInt(inputEl.value);

    if (val === expected) {
      App.showToast('🎉 Chính xác! Bé được cộng +20 XP vào quỹ thưởng Rừng Xanh!');
      Store.data.currentUser.xp += 20;
      this.renderHeaderStats();
      this.launchJungleGame(); // Next question
    } else {
      App.showToast('❌ Thử lại nhé bé ơi! Lấy hàng đơn vị cộng hàng đơn vị trước nè.');
    }
  }
};
