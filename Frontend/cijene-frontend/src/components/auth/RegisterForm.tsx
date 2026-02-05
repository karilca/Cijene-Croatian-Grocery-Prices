// Registration form component for user signup

import { useState } from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { useRegister } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import type { RegisterRequest } from '../../types';

interface RegisterFormProps {
  onSuccess?: () => void;
  onToggleMode?: () => void;
  className?: string;
}

export function RegisterForm({ onSuccess, onToggleMode, className = '' }: RegisterFormProps) {
  const { handleRegister, error, isLoading, clearError } = useRegister();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    firstName: '',
    lastName: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      errors.email = t('validation.email.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('validation.email.invalid');
    }

    // Password validation
    if (!formData.password) {
      errors.password = t('validation.password.required');
    } else if (formData.password.length < 8) {
      errors.password = t('validation.password.minLength').replace('{min}', '8');
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = t('validation.confirmPassword.required');
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('validation.confirmPassword.mismatch');
    }

    // Username validation (optional but if provided, must be valid)
    if (formData.username && formData.username.length < 3) {
      errors.username = t('validation.username.minLength').replace('{min}', '3');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear global error
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const success = await handleRegister(formData);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('auth.createAccount.title')}</h2>
          <p className="text-gray-600 mt-2">{t('auth.createAccount.subtitle')}</p>
        </div>

        {error && (
          <ErrorMessage message={error} onRetry={clearError} />
        )}

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.email.label')} *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder={t('auth.email.placeholder')}
            disabled={isLoading}
            autoComplete="email"
            required
          />
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
          )}
        </div>

        {/* Username Field */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.username.label')}
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.username ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder={t('auth.username.placeholder')}
            disabled={isLoading}
            autoComplete="username"
          />
          {formErrors.username && (
            <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
          )}
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.firstName.label')}
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('auth.firstName.placeholder')}
              disabled={isLoading}
              autoComplete="given-name"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.lastName.label')}
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('auth.lastName.placeholder')}
              disabled={isLoading}
              autoComplete="family-name"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.password.label')} *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.password ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder={t('auth.password.create')}
            disabled={isLoading}
            autoComplete="new-password"
            required
          />
          {formErrors.password && (
            <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.confirmPassword.label')} *
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder={t('auth.confirmPassword.placeholder')}
            disabled={isLoading}
            autoComplete="new-password"
            required
          />
          {formErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : null}
          {isLoading ? t('auth.creatingAccount') : t('auth.createAccount.action')}
        </button>

        {/* Toggle to Login */}
        {onToggleMode && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {t('auth.hasAccount')}{' '}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-blue-600 hover:text-blue-500 font-medium"
                disabled={isLoading}
              >
                {t('auth.signIn')}
              </button>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
