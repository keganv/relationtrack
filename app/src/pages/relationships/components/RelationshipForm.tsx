import { Controller, SubmitHandler, useForm } from 'react-hook-form';
// import { ChangeEvent, MouseEventHandler, useState } from 'react';

import { ImageUploader } from '../../../components/ui/ImageUploader';
import { relationshipFormSchema, RelationshipFormData } from '../../../types/Relationship';
import useRelationshipContext from '../../../hooks/useRelationshipContext';
import Spinner from '../../../components/ui/Spinner';
import { zodResolver } from '@hookform/resolvers/zod';

type RelationshipFormProps = {
  data?: RelationshipFormData;
  cancel?: () => void;
};

export default function RelationshipForm({ data, cancel }: RelationshipFormProps) {
  const initialForm: RelationshipFormData = { ...data };
  const { types, save, formErrors: apiErrors } = useRelationshipContext();
  const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RelationshipFormData>({
    defaultValues: initialForm,
    resolver: zodResolver(relationshipFormSchema)
  });
  const handleFormSubmit: SubmitHandler<RelationshipFormData> = async (data) => {
    console.log(data);
    await save(data);
  }

  if (!types?.length) {
    return <Spinner loading={true}></Spinner>
  }

  return (
    <>
      <header className="mb-3">
        <h2>Add A Relationship</h2>
      </header>
      <form method="POST" encType="multipart/form-data" id="relationship-form" onSubmit={handleSubmit(data => console.log(data))} noValidate>
        <fieldset className="w-full">
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
            )}/>
          <div className="mt-3">
            <label htmlFor="name">Name <span className="required">*</span></label>
            <input id="name" className="block mt-1 w-full" type="text" {...register('name')} name="name" required />
            {apiErrors?.name && <div className="error">{apiErrors.name}</div>}
          </div>
          <div className="form-row">
            <label htmlFor="health" title="Rate the current health of this relationship.">
              Health <span className="red">*</span>
            </label>
            <input id="health" name="health" type="range" min="1" max="10" value={data?.health ?? 5}
              className="range mt" required />
            <div className="flex mt-sm justify-between">
              <i className="fa-regular fa-face-sad-tear"></i>
              <i className="fa-regular fa-face-frown"></i>
              <i className="fa-regular fa-face-meh"></i>
              <i className="fa-regular fa-face-smile"></i>
              <i className="fa-regular fa-face-laugh"></i>
            </div>
            {apiErrors?.health && <span className="error">{apiErrors.health}</span>}
          </div>
          {/* <div className="form-row flex">
            <div className="col-6 mr-sm">
              <label htmlFor="title">Title <span className="red">*</span></label>
              <input id="title" className="block mt-1 w-full" type="text" name="title"
                value={formData.title} onChange={handleInputChange} />
              {apiErrors?.title && <span className="error">{apiErrors.title}</span>}
            </div>
            <div className="col-6 ml-sm">
              <label htmlFor="birthday">Birthday</label>
              <input id="birthday" className="block mt-1 w-full" type="date" name="birthday"
                value={formData?.birthday} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-row">
            <label htmlFor="description">Description</label>
            <textarea id="description" className="block mt-1 w-full" name="description"
              value={formData.description} aria-label="description" onChange={handleInputChange} />
          </div>*/}
          <div className="mt-4">
          <Controller
            name="images"
            control={control}
            render={({ field: { onChange, value, ...field }, fieldState }) => (
              <ImageUploader
                {...field}
                onChange={onChange}
                value={value}
                errors={[...(apiErrors?.images ?? []), fieldState.error?.message ?? '']}
              />
            )}
          />
          </div>
        </fieldset>
        <div className="flex justify-between mt-2">
          <button type="submit" className="primary mt angle-right small">
            {data ? 'Update' : 'Create'}
            {<Spinner loading={isSubmitting} className="ml-2" />}
          </button>
          <button id="cancel-edit-button" type="button" className="float-right mt" onClick={cancel}>Cancel</button>
        </div>
      </form>
    </>
  );
}
