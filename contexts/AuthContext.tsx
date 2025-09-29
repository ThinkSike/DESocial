// Authentication Context Provider for DESocial
import { User as FirebaseUser } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (prn: string, password: string) => Promise<void>;
  register: (registerData: any) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (prn: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          console.log('AuthContext: Fetching user data for:', firebaseUser.uid);
          const userData = await authService.getCurrentUser();
          
          if (userData) {
            console.log('AuthContext: User data fetched successfully:', userData.displayName);
            setUser(userData);
          } else {
            console.warn('AuthContext: No user data returned, user might be offline');
            setUser(null);
          }
        } catch (error: any) {
          console.error('AuthContext: Error fetching user data:', error);
          
          // Don't set user to null if it's just a network error
          if (error.message?.includes('offline') || error.message?.includes('network')) {
            console.log('AuthContext: Network error, keeping existing user state');
            // Keep existing user state, don't clear it
          } else {
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        console.log(`AuthContext: Starting login process (attempt ${retryCount + 1}/${maxRetries})`);
        setLoading(true);
        const userData = await authService.loginWithEmail({ email, password });
        console.log('AuthContext: Login successful, setting user data');
        setUser(userData);
        setLoading(false);
        console.log('AuthContext: User data set, login complete');
        return; // Success, exit retry loop
      } catch (error: any) {
        console.log(`AuthContext: Login attempt ${retryCount + 1} failed:`, error.message);
        retryCount++;
        
        // If it's a network/offline error and we have retries left, wait and retry
        if ((error.message?.includes('offline') || error.message?.includes('network') || error.message?.includes('timeout')) && retryCount < maxRetries) {
          console.log(`AuthContext: Network error, retrying in ${retryCount * 1000}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
          continue;
        }
        
        // If it's not a network error or we're out of retries, throw the error
        console.log('AuthContext: Login failed, resetting loading state');
        setLoading(false);
        throw error;
      }
    }
  };

  const register = async (registerData: any) => {
    try {
      setLoading(true);
      const userData = await authService.registerWithEmail(registerData);
      setUser(userData);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setFirebaseUser(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const resetPassword = async (prn: string) => {
    await authService.resetPassword(prn);
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      await authService.updateUserProfile(updates);
      if (user) {
        setUser({ ...user, ...updates });
      }
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};