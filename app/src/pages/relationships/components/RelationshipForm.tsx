import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Controller, type FieldErrors, type SubmitHandler, useForm } from 'react-hook-form';

import FormFieldError from '../../../components/form/FormFieldError';
import { Input } from '../../../components/form/Input';
import ImageUploader from '../../../components/ui/ImageUploader';
import Spinner from '../../../components/ui/Spinner';
import useRelationshipContext from '../../../hooks/useRelationshipContext';
import { removeUndefined } from '../../../lib/helpers.ts';
import { type Relationship, type RelationshipFormData, relationshipFormSchema } from '../../../types/Relationship';

type RelationshipFormProps = {
  relationship?: Relationship;
  cancel: () => void;
};

const defaultForm = { type: '', name: '', title: '', health: 6, description: '' };

export default function RelationshipForm({ relationship, cancel }: RelationshipFormProps) {
  const { types, save, formErrors: apiErrors, convertRelationshipToFormData, setFormErrors } = useRelationshipContext();

  // This is also what resets the form on a rerender, (e.g. cancel() which closes the form)
  const initialForm: RelationshipFormData = relationship ?
    { ...convertRelationshipToFormData(relationship) } :
    defaultForm;

  const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RelationshipFormData>({
    defaultValues: initialForm,
    resolver: zodResolver(relationshipFormSchema),
    errors: apiErrors as FieldErrors<RelationshipFormData>,
  });

  const handleFormSubmit: SubmitHandler<RelationshipFormData> = async (data) => {
    const cleaned = removeUndefined<RelationshipFormData>(data);
    const response = await save(cleaned);
    if (!(response instanceof AxiosError) && !apiErrors) {
      cancel(); // Close the form after a successful save.
    }
  }

  if (!types?.length) {
    return <Spinner loading={true}></Spinner>
  }

  return (
    <>
      <form method="POST" encType="multipart/form-data" id="relationship-form"
            onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <fieldset>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col items-start">
              <Controller
                name="type"
                control={control}
                render={({field}) => (
                  <>
                    <label htmlFor="type">Type <span className="red">*</span></label>
                    <select id="type" className="block w-full" autoFocus required aria-label="type" {...field}>
                      <option value=''>Select</option>
                      {types && types.map((type) => (
                        <option key={type.id} value={type.id}>{type.type}</option>
                      ))}
                    </select>
                    {errors?.type && <div className="error">{errors.type.message}</div>}
                    {apiErrors?.type && <div className="error">{apiErrors.type}</div>}
                  </>
                )}
              />
            </div>
            <div>
              <Controller
                name="name"
                control={control}
                render={({field}) => (
                  <Input type="text"
                         label="Name"
                         required
                         errors={errors.name}
                         {...field}
                  />
                )}/>
            </div>
            <div>
              <Controller
                name="title"
                control={control}
                render={({field}) => (
                  <Input type="text"
                         label="Title"
                         required
                         errors={errors.title}
                         {...field}
                  />
                )}/>
            </div>
            <div>
              <Controller
                name="birthday"
                control={control}
                render={({field}) => (
                  <Input type="date"
                         label="Birthday"
                         errors={errors.birthday}
                         {...field} />
                )}/>
            </div>
            <div>
              <Input
                {...register('health')}
                label="Relationship Health"
                className="range mt"
                title="Rate the current health of this relationship."
                required={true}
                type="range"
                min="1"
                max="10"
              />
              <div className="flex my-1 justify-between">
                <i className="fa-regular fa-face-sad-tear"></i>
                <i className="fa-regular fa-face-frown"></i>
                <i className="fa-regular fa-face-meh"></i>
                <i className="fa-regular fa-face-smile"></i>
                <i className="fa-regular fa-face-laugh"></i>
              </div>
              {errors?.health && <FormFieldError errors={errors.health} />}
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                className="block mt-1 w-full max-h-[100px] [field-sizing:content]"
                {...register('description')}
              />
              {errors?.description && <div className="error">{errors.description.message}</div>}
              {apiErrors?.description && <span className="error">{apiErrors.description}</span>}
            </div>
          </div>
          <div className="mt-4">
            <Controller
              name="images"
              control={control}
              render={({field: {onChange, value, ref, ...field}, fieldState}) => (
                <ImageUploader
                  {...field}
                  maxFileSize={1024 * 1024}
                  ref={ref}
                  onChange={(files) => {
                    onChange(files);
                    setFormErrors(null); // Reset the API Errors when the images are changed
                  }}
                  value={value}
                  errors={[
                    ...(apiErrors?.images ?? []),
                    ...(
                      Object.keys(apiErrors ?? {})
                        .filter((key: string) => key.startsWith('images.'))
                        .flatMap((key: string) => apiErrors?.[key as keyof typeof apiErrors[`images.${number}`]] ?? [])
                    ),
                    fieldState.error?.message ?? ''
                  ]}
                />
              )}
            />
          </div>
        </fieldset>
        <div className="flex justify-between mt-2">
          <button type="submit" className="primary mt angle-right">
            {relationship ? 'Update' : 'Create'} <Spinner loading={isSubmitting} className="ml-2"/>
          </button>
          <button id="cancel-edit-button" type="button" className="transparent angle-left text-white" onClick={cancel}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
