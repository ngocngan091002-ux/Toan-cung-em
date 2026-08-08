import React, { useState, useEffect } from 'react';

export const WeeklyTest = ({
  currentUser,
  questionBank,
  onSubmitTest,
  onShowAntiCheatWarning
}) => {
  const [testActive, setTestActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [tabSwitches, setTabSwitches] = useState(0);

  // Anti-cheat listeners when test is active
  useEffect(() => {
    if (!testActive) return;

    const handleBlur = () => {
      setTabSwitches(prev => {
        const next = prev + 1;
        onShowAntiCheatWarning();
        return next;
      });
    };

    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitches(prev => {
          const next = prev + 1;
          onShowAntiCheatWarning();
          return next;
        });
      }
    };

    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [testActive, onShowAntiCheatWarning]);

  // Countdown timer
  useEffect(() => {
    if (!testActive) return;

    if (timeLeft <= 0) {
      handleFinishTest();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [testActive, timeLeft]);

  const handleStartTest = () => {
    // Shuffle and pick 6 questions
    const shuffled = [...questionBank].sort(() => Math.random() - 0.5).slice(0, 6);
    setQuestions(shuffled);
    setCurrentIdx(0);
    setAnswers({});
    setTimeLeft(300);
    setTabSwitches(0);
    setTestActive(true);
  };

  const handleSelectOption = (qIdx, optionIdx) => {
    setAnswers(prev => ({ ...prev, [qIdx]: optionIdx }));
  };

  const handleFinishTest = () => {
    setTestActive(false);

    let correctCount = 0;
    const weakTopicsArr = [];

    questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) {
        correctCount++;
      } else if (q.topic) {
        if (!weakTopicsArr.includes(q.topic)) {
          weakTopicsArr.push(q.topic);
        }
      }
    });

    const score = Number(((correctCount / questions.length) * 10).toFixed(2));
    const timeSpentSeconds = 300 - timeLeft;

    const submission = {
      id: 'sub_' + Date.now(),
      studentId: currentUser.id,
      studentName: currentUser.name,
      testTitle: 'Bài kiểm tra Tuần 1',
      score: score,
      correctCount: correctCount,
      totalQuestions: questions.length,
      timeSpentSeconds: timeSpentSeconds,
      tabSwitchCount: tabSwitches,
      cheatFlagged: tabSwitches > 0,
      teacherComment: score >= 8 ? 'Con làm bài xuất sắc lắm!' : 'Cần chú ý ôn luyện thêm dạng bài sai nhé!',
      weakTopics: weakTopicsArr,
      submittedAt: new Date().toLocaleString('vi-VN')
    };

    onSubmitTest(submission);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!testActive) {
    return (
      <div className="test-container" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
        <h2 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '8px' }}>
          ĐỒNG HỒ THI & BÀI KIỂM TRA HẰNG TUẦN
        </h2>
        <p style={{ color: '#475569', fontWeight: '600', maxWidth: '520px', margin: '0 auto 24px auto' }}>
          Bài thi gồm 6 câu hỏi ngẫu nhiên trong thời gian 5 phút. Hệ thống có cơ chế <strong>Giám sát Anti-Cheat</strong> (phát hiện chuyển tab).
        </p>

        <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '14px 32px' }} onClick={handleStartTest}>
          🚀 Bắt Đầu Làm Bài Thi Ngay
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="test-container">
      <div className="test-header">
        <div>
          <h3 style={{ fontSize: '1.4rem', color: '#1E293B' }}>📝 Bài Kiểm Tra Tuần 1</h3>
          <p style={{ color: '#64748B', fontWeight: 600, marginTop: '4px' }}>
            Câu hỏi {currentIdx + 1} / {questions.length}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="anti-cheat-badge">
            🛡️ Anti-Cheat Active ({tabSwitches} lần chuyển tab)
          </div>
          <div className="timer-box">
            ⏰ <span>{formatTimer(timeLeft)}</span>
          </div>
        </div>
      </div>

      {currentQ && (
        <div className="question-box">
          <div className="question-text">
            Câu {currentIdx + 1}: {currentQ.question}
          </div>

          <div className="options-grid">
            {currentQ.options.map((opt, oIdx) => (
              <button
                key={oIdx}
                className={`option-btn ${answers[currentIdx] === oIdx ? 'selected' : ''}`}
                onClick={() => handleSelectOption(currentIdx, oIdx)}
              >
                <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                {answers[currentIdx] === oIdx && <span>✔</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
        <button
          className="btn-secondary"
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
        >
          ⬅ Câu trước
        </button>

        {currentIdx < questions.length - 1 ? (
          <button
            className="btn-primary"
            onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
          >
            Câu tiếp ➡
          </button>
        ) : (
          <button
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)', padding: '12px 28px' }}
            onClick={handleFinishTest}
          >
            🏁 Nộp Bài Thi
          </button>
        )}
      </div>
    </div>
  );
};
