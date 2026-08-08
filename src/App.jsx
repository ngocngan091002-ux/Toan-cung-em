import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { AntiCheatModal, Toast } from './components/AntiCheatModal';

import { StudentDashboard } from './features/student/StudentDashboard';
import { MathGames } from './features/student/MathGames';
import { WeeklyTest } from './features/student/WeeklyTest';
import { TestHistory } from './features/student/TestHistory';

import { TeacherDashboard } from './features/teacher/TeacherDashboard';
import { PandaDrawer } from './features/ai-tutor/PandaDrawer';

import {
  supabase,
  getSavedUserSession,
  saveUserSession,
  clearUserSession,
  initialMissions,
  initialQuestions,
  initialSubmissions,
  initialStudents,
  initialRecommendations
} from './services/supabaseClient';

export const App = () => {
  const [currentUser, setCurrentUser] = useState(getSavedUserSession());
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'games' | 'test' | 'history'

  const [missions, setMissions] = useState(initialMissions);
  const [questionBank, setQuestionBank] = useState(initialQuestions);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [students, setStudents] = useState(initialStudents);
  const [recommendations, setRecommendations] = useState(initialRecommendations);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [antiCheatWarningOpen, setAntiCheatWarningOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Show Toast notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  // Sync data from Supabase DB on mount
  useEffect(() => {
    const fetchFromSupabase = async () => {
      if (!supabase) return;
      try {
        // Fetch Students
        const { data: stdData } = await supabase.from('users').select('*').eq('role', 'student');
        if (stdData && stdData.length) {
          setStudents(stdData.map(s => ({
            id: s.id,
            name: s.full_name,
            avgScore: Number(s.avg_score || 8.75),
            testsDone: s.tests_done || 0,
            weakTopic: s.weak_topic || 'Chưa có',
            status: s.status || 'Đang học',
            stars: s.stars || 0
          })));

          const me = stdData.find(s => s.id === currentUser.id);
          if (me) {
            setCurrentUser(prev => ({
              ...prev,
              stars: me.stars,
              xp: me.xp,
              level: me.level
            }));
          }
        }

        // Fetch Question Bank
        const { data: qData } = await supabase.from('question_bank').select('*');
        if (qData && qData.length) {
          setQuestionBank(qData);
        }

        // Fetch Submissions
        const { data: subData } = await supabase.from('test_submissions').select('*').order('submitted_at', { ascending: false });
        if (subData && subData.length) {
          setSubmissions(subData.map(sub => ({
            id: sub.id,
            studentId: sub.student_id,
            studentName: sub.student_name,
            testTitle: sub.test_title,
            score: Number(sub.score),
            correctCount: sub.correct_count,
            totalQuestions: sub.total_questions,
            timeSpentSeconds: sub.time_spent_seconds,
            tabSwitchCount: sub.tab_switch_count,
            cheatFlagged: sub.cheat_flagged,
            submittedAt: new Date(sub.submitted_at).toLocaleString('vi-VN'),
            teacherComment: sub.teacher_comment,
            weakTopics: sub.weak_topics
          })));
        }

        // Fetch AI Recommendations
        const { data: recData } = await supabase.from('ai_recommendations').select('*');
        if (recData && recData.length) {
          setRecommendations(recData.map(r => ({
            id: r.id,
            studentId: r.student_id,
            studentName: r.student_name,
            suggestedTopic: r.suggested_topic,
            reason: r.reason,
            recommendedMission: r.recommended_mission,
            status: r.status
          })));
        }
      } catch (err) {
        console.warn('Supabase fetch error, using local fallback:', err);
      }
    };

    fetchFromSupabase();
  }, [currentUser.id]);

  // Auth Success Callback
  const handleAuthSuccess = (userObj) => {
    setCurrentUser(userObj);
    saveUserSession(userObj);
    setActiveTab('dashboard');
  };

  // Logout Callback
  const handleLogout = () => {
    clearUserSession();
    window.location.reload();
  };

  // Complete Mission Callback
  const handleCompleteMission = (missionId) => {
    setMissions(prev =>
      prev.map(m => {
        if (m.id === missionId && !m.completed) {
          setCurrentUser(u => {
            const updated = {
              ...u,
              xp: (u.xp || 0) + m.xp,
              stars: (u.stars || 0) + m.stars
            };
            saveUserSession(updated);
            return updated;
          });

          showToast(`🎉 Hoàn thành nhiệm vụ! +${m.xp} XP, +${m.stars} ⭐`);
          return { ...m, completed: true, progress: m.target };
        }
        return m;
      })
    );
  };

  // Submit Test Callback
  const handleSubmitTest = async (submission) => {
    setSubmissions(prev => [submission, ...prev]);

    if (submission.score >= 5) {
      const earnedXp = Math.round(submission.score * 15);
      const earnedStars = Math.round(submission.score * 2);
      setCurrentUser(u => {
        const updated = {
          ...u,
          xp: (u.xp || 0) + earnedXp,
          stars: (u.stars || 0) + earnedStars
        };
        saveUserSession(updated);
        return updated;
      });
    }

    // Complete mission m2
    handleCompleteMission('m2');

    showToast(`📝 Đã nộp bài thi thành công! Điểm của bé: ${submission.score}/10`);
    setActiveTab('history');

    // Push to Supabase DB if connected
    if (supabase) {
      try {
        await supabase.from('test_submissions').insert([{
          id: submission.id,
          student_id: submission.studentId,
          student_name: submission.studentName,
          test_title: submission.testTitle,
          score: submission.score,
          correct_count: submission.correctCount,
          total_questions: submission.totalQuestions,
          time_spent_seconds: submission.timeSpentSeconds,
          tab_switch_count: submission.tabSwitchCount,
          cheat_flagged: submission.cheatFlagged,
          teacher_comment: submission.teacherComment,
          weak_topics: submission.weakTopics
        }]);

        await supabase.from('users').update({
          stars: currentUser.stars,
          xp: currentUser.xp
        }).eq('id', submission.studentId);
      } catch (err) {
        console.error('Failed to submit test to Supabase:', err);
      }
    }
  };

  // Teacher Save Comment Callback
  const handleSaveComment = async (subId, comment) => {
    setSubmissions(prev =>
      prev.map(s => (s.id === subId ? { ...s, teacherComment: comment } : s))
    );
    showToast('💾 Đã lưu nhận xét bài thi thành công!');

    if (supabase) {
      try {
        await supabase.from('test_submissions').update({
          teacher_comment: comment
        }).eq('id', subId);
      } catch (err) {
        console.error('Failed to update comment in Supabase:', err);
      }
    }
  };

  // Teacher Assign AI Recommendation Callback
  const handleAssignRecommendation = async (recId) => {
    setRecommendations(prev =>
      prev.map(r => (r.id === recId ? { ...r, status: 'assigned' } : r))
    );

    const rec = recommendations.find(r => r.id === recId);
    if (rec) {
      setMissions(prev => [
        ...prev,
        {
          id: 'rec_m_' + Date.now(),
          icon: '⚡',
          title: 'Cá nhân hóa AI: ' + rec.suggestedTopic,
          desc: rec.recommendedMission,
          xp: 80,
          stars: 15,
          progress: 0,
          target: 1,
          completed: false
        }
      ]);
    }

    showToast('⚡ Đã giao bài tập gợi ý AI thành công!');

    if (supabase) {
      try {
        await supabase.from('ai_recommendations').update({
          status: 'assigned'
        }).eq('id', recId);
      } catch (err) {
        console.error('Failed to update recommendation status in Supabase:', err);
      }
    }
  };

  return (
    <div>
      <Header
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="main-wrapper">
        {/* STUDENT PORTAL VIEW (Only for role === 'student') */}
        {currentUser.role === 'student' ? (
          <div>
            {/* Student Navigation Tabs */}
            <div className="nav-tabs">
              <button
                className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                🏠 Trang Chủ & Nhiệm Vụ
              </button>
              <button
                className={`tab-btn ${activeTab === 'games' ? 'active' : ''}`}
                onClick={() => setActiveTab('games')}
              >
                🎮 Đấu Trường Trò Chơi
              </button>
              <button
                className={`tab-btn ${activeTab === 'test' ? 'active' : ''}`}
                onClick={() => setActiveTab('test')}
              >
                📝 Bài Thi Hằng Tuần
              </button>
              <button
                className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                📜 Lịch Sử & Nhận Xét
              </button>
            </div>

            {/* Tab Views */}
            {activeTab === 'dashboard' && (
              <StudentDashboard
                currentUser={currentUser}
                missions={missions}
                onCompleteMission={handleCompleteMission}
                onStartTest={() => setActiveTab('test')}
              />
            )}

            {activeTab === 'games' && (
              <MathGames
                onLaunchGame={() => showToast('🎮 Trò chơi đang tải... Hãy chọn câu trả lời đúng nhé!')}
              />
            )}

            {activeTab === 'test' && (
              <WeeklyTest
                currentUser={currentUser}
                questionBank={questionBank}
                onSubmitTest={handleSubmitTest}
                onShowAntiCheatWarning={() => setAntiCheatWarningOpen(true)}
              />
            )}

            {activeTab === 'history' && (
              <TestHistory submissions={submissions} />
            )}
          </div>
        ) : (
          /* TEACHER PORTAL VIEW (Only for role === 'teacher') */
          <TeacherDashboard
            teacherInfo={currentUser}
            students={students}
            submissions={submissions}
            aiRecommendations={recommendations}
            onSaveComment={handleSaveComment}
            onAssignRecommendation={handleAssignRecommendation}
          />
        )}
      </main>

      {/* Floating Socratic Panda AI Tutor */}
      <PandaDrawer
        onAiTaskCompleted={() => handleCompleteMission('m3')}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        showToast={showToast}
      />

      {/* Anti Cheat Warning Modal */}
      <AntiCheatModal
        isOpen={antiCheatWarningOpen}
        onClose={() => setAntiCheatWarningOpen(false)}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
};

export default App;
