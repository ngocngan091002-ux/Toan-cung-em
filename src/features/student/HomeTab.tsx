import React from 'react';
import { Profile } from '../../types/database.types';
import { Sparkles, Award, Star, Zap } from 'lucide-react';

interface HomeTabProps {
  user: Profile;
  onNavigateTab: (tab: string) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ user, onNavigateTab }) => {
  return (
    <div className="space-y-6">
      {/* Mascot Hero Banner */}
      <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-md z-10 text-center md:text-left">
          <h1 className="font-fredoka text-2xl md:text-4xl font-bold leading-tight mb-2">
            Học Toán Vui - Bứt Phá Điểm Số! 🌟
          </h1>
          <p className="text-sky-100 text-sm font-semibold mb-5">
            Chào mừng {user.full_name} đến với thế giới Toán học Lớp 2 cùng Trợ lý AI Panda!
          </p>
          <button
            onClick={() => onNavigateTab('assignments')}
            className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-6 py-3 rounded-2xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2 mx-auto md:mx-0 text-sm"
          >
            <Sparkles className="w-4 h-4 fill-amber-950" />
            LÀM BÀI TẬP CÔ GIAO
          </button>
        </div>

        <div className="flex items-center gap-4 z-10">
          <div className="bg-white/95 text-slate-800 p-4 rounded-2xl rounded-bl-none shadow-md max-w-[200px] text-xs font-extrabold hidden sm:block">
            "Chào {user.full_name}! Cùng Panda hoàn thành các bài toán thú vị hôm nay nhé! 🐾"
          </div>
          <div className="text-7xl filter drop-shadow-md animate-bounce">🐼</div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('missions')}
          className="bg-white border-2 border-rose-200 hover:border-rose-400 p-5 rounded-2xl cursor-pointer shadow-sm hover:shadow-md transition-all text-center group"
        >
          <div className="w-12 h-12 mx-auto bg-rose-100 group-hover:bg-rose-500 text-rose-600 group-hover:text-white rounded-xl flex items-center justify-center text-2xl mb-2 transition-colors">
            📚
          </div>
          <h3 className="font-fredoka font-bold text-slate-800 text-sm">Nhiệm Vụ</h3>
          <p className="text-[11px] text-slate-500 font-semibold">Checklist hằng ngày</p>
        </div>

        <div
          onClick={() => onNavigateTab('assignments')}
          className="bg-white border-2 border-sky-200 hover:border-sky-400 p-5 rounded-2xl cursor-pointer shadow-sm hover:shadow-md transition-all text-center group"
        >
          <div className="w-12 h-12 mx-auto bg-sky-100 group-hover:bg-sky-500 text-sky-600 group-hover:text-white rounded-xl flex items-center justify-center text-2xl mb-2 transition-colors">
            📝
          </div>
          <h3 className="font-fredoka font-bold text-slate-800 text-sm">Bài Tập</h3>
          <p className="text-[11px] text-slate-500 font-semibold">Đồng hồ đếm thời gian</p>
        </div>

        <div
          onClick={() => onNavigateTab('games')}
          className="bg-white border-2 border-emerald-200 hover:border-emerald-400 p-5 rounded-2xl cursor-pointer shadow-sm hover:shadow-md transition-all text-center group"
        >
          <div className="w-12 h-12 mx-auto bg-emerald-100 group-hover:bg-emerald-500 text-emerald-600 group-hover:text-white rounded-xl flex items-center justify-center text-2xl mb-2 transition-colors">
            🎮
          </div>
          <h3 className="font-fredoka font-bold text-slate-800 text-sm">Trò Chơi</h3>
          <p className="text-[11px] text-slate-500 font-semibold">Đấu trường trí tuệ</p>
        </div>

        <div
          onClick={() => onNavigateTab('ai-tutor')}
          className="bg-white border-2 border-amber-200 hover:border-amber-400 p-5 rounded-2xl cursor-pointer shadow-sm hover:shadow-md transition-all text-center group"
        >
          <div className="w-12 h-12 mx-auto bg-amber-100 group-hover:bg-amber-500 text-amber-600 group-hover:text-white rounded-xl flex items-center justify-center text-2xl mb-2 transition-colors">
            🤖
          </div>
          <h3 className="font-fredoka font-bold text-slate-800 text-sm">AI Panda</h3>
          <p className="text-[11px] text-slate-500 font-semibold">Gợi mở Socratic</p>
        </div>
      </div>
    </div>
  );
};
