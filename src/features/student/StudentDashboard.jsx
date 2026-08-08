import React from 'react';

export const StudentDashboard = ({ currentUser, missions, onCompleteMission, onStartTest }) => {
  return (
    <div>
      {/* Mascot Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Học Toán Vui - Bứt Phá Điểm Số! 🌟</h1>
          <p className="hero-subtitle">
            Chào mừng {currentUser.name} đến với thế giới Toán học Lớp 2 cùng Trợ lý AI Panda!
          </p>
          <button
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #FF9F1C, #FF8800)', border: '2px solid white' }}
            onClick={onStartTest}
          >
            📝 Làm Bài Kiểm Tra Tuần 1
          </button>
        </div>
        <div className="hero-mascot">
          <div className="speech-bubble">
            "Chào {currentUser.name}! Cùng Panda chinh phục thử thách toán học hôm nay nhé! 🐾"
          </div>
          <div className="mascot-avatar">🐼</div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid-container" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Left: Daily Missions */}
        <div className="card-box">
          <div className="card-title">
            <span>🎯 Nhiệm Vụ Hằng Ngày</span>
            <span style={{ fontSize: '0.9rem', color: '#0284C7', fontWeight: '700' }}>Reset sau: 14h 30m</span>
          </div>

          <div>
            {missions.map((m) => (
              <div key={m.id} className={`mission-item ${m.completed ? 'completed' : ''}`}>
                <div className="mission-icon">{m.icon}</div>
                <div className="mission-info">
                  <div className="mission-name">{m.title}</div>
                  <div className="mission-desc">
                    {m.desc} (Thưởng: +{m.xp} XP, +{m.stars} ⭐)
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${m.completed ? 100 : (m.progress / m.target) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {m.completed ? (
                  <button className="btn-primary" disabled style={{ background: '#10B981', opacity: 0.9 }}>
                    Hoàn thành
                  </button>
                ) : (
                  <button className="btn-secondary" onClick={() => onCompleteMission(m.id)}>
                    Thực hiện
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Progress & Badges */}
        <div
          className="card-box"
          style={{ background: 'linear-gradient(180deg, #FEFCE8 0%, #FFFFFF 100%)', borderColor: '#FEF08A' }}
        >
          <div className="card-title" style={{ color: '#854D0E' }}>
            <span>🏆 Huy Hiệu Của Bé</span>
            <span>⭐</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center', background: 'white', padding: '12px', borderRadius: '16px', border: '2px solid #FEF08A', flex: 1 }}>
              <div style={{ fontSize: '36px' }}>🥇</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#854D0E', marginTop: '4px' }}>Dũng sĩ Toán</div>
            </div>
            <div style={{ textAlign: 'center', background: 'white', padding: '12px', borderRadius: '16px', border: '2px solid #FEF08A', flex: 1 }}>
              <div style={{ fontSize: '36px' }}>🚀</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#854D0E', marginTop: '4px' }}>Thám hiểm gia</div>
            </div>
            <div style={{ textAlign: 'center', background: 'white', padding: '12px', borderRadius: '16px', border: '2px solid #FEF08A', flex: 1 }}>
              <div style={{ fontSize: '36px' }}>🐼</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#854D0E', marginTop: '4px' }}>Bạn Panda</div>
            </div>
          </div>

          <div style={{ background: '#FFFBEB', border: '2px solid #FDE047', borderRadius: '16px', padding: '16px' }}>
            <div style={{ fontWeight: 800, color: '#92400E', marginBottom: '6px', fontSize: '0.95rem' }}>
              💡 Mẹo học toán hôm nay:
            </div>
            <p style={{ fontSize: '0.85rem', color: '#78350F', fontWeight: 600, lineHeight: 1.4 }}>
              "Muốn cộng nhẩm nhanh phép cộng có nhớ, bé hãy tách số đằng sau để làm tròn chục trước nhé!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
