import { Link } from "react-router-dom";
import useAuthContext from "../../../hooks/useAuthContext.ts";
import {FormEvent} from "react";

export default function Banners() {
  const { logout, user } = useAuthContext();
  const handleLogout = async (e: FormEvent) => {
    e.preventDefault();
    await logout();
  }

  return (
    <div id="banners">
      <div className="banner-container">
        <div id="banner-image" className="banner-image">
          <div className="banner-content">
            <div className="banner-text">Keep track of what really matters.</div>
            <div className="banner-text mt-2"><em>Your Relationships!</em></div>
            <nav className="actions">
              {user && <>
                <Link to="/dashboard" className="button red transparent">Dashboard</Link>
                <button type="submit" className="button white transparent" onClick={handleLogout}>
                  <i className="fa-solid fa-right-from-bracket"></i> Log Out
                </button>
              </>}
              {!user && <>
                <Link to="/register" className="button red transparent">Register</Link>
                <Link to="/login" className="button white transparent">Log in</Link>
              </>}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
