// Protected route component that requires authentication

import { useState } from 'react';
import type { ReactNode } from 'react';
import { useAuthStatus } from '../../hooks/useAuth';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { AuthModal } from './AuthModal';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({ 
  children, 
  fallback,
  requireAuth = true 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStatus();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // If authentication is not required, render children
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If user is authenticated, render children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If user is not authenticated, show fallback or auth modal
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-64 p-8">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access this content. Please sign in or create an account to continue.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign In
          </button>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </>
  );
}
