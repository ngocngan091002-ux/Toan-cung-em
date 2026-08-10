import React, { useState } from 'react';
import { Profile, MissionModel, LearningMaterial, GameModel, AssignmentModel, QuestionModel, SubmissionModel } from '../types/database.types';

import { HomeTab } from '../features/student/HomeTab';
import { MissionsTab } from '../features/student/MissionsTab';
import { AssignmentsTab } from '../features/student/AssignmentsTab';
import { GamesTab } from '../features/student/GamesTab';
import { MaterialsTab } from '../features/student/MaterialsTab';
import { AiTutorTab } from '../features/student/AiTutorTab';
import { ProgressTab, ProfileTab } from '../features/student/ProgressTab';
import { LeaderboardTab } from '../features/student/LeaderboardTab';

import { Home, CheckSquare, FileEdit, Gamepad, BookOpen, Bot, BarChart3, Trophy, User } from 'lucide-react';

interface StudentPortalProps {
  user: Profile;
  missions: MissionModel[];
  missionProgress: Record<string, boolean>;
  materials: LearningMaterial[];
  games: GameModel[];
  assignments: AssignmentModel[];
  questionsMap: Record<string, QuestionModel[]>;
  submissionsMap: Record<string, SubmissionModel>;
  allStudents: Profile[];
  onCompleteMission: (missionId: string) => void;
  onSubmitAnswers: (
    assignmentId: string,
    answers: { questionId: string; selectedOption: number; isCorrect: boolean; timeSpentSeconds: number; topic: string }[]
  ) => void;
  showToast: (msg: string) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  user,
  missions,
  missionProgress,
  materials,
  games,
  assignments,
  questionsMap,
  submissionsMap,
  allStudents,
  onCompleteMission,
  onSubmitAnswers,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<string>('home');

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'missions', label: 'Nhiệm vụ hôm nay', icon: CheckSquare },
    { id: 'assignments', label: 'Bài tập', icon: FileEdit },
    { id: 'games', label: 'Trò chơi', icon: Gamepad },
    { id: 'materials', label: 'Học liệu', icon: BookOpen },
    { id: 'ai-tutor', label: 'Trợ lý AI', icon: Bot },
    { id: 'progress', label: 'Kết quả & Tiến bộ', icon: BarChart3 },
    { id: 'leaderboard', label: 'Bảng xếp hạng', icon: Trophy },
    { id: 'profile', label: 'Hồ sơ', icon: User }
  ];

  return (
    <div className="space-y-6">
      {/* 9 Tabs Horizontal Navigation Bar */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-2 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2.5 rounded-2xl font-fredoka font-bold text-xs transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md scale-[1.02]'
                    : 'text-slate-600 hover:bg-sky-50 hover:text-sky-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Tab Component */}
      <main>
        {activeTab === 'home' && (
          <HomeTab user={user} onNavigateTab={(t) => setActiveTab(t)} />
        )}

        {activeTab === 'missions' && (
          <MissionsTab
            missions={missions}
            missionProgress={missionProgress}
            onCompleteMission={onCompleteMission}
          />
        )}

        {activeTab === 'assignments' && (
          <AssignmentsTab
            assignments={assignments}
            questionsMap={questionsMap}
            submissionsMap={submissionsMap}
            onSubmitAnswers={onSubmitAnswers}
          />
        )}

        {activeTab === 'games' && (
          <GamesTab
            games={games}
            onPlayGame={(g) => showToast(`🎮 Trò chơi "${g.title}" đang bắt đầu...`)}
          />
        )}

        {activeTab === 'materials' && (
          <MaterialsTab materials={materials} />
        )}

        {activeTab === 'ai-tutor' && (
          <AiTutorTab />
        )}

        {activeTab === 'progress' && (
          <ProgressTab user={user} submissions={Object.values(submissionsMap)} />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardTab students={allStudents} currentUserId={user.id} />
        )}

        {activeTab === 'profile' && (
          <ProfileTab user={user} />
        )}
      </main>
    </div>
  );
};
