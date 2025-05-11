import { z } from 'zod';

import type { User } from './User.ts';

export type AuthState = {
  authenticated: boolean; // Defaults to false for initial page loads
  checkingAuth: boolean; // Defaults to true for initial page loads
  doAuthCheck: boolean; // Defaults to true for initial page loads
  errors: AuthApiErrors; // Used for form and API validation errors
  loading: boolean; // Defaults to false
  user: User|null;
}

export type AuthAction =
  | { type: 'SET_AUTHENTICATED'; payload: boolean; }
  | { type: 'SET_CHECKING_AUTH'; payload: boolean; }
  | { type: 'SET_ERRORS'; payload: AuthApiErrors; }
  | { type: 'SET_LOADING'; payload: boolean; }
  | { type: 'SET_USER'; payload: User|null; }
  | { type: 'LOGIN_SUCCESS'; payload: User|null; }
  | { type: 'LOGOUT'; };

export type AuthApiErrors = {
  first_name?: string[];
  last_name?: string[];
  email?: string[];
  password?: string[];
  username?: string[];
  terms?: string[];
  email_verified_at?: string | boolean;
  profile_image?: string[];
  email_frequency?: string[];
  notifications?: string[];
} | null;

export const loginFormSchema = z.object({
  email: z.string().email('Email address is not valid.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  remember: z.boolean().nullable(),
});

export type LoginFields = z.infer<typeof loginFormSchema>;

export type RegisterFields = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  username: string;
  terms: boolean;
}

export type NewPasswordFields = {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}
