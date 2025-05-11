import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import React from 'react';
import { Controller, type FieldErrors, type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Input, RadioGroup } from '../../../components/form/Input';
import { Select } from '../../../components/form/Select';
import ImageUploader from '../../../components/ui/ImageUploader';
import Spinner from '../../../components/ui/Spinner';
import useAuthContext from '../../../hooks/useAuthContext';
import { checkFileType, removeUndefined } from '../../../lib/helpers';
import type { User } from '../../../types/User';
import { EmailFrequency } from '../../../types/UserSettings';

const createDefaultSettingsValues = (user: User) => ({
  id: user.id,
  first_name: user.first_name,
  last_name: user.last_name,
  profile_image: undefined,
  email_frequency: user.settings.email_frequency,
  notifications: user.settings.notifications ? '1' : '0',
});

const maxFileSize = 1024 * 1024; // 1MB
const settingsFormSchema = z.object({
  first_name: z.string().min(2, 'The first name must be at least 2 characters long.'),
  last_name: z.string().min(2, 'The last name must be at least 2 characters long.'),
  email_frequency: z.nativeEnum(EmailFrequency),
  notifications: z.string(),
  profile_image: z.instanceof(File)
    .refine(checkFileType)
    .refine((file) => file.size < maxFileSize, { message: 'Max 1MB upload size.' })
    .optional(),
});

type SettingsFields = z.infer<typeof settingsFormSchema>;

interface SettingsFormProps {
  user: User;
  editMode: boolean;
  setEditMode:  React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SettingsForm({ user, editMode, setEditMode }: SettingsFormProps) {
  const { saveUser, errors: apiErrors } = useAuthContext();
  const defaultValues = { ...createDefaultSettingsValues(user) };
  const {
    control, watch, handleSubmit, register, reset, setValue, formState: { errors, isSubmitting }
  } = useForm<SettingsFields>({
    defaultValues: defaultValues,
    resolver: zodResolver(settingsFormSchema),
    disabled: !editMode,
    mode: 'onBlur',
    shouldUseNativeValidation: false,
    errors: apiErrors as FieldErrors<SettingsFields>,
  });

  const handleFormSubmit: SubmitHandler<SettingsFields> = async (data) => {
    const cleaned = removeUndefined<SettingsFields>(data);
    const result = await saveUser(cleaned);
    if (!(result instanceof AxiosError) && !apiErrors) {
      setEditMode(false);
      reset({ ...createDefaultSettingsValues(result as User) });
    }
  };

  // Watch the notifications field to set the email frequency to never if notifications are disabled
  const watchNotifications = watch('notifications');
  if (watchNotifications !== '1') setValue('email_frequency', EmailFrequency.Never);

  return (
    <form method="POST"
          onSubmit={handleSubmit(handleFormSubmit)}
          encType="multipart/form-data"
          noValidate
    >
      <fieldset className="two-col">
        <Input
          {...register('first_name')}
          label="First Name"
          required={true}
          type="text"
          errors={errors.first_name}
        />
        <Input
          {...register('last_name')}
          label="Last Name"
          required={true}
          type="text"
          errors={errors.last_name}
        />
        <RadioGroup
          {...register('notifications')}
          value={user.settings.notifications ? '1' : '0'}
          label="Do you want to receive email reminders?"
          name="notifications"
          id="notifications"
          options={[
            {id: 'notifications-yes', value: '1', label: 'Yes'},
            {id: 'notifications-no', value: '0', label: 'No'},
          ]}
          errors={errors.notifications}
        />
        {watchNotifications === '1' && (
          <Select
            {...register('email_frequency')}
            label="Email Frequency"
            required={true}
            options={
              Object.entries(EmailFrequency).map(([label, value]) => ({
                label,
                value,
                disabled: false
              }))
            }
            errors={errors.email_frequency}
          />
        )}
        <div className="sm:col-span-2">
          <Controller
            name="profile_image"
            control={control}
            render={({field: {onChange, value, ref, ...field}}) => (
              <ImageUploader
                {...field}
                label="Update Profile Image"
                maxFileSize={maxFileSize}
                ref={ref}
                onChange={(files) => onChange(files[0])}
                value={value ? [value] : undefined}
                multiple={false}
                errors={errors.profile_image}
              />
            )}
          />
        </div>
      </fieldset>
      {editMode && (
        <div className="flex w-full col-span-2 justify-between border-t pt-3">
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
  );
}
