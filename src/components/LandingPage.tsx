import React from 'react';
import { UserRole } from '../types/database.types';
import { GraduationCap, School, ShieldCheck, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 text-center">
      {/* Mascot & Intro Header */}
      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-300 flex items-center justify-center text-6xl shadow-xl mb-6 animate-bounce">
        🐼
      </div>

      <h1 className="font-fredoka text-3xl md:text-5xl font-black text-slate-800 mb-4 max-w-2xl leading-tight">
        HÀNH TRÌNH TOÁN HỌC <span className="text-sky-600">LỚP 2 AI</span> 🌟
      </h1>
      <p className="text-slate-600 text-base md:text-lg font-bold max-w-xl mb-10 leading-relaxed">
        Nền tảng học tập tương tác số tích hợp Trợ lý AI Panda, đồng hồ đếm thời gian độc lập từng câu hỏi và quy trình duyệt bài Giáo viên thông minh.
      </p>

      {/* Role Selection Buttons: 👩‍🏫 Giáo viên | 👨‍🎓 Học sinh */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {/* Student Choice */}
        <div
          onClick={() => onSelectRole('student')}
          className="group relative bg-white border-4 border-sky-200 hover:border-sky-500 rounded-3xl p-8 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center overflow-hidden"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-sky-100 group-hover:bg-sky-500 group-hover:text-white text-sky-600 flex items-center justify-center text-4xl mb-4 transition-colors">
            👨‍🎓
          </div>
          <h2 className="font-fredoka text-2xl font-bold text-slate-800 mb-2">HỌC SINH</h2>
          <p className="text-slate-500 text-sm font-semibold mb-6">
            Nhận nhiệm vụ hằng ngày, làm bài tập đếm thời gian, khám phá đấu trường trò chơi toán và hỏi chú Panda AI.
          </p>
          <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2">
            <GraduationCap className="w-5 h-5" />
            <span>VÀO HỌC NGAY</span>
          </button>
        </div>

        {/* Teacher Choice */}
        <div
          onClick={() => onSelectRole('teacher')}
          className="group relative bg-white border-4 border-amber-200 hover:border-amber-500 rounded-3xl p-8 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center overflow-hidden"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-100 group-hover:bg-amber-500 group-hover:text-white text-amber-600 flex items-center justify-center text-4xl mb-4 transition-colors">
            👩‍🏫
          </div>
          <h2 className="font-fredoka text-2xl font-bold text-slate-800 mb-2">GIÁO VIÊN</h2>
          <p className="text-slate-500 text-sm font-semibold mb-6">
            Tạo lớp, giao bài tập có ảnh, quản lý học liệu Supabase Storage & sử dụng Trợ lý AI đề xuất chấm điểm/nhận xét.
          </p>
          <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2">
            <School className="w-5 h-5" />
            <span>QUẢN LÝ LỚP HỌC</span>
          </button>
        </div>
      </div>

      {/* RLS & Admin Approval Feature Notice */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-bold max-w-xl">
        <div className="flex items-center gap-1.5 text-emerald-600">
          <ShieldCheck className="w-4 h-4" />
          <span>Bảo mật Supabase RLS 2 tầng</span>
        </div>
        <div className="flex items-center gap-1.5 text-blue-600">
          <Sparkles className="w-4 h-4" />
          <span>Giáo viên cần Admin duyệt (is_approved)</span>
        </div>
      </div>
    </div>
  );
};
