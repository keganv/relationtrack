import type { User } from '../types/User';
import useAuthContext from './useAuthContext.ts';

export function useAuthenticatedUser(): User {
  const { user } = useAuthContext();

  if (!user) {
    throw new Error('User is not authenticated!');
  }

  return user
}
