import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useUserStore } from '../../../entities/user';

export const useAuth = () => {
  const navigate = useNavigate();
  const { setAuth, logout, user, isAuthenticated, role } = useUserStore();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      navigate('/admin/dashboard');
    },
  });

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      logout();
      navigate('/admin/login');
    }
  };

  return {
    login: loginMutation.mutateAsync,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    logout: handleLogout,
    user,
    isAuthenticated,
    role,
  };
};
