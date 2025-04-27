import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { z } from 'zod';

import { Input } from '../components/form/Input.tsx';
import ImageUploader from '../components/ui/ImageUploader';
import Spinner from '../components/ui/Spinner';
import useAuthContext from '../hooks/useAuthContext';
import { checkFileType, removeUndefined } from '../lib/helpers';
import type { User } from '../types/User';
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser.ts';

const maxFileSize = 1024 * 1024; // 1MB
const settingsFormSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string().min(2, 'The first name must be at least 2 characters long.'),
  last_name: z.string().min(2, 'The last name must be at least 2 characters long.'),
  profile_image: z.instanceof(File)
    .refine(checkFileType)
    .refine((file) => file.size < maxFileSize, { message: 'Max 1MB upload size.' })
    .optional(),
});

const createDefaultSettingsValues = (user: User) => ({
  id: user.id,
  first_name: user.first_name,
  last_name: user.last_name,
  profile_image: undefined,
});

type SettingsFields = z.infer<typeof settingsFormSchema>;

export default function Settings() {
  const { saveUser, errors: apiErrors } = useAuthContext();
  const [editMode, setEditMode] = useState(false);
  const user = useAuthenticatedUser();
  const defaultValues = { ...createDefaultSettingsValues(user) };
  const { control, handleSubmit, register, reset, formState: { isSubmitting } } = useForm<SettingsFields>({
    defaultValues: defaultValues,
    resolver: zodResolver(settingsFormSchema),
    disabled: !editMode,
  });

  const handleFormSubmit: SubmitHandler<SettingsFields> = async (data) => {
    const cleaned = removeUndefined<SettingsFields>(data);
    const result = await saveUser(cleaned);
    if (!(result instanceof AxiosError) && !apiErrors) {
      setEditMode(false);
      reset(); // Reset the form after a successful save.
    }
  };

  return user ? (
    <>
      <header className="page-header">
        <h2>Settings: {user.full_name}</h2>
        <button className="primary small angle-right" onClick={() => setEditMode(!editMode)}>
          Edit Settings
        </button>
      </header>
      <form className="bg-transparent w-full grid sm:grid-cols-3 md:grid-cols-5 grid-cols-1 gap-3 place-items-start p-0"
            method="POST"
            onSubmit={handleSubmit(handleFormSubmit)}
            noValidate
            encType="multipart/form-data">
        <div className="section col-span-5 sm:col-span-1">
          {user.profile_image && 'path' in user.profile_image ? (
            <img src={`${import.meta.env.VITE_API_URL}/api/${user.profile_image.path}`} alt={user.username}
                 className="avatar"/>
          ) : (
            <i className="fa-solid fa-user text-9xl text-darker-gray"></i>
          )}
        </div>
        <fieldset className="section w-full col-span-5 sm:col-span-4 !mt-0">
          <Input label="First Name" required={true} {...register('first_name')} />
          <Input label="Last Name" required={true} {...register('last_name')} />
          {editMode && (
            <>
              <Controller
                name="profile_image"
                control={control}
                render={({field: {onChange, value, ref, ...field}, fieldState}) => (
                  <ImageUploader
                    {...field}
                    label="Update Profile Image"
                    maxFileSize={maxFileSize}
                    ref={ref}
                    onChange={(files) => onChange(files[0])}
                    value={value ? [value] : undefined}
                    multiple={false}
                    errors={fieldState.error?.message ? [fieldState.error.message] : null}
                  />
                )}
              />
              <input type="hidden" value={user.id} {...register('id')} />
            </>
          )}
        </fieldset>
        {editMode && (
          <div className="section w-full justify-between col-span-5 !mt-0">
            <button type="submit" className="primary mt angle-right" disabled={isSubmitting}>
              Save Settings <Spinner loading={false} className="ml-2"/>
            </button>
            <button id="cancel-edit-button"
                    type="button"
                    className="transparent angle-left text-white"
                    onClick={() => {
                      setEditMode(false);
                      reset();
                    }}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
      {/* <!-- End of grid --> */}
    </>
  ) : (
    <div className="flex h-screen justify-center items-center">
      <Spinner loading={!user}/>
    </div>
  );
}

