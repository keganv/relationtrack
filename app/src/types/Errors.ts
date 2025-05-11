import type { FieldError } from 'react-hook-form';

export type AppInputError = FieldError | string[];
export type ApiErrors = { [key: string]: string[] | string | boolean } | null;
