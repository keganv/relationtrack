import {useCallback, useEffect, useState} from 'react';
import Relationship from '../../types/Relationship.ts';
import ActionItem from '../../types/ActionItem.ts';
import SortableTable from './SortableTable';

type ActionItemRow = { id: number, action: string, complete: boolean, updated_at: string }
type ActionItemsProps = { relationship?: Relationship; }

export default function ActionItems({relationship}: ActionItemsProps) {
  const [actionItems, setActionItems] = useState<ActionItem[]>();
  const fetchActionItems = useCallback(() => {
    if (relationship) {
      setActionItems(relationship.action_items);
    }
  }, [relationship]);

  const columns = [
    {key: 'action', label: 'Action', type: 'text'},
    {
      key: 'complete', label: 'Complete', type: 'format', className: 'text-center',
      format: (row: ActionItemRow) => {
        return row.complete ? <i className="fa-regular fa-circle-check"></i> : <i className="fa-solid fa-square-xmark"></i>
      }
    },
    {key: 'updated_at', label: 'Date', className: 'hide-sm', type: 'date'},
    {
      key: 'trash', label: '', type: 'format',
      format: (row: ActionItemRow) => <i className="fa-regular fa-trash-can pointer delete-action-item" data-value={row.id}></i>
    }
  ];

  useEffect(() => {
    fetchActionItems();
  }, [fetchActionItems]);
  return (
    <>
      <SortableTable columns={columns} data={actionItems || []} />
    </>
  );
}
