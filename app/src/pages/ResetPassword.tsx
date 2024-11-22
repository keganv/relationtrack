import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import Spinner from '../components/ui/Spinner';
import useAuthContext from '../hooks/useAuthContext';
import { Input } from '../components/form/Input';
import { NewPasswordFields } from '../types/AuthTypes.ts';


const schema = z.object({
  email: z.string().email('Email address is not valid.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  password_confirmation: z.string().min(8),
  token: z.string(),
});

type Schema = z.infer<typeof schema> & NewPasswordFields;

export default function ResetPassword() {
  const { newPassword, loading, errors: apiErrors } = useAuthContext();
  const { token } = useParams();
  const [ searchParams ] = useSearchParams();

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<Schema>({
    defaultValues: { email: searchParams.get('email') ?? '', password: '', password_confirmation: '', token },
    resolver: zodResolver(schema),
  });

  const handleLogin: SubmitHandler<Schema> = async (data) => {
    await newPassword(data);
  }

  return (
    <form method="POST" onSubmit={handleSubmit(handleLogin)} className="shadow-md mb-4 thick-border" noValidate>
      <h2 className="text-center text-2xl">Reset Password</h2>
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
                  className={`${apiErrors?.password && 'error'}`} required label="New Password" {...field}/>
          )}
        />
      </div>
      <div className="mt-4">
        <Controller
          name="password_confirmation"
          control={control}
          render={({field}) => (
            <Input id="password_confirmation" type="password" fieldErrors={errors?.password}
                   required label="Confirm Password" {...field}/>
          )}
        />
      </div>
      <div className="flex flex-wrap w-full items-center justify-between mt-4">
        <button type="submit" className="button primary angle-left" disabled={loading}>
          <span className={`${loading && 'mr-sm'}`}>Reset Password</span>
          <Spinner loading={isSubmitting}/>
        </button>
      </div>
    </form>
  )
}
