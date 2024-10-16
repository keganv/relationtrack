import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Spinner from "../components/ui/Spinner";
import useAuthContext from "../hooks/useAuthContext";
import { Input } from "../components/form/Input";
import { LoginFields } from "../types/AuthTypes.ts";

const schema = z.object({
  email: z.string().email('Email address is not valid.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  remember: z.boolean().nullable(),
});

type Schema = z.infer<typeof schema> & LoginFields;

export default function Login() {
  const { login, loading, errors: apiErrors } = useAuthContext();

  const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Schema>({
    defaultValues: { email: '', password: '', remember: false },
    resolver: zodResolver(schema),
  });

  const handleLogin: SubmitHandler<Schema> = async (data) => {
    await login(data);
  }

  return (
    <form method="POST" onSubmit={handleSubmit(handleLogin)} className="p-4" noValidate>
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
        <button type="submit" className="button primary angle-left" disabled={loading}>
          <span className={`${loading && 'mr-sm'}`}>Sign in</span>
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
    </form>
  );
}
