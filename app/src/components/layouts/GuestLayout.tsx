import {Link, Outlet} from 'react-router-dom';

export default function GuestLayout() {
  return (
    <div className="flex column vh-100 light-blue align-middle justify-center">
      <div className="col-6 col-12-sm text-center mte mb">
        <Link to={'/'}>
          <img src="/images/logo-lg.png" className="col-9" alt="Relation Track" />
        </Link>
      </div>
      <section className="col-6 col-10-sm dark-blue pa mb">
        <div className="white pa">
          <Outlet />
        </div>
      </section>
      <footer role="contentinfo" className="col-6 col-12-sm mb text-center font-sm">
        <div className="text-white">
          <Link to={'/'} className="text-white pl-sm pr-sm">Home</Link>
          <Link to={'/terms'} className="text-white pl-sm pr-sm">Terms of Service</Link>
          <Link to={'/cookie-policy'} className="text-white pl-sm pr-sm">Cookie Policy</Link>
        </div>
        <div className="text-white mt-sm">
          &copy; Copyright {new Date().getFullYear()} RelationTrack.com
        </div>
      </footer>
    </div>
  );
}
