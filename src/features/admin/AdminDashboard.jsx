import React, { useState } from 'react';

export const AdminDashboard = ({
  users,
  questions,
  missions,
  submissions,
  recommendations,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onAddQuestion,
  onDeleteQuestion,
  onAddMission,
  onDeleteMission,
  onDeleteSubmission,
  showToast
}) => {
  const [adminTab, setAdminTab] = useState('analytics'); // 'analytics' | 'users' | 'questions' | 'missions' | 'submissions' | 'recommendations'

  // User form modal state
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [uUsername, setUUsername] = useState('');
  const [uPassword, setUPassword] = useState('123');
  const [uFullName, setUFullName] = useState('');
  const [uRole, setURole] = useState('student');
  const [uStars, setUStars] = useState(100);
  const [uXp, setUXp] = useState(50);

  // Question form modal state
  const [qModalOpen, setQModalOpen] = useState(false);
  const [qTopic, setQTopic] = useState('Phép cộng có nhớ');
  const [qText, setQText] = useState('');
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qAnswer, setQAnswer] = useState(0);
  const [qHint, setQHint] = useState('');

  // Mission form modal state
  const [mModalOpen, setMModalOpen] = useState(false);
  const [mIcon, setMIcon] = useState('🎯');
  const [mTitle, setMTitle] = useState('');
  const [mDesc, setMDesc] = useState('');
  const [mXp, setMXp] = useState(50);
  const [mStars, setMStars] = useState(10);

  // User Handlers
  const handleOpenAddUser = () => {
    setEditingUser(null);
    setUUsername('');
    setUPassword('123');
    setUFullName('');
    setURole('student');
    setUStars(100);
    setUXp(50);
    setUserModalOpen(true);
  };

  const handleOpenEditUser = (u) => {
    setEditingUser(u);
    setUUsername(u.username || '');
    setUPassword(u.password || '123');
    setUFullName(u.name || u.full_name || '');
    setURole(u.role || 'student');
    setUStars(u.stars || 0);
    setUXp(u.xp || 0);
    setUserModalOpen(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!uUsername || !uFullName) return;

    if (editingUser) {
      onUpdateUser(editingUser.id, {
        name: uFullName,
        role: uRole,
        password: uPassword,
        stars: Number(uStars),
        xp: Number(uXp)
      });
      showToast(`💾 Đã cập nhật tài khoản ${uFullName} thành công!`);
    } else {
      onAddUser({
        id: (uRole === 'teacher' ? 'tch_' : uRole === 'admin' ? 'adm_' : 'std_') + Date.now(),
        username: uUsername.toLowerCase().trim(),
        password: uPassword,
        role: uRole,
        name: uFullName,
        avatar: uRole === 'teacher' ? '👩‍🏫' : uRole === 'admin' ? '👑' : '👦',
        stars: Number(uStars),
        xp: Number(uXp)
      });
      showToast(`✨ Đã thêm tài khoản mới ${uFullName}!`);
    }
    setUserModalOpen(false);
  };

  // Question Handlers
  const handleSaveQuestion = (e) => {
    e.preventDefault();
    if (!qText || !qOptA || !qOptB) return;

    const newQ = {
      id: 'q_' + Date.now(),
      topic: qTopic,
      question: qText,
      options: [qOptA, qOptB, qOptC || 'Không có', qOptD || 'Không có'],
      answer: Number(qAnswer),
      hint: qHint || 'Hãy suy nghĩ cẩn thận từng bước nhé!'
    };

    onAddQuestion(newQ);
    showToast('✨ Đã thêm câu hỏi toán mới vào Ngân hàng thành công!');
    setQModalOpen(false);
    setQText('');
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    setQHint('');
  };

  // Mission Handlers
  const handleSaveMission = (e) => {
    e.preventDefault();
    if (!mTitle || !mDesc) return;

    const newM = {
      id: 'm_' + Date.now(),
      icon: mIcon,
      title: mTitle,
      desc: mDesc,
      xp: Number(mXp),
      stars: Number(mStars),
      progress: 0,
      target: 1,
      completed: false
    };

    onAddMission(newM);
    showToast('✨ Đã thêm nhiệm vụ hằng ngày mới thành công!');
    setMModalOpen(false);
    setMTitle('');
    setMDesc('');
  };

  const totalUsers = users.length;
  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalTeachers = users.filter(u => u.role === 'teacher').length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;
  const totalCheatLogs = submissions.filter(s => s.cheatFlagged).length;

  return (
    <div>
      {/* Admin Title Header */}
      <div className="card-box" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)', color: 'white', borderColor: '#4338CA' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>👑 BẢNG ĐIỀU KHIỂN QUẢN TRỊ VIÊN (ADMIN PORTAL)</h1>
            <p style={{ opacity: 0.9, fontSize: '1rem', fontWeight: 600 }}>
              Quản lý toàn bộ 100% tài nguyên: Tài khoản, Ngân hàng câu hỏi, Bài thi, Gian lận & AI System
            </p>
          </div>
          <div style={{ fontSize: '64px' }}>🛡️</div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="nav-tabs">
        <button className={`tab-btn ${adminTab === 'analytics' ? 'active' : ''}`} onClick={() => setAdminTab('analytics')}>
          📊 Thống Kê Hạn Mức
        </button>
        <button className={`tab-btn ${adminTab === 'users' ? 'active' : ''}`} onClick={() => setAdminTab('users')}>
          👥 Quản Lý Tài Khoản ({totalUsers})
        </button>
        <button className={`tab-btn ${adminTab === 'questions' ? 'active' : ''}`} onClick={() => setAdminTab('questions')}>
          ❓ Ngân Hàng Câu Hỏi ({questions.length})
        </button>
        <button className={`tab-btn ${adminTab === 'missions' ? 'active' : ''}`} onClick={() => setAdminTab('missions')}>
          🎯 Nhiệm Vụ Hằng Ngày ({missions.length})
        </button>
        <button className={`tab-btn ${adminTab === 'submissions' ? 'active' : ''}`} onClick={() => setAdminTab('submissions')}>
          📝 Bài Thi & Gian Lận ({submissions.length})
        </button>
      </div>

      {/* TAB 1: SYSTEM ANALYTICS */}
      {adminTab === 'analytics' && (
        <div>
          <div className="teacher-stat-grid">
            <div className="teacher-stat-card">
              <div className="stat-icon-wrapper" style={{ background: '#E0F2FE', color: '#0284C7' }}>👥</div>
              <div>
                <div className="stat-val">{totalUsers}</div>
                <div className="stat-lbl">Tổng số Tài khoản</div>
              </div>
            </div>
            <div className="teacher-stat-card">
              <div className="stat-icon-wrapper" style={{ background: '#DCFCE7', color: '#15803D' }}>👦</div>
              <div>
                <div className="stat-val">{totalStudents}</div>
                <div className="stat-lbl">Tài khoản Học sinh</div>
              </div>
            </div>
            <div className="teacher-stat-card">
              <div className="stat-icon-wrapper" style={{ background: '#FEF3C7', color: '#D97706' }}>👩‍🏫</div>
              <div>
                <div className="stat-val">{totalTeachers}</div>
                <div className="stat-lbl">Tài khoản Giáo viên</div>
              </div>
            </div>
            <div className="teacher-stat-card">
              <div className="stat-icon-wrapper" style={{ background: '#FEE2E2', color: '#DC2626' }}>⚠️</div>
              <div>
                <div className="stat-val">{totalCheatLogs}</div>
                <div className="stat-lbl">Lần chuyển tab gian lận</div>
              </div>
            </div>
          </div>

          <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="card-box">
              <div className="card-title">🌐 Trạng Thái Kết Nối Cơ Sở Dữ Liệu</div>
              <div style={{ padding: '16px', background: '#F0FDF4', borderRadius: '16px', border: '2px solid #86EFAC', marginBottom: '16px' }}>
                <div style={{ fontWeight: 800, color: '#166534', fontSize: '1.1rem', marginBottom: '4px' }}>
                  ⚡ Supabase PostgreSQL Database: ACTIVE
                </div>
                <p style={{ fontSize: '0.9rem', color: '#15803D' }}>
                  URL: <code>https://ncfcowbnxuuiwuoagqon.supabase.co</code><br />
                  Chế độ: Đồng bộ hai chiều Real-time Sync & RLS Security.
                </p>
              </div>
            </div>

            <div className="card-box">
              <div className="card-title">⚙️ Cấu Hình Máy Chủ & Tốc Độ</div>
              <div style={{ padding: '16px', background: '#EFF6FF', borderRadius: '16px', border: '2px solid #93C5FD' }}>
                <div style={{ fontWeight: 800, color: '#1E40AF', fontSize: '1.1rem', marginBottom: '4px' }}>
                  🚀 Vercel SPA Client Rewrites Enabled
                </div>
                <p style={{ fontSize: '0.9rem', color: '#1D4ED8' }}>
                  Framework: React 18 + Vite 5<br />
                  Deployment: Vercel Ready (`dist/`)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {adminTab === 'users' && (
        <div className="card-box">
          <div className="card-title">
            <span>👥 Quản Lý Tất Cả Tài Khoản ({users.length})</span>
            <button className="btn-primary" onClick={handleOpenAddUser}>
              ➕ Thêm Tài Khoản Mới
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Họ và Tên</th>
                <th>Vai trò</th>
                <th>Sao ⭐</th>
                <th>XP ⚡</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td><code>{u.id}</code></td>
                  <td><strong>{u.username}</strong></td>
                  <td>{u.avatar || '👦'} {u.name || u.full_name}</td>
                  <td>
                    {u.role === 'admin' ? (
                      <span style={{ color: '#7C3AED', fontWeight: 800 }}>👑 Admin</span>
                    ) : u.role === 'teacher' ? (
                      <span style={{ color: '#D97706', fontWeight: 800 }}>👩‍🏫 Giáo viên</span>
                    ) : (
                      <span style={{ color: '#2563EB', fontWeight: 800 }}>👦 Học sinh</span>
                    )}
                  </td>
                  <td>⭐ {u.stars || 0}</td>
                  <td>⚡ {u.xp || 0} XP</td>
                  <td>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '4px 10px', marginRight: '6px' }}
                      onClick={() => handleOpenEditUser(u)}
                    >
                      Sửa ✏️
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '4px 10px', background: '#FEE2E2', color: '#DC2626', borderColor: '#FCA5A5' }}
                      onClick={() => {
                        if (confirm(`Bạn có chắc chắn muốn xóa tài khoản ${u.name}?`)) {
                          onDeleteUser(u.id);
                          showToast(`🗑️ Đã xóa tài khoản ${u.name}`);
                        }
                      }}
                    >
                      Xóa 🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: QUESTION BANK MANAGEMENT */}
      {adminTab === 'questions' && (
        <div className="card-box">
          <div className="card-title">
            <span>❓ Quản Lý Ngân Hàng Câu Hỏi ({questions.length})</span>
            <button className="btn-primary" onClick={() => setQModalOpen(true)}>
              ➕ Thêm Câu Hỏi Mới
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Chủ đề</th>
                <th>Đề bài</th>
                <th>Các phương án</th>
                <th>Đáp án đúng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {questions.map(q => (
                <tr key={q.id}>
                  <td><code>{q.id}</code></td>
                  <td><span className="game-level-badge">{q.topic}</span></td>
                  <td><strong>{q.question}</strong></td>
                  <td>{Array.isArray(q.options) ? q.options.join(' | ') : ''}</td>
                  <td><strong style={{ color: '#16A34A' }}>Đáp án {String.fromCharCode(65 + Number(q.answer))}</strong></td>
                  <td>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '4px 10px', background: '#FEE2E2', color: '#DC2626', borderColor: '#FCA5A5' }}
                      onClick={() => {
                        if (confirm(`Xóa câu hỏi ${q.id}?`)) {
                          onDeleteQuestion(q.id);
                          showToast('🗑️ Đã xóa câu hỏi!');
                        }
                      }}
                    >
                      Xóa 🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: MISSIONS MANAGEMENT */}
      {adminTab === 'missions' && (
        <div className="card-box">
          <div className="card-title">
            <span>🎯 Quản Lý Nhiệm Vụ Hằng Ngày ({missions.length})</span>
            <button className="btn-primary" onClick={() => setMModalOpen(true)}>
              ➕ Thêm Nhiệm Vụ Mới
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Tên nhiệm vụ</th>
                <th>Mô tả</th>
                <th>Thưởng XP</th>
                <th>Thưởng Sao</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {missions.map(m => (
                <tr key={m.id}>
                  <td style={{ fontSize: '1.5rem' }}>{m.icon}</td>
                  <td><strong>{m.title}</strong></td>
                  <td>{m.desc}</td>
                  <td>⚡ +{m.xp} XP</td>
                  <td>⭐ +{m.stars} ⭐</td>
                  <td>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '4px 10px', background: '#FEE2E2', color: '#DC2626', borderColor: '#FCA5A5' }}
                      onClick={() => {
                        if (confirm(`Xóa nhiệm vụ ${m.title}?`)) {
                          onDeleteMission(m.id);
                          showToast('🗑️ Đã xóa nhiệm vụ!');
                        }
                      }}
                    >
                      Xóa 🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 5: SUBMISSIONS & ANTI-CHEAT MONITOR */}
      {adminTab === 'submissions' && (
        <div className="card-box">
          <div className="card-title">
            <span>📝 Giám Sát Bài Thi Toàn Hệ Thống ({submissions.length})</span>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Học sinh</th>
                <th>Tên bài thi</th>
                <th>Điểm</th>
                <th>Thời gian nộp</th>
                <th>Chống gian lận</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.studentName}</strong></td>
                  <td>{s.testTitle}</td>
                  <td><strong style={{ color: '#2563EB' }}>{s.score} / 10</strong></td>
                  <td>{s.submittedAt}</td>
                  <td>
                    {s.cheatFlagged ? (
                      <span style={{ color: '#DC2626', fontWeight: 800 }}>⚠️ VI PHẠM (Chuyển tab {s.tabSwitchCount} lần)</span>
                    ) : (
                      <span style={{ color: '#16A34A', fontWeight: 800 }}>🛡️ Hợp lệ</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '4px 10px', background: '#FEE2E2', color: '#DC2626', borderColor: '#FCA5A5' }}
                      onClick={() => {
                        if (confirm(`Xóa bài làm của ${s.studentName}?`)) {
                          onDeleteSubmission(s.id);
                          showToast('🗑️ Đã xóa bài làm!');
                        }
                      }}
                    >
                      Xóa 🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* USER FORM MODAL */}
      {userModalOpen && (
        <div className="modal-overlay active">
          <div className="auth-modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.4rem' }}>{editingUser ? '✏️ Chỉnh Sửa Tài Khoản' : '➕ Thêm Tài Khoản Mới'}</h2>
              <button style={{ border: 'none', background: 'transparent', fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => setUserModalOpen(false)}>✖</button>
            </div>

            <form onSubmit={handleSaveUser}>
              <div className="form-group">
                <label>Username:</label>
                <input type="text" className="form-control" disabled={!!editingUser} value={uUsername} onChange={(e) => setUUsername(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Họ và Tên:</label>
                <input type="text" className="form-control" value={uFullName} onChange={(e) => setUFullName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Mật khẩu:</label>
                <input type="password" className="form-control" value={uPassword} onChange={(e) => setUPassword(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Vai trò:</label>
                <select className="form-control" value={uRole} onChange={(e) => setURole(e.target.value)}>
                  <option value="student">👦 Học sinh</option>
                  <option value="teacher">👩‍🏫 Giáo viên</option>
                  <option value="admin">👑 Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Số sao ⭐:</label>
                  <input type="number" className="form-control" value={uStars} onChange={(e) => setUStars(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Điểm XP ⚡:</label>
                  <input type="number" className="form-control" value={uXp} onChange={(e) => setUXp(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
                💾 Lưu Thay Đổi
              </button>
            </form>
          </div>
        </div>
      )}

      {/* QUESTION FORM MODAL */}
      {qModalOpen && (
        <div className="modal-overlay active">
          <div className="auth-modal-box" style={{ width: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.4rem' }}>➕ Thêm Câu Hỏi Toán Mới</h2>
              <button style={{ border: 'none', background: 'transparent', fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => setQModalOpen(false)}>✖</button>
            </div>

            <form onSubmit={handleSaveQuestion}>
              <div className="form-group">
                <label>Chủ đề toán:</label>
                <input type="text" className="form-control" value={qTopic} onChange={(e) => setQTopic(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Nội dung câu hỏi:</label>
                <textarea className="form-control" style={{ height: '70px' }} value={qText} onChange={(e) => setQText(e.target.value)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label>Phương án A:</label>
                  <input type="text" className="form-control" value={qOptA} onChange={(e) => setQOptA(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Phương án B:</label>
                  <input type="text" className="form-control" value={qOptB} onChange={(e) => setQOptB(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Phương án C:</label>
                  <input type="text" className="form-control" value={qOptC} onChange={(e) => setQOptC(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Phương án D:</label>
                  <input type="text" className="form-control" value={qOptD} onChange={(e) => setQOptD(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Đáp án đúng:</label>
                <select className="form-control" value={qAnswer} onChange={(e) => setQAnswer(e.target.value)}>
                  <option value={0}>A ({qOptA || 'Phương án A'})</option>
                  <option value={1}>B ({qOptB || 'Phương án B'})</option>
                  <option value={2}>C ({qOptC || 'Phương án C'})</option>
                  <option value={3}>D ({qOptD || 'Phương án D'})</option>
                </select>
              </div>
              <div className="form-group">
                <label>Gợi ý của Panda AI:</label>
                <input type="text" className="form-control" value={qHint} onChange={(e) => setQHint(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
                ✨ Thêm Vào Ngân Hàng Câu Hỏi
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MISSION FORM MODAL */}
      {mModalOpen && (
        <div className="modal-overlay active">
          <div className="auth-modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.4rem' }}>➕ Thêm Nhiệm Vụ Hằng Ngày</h2>
              <button style={{ border: 'none', background: 'transparent', fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => setMModalOpen(false)}>✖</button>
            </div>

            <form onSubmit={handleSaveMission}>
              <div className="form-group">
                <label>Biểu tượng (Icon):</label>
                <input type="text" className="form-control" value={mIcon} onChange={(e) => setMIcon(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Tên nhiệm vụ:</label>
                <input type="text" className="form-control" value={mTitle} onChange={(e) => setMTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Mô tả chi tiết:</label>
                <input type="text" className="form-control" value={mDesc} onChange={(e) => setMDesc(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Thưởng XP ⚡:</label>
                  <input type="number" className="form-control" value={mXp} onChange={(e) => setMXp(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Thưởng Sao ⭐:</label>
                  <input type="number" className="form-control" value={mStars} onChange={(e) => setMStars(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
                ✨ Tạo Nhiệm Vụ Mới
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
