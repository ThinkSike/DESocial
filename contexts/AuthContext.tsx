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
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Starting login process');
      setLoading(true);
      const userData = await authService.loginWithEmail({ email, password });
      console.log('AuthContext: Login successful, setting user data');
      setUser(userData);
      setLoading(false);
      console.log('AuthContext: User data set, login complete');
    } catch (error) {
      console.log('AuthContext: Login failed, resetting loading state');
      setLoading(false);
      throw error;
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