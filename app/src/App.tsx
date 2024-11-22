import { useEffect } from 'react';
import { Outlet } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';
import useGlobalContext from './hooks/useGlobalContext.ts';
import AuthProvider from './providers/AuthProvider.tsx';
import ErrorBoundary from './components/common/ErrorBoundary.tsx';
import GlobalProvider from './providers/GlobalProvider.tsx';

export default function App() {
  const { status } = useGlobalContext();

  useEffect(() => {
    if (status) {
      status.type === 'error' ? toast.error(status.message) : toast.success(status.message);
    }
    return () => toast.dismiss();
  }, [status]);

  return (
    <>
      <GlobalProvider>
        <AuthProvider>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </AuthProvider>
      </GlobalProvider>
      <Toaster position='bottom-right' toastOptions={{ duration: 5000 }} />
    </>
  );
}
