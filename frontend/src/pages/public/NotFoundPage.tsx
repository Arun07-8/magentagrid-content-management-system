import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { PublicLayout } from '../../widgets';
import { Button } from '../../shared/ui';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 text-center bg-white">
        <div className="max-w-md w-full space-y-6">
          <div className="w-16 h-16 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900 flex items-center justify-center mx-auto text-xl font-bold shadow-xs">
            404
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
              Page not found
            </h1>
            <p className="text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed">
              The page you are looking for doesn&apos;t exist, has been removed, or has moved to another address.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => navigate('/')}
              leftIcon={<Home className="w-4 h-4" />}
            >
              Back to Home
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.history.back()}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Go Back
            </Button>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}

