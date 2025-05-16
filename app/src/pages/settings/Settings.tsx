import { useState } from 'react';

import Spinner from '../../components/ui/Spinner';
import { useAuthenticatedUser } from '../../hooks/useAuthenticatedUser.ts';
import SettingsForm from './components/SettingsForm.tsx';

let renderCount = 0;

export default function Settings() {
  const [editMode, setEditMode] = useState(false);
  const user = useAuthenticatedUser();
  renderCount++;
  return user ? (
    <>
      <header className="page-header">
        <h2>Settings: {user.full_name} {renderCount}</h2>
        <button className="primary small angle-right" onClick={() => setEditMode(!editMode)}>
          Edit Settings
        </button>
      </header>
      <div className="two-col-25-75">
        <div className="section">
          {user.profile_image && 'path' in user.profile_image ? (
            <img src={`${import.meta.env.VITE_API_URL}/api/${user.profile_image.path}`}
                 alt={user.username}
                 className="avatar"/>
          ) : (
            <i className="fa-solid fa-user text-9xl text-darker-gray"></i>
          )}
        </div>
        <SettingsForm
          user={user}
          editMode={editMode}
          setEditMode={setEditMode}
        />
      </div>
      {/* <!-- End of grid --> */}
    </>
  ) : (
    <div className="flex h-screen justify-center items-center">
      <Spinner loading={!user}/>
    </div>
  );
}

