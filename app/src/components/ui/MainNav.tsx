import { FormEvent, useRef, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import useAuthContext from '../../hooks/useAuthContext';

type MainNavProps = {
  navOpen: boolean;
  setNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MainNav({ navOpen, setNavOpen }: MainNavProps) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const profileImageInput = useRef<HTMLInputElement>(null);
  const { logout, setProfileImage, user } = useAuthContext();

  const handleLogout = async (e: FormEvent) => {
    e.preventDefault();
    await logout();
  }
  const handleProfileImage = (image: File) => setProfileImage(image);

  return user && (
    <>
      <header className="main !px-3 !py-0" role="banner">
        <div className="flex flex-row w-full justify-between items-center">
          <button className="main-sidebar-btn" type="button" onClick={() => setNavOpen(!navOpen)}
                  data-drawer-target="main-sidebar" data-drawer-toggle="main-sidebar" aria-controls="main-sidebar">
            <span className="sr-only">Open sidebar</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
            </svg>
          </button>
          <Link to="/">
            <img src="/images/logo-sm.png" alt="Relation Track" className="logo h-6" />
          </Link>
          <div id="user-dropdown-container" className="flex items-center">
            <button type="button" onClick={() => setUserDropdownOpen(!userDropdownOpen)} aria-expanded={userDropdownOpen ? 'true' : 'false'} data-dropdown-toggle="user-dropdown">
              <span className="sr-only">Open user menu</span>
              {!user.profile_image ? (
                // <i className="fa-solid fa-user avatar"></i>
                <img src="https://www.keganv.com/wp-content/themes/keganv3.0/img/keganv-profile.png" className="avatar" />
              ) : (
                <img src={`${import.meta.env.VITE_API_URL}/api/${user.profile_image.path}`} alt={user.username} className="avatar" />
              )}
            </button>
            <div id="user-dropdown" className={!userDropdownOpen ? 'hidden ' : ''} onMouseLeave={() => setUserDropdownOpen(false)}>
              <div className="px-3 py-2 border-b border-gray-300" role="none">
                <p className="text-sm text-gray-900" role="none">
                  { user.full_name }
                </p>
                <p className="text-sm font-medium text-gray-900 truncate" role="none">
                  { user.email }
                </p>
              </div>
              <ul role="none">
                <li>
                  <Link to="#" role="menuitem">Settings</Link>
                </li>
                <li>
                  <Link to="#" role="menuitem" onClick={handleLogout}>Logout</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <aside id="main-sidebar" aria-label="Sidebar" className={navOpen ? '' : '-translate-x-full'}>
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul>
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                <i className="fa-solid fa-gauge"></i>
                <span className="ms-3">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/relationships">
                <i className="fa-solid fa-user-group"></i>
                <span className="flex-1 ms-3 whitespace-nowrap">Relationships</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
    </>
    // <aside className="bg-main-darker-blue fixed top-0 left-0 h-screen w-full sm:w-[150px] p-4 flex flex-col">
    //   <div className="flex justify-between items-center sm:block">
    //     <img src="/images/logo-md.png" alt="Relation Track" className="logo w-10 h-10 sm:w-auto sm:h-auto" />
    //     
    //   </div>
    //   <div id="user-menu" className={`${isOpen ? 'block' : 'hidden'} sm:block mt-4`}>
    //     <div className="profile-image mb-4">
    //       {!user.profile_image ? (
    //         <i className="fa-solid fa-user text-white"></i>
    //       ) : (
    //         <img
    //           src={`${import.meta.env.VITE_API_URL}/api/${user.profile_image.path}`}
    //           alt={user.username}
    //           className="w-10 h-10 rounded-full"
    //         />
    //       )}
    //       <button
    //         type="button"
    //         id="edit-profile-image"
    //         title="Edit Profile Image"
    //         onClick={() => profileImageInput?.current?.click()}
    //         className="text-white"
    //       >
    //         <i className="fa-solid fa-pencil"></i>
    //       </button>
    //     </div>
    //     <div className="username text-white">{user.username}</div>

    //   <input
    //     ref={profileImageInput}
    //     type="file"
    //     name="profile_image"
    //     id="profile-image-input"
    //     accept="image/*"
    //     hidden
    //     onChange={(event) =>
    //       event.target.files?.length ? handleProfileImage(event.target.files[0]) : null
    //     }
    //   />
  );
}
