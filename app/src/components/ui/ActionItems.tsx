import {useCallback, useEffect, useState} from 'react';
import { Relationship } from '../../types/Relationship.ts';
import ActionItem from '../../types/ActionItem.ts';
import SortableTable, { Column } from './SortableTable';

type ActionItemRow = { key: number | string } & ActionItem;
type ActionItemsProps = { relationship?: Relationship; }

export default function ActionItems({relationship}: ActionItemsProps) {
  const [actionItems, setActionItems] = useState<ActionItemRow[]>();
  const fetchActionItems = useCallback(() => {
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

  if (actionItems) {
    return (
      <>
        <SortableTable columns={columns} data={actionItems} />
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
