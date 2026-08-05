/* ==========================================================================
   TOÁN CÙNG EM - TEACHER PORTAL CONTROLLER (ANALYTICS, AI RECOMMENDATIONS, ASSIGNMENTS)
   ========================================================================== */

const TeacherPortal = {
  init() {
    this.renderDashboard();
  },

  // Render main Teacher Dashboard
  renderDashboard() {
    const container = document.getElementById('teacher-tab-content');
    if (!container) return;

    const teacher = Store.data.teacherInfo;
    const students = Store.data.classStudents;
    const submissions = Store.data.testSubmissions;
    const aiRecs = Store.data.aiRecommendations;

    // Calculate class average
    const avgClassScore = (students.reduce((acc, s) => acc + s.avgScore, 0) / students.length).toFixed(2);

    container.innerHTML = `
      <!-- Teacher Top Summary Cards -->
      <div class="teacher-stat-grid">
        <div class="teacher-stat-card">
          <div class="stat-icon-wrapper" style="background: #E0F2FE; color: #0284C7;">👨‍🎓</div>
          <div>
            <div class="stat-val">${students.length}</div>
            <div class="stat-lbl">Học sinh lớp ${teacher.class}</div>
          </div>
        </div>

        <div class="teacher-stat-card">
          <div class="stat-icon-wrapper" style="background: #FEF3C7; color: #D97706;">📊</div>
          <div>
            <div class="stat-val">${avgClassScore} / 10</div>
            <div class="stat-lbl">Điểm trung bình Lớp</div>
          </div>
        </div>

        <div class="teacher-stat-card">
          <div class="stat-icon-wrapper" style="background: #DCFCE7; color: #16A34A;">📝</div>
          <div>
            <div class="stat-val">${submissions.length}</div>
            <div class="stat-lbl">Bài thi đã hoàn thành</div>
          </div>
        </div>

        <div class="teacher-stat-card">
          <div class="stat-icon-wrapper" style="background: #F3E8FF; color: #9333EA;">🤖</div>
          <div>
            <div class="stat-val">${aiRecs.filter(r => r.status === 'pending').length}</div>
            <div class="stat-lbl">Gợi ý AI Cá nhân hóa</div>
          </div>
        </div>
      </div>

      <!-- Grid Layout for Teacher Features -->
      <div class="grid-container" style="grid-template-columns: 2fr 1fr;">
        <!-- Left Column: Student Progress & Learning Analytics -->
        <div class="card-box">
          <div class="card-title">
            <span>📈 Bảng Theo Dõi Học Tập & Kỹ Năng Yếu</span>
            <button class="btn-primary" onclick="TeacherPortal.showCreateTaskModal()" style="font-size: 0.85rem; padding: 6px 14px;">➕ Giao bài tập mới</button>
          </div>

          <table class="data-table">
            <thead>
              <tr>
                <th>Họ và Tên</th>
                <th>Điểm TB</th>
                <th>Số bài thi</th>
                <th>Dạng toán còn yếu</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              ${students.map(s => `
                <tr>
                  <td><strong>${s.name}</strong></td>
                  <td><span style="color: ${s.avgScore >= 8 ? '#16A34A' : (s.avgScore >= 6.5 ? '#D97706' : '#DC2626')}; font-weight: 800;">${s.avgScore}</span></td>
                  <td>${s.testsDone} bài</td>
                  <td>
                    ${s.weakTopic === 'Không có' 
                      ? '<span style="color: #16A34A; font-weight: 700;">✅ Nắm vững</span>' 
                      : `<span style="background: #FEE2E2; color: #991B1B; padding: 2px 8px; border-radius: 12px; font-weight: 800; font-size: 0.8rem;">⚠️ ${s.weakTopic}</span>`
                    }
                  </td>
                  <td>
                    <span class="stat-pill" style="font-size: 0.8rem; padding: 2px 10px; display: inline-block;">${s.status}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Right Column: AI Personalized Recommendation Center -->
        <div class="card-box" style="background: linear-gradient(180deg, #FAF5FF 0%, #FFFFFF 100%); border-color: #E9D5FF;">
          <div class="card-title" style="color: #6B21A8;">
            <span>🤖 AI Gợi Ý Cá Nhân Hóa</span>
            <span style="font-size: 1.2rem;">✨</span>
          </div>
          <p style="font-size: 0.85rem; color: #6B21A8; margin-bottom: 16px;">
            AI tự động phân tích kết quả bài làm để thiết kế nhiệm vụ riêng cho từng học sinh:
          </p>

          ${aiRecs.map(rec => `
            <div style="background: white; border: 2px solid #E9D5FF; border-radius: 14px; padding: 14px; margin-bottom: 12px; box-shadow: 0 4px 10px rgba(147, 51, 234, 0.05);">
              <div style="font-weight: 800; color: #581C87; font-size: 0.95rem; margin-bottom: 4px;">🎯 ${rec.studentName}</div>
              <div style="font-size: 0.85rem; color: #7E22CE; margin-bottom: 8px;"><strong>Lý do:</strong> ${rec.reason}</div>
              <div style="background: #F3E8FF; padding: 8px 12px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; color: #6B21A8; margin-bottom: 10px;">
                📌 ${rec.recommendedMission}
              </div>
              ${rec.status === 'assigned'
                ? '<span style="color: #16A34A; font-weight: 800; font-size: 0.85rem;">✅ Đã giao cho học sinh</span>'
                : `<button class="btn-primary" style="font-size: 0.8rem; width: 100%; justify-content: center; background: linear-gradient(135deg, #9333EA, #7E22CE);" onclick="TeacherPortal.assignAiTask('${rec.id}')">🚀 Giao nhiệm vụ AI ngay</button>`
              }
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Test Submissions & Feedback Section -->
      <div class="card-box" style="margin-top: 24px;">
        <div class="card-title">
          <span>📑 Bài Làm Đã Lưu & Nhận Xét Của Giáo Viên</span>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Học sinh</th>
              <th>Tên bài thi</th>
              <th>Điểm số</th>
              <th>Thời gian nộp</th>
              <th>Vi phạm Anti-cheat</th>
              <th>Nhận xét từ Giáo viên</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            ${submissions.map(sub => `
              <tr>
                <td><strong>${sub.studentName}</strong></td>
                <td>${sub.testTitle}</td>
                <td><strong style="color: #2563EB;">${sub.score} / 10</strong></td>
                <td>${sub.submittedAt}</td>
                <td>
                  ${sub.tabSwitchCount > 0 
                    ? `<span style="color: #DC2626; font-weight: 800;">⚠️ ${sub.tabSwitchCount} lần</span>`
                    : '<span style="color: #16A34A; font-weight: 800;">🛡️ 0 lần (An toàn)</span>'
                  }
                </td>
                <td style="max-width: 250px;"><em>"${sub.teacherComment}"</em></td>
                <td>
                  <button class="btn-secondary" style="font-size: 0.8rem; padding: 4px 10px;" onclick="TeacherPortal.promptComment('${sub.id}')">✏️ Viết nhận xét</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // Assign AI Recommended Task to Student
  assignAiTask(recId) {
    if (Store.assignAiRecommendation(recId)) {
      App.showToast('🎉 Đã tự động tạo và giao nhiệm vụ cá nhân hóa cho học sinh!');
      this.renderDashboard();
    }
  },

  // Prompt teacher to write custom comment
  promptComment(submissionId) {
    const sub = Store.data.testSubmissions.find(s => s.id === submissionId);
    if (!sub) return;

    const newComment = prompt(`Nhập lời nhận xét mới cho bài làm của ${sub.studentName}:`, sub.teacherComment);
    if (newComment !== null && newComment.trim() !== '') {
      Store.addTeacherComment(submissionId, newComment.trim());
      App.showToast('✅ Đã lưu nhận xét mới cho học sinh!');
      this.renderDashboard();
    }
  },

  // Show Modal to create custom task
  showCreateTaskModal() {
    const title = prompt('Nhập tên bài tập/nhiệm vụ mới:');
    if (title && title.trim()) {
      Store.data.dailyMissions.push({
        id: 'task_' + Date.now(),
        icon: '📌',
        title: title.trim(),
        desc: 'Nhiệm vụ mới từ Cô Mai',
        xp: 60,
        stars: 10,
        progress: 0,
        target: 1,
        completed: false
      });
      Store.save();
      App.showToast('🎉 Đã tạo và giao bài tập mới thành công cho cả lớp!');
    }
  }
};
