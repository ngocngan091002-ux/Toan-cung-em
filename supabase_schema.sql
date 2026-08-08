-- ==========================================================================
-- TOÁN CÙNG EM - SUPABASE DATABASE INITIALIZATION SCRIPT (POSTGRESQL)
-- Script tích hợp Bảng Users (Username & Mật khẩu), RLS Policies & Seed Data
-- ==========================================================================

-- 1. BẢNG TÀI KHOẢN ĐĂNG NHẬP & THÔNG TIN NGƯỜI DÙNG (users)
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student', -- 'student' hoặc 'teacher'
    full_name VARCHAR(100) NOT NULL,
    grade VARCHAR(20) DEFAULT 'Lớp 2A',
    avatar VARCHAR(10) DEFAULT '👦',
    stars INT DEFAULT 1250,
    xp INT DEFAULT 450,
    level INT DEFAULT 7,
    avg_score NUMERIC(4,2) DEFAULT 8.75,
    tests_done INT DEFAULT 3,
    weak_topic VARCHAR(100) DEFAULT 'Phép trừ có nhớ',
    status VARCHAR(50) DEFAULT 'Cần luyện thêm',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. BẢNG NGÂN HÀNG CÂU HỎI LỚP 2 (question_bank)
CREATE TABLE IF NOT EXISTS public.question_bank (
    id VARCHAR(50) PRIMARY KEY,
    topic VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    answer INT NOT NULL,
    hint TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. BẢNG NHIỆM VỤ HẰNG NGÀY (daily_missions)
CREATE TABLE IF NOT EXISTS public.daily_missions (
    id VARCHAR(50) PRIMARY KEY,
    icon VARCHAR(10) NOT NULL,
    title VARCHAR(150) NOT NULL,
    desc_text TEXT NOT NULL,
    xp INT DEFAULT 50,
    stars INT DEFAULT 10,
    progress INT DEFAULT 0,
    target INT DEFAULT 1,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. BẢNG LƯU TRỮ BÀI THI & CHỐNG GIAN LẬN (test_submissions)
CREATE TABLE IF NOT EXISTS public.test_submissions (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES public.users(id) ON DELETE CASCADE,
    student_name VARCHAR(100) NOT NULL,
    test_title VARCHAR(100) NOT NULL,
    score NUMERIC(4,2) NOT NULL,
    correct_count INT NOT NULL,
    total_questions INT NOT NULL,
    time_spent_seconds INT NOT NULL,
    tab_switch_count INT DEFAULT 0,
    cheat_flagged BOOLEAN DEFAULT FALSE,
    teacher_comment TEXT,
    weak_topics JSONB,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. BẢNG GỢI Ý CÁ NHÂN HÓA TỪ AI (ai_recommendations)
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES public.users(id) ON DELETE CASCADE,
    student_name VARCHAR(100) NOT NULL,
    suggested_topic VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    recommended_mission TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending' hoặc 'assigned'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES - ĐỌC & GHI CÔNG KHAI QUA SUPABASE ANON KEY
-- ==========================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

-- Xóa các policy cũ nếu đã tồn tại để tránh lỗi 42710
DROP POLICY IF EXISTS "Allow public all users" ON public.users;
DROP POLICY IF EXISTS "Allow public all question_bank" ON public.question_bank;
DROP POLICY IF EXISTS "Allow public all daily_missions" ON public.daily_missions;
DROP POLICY IF EXISTS "Allow public all test_submissions" ON public.test_submissions;
DROP POLICY IF EXISTS "Allow public all ai_recommendations" ON public.ai_recommendations;

DROP POLICY IF EXISTS "Allow public select students" ON public.students;
DROP POLICY IF EXISTS "Allow public insert/update students" ON public.students;
DROP POLICY IF EXISTS "Allow public select question_bank" ON public.question_bank;
DROP POLICY IF EXISTS "Allow public insert/update question_bank" ON public.question_bank;
DROP POLICY IF EXISTS "Allow public select daily_missions" ON public.daily_missions;
DROP POLICY IF EXISTS "Allow public insert/update daily_missions" ON public.daily_missions;
DROP POLICY IF EXISTS "Allow public select test_submissions" ON public.test_submissions;
DROP POLICY IF EXISTS "Allow public insert test_submissions" ON public.test_submissions;
DROP POLICY IF EXISTS "Allow public select ai_recommendations" ON public.ai_recommendations;
DROP POLICY IF EXISTS "Allow public insert/update ai_recommendations" ON public.ai_recommendations;

-- Tạo các policy mới
CREATE POLICY "Allow public all users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow public all question_bank" ON public.question_bank FOR ALL USING (true);
CREATE POLICY "Allow public all daily_missions" ON public.daily_missions FOR ALL USING (true);
CREATE POLICY "Allow public all test_submissions" ON public.test_submissions FOR ALL USING (true);
CREATE POLICY "Allow public all ai_recommendations" ON public.ai_recommendations FOR ALL USING (true);

-- ==========================================================================
-- INSERT SEED DATA (DỮ LIỆU TÀI KHOẢN MẪU BAN ĐẦU)
-- ==========================================================================

-- Chèn Danh sách Tài khoản Học sinh & Giáo viên Mẫu
INSERT INTO public.users (id, username, password, role, full_name, grade, avatar, stars, xp, level, avg_score, tests_done, weak_topic, status)
VALUES 
('std_01', 'nam', '123', 'student', 'Bé Nam', 'Lớp 2A', '👦', 1250, 450, 7, 8.75, 3, 'Phép trừ có nhớ', 'Cần luyện thêm'),
('std_02', 'an', '123', 'student', 'Bé An', 'Lớp 2A', '👧', 1680, 720, 9, 9.50, 3, 'Không có', 'Xuất sắc'),
('std_03', 'binh', '123', 'student', 'Bé Bình', 'Lớp 2A', '👦', 820, 310, 5, 6.25, 2, 'Toán có lời văn', 'Cần hỗ trợ'),
('std_04', 'hoa', '123', 'student', 'Bé Hoa', 'Lớp 2A', '👧', 1040, 480, 6, 7.50, 3, 'Tìm X', 'Khá'),
('std_05', 'linh', '123', 'student', 'Bé Linh', 'Lớp 2A', '👧', 1450, 600, 8, 9.00, 3, 'Đo lường', 'Giỏi'),
('tch_01', 'mai', '123', 'teacher', 'Cô Mai', 'Lớp 2A', '👩‍🏫', 0, 0, 1, 10.0, 0, 'Không', 'Hoạt động'),
('adm_01', 'admin', '123', 'admin', 'Quản trị viên Hệ thống', 'Toàn trường', '👑', 9999, 9999, 99, 10.0, 0, 'Không', 'Quản trị viên')
ON CONFLICT (id) DO NOTHING;

-- Chèn Ngân hàng câu hỏi Lớp 2 chuẩn GDPT
INSERT INTO public.question_bank (id, topic, question, options, answer, hint)
VALUES 
('q1', 'Phép cộng có nhớ', 'Tính: 28 + 15 = ?', '["33", "43", "42", "53"]'::jsonb, 1, 'Em thử lấy 8 cộng 5 bằng 13 (viết 3 nhớ 1), rồi lấy 2 cộng 1 thêm 1 nhớ nhé!'),
('q2', 'Phép trừ có nhớ', 'Tính: 52 - 27 = ?', '["25", "35", "27", "15"]'::jsonb, 0, 'Lấy 12 trừ 7 bằng 5, bớt 1 ở số 5 chục còn 4 chục. 4 chục trừ 2 chục bằng 2 chục!'),
('q3', 'Toán có lời văn', 'Bé Nam có 15 viên bi. An cho Nam thêm 8 viên bi nữa. Hỏi Nam có tất cả bao nhiêu viên bi?', '["21 viên bi", "22 viên bi", "23 viên bi", "24 viên bi"]'::jsonb, 2, 'Có thêm nghĩa là chúng mình thực hiện phép tính cộng: 15 + 8 nhé!'),
('q4', 'Bảng nhân 2 & 5', 'Mỗi bàn có 5 học sinh. Hỏi 6 bàn như thế có tất cả bao nhiêu học sinh?', '["25 học sinh", "30 học sinh", "35 học sinh", "20 học sinh"]'::jsonb, 1, 'Em đọc bảng nhân 5 nhé: 5 nhân 6 bằng bao nhiêu nhỉ?'),
('q5', 'Hình học', 'Hình tam giác có bao nhiêu đỉnh và bao nhiêu cạnh?', '["3 đỉnh và 3 cạnh", "4 đỉnh và 4 cạnh", "3 đỉnh và 4 cạnh", "2 đỉnh và 3 cạnh"]'::jsonb, 0, 'Tam giác nghĩa là có 3 góc và 3 cạnh đó em!'),
('q6', 'Tìm X', 'Tìm X, biết: X + 14 = 30', '["X = 44", "X = 16", "X = 26", "X = 14"]'::jsonb, 1, 'Muốn tìm số hạng chưa biết, ta lấy Tổng trừ đi Số hạng đã biết: X = 30 - 14.'),
('q7', 'Đo lường', 'Đổi đơn vị: 1 mét (m) = ... xăng-ti-mét (cm)?', '["10 cm", "50 cm", "100 cm", "1000 cm"]'::jsonb, 2, 'Một mét thì bằng 10 đề-xi-mét, và bằng 100 xăng-ti-mét đó em!'),
('q8', 'Phép cộng tròn chục', 'Tính nhẩm: 40 + 50 = ?', '["80", "90", "100", "70"]'::jsonb, 1, '4 chục cộng 5 chục bằng 9 chục = 90.')
ON CONFLICT (id) DO NOTHING;

-- Chèn Nhiệm vụ hàng ngày
INSERT INTO public.daily_missions (id, icon, title, desc_text, xp, stars, progress, target, completed)
VALUES 
('m1', '🌲', 'Thám hiểm Rừng Xanh', 'Chơi 1 ván game toán Rừng Xanh', 50, 10, 0, 1, false),
('m2', '📝', 'Thử thách Hằng tuần', 'Hoàn thành Bài kiểm tra Tuần 1', 100, 20, 0, 1, false),
('m3', '🐼', 'Hỏi bạn Panda AI', 'Trò chuyện cùng Trợ lý AI Panda', 30, 5, 0, 1, false)
ON CONFLICT (id) DO NOTHING;

-- Chèn Bài làm mẫu đã nộp
INSERT INTO public.test_submissions (id, student_id, student_name, test_title, score, correct_count, total_questions, time_spent_seconds, tab_switch_count, cheat_flagged, teacher_comment, weak_topics)
VALUES 
('sub_101', 'std_01', 'Bé Nam', 'Bài kiểm tra Tuần 1', 8.75, 7, 8, 245, 0, false, 'Con làm bài rất tốt! Cần chú ý làm cẩn thận hơn ở dạng phép trừ có nhớ nhé.', '["Phép trừ có nhớ"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Chèn Gợi ý AI Cá nhân hóa
INSERT INTO public.ai_recommendations (id, student_id, student_name, suggested_topic, reason, recommended_mission, status)
VALUES 
('rec_01', 'std_01', 'Bé Nam', 'Phép trừ có nhớ trong phạm vi 100', 'Phát hiện Bé Nam sai 2/3 câu phép trừ có nhớ gần nhất.', 'Luyện 5 câu Phép trừ có nhớ cùng Panda AI', 'pending'),
('rec_02', 'std_03', 'Bé Bình', 'Giải Toán có lời văn 1 phép tính', 'Bé Bình chưa nắm rõ từ khóa "thêm", "bớt" trong đề bài văn.', 'Bài tập tương tác: Phân tích đề toán câu từ', 'assigned')
ON CONFLICT (id) DO NOTHING;
