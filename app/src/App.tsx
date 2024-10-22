import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import AuthLayout from './components/layouts/AuthLayout';
import GuestLayout from './components/layouts/GuestLayout';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Home from './pages/static/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import useAuthContext from './hooks/useAuthContext';
import CookiePolicy from './pages/static/CookiePolicy';
import Terms from './pages/static/Terms';
import RelationshipIndex from './pages/relationships/RelationshipIndex';
import RelationshipView from './pages/relationships/RelationshipView';
import RelationshipOutlet from './pages/relationships/RelationshipOutlet';
import NotFound from './pages/static/NotFound';

export default function App() {
  const { status } = useAuthContext();

  useEffect(() => {
    if (status) {
      status.type === 'error' ? toast.error(status.message) : toast.success(status.message);
    }
    return () => toast.dismiss();
  }, [status]);

  return (
    <>
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
        {/* 404 Page */}
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Toaster position='bottom-right' toastOptions={{ duration: 5000 }} />
    </>
  );
}
