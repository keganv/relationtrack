import { createContext } from 'react';

import type { AuthFormErrors, LoginFields, NewPasswordFields, RegisterFields } from '../types/Auth.ts';
import type { User, UserFormData } from '../types/User';
import type { AxiosError } from 'axios';

export interface AuthContextValues {
  authenticated: boolean;
  checkingAuth: boolean;
  doAuthCheck: boolean;
  errors: AuthFormErrors;
  user: User | null;
  login: (data: LoginFields) => Promise<void>;
  register: (data: RegisterFields) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  sendPasswordResetLink: (data: { email: string }) => Promise<void>;
  newPassword: (data: NewPasswordFields) => Promise<void>;
  sendEmailVerificationLink: () => Promise<void>;
  updateUserField: <K extends keyof User>(field: K, value: User[K]) => void;
  saveUser: (data: UserFormData) => Promise<User | AxiosError>;
}

const AuthContext = createContext<AuthContextValues>({} as AuthContextValues);

export default AuthContext;
