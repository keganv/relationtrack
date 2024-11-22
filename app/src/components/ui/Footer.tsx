import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="main" role="contentinfo">
      <div>
        <Link to={'/'}>Home</Link>
        <Link to={'/terms'}>Terms of Service</Link>
        <Link to={'/cookie-policy'}>Cookie Policy</Link>
      </div>
      <div>&copy; Copyright {new Date().getFullYear()} RelationTrack.com</div>
    </footer>
  );
}
