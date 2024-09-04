import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import AuthLayout from './components/layouts/AuthLayout'
import GuestLayout from './components/layouts/GuestLayout'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard';
import Home from './pages/static/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import useAuthContext from './hooks/useAuthContext';
import CookiePolicy from './pages/static/CookiePolicy';
import Terms from './pages/static/Terms';
import RelationshipIndex from './pages/relationships/RelationshipIndex';
import RelationshipView from './pages/relationships/RelationshipView';
import RelationshipOutlet from './pages/relationships/RelationshipOutlet';

export default function App() {
  const { status, statusError, user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (status) {
      toast.success(status);
    }
  }, [status]);

  useEffect(() => {
    if (statusError) {
      toast.error(statusError);
    }
  }, [statusError]);

  useEffect(() => {
    // Redirect if the user is not logged in and they are not on the login or register pages
    if (!user && !['/login', '/register', '/forgot-password', '/password-reset/:token'].includes(location.pathname)) {
      navigate('/', { replace: true });
    }
  }, [user, location.pathname, navigate]);

  return <>
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
    </Routes>
    <Toaster
      position='top-right'
      toastOptions={{ duration: 5000 }}
    />
  </>
}
