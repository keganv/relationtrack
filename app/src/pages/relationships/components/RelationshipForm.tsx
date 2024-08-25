import {ChangeEvent, MouseEventHandler, useState} from 'react';
import ImageUploader from '../../../components/ui/ImageUploader';
import {FormDataModel} from '../../../services/RelationshipService';
import useRelationshipContext from '../../../hooks/useRelationshipContext';
import Spinner from '../../../components/ui/Spinner';

type RelationshipFormProps = {
  data?: FormDataModel;
  cancel?: () => void;
};

export default function RelationshipForm({data, cancel}: RelationshipFormProps) {
  const initialForm: FormDataModel = {
    id: data?.id,
    title: data?.title || '',
    name: data?.name || '',
    health: data?.health || 5,
    type: data?.type || '',
    birthday: data?.birthday || '',
    description: data?.description || '',
    images: null
  };
  const [formData, setFormData] = useState<FormDataModel>(initialForm);
  const {types, save, formErrors} = useRelationshipContext();
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleImages = (images: File[] | null) => {
    setFormData((prevData) => ({
      ...prevData,
      images: images,
    }));
  };
  const handleSubmit: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event?.preventDefault();
    console.log(formData);
    try {
      await save(formData);
      if (!formErrors && cancel) cancel();
    } catch (e) {
      console.error(e);
    }
  };

  if (!types?.length) {
    return <Spinner loading={true}></Spinner>
  }

  return (
    <>
      <header className="border-bottom-dark mb">
        <h2>Add A Relationship</h2>
      </header>
      <form method="POST" encType="multipart/form-data" id="relationship-form">
        <fieldset className="w-100">
          <div className="form-row flex">
            <div className="col-6 mr-sm">
              <label htmlFor="type">Type <span className="red">*</span></label>
              <select id="type" className="block mt-1 w-full" name="type" autoFocus value={formData?.type}
                      required aria-label="type" onChange={handleInputChange}>
                <option disabled value=''>Select</option>
                {types && types.map((t, i) => (
                  <option key={i} value={t}>{t}</option>
                ))}
              </select>
              {formErrors?.type && <span className="error">{formErrors.type}</span>}
            </div>
            <div className="col-6 ml-sm">
              <label htmlFor="name">Name <span className="red">*</span></label>
              <input id="name" className="block mt-1 w-full" type="text" value={formData.name}
                     name="name" required onChange={handleInputChange} />
              {formErrors?.name && <span className="error">{formErrors.name}</span>}
            </div>
          </div>
          <div className="form-row">
            <label htmlFor="health" title="Rate the current health of this relationship.">
              Health <span className="red">*</span>
            </label>
            <input id="health" name="health" type="range" min="1" max="10" value={formData.health}
                   className="range mt" required onChange={handleInputChange} />
            <div className="flex mt-sm justify-between">
              <i className="fa-regular fa-face-sad-tear"></i>
              <i className="fa-regular fa-face-frown"></i>
              <i className="fa-regular fa-face-meh"></i>
              <i className="fa-regular fa-face-smile"></i>
              <i className="fa-regular fa-face-laugh"></i>
            </div>
            {formErrors?.health && <span className="error">{formErrors.health}</span>}
          </div>
          <div className="form-row flex">
            <div className="col-6 mr-sm">
              <label htmlFor="title">Title <span className="red">*</span></label>
              <input id="title" className="block mt-1 w-full" type="text" name="title"
                     value={formData.title} onChange={handleInputChange} />
              {formErrors?.title && <span className="error">{formErrors.title}</span>}
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
          </div>
          <div className="form-row">
            <label htmlFor="images" title="Max of 10 images.">Images</label>
            <ImageUploader onImagesSelected={handleImages} />
          </div>
        </fieldset>
        <button type="submit" className="primary mt" onClick={handleSubmit}>{data ? 'Update' : 'Create'}</button>
        <button id="cancel-edit-button" type="button" className="float-right mt" onClick={cancel}>Cancel</button>
      </form>
    </>
  );
}
