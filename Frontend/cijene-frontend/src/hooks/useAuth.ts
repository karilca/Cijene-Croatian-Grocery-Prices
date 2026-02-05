// Authentication-related custom hooks

import { useState, useCallback } from 'react';
import { useAuth } from '../contexts';
import type { LoginRequest, RegisterRequest } from '../types';

// Hook for handling login form
export function useLogin() {
  const { login, error, isLoading } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = useCallback(async (credentials: LoginRequest) => {
    try {
      setLocalError(null);
      await login(credentials);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setLocalError(errorMessage);
      return false;
    }
  }, [login]);

  const clearError = useCallback(() => {
    setLocalError(null);
  }, []);

  return {
    handleLogin,
    error: localError || error?.message || null,
    isLoading,
    clearError,
  };
}

// Hook for handling registration form
export function useRegister() {
  const { register, error, isLoading } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleRegister = useCallback(async (userData: RegisterRequest) => {
    try {
      setLocalError(null);
      await register(userData);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setLocalError(errorMessage);
      return false;
    }
  }, [register]);

  const clearError = useCallback(() => {
    setLocalError(null);
  }, []);

  return {
    handleRegister,
    error: localError || error?.message || null,
    isLoading,
    clearError,
  };
}

// Hook for handling logout
export function useLogout() {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true);
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  return {
    handleLogout,
    isLoading,
  };
}

// Hook for checking authentication status
export function useAuthStatus() {
  const { isAuthenticated, user, isLoading } = useAuth();

  return {
    isAuthenticated,
    user,
    isLoading,
    isLoggedIn: isAuthenticated && !!user,
  };
}

// Note: Token refresh functionality removed since API uses static token
