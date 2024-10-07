import { createContext } from 'react';
import User from '../types/User';
import { AuthFormErrors, LoginFields, NewPasswordFields, RegisterFields, Status } from '../types/AuthTypes';

export interface AuthContextValues {
  errors: AuthFormErrors;
  user: User | null;
  login: (data: LoginFields) => Promise<void>;
  register: (data: RegisterFields) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  status: Status | null;
  sendPasswordResetLink: (data: { email: string }) => Promise<void>;
  newPassword: (data: NewPasswordFields) => Promise<void>;
  sendEmailVerificationLink: () => Promise<void>;
  setProfileImage: (image: File) => Promise<void>;
}

const AuthContext = createContext<AuthContextValues>({} as AuthContextValues);

export default AuthContext;
