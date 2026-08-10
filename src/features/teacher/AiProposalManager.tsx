import React, { useState } from 'react';
import { aiService } from '../../services/aiService';
import { Sparkles, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

interface AiProposalManagerProps {
  onAddSuggestedQuestions: (questions: any[]) => void;
  showToast: (msg: string) => void;
}

export const AiProposalManager: React.FC<AiProposalManagerProps> = ({
  onAddSuggestedQuestions,
  showToast
}) => {
  const [proposals, setProposals] = useState<any[]>([]);
  const [weakTopicsSummary, setWeakTopicsSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateProposals = async () => {
    setLoading(true);
    showToast('🤖 AI đang phân tích dữ liệu thực tế Lớp 2...');

    const suggestedQs = await aiService.suggestExercisesForGrade2('Phép cộng có nhớ trong phạm vi 100');
    const weakTopics = await aiService.summarizeWeakTopics([]);

    setProposals(suggestedQs);
    setWeakTopicsSummary(weakTopics);
    setLoading(false);
    showToast('✨ AI đã tạo đề xuất bài tập mới! Giáo viên hãy xem và CHỐT nhé.');
  };

  const handleApproveProposal = (proposal: any) => {
    onAddSuggestedQuestions([proposal]);
    setProposals(prev => prev.filter(p => p !== proposal));
    showToast('🎉 Đã CHỐT đề xuất AI và thêm vào kho câu hỏi!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-2 border-slate-200 p-6 rounded-3xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-fredoka text-2xl font-black text-slate-800 flex items-center gap-2">
            <span>🤖 TRỢ LÝ AI ĐỀ XUẤT CHO GIÁO VIÊN (HUMAN-IN-THE-LOOP)</span>
          </h2>
          <p className="text-slate-500 text-xs font-bold mt-1">
            Quy trình: AI đề xuất ➔ Giáo viên xem & chỉnh sửa ➔ Giáo viên CHỐT ➔ Học sinh mới nhận được.
          </p>
        </div>

        <button
          onClick={handleGenerateProposals}
          disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{loading ? '⏳ AI Đang Đề Xuất...' : 'TẠO ĐỀ XUẤT AI MỚI'}</span>
        </button>
      </div>

      {/* Weak Topics AI Summary */}
      {weakTopicsSummary.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-sm space-y-2">
          <h3 className="font-fredoka text-lg font-bold text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" /> TỔNG HỢP VẤN ĐỀ CẦN LƯU Ý TỪ AI DỰA TRÊN DỮ LIỆU THỰC TẾ
          </h3>
          {weakTopicsSummary.map((item, idx) => (
            <div key={idx} className="text-xs font-bold text-amber-800 bg-white p-3 rounded-xl border border-amber-200">
              <strong>• Chủ đề: {item.topic}</strong> ➔ {item.mistakeRate}
            </div>
          ))}
        </div>
      )}

      {/* AI Proposals List */}
      <div className="space-y-4">
        {proposals.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-bold bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <span className="text-4xl block mb-2">🤖</span>
            Bấm nút "TẠO ĐỀ XUẤT AI MỚI" ở trên để nhận các câu hỏi bài tập Lớp 2 chuẩn GDPT từ AI Panda!
          </div>
        ) : (
          proposals.map((p, idx) => (
            <div key={idx} className="bg-white border-2 border-purple-200 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-purple-100 text-purple-800 text-xs font-black px-3 py-1 rounded-full">
                  Đề xuất câu hỏi #{idx + 1}
                </span>
                <button
                  onClick={() => handleApproveProposal(p)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> CHỐT DUYỆT ĐỀ XUẤT
                </button>
              </div>

              <h4 className="font-fredoka text-base font-bold text-slate-800">Đề bài: {p.question_text}</h4>
              <p className="text-xs font-semibold text-slate-500">Các đáp án: {p.options.join(' | ')}</p>
              <p className="text-xs font-bold text-emerald-700">Giải thích: {p.explanation}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
