import { useState } from 'react';
import { Outlet, Navigate } from 'react-router';
import MainNav from '../ui/MainNav';
import useAuthContext from '../../hooks/useAuthContext';
import RelationshipProvider from '../../providers/RelationshipProvider';

export default function AuthLayout() {
  const { user } = useAuthContext();
  const [navOpen, setNavToggle] = useState(false);

  return user ?
    (
      <RelationshipProvider>
        <div className="admin">
          <MainNav navToggled={navOpen} setNavToggle={setNavToggle} />
          <main role="main" id="main" className={navOpen ? ' ml-0 sm:ml-[250px]' : 'sm:ml-[250px]'}>
            <Outlet />
          </main>
        </div>
      </RelationshipProvider>
    ) :
    <Navigate to={'/'} />
}
