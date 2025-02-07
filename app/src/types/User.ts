import { ApiFile } from './ApiFile';

type User = {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  username?: string;
  email?: string;
  created_at?: string;
  id?: string;
  updated_at?: string;
  email_verified_at?: string;
  profile_image?: ApiFile;
}

export default User;
