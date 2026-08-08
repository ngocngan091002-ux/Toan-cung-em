import React from 'react';

export const AntiCheatModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay active">
      <div className="warning-modal-box">
        <div className="warning-icon">⚠️</div>
        <h3 style={{ color: '#DC2626', fontSize: '1.5rem', marginBottom: '10px' }}>
          CẢNH BÁO CHỐNG GIAN LẬN!
        </h3>
        <p style={{ color: '#475569', fontWeight: '700', fontSize: '1rem', marginBottom: '20px' }}>
          Bé ơi! Hệ thống ghi nhận bé vừa rời khỏi trang thi. Vui lòng không chuyển tab trong khi làm bài thi nhé!
        </p>
        <button
          className="btn-primary"
          style={{ background: '#DC2626', width: '100%', justifyContent: 'center' }}
          onClick={onClose}
        >
          Em Đã Hiểu - Tiếp Tục Làm Bài
        </button>
      </div>
    </div>
  );
};

export const Toast = ({ message }) => {
  if (!message) return null;

  return (
    <div className="toast-msg">
      <span>{message}</span>
    </div>
  );
};
