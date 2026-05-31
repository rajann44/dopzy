import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { PageSkeleton } from './components/ui/PageSkeleton';

import { LanguageProvider } from './context/LanguageContext';
import './styles/index.css';

// ── Lazy-loaded pages (code-split at route level) ────────────────────────────
// Only the LoginPage is kept eager since it's the unauthenticated entry point.
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const MyTasksPage = lazy(() => import('./pages/MyTasksPage').then(m => ({ default: m.MyTasksPage })));
const NewTaskPage = lazy(() => import('./pages/client/NewTaskPage').then(m => ({ default: m.NewTaskPage })));
const TaskDetailPage = lazy(() => import('./pages/TaskDetailPage').then(m => ({ default: m.TaskDetailPage })));
const TaskMarketplace = lazy(() => import('./pages/tasker/TaskMarketplace').then(m => ({ default: m.TaskMarketplace })));
const NotificationsPage = lazy(() => import('./pages/shared/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const ProfilePage = lazy(() => import('./pages/shared/ProfilePage').then(m => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import('./pages/shared/SettingsPage').then(m => ({ default: m.SettingsPage })));
const MessagesPage = lazy(() => import('./pages/shared/MessagesPage').then(m => ({ default: m.MessagesPage })));
const ModerationPanel = lazy(() => import('./pages/shared/ModerationPanel').then(m => ({ default: m.ModerationPanel })));

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <LanguageProvider>
          <AppProvider>
            <AuthProvider>
              <Suspense fallback={<PageSkeleton />}>
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
              </Suspense>
            </AuthProvider>
          </AppProvider>
        </LanguageProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
