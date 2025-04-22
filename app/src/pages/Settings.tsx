import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { z } from 'zod';

import ImageUploader from '../components/ui/ImageUploader';
import Spinner from '../components/ui/Spinner';
import useAuthContext from '../hooks/useAuthContext';
import { checkFileType } from '../lib/helpers';

const settingsFormSchema = z.object({
  id: z.string().uuid(),
  profile_image: z.instanceof(File)
    .refine(checkFileType)
    .refine((file) => file.size < 1048576, { message: 'Max 1MB upload size.' })
    .optional(),
});

type SettingsFields = z.infer<typeof settingsFormSchema>;

export default function Settings() {
  const [editMode, setEditMode] = useState(false);
  const { control, handleSubmit, register } = useForm<SettingsFields>({ resolver: zodResolver(settingsFormSchema) });
  const { saveUser, user } = useAuthContext();

  const handleFormSubmit: SubmitHandler<SettingsFields> = async (data) => {
    await saveUser(data);
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
        <fieldset className="section" disabled={!editMode}>
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
                  ref={ref}
                  onChange={(file) => onChange(file[0])}
                  value={value ? [value] : undefined}
                  multiple={false}
                  errors={[
                    fieldState.error?.message ?? ''
                  ]}
                />
              )}
            />
          )}
          <input type="hidden" value={user.id} {...register('id')} />
        </fieldset>
        {editMode  && (
          <div className="flex justify-between mt-2 col-span-3">
            <button type="submit" className="primary mt angle-right">
              {'Save Settings'} <Spinner loading={false} className="ml-2"/>
            </button>
            <button
              id="cancel-edit-button"
              type="button"
              className="transparent angle-left text-white"
              onClick={() => setEditMode(false)}>
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

