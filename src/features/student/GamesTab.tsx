import React from 'react';
import { GameModel } from '../../types/database.types';
import { Gamepad2, Play } from 'lucide-react';

interface GamesTabProps {
  games: GameModel[];
  onPlayGame: (game: GameModel) => void;
}

export const GamesTab: React.FC<GamesTabProps> = ({ games, onPlayGame }) => {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-fredoka text-2xl font-black text-slate-800 flex items-center gap-2">
            <span>🎮 ĐẤU TRƯỜNG TRÒ CHƠI TOÁN HỌC</span>
          </h2>
          <p className="text-slate-500 text-xs font-bold mt-1">Chơi vui • Ôn luyện kiến thức toán Lớp 2 siêu giỏi</p>
        </div>
        <Gamepad2 className="w-8 h-8 text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Preset Game 1 */}
        <div className="bg-gradient-to-b from-emerald-50 to-white border-3 border-emerald-200 hover:border-emerald-400 p-5 rounded-2xl text-center shadow-sm hover:shadow-md transition-all group cursor-pointer">
          <div className="text-6xl mb-3 group-hover:scale-110 transition-transform">🌴 🦁</div>
          <h3 className="font-fredoka text-lg font-bold text-slate-800 mb-1">Thám Hiểm Rừng Xanh</h3>
          <span className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-full mb-3">
            Phép cộng & trừ phạm vi 100
          </span>
          <button
            onClick={() => onPlayGame({ id: 'g1', class_id: '', title: 'Thám Hiểm Rừng Xanh', description: '', game_type: 'jungle' })}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Play className="w-4 h-4 fill-white" /> CHƠI NGAY
          </button>
        </div>

        {/* Preset Game 2 */}
        <div className="bg-gradient-to-b from-sky-50 to-white border-3 border-sky-200 hover:border-sky-400 p-5 rounded-2xl text-center shadow-sm hover:shadow-md transition-all group cursor-pointer">
          <div className="text-6xl mb-3 group-hover:scale-110 transition-transform">🚀 🌌</div>
          <h3 className="font-fredoka text-lg font-bold text-slate-800 mb-1">Bắn Tên Lửa Vũ Trụ</h3>
          <span className="inline-block bg-sky-100 text-sky-800 text-[11px] font-black px-2.5 py-0.5 rounded-full mb-3">
            Bảng nhân 2 & 5
          </span>
          <button
            onClick={() => onPlayGame({ id: 'g2', class_id: '', title: 'Bắn Tên Lửa Vũ Trụ', description: '', game_type: 'space' })}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Play className="w-4 h-4 fill-white" /> CHƠI NGAY
          </button>
        </div>

        {/* Preset Game 3 */}
        <div className="bg-gradient-to-b from-purple-50 to-white border-3 border-purple-200 hover:border-purple-400 p-5 rounded-2xl text-center shadow-sm hover:shadow-md transition-all group cursor-pointer">
          <div className="text-6xl mb-3 group-hover:scale-110 transition-transform">🦕 ⚡</div>
          <h3 className="font-fredoka text-lg font-bold text-slate-800 mb-1">Khủng Long Đua Tốc Độ</h3>
          <span className="inline-block bg-purple-100 text-purple-800 text-[11px] font-black px-2.5 py-0.5 rounded-full mb-3">
            Tính nhẩm số tròn chục
          </span>
          <button
            onClick={() => onPlayGame({ id: 'g3', class_id: '', title: 'Khủng Long Đua Tốc Độ', description: '', game_type: 'dino' })}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-black py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Play className="w-4 h-4 fill-white" /> CHƠI NGAY
          </button>
        </div>
      </div>
    </div>
  );
};
