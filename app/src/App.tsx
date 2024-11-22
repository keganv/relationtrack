import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
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

/*
      <Routes>
        <Route path='/' element={<Home />} />
        <Route element={<AuthLayout />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path="/relationships" element={<RelationshipOutlet />}>
            <Route index element={<RelationshipIndex />} />
            <Route path=":id" element={<RelationshipView />} />
          </Route>
        </Route>
        <Route element={<GuestLayout />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/password-reset/:token' element={<ResetPassword />} />
          <Route path='/cookie-policy' element={<CookiePolicy />} />
          <Route path='/terms' element={<Terms />} />
        </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>
 */
