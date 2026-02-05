// Simplified authentication service for managing local authentication (favorites access only)
// API calls use static token, this service only manages local auth state

import { RequestValidator } from './api-client';
import { STORAGE_KEYS, ERROR_MESSAGES } from '../constants';
import type {
  LoginRequest,
  RegisterRequest,
  ServiceMethodOptions,
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

// Simplified auth response for local auth
interface LocalAuthResponse {
  user: LocalUser;
  success: boolean;
}

export class AuthService {
  constructor() {
    // No API client needed - this only manages local state
  }

  /**
   * Login user (simplified - only sets local authentication for favorites access)
   */
  async login(credentials: LoginRequest, _options?: ServiceMethodOptions): Promise<LocalAuthResponse> {
    try {
      // Validate input
      RequestValidator.validateRequired(credentials.email, 'email');
      RequestValidator.validateRequired(credentials.password, 'password');

      if (!this.isValidEmail(credentials.email)) {
        throw new Error('Invalid email format');
      }

      // Simulate authentication - in a real app, you might validate against a local list
      // or make a simple API call that doesn't affect the main API authentication
      const user: LocalUser = {
        id: this.generateUserId(credentials.email),
        email: credentials.email,
        username: credentials.email.split('@')[0],
        firstName: credentials.email.split('@')[0],
        name: credentials.email.split('@')[0],
        verified: true,
      };

      // Store only user data for local authentication
      this.storeLocalAuthData(user);

      return {
        user,
        success: true,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(ERROR_MESSAGES.AUTH_ERROR);
    }
  }

  /**
   * Register new user (simplified - only sets local authentication for favorites access)
   */
  async register(userData: RegisterRequest, _options?: ServiceMethodOptions): Promise<LocalAuthResponse> {
    try {
      // Validate input
      RequestValidator.validateRequired(userData.email, 'email');
      RequestValidator.validateRequired(userData.password, 'password');
      RequestValidator.validateRequired(userData.confirmPassword, 'confirmPassword');

      if (!this.isValidEmail(userData.email)) {
        throw new Error('Invalid email format');
      }

      if (userData.password !== userData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (userData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Simulate registration - create local user
      const user: LocalUser = {
        id: this.generateUserId(userData.email),
        email: userData.email,
        username: userData.username || userData.email.split('@')[0],
        firstName: userData.firstName || userData.email.split('@')[0],
        name: userData.firstName || userData.username || userData.email.split('@')[0],
        verified: true,
      };

      // Store only user data for local authentication
      this.storeLocalAuthData(user);

      return {
        user,
        success: true,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(ERROR_MESSAGES.AUTH_ERROR);
    }
  }

  /**
   * Logout user (simplified - only clears local authentication state)
   */
  async logout(_options?: ServiceMethodOptions): Promise<void> {
    // Clear local authentication data
    this.clearLocalAuthData();
  }

  /**
   * Check if user is currently authenticated (locally for favorites access)
   */
  isAuthenticated(): boolean {
    const userData = this.getLocalUserData();
    return userData !== null;
  }

  /**
   * Get stored user data (local authentication only)
   */
  getCurrentUserData(): LocalUser | null {
    return this.getLocalUserData();
  }

  /**
   * Generate a simple user ID from email
   */
  private generateUserId(email: string): string {
    // Simple hash function for demo purposes
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      const char = email.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString();
  }

  /**
   * Store local authentication data
   */
  private storeLocalAuthData(user: LocalUser): void {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    // Set a simple flag to indicate local authentication
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'local_auth_active');
  }

  /**
   * Get local user data
   */
  private getLocalUserData(): LocalUser | null {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      const authFlag = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      
      // Check if both user data and auth flag exist
      if (userData && authFlag === 'local_auth_active') {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error('Failed to parse stored user data:', error);
      return null;
    }
  }

  /**
   * Clear local authentication data
   */
  private clearLocalAuthData(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    // Note: We don't remove STORAGE_KEYS.REFRESH_TOKEN as it's not used
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Create default instance (no API client needed)
export const authService = new AuthService();
