// Simplified token refresh manager (disabled - using static token)

import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useTokenRefreshManager() {
  const { isAuthenticated } = useAuth();

  // Handle storage events (when user logs in/out in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cijene_auth_token') {
        // Auth state changed in another tab, check our auth state
        const hasStoredToken = !!localStorage.getItem('cijene_auth_token');
        
        if (hasStoredToken && !isAuthenticated) {
          // User logged in another tab, we should refresh our state
          window.location.reload();
        } else if (!hasStoredToken && isAuthenticated) {
          // User logged out in another tab, we should logout too
          window.location.reload();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated]);

  return {
    // No-op functions to maintain compatibility
    scheduleTokenRefresh: () => console.log('Token refresh disabled - using static token'),
    checkAndRefreshIfNeeded: () => Promise.resolve(),
  };
}
