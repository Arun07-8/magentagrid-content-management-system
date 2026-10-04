import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../entities/user';
import { Spinner } from '../../shared/ui';
import type { UserRole } from '../../shared/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role, isInitialized, isLoading } = useUserStore();
  const location = useLocation();

  // Wait until server session restoration completes before making any redirect decisions
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <Spinner fullHeight text="Restoring session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/admin/posts" replace />;
  }

  return <>{children}</>;
}
