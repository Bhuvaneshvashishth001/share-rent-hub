import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, setAuthToken, clearAuthToken, getAuthToken } from '@/lib/api';

/**
 * User interface
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  profileImage?: string;
  createdAt?: string;
}

/**
 * Auth context interface
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

/**
 * Create context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Component
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = getAuthToken();
    console.log('🔍 [AUTH] Checking existing token on mount:', token ? 'EXISTS' : 'NONE');
    if (token) {
      console.log('🔍 [AUTH] Token found, fetching current user...');
      fetchCurrentUser();
    } else {
      console.log('🔍 [AUTH] No token found, setting loading to false');
      setLoading(false);
    }
  }, []);

  /**
   * Fetch current user from backend
   */
  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        console.log('✅ Current user loaded:', response.data);
      }
    } catch (error) {
      console.error('❌ Failed to fetch current user:', error);
      clearAuthToken();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle login
   */
  const handleLogin = (userData: User, token: string) => {
    console.log('🔐 [AUTH] handleLogin called with:', { userData, token: token ? 'PRESENT' : 'MISSING' });
    setAuthToken(token);
    setUser(userData);
    setIsAuthenticated(true);
    console.log('✅ [AUTH] User logged in successfully:', userData);
    console.log('✅ [AUTH] isAuthenticated set to:', true);
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    clearAuthToken();
    setUser(null);
    setIsAuthenticated(false);
    console.log('✅ User logged out');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login: handleLogin,
        logout: handleLogout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use Auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
