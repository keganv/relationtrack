
export type AuthError = {
  firstName?: string[];
  lastName?: string[];
  email?: string[];
  password?: string[];
  username?: string[];
  passwordConfirmation?: string[];
  terms?: string[];
}

export type LoginParams = {
  email: string,
  password: string
}

export type RegisterParams = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  username: string;
  terms: string;
}

export type NewPasswordParams = {
  email: string | null;
  token: string | undefined;
  password: string;
  password_confirmation: string;
}
