import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { z } from 'zod';

import ImageUploader from '../components/ui/ImageUploader';
import Spinner from '../components/ui/Spinner';
import useAuthContext from '../hooks/useAuthContext';
import { checkFileType, removeUndefined } from '../lib/helpers';

const maxFileSize = 1024 * 1024; // 1MB
const settingsFormSchema = z.object({
  id: z.string().uuid(),
  profile_image: z.instanceof(File)
    .refine(checkFileType)
    .refine((file) => file.size < maxFileSize, { message: 'Max 1MB upload size.' })
    .optional(),
});

type SettingsFields = z.infer<typeof settingsFormSchema>;

export default function Settings() {
  const { saveUser, user, errors: apiErrors } = useAuthContext();
  const [editMode, setEditMode] = useState(false);

  const { control, handleSubmit, register, reset, formState: { isSubmitting } } = useForm<SettingsFields>({
    defaultValues: { id: user?.id },
    resolver: zodResolver(settingsFormSchema)
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
      <form className="grid sm:grid-cols-3 sm:gap-3 grid-cols-1 gap-1 bg-transparent p-0"
            method="POST"
            onSubmit={handleSubmit(handleFormSubmit)}
            noValidate
            encType="multipart/form-data">
        <fieldset className="section col-span-1" disabled={!editMode}>
          <div className="flex justify-center w-full">
            {user.profile_image && 'path' in user.profile_image ? (
              <img src={`${import.meta.env.VITE_API_URL}/api/${user.profile_image.path}`} alt={user.username}
                   className="avatar"/>
            ) : (
              <i className="fa-solid fa-user text-9xl text-darker-gray"></i>
            )}
          </div>
          {editMode && (
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
          )}
          <input type="hidden" value={user.id} {...register('id')} />
        </fieldset>
        {editMode  && (
          <div className="flex justify-between mt-2 col-span-3">
            <button type="submit" className="primary mt angle-right" disabled={isSubmitting}>
              Save Settings <Spinner loading={false} className="ml-2"/>
            </button>
            <button
              id="cancel-edit-button"
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
    </>
  ) : (
    <div className="flex h-screen justify-center items-center">
      <Spinner loading={!user}/>
    </div>
  );
}

