/* ==========================================================================
   TOÁN CÙNG EM - STORE & MOCK DATABASE (DATA & SERVICES)
   ========================================================================== */

const Store = {
  // Key storage name
  STORAGE_KEY: 'TOAN_CUNG_EM_DB_V1',

  // Default state data
  data: {
    currentUser: {
      role: 'student', // 'student' or 'teacher'
      id: 'std_01',
      name: 'Bé Nam',
      grade: 'Lớp 2A',
      avatar: '👦',
      stars: 1250,
      xp: 450,
      level: 7,
      nextLevelXp: 700
    },

    teacherInfo: {
      id: 'tch_01',
      name: 'Cô Mai',
      class: 'Lớp 2A',
      school: 'Trường Tiểu học Ngôi Sao'
    },

    // Daily missions for student
    dailyMissions: [
      { id: 'm1', icon: '🌲', title: 'Thám hiểm Rừng Xanh', desc: 'Chơi 1 ván game toán Rừng Xanh', xp: 50, stars: 10, progress: 0, target: 1, completed: false },
      { id: 'm2', icon: '📝', title: 'Thử thách Hằng tuần', desc: 'Hoàn thành Bài kiểm tra Tuần 1', xp: 100, stars: 20, progress: 0, target: 1, completed: false },
      { id: 'm3', icon: '🐼', title: 'Hỏi bạn Panda AI', desc: 'Trò chuyện cùng Trợ lý AI Panda', xp: 30, stars: 5, progress: 0, target: 1, completed: false }
    ],

    // Grade 2 Standard Question Bank (Bộ câu hỏi chuẩn GDPT Lớp 2)
    questionBank: [
      {
        id: 'q1',
        topic: 'Phép cộng có nhớ',
        question: 'Tính: 28 + 15 = ?',
        options: ['33', '43', '42', '53'],
        answer: 1, // 43
        hint: 'Em thử lấy 8 cộng 5 bằng 13 (viết 3 nhớ 1), rồi lấy 2 cộng 1 thêm 1 nhớ nhé!'
      },
      {
        id: 'q2',
        topic: 'Phép trừ có nhớ',
        question: 'Tính: 52 - 27 = ?',
        options: ['25', '35', '27', '15'],
        answer: 0, // 25
        hint: 'Lấy 12 trừ 7 bằng 5, bớt 1 ở số 5 chục còn 4 chục. 4 chục trừ 2 chục bằng 2 chục!'
      },
      {
        id: 'q3',
        topic: 'Toán có lời văn',
        question: 'Bé Nam có 15 viên bi. An cho Nam thêm 8 viên bi nữa. Hỏi Nam có tất cả bao nhiêu viên bi?',
        options: ['21 viên bi', '22 viên bi', '23 viên bi', '24 viên bi'],
        answer: 2, // 23 viên bi
        hint: 'Có thêm nghĩa là chúng mình thực hiện phép tính cộng: 15 + 8 nhé!'
      },
      {
        id: 'q4',
        topic: 'Bảng nhân 2 & 5',
        question: 'Mỗi bàn có 5 học sinh. Hỏi 6 bàn như thế có tất cả bao nhiêu học sinh?',
        options: ['25 học sinh', '30 học sinh', '35 học sinh', '20 học sinh'],
        answer: 1, // 30 học sinh
        hint: 'Em đọc bảng nhân 5 nhé: 5 nhân 6 bằng bao nhiêu nhỉ?'
      },
      {
        id: 'q5',
        topic: 'Hình học',
        question: 'Hình tam giác có bao nhiêu đỉnh và bao nhiêu cạnh?',
        options: ['3 đỉnh và 3 cạnh', '4 đỉnh và 4 cạnh', '3 đỉnh và 4 cạnh', '2 đỉnh và 3 cạnh'],
        answer: 0, // 3 đỉnh và 3 cạnh
        hint: 'Tam giác nghĩa là có 3 góc và 3 cạnh đó em!'
      },
      {
        id: 'q6',
        topic: 'Tìm X',
        question: 'Tìm X, biết: X + 14 = 30',
        options: ['X = 44', 'X = 16', 'X = 26', 'X = 14'],
        answer: 1, // X = 16
        hint: 'Muốn tìm số hạng chưa biết, ta lấy Tổng trừ đi Số hạng đã biết: X = 30 - 14.'
      },
      {
        id: 'q7',
        topic: 'Đo lường',
        question: 'Đổi đơn vị: 1 mét (m) = ... xăng-ti-mét (cm)?',
        options: ['10 cm', '50 cm', '100 cm', '1000 cm'],
        answer: 2, // 100 cm
        hint: 'Một mét thì bằng 10 đề-xi-mét, và bằng 100 xăng-ti-mét đó em!'
      },
      {
        id: 'q8',
        topic: 'Phép cộng tròn chục',
        question: 'Tính nhẩm: 40 + 50 = ?',
        options: ['80', '90', '100', '70'],
        answer: 1, // 90
        hint: '4 chục cộng 5 chục bằng 9 chục = 90.'
      }
    ],

    // Archived Test Submissions
    testSubmissions: [
      {
        id: 'sub_101',
        studentId: 'std_01',
        studentName: 'Bé Nam',
        testTitle: 'Bài kiểm tra Tuần 1',
        score: 8.75,
        correctCount: 7,
        totalQuestions: 8,
        timeSpentSeconds: 245,
        tabSwitchCount: 0,
        cheatFlagged: false,
        submittedAt: '2026-08-02 09:30',
        teacherComment: 'Con làm bài rất tốt! Cần chú ý làm cẩn thận hơn ở dạng phép trừ có nhớ nhé.',
        weakTopics: ['Phép trừ có nhớ']
      }
    ],

    // Class Students Analytics for Teacher View
    classStudents: [
      { id: 'std_01', name: 'Bé Nam', avgScore: 8.75, testsDone: 3, weakTopic: 'Phép trừ có nhớ', status: 'Cần luyện thêm', stars: 1250 },
      { id: 'std_02', name: 'Bé An', avgScore: 9.50, testsDone: 3, weakTopic: 'Không có', status: 'Xuất sắc', stars: 1680 },
      { id: 'std_03', name: 'Bé Bình', avgScore: 6.25, testsDone: 2, weakTopic: 'Toán có lời văn', status: 'Cần hỗ trợ', stars: 820 },
      { id: 'std_04', name: 'Bé Hoa', avgScore: 7.50, testsDone: 3, weakTopic: 'Tìm X', status: 'Khá', stars: 1040 },
      { id: 'std_05', name: 'Bé Linh', avgScore: 9.00, testsDone: 3, weakTopic: 'Đo lường', status: 'Giỏi', stars: 1450 }
    ],

    // AI Personalized Task Recommendations generated for students
    aiRecommendations: [
      {
        id: 'rec_01',
        studentId: 'std_01',
        studentName: 'Bé Nam',
        suggestedTopic: 'Phép trừ có nhớ trong phạm vi 100',
        reason: 'Phát hiện Bé Nam sai 2/3 câu phép trừ có nhớ gần nhất.',
        recommendedMission: 'Luyện 5 câu Phép trừ có nhớ cùng Panda AI',
        status: 'pending'
      },
      {
        id: 'rec_02',
        studentId: 'std_03',
        studentName: 'Bé Bình',
        suggestedTopic: 'Giải Toán có lời văn 1 phép tính',
        reason: 'Bé Bình chưa nắm rõ từ khóa "thêm", "bớt" trong đề bài văn.',
        recommendedMission: 'Bài tập tương tác: Phân tích đề toán câu từ',
        status: 'assigned'
      }
    ]
  },

  // Initialize store from localStorage or default
  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.data = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse localStorage store:', e);
      }
    } else {
      this.save();
    }
  },

  // Save current state to localStorage
  save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
  },

  // Utility to shuffle array (used for Anti-cheat / random question order)
  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  // Get shuffled question set for a test
  getTestQuestions(count = 6) {
    const shuffled = this.shuffle(this.data.questionBank);
    return shuffled.slice(0, count);
  },

  // Submit test and auto-grade
  submitTest(submission) {
    this.data.testSubmissions.unshift(submission);
    
    // Add XP & Stars to student
    if (submission.score >= 5) {
      const earnedXp = Math.round(submission.score * 15);
      const earnedStars = Math.round(submission.score * 2);
      this.data.currentUser.xp += earnedXp;
      this.data.currentUser.stars += earnedStars;
    }

    // Complete weekly test mission if applicable
    const m2 = this.data.dailyMissions.find(m => m.id === 'm2');
    if (m2 && !m2.completed) {
      m2.progress = 1;
      m2.completed = true;
      this.data.currentUser.xp += m2.xp;
      this.data.currentUser.stars += m2.stars;
    }

    this.save();
    return submission;
  },

  // Complete a daily mission
  completeMission(missionId) {
    const mission = this.data.dailyMissions.find(m => m.id === missionId);
    if (mission && !mission.completed) {
      mission.completed = true;
      mission.progress = mission.target;
      this.data.currentUser.xp += mission.xp;
      this.data.currentUser.stars += mission.stars;
      this.save();
      return true;
    }
    return false;
  },

  // Add teacher feedback
  addTeacherComment(submissionId, comment) {
    const sub = this.data.testSubmissions.find(s => s.id === submissionId);
    if (sub) {
      sub.teacherComment = comment;
      this.save();
      return true;
    }
    return false;
  },

  // Assign AI Recommendation to Student
  assignAiRecommendation(recId) {
    const rec = this.data.aiRecommendations.find(r => r.id === recId);
    if (rec) {
      rec.status = 'assigned';
      // Create new mission for student
      this.data.dailyMissions.push({
        id: 'rec_m_' + Date.now(),
        icon: '⚡',
        title: 'Cá nhân hóa AI: ' + rec.suggestedTopic,
        desc: rec.recommendedMission,
        xp: 80,
        stars: 15,
        progress: 0,
        target: 1,
        completed: false
      });
      this.save();
      return true;
    }
    return false;
  }
};

// Auto init on script load
Store.init();
