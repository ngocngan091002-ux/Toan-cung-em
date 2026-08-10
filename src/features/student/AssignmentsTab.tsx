import React, { useState, useEffect, useRef } from 'react';
import { AssignmentModel, QuestionModel, SubmissionModel } from '../../types/database.types';
import { Clock, HelpCircle, ArrowRight, ArrowLeft, Send, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface AssignmentsTabProps {
  assignments: AssignmentModel[];
  questionsMap: Record<string, QuestionModel[]>;
  submissionsMap: Record<string, SubmissionModel>;
  onSubmitAnswers: (
    assignmentId: string,
    answers: { questionId: string; selectedOption: number; isCorrect: boolean; timeSpentSeconds: number; topic: string }[]
  ) => void;
}

export const AssignmentsTab: React.FC<AssignmentsTabProps> = ({
  assignments,
  questionsMap,
  submissionsMap,
  onSubmitAnswers
}) => {
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentModel | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Stores selected option index per questionId
  const [answersState, setAnswersState] = useState<Record<string, number>>({});

  // INDEPENDENT PER-QUESTION TIMER: Stores elapsed time (in seconds) per questionId
  const [perQuestionTimer, setPerQuestionTimer] = useState<Record<string, number>>({});

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeQuestions = selectedAssignment ? questionsMap[selectedAssignment.id] || [] : [];
  const currentQ = activeQuestions[currentQIndex];

  // Start Independent Timer for current question when it appears on screen
  useEffect(() => {
    if (!selectedAssignment || !currentQ) return;

    const qId = currentQ.id;

    // If answer already selected for this question, timer is FIXED and does not tick anymore!
    if (answersState[qId] !== undefined) return;

    // Initialize timer for current question if not started
    setPerQuestionTimer(prev => ({
      ...prev,
      [qId]: prev[qId] || 0
    }));

    timerRef.current = setInterval(() => {
      setPerQuestionTimer(prev => ({
        ...prev,
        [qId]: (prev[qId] || 0) + 1
      }));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedAssignment, currentQIndex, currentQ?.id, answersState]);

  // Handle Option Selection: STOP TIMER IMMEDIATELY & FIX TIME
  const handleSelectOption = (optionIndex: number) => {
    if (!currentQ) return;
    const qId = currentQ.id;

    // Stop timer immediately for this question
    if (timerRef.current) clearInterval(timerRef.current);

    // Save selected option index
    setAnswersState(prev => ({
      ...prev,
      [qId]: optionIndex
    }));
  };

  const handleFinishSubmission = () => {
    if (!selectedAssignment) return;

    const finalAnswers = activeQuestions.map(q => {
      const selected = answersState[q.id] ?? -1;
      const isCorrect = selected === q.correct_answer;
      const timeSpent = perQuestionTimer[q.id] || 1;
      return {
        questionId: q.id,
        selectedOption: selected,
        isCorrect,
        timeSpentSeconds: timeSpent,
        topic: q.topic || 'Toán Lớp 2'
      };
    });

    onSubmitAnswers(selectedAssignment.id, finalAnswers);
    setSelectedAssignment(null);
  };

  // If viewing assignment list
  if (!selectedAssignment) {
    return (
      <div className="space-y-6">
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm">
          <h2 className="font-fredoka text-2xl font-black text-slate-800 mb-2">
            📝 BÀI TẬP VÀ BÀI KIỂM TRA HẰNG TUẦN
          </h2>
          <p className="text-slate-500 text-xs font-bold mb-6">
            Chỉ những bài tập đã được Cô giáo duyệt và CHỐT (`is_published = true`) mới hiển thị ở đây.
          </p>

          {assignments.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-bold bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <span className="text-4xl block mb-2">📋</span>
              Chưa có bài tập nào được giao. Em hãy thư giãn hoặc ôn lại kiến thức nhé!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map(assign => {
                const sub = submissionsMap[assign.id];
                return (
                  <div
                    key={assign.id}
                    className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 hover:border-sky-400 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                          assign.type === 'weekly_test' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {assign.type === 'weekly_test' ? '📝 Bài thi tuần' : '✏️ Bài tập'}
                        </span>

                        {sub && (
                          <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                            sub.is_approved ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {sub.is_approved ? `✅ Điểm: ${sub.total_score}/10` : '⏳ Đang chờ Cô giáo chấm'}
                          </span>
                        )}
                      </div>

                      <h3 className="font-fredoka text-lg font-bold text-slate-800 mb-1">{assign.title}</h3>
                      <p className="text-xs font-bold text-slate-500">
                        Số câu hỏi: {(questionsMap[assign.id] || []).length} câu
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200">
                      {sub ? (
                        sub.is_approved ? (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs">
                            <p className="font-black text-emerald-800">Kết quả bài làm:</p>
                            <p className="text-slate-600 font-semibold italic mt-1">"{sub.teacher_comment || 'Cô giáo khen con làm tốt!'}"</p>
                          </div>
                        ) : (
                          <button disabled className="w-full bg-slate-200 text-slate-500 font-black py-2 rounded-xl text-xs">
                            ⏳ ĐÃ NỘP - ĐANG CHỜ CÔ CHẤM
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedAssignment(assign);
                            setCurrentQIndex(0);
                            setAnswersState({});
                            setPerQuestionTimer({});
                          }}
                          className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                        >
                          🚀 BẮT ĐẦU LÀM BÀI
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
  }

  // Active Quiz View
  return (
    <div className="max-w-3xl mx-auto bg-white border-4 border-sky-300 rounded-3xl p-6 md:p-8 shadow-xl">
      {/* Quiz Top Bar */}
      <div className="flex items-center justify-between border-b-2 border-dashed border-slate-200 pb-4 mb-6">
        <div>
          <h3 className="font-fredoka text-xl font-bold text-slate-800">{selectedAssignment.title}</h3>
          <p className="text-xs font-bold text-slate-500">Câu hỏi {currentQIndex + 1} trên {activeQuestions.length}</p>
        </div>

        {/* INDEPENDENT PER-QUESTION TIMER DISPLAY */}
        <div className="bg-rose-50 border-2 border-rose-300 text-rose-600 font-black px-4 py-1.5 rounded-full flex items-center gap-2 text-sm shadow-xs animate-pulse">
          <Clock className="w-4 h-4" />
          <span>Thời gian câu {currentQIndex + 1}: {perQuestionTimer[currentQ?.id] || 0}s</span>
        </div>
      </div>

      {/* Current Question Body */}
      {currentQ ? (
        <div className="space-y-6">
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5">
            <h4 className="font-fredoka text-xl font-bold text-slate-900 mb-3">
              Câu {currentQIndex + 1}: {currentQ.question_text}
            </h4>

            {/* Optional Question Image */}
            {currentQ.question_image_url && (
              <div className="my-4 text-center">
                <img
                  src={currentQ.question_image_url}
                  alt="Hình minh họa bài tập"
                  className="max-h-56 mx-auto rounded-xl border-2 border-slate-300 shadow-sm object-contain"
                />
              </div>
            )}
          </div>

          {/* 4 Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = answersState[currentQ.id] === oIdx;
              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  className={`p-4 rounded-2xl border-3 text-left font-extrabold text-base transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-100 border-sky-500 text-sky-900 shadow-md scale-[1.02]'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50/50'
                  }`}
                >
                  <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                  {isSelected && <span className="text-sky-600 font-black">✔</span>}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-slate-500 font-bold text-center">Không có câu hỏi nào trong bài này.</p>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between border-t-2 border-slate-100 pt-6 mt-8">
        <button
          disabled={currentQIndex === 0}
          onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs disabled:opacity-50 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Câu trước
        </button>

        {currentQIndex < activeQuestions.length - 1 ? (
          <button
            onClick={() => setCurrentQIndex(prev => Math.min(activeQuestions.length - 1, prev + 1))}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm flex items-center gap-1.5"
          >
            Câu tiếp <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinishSubmission}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-1.5 animate-bounce"
          >
            <Send className="w-4 h-4" /> NỘP BÀI THI CÔ CHẤM
          </button>
        )}
      </div>
    </div>
  );
};
