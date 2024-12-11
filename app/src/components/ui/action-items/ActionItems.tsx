import { useEffect, useState } from 'react';
import { Relationship } from '../../../types/Relationship.ts';
import ActionItem from '../../../types/ActionItem.ts';
import SortableTable, { Column } from '../SortableTable.tsx';
import Modal from 'react-modal';
import ActionItemForm from './ActionItemForm.tsx';

type ActionItemRow = { key: number | string } & ActionItem;
type ActionItemProps = { relationship: Relationship };

export default function ActionItems({relationship}: ActionItemProps) {
  const [actionItems, setActionItems] = useState<ActionItemRow[]>();
  const [formOpen, setFormOpen] = useState(false);
  useEffect(() => {
    if (relationship) {
      const formattedActionItems = relationship.action_items?.map(item => {
        return { key: item.id ?? item.action.substring(0, 10), ...item }
      });
      if (formattedActionItems) {
        setActionItems(formattedActionItems);
      }
    }
  }, [relationship]);

  const columns: Column<ActionItemRow>[] = [
    {key: 'action', label: 'Action', type: 'text', styles: {minWidth: 200}},
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
      format: (row: ActionItemRow) => <i className="fa-regular fa-trash-can pointer delete-action-item" data-value={row.id}></i>
    }
  ];

  if (actionItems) {
    return (
      <>
        <header className="flex w-full justify-between">
          <h4>Action Items</h4>
          <button className="primary angle-left text-[12px]" onClick={() => setFormOpen(true)}>Add Action</button>
        </header>
        <SortableTable columns={columns} data={actionItems}/>
        <Modal isOpen={formOpen} onRequestClose={() => setFormOpen(false)}
               className="react-modal center max-w-[400px] m-auto" overlayClassName="react-modal-overlay">
          <div className="close" onClick={() => setFormOpen(false)}>X</div>
          <ActionItemForm relationship={relationship} cancel={() => setFormOpen(false)} />
        </Modal>
      </>
    );
  } else {
    return (
      <>
        <p>No action items.</p>
      </>
    )
  }
}
