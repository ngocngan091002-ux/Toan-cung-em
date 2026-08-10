import React from 'react';
import { MissionModel } from '../../types/database.types';
import { CheckCircle2, Circle, Trophy, Star, Zap } from 'lucide-react';

interface MissionsTabProps {
  missions: MissionModel[];
  missionProgress: Record<string, boolean>;
  onCompleteMission: (missionId: string) => void;
}

export const MissionsTab: React.FC<MissionsTabProps> = ({
  missions,
  missionProgress,
  onCompleteMission
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-fredoka text-2xl font-black text-slate-800 flex items-center gap-2">
              <span>📚 NHIỆM VỤ HÔM NAY</span>
              <span className="text-sm font-bold text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
                Do Cô Giáo Giao
              </span>
            </h2>
            <p className="text-slate-500 text-xs font-bold mt-1">
              Hãy bấm hoàn thành từng nhiệm vụ để nhận điểm Sao ⭐ và Kinh nghiệm ⚡ nhé!
            </p>
          </div>
          <Trophy className="w-10 h-10 text-amber-500" />
        </div>

        {missions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-bold bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <span className="text-4xl block mb-2">🎉</span>
            Chưa có nhiệm vụ nào do Cô giáo giao hôm nay. Em quay lại sau nhé!
          </div>
        ) : (
          <div className="space-y-4">
            {missions.map((m) => {
              const isDone = !!missionProgress[m.id];
              return (
                <div
                  key={m.id}
                  className={`p-5 rounded-2xl border-4 transition-all flex items-center justify-between gap-4 ${
                    isDone
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-rose-50 border-rose-300 hover:border-rose-400'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Status Check Icon: Red Circle if Uncompleted, Green Check if Completed */}
                    <div className="flex-shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-8 h-8 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-8 h-8 text-rose-500 fill-white" />
                      )}
                    </div>

                    <div>
                      <h3
                        className={`font-fredoka text-lg font-bold ${
                          isDone ? 'text-emerald-900 line-through' : 'text-rose-950'
                        }`}
                      >
                        {m.title}
                      </h3>
                      <p className="text-xs font-bold text-slate-600 mt-0.5">{m.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs font-black">
                        <span className="text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500" /> +{m.reward_stars || 10} ⭐
                        </span>
                        <span className="text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 fill-blue-500" /> +{m.reward_xp || 50} XP
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button: Disabled if Completed */}
                  <div>
                    {isDone ? (
                      <button
                        disabled
                        className="bg-emerald-600 text-white font-black text-xs px-5 py-2.5 rounded-xl opacity-90 cursor-not-allowed flex items-center gap-1.5 shadow-sm"
                      >
                        <span>☑ ĐÃ HOÀN THÀNH</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onCompleteMission(m.id)}
                        className="bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
                      >
                        <span>☐ HOÀN THÀNH</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
