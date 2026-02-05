// Simplified authentication context for managing local user state (favorites access only)

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authService } from '../services';
import type { 
  LoginRequest, 
  RegisterRequest,
  AuthError 
} from '../types';

// Simplified user interface for local auth
interface LocalUser {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  name?: string;
  verified: boolean;
}

// Simplified auth state - no tokens needed
interface LocalAuthState {
  user: LocalUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
}

// Action types for simplified auth
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: LocalUser } }
  | { type: 'AUTH_ERROR'; payload: AuthError }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: LocalUser };

// Initial state
const initialState: LocalAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Simplified auth reducer
function authReducer(state: LocalAuthState, action: AuthAction): LocalAuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
}

// Simplified context interface
interface AuthContextType extends LocalAuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: React.ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check if user is already authenticated locally
        const isAuthenticated = authService.isAuthenticated();
        const userData = authService.getCurrentUserData();

        if (isAuthenticated && userData) {
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user: userData }
          });
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      }
    };

    initializeAuth();
  }, []);

  // Simplified login function
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await authService.login(credentials);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: response.user }
      });
    } catch (error) {
      const authError: AuthError = {
        code: error instanceof Error ? error.name : 'LOGIN_ERROR',
        message: error instanceof Error ? error.message : 'Login failed',
      };
      
      dispatch({ type: 'AUTH_ERROR', payload: authError });
      throw error;
    }
  }, []);

  // Simplified register function
  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await authService.register(userData);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: response.user }
      });
    } catch (error) {
      const authError: AuthError = {
        code: error instanceof Error ? error.name : 'REGISTER_ERROR',
        message: error instanceof Error ? error.message : 'Registration failed',
      };
      
      dispatch({ type: 'AUTH_ERROR', payload: authError });
      throw error;
    }
  }, []);

  // Simplified logout function
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Context value
  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Hook for checking if user has specific permissions (simplified)
export function usePermissions() {
  const { user, isAuthenticated } = useAuth();

  const hasPermission = useCallback((_permission: string): boolean => {
    if (!isAuthenticated || !user) return false;
    
    // Simplified: all authenticated users have basic permissions
    return user.verified;
  }, [isAuthenticated, user]);

  const isAdmin = useCallback((): boolean => {
    // Simplified: no admin functionality in local auth
    return false;
  }, []);

  return {
    hasPermission,
    isAdmin,
  };
}
