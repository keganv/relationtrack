
export type AuthError = {
  name?: string[];
  email?: string[];
  password?: string[];
  username?: string[];
  password_confirmation?: string[];
  terms?: string[];
}

export type LoginParams = {
  email: string,
  password: string
}

export type RegisterParams = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  username: string;
  terms: string;
}

export type NewPasswordParams = {
  email: string | null;
  token: string | undefined;
  password: string;
  password_confirmation: string;
}