import React, { useState } from 'react';
import { ClassModel, Profile } from '../../types/database.types';
import { School, UserPlus, Users, Plus, Check } from 'lucide-react';

interface ClassManagerProps {
  classes: ClassModel[];
  students: Profile[];
  onCreateClass: (name: string) => void;
  onAddStudent: (name: string, emailOrPhone: string) => void;
  showToast: (msg: string) => void;
}

export const ClassManager: React.FC<ClassManagerProps> = ({
  classes,
  students,
  onCreateClass,
  onAddStudent,
  showToast
}) => {
  const [classNameInput, setClassNameInput] = useState('');
  const [stdNameInput, setStdNameInput] = useState('');
  const [stdContactInput, setStdContactInput] = useState('');

  const [createClassModal, setCreateClassModal] = useState(false);
  const [addStudentModal, setAddStudentModal] = useState(false);

  const handleCreateClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classNameInput.trim()) return;
    onCreateClass(classNameInput.trim());
    setClassNameInput('');
    setCreateClassModal(false);
    showToast('✨ Đã tạo lớp học mới thành công!');
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stdNameInput.trim()) return;
    onAddStudent(stdNameInput.trim(), stdContactInput.trim());
    setStdNameInput('');
    setStdContactInput('');
    setAddStudentModal(false);
    showToast('✨ Đã thêm học sinh mới vào danh sách lớp!');
  };

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border-2 border-slate-200 p-6 rounded-3xl shadow-sm">
        <div>
          <h2 className="font-fredoka text-2xl font-black text-slate-800 flex items-center gap-2">
            <span>🏫 QUẢN LÝ LỚP HỌC & DANH SÁCH HỌC SINH</span>
          </h2>
          <p className="text-slate-500 text-xs font-bold mt-1">
            Tạo lớp mới, cung cấp tài khoản và theo dõi sỉ số học sinh thực tế trong Supabase DB
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateClassModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tạo Lớp Mới
          </button>
          <button
            onClick={() => setAddStudentModal(true)}
            className="bg-sky-500 hover:bg-sky-600 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Thêm Học Sinh Vào Lớp
          </button>
        </div>
      </div>

      {/* Class List & Students */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Classes Column */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
          <h3 className="font-fredoka text-lg font-bold text-slate-800 flex items-center gap-2">
            <School className="w-5 h-5 text-amber-600" /> Danh Sách Lớp ({classes.length})
          </h3>

          {classes.length === 0 ? (
            <p className="text-slate-400 text-xs font-bold text-center py-6">Chưa có lớp học nào.</p>
          ) : (
            classes.map(c => (
              <div key={c.id} className="bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl">
                <h4 className="font-fredoka font-bold text-amber-950 text-base">{c.name}</h4>
                <p className="text-xs font-bold text-amber-700 mt-0.5">Khối: {c.grade} • Mã lớp: <code>{c.code}</code></p>
              </div>
            ))
          )}
        </div>

        {/* Students Column */}
        <div className="md:col-span-2 bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
          <h3 className="font-fredoka text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-600" /> Danh Sách Học Sinh Thực Tế Trong Lớp ({students.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-500 font-extrabold">
                  <th className="py-2.5 px-3">Avatar</th>
                  <th className="py-2.5 px-3">Họ và Tên</th>
                  <th className="py-2.5 px-3">Email / SĐT</th>
                  <th className="py-2.5 px-3">Số sao ⭐</th>
                  <th className="py-2.5 px-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 font-bold text-slate-700 hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-lg">{s.avatar_url || '👦'}</td>
                    <td className="py-2.5 px-3 text-slate-900 font-black">{s.full_name}</td>
                    <td className="py-2.5 px-3">{s.email || s.phone || 'hs_nam@toan.edu.vn'}</td>
                    <td className="py-2.5 px-3 text-amber-600 font-black">{s.stars || 100} ⭐</td>
                    <td className="py-2.5 px-3 text-emerald-600 font-black">Active</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CREATE CLASS MODAL */}
      {createClassModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border-4 border-amber-400 shadow-2xl">
            <h3 className="font-fredoka text-xl font-bold text-slate-800 mb-4">🏫 Tạo Lớp Học Mới</h3>
            <form onSubmit={handleCreateClassSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Tên lớp học:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lớp 2A Toán Nâng Cao..."
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold outline-none"
                  value={classNameInput}
                  onChange={(e) => setClassNameInput(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setCreateClassModal(false)} className="flex-1 bg-slate-100 font-bold py-2.5 rounded-xl text-xs">Hủy</button>
                <button type="submit" className="flex-1 bg-amber-500 text-white font-black py-2.5 rounded-xl text-xs shadow-md">Tạo Lớp</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD STUDENT MODAL */}
      {addStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border-4 border-sky-400 shadow-2xl">
            <h3 className="font-fredoka text-xl font-bold text-slate-800 mb-4">👤 Thêm Học Sinh Vào Lớp</h3>
            <form onSubmit={handleAddStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Tên học sinh:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bé An, Bé Bình..."
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold outline-none"
                  value={stdNameInput}
                  onChange={(e) => setStdNameInput(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Email hoặc SĐT phụ huynh:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: an_2a@gmail.com..."
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold outline-none"
                  value={stdContactInput}
                  onChange={(e) => setStdContactInput(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setAddStudentModal(false)} className="flex-1 bg-slate-100 font-bold py-2.5 rounded-xl text-xs">Hủy</button>
                <button type="submit" className="flex-1 bg-sky-500 text-white font-black py-2.5 rounded-xl text-xs shadow-md">Thêm Học Sinh</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
