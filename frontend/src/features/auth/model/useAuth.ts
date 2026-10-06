import { useNavigate } from 'react-router-dom';
import { useAuth as useAuthContext } from '../../../app/context/AuthContext';

export const useAuth = () => {
  const navigate = useNavigate();
  const auth = useAuthContext();

  const handleLogin = async (credentials: { email: string; password: string }) => {
    const res = await auth.login(credentials);
    navigate('/admin/pages');
    return res;
  };

  const handleLogout = async () => {
    await auth.logout();
    navigate('/admin/login');
  };

  return {
    ...auth,
    login: handleLogin,
    logout: handleLogout,
  };
};
