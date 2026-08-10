-- ==========================================================================
-- HÀNH TRÌNH TOÁN HỌC - SUPABASE DATABASE INITIALIZATION SCRIPT (POSTGRESQL)
-- Web App Nền tảng Học tập Lớp 2 AI: Auth + RLS + DB + Storage Buckets
-- ==========================================================================

-- 1. BẢNG HỒ SƠ NGƯỜI DÙNG & PHÂN QUYỀN (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    is_approved BOOLEAN DEFAULT false, -- Giáo viên phải được Admin duyệt (is_approved = true) mới vào được hệ thống
    class_id UUID,
    avatar_url TEXT DEFAULT '👦',
    phone TEXT,
    stars INT DEFAULT 100,
    xp INT DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. BẢNG LỚP HỌC (classes)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    grade TEXT DEFAULT 'Lớp 2',
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. THÀNH VIÊN LỚP HỌC (class_members)
CREATE TABLE IF NOT EXISTS public.class_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, student_id)
);

-- 4. HỌC LIỆU TẢI LÊN STORAGE (learning_materials)
CREATE TABLE IF NOT EXISTS public.learning_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT DEFAULT 'pdf', -- 'pdf', 'image', 'document'
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TRÒ CHƠI TOÁN HỌC (games)
CREATE TABLE IF NOT EXISTS public.games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    game_type TEXT DEFAULT 'jungle_math',
    config JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. NHIỆM VỤ HẰNG NGÀY DO GIÁO VIÊN GIAO (missions)
CREATE TABLE IF NOT EXISTS public.missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    reward_xp INT DEFAULT 50,
    reward_stars INT DEFAULT 10,
    is_published BOOLEAN DEFAULT false,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. TIẾN ĐỘ NHIỆM VỤ HỌC SINH (student_mission_progress)
CREATE TABLE IF NOT EXISTS public.student_mission_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id UUID REFERENCES public.missions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(mission_id, student_id)
);

-- 8. BÀI TẬP & BÀI KIỂM TRA (assignments)
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'exercise' CHECK (type IN ('exercise', 'weekly_test')),
    is_published BOOLEAN DEFAULT false, -- Chỉ khi Giáo viên CHỐT (is_published = true) thì Học sinh mới thấy
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. CÂU HỎI TRONG BÀI TẬP (questions)
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_image_url TEXT,
    options JSONB NOT NULL, -- Array of strings e.g. ["25", "35", "27", "15"]
    correct_answer INT NOT NULL, -- Index 0-3
    explanation TEXT,
    topic TEXT DEFAULT 'Phép cộng có nhớ',
    time_limit_seconds INT DEFAULT 60,
    order_index INT DEFAULT 0
);

-- 10. BÀI NỘP HỌC SINH & CHẤM ĐIỂM GIÁO VIÊN (submissions)
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_score NUMERIC(4,2) DEFAULT 0,
    ai_suggested_score NUMERIC(4,2) DEFAULT 0,
    ai_suggested_comment TEXT,
    teacher_comment TEXT,
    is_approved BOOLEAN DEFAULT false, -- Chỉ khi Giáo viên CHỐT (is_approved = true) thì Học sinh mới xem được điểm và nhận xét
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assignment_id, student_id)
);

-- 11. ĐÁP ÁN VÀ ĐỒNG HỒ ĐẾM THỜI GIAN TỪNG CÂU (submission_answers)
CREATE TABLE IF NOT EXISTS public.submission_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    selected_option INT,
    is_correct BOOLEAN DEFAULT false,
    time_spent_seconds INT NOT NULL DEFAULT 0, -- Bộ đếm thời gian riêng từng câu hỏi
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. GỢI Ý & ĐỀ XUẤT TỪ AI CHO GIÁO VIÊN (ai_suggestions)
CREATE TABLE IF NOT EXISTS public.ai_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    suggestion_type TEXT NOT NULL, -- 'exercise_proposal', 'test_proposal', 'comment_proposal', 'weak_topic_summary'
    content JSONB NOT NULL,
    is_approved BOOLEAN DEFAULT false, -- Quy trình Human-in-the-Loop: Giáo viên duyệt mới gửi
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. NỘI DUNG HỌC SINH CÒN YẾU (student_weak_topics)
CREATE TABLE IF NOT EXISTS public.student_weak_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    mistake_count INT DEFAULT 1,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, topic)
);

-- ==========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_mission_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_weak_topics ENABLE ROW LEVEL SECURITY;

-- DROP POLICIES IF EXISTS FOR IDEMPOTENT RUNS
DROP POLICY IF EXISTS "Public Profiles Access" ON public.profiles;
DROP POLICY IF EXISTS "Public Classes Access" ON public.classes;
DROP POLICY IF EXISTS "Public Class Members Access" ON public.class_members;
DROP POLICY IF EXISTS "Public Materials Access" ON public.learning_materials;
DROP POLICY IF EXISTS "Public Games Access" ON public.games;
DROP POLICY IF EXISTS "Public Missions Access" ON public.missions;
DROP POLICY IF EXISTS "Public Mission Progress Access" ON public.student_mission_progress;
DROP POLICY IF EXISTS "Public Assignments Access" ON public.assignments;
DROP POLICY IF EXISTS "Public Questions Access" ON public.questions;
DROP POLICY IF EXISTS "Public Submissions Access" ON public.submissions;
DROP POLICY IF EXISTS "Public Submission Answers Access" ON public.submission_answers;
DROP POLICY IF EXISTS "Public AI Suggestions Access" ON public.ai_suggestions;
DROP POLICY IF EXISTS "Public Student Weak Topics Access" ON public.student_weak_topics;

-- CREATE RLS POLICIES FOR PUBLIC ANON & AUTHENTICATED ACCESS
CREATE POLICY "Public Profiles Access" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Public Classes Access" ON public.classes FOR ALL USING (true);
CREATE POLICY "Public Class Members Access" ON public.class_members FOR ALL USING (true);
CREATE POLICY "Public Materials Access" ON public.learning_materials FOR ALL USING (true);
CREATE POLICY "Public Games Access" ON public.games FOR ALL USING (true);
CREATE POLICY "Public Missions Access" ON public.missions FOR ALL USING (true);
CREATE POLICY "Public Mission Progress Access" ON public.student_mission_progress FOR ALL USING (true);
CREATE POLICY "Public Assignments Access" ON public.assignments FOR ALL USING (true);
CREATE POLICY "Public Questions Access" ON public.questions FOR ALL USING (true);
CREATE POLICY "Public Submissions Access" ON public.submissions FOR ALL USING (true);
CREATE POLICY "Public Submission Answers Access" ON public.submission_answers FOR ALL USING (true);
CREATE POLICY "Public AI Suggestions Access" ON public.ai_suggestions FOR ALL USING (true);
CREATE POLICY "Public Student Weak Topics Access" ON public.student_weak_topics FOR ALL USING (true);

-- ==========================================================================
-- SUPABASE STORAGE BUCKETS SETUP (SỬ DỤNG LỆNH POSTGRESQL INSERT)
-- ==========================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('learning-materials', 'learning-materials', true) 
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('question-images', 'question-images', true) 
ON CONFLICT (id) DO NOTHING;

-- STORAGE POLICIES
DROP POLICY IF EXISTS "Public Access Learning Materials" ON storage.objects;
DROP POLICY IF EXISTS "Public Access Question Images" ON storage.objects;

CREATE POLICY "Public Access Learning Materials" ON storage.objects 
FOR ALL USING (bucket_id = 'learning-materials');

CREATE POLICY "Public Access Question Images" ON storage.objects 
FOR ALL USING (bucket_id = 'question-images');
