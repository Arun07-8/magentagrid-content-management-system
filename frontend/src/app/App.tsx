import AppRoutes from './router/AppRoutes';
import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Toast } from '../shared/ui';

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
          <Toast />
        </ToastProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
