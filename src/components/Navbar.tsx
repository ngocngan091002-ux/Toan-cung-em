import React from 'react';
import { Profile } from '../types/database.types';
import { LogOut, Star, Zap, User } from 'lucide-react';

interface NavbarProps {
  user: Profile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onOpenAuth, onLogout }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-4 border-sky-200 px-4 md:px-8 py-3 flex items-center justify-between shadow-sm">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 cursor-pointer">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-md animate-pulse">
          🐼
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-fredoka text-xl md:text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              Hành Trình Toán Học
            </span>
            <span className="bg-yellow-200 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-yellow-300">
              Lớp 2 AI
            </span>
          </div>
        </div>
      </div>

      {/* User Stats & Profile Actions */}
      <div className="flex items-center gap-3 md:gap-4">
        {user && user.role === 'student' && (
          <>
            <div className="bg-yellow-50 border-2 border-yellow-300 px-3 py-1 rounded-full flex items-center gap-1.5 font-black text-amber-700 text-sm shadow-xs">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{user.stars || 100}</span>
            </div>

            <div className="bg-blue-50 border-2 border-blue-300 px-3 py-1 rounded-full flex items-center gap-1.5 font-black text-blue-700 text-sm shadow-xs">
              <Zap className="w-4 h-4 fill-blue-400 text-blue-500" />
              <span>{user.xp || 50} XP</span>
            </div>
          </>
        )}

        {user ? (
          <div className="bg-white border-2 border-slate-200 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold shadow-xs">
            <span className="text-xl">{user.avatar_url || (user.role === 'teacher' ? '👩‍🏫' : '👦')}</span>
            <span className="hidden sm:inline text-slate-800 font-extrabold">{user.full_name}</span>
            <span className="text-xs px-2 py-0.5 rounded-md font-black bg-sky-100 text-sky-800">
              {user.role === 'admin' ? 'Admin' : user.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
            </span>
            <button
              onClick={onLogout}
              className="ml-2 text-red-500 hover:text-red-700 font-bold p-1 rounded-full hover:bg-red-50 transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="bg-gradient-to-r from-sky-500 to-blue-600 text-white font-extrabold px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            <span>🔑 Đăng Nhập</span>
          </button>
        )}
      </div>
    </header>
  );
};
