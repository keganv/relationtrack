import { Link, Outlet } from 'react-router-dom';
import ApplicationLogo from '../ui/ApplicationLogo.tsx';

export default function GuestLayout() {
  return (
    <div className="flex flex-col justify-center min-h-screen w-[80vw] lg:w-[60vw] m-auto py-4">
      <Link to="/">
        <ApplicationLogo className="max-w-[400px] m-auto mb-4"/>
      </Link>
      <Outlet/>
      <footer role="contentinfo" className="text-center text-xs">
        <div className="mb-1 text-white">
          <Link to="/">Home</Link>
          <Link to="/terms" className="ml-2 mr-2">Terms of Service</Link>
          <Link to="/cookie-policy">Cookie Policy</Link>
        </div>
        <div className="text-white">
          &copy; Copyright {new Date().getFullYear()} RelationTrack.com
        </div>
      </footer>
    </div>
  );
}
