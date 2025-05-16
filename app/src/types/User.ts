import type { NonUndefined } from 'react-hook-form';

import type { ApiFile } from './ApiFile';
import type { Relationship } from './Relationship';
import { type UserSettings } from './UserSettings';

export type User = {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  username?: string;
  email?: string;
  created_at?: string;
  id?: string;
  updated_at?: string;
  email_verified_at?: string;
  profile_image?: ApiFile|File; // ApiFile when fetched from the API, File when uploaded
  relationships?: Relationship[];
  settings: UserSettings;
}

// Partial<NonUndefined<User>>: a property can be omitted, but if present, it cannot be undefined
type UserFormBase = Omit<NonUndefined<User>, 'settings' | 'relationships'>;
export type UserFormData = Partial<UserFormBase> & UserSettings;
