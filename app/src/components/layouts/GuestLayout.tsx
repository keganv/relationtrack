import { Link, Outlet } from 'react-router-dom';
import ApplicationLogo from '../ui/ApplicationLogo.tsx';

export default function GuestLayout() {
  return (
    <div className="flex h-dvh align-middle content-center">
      <Link to="/">
        <ApplicationLogo className="max-w-[400px]" />
      </Link>
      <Outlet />
      <footer role="contentinfo" className="col-6 col-12-sm mb text-center font-sm">
        <div className="text-white">
          <Link to="/">Home</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/cookie-policy">Cookie Policy</Link>
        </div>
        <div className="text-white mt-sm">
          &copy; Copyright {new Date().getFullYear()} RelationTrack.com
        </div>
      </footer>
    </div>
  );
}
