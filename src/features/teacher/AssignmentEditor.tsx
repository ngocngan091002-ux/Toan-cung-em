import React, { useState } from 'react';
import { AssignmentModel, QuestionModel } from '../../types/database.types';
import { storageService } from '../../services/storageService';
import { FileEdit, Plus, Image as ImageIcon, CheckCircle, Eye, Lock } from 'lucide-react';

interface AssignmentEditorProps {
  classId: string;
  assignments: AssignmentModel[];
  onCreateAssignment: (title: string, type: 'exercise' | 'weekly_test') => Promise<AssignmentModel>;
  onAddQuestion: (q: Partial<QuestionModel>) => Promise<void>;
  onPublishAssignment: (assignmentId: string) => Promise<void>;
  showToast: (msg: string) => void;
}

export const AssignmentEditor: React.FC<AssignmentEditorProps> = ({
  classId,
  assignments,
  onCreateAssignment,
  onAddQuestion,
  onPublishAssignment,
  showToast
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [assignTitle, setAssignTitle] = useState('');
  const [assignType, setAssignType] = useState<'exercise' | 'weekly_test'>('exercise');

  const [activeAssignId, setActiveAssignId] = useState<string | null>(null);

  // Question form
  const [qText, setQText] = useState('');
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qAnswer, setQAnswer] = useState(0);
  const [qTopic, setQTopic] = useState('Phép cộng có nhớ');
  const [qImageFile, setQImageFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);

  const handleCreateAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle.trim()) return;

    const newAssign = await onCreateAssignment(assignTitle.trim(), assignType);
    setActiveAssignId(newAssign.id);
    setAssignTitle('');
    setModalOpen(false);
    showToast('✨ Đã khởi tạo bài tập mới! Thầy/Cô hãy thêm câu hỏi bên dưới nhé.');
  };

  const handleAddQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignId || !qText.trim()) return;
    setUploading(true);

    let imageUrl: string | undefined = undefined;
    if (qImageFile) {
      imageUrl = await storageService.uploadQuestionImage(qImageFile);
    }

    await onAddQuestion({
      assignment_id: activeAssignId,
      question_text: qText.trim(),
      question_image_url: imageUrl,
      options: [qOptA || 'Phương án A', qOptB || 'Phương án B', qOptC || 'Phương án C', qOptD || 'Phương án D'],
      correct_answer: Number(qAnswer),
      explanation: 'Hãy tính cẩn thận hàng đơn vị trước rồi cộng hàng chục nhé!',
      topic: qTopic
    });

    setUploading(false);
    setQText('');
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    setQImageFile(null);
    showToast('✨ Đã thêm câu hỏi vào đề thi thành công!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border-2 border-slate-200 p-6 rounded-3xl shadow-sm">
        <div>
          <h2 className="font-fredoka text-2xl font-black text-slate-800 flex items-center gap-2">
            <span>📝 TẠO & CHỈNH SỬA BÀI TẬP / BÀI KIỂM TRA</span>
          </h2>
          <p className="text-slate-500 text-xs font-bold mt-1">
            Quy trình Giáo viên CHỐT: Tạo đề ➔ Thêm ảnh đề bài ➔ Xem trước ➔ CHỐT (`is_published = true`) ➔ Học sinh mới được nhận.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-sky-500 hover:bg-sky-600 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tạo Bộ Bài Tập Mới
        </button>
      </div>

      {/* Assignment List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.map((assign) => (
          <div
            key={assign.id}
            className={`bg-white border-3 rounded-3xl p-5 shadow-sm space-y-4 ${
              assign.is_published ? 'border-emerald-300' : 'border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-black px-3 py-1 rounded-full ${
                assign.type === 'weekly_test' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {assign.type === 'weekly_test' ? '📝 Bài kiểm tra tuần' : '✏️ Bài tập luyện tập'}
              </span>

              {assign.is_published ? (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Đã CHỐT Giao Cho Lớp
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Bản nháp (Đang soạn)
                </span>
              )}
            </div>

            <h3 className="font-fredoka text-xl font-bold text-slate-800">{assign.title}</h3>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveAssignId(assign.id)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" /> Thêm Câu Hỏi
              </button>

              {!assign.is_published && (
                <button
                  onClick={async () => {
                    await onPublishAssignment(assign.id);
                    showToast('🎉 Đã CHỐT bài tập! Học sinh đã có thể xem và làm bài.');
                  }}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2 rounded-xl text-xs shadow-md flex items-center justify-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" /> CHỐT GIAO BÀI
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Question Form Drawer */}
      {activeAssignId && (
        <div className="bg-slate-50 border-4 border-sky-300 rounded-3xl p-6 shadow-md">
          <h3 className="font-fredoka text-xl font-bold text-slate-800 mb-4">
            ➕ Thêm Câu Hỏi Mới Cho Đề Bài
          </h3>

          <form onSubmit={handleAddQuestionSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Chủ đề toán:</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold outline-none"
                value={qTopic}
                onChange={(e) => setQTopic(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Nội dung đề bài:</label>
              <textarea
                required
                rows={2}
                placeholder="Nhập nội dung bài toán Lớp 2..."
                className="w-full px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold outline-none"
                value={qText}
                onChange={(e) => setQText(e.target.value)}
              />
            </div>

            {/* Optional Image Upload */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Thêm hình ảnh đề bài (Tùy chọn - Tải lên Supabase Storage):</label>
              <input
                type="file"
                accept="image/*"
                className="text-xs font-bold text-slate-600"
                onChange={(e) => setQImageFile(e.target.files?.[0] || null)}
              />
            </div>

            {/* Options A, B, C, D */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Phương án A"
                required
                className="px-3 py-2 bg-white border-2 border-slate-200 rounded-xl text-xs font-bold"
                value={qOptA}
                onChange={(e) => setQOptA(e.target.value)}
              />
              <input
                type="text"
                placeholder="Phương án B"
                required
                className="px-3 py-2 bg-white border-2 border-slate-200 rounded-xl text-xs font-bold"
                value={qOptB}
                onChange={(e) => setQOptB(e.target.value)}
              />
              <input
                type="text"
                placeholder="Phương án C"
                className="px-3 py-2 bg-white border-2 border-slate-200 rounded-xl text-xs font-bold"
                value={qOptC}
                onChange={(e) => setQOptC(e.target.value)}
              />
              <input
                type="text"
                placeholder="Phương án D"
                className="px-3 py-2 bg-white border-2 border-slate-200 rounded-xl text-xs font-bold"
                value={qOptD}
                onChange={(e) => setQOptD(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Đáp án đúng:</label>
              <select
                className="w-full px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold outline-none"
                value={qAnswer}
                onChange={(e) => setQAnswer(Number(e.target.value))}
              >
                <option value={0}>A ({qOptA || 'Phương án A'})</option>
                <option value={1}>B ({qOptB || 'Phương án B'})</option>
                <option value={2}>C ({qOptC || 'Phương án C'})</option>
                <option value={3}>D ({qOptD || 'Phương án D'})</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="bg-sky-500 hover:bg-sky-600 text-white font-black px-6 py-2.5 rounded-xl text-xs shadow-md"
            >
              {uploading ? '⏳ Đang tải ảnh & Lưu...' : '✨ Lưu Câu Hỏi Vào Đề Bài'}
            </button>
          </form>
        </div>
      )}

      {/* CREATE ASSIGNMENT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border-4 border-sky-400 shadow-2xl">
            <h3 className="font-fredoka text-xl font-bold text-slate-800 mb-4">📝 Tạo Đề Bài Tập Mới</h3>
            <form onSubmit={handleCreateAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Tên bài tập:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ôn tập phép cộng có nhớ Tuần 1..."
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold outline-none"
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Loại hình:</label>
                <select
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold outline-none"
                  value={assignType}
                  onChange={(e) => setAssignType(e.target.value as any)}
                >
                  <option value="exercise">✏️ Bài tập luyện tập</option>
                  <option value="weekly_test">📝 Bài kiểm tra hằng tuần</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 bg-slate-100 font-bold py-2.5 rounded-xl text-xs">Hủy</button>
                <button type="submit" className="flex-1 bg-sky-500 text-white font-black py-2.5 rounded-xl text-xs shadow-md">Tạo Khung Đề</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
