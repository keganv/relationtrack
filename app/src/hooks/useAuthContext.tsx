import { useContext } from 'react';
import { AuthContext, AuthContextValues } from '../services/AuthService';

export default function useAuthContext(): AuthContextValues {
  return useContext(AuthContext)
}
