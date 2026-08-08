import React, { useState } from 'react';

export const TeacherDashboard = ({
  teacherInfo,
  students,
  submissions,
  aiRecommendations,
  onSaveComment,
  onAssignRecommendation
}) => {
  const [editingSubId, setEditingSubId] = useState(null);
  const [commentInput, setCommentInput] = useState('');

  const totalStudents = students.length;
  const avgClassScore = (students.reduce((acc, s) => acc + (s.avgScore || 0), 0) / (totalStudents || 1)).toFixed(2);
  const totalSubmissions = submissions.length;

  const handleOpenEditComment = (sub) => {
    setEditingSubId(sub.id);
    setCommentInput(sub.teacherComment || '');
  };

  const handleSaveCommentSubmit = (subId) => {
    onSaveComment(subId, commentInput);
    setEditingSubId(null);
  };

  return (
    <div>
      {/* Teacher Stats Cards */}
      <div className="teacher-stat-grid">
        <div className="teacher-stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#E0F2FE', color: '#0284C7' }}>
            👥
          </div>
          <div>
            <div className="stat-val">{totalStudents}</div>
            <div className="stat-lbl">Học sinh Lớp 2A</div>
          </div>
        </div>

        <div className="teacher-stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#FEF3C7', color: '#D97706' }}>
            ⭐
          </div>
          <div>
            <div className="stat-val">{avgClassScore} / 10</div>
            <div className="stat-lbl">Điểm trung bình lớp</div>
          </div>
        </div>

        <div className="teacher-stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#DCFCE7', color: '#15803D' }}>
            📝
          </div>
          <div>
            <div className="stat-val">{totalSubmissions}</div>
            <div className="stat-lbl">Bài thi đã làm</div>
          </div>
        </div>

        <div className="teacher-stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#FEE2E2', color: '#DC2626' }}>
            ⚡
          </div>
          <div>
            <div className="stat-val" style={{ fontSize: '1.2rem' }}>Phép trừ có nhớ</div>
            <div className="stat-lbl">Dạng toán còn yếu nhất</div>
          </div>
        </div>
      </div>

      {/* Main Teacher Content Grid */}
      <div className="grid-container" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Left: Submissions & Commenting */}
        <div className="card-box">
          <div className="card-title">
            <span>📋 Quản Lý Bài Thi & Chấm Nhận Xét</span>
            <span style={{ fontSize: '0.9rem', color: '#2563EB', fontWeight: 800 }}>Tự động đồng bộ Supabase</span>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Học sinh</th>
                <th>Bài thi</th>
                <th>Điểm</th>
                <th>Gian lận</th>
                <th>Nhận xét của Giáo viên</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.id}>
                  <td><strong>{sub.studentName}</strong></td>
                  <td>{sub.testTitle}</td>
                  <td><strong style={{ color: '#2563EB' }}>{sub.score} / 10</strong></td>
                  <td>
                    {sub.cheatFlagged ? (
                      <span style={{ color: '#DC2626', fontWeight: 800 }}>⚠️ Chuyển tab ({sub.tabSwitchCount})</span>
                    ) : (
                      <span style={{ color: '#16A34A', fontWeight: 800 }}>🛡️ An toàn</span>
                    )}
                  </td>
                  <td>
                    {editingSubId === sub.id ? (
                      <input
                        type="text"
                        className="form-control"
                        style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                      />
                    ) : (
                      <em style={{ color: '#15803D' }}>"{sub.teacherComment || 'Chưa nhận xét'}"</em>
                    )}
                  </td>
                  <td>
                    {editingSubId === sub.id ? (
                      <button
                        className="btn-primary"
                        style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                        onClick={() => handleSaveCommentSubmit(sub.id)}
                      >
                        Lưu 💾
                      </button>
                    ) : (
                      <button
                        className="btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                        onClick={() => handleOpenEditComment(sub)}
                      >
                        Sửa ✏️
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: AI Recommendations & Personalization */}
        <div className="card-box" style={{ background: '#F8FAFC' }}>
          <div className="card-title" style={{ color: '#0369A1' }}>
            <span>⚡ AI Gợi Ý Cá Nhân Hóa</span>
            <span>🐼</span>
          </div>

          <div>
            {aiRecommendations.map((rec) => (
              <div
                key={rec.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '14px',
                  border: '2px solid #BAE6FD'
                }}
              >
                <div style={{ fontWeight: 800, color: '#0369A1', marginBottom: '4px' }}>
                  🎯 {rec.studentName} - {rec.suggestedTopic}
                </div>
                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '10px' }}>
                  {rec.reason}
                </p>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#15803D', marginBottom: '12px' }}>
                  💡 Bài tập gợi ý: {rec.recommendedMission}
                </div>

                {rec.status === 'assigned' ? (
                  <button
                    className="btn-primary"
                    disabled
                    style={{ background: '#0284C7', opacity: 0.8, fontSize: '0.8rem', padding: '6px 12px' }}
                  >
                    ✔ Đã giao nhiệm vụ
                  </button>
                ) : (
                  <button
                    className="btn-primary"
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    onClick={() => onAssignRecommendation(rec.id)}
                  >
                    ⚡ Giao bài 1-Click
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
