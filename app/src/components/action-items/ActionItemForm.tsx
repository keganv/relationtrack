import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ActionItem, { actionItemFormSchema, ActionItemFormData } from '../../types/ActionItem';
import { Checkbox, Input } from '../form/Input.tsx';
import { removeUndefined } from '../../lib/helpers';
import useApiHook from '../../hooks/useApiHook';
import { useEffect } from 'react';
import Spinner from '../ui/Spinner.tsx';
import { Relationship } from '../../types/Relationship';
import useGlobalContext from '../../hooks/useGlobalContext';

type ActionItemFormProps = {
  relationship: Relationship;
  actionItem?: ActionItem;
  close: () => void;
  updateActionItems: (actionItems: ActionItem[]) => void;
};

const defaultForm = { id: null, action: '' }

const ActionItemForm = ({relationship, actionItem, close, updateActionItems}: ActionItemFormProps) => {
  const { apiErrors, getData, sendData } = useApiHook();
  const { setStatus } = useGlobalContext();

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<ActionItemFormData>({
    defaultValues: actionItem ? { ...actionItem } : defaultForm,
    resolver: zodResolver(actionItemFormSchema)
  });

  const handleFormSubmit: SubmitHandler<ActionItemFormData> = async (formData: ActionItemFormData) => {
    const cleaned = removeUndefined<ActionItemFormData>(formData);
    const method = formData?.id ? 'PUT' : 'POST';
    const url = method === 'PUT' ? `/api/action-items/${formData.id}` : '/api/action-items';
    const result = await sendData(url, {...cleaned, relationship_id: relationship.id}, method);

    if (result) {
      setStatus({ type: 'success', message: result?.message ?? 'Successfully saved Action Item!' });
      const actionItems = result.data ?? await getData(`/api/relationships/${relationship.id}/action-items`);
      updateActionItems(actionItems); // Update the parent component ActionItems list
    }
    close(); // Close the form after saving
  }

  useEffect(() => {
    if (apiErrors) {
      console.log(apiErrors);
    }
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
                  className={`${apiErrors?.name && 'error'}`}
                />
            )}/>
          </div>
            <Controller
              name="complete"
              control={control}
              render={({field}) => (
                <Checkbox
                  {...field}
                  defaultChecked={actionItem?.complete}
                  type="checkbox"
                  fieldErrors={errors?.complete}
                  label="Completed"
                  value="complete"
                  // apiErrors={apiErrors?.name}
                  className={`${errors?.complete && 'error'}`}
                />
            )}/>
        </fieldset>
        <div className="mt-3 flex justify-between">
          <button type="submit" className="primary angle-right" onClick={handleSubmit(handleFormSubmit)}>
            Save <Spinner loading={isSubmitting} className="ml-2"/>
          </button>
          <button className="transparent angle-left text-white" onClick={close}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default ActionItemForm;
