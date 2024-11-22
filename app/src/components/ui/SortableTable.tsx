import React, { useCallback, useEffect, useState } from 'react';

export type BaseRow = {
  key: string | number;
  [k: string]: string | number | boolean | object | null;
}
export type Column<T extends BaseRow = BaseRow> = {
  alt?: string,
  className?: string,
  key: string | number,
  label: string,
  styles?: object,
  type: string,
  format?: (data: T) => React.ReactNode
}

const sortData = <T extends BaseRow>(data: T[], key: string | number, order: 'asc' | 'desc', type: string) => {
  return [...data].sort((a, b) => {
    let aValue = a[key];
    let bValue = b[key];

    if (type === 'text' || type === 'string') {
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
    } else if (type === 'int' || type === 'number' || type === 'float') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    } else if (type === 'date' || type === 'datetime' || type === 'time') {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    }

    if (aValue && bValue) {
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
    }

    return 0;
  });
}

type SortConfigType = { key: string | number, order: 'asc' | 'desc', type: string } | null;

interface SortableTableProps<T extends BaseRow> {
  columns: Column<T>[],
  data: T[],
}

export default function SortableTable<T extends BaseRow>({columns, data}: SortableTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfigType>(null);
  const [sortedData, setSortedData] = useState<T[]>(data);

  const handleSort = useCallback((key: string | number, type: string) => {
    setSortConfig(() => {
      return { key, order: sortConfig?.order === 'asc' ? 'desc' : 'asc', type };
    })
  }, [sortConfig]);

  useEffect(() => {
    if (sortConfig) {
      const sorted = sortData(data, sortConfig.key, sortConfig.order, sortConfig.type);
      setSortedData(sorted);
    }
  }, [data, sortConfig]);

  return (
    <table className="sortable">
      <thead>
        <tr>
          {columns.map((col: Column<T>) => (
            <th key={col.key} style={col.styles} data-key={col.key}
                className={`${col.className ?? ''}${col.key === sortConfig?.key ? ` sorted ${sortConfig.order}` : ''}`.trim()}
                {...(col.type !== 'image' && { onClick: () => handleSort(col.key, col.type) })}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row) => (
          <tr key={`${row.id ?? row.key}`}>
            {columns.map((col: Column<T>, i: number) => (
              <td key={`${row[col.key]}-${i}`} data-key={col.key} data-type={col.type} data-value={row[col.key]} style={col.styles} className={col.className}>
                {col.type === 'image' && row[col.key] ?
                  <div className="table-image">
                    <img src={`${import.meta.env.VITE_API_URL}/api/${row[col.key]}`} alt={col.alt ? row[col.alt] as string : ''} />
                  </div> : ''
                }
                {col.type === 'text' && <>{String(row[col.key])}</>}
                {col.type === 'format' && col.format && <>{col.format(row)}</>}
                {col.type === 'number' && <>{Number(row[col.key])}</>}
                {col.type === 'date' && <>{new Date(row[col.key] as string).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}</>}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
