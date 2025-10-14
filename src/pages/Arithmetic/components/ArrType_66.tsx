import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* --------------------------------
   Types
--------------------------------- */
type Op = "+" | "-";
type IncomingRow = { a: number | string; b: number | string; op?: Op; sum?: number; sub?: number };
type Row = { a: number; b: number; op: Op };

/* --------------------------------
   Demo rows (per-row fallback)
--------------------------------- */
const DEMO: Row[] = [
  { a: 4.25, b: 2.75, op: "+" },
  { a: 5.5,  b: 1.5,  op: "+" },
  { a: 7.3,  b: 0.7,  op: "+" },
  { a: 3.2,  b: 1.8,  op: "+" },
  { a: 4.1,  b: 2.9,  op: "+" },
  { a: 3.7,  b: 1.8,  op: "-" },
  { a: 9.0,  b: 2.1,  op: "-" },
  { a: 12.5, b: 0.75, op: "-" },
  { a: 8.4,  b: 3.4,  op: "-" },
  { a: 10.0, b: 9.2,  op: "-" },
];

const defaultHint =
  "Calculate mentally. Think of money/meters. Example: 4.25 + 2.75 = 7.00 (25¢ + 75¢ = 1.00). 3.70 − 1.80 = 1.90.";

/* --------------------------------
   Helpers
--------------------------------- */
const toNum = (v: unknown): number => {
  if (typeof v === "number") return v;
  // support comma decimals e.g. "4,25"
  const s = String(v ?? "").trim().replace(",", ".");
  const n = parseFloat(s.replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
};

const fmt2 = (n: number) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function coerceRow(inRow: IncomingRow | undefined, demoRow: Row): Row {
  if (!inRow) return demoRow;
  const a = toNum((inRow as any).a);
  const b = toNum((inRow as any).b);

  let op: Op | undefined =
    (inRow as any).op === "+" || (inRow as any).op === "-" ? (inRow as any).op : undefined;
  if (!op) {
    if (typeof (inRow as any).sum !== "undefined") op = "+";
    if (typeof (inRow as any).sub !== "undefined") op = "-";
  }
  if (!op) op = demoRow.op;

  const ok = Number.isFinite(a) && Number.isFinite(b);
  return ok ? ({ a, b, op } as Row) : demoRow;
}

function normalize(src: IncomingRow[] | undefined, perColumn: number) {
  const base = Array.isArray(src) && src.length ? src : [];
  const maxLen = Math.max(base.length, DEMO.length);
  const rows: Row[] = Array.from({ length: maxLen }, (_, i) =>
    coerceRow(base[i], DEMO[i % DEMO.length])
  );

  let adds = rows.filter((r) => r.op === "+");
  let subs = rows.filter((r) => r.op === "-");

  let di = 0;
  while (adds.length < perColumn) {
    const d = DEMO[di % DEMO.length];
    adds.push(d.op === "+" ? d : { ...d, op: "+" });
    di++;
  }
  di = 0;
  while (subs.length < perColumn) {
    const d = DEMO[di % DEMO.length];
    subs.push(d.op === "-" ? d : { ...d, op: "-" });
    di++;
  }

  adds = adds.slice(0, perColumn);
  subs = subs.slice(0, perColumn);

  return { adds, subs };
}

/* --------------------------------
   Component
--------------------------------- */
type Props = { data?: IncomingRow[]; hint?: string; perColumn?: number };

const ArrType_66: React.FC<Props> = ({ data, hint = defaultHint, perColumn = 5 }) => {
  const { adds, subs } = useMemo(() => normalize(data, perColumn), [data, perColumn]);
  const rowsInOrder = useMemo(() => [...adds, ...subs], [adds, subs]);

  // UI state for answers/checking
  const [answers, setAnswers] = useState<string[]>(() => rowsInOrder.map(() => ""));
  const [oks, setOks] = useState<boolean[]>(() => rowsInOrder.map(() => false));
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<"idle" | "match" | "wrong">("idle");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setAnswers(rowsInOrder.map(() => ""));
    setOks(rowsInOrder.map(() => false));
    setChecked(false);
    setStatus("idle");
    setShowHint(false);
  }, [rowsInOrder.length]);

  const setAnswer = useCallback((i: number, v: string) => {
    setAnswers((p) => {
      const c = [...p];
      c[i] = v;
      return c;
    });
  }, []);

  const expected = useMemo(
    () =>
      rowsInOrder.map((r) =>
        r.op === "+" ? +(r.a + r.b).toFixed(2) : +(r.a - r.b).toFixed(2)
      ),
    [rowsInOrder]
  );


    const { addResult } = useResultTracker();
    const { id: qId, title: qTitle } = useQuestionMeta();

  const handleCheck = useCallback(() => {
    const res = rowsInOrder.map((_, i) => {
      const got = toNum(answers[i]);
      const want = expected[i];
      return Number.isFinite(got) && Math.abs(got - want) < 0.01;
    });
    setOks(res);
    setChecked(true);
    setStatus(res.every(Boolean) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },res.every(Boolean));
  }, [answers, expected, rowsInOrder]);

  const handleShowSolution = useCallback(() => {
    setAnswers(expected.map((v) => v.toFixed(2)));
    setOks(rowsInOrder.map(() => true));
    setChecked(true);
    setStatus("match");
  }, [expected, rowsInOrder]);

  const handleShowHint = useCallback(() => setShowHint((s) => !s), []);

  // ===== expose controls to your global toolbar =====
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

  const { setControls } = useQuestionControls();
  const controls = useMemo(
    () => ({
      handleCheck,
      handleShowHint,
      handleShowSolution,
      hint,
      showHint,
      summary,
    }),
    [handleCheck, handleShowHint, handleShowSolution, hint, showHint, summary]
  );

  useEffect(() => {
    setControls((prev) => {
      const changed = Object.keys(controls).some(
        (k) => (controls as any)[k] !== (prev as any)?.[k]
      );
      return changed ? controls : prev;
    });
  }, [controls, setControls]);
  // ===== end exposed controls =====

  const inputCls = (ok: boolean) =>
    !checked
      ? "border-slate-400 text-slate-900"
      : ok
      ? "border-emerald-400 text-emerald-600"
      : "border-rose-400 text-rose-600";

  const renderCol = (rows: Row[], offset: number) => (
    <div className="space-y-3">
      {rows.map((r, localIdx) => {
        const i = offset + localIdx;
        return (
          <div
            key={`${r.a}${r.op}${r.b}-${i}`}
            className="flex items-center gap-3 text-[15px] leading-none text-slate-900"
          >
            <span className="tabular-nums">{fmt2(r.a)}</span>
            <span className="text-slate-700">{r.op}</span>
            <span className="tabular-nums">{fmt2(r.b)}</span>
            <span className="text-slate-700">=</span>
            <input
              value={answers[i]}
              onChange={(e) => setAnswer(i, e.target.value)}
              inputMode="decimal"
              className={`w-24 bg-transparent text-center outline-none border-b border-dotted ${inputCls(
                oks[i]
              )}`}
              placeholder=""
              aria-label={`answer ${i + 1}`}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        {/* <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">
          Calculate using mental arithmetic. Left: additions. Right: subtractions.
        </p> */}
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {renderCol(adds, 0)}
        {renderCol(subs, adds.length)}
      </div>
    </div>
  );
};

export default ArrType_66;
