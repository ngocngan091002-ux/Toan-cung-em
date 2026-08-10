/* ==========================================================================
   HÀNH TRÌNH TOÁN HỌC - AI ASSISTANT SERVICE
   - Phục vụ Trợ lý Toán học AI Panda cho Học sinh (Phương pháp Socratic)
   - Phục vụ Đề xuất AI cho Giáo viên (Quy trình Human-In-The-Loop)
   ========================================================================== */

export const aiService = {
  // --- 1. SOCRATIC AI TUTOR FOR STUDENTS ---
  async askPandaAi(userMessage: string, currentQuestion?: any): Promise<string> {
    const q = userMessage.toLowerCase().trim();
    await new Promise(res => setTimeout(res, 500));

    if (q.includes('cộng') || q.includes('cộng có nhớ')) {
      return `🐼 Panda gợi ý cho em nhé:\n\nKhi cộng hai số có nhớ (như 28 + 15), em thử làm theo 2 bước:\n1. Cộng hàng đơn vị: 8 + 5 = 13 (viết 3 nhớ 1 chục).\n2. Cộng hàng chục: 2 + 1 = 3, cộng thêm 1 chục vừa nhớ là 4 chục!\n\nKết quả ra 43 đó em. Em thử kiểm tra lại xem đúng chưa nhé? ⭐`;
    }

    if (q.includes('trừ') || q.includes('trừ có nhớ')) {
      return `🐼 Panda dẫn dắt câu toán trừ nhé:\n\nKhi tính 52 - 27:\n• 2 đơn vị không trừ được 7, em lấy 12 - 7 = 5 (viết 5 nhớ 1).\n• bớt 1 ở 5 chục còn 4 chục. Lấy 4 - 2 = 2 chục!\n\nKết quả là 25 nha! Em làm thử bài tiếp theo xem nào? 🌟`;
    }

    if (q.includes('nhân') || q.includes('bảng nhân')) {
      return `🐼 Panda đố em nè:\n\nMuốn tính 5 x 6, em đếm nhảy 5 sáu lần nhé: 5, 10, 15, 20, 25, 30!\nEm có nhận xét gì về các kết quả trong bảng nhân 5 không? 🚀`;
    }

    if (q.includes('gợi ý') || q.includes('giúp') || q.includes('hướng dẫn')) {
      if (currentQuestion) {
        return `🐼 Panda gợi ý câu này nè:\n📌 Đề bài: ${currentQuestion.question_text}\n💡 Gợi ý: ${currentQuestion.explanation || 'Em hãy đọc kỹ câu hỏi và tính nhẩm hàng đơn vị trước nhé!'}`;
      }
      return `🐼 Panda chào em! Em đang thắc mắc ở dạng bài Phép cộng, Phép trừ hay Toán có lời văn? Hãy nói cho Panda biết nhé! 🐾`;
    }

    return `🐼 Chú Panda lắng nghe nè! Em hãy thử tách số ra làm tròn chục trước nhé. Em có muốn Panda đặt một câu hỏi gợi ý nhỏ không? 🎈`;
  },

  // --- 2. AI ASSISTANT FOR TEACHERS (HUMAN-IN-THE-LOOP) ---
  async suggestExercisesForGrade2(topic: string) {
    await new Promise(res => setTimeout(res, 500));
    return [
      {
        question_text: `Tính nhẩm phép tính cộng có nhớ: 37 + 18 = ?`,
        options: ['45', '55', '54', '65'],
        correct_answer: 1,
        explanation: '7 + 8 = 15 (viết 5 nhớ 1). 3 + 1 + 1 = 5 chục.',
        topic: topic || 'Phép cộng có nhớ'
      },
      {
        question_text: `Bé Nam có 18 viên bi. An cho Nam thêm 15 viên bi nữa. Hỏi Nam có tất cả bao nhiêu viên bi?`,
        options: ['32 viên bi', '33 viên bi', '34 viên bi', '35 viên bi'],
        correct_answer: 1,
        explanation: 'Thực hiện phép tính cộng: 18 + 15 = 33 viên bi.',
        topic: 'Toán có lời văn'
      }
    ];
  },

  async suggestGradingAndComment(correctCount: number, totalQuestions: number) {
    const rawScore = Number(((correctCount / totalQuestions) * 10).toFixed(2));
    let comment = '';

    if (rawScore >= 9) {
      comment = `Con làm bài xuất sắc! Nắm rất vững kiến thức và tính toán rất chính xác. Cố gắng phát huy nhé!`;
    } else if (rawScore >= 7) {
      comment = `Con làm bài khá tốt! Cần chú ý đọc kỹ đề bài hơn ở những câu toán có lời văn để đạt điểm tối đa.`;
    } else {
      comment = `Con cần chăm chỉ ôn luyện thêm dạng toán phép tính có nhớ. Hãy hỏi thêm bạn AI Panda hoặc cô giáo nhé!`;
    }

    return {
      ai_suggested_score: rawScore,
      ai_suggested_comment: comment
    };
  },

  async summarizeWeakTopics(submissions: any[]) {
    await new Promise(res => setTimeout(res, 400));
    return [
      { topic: 'Phép trừ có nhớ trong phạm vi 100', mistakeRate: '45% học sinh trong lớp hay tính sai ở bước nhớ 1 chục.' },
      { topic: 'Toán có lời văn 1 phép tính', mistakeRate: '30% học sinh chưa phân biệt rõ từ khóa "thêm" và "bớt".' }
    ];
  }
};
