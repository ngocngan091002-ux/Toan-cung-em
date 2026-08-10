import { supabase } from './supabaseClient';

export const storageService = {
  // Upload Learning Material (PDF, Document, Image)
  async uploadMaterialFile(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `materials/${fileName}`;

    const { data, error } = await supabase.storage
      .from('learning-materials')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.warn('Storage upload error, using object URL fallback:', error);
      return URL.createObjectURL(file);
    }

    const { data: publicUrlData } = supabase.storage
      .from('learning-materials')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  },

  // Upload Question Image (đề bài và đáp án)
  async uploadQuestionImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `questions/${fileName}`;

    const { data, error } = await supabase.storage
      .from('question-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.warn('Storage upload error, using object URL fallback:', error);
      return URL.createObjectURL(file);
    }

    const { data: publicUrlData } = supabase.storage
      .from('question-images')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }
};
