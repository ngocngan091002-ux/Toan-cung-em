import React, { useState } from 'react';
import { UserRole, Profile } from '../types/database.types';
import { authService } from '../services/authService';
import { X, Mail, Phone, Lock, User, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  selectedRole: UserRole;
  onClose: () => void;
  onSuccess: (profile: Profile) => void;
  showToast: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  selectedRole,
  onClose,
  onSuccess,
  showToast
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      showToast('⏳ Đang mở cửa sổ đăng nhập Google...');
      await authService.signInWithGoogle();
    } catch (err: any) {
      alert('⚠️ Không thể đăng nhập Google: ' + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        showToast('⏳ Đang tạo tài khoản trên Supabase Database...');
        const profile = await authService.registerAccount({
          email: authMethod === 'email' ? email : undefined,
          phone: authMethod === 'phone' ? phone : undefined,
          fullName,
          role: selectedRole,
          password
        });

        onSuccess(profile);
        showToast(`🎉 Chúc mừng ${profile.full_name} đã đăng ký tài khoản thành công!`);
        onClose();
      } else {
        showToast('⏳ Đang kết nối xác thực Supabase Auth...');
        const identifier = authMethod === 'email' ? email : phone;
        const profile = await authService.loginWithEmailOrPhone(identifier, password);

        onSuccess(profile);
        showToast(`🎉 Xin chào mừng ${profile.full_name} đã đăng nhập thành công!`);
        onClose();
      }
    } catch (err: any) {
      alert('⚠️ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 border-4 border-sky-400 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title & Role Indicator */}
        <div className="text-center mb-6">
          <div className="inline-block bg-sky-100 text-sky-800 text-xs font-black px-3 py-1 rounded-full mb-2">
            Đăng nhập với vai trò {selectedRole === 'teacher' ? '👩‍🏫 Giáo Viên' : '👨‍🎓 Học Sinh'}
          </div>
          <h2 className="font-fredoka text-2xl md:text-3xl font-black text-slate-800">
            {isRegister ? '✨ Đăng Ký Tài Khoản' : '🔐 Đăng Nhập Hệ Thống'}
          </h2>
        </div>

        {/* Google OAuth Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-white border-2 border-slate-200 hover:border-sky-400 text-slate-700 font-extrabold py-3 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Tiếp tục với Google / Gmail</span>
        </button>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
          <span className="relative bg-white px-3 text-xs font-bold text-slate-400">hoặc dùng SĐT / Email</span>
        </div>

        {/* Method Toggle (Email vs Phone) */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-4">
          <button
            type="button"
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-colors flex items-center justify-center gap-1.5 ${authMethod === 'email' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600'}`}
            onClick={() => setAuthMethod('email')}
          >
            <Mail className="w-3.5 h-3.5" /> Email
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-colors flex items-center justify-center gap-1.5 ${authMethod === 'phone' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600'}`}
            onClick={() => setAuthMethod('phone')}
          >
            <Phone className="w-3.5 h-3.5" /> Số Điện Thoại
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {isRegister && (
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Họ và Tên đầy đủ:</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn Nam hoặc Cô Thu..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 focus:border-sky-500 rounded-xl text-sm font-bold outline-none"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          {authMethod === 'email' ? (
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Địa chỉ Email:</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="Ví dụ: hs_nam@gmail.com..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 focus:border-sky-500 rounded-xl text-sm font-bold outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Số điện thoại:</label>
              <div className="relative">
                <Phone className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0987654321..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 focus:border-sky-500 rounded-xl text-sm font-bold outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">Mật khẩu:</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                placeholder="Nhập mật khẩu..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 focus:border-sky-500 rounded-xl text-sm font-bold outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-base"
          >
            {loading ? '⏳ Đang xử lý...' : isRegister ? '✨ Đăng Ký Ngay' : '🚀 Đăng Nhập'}
          </button>
        </form>

        {/* Register vs Login Switcher */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs font-extrabold text-sky-600 hover:text-sky-800 underline"
          >
            {isRegister ? 'Đã có tài khoản? Đăng nhập ngay' : 'Chưa có tài khoản? Đăng ký mới tại đây'}
          </button>
        </div>

        {selectedRole === 'teacher' && (
          <p className="mt-4 text-[11px] text-amber-700 font-bold bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>Lưu ý: Tài khoản Giáo viên mới cần Admin phê duyệt trước khi vào được hệ thống.</span>
          </p>
        )}
      </div>
    </div>
  );
};
