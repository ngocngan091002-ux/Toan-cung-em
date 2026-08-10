import React, { useState, useEffect } from 'react';
import { Profile } from '../../types/database.types';
import { dbService } from '../../services/dbService';
import { ShieldCheck, UserCheck } from 'lucide-react';

interface TeacherApprovalAdminProps {
  showToast: (msg: string) => void;
}

export const TeacherApprovalAdmin: React.FC<TeacherApprovalAdminProps> = ({ showToast }) => {
  const [pendingTeachers, setPendingTeachers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPending = async () => {
    setLoading(true);
    const list = await dbService.getPendingTeachers();
    setPendingTeachers(list);
    setLoading(false);
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (teacherId: string, fullName: string) => {
    await dbService.approveTeacher(teacherId);
    showToast(`🎉 Đã phê duyệt tài khoản Giáo viên ${fullName}!`);
    loadPending();
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-fredoka text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-600" /> ADMIN DUYỆT TÀI KHOẢN GIÁO VIÊN
          </h3>
          <p className="text-xs font-bold text-slate-500 mt-0.5">
            Bảo mật RLS: Giáo viên mới đăng ký phải được Admin bấm Duyệt (`is_approved = true`) mới có thể đăng nhập.
          </p>
        </div>

        <button
          onClick={loadPending}
          className="bg-slate-100 font-bold px-3 py-1.5 rounded-xl text-xs"
        >
          🔄 Tải lại
        </button>
      </div>

      {loading ? (
        <p className="text-xs font-bold text-slate-400">Đang kiểm tra danh sách chờ...</p>
      ) : pendingTeachers.length === 0 ? (
        <div className="text-center py-6 text-emerald-600 font-bold bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
          ✅ Không có tài khoản Giáo viên nào đang chờ phê duyệt.
        </div>
      ) : (
        <div className="space-y-3">
          {pendingTeachers.map((t) => (
            <div key={t.id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="font-fredoka font-bold text-slate-800 text-sm">👩‍🏫 {t.full_name}</h4>
                <p className="text-xs text-slate-500 font-semibold">{t.email || t.phone}</p>
              </div>

              <button
                onClick={() => handleApprove(t.id, t.full_name)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" /> DUYỆT CẤP QUYỀN
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
