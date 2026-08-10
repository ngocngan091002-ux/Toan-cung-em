import React, { useState } from 'react';
import { Profile, ClassModel, LearningMaterial, MissionModel, AssignmentModel, QuestionModel, SubmissionModel } from '../types/database.types';

import { ClassManager } from '../features/teacher/ClassManager';
import { AssignmentEditor } from '../features/teacher/AssignmentEditor';
import { MissionManager } from '../features/teacher/MissionManager';
import { MaterialManager } from '../features/teacher/MaterialManager';
import { GradingManager } from '../features/teacher/GradingManager';
import { AiProposalManager } from '../features/teacher/AiProposalManager';
import { TeacherApprovalAdmin } from '../features/teacher/TeacherApprovalAdmin';

import { School, FileEdit, CheckSquare, BookOpen, UserCheck, Bot, ShieldCheck } from 'lucide-react';

interface TeacherPortalProps {
  teacher: Profile;
  classes: ClassModel[];
  students: Profile[];
  materials: LearningMaterial[];
  missions: MissionModel[];
  assignments: AssignmentModel[];
  submissions: SubmissionModel[];
  onCreateClass: (name: string) => Promise<void>;
  onAddStudent: (name: string, emailOrPhone: string) => Promise<void>;
  onCreateMaterial: (mat: Partial<LearningMaterial>) => Promise<void>;
  onCreateMission: (title: string, desc: string, xp: number, stars: number) => Promise<void>;
  onCreateAssignment: (title: string, type: 'exercise' | 'weekly_test') => Promise<AssignmentModel>;
  onAddQuestion: (q: Partial<QuestionModel>) => Promise<void>;
  onPublishAssignment: (assignmentId: string) => Promise<void>;
  onApproveSubmission: (submissionId: string, finalScore: number, teacherComment: string) => Promise<void>;
  showToast: (msg: string) => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  teacher,
  classes,
  students,
  materials,
  missions,
  assignments,
  submissions,
  onCreateClass,
  onAddStudent,
  onCreateMaterial,
  onCreateMission,
  onCreateAssignment,
  onAddQuestion,
  onPublishAssignment,
  onApproveSubmission,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<string>('classes');

  const navItems = [
    { id: 'classes', label: 'Quản lý Lớp & HS', icon: School },
    { id: 'assignments', label: 'Soạn Bài Tập & Đề', icon: FileEdit },
    { id: 'missions', label: 'Giao Nhiệm Vụ Hằng Ngày', icon: CheckSquare },
    { id: 'materials', label: 'Upload Học Liệu Storage', icon: BookOpen },
    { id: 'grading', label: 'Duyệt Điểm & Chấm Bài AI', icon: UserCheck },
    { id: 'ai-proposals', label: 'AI Đề Xuất & Nhận Xét', icon: Bot },
    { id: 'admin-approval', label: 'Admin Duyệt Giáo Viên', icon: ShieldCheck }
  ];

  const currentClassId = classes[0]?.id || '';

  return (
    <div className="space-y-6">
      {/* Teacher Navigation Tabs */}
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
                    ? 'bg-amber-500 text-white shadow-md scale-[1.02]'
                    : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Teacher Tab */}
      <main>
        {activeTab === 'classes' && (
          <ClassManager
            classes={classes}
            students={students}
            onCreateClass={onCreateClass}
            onAddStudent={onAddStudent}
            showToast={showToast}
          />
        )}

        {activeTab === 'assignments' && (
          <AssignmentEditor
            classId={currentClassId}
            assignments={assignments}
            onCreateAssignment={onCreateAssignment}
            onAddQuestion={onAddQuestion}
            onPublishAssignment={onPublishAssignment}
            showToast={showToast}
          />
        )}

        {activeTab === 'missions' && (
          <MissionManager
            classId={currentClassId}
            missions={missions}
            onCreateMission={onCreateMission}
            showToast={showToast}
          />
        )}

        {activeTab === 'materials' && (
          <MaterialManager
            classId={currentClassId}
            materials={materials}
            onCreateMaterial={onCreateMaterial}
            showToast={showToast}
          />
        )}

        {activeTab === 'grading' && (
          <GradingManager
            submissions={submissions}
            onApproveSubmission={onApproveSubmission}
            showToast={showToast}
          />
        )}

        {activeTab === 'ai-proposals' && (
          <AiProposalManager
            onAddSuggestedQuestions={(qs) => {
              qs.forEach(q => onAddQuestion(q));
            }}
            showToast={showToast}
          />
        )}

        {activeTab === 'admin-approval' && (
          <TeacherApprovalAdmin showToast={showToast} />
        )}
      </main>
    </div>
  );
};
