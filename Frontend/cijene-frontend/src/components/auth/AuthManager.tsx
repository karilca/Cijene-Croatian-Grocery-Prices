// Authentication manager component for handling automatic token refresh

import { useEffect } from 'react';
import { useTokenRefreshManager } from '../../hooks/useTokenRefreshManager';
import { useNotifications } from '../common/NotificationSystem';
import { useAuth as useAuthContext } from '../../contexts/AuthContext';

export function AuthManager() {
  const { notifyError, notifyWarning } = useNotifications();
  const { error, clearError } = useAuthContext();
  
  // Handle authentication token refresh
  useTokenRefreshManager();

  // Handle global authentication errors
  useEffect(() => {
    if (error) {
      switch (error.code) {
        case 'TOKEN_EXPIRED':
          notifyWarning(
            'Your session has expired. Please log in again.',
            'Session Expired'
          );
          break;
        case 'UNAUTHORIZED':
          notifyError(
            'Authentication failed. Please check your credentials.',
            'Authentication Error'
          );
          break;
        case 'NETWORK_ERROR':
          notifyError(
            'Unable to connect to authentication server.',
            'Connection Error'
          );
          break;
        default:
          notifyError(
            error.message || 'An authentication error occurred.',
            'Authentication Error'
          );
          break;
      }
      
      // Clear the error after showing notification
      clearError();
    }
  }, [error, notifyError, notifyWarning, clearError]);

  // This component doesn't render anything visible
  return null;
}
