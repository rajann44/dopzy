import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { MyTasksPage } from './pages/MyTasksPage';
import { NewTaskPage } from './pages/client/NewTaskPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { TaskMarketplace } from './pages/cotasker/TaskMarketplace';
import { NotificationsPage } from './pages/shared/NotificationsPage';
import { ProfilePage } from './pages/shared/ProfilePage';
import { SettingsPage } from './pages/shared/SettingsPage';
import { MessagesPage } from './pages/shared/MessagesPage';
import { ModerationPanel } from './pages/shared/ModerationPanel';

import { LanguageProvider } from './context/LanguageContext';
import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <LanguageProvider>
          <AppProvider>
            <AuthProvider>
              <Routes>
                {/* Public */}
                <Route path="/login" element={<LoginPage />} />

              {/* Private Unified Workspace Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  {/* Default entry redirects to Browse Tasks */}
                  <Route path="/" element={<Navigate to="/browse" replace />} />
                  
                  {/* Marketplace & Browsing */}
                  <Route path="/browse" element={<TaskMarketplace />} />
                  
                  {/* Task Management */}
                  <Route path="/my-tasks" element={<MyTasksPage />} />
                  <Route path="/tasks/new" element={<NewTaskPage />} />
                  <Route path="/tasks/:id" element={<TaskDetailPage />} />
                  
                  {/* Shared authenticated routes */}
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/messages" element={<MessagesPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/profile/:id" element={<ProfilePage />} />
                  <Route path="/admin/moderation" element={<ModerationPanel />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </AuthProvider>
          </AppProvider>
        </LanguageProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
