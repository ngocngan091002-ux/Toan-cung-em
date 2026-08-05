/* ==========================================================================
   TOÁN CÙNG EM - AI TUTOR & PERSONALIZATION RECOMMENDATION ENGINE
   ========================================================================== */

const AiTutor = {
  // Initial Panda greetings
  greetings: [
    "Xin chào em! Chú là Panda Toán Học đây 🐼. Hôm nay em gặp bài toán nào khó nhằn hở?",
    "Chào bạn nhỏ! Cần chú Panda hướng dẫn từng bước tư duy toán học không nè?",
    "Panda sẵn sàng đồng hành cùng em! Đừng ngần ngại hỏi chú bất kỳ câu hỏi nào nhé! 🌟"
  ],

  // Get random greeting
  getGreeting() {
    return this.greetings[Math.floor(Math.random() * this.greetings.length)];
  },

  /**
   * Socratic AI Response Generator for Grade 2 Students
   * Rules: Never give away the answer directly. Guide step-by-step with encouraging words!
   */
  async processUserMessage(userMsg, currentQuestionObj = null) {
    const text = userMsg.toLowerCase().trim();

    // Simulate AI thinking latency
    await new Promise(resolve => setTimeout(resolve, 600));

    // Case 1: If student asks about the current test question
    if (currentQuestionObj && (text.includes('gợi ý') || text.includes('giúp') || text.includes('khó') || text.includes('bài này'))) {
      return `🐼 **Gợi ý từ chú Panda cho bài này:**\n\n${currentQuestionObj.hint}\n\n*Em thử tính lại theo gợi ý trên xem đáp án nào khớp nhất nhé!* 💪`;
    }

    // Case 2: Phép cộng có nhớ
    if (text.includes('cộng') || text.includes('+')) {
      return `🐼 **Mẹo làm phép cộng có nhớ nè em:**\n\n1️⃣ Em cộng hàng đơn vị trước.\n2️⃣ Nếu kết quả từ 10 trở lên, em giữ lại hàng đơn vị và nhớ 1 sang hàng chục nhé!\n3️⃣ Sau đó em cộng hàng chục và nhớ thêm 1 nữa là ra ngay kết quả! 🎯`;
    }

    // Case 3: Phép trừ có nhớ
    if (text.includes('trừ') || text.includes('-')) {
      return `🐼 **Bí kíp làm phép trừ có nhớ từ chú Panda:**\n\n1️⃣ Nếu chữ số hàng đơn vị số bị trừ nhỏ hơn, em hãy "mượn 1 chục" thành 10 nhé.\n2️⃣ Trừ xong hàng đơn vị, em nhớ bớt 1 ở chữ số hàng chục rồi tiếp tục trừ hàng chục nhé! 🌟`;
    }

    // Case 4: Toán có lời văn
    if (text.includes('lời văn') || text.includes('đề bài') || text.includes('có tất cả') || text.includes('còn lại')) {
      return `🐼 **Cách giải toán có lời văn siêu dễ:**\n\n• Nếu đề bài bảo *"thêm"*, *"cả hai"*, *"tất cả"* ➔ Em dùng **Phép cộng (+)**.\n• Nếu đề bài bảo *"bớt"*, *"cho đi"*, *"còn lại"* ➔ Em dùng **Phép trừ (-)**.\n\n*Em đọc kỹ đề bài xem người ta hỏi gì nhé!* 📘`;
    }

    // Case 5: Bảng nhân
    if (text.includes('nhân') || text.includes('x') || text.includes('bảng nhân')) {
      return `🐼 **Bí quyết nhớ bảng nhân 2 và 5:**\n\n• Bảng nhân 2 là đếm thêm 2 (2, 4, 6, 8, 10...).\n• Bảng nhân 5 là số tận cùng luôn là 0 hoặc 5 (5, 10, 15, 20, 25...).\n\nEm thử nhẩm đếm xuôi xem sao nè! 🔢`;
    }

    // Case 6: General encouraging response
    return `🐼 Chú Panda hiểu rồi! Học Toán Lớp 2 là một hành trình siêu thú vị. Em hãy đọc kỹ lại đề bài, chia nhỏ phép tính thành hàng chục và hàng đơn vị. Cố lên em nhé, chú tin em làm được! ⭐`;
  },

  /**
   * AI Recommendation Engine for Teacher View
   * Analyzes student submission data and identifies learning skill gaps
   */
  analyzeStudentWeakness(submissions) {
    const topicErrors = {};

    submissions.forEach(sub => {
      if (sub.weakTopics) {
        sub.weakTopics.forEach(topic => {
          topicErrors[topic] = (topicErrors[topic] || 0) + 1;
        });
      }
    });

    const recommendations = [];
    for (const [topic, count] of Object.entries(topicErrors)) {
      recommendations.push({
        topic: topic,
        errorRate: `${count} lượt làm sai`,
        aiAdvice: `Hệ thống AI đề xuất giao 5 bài tập bổ trợ dạng "${topic}" cho học sinh để bù đắp hổng kiến thức.`
      });
    }

    return recommendations;
  }
};
