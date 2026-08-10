import { supabase } from './supabaseClient';
import { Profile, UserRole } from '../types/database.types';

const AUTH_STORAGE_KEY = 'HANH_TRINH_TOAN_HOC_USER';

export const authService = {
  // Sign in with Google OAuth
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  },

  // Login with Email or Phone / Password
  async loginWithEmailOrPhone(identifier: string, pass: string) {
    const cleanId = identifier.trim().toLowerCase();

    // 1. Try querying Supabase profiles table directly for custom accounts
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`email.eq.${cleanId},phone.eq.${cleanId},full_name.ilike.%${cleanId}%`)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.warn('Profile fetch warning:', error);
    }

    if (profile) {
      // Check Teacher Approval status
      if (profile.role === 'teacher' && !profile.is_approved) {
        throw new Error('Tài khoản Giáo viên của bạn chưa được Quản trị viên phê duyệt! Vui lòng liên hệ Admin để cấp quyền truy cập.');
      }
      this.saveLocalProfile(profile);
      return profile;
    }

    // 2. Try Supabase Auth Sign In
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanId.includes('@') ? cleanId : `${cleanId}@toan.edu.vn`,
      password: pass
    });

    if (authError || !authData.user) {
      throw new Error('Đăng nhập không thành công! Vui lòng kiểm tra lại thông tin tài khoản hoặc đăng ký mới.');
    }

    // Get profile for authenticated user
    const userProfile = await this.getProfile(authData.user.id);
    if (userProfile?.role === 'teacher' && !userProfile.is_approved) {
      throw new Error('Tài khoản Giáo viên của bạn chưa được Quản trị viên phê duyệt!');
    }

    if (userProfile) {
      this.saveLocalProfile(userProfile);
      return userProfile;
    }

    throw new Error('Tài khoản không tồn tại trên hệ thống!');
  },

  // Register New Account
  async registerAccount(params: {
    email?: string;
    phone?: string;
    fullName: string;
    role: UserRole;
    password: string;
    classId?: string;
  }) {
    const cleanEmail = params.email?.trim().toLowerCase() || `${Date.now()}@toan.edu.vn`;
    const isTeacher = params.role === 'teacher';
    const isApproved = !isTeacher; // Student auto-approved, Teacher needs Admin Approval!

    // 1. Create Supabase Auth User
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: cleanEmail,
      password: params.password,
      options: {
        data: {
          full_name: params.fullName,
          role: params.role
        }
      }
    });

    const newId = authData?.user?.id || crypto.randomUUID();

    // 2. Insert into profiles table
    const newProfile: Profile = {
      id: newId,
      email: cleanEmail,
      full_name: params.fullName,
      role: params.role,
      is_approved: isApproved,
      class_id: params.classId || null,
      avatar_url: params.role === 'teacher' ? '👩‍🏫' : '👦',
      phone: params.phone || null,
      stars: 100,
      xp: 50
    };

    const { data: profileData, error: profileErr } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
      .single();

    if (profileErr) {
      console.warn('Could not insert profile to DB, fallback local:', profileErr);
    }

    const finalProfile = profileData || newProfile;

    if (isTeacher) {
      throw new Error('Đăng ký tài khoản Giáo viên thành công! Vui lòng chờ Quản trị viên (Admin) phê duyệt trước khi đăng nhập.');
    }

    this.saveLocalProfile(finalProfile);
    return finalProfile;
  },

  // Fetch Profile from Supabase
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching profile:', error);
      return null;
    }
    return data;
  },

  // Save session local
  saveLocalProfile(profile: Profile) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
  },

  // Get current saved profile
  getLocalProfile(): Profile | null {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },

  // Logout
  async logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    await supabase.auth.signOut();
  }
};
