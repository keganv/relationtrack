import { FormEvent, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import User from "../../types/User.ts";
import useAuthContext from '../../hooks/useAuthContext';

interface MainNavProps { user: User }

export default function MainNav({user}: MainNavProps) {
    const profileImageInput = useRef<HTMLInputElement>(null);
    const {logout, setProfileImage} = useAuthContext();
    const handleLogout = async (e: FormEvent) => {
        e.preventDefault();
        logout();
    }
    const handleProfileImage = (image: File) => setProfileImage(image);

    return (
        <aside className="main">
            <img src="/images/logo-md.png" alt="Relation Track" className="logo"/>
            <i id="menu-icon" className="fa-sharp fa-solid fa-bars"></i>
            <div id="user-menu">
                <div className="profile-image">
                    {!user.profile_image && <i className="fa-solid fa-user"></i>}
                    {user.profile_image &&
                      <img src={`${import.meta.env.VITE_BACKEND_URL_LOCAL}/api/${user.profile_image.path}`}
                           alt={user.username}/>
                    }
                    <button type="button" id="edit-profile-image" title="Edit Profile Image"
                            onClick={() => profileImageInput?.current?.click()}>
                        <i className="fa-solid fa-pencil"></i>
                    </button>
                </div>
                <div className="username">
                    {user.username}
                </div>
                <nav className="main mt" role="navigation">
                    <ul className="u-list">
                        <li>
                            <NavLink to="/dashboard">
                                <i className="fa-solid fa-gauge"></i>
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/relationships">
                                <i className="fa-solid fa-user-group"></i>
                                Relationships
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/settings">
                                <i className="fa-solid fa-gear"></i>
                                Settings
                            </NavLink>
                        </li>
                        <li>
                            <button type="submit" className="text" onClick={handleLogout}>
                                <i className="fa-solid fa-right-from-bracket"></i>
                                Log Out
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
            <input ref={profileImageInput}
                   type="file"
                   name="profile_image"
                   id="profile-image-input"
                   accept="image/*"
                   hidden
                   onChange={(event) => event.target.files?.length ? handleProfileImage(event.target.files[0]) : null}
            />
        </aside>
    );
}
