import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../../features/auth';
import { Spinner } from '../../shared/ui';
import { useAuth } from '../../app/context/AuthContext';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isInitialized, isLoading } = useAuth();

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin/pages';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isInitialized, navigate, location]);

  if (!isInitialized && isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center items-center p-4">
        <Spinner fullHeight text="Checking session..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 admin-scope">
      <main className="w-full max-w-[440px] bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-zinc-200/80 p-8 sm:p-10 flex flex-col items-center">
        <div className="mb-8 flex justify-center items-center">
          <img
            src="/logo/logo.png"
            alt="Logo"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </div>
        <div className="w-full">
          <LoginForm />
        </div>
      </main>

      <footer className="w-full max-w-[440px] text-center py-6 text-xs font-medium text-zinc-400">
        <p>© {new Date().getFullYear()} CMS Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

export const LoginPage = AdminLoginPage;
