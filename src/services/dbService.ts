import { supabase } from './supabaseClient';
import {
  ClassModel,
  LearningMaterial,
  MissionModel,
  AssignmentModel,
  QuestionModel,
  SubmissionModel,
  SubmissionAnswer,
  Profile,
  StudentWeakTopic
} from '../types/database.types';

export const dbService = {
  // --- 1. CLASSES & MEMBERS ---
  async getClasses(teacherId?: string): Promise<ClassModel[]> {
    let query = supabase.from('classes').select('*');
    if (teacherId) query = query.eq('teacher_id', teacherId);

    const { data, error } = await query;
    if (error) {
      console.warn('getClasses error, returning fallback:', error);
      return [];
    }
    return data || [];
  },

  async createClass(name: string, teacherId: string, grade = 'Lớp 2'): Promise<ClassModel> {
    const code = 'L2A-' + Math.floor(1000 + Math.random() * 9000);
    const { data, error } = await supabase
      .from('classes')
      .insert([{ name, grade, teacher_id: teacherId, code }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getClassStudents(classId: string): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .eq('class_id', classId);

    if (error) return [];
    return data || [];
  },

  // --- 2. LEARNING MATERIALS ---
  async getMaterials(classId: string): Promise<LearningMaterial[]> {
    const { data, error } = await supabase
      .from('learning_materials')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  },

  async createMaterial(mat: Partial<LearningMaterial>): Promise<LearningMaterial> {
    const { data, error } = await supabase
      .from('learning_materials')
      .insert([mat])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // --- 3. MISSIONS & PROGRESS (CHECKLIST) ---
  async getMissions(classId: string): Promise<MissionModel[]> {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  },

  async createMission(mission: Partial<MissionModel>): Promise<MissionModel> {
    const { data, error } = await supabase
      .from('missions')
      .insert([mission])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getStudentMissionProgress(studentId: string): Promise<Record<string, boolean>> {
    const { data, error } = await supabase
      .from('student_mission_progress')
      .select('*')
      .eq('student_id', studentId);

    if (error) return {};
    const map: Record<string, boolean> = {};
    (data || []).forEach(item => {
      map[item.mission_id] = item.is_completed;
    });
    return map;
  },

  async completeMission(missionId: string, studentId: string): Promise<boolean> {
    const { data: existing } = await supabase
      .from('student_mission_progress')
      .select('*')
      .eq('mission_id', missionId)
      .eq('student_id', studentId)
      .maybeSingle();

    if (existing && existing.is_completed) {
      return false; // Already completed, cannot click again!
    }

    const { error } = await supabase
      .from('student_mission_progress')
      .upsert([{
        mission_id: missionId,
        student_id: studentId,
        is_completed: true,
        completed_at: new Date().toISOString()
      }]);

    if (error) throw error;
    return true;
  },

  // Get Mission completion stats for teacher (e.g. 3/30 completed)
  async getMissionCompletionStats(missionId: string): Promise<{ completedCount: number; totalStudents: number }> {
    const { data: progressData } = await supabase
      .from('student_mission_progress')
      .select('student_id')
      .eq('mission_id', missionId)
      .eq('is_completed', true);

    const completedCount = progressData?.length || 0;
    return { completedCount, totalStudents: 30 };
  },

  // --- 4. ASSIGNMENTS & QUESTIONS ---
  async getAssignments(classId: string, isPublishedOnly = false): Promise<AssignmentModel[]> {
    let query = supabase.from('assignments').select('*').eq('class_id', classId);
    if (isPublishedOnly) {
      query = query.eq('is_published', true); // Students only see teacher-approved assignments!
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
  },

  async createAssignment(assignment: Partial<AssignmentModel>): Promise<AssignmentModel> {
    const { data, error } = await supabase
      .from('assignments')
      .insert([assignment])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async publishAssignment(assignmentId: string): Promise<boolean> {
    const { error } = await supabase
      .from('assignments')
      .update({ is_published: true })
      .eq('id', assignmentId);

    if (error) throw error;
    return true;
  },

  async getQuestions(assignmentId: string): Promise<QuestionModel[]> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('assignment_id', assignmentId)
      .order('order_index', { ascending: true });

    if (error) return [];
    return data || [];
  },

  async createQuestion(q: Partial<QuestionModel>): Promise<QuestionModel> {
    const { data, error } = await supabase
      .from('questions')
      .insert([q])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // --- 5. SUBMISSIONS & INDEPENDENT PER-QUESTION TIMER ---
  async submitAssignmentAnswers(
    assignmentId: string,
    studentId: string,
    studentName: string,
    answers: { questionId: string; selectedOption: number; isCorrect: boolean; timeSpentSeconds: number; topic: string }[]
  ): Promise<SubmissionModel> {
    const totalCorrect = answers.filter(a => a.isCorrect).length;
    const totalQuestions = answers.length || 1;
    const rawScore = Number(((totalCorrect / totalQuestions) * 10).toFixed(2));

    // AI suggested score & comment
    const aiScore = rawScore;
    const aiComment = rawScore >= 8
      ? `AI Đề xuất: Em làm bài rất xuất sắc! Đạt ${totalCorrect}/${totalQuestions} câu đúng.`
      : `AI Đề xuất: Em làm bài khá tốt. Cần chú ý làm cẩn thận hơn ở dạng bài tính toán có nhớ.`;

    // Insert Submission
    const { data: sub, error: subErr } = await supabase
      .from('submissions')
      .insert([{
        assignment_id: assignmentId,
        student_id: studentId,
        total_score: 0, // 0 until teacher approves!
        ai_suggested_score: aiScore,
        ai_suggested_comment: aiComment,
        teacher_comment: '',
        is_approved: false // Teacher must inspect & CHỐT before student sees grade
      }])
      .select()
      .single();

    if (subErr) throw subErr;

    // Insert Per-Question Answer Logs with Time Spent
    const answerRecords = answers.map(a => ({
      submission_id: sub.id,
      question_id: a.questionId,
      selected_option: a.selectedOption,
      is_correct: a.isCorrect,
      time_spent_seconds: a.timeSpentSeconds
    }));

    await supabase.from('submission_answers').insert(answerRecords);

    // Track weak topics
    for (const a of answers) {
      if (!a.isCorrect && a.topic) {
        await supabase.from('student_weak_topics').upsert([{
          student_id: studentId,
          topic: a.topic,
          mistake_count: 1
        }]);
      }
    }

    return sub;
  },

  // Teacher CHỐT Bài Chấm & Điểm Số
  async approveSubmission(submissionId: string, finalScore: number, teacherComment: string): Promise<boolean> {
    const { error } = await supabase
      .from('submissions')
      .update({
        total_score: finalScore,
        teacher_comment: teacherComment,
        is_approved: true // Now student can view score & comment!
      })
      .eq('id', submissionId);

    if (error) throw error;
    return true;
  },

  async getSubmissions(assignmentId?: string, studentId?: string): Promise<SubmissionModel[]> {
    let query = supabase.from('submissions').select('*, profiles(full_name)');
    if (assignmentId) query = query.eq('assignment_id', assignmentId);
    if (studentId) query = query.eq('student_id', studentId);

    const { data, error } = await query.order('submitted_at', { ascending: false });
    if (error) return [];
    return (data || []).map((d: any) => ({
      ...d,
      student_name: d.profiles?.full_name || 'Học sinh'
    }));
  },

  async getSubmissionAnswers(submissionId: string): Promise<SubmissionAnswer[]> {
    const { data, error } = await supabase
      .from('submission_answers')
      .select('*')
      .eq('submission_id', submissionId);

    if (error) return [];
    return data || [];
  },

  // --- 6. LEADERBOARD & ADMIN APPROVAL ---
  async getLeaderboard(classId: string) {
    const students = await this.getClassStudents(classId);
    return students.sort((a, b) => (b.stars || 0) - (a.stars || 0));
  },

  async getPendingTeachers(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'teacher')
      .eq('is_approved', false);

    if (error) return [];
    return data || [];
  },

  async approveTeacher(teacherId: string): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update({ is_approved: true })
      .eq('id', teacherId);

    if (error) throw error;
    return true;
  }
};
