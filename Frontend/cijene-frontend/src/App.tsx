import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { LanguageSelectionPopup } from './components/common/LanguageSelectionPopup';
import { AuthManager } from './components/auth/AuthManager';
import { ErrorBoundary, NotificationProvider } from './components/common';
import { GlobalErrorHandlerProvider } from './hooks/useGlobalErrorHandler';
import { AppRouter } from './config/router';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <GlobalErrorHandlerProvider>
          <LanguageProvider>
            <AuthProvider>
              <LanguageSelectionPopup />
              <AuthManager />
              <AppRouter />
            </AuthProvider>
          </LanguageProvider>
        </GlobalErrorHandlerProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;
