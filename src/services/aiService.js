/* ==========================================================================
   PANDA AI TUTOR SERVICE (SOCRATIC PEDAGOGICAL MODEL)
   ========================================================================== */

export const processAiMessage = async (userMessage, currentQuestion = null) => {
  const query = userMessage.toLowerCase().trim();

  // Simulate AI thinking delay
  await new Promise(resolve => setTimeout(resolve, 600));

  // 1. Math Socratic Hints
  if (query.includes('cộng') || query.includes('cộng có nhớ') || query.includes('thêm')) {
    return `🐼 Panda gợi ý cho em nhé:\n\nKhi làm phép cộng có nhớ (ví dụ: 28 + 15), em hãy làm theo 2 bước:\n1. Lấy 8 + 5 = 13 (viết 3 nhớ 1 vào hàng chục).\n2. Lấy 2 + 1 = 3, cộng thêm 1 vừa nhớ là 4 chục!\n\nĐáp số ra 43 đó em! Em thử tính bài tiếp theo nhé? ⭐`;
  }

  if (query.includes('trừ') || query.includes('bớt') || query.includes('trừ có nhớ')) {
    return `🐼 Panda gợi ý phép trừ có nhớ nè:\n\nVí dụ: 52 - 27\n• 2 không trừ được 7, em lấy 12 - 7 = 5 (viết 5 nhớ 1).\n• bớt 1 ở 5 chục còn 4 chục. Lấy 4 - 2 = 2 chục!\n\nKết quả ra 25 nha! 🌟`;
  }

  if (query.includes('nhân') || query.includes('bảng nhân')) {
    return `🐼 Panda nhắc bài bảng nhân nè:\n\nMuốn tính 5 x 6 = ?\nEm đếm nhảy 5 sáu lần nhé: 5, 10, 15, 20, 25, 30!\nVậy 5 x 6 = 30 đó em. Em giỏi lắm! 🚀`;
  }

  if (query.includes('gợi ý') || query.includes('giúp') || query.includes('hướng dẫn')) {
    if (currentQuestion) {
      return `🐼 Trợ lý Panda hướng dẫn câu này nhé:\n\n📌 **Đề bài**: ${currentQuestion.question}\n💡 **Gợi ý**: ${currentQuestion.hint}\n\nEm hãy chọn đáp án đúng nhất nhé! ✨`;
    }
    return `🐼 Chào em! Panda luôn sẵn sàng cùng em học toán. Em đang gặp khó khăn ở dạng bài Phép cộng, Phép trừ hay Bài toán có lời văn? Nói cho Panda biết nhé! 🐾`;
  }

  if (query.includes('chào') || query.includes('hi') || query.includes('hello')) {
    return `🐼 Chào em yêu! Hôm nay chúng mình cùng chinh phục thật nhiều Sao thưởng và XP nhé! Em muốn luyện tập bài nào hôm nay? 🌟`;
  }

  // Default encouraging reply
  return `🐼 Chú Panda lắng nghe nè! Em hãy đọc kỹ đề bài, tính nhẩm từng bước từ hàng đơn vị trước nhé. Nếu cần gợi ý chi tiết hơn, em cứ hỏi Panda nha! 🎈`;
};
