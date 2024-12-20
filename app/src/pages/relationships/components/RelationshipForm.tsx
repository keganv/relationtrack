import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { relationshipFormSchema, RelationshipFormData, Relationship } from '../../../types/Relationship';
import useRelationshipContext from '../../../hooks/useRelationshipContext';
import ImageUploader from '../../../components/ui/ImageUploader';
import Spinner from '../../../components/ui/Spinner';
import { Input } from '../../../components/form/Input';
import { removeUndefined } from '../../../lib/helpers.ts';

type RelationshipFormProps = {
  relationship?: Relationship;
  cancel: () => void;
};

const defaultForm = { type: '', name: '', title: '', health: 6, description: '' };

export default function RelationshipForm({ relationship, cancel }: RelationshipFormProps) {
  const { types, save, formErrors: apiErrors, convertRelationshipToFormData } = useRelationshipContext();

  const initialForm: RelationshipFormData = relationship ?
    { ...convertRelationshipToFormData(relationship) } :
    defaultForm;

  const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RelationshipFormData>({
    defaultValues: initialForm,
    resolver: zodResolver(relationshipFormSchema)
  });

  const handleFormSubmit: SubmitHandler<RelationshipFormData> = async (data: RelationshipFormData) => {
    const cleaned = removeUndefined<RelationshipFormData>(data);
    await save(cleaned);
    if (!apiErrors) {
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
            <div>
              <Controller
                name="type"
                control={control}
                render={({field}) => (
                  <>
                    <label htmlFor="type">Type <span className="red">*</span></label>
                    <select id="type" className="block mt-1 w-full" autoFocus required aria-label="type" {...field}>
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
                  <Input type="text" fieldErrors={errors?.name} apiErrors={apiErrors?.name}
                         className={`${apiErrors?.name && 'error'}`} label="Name" {...field} required/>
                )}/>
            </div>
            <div>
              <Controller
                name="title"
                control={control}
                render={({field}) => (
                  <Input type="text" fieldErrors={errors?.title} apiErrors={apiErrors?.title}
                         className={`${apiErrors?.title && 'error'}`} label="Title" {...field} required/>
                )}/>
            </div>
            <div>
              <Controller
                name="birthday"
                control={control}
                render={({field}) => (
                  <Input type="date" fieldErrors={errors?.birthday} apiErrors={apiErrors?.birthday}
                         className={`${apiErrors?.birthday && 'error'}`} label="Birthday" {...field} />
                )}/>
            </div>
            <div>
              <label htmlFor="health" title="Rate the current health of this relationship.">
                Relationship Health <span className="required">*</span>
              </label>
              <input id="health" type="range" min="1" max="10" {...register('health')} className="range mt" required/>
              <div className="flex mt-sm justify-between">
                <i className="fa-regular fa-face-sad-tear"></i>
                <i className="fa-regular fa-face-frown"></i>
                <i className="fa-regular fa-face-meh"></i>
                <i className="fa-regular fa-face-smile"></i>
                <i className="fa-regular fa-face-laugh"></i>
              </div>
              {errors?.health && <div className="error">{errors.health.message}</div>}
              {apiErrors?.health && <span className="error">{apiErrors.health}</span>}
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <textarea id="description" className="block mt-1 w-full" {...register('description')} />
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
                  ref={ref}
                  onChange={onChange}
                  value={value}
                  errors={[...(apiErrors?.images ?? []), fieldState.error?.message ?? '']}
                />
              )}
            />
          </div>
        </fieldset>
        <div className="flex justify-between mt-2">
          <button type="submit" className="primary mt angle-right">
            {relationship ? 'Update' : 'Create'} <Spinner loading={isSubmitting} className="ml-2"/>
          </button>
          <button id="cancel-edit-button" type="button" className="transparent angle-left text-white" onClick={cancel}>Cancel</button>
        </div>
      </form>
    </>
  );
}
