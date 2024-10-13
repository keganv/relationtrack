
export type AuthFormErrors = {
  firstName?: string[];
  lastName?: string[];
  email?: string[];
  password?: string[];
  username?: string[];
  terms?: string[];
}

export type LoginFields = {
  email: string;
  password: string;
  remember?: boolean;
}

export type RegisterFields = {
  firstName: string;
  lastName: string;
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

export type Status = {
  type: string;
  message: string;
}
