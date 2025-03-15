import type { FormEvent } from "react";
import { Link } from "react-router";

import useAuthContext from "../../../hooks/useAuthContext.ts";

export default function HomeNav() {
  const { logout, user } = useAuthContext();

  const handleLogout = async (e: FormEvent) => {
    e.preventDefault();
    await logout();
  }

  return (
    <nav role="navigation" className="main">
      {user &&
        <ul className="text-xs md:text-base">
          <li className="mr-4">
            <Link to={'/dashboard'}>Dashboard</Link>
          </li>
          <li>
            <a type="submit" className="cursor-pointer" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i> Log Out
            </a>
          </li>
        </ul>}
      {!user &&
        <ul>
          <li>
            <Link to={'/register'}>Register</Link>
          </li>
          <li>
            <Link to={'/login'}>Log In</Link>
          </li>
        </ul>}
    </nav>
  );
}
