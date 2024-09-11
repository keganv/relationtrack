import { createContext } from 'react';
import { AxiosResponse } from 'axios';
import User from '../types/User';
import { AuthError, LoginParams, NewPasswordParams, RegisterParams } from '../types/AuthTypes';

export interface AuthContextValues {
  csrf: () => Promise<AxiosResponse<unknown>>,
  errors: AuthError,
  user: User | null,
  login: (data: LoginParams) => Promise<void>,
  register: (data: RegisterParams) => Promise<void>,
  logout: () => Promise<void>,
  loading: boolean,
  status: string | null,
  setStatus: React.Dispatch<React.SetStateAction<string | null>>,
  statusError: string | null,
  setStatusError: React.Dispatch<React.SetStateAction<string | null>>,
  sendPasswordResetLink: (data: { email: string }) => Promise<void>,
  newPassword: (data: NewPasswordParams) => Promise<void>,
  sendEmailVerificationLink: () => Promise<void>,
  setApiFile: (image: File) => Promise<void>,
}

const AuthContext = createContext<AuthContextValues>({} as AuthContextValues);

export default AuthContext;