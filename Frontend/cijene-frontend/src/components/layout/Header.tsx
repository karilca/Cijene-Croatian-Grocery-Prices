// Header component with search bar and authentication

import { useState } from 'react';
import { Link } from 'react-router-dom';

import { AuthModal } from '../auth/AuthModal';
import { useAuthStatus, useLogout } from '../../hooks/useAuth';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useLanguage } from '../../contexts/LanguageContext';

export function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { isAuthenticated, user, isLoading } = useAuthStatus();
  const { handleLogout, isLoading: isLoggingOut } = useLogout();
  const { t } = useLanguage();



  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogoutClick = async () => {
    await handleLogout();
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <h1 className="text-xl md:text-2xl font-bold text-blue-600">Cijene</h1>
              <span className="hidden sm:block ml-2 text-xs md:text-sm text-gray-500">{t('header.subtitle')}</span>
            </Link>



            {/* User Menu */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : isAuthenticated && user ? (
                <>
                  {/* Authenticated User Menu */}
                  {import.meta.env.VITE_BETA_FEATURES === 'true' && (
                    <Link
                      to="/favorites"
                      className="hidden sm:block text-gray-600 hover:text-blue-600 text-sm"
                    >
                      {t('nav.favorites')}
                    </Link>
                  )}
                  <div className="relative group">
                    <button className="flex items-center space-x-1 md:space-x-2 text-gray-600 hover:text-blue-600">
                      <span className="text-xs md:text-sm">
                        {user.firstName || user.username || user.email}
                      </span>
                      <svg
                        className="h-3 w-3 md:h-4 md:w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {import.meta.env.VITE_BETA_FEATURES === 'true' && (
                        <Link to="/favorites" className="sm:hidden block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          {t('nav.favorites')}
                        </Link>
                      )}
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        {t('auth.profile')}
                      </button>
                      <Link to="/settings" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        {t('auth.settings')}
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogoutClick}
                        disabled={isLoggingOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                      >
                        {isLoggingOut ? t('auth.signingOut') : t('auth.signout')}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Guest User Menu */}
                  {import.meta.env.VITE_BETA_FEATURES === 'true' && (
                    <>
                      <button
                        onClick={() => handleAuthClick('login')}
                        className="text-gray-600 hover:text-blue-600"
                      >
                        {t('auth.signin')}
                      </button>
                      <button
                        onClick={() => handleAuthClick('register')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        {t('auth.signup')}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        onSuccess={() => setShowAuthModal(false)}
      />
    </>
  );
}
