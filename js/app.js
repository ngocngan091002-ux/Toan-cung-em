/* ==========================================================================
   TOÁN CÙNG EM - MAIN APPLICATION CONTROLLER
   ========================================================================== */

const App = {
  currentRole: 'student', // 'student' or 'teacher'
  registerRole: 'student', // 'student' or 'teacher'

  init() {
    this.bindEvents();
    this.updateUserHeaderUI();
    this.switchRole(Store.data.currentUser.role || 'student');
    StudentPortal.init();
    TeacherPortal.init();
  },

  bindEvents() {
    // Role switch listeners
    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const role = e.target.getAttribute('data-role');
        this.switchRole(role);
      });
    });

    // Chat input Enter listener
    const chatInput = document.getElementById('ai-chat-input');
    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendAiChatMessage();
        }
      });
    }
  },

  // Update Top Navigation User Display Header
  updateUserHeaderUI() {
    const user = Store.data.currentUser;
    const displayContainer = document.getElementById('header-user-display');

    // Update Stars & XP in Top Bar
    const starsEl = document.getElementById('user-stars-count');
    const xpEl = document.getElementById('user-xp-count');
    if (starsEl) starsEl.textContent = user.stars || 0;
    if (xpEl) xpEl.textContent = (user.xp || 0) + ' XP';

    // Update Student Hero Banner Welcome Text dynamically
    const heroWelcomeEl = document.getElementById('hero-welcome-text');
    const mascotSpeechEl = document.getElementById('mascot-speech-text');

    if (user.role === 'student') {
      if (heroWelcomeEl) heroWelcomeEl.textContent = `Chào mừng ${user.name} đến với thế giới Toán học Lớp 2 cùng Trợ lý AI Panda!`;
      if (mascotSpeechEl) mascotSpeechEl.textContent = `"Chào ${user.name}! Cùng Panda chinh phục thử thách toán học hôm nay nhé! 🐾"`;
    } else {
      if (heroWelcomeEl) heroWelcomeEl.textContent = `Chào mừng ${user.name} đến với Bảng điều khiển Quản lý Lớp 2A!`;
      if (mascotSpeechEl) mascotSpeechEl.textContent = `"Chào ${user.name}! Chúc cô một ngày giảng dạy vui vẻ và hiệu quả! 🐾"`;
    }

    if (displayContainer) {
      displayContainer.innerHTML = `
        <span style="font-size: 1.2rem;">${user.avatar || (user.role === 'teacher' ? '👩‍🏫' : '👦')}</span>
        <span><strong>${user.name}</strong> (${user.role === 'teacher' ? 'Giáo viên' : 'Học sinh'})</span>
        <button class="btn-secondary" style="font-size: 0.75rem; padding: 3px 10px; border-radius: 12px; margin-left: 6px;" onclick="App.showAuthModal('login')">🔑 Đổi TK / Đăng ký</button>
        <button class="btn-secondary" style="font-size: 0.75rem; padding: 3px 8px; border-radius: 12px; background: #FEE2E2; color: #DC2626; border-color: #FCA5A5;" onclick="Store.logoutUser()">Thoát</button>
      `;
    }
  },

  // Show Auth Modal (login or register mode)
  showAuthModal(mode = 'login') {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.classList.add('active');
      this.switchAuthMode(mode);
    }
  },

  // Close Auth Modal
  closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('active');
  },

  // Switch between Login and Register mode in Auth Modal
  switchAuthMode(mode) {
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');
    const tabLogin = document.getElementById('tab-login-btn');
    const tabReg = document.getElementById('tab-register-btn');
    const titleEl = document.getElementById('auth-modal-title');

    if (mode === 'login') {
      if (loginForm) loginForm.style.display = 'block';
      if (regForm) regForm.style.display = 'none';
      if (tabLogin) tabLogin.classList.add('active');
      if (tabReg) tabReg.classList.remove('active');
      if (titleEl) titleEl.textContent = '🔐 Đăng Nhập Hệ Thống';
    } else {
      if (loginForm) loginForm.style.display = 'none';
      if (regForm) regForm.style.display = 'block';
      if (tabLogin) tabLogin.classList.remove('active');
      if (tabReg) tabReg.classList.add('active');
      if (titleEl) titleEl.textContent = '✨ Đăng Ký Tài Khoản Mới';
    }
  },

  // Select Register Role (Student or Teacher)
  selectRegisterRole(role) {
    this.registerRole = role;
    const stdBtn = document.getElementById('role-std-btn');
    const tchBtn = document.getElementById('role-tch-btn');

    if (role === 'student') {
      if (stdBtn) stdBtn.classList.add('selected');
      if (tchBtn) tchBtn.classList.remove('selected');
    } else {
      if (stdBtn) stdBtn.classList.remove('selected');
      if (tchBtn) tchBtn.classList.add('selected');
    }
  },

  // Handle Login Form Submit
  async handleLoginSubmit(e) {
    e.preventDefault();
    const uInput = document.getElementById('login-username');
    const pInput = document.getElementById('login-password');

    if (!uInput || !pInput) return;

    try {
      this.showToast('⏳ Đang kết nối xác thực dữ liệu Supabase...');
      const user = await Store.loginUser(uInput.value, pInput.value);
      this.closeAuthModal();
      this.updateUserHeaderUI();
      this.switchRole(user.role);
      this.showToast(`🎉 Xin chào mừng ${user.name} đã đăng nhập thành công!`);
    } catch (err) {
      alert('⚠️ ' + err.message);
    }
  },

  // Handle Register Form Submit
  async handleRegisterSubmit(e) {
    e.preventDefault();
    const fnInput = document.getElementById('reg-fullname');
    const uInput = document.getElementById('reg-username');
    const pInput = document.getElementById('reg-password');

    if (!fnInput || !uInput || !pInput) return;

    try {
      this.showToast('⏳ Đang tạo tài khoản mới trên Supabase Database...');
      const user = await Store.registerUser({
        username: uInput.value,
        password: pInput.value,
        fullName: fnInput.value,
        role: this.registerRole,
        avatar: this.registerRole === 'teacher' ? '👩‍🏫' : '👦'
      });

      this.closeAuthModal();
      this.updateUserHeaderUI();
      this.switchRole(user.role);
      this.showToast(`🎉 Chúc mừng ${user.name} đã đăng ký tài khoản thành công!`);
    } catch (err) {
      alert('⚠️ ' + err.message);
    }
  },

  // Switch between Student and Teacher roles with strict Authorization check
  switchRole(targetRole) {
    const user = Store.data.currentUser;

    // ACCOUNT ROLE AUTHORIZATION CHECK:
    if (user.role === 'student' && targetRole === 'teacher') {
      alert(`⚠️ Bạn đang đăng nhập tài khoản Học sinh (${user.name}). Khu vực này dành riêng cho Giáo viên!\n\nNếu là Giáo viên, vui lòng bấm "Đổi TK / Đăng ký" để đăng nhập bằng tài khoản Cô Mai hoặc tài khoản Giáo viên của bạn.`);
      return;
    }

    this.currentRole = targetRole;

    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-role') === targetRole);
    });

    const studentView = document.getElementById('student-view');
    const teacherView = document.getElementById('teacher-view');

    if (targetRole === 'student') {
      studentView.style.display = 'block';
      teacherView.style.display = 'none';
      this.switchStudentTab('dashboard');
    } else {
      studentView.style.display = 'none';
      teacherView.style.display = 'block';
      TeacherPortal.renderDashboard();
    }
  },

  // Switch tabs inside Student Portal
  switchStudentTab(tabName) {
    document.querySelectorAll('#student-tabs .tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });

    const container = document.getElementById('student-tab-content');
    if (!container) return;

    if (tabName === 'dashboard') {
      container.innerHTML = `
        <div class="grid-container" style="grid-template-columns: 2fr 1fr;">
          <!-- Left: Daily Missions -->
          <div class="card-box">
            <div class="card-title">
              <span>🎯 Nhiệm Vụ Hằng Ngày</span>
              <span style="font-size: 0.9rem; color: #0284C7; font-weight: 700;">Reset sau: 14h 30m</span>
            </div>
            <div id="daily-missions-list"></div>
          </div>

          <!-- Right: Quick Progress & Badges -->
          <div class="card-box" style="background: linear-gradient(180deg, #FEFCE8 0%, #FFFFFF 100%); border-color: #FEF08A;">
            <div class="card-title" style="color: #854D0E;">
              <span>🏆 Huy Hiệu Của Bé</span>
              <span>⭐</span>
            </div>
            <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px;">
              <div style="text-align: center; background: white; padding: 12px; border-radius: 16px; border: 2px solid #FEF08A; flex: 1;">
                <div style="font-size: 36px;">🥇</div>
                <div style="font-size: 0.8rem; font-weight: 800; color: #854D0E; margin-top: 4px;">Dũng sĩ Toán</div>
              </div>
              <div style="text-align: center; background: white; padding: 12px; border-radius: 16px; border: 2px solid #FEF08A; flex: 1;">
                <div style="font-size: 36px;">🚀</div>
                <div style="font-size: 0.8rem; font-weight: 800; color: #854D0E; margin-top: 4px;">Thám hiểm gia</div>
              </div>
              <div style="text-align: center; background: white; padding: 12px; border-radius: 16px; border: 2px solid #FEF08A; flex: 1;">
                <div style="font-size: 36px;">🐼</div>
                <div style="font-size: 0.8rem; font-weight: 800; color: #854D0E; margin-top: 4px;">Bạn Panda</div>
              </div>
            </div>

            <div style="background: #FFFBEB; border: 2px solid #FDE047; border-radius: 16px; padding: 16px;">
              <div style="font-weight: 800; color: #92400E; margin-bottom: 6px; font-size: 0.95rem;">💡 Mẹo học toán hôm nay:</div>
              <p style="font-size: 0.85rem; color: #78350F; font-weight: 600; line-height: 1.4;">
                "Muốn cộng nhẩm nhanh phép cộng có nhớ, bé hãy tách số đằng sau để làm tròn chục trước nhé!"
              </p>
            </div>
          </div>
        </div>
      `;
      StudentPortal.renderMissions();
    } else if (tabName === 'games') {
      container.innerHTML = `
        <div class="card-box">
          <div class="card-title">
            <span>🎮 Đấu Trường Trò Chơi Toán Học (Theo Cấp Độ)</span>
            <span style="font-size: 0.9rem; color: #16A34A; font-weight: 800;">Chơi vui • Giỏi toán</span>
          </div>

          <div class="game-grid">
            <div class="game-card" onclick="StudentPortal.launchJungleGame()">
              <div class="game-thumbnail">🌴 🦁</div>
              <div class="game-title">Thám Hiểm Rừng Xanh</div>
              <div class="game-level-badge">Cấp độ: Lớp 2 • Phép cộng 100</div>
              <p style="font-size: 0.85rem; color: #64748B; margin-bottom: 12px;">Vượt chướng ngại vật cùng chú Sư tử dũng cảm.</p>
              <button class="btn-primary" style="width: 100%; justify-content: center;">Chơi Ngay 🎮</button>
            </div>

            <div class="game-card" onclick="StudentPortal.launchJungleGame()">
              <div class="game-thumbnail">🧩 🔢</div>
              <div class="game-title">Xếp Hình Con Số</div>
              <div class="game-level-badge">Cấp độ: Dễ • So sánh số</div>
              <p style="font-size: 0.85rem; color: #64748B; margin-bottom: 12px;">Tìm số liền trước, số liền sau cực vui.</p>
              <button class="btn-primary" style="width: 100%; justify-content: center; background: linear-gradient(135deg, #3B82F6, #2563EB);">Chơi Ngay 🎮</button>
            </div>

            <div class="game-card" onclick="StudentPortal.launchJungleGame()">
              <div class="game-thumbnail">🚀 🌌</div>
              <div class="game-title">Nhiệm Vụ Vũ Trụ</div>
              <div class="game-level-badge">Cấp độ: Vừa • Bảng nhân 2 & 5</div>
              <p style="font-size: 0.85rem; color: #64748B; margin-bottom: 12px;">Bắn tên lửa bằng phép tính đúng trong vũ trụ.</p>
              <button class="btn-primary" style="width: 100%; justify-content: center; background: linear-gradient(135deg, #8B5CF6, #7C3AED);">Chơi Ngay 🎮</button>
            </div>

            <div class="game-card" onclick="StudentPortal.launchJungleGame()">
              <div class="game-thumbnail">🦕 ⚡</div>
              <div class="game-title">Khủng Long Chạy Nhanh</div>
              <div class="game-level-badge">Cấp độ: Thử thách • Tính nhẩm</div>
              <p style="font-size: 0.85rem; color: #64748B; margin-bottom: 12px;">Đua tốc độ tính nhanh phép cộng trừ tròn chục.</p>
              <button class="btn-primary" style="width: 100%; justify-content: center; background: linear-gradient(135deg, #EC4899, #DB2777);">Chơi Ngay 🎮</button>
            </div>
          </div>
        </div>
      `;
    } else if (tabName === 'test') {
      container.innerHTML = `
        <div class="test-container" style="text-align: center;">
          <div style="font-size: 64px; margin-bottom: 16px;">📝</div>
          <h2 style="font-size: 1.8rem; color: #0F172A; margin-bottom: 8px;">ĐỒNG HỒ THI & BÀI KIỂM TRA HẰNG TUẦN</h2>
          <p style="color: #475569; font-weight: 600; max-width: 520px; margin: 0 auto 24px auto;">
            Bài thi gồm 6 câu hỏi ngẫu nhiên trong thời gian 5 phút. Hệ thống có cơ chế <strong>Giám sát Anti-Cheat</strong> (phát hiện chuyển tab).
          </p>

          <button class="btn-primary" style="font-size: 1.1rem; padding: 14px 32px;" onclick="StudentPortal.startWeeklyTest()">
            🚀 Bắt Đầu Làm Bài Thi Ngay
          </button>
        </div>
      `;
    } else if (tabName === 'history') {
      const submissions = Store.data.testSubmissions;
      container.innerHTML = `
        <div class="card-box">
          <div class="card-title">
            <span>📜 Lịch Sử Bài Làm & Lời Nhắn Từ Cô Mai</span>
          </div>

          <table class="data-table">
            <thead>
              <tr>
                <th>Tên bài thi</th>
                <th>Điểm số</th>
                <th>Thời gian</th>
                <th>Số câu đúng</th>
                <th>Nhận xét của Giáo viên</th>
              </tr>
            </thead>
            <tbody>
              ${submissions.map(s => `
                <tr>
                  <td><strong>${s.testTitle}</strong></td>
                  <td><strong style="color: #2563EB;">${s.score} / 10</strong></td>
                  <td>${s.submittedAt}</td>
                  <td>${s.correctCount}/${s.totalQuestions} câu</td>
                  <td><em style="color: #15803D;">"${s.teacherComment}"</em></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  },

  // Toggle AI Tutor Chat Drawer
  toggleAiTutor() {
    const drawer = document.getElementById('ai-tutor-drawer');
    if (drawer) {
      drawer.classList.toggle('open');
      if (drawer.classList.contains('open')) {
        Store.completeMission('m3');
        StudentPortal.renderMissions();
      }
    }
  },

  // Send message to Panda AI
  async sendAiChatMessage() {
    const input = document.getElementById('ai-chat-input');
    const body = document.getElementById('ai-chat-body');
    if (!input || !body) return;

    const val = input.value.trim();
    if (!val) return;

    body.innerHTML += `
      <div class="chat-msg user">${val}</div>
    `;
    input.value = '';
    body.scrollTop = body.scrollHeight;

    const typingId = 'typing_' + Date.now();
    body.innerHTML += `
      <div class="chat-msg panda" id="${typingId}">🐼 Panda đang suy nghĩ gợi ý...</div>
    `;
    body.scrollTop = body.scrollHeight;

    let currentQuestionObj = null;
    if (StudentPortal.testActive && StudentPortal.testQuestions) {
      currentQuestionObj = StudentPortal.testQuestions[StudentPortal.currentQuestionIdx];
    }

    const aiReply = await AiTutor.processUserMessage(val, currentQuestionObj);
    const typingEl = document.getElementById(typingId);
    if (typingEl) {
      typingEl.innerHTML = aiReply.replace(/\n/g, '<br>');
    }
    body.scrollTop = body.scrollHeight;
  },

  // Toast message helper
  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3500);
  }
};

// Start application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
