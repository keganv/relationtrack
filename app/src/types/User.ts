import type { ApiFile } from './ApiFile';
import type { Relationship } from './Relationship';

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
}

export type UserFormData = Partial<User> | Partial<User> & File;
