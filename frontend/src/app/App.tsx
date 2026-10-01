import AppRoutes from './routes/AppRoutes';
import { QueryProvider } from './providers/QueryProvider';

export default function App() {
  return (
    <QueryProvider>
      <AppRoutes />
    </QueryProvider>
  );
}