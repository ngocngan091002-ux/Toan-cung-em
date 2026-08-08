import React from 'react';

export const TestHistory = ({ submissions }) => {
  return (
    <div className="card-box">
      <div className="card-title">
        <span>📜 Lịch Sử Bài Làm & Lời Nhắn Từ Cô Mai</span>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Tên bài thi</th>
            <th>Điểm số</th>
            <th>Thời gian</th>
            <th>Số câu đúng</th>
            <th>Chống gian lận</th>
            <th>Nhận xét của Giáo viên</th>
          </tr>
        </thead>
        <tbody>
          {submissions.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', color: '#64748B', padding: '24px' }}>
                Bé chưa nộp bài thi nào. Hãy bấm sang tab Bài Thi Hằng Tuần để thử sức nhé! 🚀
              </td>
            </tr>
          ) : (
            submissions.map(s => (
              <tr key={s.id}>
                <td><strong>{s.testTitle}</strong></td>
                <td><strong style={{ color: '#2563EB' }}>{s.score} / 10</strong></td>
                <td>{s.submittedAt}</td>
                <td>{s.correctCount}/{s.totalQuestions} câu</td>
                <td>
                  {s.cheatFlagged ? (
                    <span style={{ color: '#DC2626', fontWeight: 800 }}>⚠️ Chuyển tab ({s.tabSwitchCount} lần)</span>
                  ) : (
                    <span style={{ color: '#16A34A', fontWeight: 800 }}>🛡️ Trung thực</span>
                  )}
                </td>
                <td><em style={{ color: '#15803D' }}>"{s.teacherComment || 'Đang chờ nhận xét...'}"</em></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
