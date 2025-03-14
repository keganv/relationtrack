import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router';

import useAuthContext from '../../hooks/useAuthContext';
import useGlobalContext from '../../hooks/useGlobalContext';
import RelationshipProvider from '../../providers/RelationshipProvider';
import MainNav from '../ui/MainNav';
import Spinner from '../ui/Spinner.tsx';

export default function AuthLayout() {
  const { authenticated, checkingAuth, doAuthCheck } = useAuthContext();
  const { setStatus } = useGlobalContext();
  const [navOpen, setNavToggle] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkingAuth && !authenticated && doAuthCheck) {
      setStatus({ type: 'error', message: 'You must be logged in.' });
      navigate('/login');
    }
  }, [checkingAuth, authenticated, doAuthCheck, setStatus, navigate]);

  if (checkingAuth && !authenticated) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Spinner loading={!authenticated}/>
      </div>
    );
  }

  return authenticated ? (
    <RelationshipProvider>
      <div className="admin">
        <MainNav navToggled={navOpen} setNavToggle={setNavToggle} />
        <main role="main" id="main" className={navOpen ? 'ml-0 sm:ml-[250px]' : 'sm:ml-[250px]'}>
          <Outlet />
        </main>
      </div>
    </RelationshipProvider>
  ) : null
}
