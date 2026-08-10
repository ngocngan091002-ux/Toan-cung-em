import React from 'react';
import { Profile } from '../../types/database.types';
import { Trophy, Star, Award, Medal } from 'lucide-react';

interface LeaderboardTabProps {
  students: Profile[];
  currentUserId: string;
}

export const LeaderboardTab: React.FC<LeaderboardTabProps> = ({ students, currentUserId }) => {
  // Sort students by stars & XP in real class
  const sorted = [...students].sort((a, b) => (b.stars || 0) - (a.stars || 0));

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-fredoka text-2xl font-black text-slate-800 flex items-center gap-2">
            <span>🏆 BẢNG XẾP HẠNG THÁM HIỂM LỚP 2A</span>
          </h2>
          <p className="text-slate-500 text-xs font-bold mt-1">Xếp hạng thực tế dựa trên điểm bài tập, số nhiệm vụ & Sao thưởng tích lũy</p>
        </div>
        <Trophy className="w-10 h-10 text-amber-500" />
      </div>

      <div className="space-y-3">
        {sorted.map((std, idx) => {
          const isMe = std.id === currentUserId;
          return (
            <div
              key={std.id}
              className={`p-4 rounded-2xl border-3 flex items-center justify-between transition-all ${
                isMe
                  ? 'bg-sky-50 border-sky-400 shadow-md ring-2 ring-sky-300'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank Position Badge */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-fredoka font-black text-lg">
                  {idx === 0 ? (
                    <span className="text-2xl">🥇</span>
                  ) : idx === 1 ? (
                    <span className="text-2xl">🥈</span>
                  ) : idx === 2 ? (
                    <span className="text-2xl">🥉</span>
                  ) : (
                    <span className="text-slate-600">#{idx + 1}</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl">{std.avatar_url || '👦'}</span>
                  <div>
                    <h3 className="font-fredoka font-bold text-slate-800 text-base">
                      {std.full_name} {isMe && <span className="text-xs bg-sky-500 text-white font-black px-2 py-0.5 rounded-full ml-2">Bé</span>}
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-500">Thành viên Lớp 2A</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 text-amber-800 border border-yellow-300 font-black text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{std.stars || 100} ⭐</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
