export type UserRole = 'student' | 'teacher' | 'admin';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string;
  role: UserRole;
  is_approved: boolean;
  class_id?: string | null;
  avatar_url?: string;
  phone?: string | null;
  stars?: number;
  xp?: number;
  created_at?: string;
}

export interface ClassModel {
  id: string;
  name: string;
  grade: string;
  teacher_id: string;
  code: string;
  created_at?: string;
}

export interface ClassMember {
  id: string;
  class_id: string;
  student_id: string;
  joined_at?: string;
}

export interface LearningMaterial {
  id: string;
  class_id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: 'pdf' | 'image' | 'document';
  created_by?: string;
  created_at?: string;
}

export interface GameModel {
  id: string;
  class_id: string;
  title: string;
  description: string;
  game_type: string;
  config?: any;
  created_by?: string;
  created_at?: string;
}

export interface MissionModel {
  id: string;
  class_id: string;
  title: string;
  description: string;
  reward_xp: number;
  reward_stars?: number;
  is_published: boolean;
  created_by?: string;
  created_at?: string;
}

export interface StudentMissionProgress {
  id: string;
  mission_id: string;
  student_id: string;
  is_completed: boolean;
  completed_at?: string | null;
}

export interface AssignmentModel {
  id: string;
  class_id: string;
  title: string;
  type: 'exercise' | 'weekly_test';
  is_published: boolean; // Only when teacher approves (is_published = true) can student see it
  created_by?: string;
  created_at?: string;
}

export interface QuestionModel {
  id: string;
  assignment_id: string;
  question_text: string;
  question_image_url?: string | null;
  options: string[]; // 4 options
  correct_answer: number; // 0-3
  explanation?: string;
  topic: string;
  time_limit_seconds: number;
  order_index?: number;
}

export interface SubmissionModel {
  id: string;
  assignment_id: string;
  student_id: string;
  student_name?: string;
  total_score: number;
  ai_suggested_score?: number;
  ai_suggested_comment?: string;
  teacher_comment?: string;
  is_approved: boolean; // Only when teacher approves (is_approved = true) can student see score & comment
  submitted_at?: string;
}

export interface SubmissionAnswer {
  id: string;
  submission_id: string;
  question_id: string;
  selected_option: number;
  is_correct: boolean;
  time_spent_seconds: number; // Independent timer per question
}

export interface AiSuggestion {
  id: string;
  teacher_id: string;
  student_id?: string;
  suggestion_type: 'exercise_proposal' | 'test_proposal' | 'comment_proposal' | 'weak_topic_summary';
  content: any;
  is_approved: boolean;
  created_at?: string;
}

export interface StudentWeakTopic {
  id: string;
  student_id: string;
  topic: string;
  mistake_count: number;
  last_updated?: string;
}
