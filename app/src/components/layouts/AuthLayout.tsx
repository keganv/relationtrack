import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import MainNav from '../ui/MainNav';
import useAuthContext from '../../hooks/useAuthContext';

export default function AuthLayout() {
  const { user } = useAuthContext();
  const [navOpen, setNavOpen] = useState(true);

  return user ?
    (
      <div className="admin">
        <MainNav navOpen={navOpen} setNavOpen={setNavOpen} />
        <main role="main" id="main" className={navOpen ? ' ml-0 sm:ml-[250px]' : 'sm:ml-[250px]'}>
          <Outlet />
        </main>
      </div>
    ) :
    <Navigate to={'/'} />
}
