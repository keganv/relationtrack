import { useCallback, useState } from 'react';
import Modal from 'react-modal';

import useApi from '../../hooks/useApi.ts';
import useGlobalContext from '../../hooks/useGlobalContext.ts';
import type { ActionItem } from '../../types/ActionItem';
import type { Relationship } from '../../types/Relationship';
import SortableTable, { type SortTableColumn } from '../ui/SortableTable';
import ActionItemForm from './ActionItemForm';

type ActionItemRow = { key: number | string } & ActionItem;
type ActionItemProps = { relationship: Relationship };

function formatActionItems(items: ActionItem[] = []) {
  return items.map((item: ActionItem) => ({ key: item.id, ...item }));
}

export default function ActionItems({relationship}: ActionItemProps) {
  const [actionItems, setActionItems] = useState<ActionItemRow[]>(formatActionItems(relationship.action_items));
  const [selectedActionItem, setSelectedActionItem] = useState<ActionItem>();
  const [formOpen, setFormOpen] = useState(false);
  const { setStatus } = useGlobalContext();
  const { deleteData, getData } = useApi();

  const handleActionItems = useCallback((items: ActionItem[] = relationship.action_items ?? []) => {
    relationship.action_items = items;
    setSelectedActionItem(undefined); // Reset the selected action
    setActionItems(formatActionItems(items)); // Update the action items
  }, [relationship]);

  const handleSelectedAction = (row: ActionItemRow) => {
    setSelectedActionItem(row);
    setFormOpen(true);
  };

  const handleDeleteAction = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this action item?');
    if (confirmed) {
      const result = await deleteData(`/api/action-items/${id}`);
      if (result) {
        setStatus({ type: 'success', message: result?.data.message ?? 'Successfully deleted Action Item!' });
        const actionItems = await getData(`/api/relationships/${relationship.id}/action-items`);
        handleActionItems(actionItems);
      }
    }
  };

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
          actionItem={selectedActionItem}
        />
      </Modal>
    </>
  );
}
