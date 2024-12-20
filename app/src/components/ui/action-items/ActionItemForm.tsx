import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ActionItem, { actionItemFormSchema, ActionItemFormData } from '../../../types/ActionItem';
import { Checkbox, Input } from '../../form/Input.tsx';
import { removeUndefined } from '../../../lib/helpers';
import useApiHook from '../../../hooks/useApiHook';
import { useEffect } from 'react';
import Spinner from '../Spinner.tsx';
import { Relationship } from '../../../types/Relationship';

type ActionItemFormProps = {
  relationship: Relationship;
  actionItem?: ActionItem;
  cancel: () => void;
};

const defaultForm = { id: null, action: '' }

const ActionItemForm = ({relationship, actionItem, cancel}: ActionItemFormProps) => {
  const { apiErrors, postData } = useApiHook();

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<ActionItemFormData>({
    defaultValues: actionItem ? { ...actionItem } : defaultForm,
    resolver: zodResolver(actionItemFormSchema)
  });

  const handleFormSubmit: SubmitHandler<ActionItemFormData> = async (data: ActionItemFormData) => {
    const cleaned = removeUndefined<ActionItemFormData>(data);
    const url = data?.id ? `/api/action-items/${data.id}` : '/api/action-items';
    await postData(url, {...cleaned, relationship_id: relationship.id});
    if (!apiErrors) {
      cancel(); // Close the form after a successful save.
    }
  }

  useEffect(() => {
    console.log(apiErrors);
  }, [apiErrors]);

  return (
    <div className="flex flex-col h-full">
      <p className="mb-3 text-sm">{actionItem?.id ? 'Update' : 'Create'} an action item for {relationship.name}.</p>
      <form method="POST" noValidate className="grid grid-cols-1 place-content-between h-full">
        <fieldset>
          <div className="mb-3">
            <Controller
              name="action"
              control={control}
              render={({field}) => (
                <Input
                  {...field}
                  type="text"
                  fieldErrors={errors?.action}
                  label="Action"
                  required
                  apiErrors={apiErrors?.action}
                  // className={`${apiErrors?.name && 'error'}`}
                />
            )}/>
          </div>
            <Controller
              name="complete"
              control={control}
              render={({field}) => (
                <Checkbox
                  {...field}
                  type="checkbox"
                  fieldErrors={errors?.complete}
                  label="Completed"
                  value="complete"
                  // apiErrors={apiErrors?.name}
                  // className={`${apiErrors?.name && 'error'}`}
                />
            )}/>
        </fieldset>
        <div className="mt-3 flex justify-between">
          <button type="submit" className="primary angle-right" onClick={handleSubmit(handleFormSubmit)}>
            Save <Spinner loading={isSubmitting} className="ml-2"/>
          </button>
          <button className="transparent angle-left text-white" onClick={cancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default ActionItemForm;
