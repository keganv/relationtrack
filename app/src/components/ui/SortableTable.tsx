import React, { useCallback, useEffect, useState } from 'react';

type Column = {
  alt?: string,
  className?: string,
  key: string,
  label: string,
  styles?: object,
  type: string,
  format?: (data: object) => React.JSX.Element | Element
}

interface SortableTableProps {
  columns: Column[],
  data: object[],
}

const sortData = (data: object[], key: string, order: 'asc' | 'desc', type: string) => {
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
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;

    return 0;
  });
}

type SortConfigType = { key: string, order: 'asc' | 'desc', type: string } | null;

export default function SortableTable({columns, data}: SortableTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfigType>(null);
  const [sortedData, setSortedData] = useState(data);

  const handleSort = useCallback((key: string, type: string) => {
    setSortConfig((currentConfig: SortConfigType) => {
      return { key, order: currentConfig?.order === 'asc' ? 'desc' : 'asc', type };
    })
  }, [setSortConfig]);

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
          {columns.map((col: Column) => (
            <th key={col.key} style={col.styles} data-key={col.key} className={col.className}
                {...(col.type !== 'image' && { onClick: () => handleSort(col.key, col.type) })}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row) => (
          <tr key={`${row.id ?? row.key}`}>
            {columns.map((col: Column, i: number) => (
              <td key={`${row[col.key]}-${i}`} data-key={col.key} data-type={col.type} data-value={row[col.key]} style={col.styles} className={col.className}>
                {col.type === 'image' && row[col.key] ? <div className="table-image"><img src={`${import.meta.env.VITE_API_URL}/api/${row[col.key]}`} alt={row[col.alt]} /></div> : ''}
                {col.type === 'text' && <>{row[col.key]}</>}
                {col.type === 'format' && col.format && <>{col.format(row)}</>}
                {col.type === 'number' && <>{row[col.key]}</>}
                {col.type === 'date' && <>{new Date(row[col.key]).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}</>}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
