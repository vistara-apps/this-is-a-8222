import React, { createContext, useContext, useEffect, useState } from 'react';
import SupabaseService, { supabase } from '../services/SupabaseService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const currentUser = await SupabaseService.getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          const profile = await SupabaseService.getUserProfile(currentUser.id);
          setUserProfile(profile);
        }
      } catch (err) {
        console.error('Error getting initial session:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          setUser(session.user);
          
          // Get or create user profile
          let profile = await SupabaseService.getUserProfile(session.user.id);
          
          if (!profile && event === 'SIGNED_UP') {
            // Create profile for new users
            profile = await SupabaseService.createUserProfile(session.user.id, {
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || '',
              phone_number: session.user.user_metadata?.phone_number || '',
              subscription_status: 'free'
            });
          }
          
          setUserProfile(profile);
        } else {
          setUser(null);
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, metadata = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const { user: newUser } = await SupabaseService.signUp(email, password, metadata);
      
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { user: signedInUser } = await SupabaseService.signIn(email, password);
      
      return signedInUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await SupabaseService.signOut();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const updatedProfile = await SupabaseService.updateUserProfile(user.id, updates);
      setUserProfile(updatedProfile);
      
      return updatedProfile;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const refreshProfile = async () => {
    try {
      if (!user) return null;
      
      const profile = await SupabaseService.getUserProfile(user.id);
      setUserProfile(profile);
      
      return profile;
    } catch (err) {
      console.error('Error refreshing profile:', err);
      return null;
    }
  };

  // Check if user has active subscription
  const hasActiveSubscription = () => {
    if (!userProfile) return false;
    
    const { subscription_status, subscription_expires_at } = userProfile;
    
    if (subscription_status === 'active') {
      if (!subscription_expires_at) return true; // Lifetime subscription
      
      const expiresAt = new Date(subscription_expires_at);
      return expiresAt > new Date();
    }
    
    return false;
  };

  // Check if user can access premium features
  const canAccessPremium = () => {
    return hasActiveSubscription() || userProfile?.subscription_status === 'trial';
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
    hasActiveSubscription,
    canAccessPremium,
    isAuthenticated: !!user,
    isPremium: canAccessPremium()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
