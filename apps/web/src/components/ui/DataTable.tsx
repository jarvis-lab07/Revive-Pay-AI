import React from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
}

export function DataTable<T>({ data, columns, keyExtractor }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border text-ink-muted text-[11px] uppercase tracking-[0.08em]">
            {columns.map((col) => (
              <th key={col.key} className="pb-3 px-4 font-semibold whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className="border-b border-border/60 hover:bg-slate-50/90 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className="py-3.5 px-4 whitespace-nowrap align-middle">
                  {col.render ? col.render(item) : (item as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
