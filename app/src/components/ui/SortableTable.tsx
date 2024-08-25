// @ts-nocheck
import React, {useCallback, useEffect} from 'react';

type Column = {
  alt?: string,
  className?: string,
  key: string,
  label: string,
  styles?: object,
  type: string,
  format?: (data) => React.JSX.Element | Element
}

interface SortableTableProps {
  columns: Column[],
  data: object[],
}

export default function SortableTable({columns, data}: SortableTableProps) {
  const tableId = `sortTable-${Math.floor(Math.random() * 100)}`;
  const activateSortableTable = useCallback((table: HTMLElement) => {
    const headings = table?.querySelectorAll('th') as NodeListOf<HTMLTableCellElement>;
    const tbody = table?.querySelector('tbody');
    const rows = tbody?.querySelectorAll('tr');
    if (headings && tbody && rows) {
      const rowsArray: HTMLTableRowElement[] = Array.from(rows);
      let order = 'asc';
      for (const heading of headings) {
        heading.addEventListener('click', (e: MouseEvent) => {
          const dataKey = (e.target as HTMLTableCellElement).getAttribute('data-key') || '';
          headings.forEach(h => h.classList.remove('sorted', 'asc', 'desc'));
          order = order === 'asc' ? 'desc' : 'asc';
          heading.classList.add('sorted', order);
          sortRowsByKey(dataKey, tbody, rowsArray, order);
        });
      }
    }
  }, []);

  const sortRowsByKey = (
    key: string,
    tbody: HTMLTableSectionElement,
    rowsArray:  HTMLTableRowElement[],
    order: string
  ) => {
    rowsArray.sort((a: HTMLTableRowElement, b: HTMLTableRowElement) => {
      let aValue, bValue;
      const aItem = a.querySelector(`[data-key="${key}"]`);
      const bItem = b.querySelector(`[data-key="${key}"]`);
      const type = aItem?.getAttribute('datatype');

      if (type === 'text' || type === 'string') {
        aValue = aItem?.getAttribute('data-value')?.trim().toLowerCase();
        bValue = bItem?.getAttribute('data-value')?.trim().toLowerCase();
      }

      if (type === 'int' || type === 'number' || type === 'float') {
        aValue = Number(aItem?.getAttribute('data-value')?.trim());
        bValue = Number(bItem?.getAttribute('data-value')?.trim());
      }

      if (type === 'date' || type === 'datetime' || type === 'time') {
        aValue = new Date(aItem?.getAttribute('data-value')?.trim() || '').getTime();
        bValue = new Date(bItem?.getAttribute('data-value')?.trim() || '').getTime();
      }

      if (aValue && bValue) {
        if (aValue < bValue) {
          return order === 'asc' ? -1 : 1;
        } else if (aValue > bValue) {
          return order === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      }

      return -1;
    });

    rowsArray.forEach((tr: HTMLTableRowElement) => tbody.appendChild(tr));
  }

  useEffect(() => {
    const table: HTMLElement|null = document.getElementById(tableId);
    if (table) {
      activateSortableTable(table);
    }
  }, [tableId, activateSortableTable]);

  return (
    <table id={tableId} className="sortable">
      <thead>
      <tr>
        {columns.map((col: Column) => <th key={col.key} style={col.styles} data-key={col.key} className={col.className}>{col.label}</th>)}
      </tr>
      </thead>
      <tbody>
        {data.map((row, index: number) => (
          <tr key={`${row}-${index}`}>
            {columns.map((col: Column, i: number) => (
              <td key={`${row[col.key]}-${i}`} data-key={col.key} datatype={col.type} data-value={row[col.key]} style={col.styles} className={col.className}>
                {col.type === 'image' && <div className="table-image"><img src={`${import.meta.env.VITE_BACKEND_URL_LOCAL}/api/${row[col.key]}`} alt={row[col.alt]} /></div>}
                {col.type === 'text' && <>{row[col.key]}</>}
                {col.type === 'format' && <>{col.format(row)}</>}
                {col.type === 'number' && <>{row[col.key]}</>}
                {col.type === 'date' && <>{new Date(row[col.key]).toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric'})}</>}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
