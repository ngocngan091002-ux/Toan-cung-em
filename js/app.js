/* ==========================================================================
   TOÁN CÙNG EM - MAIN APPLICATION CONTROLLER
   ========================================================================== */

const App = {
  currentRole: 'student', // 'student' or 'teacher'

  init() {
    this.bindEvents();
    this.switchRole(this.currentRole);
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

  // Switch between Student and Teacher roles
  switchRole(role) {
    this.currentRole = role;
    Store.data.currentUser.role = role;
    Store.save();

    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-role') === role);
    });

    const studentView = document.getElementById('student-view');
    const teacherView = document.getElementById('teacher-view');

    if (role === 'student') {
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
        // Increment mission progress if asking AI
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

    // Append User message
    body.innerHTML += `
      <div class="chat-msg user">${val}</div>
    `;
    input.value = '';
    body.scrollTop = body.scrollHeight;

    // Show typing status
    const typingId = 'typing_' + Date.now();
    body.innerHTML += `
      <div class="chat-msg panda" id="${typingId}">🐼 Panda đang suy nghĩ gợi ý...</div>
    `;
    body.scrollTop = body.scrollHeight;

    // Get current context question if taking test
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
