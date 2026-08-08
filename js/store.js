/* ==========================================================================
   TOÁN CÙNG EM - STORE & SUPABASE DATABASE CLIENT INTEGRATION
   ========================================================================== */

const Store = {
  // SUPABASE CONFIGURATION - THÔNG TIN TÀI KHOẢN SUPABASE THỰC TẾ
  SUPABASE_URL: 'https://ncfcowbnxuuiwuoagqon.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZmNvd2JueHV1aXd1b2FncW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwOTY5NTUsImV4cCI6MjEwMTY3Mjk1NX0.qLRidCcqxUNMgKSsoPbS9cCwlrlkiDXKO1YhE43HxSc',
  supabase: null,
  isSupabaseConnected: false,

  // Local storage fallback key name
  STORAGE_KEY: 'TOAN_CUNG_EM_DB_V1',
  AUTH_KEY: 'TOAN_CUNG_EM_ACTIVE_USER',

  // Current state data
  data: {
    currentUser: {
      role: 'student',
      id: 'std_01',
      username: 'nam',
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

    dailyMissions: [
      { id: 'm1', icon: '🌲', title: 'Thám hiểm Rừng Xanh', desc: 'Chơi 1 ván game toán Rừng Xanh', xp: 50, stars: 10, progress: 0, target: 1, completed: false },
      { id: 'm2', icon: '📝', title: 'Thử thách Hằng tuần', desc: 'Hoàn thành Bài kiểm tra Tuần 1', xp: 100, stars: 20, progress: 0, target: 1, completed: false },
      { id: 'm3', icon: '🐼', title: 'Hỏi bạn Panda AI', desc: 'Trò chuyện cùng Trợ lý AI Panda', xp: 30, stars: 5, progress: 0, target: 1, completed: false }
    ],

    questionBank: [
      {
        id: 'q1',
        topic: 'Phép cộng có nhớ',
        question: 'Tính: 28 + 15 = ?',
        options: ['33', '43', '42', '53'],
        answer: 1,
        hint: 'Em thử lấy 8 cộng 5 bằng 13 (viết 3 nhớ 1), rồi lấy 2 cộng 1 thêm 1 nhớ nhé!'
      },
      {
        id: 'q2',
        topic: 'Phép trừ có nhớ',
        question: 'Tính: 52 - 27 = ?',
        options: ['25', '35', '27', '15'],
        answer: 0,
        hint: 'Lấy 12 trừ 7 bằng 5, bớt 1 ở số 5 chục còn 4 chục. 4 chục trừ 2 chục bằng 2 chục!'
      },
      {
        id: 'q3',
        topic: 'Toán có lời văn',
        question: 'Bé Nam có 15 viên bi. An cho Nam thêm 8 viên bi nữa. Hỏi Nam có tất cả bao nhiêu viên bi?',
        options: ['21 viên bi', '22 viên bi', '23 viên bi', '24 viên bi'],
        answer: 2,
        hint: 'Có thêm nghĩa là chúng mình thực hiện phép tính cộng: 15 + 8 nhé!'
      },
      {
        id: 'q4',
        topic: 'Bảng nhân 2 & 5',
        question: 'Mỗi bàn có 5 học sinh. Hỏi 6 bàn như thế có tất cả bao nhiêu học sinh?',
        options: ['25 học sinh', '30 học sinh', '35 học sinh', '20 học sinh'],
        answer: 1,
        hint: 'Em đọc bảng nhân 5 nhé: 5 nhân 6 bằng bao nhiêu nhỉ?'
      },
      {
        id: 'q5',
        topic: 'Hình học',
        question: 'Hình tam giác có bao nhiêu đỉnh và bao nhiêu cạnh?',
        options: ['3 đỉnh và 3 cạnh', '4 đỉnh và 4 cạnh', '3 đỉnh và 4 cạnh', '2 đỉnh và 3 cạnh'],
        answer: 0,
        hint: 'Tam giác nghĩa là có 3 góc và 3 cạnh đó em!'
      },
      {
        id: 'q6',
        topic: 'Tìm X',
        question: 'Tìm X, biết: X + 14 = 30',
        options: ['X = 44', 'X = 16', 'X = 26', 'X = 14'],
        answer: 1,
        hint: 'Muốn tìm số hạng chưa biết, ta lấy Tổng trừ đi Số hạng đã biết: X = 30 - 14.'
      },
      {
        id: 'q7',
        topic: 'Đo lường',
        question: 'Đổi đơn vị: 1 mét (m) = ... xăng-ti-mét (cm)?',
        options: ['10 cm', '50 cm', '100 cm', '1000 cm'],
        answer: 2,
        hint: 'Một mét thì bằng 10 đề-xi-mét, và bằng 100 xăng-ti-mét đó em!'
      },
      {
        id: 'q8',
        topic: 'Phép cộng tròn chục',
        question: 'Tính nhẩm: 40 + 50 = ?',
        options: ['80', '90', '100', '70'],
        answer: 1,
        hint: '4 chục cộng 5 chục bằng 9 chục = 90.'
      }
    ],

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

    classStudents: [
      { id: 'std_01', name: 'Bé Nam', avgScore: 8.75, testsDone: 3, weakTopic: 'Phép trừ có nhớ', status: 'Cần luyện thêm', stars: 1250 },
      { id: 'std_02', name: 'Bé An', avgScore: 9.50, testsDone: 3, weakTopic: 'Không có', status: 'Xuất sắc', stars: 1680 },
      { id: 'std_03', name: 'Bé Bình', avgScore: 6.25, testsDone: 2, weakTopic: 'Toán có lời văn', status: 'Cần hỗ trợ', stars: 820 },
      { id: 'std_04', name: 'Bé Hoa', avgScore: 7.50, testsDone: 3, weakTopic: 'Tìm X', status: 'Khá', stars: 1040 },
      { id: 'std_05', name: 'Bé Linh', avgScore: 9.00, testsDone: 3, weakTopic: 'Đo lường', status: 'Giỏi', stars: 1450 }
    ],

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

  // Initialize Store and connect to Supabase
  async init() {
    this.loadLocal();

    // Check if Supabase SDK is available and configured
    if (window.supabase && this.SUPABASE_URL && !this.SUPABASE_URL.includes('YOUR_SUPABASE_PROJECT_ID')) {
      try {
        this.supabase = window.supabase.createClient(this.SUPABASE_URL, this.SUPABASE_ANON_KEY);
        this.isSupabaseConnected = true;
        console.log('⚡ Connected to Supabase Realtime Database!');
        await this.syncFromSupabase();
      } catch (err) {
        console.warn('⚠️ Supabase connection failed, using Local Storage fallback:', err);
      }
    }
  },

  // LOGIN USER WITH USERNAME AND PASSWORD (SUPABASE + LOCAL FALLBACK)
  async loginUser(username, password) {
    const cleanUsername = username.toLowerCase().trim();

    if (this.isSupabaseConnected && this.supabase) {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('username', cleanUsername)
        .eq('password', password)
        .single();

      if (error || !data) {
        throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác!');
      }

      this.data.currentUser = {
        id: data.id,
        username: data.username,
        role: data.role,
        name: data.full_name,
        grade: data.grade || 'Lớp 2A',
        avatar: data.avatar || (data.role === 'teacher' ? '👩‍🏫' : '👦'),
        stars: data.stars || 0,
        xp: data.xp || 0,
        level: data.level || 1,
        nextLevelXp: 700
      };
      
      if (data.role === 'teacher') {
        this.data.teacherInfo.id = data.id;
        this.data.teacherInfo.name = data.full_name;
      }

      this.saveLocal();
      localStorage.setItem(this.AUTH_KEY, JSON.stringify(this.data.currentUser));
      return this.data.currentUser;
    } else {
      // Local Fallback simulation
      if (cleanUsername === 'nam' && password === '123') {
        this.data.currentUser.role = 'student';
        this.data.currentUser.name = 'Bé Nam';
      } else if (cleanUsername === 'mai' && password === '123') {
        this.data.currentUser.role = 'teacher';
        this.data.currentUser.name = 'Cô Mai';
      } else {
        throw new Error('Tên đăng nhập hoặc mật khẩu không đúng! (Dùng thử: nam/123 hoặc mai/123)');
      }
      this.saveLocal();
      localStorage.setItem(this.AUTH_KEY, JSON.stringify(this.data.currentUser));
      return this.data.currentUser;
    }
  },

  // REGISTER NEW USER (SUPABASE + LOCAL FALLBACK)
  async registerUser({ username, password, fullName, role, avatar }) {
    const cleanUsername = username.toLowerCase().trim();
    const newId = (role === 'teacher' ? 'tch_' : 'std_') + Date.now();
    const defaultAvatar = avatar || (role === 'teacher' ? '👩‍🏫' : '👦');

    if (this.isSupabaseConnected && this.supabase) {
      // Check if username already exists
      const { data: existing } = await this.supabase
        .from('users')
        .select('username')
        .eq('username', cleanUsername);

      if (existing && existing.length > 0) {
        throw new Error('Tên đăng nhập này đã được sử dụng! Vui lòng chọn tên khác.');
      }

      const { data, error } = await this.supabase
        .from('users')
        .insert([{
          id: newId,
          username: cleanUsername,
          password: password,
          role: role,
          full_name: fullName,
          avatar: defaultAvatar,
          grade: 'Lớp 2A',
          stars: 100,
          xp: 50,
          level: 1,
          avg_score: 10.0,
          tests_done: 0,
          status: 'Mới đăng ký'
        }])
        .select()
        .single();

      if (error) {
        throw new Error('Đăng ký không thành công: ' + error.message);
      }

      this.data.currentUser = {
        id: data.id,
        username: data.username,
        role: data.role,
        name: data.full_name,
        grade: data.grade,
        avatar: data.avatar,
        stars: data.stars,
        xp: data.xp,
        level: data.level,
        nextLevelXp: 700
      };

      if (role === 'student') {
        this.data.classStudents.push({
          id: data.id,
          name: data.full_name,
          avgScore: 10.0,
          testsDone: 0,
          weakTopic: 'Chưa có',
          status: 'Mới đăng ký',
          stars: 100
        });
      }

      this.saveLocal();
      localStorage.setItem(this.AUTH_KEY, JSON.stringify(this.data.currentUser));
      return this.data.currentUser;
    } else {
      // Fallback local registration
      this.data.currentUser = {
        id: newId,
        username: cleanUsername,
        role: role,
        name: fullName,
        grade: 'Lớp 2A',
        avatar: defaultAvatar,
        stars: 100,
        xp: 50,
        level: 1,
        nextLevelXp: 700
      };
      this.saveLocal();
      localStorage.setItem(this.AUTH_KEY, JSON.stringify(this.data.currentUser));
      return this.data.currentUser;
    }
  },

  // LOGOUT USER
  logoutUser() {
    localStorage.removeItem(this.AUTH_KEY);
    location.reload();
  },

  // Sync data from Supabase DB to Store memory
  async syncFromSupabase() {
    if (!this.isSupabaseConnected || !this.supabase) return;

    try {
      // 1. Fetch Students
      const { data: stdData } = await this.supabase.from('users').select('*').eq('role', 'student');
      if (stdData && stdData.length) {
        this.data.classStudents = stdData.map(s => ({
          id: s.id,
          name: s.full_name,
          avgScore: Number(s.avg_score || 8.75),
          testsDone: s.tests_done || 0,
          weakTopic: s.weak_topic || 'Chưa có',
          status: s.status || 'Đang học',
          stars: s.stars || 0
        }));

        const currentStd = stdData.find(s => s.id === this.data.currentUser.id);
        if (currentStd) {
          this.data.currentUser.stars = currentStd.stars;
          this.data.currentUser.xp = currentStd.xp;
          this.data.currentUser.level = currentStd.level;
        }
      }

      // 2. Fetch Question Bank
      const { data: qData } = await this.supabase.from('question_bank').select('*');
      if (qData && qData.length) {
        this.data.questionBank = qData;
      }

      // 3. Fetch Test Submissions
      const { data: subData } = await this.supabase.from('test_submissions').select('*').order('submitted_at', { ascending: false });
      if (subData && subData.length) {
        this.data.testSubmissions = subData.map(sub => ({
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
        }));
      }

      // 4. Fetch AI Recommendations
      const { data: recData } = await this.supabase.from('ai_recommendations').select('*');
      if (recData && recData.length) {
        this.data.aiRecommendations = recData.map(r => ({
          id: r.id,
          studentId: r.student_id,
          studentName: r.student_name,
          suggestedTopic: r.suggested_topic,
          reason: r.reason,
          recommendedMission: r.recommended_mission,
          status: r.status
        }));
      }
    } catch (e) {
      console.error('Error syncing data from Supabase:', e);
    }
  },

  // Load from LocalStorage
  loadLocal() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.data = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse localStorage store:', e);
      }
    }

    const savedAuth = localStorage.getItem(this.AUTH_KEY);
    if (savedAuth) {
      try {
        this.data.currentUser = JSON.parse(savedAuth);
      } catch (e) {
        console.error('Failed to parse auth session:', e);
      }
    }
  },

  // Save to LocalStorage
  saveLocal() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
  },

  // Utility to shuffle array
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
  async submitTest(submission) {
    this.data.testSubmissions.unshift(submission);
    
    if (submission.score >= 5) {
      const earnedXp = Math.round(submission.score * 15);
      const earnedStars = Math.round(submission.score * 2);
      this.data.currentUser.xp += earnedXp;
      this.data.currentUser.stars += earnedStars;
    }

    const m2 = this.data.dailyMissions.find(m => m.id === 'm2');
    if (m2 && !m2.completed) {
      m2.progress = 1;
      m2.completed = true;
      this.data.currentUser.xp += m2.xp;
      this.data.currentUser.stars += m2.stars;
    }

    this.saveLocal();

    // Push submission to Supabase DB if connected
    if (this.isSupabaseConnected && this.supabase) {
      try {
        await this.supabase.from('test_submissions').insert([{
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

        // Update student stars & XP in Supabase
        await this.supabase.from('users').update({
          stars: this.data.currentUser.stars,
          xp: this.data.currentUser.xp
        }).eq('id', submission.studentId);
      } catch (err) {
        console.error('Failed to submit test to Supabase:', err);
      }
    }

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
      this.saveLocal();
      return true;
    }
    return false;
  },

  // Add teacher feedback
  async addTeacherComment(submissionId, comment) {
    const sub = this.data.testSubmissions.find(s => s.id === submissionId);
    if (sub) {
      sub.teacherComment = comment;
      this.saveLocal();

      if (this.isSupabaseConnected && this.supabase) {
        try {
          await this.supabase.from('test_submissions').update({
            teacher_comment: comment
          }).eq('id', submissionId);
        } catch (err) {
          console.error('Failed to update comment in Supabase:', err);
        }
      }
      return true;
    }
    return false;
  },

  // Assign AI Recommendation to Student
  async assignAiRecommendation(recId) {
    const rec = this.data.aiRecommendations.find(r => r.id === recId);
    if (rec) {
      rec.status = 'assigned';
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
      this.saveLocal();

      if (this.isSupabaseConnected && this.supabase) {
        try {
          await this.supabase.from('ai_recommendations').update({
            status: 'assigned'
          }).eq('id', recId);
        } catch (err) {
          console.error('Failed to update recommendation status in Supabase:', err);
        }
      }
      return true;
    }
    return false;
  }
};

// Auto init on script load
Store.init();
