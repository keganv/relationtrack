import { zodResolver } from "@hookform/resolvers/zod";
import type { MouseEvent } from 'react';
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";

import { Input } from "../components/form/Input";
import Spinner from "../components/ui/Spinner";
import useAuthContext from "../hooks/useAuthContext";
import type { LoginFields } from "../types/AuthTypes";

const schema = z.object({
  email: z.string().email('Email address is not valid.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  remember: z.boolean().nullable(),
});

type Schema = z.infer<typeof schema> & LoginFields;

export default function Login() {
  const {login, sendEmailVerificationLink, errors: apiErrors} = useAuthContext();

  const {control, register, handleSubmit, formState: {errors, isSubmitting}} = useForm<Schema>({
    defaultValues: {email: '', password: '', remember: false},
    resolver: zodResolver(schema),
  });

  const handleLogin: SubmitHandler<Schema> = async (data) => {
    await login(data);
  }

  const handleSendEmailVerificationLink = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await sendEmailVerificationLink();
  }

  return (
    <>
      <form method="POST" onSubmit={handleSubmit(handleLogin)} className="mb-4 shadow-md thick-border" noValidate>
        <Controller
          name="email"
          control={control}
          render={({field}) => (
            <Input id="email" type="email" fieldErrors={errors?.email} apiErrors={apiErrors?.email}
                   className={`${apiErrors?.email && 'error'}`} required label="Email" {...field}/>
          )}
        />
        <div className="mt-4">
          <Controller
            name="password"
            control={control}
            render={({field}) => (
              <Input id="password" type="password" fieldErrors={errors?.password} apiErrors={apiErrors?.password}
                    className={`${apiErrors?.password && 'error'}`} required label="Password" {...field}/>
            )}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="remember" className="inline">
            <input {...register("remember")} type="checkbox" name="remember" id="remember" /> Remember Me
          </label>
        </div>
        <div className="flex flex-wrap w-full items-center justify-between mt-4">
          <button type="submit" className="button primary angle-left" disabled={isSubmitting}>
            <span className={`${isSubmitting && 'mr-2'}`}>Sign in</span>
            <Spinner loading={isSubmitting}/>
          </button>
          <div className="text-right text-xs">
            <div>
              <Link to={'/forgot-password'} className="link">Forgot your password?</Link>
            </div>
            <div className="mt-1">
              No account? <Link to={'/register'} className="link">Sign up!</Link>
            </div>
          </div>
        </div>
        {apiErrors.email_verified_at === false &&
          <div className="bg-red-200 px-2 py-1 text-sm text-center">
            <p>Please verify your email address to login. A link was emailed to your inbox when you registered.</p>
            <button className="text text-sm !text-sky-700" onClick={(e) => handleSendEmailVerificationLink(e)}>
              Click here to resend the verification email.
            </button>
          </div>
        }
      </form>
    </>
  );
}
