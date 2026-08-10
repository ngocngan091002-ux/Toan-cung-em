import React, { useState } from 'react';
import { SubmissionModel } from '../../types/database.types';
import { CheckCircle, Clock, Sparkles, UserCheck, MessageSquare } from 'lucide-react';

interface GradingManagerProps {
  submissions: SubmissionModel[];
  onApproveSubmission: (submissionId: string, finalScore: number, teacherComment: string) => Promise<void>;
  showToast: (msg: string) => void;
}

export const GradingManager: React.FC<GradingManagerProps> = ({
  submissions,
  onApproveSubmission,
  showToast
}) => {
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [scoreInput, setScoreInput] = useState<number>(10);
  const [commentInput, setCommentInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStartGrading = (sub: SubmissionModel) => {
    setEditingSubId(sub.id);
    setScoreInput(sub.ai_suggested_score || sub.total_score || 8.5);
    setCommentInput(sub.teacher_comment || sub.ai_suggested_comment || 'Con làm bài rất tốt, tiếp tục phát huy nhé!');
  };

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubId) return;
    setLoading(true);

    await onApproveSubmission(editingSubId, Number(scoreInput), commentInput.trim());
    setLoading(false);
    setEditingSubId(null);
    showToast('🎉 Đã CHỐT kết quả chấm bài! Điểm và nhận xét đã được gửi tới học sinh.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-2 border-slate-200 p-6 rounded-3xl shadow-sm">
        <h2 className="font-fredoka text-2xl font-black text-slate-800 flex items-center gap-2">
          <span>📝 QUY TRÌNH CHẤM BÀI HUMAN-IN-THE-LOOP (AI + GIÁO VIÊN CHỐT)</span>
        </h2>
        <p className="text-slate-500 text-xs font-bold mt-1">
          Học sinh nộp bài ➔ AI gợi ý điểm & nhận xét ➔ Giáo viên kiểm tra & CHỐT ➔ Học sinh mới xem được điểm.
        </p>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {submissions.map((sub) => (
          <div
            key={sub.id}
            className={`bg-white border-3 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              sub.is_approved ? 'border-emerald-300' : 'border-amber-300 bg-amber-50/50'
            }`}
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xl">👦</span>
                <h3 className="font-fredoka font-bold text-slate-800 text-lg">{sub.student_name || 'Học sinh'}</h3>
                {sub.is_approved ? (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Đã CHỐT Duyệt
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Đang chờ GV CHỐT
                  </span>
                )}
              </div>

              {/* AI Suggested Box */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl mt-2 text-xs space-y-1">
                <p className="font-black text-slate-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Gợi ý từ AI: {sub.ai_suggested_score} / 10 điểm
                </p>
                <p className="text-slate-600 font-semibold italic">"{sub.ai_suggested_comment}"</p>
              </div>

              {sub.is_approved && (
                <div className="mt-2 text-xs font-bold text-emerald-800">
                  Chốt của Giáo viên: <strong>{sub.total_score} / 10 điểm</strong> • "{sub.teacher_comment}"
                </div>
              )}
            </div>

            {/* Action Button */}
            <div>
              <button
                onClick={() => handleStartGrading(sub)}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>{sub.is_approved ? 'Sửa Chốt Điểm' : 'Duyệt & CHỐT ĐIỂM'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT & APPROVE MODAL */}
      {editingSubId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-4 border-emerald-400 shadow-2xl">
            <h3 className="font-fredoka text-xl font-bold text-slate-800 mb-4">✅ GIÁO VIÊN CHỐT BÀI CHẤM</h3>
            <form onSubmit={handleApproveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Điểm số chốt chính thức (0 - 10):</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="10"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-black text-emerald-600 outline-none"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Nhận xét của Giáo viên gửi học sinh:</label>
                <textarea
                  rows={3}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold outline-none"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setEditingSubId(null)} className="flex-1 bg-slate-100 font-bold py-2.5 rounded-xl text-xs">Hủy</button>
                <button type="submit" disabled={loading} className="flex-1 bg-emerald-500 text-white font-black py-2.5 rounded-xl text-xs shadow-md">
                  {loading ? '⏳ Đang lưu...' : 'CHỐT & GỬI CHO BÉ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
