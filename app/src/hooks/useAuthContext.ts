import { useContext } from 'react';
import AuthContext, { AuthContextValues } from '../contexts/AuthContext';

export default function useAuthContext(): AuthContextValues {
  return useContext(AuthContext)
}
