import { ApiFile } from './ApiFile';
import { Relationship } from './Relationship.ts';

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
  relationships?: Relationship[];
}

export default User;
