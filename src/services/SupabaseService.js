import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

class SupabaseService {
  // Authentication methods
  static async signUp(email, password, metadata = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  static async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // User profile methods
  static async createUserProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([{
          user_id: userId,
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create user profile error:', error);
      throw error;
    }
  }

  static async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }

  static async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  // Emergency contacts methods
  static async getEmergencyContacts(userId) {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get emergency contacts error:', error);
      return [];
    }
  }

  static async addEmergencyContact(userId, contactData) {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert([{
          user_id: userId,
          ...contactData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Add emergency contact error:', error);
      throw error;
    }
  }

  static async updateEmergencyContact(contactId, updates) {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .update(updates)
        .eq('id', contactId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update emergency contact error:', error);
      throw error;
    }
  }

  static async deleteEmergencyContact(contactId) {
    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', contactId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Delete emergency contact error:', error);
      throw error;
    }
  }

  // Recording methods
  static async saveRecording(userId, recordingData) {
    try {
      const { data, error } = await supabase
        .from('recordings')
        .insert([{
          user_id: userId,
          ...recordingData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Save recording error:', error);
      throw error;
    }
  }

  static async getUserRecordings(userId) {
    try {
      const { data, error } = await supabase
        .from('recordings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user recordings error:', error);
      return [];
    }
  }

  static async uploadRecordingFile(userId, file, fileName) {
    try {
      const filePath = `recordings/${userId}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('recordings')
        .upload(filePath, file);
      
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('recordings')
        .getPublicUrl(filePath);
      
      return { filePath, publicUrl };
    } catch (error) {
      console.error('Upload recording file error:', error);
      throw error;
    }
  }

  // Legal content methods
  static async getLegalContent(state = null) {
    try {
      let query = supabase
        .from('legal_content')
        .select('*');
      
      if (state) {
        query = query.eq('state', state);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get legal content error:', error);
      return [];
    }
  }

  static async createLegalContent(contentData) {
    try {
      const { data, error } = await supabase
        .from('legal_content')
        .insert([{
          ...contentData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create legal content error:', error);
      throw error;
    }
  }

  // Payment tracking methods
  static async savePaymentRecord(userId, paymentData) {
    try {
      const { data, error } = await supabase
        .from('payment_records')
        .insert([{
          user_id: userId,
          ...paymentData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Save payment record error:', error);
      throw error;
    }
  }

  static async getUserPaymentHistory(userId) {
    try {
      const { data, error } = await supabase
        .from('payment_records')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get payment history error:', error);
      return [];
    }
  }

  // Subscription methods
  static async updateSubscriptionStatus(userId, subscriptionData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          subscription_status: subscriptionData.status,
          subscription_id: subscriptionData.subscription_id,
          subscription_expires_at: subscriptionData.expires_at,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update subscription status error:', error);
      throw error;
    }
  }

  // Real-time subscriptions
  static subscribeToUserProfile(userId, callback) {
    return supabase
      .channel(`user_profile_${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_profiles',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe();
  }

  static subscribeToEmergencyContacts(userId, callback) {
    return supabase
      .channel(`emergency_contacts_${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'emergency_contacts',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe();
  }
}

export default SupabaseService;
