import React from 'react';
import { LearningMaterial } from '../../types/database.types';
import { BookOpen, Download, ExternalLink, FileText } from 'lucide-react';

interface MaterialsTabProps {
  materials: LearningMaterial[];
}

export const MaterialsTab: React.FC<MaterialsTabProps> = ({ materials }) => {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-fredoka text-2xl font-black text-slate-800 flex items-center gap-2">
            <span>📖 HỌC LIỆU CỦA CÔ GIÁO</span>
          </h2>
          <p className="text-slate-500 text-xs font-bold mt-1">File tài liệu, sách giáo khoa & bảng công thức lưu trên Supabase Storage</p>
        </div>
        <BookOpen className="w-8 h-8 text-sky-600" />
      </div>

      {materials.length === 0 ? (
        <div className="text-center py-12 text-slate-400 font-bold bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <span className="text-4xl block mb-2">📁</span>
          Chưa có học liệu nào được tải lên.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map((m) => (
            <div
              key={m.id}
              className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 hover:border-sky-400 transition-all flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0 font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-fredoka text-base font-bold text-slate-800">{m.title}</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">{m.description || 'Học liệu tham khảo Toán Lớp 2'}</p>
                  <span className="inline-block bg-slate-200 text-slate-700 text-[10px] font-black px-2 py-0.5 rounded-md mt-2">
                    {m.file_type.toUpperCase()}
                  </span>
                </div>
              </div>

              <a
                href={m.file_url}
                target="_blank"
                rel="noreferrer"
                className="bg-sky-500 hover:bg-sky-600 text-white font-black p-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
                title="Tải về / Xem ngay"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
