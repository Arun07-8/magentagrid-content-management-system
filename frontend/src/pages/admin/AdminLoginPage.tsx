import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../../features/auth';
import { Logo, Spinner } from '../../shared/ui';
import { useUserStore } from '../../entities/user';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isInitialized, isLoading } = useUserStore();

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin/posts';
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
      <main className="w-full max-w-[440px] bg-white rounded-xl shadow-sm border border-zinc-200 p-8 sm:p-10 flex flex-col">
        <div className="mb-8 flex justify-center">
          <Logo />
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
