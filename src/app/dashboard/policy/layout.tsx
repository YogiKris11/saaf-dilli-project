import { PolicyHeader } from '@/components/layout/Header';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function PolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['policy']}>
        <div className="relative flex min-h-screen flex-col">
            <PolicyHeader />
            <main className="flex-1 bg-muted/20">{children}</main>
        </div>
    </ProtectedRoute>
  );
}
