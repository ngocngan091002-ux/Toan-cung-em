import React from 'react';
import { Profile, SubmissionModel } from '../../types/database.types';
import { TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface ProgressTabProps {
  user: Profile;
  submissions: SubmissionModel[];
}

export const ProgressTab: React.FC<ProgressTabProps> = ({ user, submissions }) => {
  const totalDone = submissions.length;
  const approvedSubs = submissions.filter(s => s.is_approved);
  const avgScore = approvedSubs.length
    ? (approvedSubs.reduce((acc, s) => acc + (s.total_score || 0), 0) / approvedSubs.length).toFixed(1)
    : '8.5';

  return (
    <div className="space-y-6">
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-fredoka text-2xl font-black text-slate-800 flex items-center gap-2">
              <span>📊 KẾT QUẢ VÀ TIẾN BỘ HỌC TẬP</span>
            </h2>
            <p className="text-slate-500 text-xs font-bold mt-1">Phân tích điểm số, tốc độ giải bài & phản hồi từ Cô giáo</p>
          </div>
          <TrendingUp className="w-8 h-8 text-sky-600" />
        </div>

        {/* Overview Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-sky-50 border-2 border-sky-200 p-4 rounded-2xl text-center">
            <div className="text-3xl font-black text-sky-600 font-fredoka">{avgScore} / 10</div>
            <div className="text-xs font-bold text-slate-600 mt-1">Điểm Trung Bình Bài Thi</div>
          </div>

          <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-2xl text-center">
            <div className="text-3xl font-black text-emerald-600 font-fredoka">{totalDone}</div>
            <div className="text-xs font-bold text-slate-600 mt-1">Bài Tập Đã Hoàn Thành</div>
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl text-center">
            <div className="text-3xl font-black text-amber-600 font-fredoka">Nhanh ⚡</div>
            <div className="text-xs font-bold text-slate-600 mt-1">Tốc Độ Giải Bài Độc Lập</div>
          </div>
        </div>

        {/* Recent Submissions List */}
        <h3 className="font-fredoka text-lg font-bold text-slate-800 mb-3">Lịch Sử Nộp Bài Thi</h3>
        {submissions.length === 0 ? (
          <p className="text-slate-400 text-xs font-bold text-center py-6">Chưa có bài thi nào được hoàn thành.</p>
        ) : (
          <div className="space-y-3">
            {submissions.map(sub => (
              <div key={sub.id} className="bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-fredoka font-bold text-slate-800 text-sm">{sub.student_name || 'Bài làm của bé'}</h4>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString('vi-VN') : 'Mới nộp'}
                  </p>
                  {sub.is_approved && (
                    <p className="text-xs text-emerald-700 font-bold mt-1">Lời nhắn cô: "{sub.teacher_comment || 'Con học tập rất chăm chỉ!'}"</p>
                  )}
                </div>

                <div>
                  {sub.is_approved ? (
                    <span className="font-fredoka font-black text-lg text-emerald-600 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl">
                      {sub.total_score} / 10
                    </span>
                  ) : (
                    <span className="text-xs font-black text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-xl">
                      ⏳ Chờ Cô Duyệt
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const ProfileTab: React.FC<{ user: Profile }> = ({ user }) => {
  return (
    <div className="max-w-xl mx-auto bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm text-center">
      <div className="w-24 h-24 mx-auto rounded-full bg-sky-100 border-4 border-sky-300 flex items-center justify-center text-5xl mb-4 shadow-md">
        {user.avatar_url || '👦'}
      </div>

      <h2 className="font-fredoka text-2xl font-black text-slate-800 mb-1">{user.full_name}</h2>
      <p className="text-xs font-bold text-sky-600 bg-sky-100 inline-block px-3 py-1 rounded-full mb-6">
        Học sinh Lớp 2A • Trường Tiểu học
      </p>

      <div className="grid grid-cols-2 gap-4 text-left bg-slate-50 p-4 rounded-2xl border border-slate-200 text-sm font-bold text-slate-700">
        <div>
          <span className="text-slate-400 text-xs block">Email / SĐT:</span>
          {user.email || user.phone || 'Chưa cập nhật'}
        </div>
        <div>
          <span className="text-slate-400 text-xs block">Vai trò:</span>
          {user.role === 'student' ? '👨‍🎓 Học sinh' : user.role}
        </div>
        <div>
          <span className="text-slate-400 text-xs block">Số sao ⭐:</span>
          {user.stars || 100} ⭐
        </div>
        <div>
          <span className="text-slate-400 text-xs block">Điểm XP ⚡:</span>
          {user.xp || 50} XP
        </div>
      </div>
    </div>
  );
};
