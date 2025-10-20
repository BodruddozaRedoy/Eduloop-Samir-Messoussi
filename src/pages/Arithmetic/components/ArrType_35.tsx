import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------------------
   Types & DEMO data
--------------------------- */
type Row = { oldPrice: number; newPrice: number; discount: number };
type DataItem = { id: string; values: Row[] };

// ✅ Rename to avoid prop shadowing
export const DEMO_DATA: DataItem[] = [
  {
    id: "left",
    values: [
      { oldPrice: 700, newPrice: 350, discount: 50 },
      { oldPrice: 90, newPrice: 72, discount: 20 },
      { oldPrice: 120, newPrice: 108, discount: 10 },
      { oldPrice: 80, newPrice: 60, discount: 25 },
      { oldPrice: 150, newPrice: 90, discount: 40 },
    ],
  },
  {
    id: "right",
    values: [
      { oldPrice: 700, newPrice: 350, discount: 50 },
      { oldPrice: 90, newPrice: 72, discount: 20 },
      { oldPrice: 120, newPrice: 108, discount: 10 },
      { oldPrice: 80, newPrice: 60, discount: 25 },
      { oldPrice: 150, newPrice: 90, discount: 40 },
    ],
  },
];

const DEFAULT_HINT =
  "Use: new price = old price × (1 − discount/100). So, old price = new price ÷ (1 − discount/100).";

type Props = {
  data?: unknown;   // may be anything; we’ll normalize
  hint?: string;
};

const currency = (n: number) => `£${n.toFixed(2)}`;
const keyOf = (tableId: string, rowIndex: number) => `${tableId}-${rowIndex}`;

/* ---------------------------
   Normalizer (defensive)
--------------------------- */
function normalizeTables(input: unknown): DataItem[] {
  if (!Array.isArray(input)) return [];
  return input.map((t, idx) => {
    const id = typeof (t as any)?.id === "string" ? (t as any).id : `table-${idx}`;
    const raw = Array.isArray((t as any)?.values) ? (t as any).values : [];
    const values: Row[] = raw.map((r) => ({
      oldPrice: Number((r as any)?.oldPrice),
      newPrice: Number((r as any)?.newPrice),
      discount: Number((r as any)?.discount),
    }));
    return { id, values };
  });
}

/* ---------------------------
   Component
--------------------------- */
const ArrType_35: React.FC<Props> = ({ data, hint }) => {
  // 1) Normalize incoming prop; 2) fallback to demo if empty/invalid
  const tables = useMemo(() => {
    const normalized = normalizeTables(data);
    const hasRows = normalized.some((t) => Array.isArray(t.values) && t.values.length > 0);
    return hasRows ? normalized : DEMO_DATA;
  }, [data]);

  const hintText = hint ?? DEFAULT_HINT;

  const [showHint, setShowHint] = useState(false);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [rowOK, setRowOK] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<"idle" | "match" | "wrong">("idle");

  const totalRows = useMemo(
    () => tables.reduce((acc, t) => acc + (t.values?.length ?? 0), 0),
    [tables]
  );

  const onChange = useCallback((tableId: string, i: number, v: string) => {
    setInputs((prev) => ({ ...prev, [keyOf(tableId, i)]: v }));
  }, []);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  const handleCheck = useCallback(() => {
    const results: Record<string, boolean> = {};
    let correct = 0;
    tables.forEach((t) =>
      (t.values ?? []).forEach((row, i) => {
        const k = keyOf(t.id, i);
        const given = parseFloat((inputs[k] ?? "").trim());
        const expected = row.oldPrice;
        const ok =
          Number.isFinite(given) &&
          Number.isFinite(expected) &&
          Math.abs(given - expected) < 0.01;
        results[k] = ok;
        if (ok) correct += 1;
      })
    );

    setRowOK(results);
    setChecked(true);
    setStatus(correct === totalRows && totalRows > 0 ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },correct === totalRows && totalRows > 0);
  }, [inputs, tables, totalRows]);

  const handleShowSolution = useCallback(() => {
    const filled: Record<string, string> = {};
    const results: Record<string, boolean> = {};

    tables.forEach((t) =>
      (t.values ?? []).forEach((row, i) => {
        const k = keyOf(t.id, i);
        filled[k] = Number.isFinite(row.oldPrice) ? row.oldPrice.toFixed(2) : "";
        results[k] = Number.isFinite(row.oldPrice);
      })
    );

    setInputs((prev) => ({ ...prev, ...filled }));
    setRowOK(results);
    setChecked(true);
    setStatus("match");
  }, [tables]);

  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  const summary = useMemo(
    () =>
      status === "match"
        ? {
            text: "🎉 All Correct! Great job",
            color: "text-green-600",
            bgColor: "bg-green-100",
            borderColor: "border-green-600",
          }
        : status === "wrong"
        ? {
            text: "❌ Some answers are wrong. Check again.",
            color: "text-red-600",
            bgColor: "bg-red-100",
            borderColor: "border-red-600",
          }
        : null,
    [status]
  );

  // Hook into global Controllers (stable object)
  const { setControls } = useQuestionControls();
  const controls = useMemo(
    () => ({
      handleCheck,
      handleShowHint,
      handleShowSolution,
      hint: hintText,
      showHint,
      summary,
    }),
    [handleCheck, handleShowHint, handleShowSolution, hintText, showHint, summary]
  );
  useEffect(() => {
    setControls(controls);
  }, [controls, setControls]);

  return (
    <div className="space-y-5">
      <div>
        {/* <h2 className="text-sm font-semibold">Question 1</h2>
        <p className="text-xs text-slate-500">
          Calculate. You may use a strip or ratio table.
        </p> */}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {tables.map((table) => (
          <div
            key={table.id}
            className="rounded-md border border-slate-200 bg-white shadow-sm"
          >
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="[&>th]:px-4 [&>th]:py-2 bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                  <th className="border border-slate-200 text-left">old price</th>
                  <th className="border border-slate-200 text-left">new price</th>
                  <th className="border border-slate-200 text-left">discount</th>
                </tr>
              </thead>
              <tbody>
                {(table.values ?? []).map((row, i) => {
                  const k = keyOf(table.id, i);
                  const showColor = checked && k in rowOK;
                  const rowClass = showColor
                    ? rowOK[k]
                      ? "bg-green-50"
                      : "bg-red-50"
                    : "bg-white";
                  return (
                    <tr key={k} className={rowClass}>
                      <td className="border border-slate-200 px-3 py-2">
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400">£</span>
                          <input
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            className="w-full rounded border border-slate-300 px-2 py-1 text-slate-800 outline-none focus:ring-2 focus:ring-slate-300"
                            placeholder="0.00"
                            value={inputs[k] ?? ""}
                            onChange={(e) => onChange(table.id, i, e.target.value)}
                          />
                        </div>
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-800">
                        {Number.isFinite(row.newPrice) ? currency(row.newPrice) : "—"}
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-800">
                        {Number.isFinite(row.discount) ? `${row.discount}%` : "—"}
                      </td>
                    </tr>
                  );
                })}

                {/* If a table has no rows, show a friendly message */}
                {(!table.values || table.values.length === 0) && (
                  <tr>
                    <td colSpan={3} className="border border-slate-200 px-3 py-4 text-slate-500">
                      No rows to display.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* If you don’t use global controllers, you can add local buttons here:
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button onClick={handleCheck} className="rounded border px-3 py-1.5 text-sm">Check</button>
        <button onClick={handleShowSolution} className="rounded border px-3 py-1.5 text-sm">Show Solution</button>
        <button onClick={handleShowHint} className="rounded border px-3 py-1.5 text-sm">{showHint ? "Hide Hint" : "Hint"}</button>
      </div>
      {showHint && <div className="rounded border bg-amber-50 px-3 py-2 text-sm">{hintText}</div>}
      */}
    </div>
  );
};

export default ArrType_35;
