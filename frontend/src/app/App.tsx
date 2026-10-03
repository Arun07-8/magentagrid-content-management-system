import AppRoutes from './router/AppRoutes';
import { QueryProvider } from './providers/QueryProvider';
import { Toast } from '../shared/ui';

export default function App() {
  return (
    <QueryProvider>
      <AppRoutes />
      <Toast />
    </QueryProvider>
  );
}
