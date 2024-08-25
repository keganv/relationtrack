import { Outlet, Navigate } from 'react-router-dom';
import MainNav from '../ui/MainNav';
import useAuthContext from '../../hooks/useAuthContext';

export default function AuthLayout() {
  const { user } = useAuthContext();

  return user ?
    (
      <div className="admin flex align-items-stretch">
        <MainNav user={user} />
        <main role="main" id="main">
          <Outlet />
        </main>
      </div>
    ) :
    <Navigate to={'/login'} />
}
