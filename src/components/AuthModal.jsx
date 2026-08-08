import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export const AuthModal = ({ isOpen, onClose, onAuthSuccess, showToast }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('student'); // 'student' | 'teacher'

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanUsername = loginUsername.toLowerCase().trim();

    setLoading(true);
    showToast('⏳ Đang kết nối xác thực dữ liệu Supabase...');

    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', cleanUsername)
          .eq('password', loginPassword)
          .maybeSingle();

        if (error || !data) {
          throw new Error('Tài khoản chưa được đăng ký hoặc sai mật khẩu! Vui lòng chọn tab Đăng Ký Mới bên cạnh.');
        }

        const userObj = {
          id: data.id,
          username: data.username,
          role: data.role,
          name: data.full_name,
          grade: data.grade || 'Lớp 2A',
          avatar: data.avatar || (data.role === 'teacher' ? '👩‍🏫' : '👦'),
          stars: data.stars || 0,
          xp: data.xp || 0,
          level: data.level || 1
        };

        onAuthSuccess(userObj);
        showToast(`🎉 Xin chào mừng ${userObj.name} đã đăng nhập thành công!`);
        onClose();
      }
    } catch (err) {
      alert('⚠️ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const cleanUsername = regUsername.toLowerCase().trim();
    const newId = (role === 'teacher' ? 'tch_' : 'std_') + Date.now();
    const defaultAvatar = role === 'teacher' ? '👩‍🏫' : '👦';

    setLoading(true);
    showToast('⏳ Đang tạo tài khoản mới trên Supabase Database...');

    try {
      if (supabase) {
        const { data: existing } = await supabase
          .from('users')
          .select('username')
          .eq('username', cleanUsername);

        if (existing && existing.length > 0) {
          throw new Error('Tên đăng nhập này đã được sử dụng! Vui lòng chọn tên khác.');
        }

        const { data, error } = await supabase
          .from('users')
          .insert([{
            id: newId,
            username: cleanUsername,
            password: regPassword,
            role: role,
            full_name: regFullName,
            avatar: defaultAvatar,
            grade: 'Lớp 2A',
            stars: 100,
            xp: 50,
            level: 1,
            avg_score: 10.0,
            tests_done: 0,
            status: 'Mới đăng ký'
          }])
          .select()
          .single();

        if (error) {
          throw new Error('Đăng ký không thành công: ' + error.message);
        }

        const userObj = {
          id: data.id,
          username: data.username,
          role: data.role,
          name: data.full_name,
          grade: data.grade,
          avatar: data.avatar,
          stars: data.stars,
          xp: data.xp,
          level: data.level
        };

        onAuthSuccess(userObj);
        showToast(`🎉 Chúc mừng ${userObj.name} đã đăng ký tài khoản thành công!`);
        onClose();
      }
    } catch (err) {
      alert('⚠️ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay active">
      <div className="auth-modal-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#1E293B' }}>
            {mode === 'login' ? '🔐 Đăng Nhập Hệ Thống' : '✨ Đăng Ký Tài Khoản Mới'}
          </h2>
          <button
            style={{ background: 'transparent', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#64748B' }}
            onClick={onClose}
          >
            ✖
          </button>
        </div>

        {/* Auth Mode Switcher Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            🔑 Đăng Nhập
          </button>
          <button
            className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            ✨ Đăng Ký Mới
          </button>
        </div>

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Tên đăng nhập (Username):</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ví dụ: nam hoặc mai..."
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu:</label>
              <input
                type="password"
                className="form-control"
                placeholder="Nhập mật khẩu..."
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '8px' }}
            >
              {loading ? '⏳ Đang kết nối...' : '🚀 Đăng Nhập Ngay'}
            </button>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '14px', textAlign: 'center' }}>
              💡 <em>Dữ liệu được bảo mật và đồng bộ tự động với Supabase DB!</em><br />
              (Tài khoản dùng thử: <strong>nam / 123</strong> hoặc <strong>mai / 123</strong>)
            </p>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Bạn là:</label>
              <div className="role-radio-group">
                <div
                  className={`role-radio-btn ${role === 'student' ? 'selected' : ''}`}
                  onClick={() => setRole('student')}
                >
                  👦 Học sinh
                </div>
                <div
                  className={`role-radio-btn ${role === 'teacher' ? 'selected' : ''}`}
                  onClick={() => setRole('teacher')}
                >
                  👩‍🏫 Giáo viên
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Họ và Tên đầy đủ:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ví dụ: Bé Minh hoặc Cô Thu..."
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Tên đăng nhập (Username mới):</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập username viết liền không dấu..."
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu:</label>
              <input
                type="password"
                className="form-control"
                placeholder="Nhập mật khẩu tự chọn..."
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                marginTop: '8px',
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)'
              }}
            >
              {loading ? '⏳ Đang đăng ký...' : '✨ Tạo Tài Khoản Mới'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
