import React from 'react';

export const Header = ({ currentUser, onOpenAuth, onLogout }) => {
  return (
    <header className="app-header">
      <div className="brand-container">
        <div className="brand-logo">🐼</div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-name">Toán Cùng Em</span>
            <span className="brand-tag">Lớp 2 AI</span>
          </div>
        </div>
      </div>

      <div className="user-bar">
        {/* Student Stats */}
        <div className="stat-pill stars" title="Tổng số Sao thưởng">
          ⭐ <span>{currentUser.stars || 0}</span>
        </div>
        <div className="stat-pill xp" title="Điểm kinh nghiệm XP">
          ⚡ <span>{currentUser.xp || 0} XP</span>
        </div>

        {/* User Profile Badge & Auth Actions */}
        <div className="user-profile-badge">
          <span style={{ fontSize: '1.2rem' }}>
            {currentUser.avatar || (currentUser.role === 'admin' ? '👑' : currentUser.role === 'teacher' ? '👩‍🏫' : '👦')}
          </span>
          <span>
            <strong>{currentUser.name}</strong> ({currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'teacher' ? 'Giáo viên' : 'Học sinh'})
          </span>

          <button
            className="btn-secondary"
            style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '12px', marginLeft: '6px' }}
            onClick={onOpenAuth}
          >
            🔑 Đổi TK / Đăng ký
          </button>

          <button
            className="btn-secondary"
            style={{
              fontSize: '0.75rem',
              padding: '3px 8px',
              borderRadius: '12px',
              background: '#FEE2E2',
              color: '#DC2626',
              borderColor: '#FCA5A5'
            }}
            onClick={onLogout}
          >
            Thoát
          </button>
        </div>
      </div>
    </header>
  );
};
