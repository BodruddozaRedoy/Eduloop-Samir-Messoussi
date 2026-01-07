import type { ReactNode } from "react";

type Column = {
  key: string;
  header: string;
  className?: string;
};

type Props = {
  columns: Column[];
  rows: Array<Record<string, ReactNode>>;
};

export default function AdminTable({ columns, rows }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-orange-100">
      <table className="w-full min-w-[900px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-orange-50 text-orange-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-xs font-semibold ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-t border-orange-100">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-xs text-gray-700">
                  {row[col.key] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
