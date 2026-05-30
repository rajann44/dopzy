import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';
import { useAppContext } from './AppContext';
import { useToast } from './ToastContext';

interface AuthContextValue {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateCurrentUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { state } = useAppContext();
  const { showToast } = useToast();

  // Restore session on mount
  useEffect(() => {
    const session = authService.getStoredSession();
    if (session) {
      // Cross-reference with the active users state to make sure they aren't disabled
      const userInState = state.users.find((u) => u.id === session.user.id);
      if (userInState?.isDisabled) {
        authService.logout();
        setCurrentUser(null);
      } else {
        setCurrentUser(userInState || session.user);
      }
    }
    setIsLoading(false);
  }, [state.users]);

  // Monitor live disabled status of the current user
  useEffect(() => {
    if (currentUser) {
      const userInState = state.users.find((u) => u.id === currentUser.id);
      if (userInState?.isDisabled) {
        authService.logout();
        setCurrentUser(null);
        showToast('Your account has been disabled by an administrator.', 'error');
      }
    }
  }, [state.users, currentUser, showToast]);

  const login = useCallback(async (email: string, password: string) => {
    // Check if the user is disabled in global state BEFORE doing simulated login
    const userInState = state.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (userInState?.isDisabled) {
      throw new Error('This account has been disabled by an administrator.');
    }

    const result = await authService.login(email, password);
    setCurrentUser(result.user);
  }, [state.users]);

  const logout = useCallback(async () => {
    await authService.logout();
    setCurrentUser(null);
  }, []);

  const updateCurrentUser = useCallback((userData: Partial<User>) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...userData };
      const session = authService.getStoredSession();
      if (session) {
        session.user = next;
        sessionStorage.setItem('taskbuddy_session', JSON.stringify(session));
      }
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
