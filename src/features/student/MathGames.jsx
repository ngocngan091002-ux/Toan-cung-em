import React from 'react';

export const MathGames = ({ onLaunchGame }) => {
  return (
    <div className="card-box">
      <div className="card-title">
        <span>🎮 Đấu Trường Trò Chơi Toán Học (Theo Cấp Độ)</span>
        <span style={{ fontSize: '0.9rem', color: '#16A34A', fontWeight: 800 }}>Chơi vui • Giỏi toán</span>
      </div>

      <div className="game-grid">
        <div className="game-card" onClick={onLaunchGame}>
          <div className="game-thumbnail">🌴 🦁</div>
          <div className="game-title">Thám Hiểm Rừng Xanh</div>
          <div className="game-level-badge">Cấp độ: Lớp 2 • Phép cộng 100</div>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '12px' }}>
            Vượt chướng ngại vật cùng chú Sư tử dũng cảm.
          </p>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Chơi Ngay 🎮
          </button>
        </div>

        <div className="game-card" onClick={onLaunchGame}>
          <div className="game-thumbnail">🧩 🔢</div>
          <div className="game-title">Xếp Hình Con Số</div>
          <div className="game-level-badge">Cấp độ: Dễ • So sánh số</div>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '12px' }}>
            Tìm số liền trước, số liền sau cực vui.
          </p>
          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}
          >
            Chơi Ngay 🎮
          </button>
        </div>

        <div className="game-card" onClick={onLaunchGame}>
          <div className="game-thumbnail">🚀 🌌</div>
          <div className="game-title">Nhiệm Vụ Vũ Trụ</div>
          <div className="game-level-badge">Cấp độ: Vừa • Bảng nhân 2 & 5</div>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '12px' }}>
            Bắn tên lửa bằng phép tính đúng trong vũ trụ.
          </p>
          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}
          >
            Chơi Ngay 🎮
          </button>
        </div>

        <div className="game-card" onClick={onLaunchGame}>
          <div className="game-thumbnail">🦕 ⚡</div>
          <div className="game-title">Khủng Long Chạy Nhanh</div>
          <div className="game-level-badge">Cấp độ: Thử thách • Tính nhẩm</div>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '12px' }}>
            Đua tốc độ tính nhanh phép cộng trừ tròn chục.
          </p>
          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #EC4899, #DB2777)' }}
          >
            Chơi Ngay 🎮
          </button>
        </div>
      </div>
    </div>
  );
};
