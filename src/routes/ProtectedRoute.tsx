import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';
import { PageSkeleton } from '../components/ui/PageSkeleton';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({ redirectTo = '/login' }: ProtectedRouteProps) {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    const hasSessionHint = Object.keys(localStorage).some(
      (key) => key.startsWith('sb-') && key.endsWith('-auth-token')
    );
    return <PageSkeleton showSidebar={hasSessionHint} />;
  }

  if (!currentUser) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

