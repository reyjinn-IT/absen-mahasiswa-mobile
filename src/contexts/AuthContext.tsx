import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { router } from 'expo-router';
import { authService, type User } from '@/services/auth';
import { setToken, initAuthToken } from '@/services/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await authService.profile();
      setUser(profile);
    } catch {
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await initAuthToken();
        if (token) {
          await refreshProfile();
        }
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [refreshProfile]);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const response = await authService.login(email, password);
    setToken(response.access_token);
    setUser(response.user);
    return response.user;
  }, []);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ) => {
    await authService.register({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setToken(null);
      setUser(null);
      router.replace('/login');
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}