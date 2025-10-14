import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* -----------------------------
   Types & defaults
------------------------------ */
type Row = { newPrice: number; discount: number };
type Table = { id: string; rows: Row[] };

type Props = {
  data?: Table[];   // optional; will be normalized
  hint?: string;
};

const DEFAULT_DATA: Table[] = [
  {
    id: "left",
    rows: [
      { newPrice: 350, discount: 50 },
      { newPrice: 72,  discount: 20 },
      { newPrice: 108, discount: 10 },
      { newPrice: 60,  discount: 25 },
    ],
  },
  {
    id: "right",
    rows: [
      { newPrice: 350, discount: 50 },
      { newPrice: 72,  discount: 20 },
      { newPrice: 108, discount: 10 },
      { newPrice: 60,  discount: 25 },
    ],
  },
];

const DEFAULT_HINT =
  "Use: new price = old price × (1 − discount/100). So, old price = new price ÷ (1 − discount/100). Example: £350 at 50% is £700 old price.";

/* -----------------------------
   Helpers
------------------------------ */
type Status = "idle" | "match" | "wrong";
interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const keyOf = (tableId: string, i: number) => `${tableId}-${i}`;

const gbp = (n: number) =>
  `£${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Parse numbers from relaxed strings like "£350.00", "50%", "72" */
const toNumLoose = (v: unknown): number => {
  if (typeof v === "number") return v;
  if (v == null) return NaN;
  const s = String(v);
  const n = parseFloat(s.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
};

const expectedOld = (row: Row) => row.newPrice / (1 - row.discount / 100);

/** Normalize incoming data; accept relaxed string numbers; keep exactly 2 tables.
 *  If nothing valid remains, fall back to defaults.
 */
function normalizeTables(input?: Table[]): Table[] {
  const src = Array.isArray(input) && input.length ? input : DEFAULT_DATA;

  const norm = src.slice(0, 2).map((t, idx) => {
    const rawRows = Array.isArray(t?.rows) ? t.rows : [];
    const rows: Row[] = rawRows
      .map((r: any) => ({
        newPrice: toNumLoose(r?.newPrice),
        discount: toNumLoose(r?.discount),
      }))
      .filter((r) => Number.isFinite(r.newPrice) && Number.isFinite(r.discount));
    return { id: typeof t?.id === "string" ? t.id : `table-${idx + 1}`, rows };
  });

  const total = norm.reduce((acc, t) => acc + t.rows.length, 0);
  return total > 0 ? norm : DEFAULT_DATA;
}

/* -----------------------------
   Component
------------------------------ */
const ArrType_48: React.FC<Props> = ({ data, hint }) => {
  const tables = useMemo(() => normalizeTables(data), [data]);
  const help = hint ?? DEFAULT_HINT;

  const [showHint, setShowHint] = useState(false);
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  // inputs and correctness keyed per row
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [ok, setOk] = useState<Record<string, boolean>>({});

  // reset UI if the table shape changes
  useEffect(() => {
    setInputs({});
    setOk({});
    setChecked(false);
    setStatus("idle");
    setShowHint(false);
  }, [tables]);

  const totalRows = useMemo(
    () => tables.reduce((acc, t) => acc + t.rows.length, 0),
    [tables]
  );

  const onChange = useCallback(
    (tableId: string, i: number, v: string) =>
      setInputs((prev) => ({ ...prev, [keyOf(tableId, i)]: v })),
    []
  );

    const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const handleCheck = useCallback(() => {
    const res: Record<string, boolean> = {};
    let correct = 0;

    tables.forEach((t) =>
      t.rows.forEach((row, i) => {
        const k = keyOf(t.id, i);
        const want = expectedOld(row);
        const got = toNumLoose(inputs[k] ?? "");
        const good = Number.isFinite(got) && Math.abs(got - want) < 0.01;
        res[k] = good;
        if (good) correct += 1;
      })
    );

    setOk(res);
    setChecked(true);
    setStatus(correct === totalRows && totalRows > 0 ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },correct === totalRows && totalRows > 0);
  }, [inputs, tables, totalRows]);

  const handleShowSolution = useCallback(() => {
    const filled: Record<string, string> = {};
    const res: Record<string, boolean> = {};

    tables.forEach((t) =>
      t.rows.forEach((row, i) => {
        const k = keyOf(t.id, i);
        filled[k] = expectedOld(row).toFixed(2);
        res[k] = true;
      })
    );

    setInputs((p) => ({ ...p, ...filled }));
    setOk(res);
    setChecked(true);
    setStatus("match");
  }, [tables]);

  const handleShowHint = useCallback(() => setShowHint((s) => !s), []);

  const summary: Summary | null = useMemo(() => {
    if (status === "match")
      return {
        text: "Correct! Great job.",
        color: "text-green-700",
        bgColor: "bg-green-100",
        borderColor: "border-green-600",
      };
    if (status === "wrong")
      return {
        text: "Some answers are wrong. Check again.",
        color: "text-red-700",
        bgColor: "bg-red-100",
        borderColor: "border-red-600",
      };
    return null;
  }, [status]);

  // Expose handlers to your global toolbar (no local Controllers/Hint/Check here)
  const { setControls } = useQuestionControls();
  const controls = useMemo(
    () => ({
      handleCheck,
      handleShowSolution,
      handleShowHint,
      hint: help,
      showHint,
      summary,
    }),
    [handleCheck, handleShowSolution, handleShowHint, help, showHint, summary]
  );
  useEffect(() => {
    setControls(controls);
  }, [controls, setControls]);

  return (
    <div className="space-y-5">
      <div>
        {/* <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">
          Enter the <span className="font-medium">old price</span> for each row.
        </p> */}
      </div>

      {/* Exactly two tables */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {tables.map((table) => (
          <div key={table.id} className="rounded-lg border border-orange-300 p-2 bg-white">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-slate-700">
                  <th className="rounded-tl-lg border border-orange-200 bg-slate-50 px-3 py-2 text-left">
                    old price
                  </th>
                  <th className="border border-orange-200 bg-slate-50 px-3 py-2 text-left">
                    new price
                  </th>
                  <th className="rounded-tr-lg border border-orange-200 bg-slate-50 px-3 py-2 text-left">
                    discount
                  </th>
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, i) => {
                  const k = keyOf(table.id, i);
                  const isChecked = checked && k in ok;
                  const rowBg = isChecked
                    ? ok[k]
                      ? "bg-emerald-50"
                      : "bg-rose-50"
                    : "bg-white";
                  const underline =
                    !checked
                      ? "border-slate-300 text-slate-800"
                      : ok[k]
                      ? "border-emerald-400 text-emerald-700"
                      : "border-rose-400 text-rose-600";
                  return (
                    <tr key={k} className={rowBg}>
                      <td className="border border-orange-200 px-3 py-2">
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400">£</span>
                          <input
                            value={inputs[k] ?? ""}
                            onChange={(e) => onChange(table.id, i, e.target.value)}
                            inputMode="decimal"
                            placeholder=""
                            aria-label={`old price for ${table.id} row ${i + 1}`}
                            className={`w-28 bg-transparent outline-none border-b border-dotted ${underline}`}
                          />
                        </div>
                      </td>
                      <td className="border border-orange-200 px-3 py-2 text-slate-800">
                        {gbp(row.newPrice)}
                      </td>
                      <td className="border border-orange-200 px-3 py-2 text-slate-800">
                        {row.discount}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrType_48;
