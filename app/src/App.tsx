import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router';

import AuthProvider from './providers/AuthProvider.tsx';
import GlobalProvider from './providers/GlobalProvider.tsx';

function fallbackRender({ error }: FallbackProps) {
  // TODO implement resetErrorBoundary, refer to docs

  return (
    <h1 className="bg-main-dark-blue angle-right mt-[calc(80vh/2)] m-auto w-[400px] text-white text-center">
      {error?.message || 'We\'re sorry. Something went wrong.'}
    </h1>
  );
}

export default function App() {
  return (
    <>
      <GlobalProvider>
        <AuthProvider>
          <ErrorBoundary fallbackRender={fallbackRender}>
            <Outlet />
            <Toaster position='bottom-right' toastOptions={{ duration: 5000 }} />
          </ErrorBoundary>
        </AuthProvider>
      </GlobalProvider>
    </>
  );
}
