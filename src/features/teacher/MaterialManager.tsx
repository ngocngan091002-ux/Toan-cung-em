import React, { useState } from 'react';
import { LearningMaterial } from '../../types/database.types';
import { storageService } from '../../services/storageService';
import { BookOpen, UploadCloud, FileText, Download } from 'lucide-react';

interface MaterialManagerProps {
  classId: string;
  materials: LearningMaterial[];
  onCreateMaterial: (mat: Partial<LearningMaterial>) => Promise<void>;
  showToast: (msg: string) => void;
}

export const MaterialManager: React.FC<MaterialManagerProps> = ({
  classId,
  materials,
  onCreateMaterial,
  showToast
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !file) return;
    setUploading(true);

    try {
      const publicUrl = await storageService.uploadMaterialFile(file);
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';
      const fileType = fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg' ? 'image' : 'pdf';

      await onCreateMaterial({
        class_id: classId,
        title: title.trim(),
        description: desc.trim(),
        file_url: publicUrl,
        file_type: fileType
      });

      setTitle('');
      setDesc('');
      setFile(null);
      setModalOpen(false);
      showToast('✨ Đã tải học liệu lên Supabase Storage thành công!');
    } catch (err: any) {
      alert('⚠️ Tải file thất bại: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border-2 border-slate-200 p-6 rounded-3xl shadow-sm">
        <div>
          <h2 className="font-fredoka text-2xl font-black text-slate-800 flex items-center gap-2">
            <span>📖 QUẢN LÝ HỌC LIỆU SỐ (SUPABASE STORAGE)</span>
          </h2>
          <p className="text-slate-500 text-xs font-bold mt-1">
            Tải lên tài liệu giảng dạy, bài giảng PDF, hình ảnh bài tập lưu trữ trực tiếp trên đám mây Supabase
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-sky-500 hover:bg-sky-600 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2"
        >
          <UploadCloud className="w-4 h-4" /> Tải Học Liệu Mới Lên
        </button>
      </div>

      {/* Material Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {materials.map(m => (
          <div key={m.id} className="bg-white border-2 border-slate-200 rounded-2xl p-5 flex items-start justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-fredoka text-base font-bold text-slate-800">{m.title}</h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">{m.description}</p>
                <span className="inline-block bg-slate-100 text-slate-700 text-[10px] font-black px-2 py-0.5 rounded-md mt-2">
                  {m.file_type.toUpperCase()}
                </span>
              </div>
            </div>

            <a
              href={m.file_url}
              target="_blank"
              rel="noreferrer"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl text-xs font-bold shadow-xs"
              title="Tải về"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>

      {/* UPLOAD MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border-4 border-sky-400 shadow-2xl">
            <h3 className="font-fredoka text-xl font-bold text-slate-800 mb-4">📖 Upload Học Liệu Supabase</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Tên tài liệu:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bảng công thức phép tính có nhớ..."
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Mô tả tài liệu:</label>
                <input
                  type="text"
                  placeholder="Mô tả tóm tắt cho học sinh..."
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold outline-none"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Chọn file (PDF / Hình ảnh):</label>
                <input
                  type="file"
                  required
                  className="text-xs font-bold text-slate-600"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 bg-slate-100 font-bold py-2.5 rounded-xl text-xs">Hủy</button>
                <button type="submit" disabled={uploading} className="flex-1 bg-sky-500 text-white font-black py-2.5 rounded-xl text-xs shadow-md">
                  {uploading ? '⏳ Uploading...' : 'Tải Lên Storage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
