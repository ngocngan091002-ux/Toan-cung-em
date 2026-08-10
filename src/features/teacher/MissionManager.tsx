import React, { useState } from 'react';
import { MissionModel } from '../../types/database.types';
import { CheckSquare, Plus, Users, Star, Zap } from 'lucide-react';

interface MissionManagerProps {
  classId: string;
  missions: MissionModel[];
  onCreateMission: (title: string, desc: string, xp: number, stars: number) => Promise<void>;
  showToast: (msg: string) => void;
}

export const MissionManager: React.FC<MissionManagerProps> = ({
  classId,
  missions,
  onCreateMission,
  showToast
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [xp, setXp] = useState(50);
  const [stars, setStars] = useState(10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onCreateMission(title.trim(), desc.trim(), Number(xp), Number(stars));
    setTitle('');
    setDesc('');
    setModalOpen(false);
    showToast('✨ Đã giao nhiệm vụ mới cho lớp!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border-2 border-slate-200 p-6 rounded-3xl shadow-sm">
        <div>
          <h2 className="font-fredoka text-2xl font-black text-slate-800 flex items-center gap-2">
            <span>📚 GIAO NHIỆM VỤ HẰNG NGÀY & THEO DÕI TIẾN ĐỘ</span>
          </h2>
          <p className="text-slate-500 text-xs font-bold mt-1">
            Giao nhiệm vụ cụ thể cho từng buổi học & Theo dõi tỉ lệ học sinh làm xong thực tế (Ví dụ: 3/30)
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-rose-500 hover:bg-rose-600 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Giao Nhiệm Vụ Mới
        </button>
      </div>

      {/* Mission Cards List */}
      <div className="space-y-4">
        {missions.map(m => (
          <div key={m.id} className="bg-white border-2 border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm">
            <div>
              <h3 className="font-fredoka text-lg font-bold text-slate-800">{m.title}</h3>
              <p className="text-xs font-bold text-slate-500 mt-0.5">{m.description}</p>
              <div className="flex items-center gap-3 mt-2 text-xs font-black">
                <span className="text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500" /> Thưởng: +{m.reward_stars || 10} ⭐
                </span>
                <span className="text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-blue-500" /> Thưởng: +{m.reward_xp || 50} XP
                </span>
              </div>
            </div>

            {/* Completion Stat Badge (e.g. 3/30 completed) */}
            <div className="bg-sky-50 border-2 border-sky-200 p-3 rounded-xl text-center">
              <div className="flex items-center gap-1 font-fredoka font-black text-sky-800 text-base">
                <Users className="w-4 h-4 text-sky-600" />
                <span>3 / 30</span>
              </div>
              <p className="text-[10px] font-extrabold text-sky-600">Đã hoàn thành</p>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MISSION MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border-4 border-rose-400 shadow-2xl">
            <h3 className="font-fredoka text-xl font-bold text-slate-800 mb-4">📚 Giao Nhiệm Vụ Cho Lớp</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Tên nhiệm vụ:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ôn tập phép cộng có nhớ..."
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Mô tả nhiệm vụ:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Hoàn thành Bài tập 1 và hỏi chú Panda..."
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold outline-none"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">XP ⚡:</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold"
                    value={xp}
                    onChange={(e) => setXp(Number(e.target.value))}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Sao ⭐:</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold"
                    value={stars}
                    onChange={(e) => setStars(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 bg-slate-100 font-bold py-2.5 rounded-xl text-xs">Hủy</button>
                <button type="submit" className="flex-1 bg-rose-500 text-white font-black py-2.5 rounded-xl text-xs shadow-md">Giao Cho Lớp</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
