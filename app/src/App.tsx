import { Outlet } from 'react-router';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './providers/AuthProvider.tsx';
import ErrorBoundary from './components/common/ErrorBoundary.tsx';
import GlobalProvider from './providers/GlobalProvider.tsx';

export default function App() {
  return (
    <>
      <GlobalProvider>
        <AuthProvider>
          <ErrorBoundary>
            <Outlet />
            <Toaster position='bottom-right' toastOptions={{ duration: 5000 }} />
          </ErrorBoundary>
        </AuthProvider>
      </GlobalProvider>
    </>
  );
}
