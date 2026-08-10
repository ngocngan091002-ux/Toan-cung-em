import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { Toast, LoadingSpinner } from './components/Toast';

import { StudentPortal } from './pages/StudentPortal';
import { TeacherPortal } from './pages/TeacherPortal';

import { authService } from './services/authService';
import { dbService } from './services/dbService';

import {
  Profile,
  UserRole,
  ClassModel,
  LearningMaterial,
  MissionModel,
  AssignmentModel,
  QuestionModel,
  SubmissionModel
} from './types/database.types';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<Profile | null>(authService.getLocalProfile());
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Real Database State
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const [students, setStudents] = useState<Profile[]>([]);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [missions, setMissions] = useState<MissionModel[]>([]);
  const [missionProgress, setMissionProgress] = useState<Record<string, boolean>>({});
  const [assignments, setAssignments] = useState<AssignmentModel[]>([]);
  const [questionsMap, setQuestionsMap] = useState<Record<string, QuestionModel[]>>({});
  const [submissionsMap, setSubmissionsMap] = useState<Record<string, SubmissionModel>>({});

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Load Real Supabase Data on mount or user change
  useEffect(() => {
    const loadRealData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Classes
        const clsList = await dbService.getClasses();
        setClasses(clsList);

        const targetClassId = clsList[0]?.id || '';

        if (targetClassId) {
          // 2. Fetch Class Students
          const stdList = await dbService.getClassStudents(targetClassId);
          setStudents(stdList);

          // 3. Fetch Learning Materials
          const matList = await dbService.getMaterials(targetClassId);
          setMaterials(matList);

          // 4. Fetch Daily Missions
          const mList = await dbService.getMissions(targetClassId);
          setMissions(mList);

          // 5. Fetch Student Mission Progress
          if (currentUser && currentUser.role === 'student') {
            const mProg = await dbService.getStudentMissionProgress(currentUser.id);
            setMissionProgress(mProg);
          }

          // 6. Fetch Assignments
          const isStudent = currentUser?.role === 'student';
          const assignList = await dbService.getAssignments(targetClassId, isStudent);
          setAssignments(assignList);

          // 7. Fetch Questions & Submissions for each assignment
          const qMap: Record<string, QuestionModel[]> = {};
          const sMap: Record<string, SubmissionModel> = {};

          for (const a of assignList) {
            const qList = await dbService.getQuestions(a.id);
            qMap[a.id] = qList;

            const subList = await dbService.getSubmissions(a.id, isStudent ? currentUser?.id : undefined);
            if (subList[0]) {
              sMap[a.id] = subList[0];
            }
          }

          setQuestionsMap(qMap);
          setSubmissionsMap(sMap);
        }
      } catch (err) {
        console.warn('Real Supabase data load error, using default fallback:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRealData();
  }, [currentUser?.id, currentUser?.role]);

  // Handlers
  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    showToast('👋 Đã đăng xuất thành công!');
  };

  const handleCreateClass = async (name: string) => {
    if (!currentUser) return;
    const newCls = await dbService.createClass(name, currentUser.id);
    setClasses(prev => [newCls, ...prev]);
  };

  const handleAddStudent = async (name: string, emailOrPhone: string) => {
    if (!classes[0]) return;
    const newStd = await authService.registerAccount({
      fullName: name,
      email: emailOrPhone.includes('@') ? emailOrPhone : undefined,
      phone: !emailOrPhone.includes('@') ? emailOrPhone : undefined,
      password: '123',
      role: 'student',
      classId: classes[0].id
    });
    setStudents(prev => [...prev, newStd]);
  };

  const handleCreateMaterial = async (mat: Partial<LearningMaterial>) => {
    const newMat = await dbService.createMaterial(mat);
    setMaterials(prev => [newMat, ...prev]);
  };

  const handleCreateMission = async (title: string, desc: string, xp: number, stars: number) => {
    if (!classes[0] || !currentUser) return;
    const newM = await dbService.createMission({
      class_id: classes[0].id,
      title,
      description: desc,
      reward_xp: xp,
      reward_stars: stars,
      is_published: true,
      created_by: currentUser.id
    });
    setMissions(prev => [newM, ...prev]);
  };

  const handleCompleteMission = async (missionId: string) => {
    if (!currentUser) return;
    const success = await dbService.completeMission(missionId, currentUser.id);

    if (success) {
      setMissionProgress(prev => ({ ...prev, [missionId]: true }));
      setCurrentUser(u => u ? { ...u, stars: (u.stars || 100) + 10, xp: (u.xp || 50) + 50 } : null);
      showToast('🎉 Bạn đã đánh dấu hoàn thành nhiệm vụ! +10 ⭐, +50 XP');
    }
  };

  const handleCreateAssignment = async (title: string, type: 'exercise' | 'weekly_test') => {
    if (!classes[0] || !currentUser) return null as any;
    const newA = await dbService.createAssignment({
      class_id: classes[0].id,
      title,
      type,
      is_published: false, // Teacher must publish
      created_by: currentUser.id
    });
    setAssignments(prev => [newA, ...prev]);
    return newA;
  };

  const handleAddQuestion = async (q: Partial<QuestionModel>) => {
    const newQ = await dbService.createQuestion(q);
    if (q.assignment_id) {
      setQuestionsMap(prev => ({
        ...prev,
        [q.assignment_id!]: [...(prev[q.assignment_id!] || []), newQ]
      }));
    }
  };

  const handlePublishAssignment = async (assignmentId: string) => {
    await dbService.publishAssignment(assignmentId);
    setAssignments(prev =>
      prev.map(a => (a.id === assignmentId ? { ...a, is_published: true } : a))
    );
  };

  const handleSubmitAnswers = async (
    assignmentId: string,
    answers: { questionId: string; selectedOption: number; isCorrect: boolean; timeSpentSeconds: number; topic: string }[]
  ) => {
    if (!currentUser) return;
    const sub = await dbService.submitAssignmentAnswers(
      assignmentId,
      currentUser.id,
      currentUser.full_name,
      answers
    );
    setSubmissionsMap(prev => ({ ...prev, [assignmentId]: sub }));
    showToast('📝 Bài làm đã được gửi thành công! Đang chờ Cô giáo CHỐT điểm.');
  };

  const handleApproveSubmission = async (submissionId: string, finalScore: number, teacherComment: string) => {
    await dbService.approveSubmission(submissionId, finalScore, teacherComment);
    setSubmissionsMap(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(k => {
        if (updated[k].id === submissionId) {
          updated[k] = { ...updated[k], total_score: finalScore, teacher_comment: teacherComment, is_approved: true };
        }
      });
      return updated;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar
        user={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        {loading ? (
          <LoadingSpinner label="Đang đồng bộ dữ liệu thời gian thực từ Supabase Database..." />
        ) : !currentUser ? (
          <LandingPage onSelectRole={handleSelectRole} />
        ) : currentUser.role === 'student' ? (
          <StudentPortal
            user={currentUser}
            missions={missions}
            missionProgress={missionProgress}
            materials={materials}
            games={[]}
            assignments={assignments}
            questionsMap={questionsMap}
            submissionsMap={submissionsMap}
            allStudents={students}
            onCompleteMission={handleCompleteMission}
            onSubmitAnswers={handleSubmitAnswers}
            showToast={showToast}
          />
        ) : (
          <TeacherPortal
            teacher={currentUser}
            classes={classes}
            students={students}
            materials={materials}
            missions={missions}
            assignments={assignments}
            submissions={Object.values(submissionsMap)}
            onCreateClass={handleCreateClass}
            onAddStudent={handleAddStudent}
            onCreateMaterial={handleCreateMaterial}
            onCreateMission={handleCreateMission}
            onCreateAssignment={handleCreateAssignment}
            onAddQuestion={handleAddQuestion}
            onPublishAssignment={handlePublishAssignment}
            onApproveSubmission={handleApproveSubmission}
            showToast={showToast}
          />
        )}
      </div>

      <AuthModal
        isOpen={authModalOpen}
        selectedRole={selectedRole}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(profile) => setCurrentUser(profile)}
        showToast={showToast}
      />

      <Toast message={toastMsg} />
    </div>
  );
};

export default App;
