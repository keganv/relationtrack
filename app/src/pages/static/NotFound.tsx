import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="bg-main-dark-blue angle-right mt-[calc(80vh/2)] m-auto max-w-[400px] text-white text-center">
      This page does not exist. <br/>
      <Link to="/login">Login</Link> or <Link to="/">Go Home</Link>
    </div>
  );
}
