import { useCallback, useEffect, useState } from 'react';
import { Relationship } from '../../types/Relationship';
import ActionItem from '../../types/ActionItem';
import SortableTable, { SortTableColumn } from '../ui/SortableTable';
import Modal from 'react-modal';
import ActionItemForm from './ActionItemForm';
import useApiHook from '../../hooks/useApiHook.ts';

type ActionItemRow = { key: number | string } & ActionItem;
type ActionItemProps = { relationship: Relationship };

export default function ActionItems({relationship}: ActionItemProps) {
  const [actionItems, setActionItems] = useState<ActionItemRow[]>([]);
  const [selectedAction, setSelectedAction] = useState<ActionItem>();
  const [formOpen, setFormOpen] = useState(false);
  const { deleteData } = useApiHook();

  const handleActionItems = useCallback((items: ActionItem[] = relationship.action_items ?? []) => {
    relationship.action_items = items;
    setSelectedAction(undefined); // Reset the selected action
    setActionItems(items.map((item: ActionItem) => ({ key: item.id, ...item }))); // Update the action items
  }, [relationship]);

  const handleSelectedAction = (row: ActionItemRow) => {
    setSelectedAction(row);
    setFormOpen(true);
  };

  const handleDeleteAction = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this action item?');
    if (confirmed) {
      const { data } = await deleteData(`/api/action-items/${id}`);
      console.log(data);
      handleActionItems(data);
    }
  };

  useEffect(() => {
    handleActionItems();
  }, [handleActionItems]);

  const columns: SortTableColumn<ActionItemRow>[] = [
    {
      key: 'action', label: 'Action', type: 'format', styles: {minWidth: 200},
      format: (row: ActionItemRow) => <button className="text text-sm" onClick={() => handleSelectedAction(row)}>{row.action}</button>
    },
    {
      key: 'complete', label: 'Complete', type: 'format', className: 'text-center',
      format: (row: ActionItemRow) => {
        return row.complete ? <i className="fa-regular fa-circle-check"></i> : <i className="fa-solid fa-square-xmark"></i>
      }
    },
    {key: 'created_at', label: 'Created', className: 'hidden md:table-cell', type: 'date'},
    {key: 'updated_at', label: 'Last Updated', className: 'hidden md:table-cell', type: 'date'},
    {
      key: 'trash', label: '', type: 'format',
      format: (row: ActionItemRow) => (
        <i className="fa-regular fa-trash-can cursor-pointer"
           data-value={row.id}
           title="Delete Action Item"
           onClick={() => handleDeleteAction(row.id)}
        >
        </i>
      )
    }
  ];

  return (
    <>
      <header className="flex w-full justify-between">
        <h4>Action Items</h4>
        <button className="primary angle-left text-[12px]" onClick={() => setFormOpen(true)}>Add Action</button>
      </header>
      { actionItems.length ?
        <SortableTable columns={columns} data={actionItems} /> :
        <p className="text-sm">No action items.</p>
      }
      <Modal isOpen={formOpen} onRequestClose={() => setFormOpen(false)}
             appElement={document.getElementById('root') ?? undefined}
             className="react-modal center h-max max-w-[400px] m-auto" overlayClassName="react-modal-overlay">
        <div className="close" onClick={() => setFormOpen(false)}>X</div>
        <ActionItemForm
          relationship={relationship}
          close={() => setFormOpen(false)}
          updateActionItems={handleActionItems}
          actionItem={selectedAction}
        />
      </Modal>
    </>
  );
}
