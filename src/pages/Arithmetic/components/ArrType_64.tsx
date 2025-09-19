import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* -----------------------------
   Demo data & hint (can be passed via props)
------------------------------ */
type Row = { a: number; b: number };

export const demoRows: Row[] = [
  { a: 4.5, b: 2.75 },
  { a: 3.1, b: 5.25 },
  { a: 12.2, b: 1.8 },
  { a: 0.5, b: 0.75 },
  { a: 7, b: 0.25 },
  { a: 6.4, b: 1.35 },
  { a: 9.99, b: 0.01 },
  { a: 2.49, b: 4.51 },
  { a: 15, b: 0.5 },
  { a: 1.2, b: 3.45 },
];

export const defaultHint =
  "Add pounds and pence mentally. Example: £4.50 + £2.75 = £(4 + 2) + £(0.50 + 0.75) = £6 + £1.25 = £7.25.";

/* -----------------------------
   Helpers & types
------------------------------ */
type Status = "idle" | "match" | "wrong";

const toGBP = (n: number) =>
  `£${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const parseMoney = (v: string) => {
  const n = parseFloat(String(v ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
};

type Props = {
  rows?: Row[];
  hint?: string;
};

/* -----------------------------
   Component (uses QuestionControlsContext)
------------------------------ */
const ArrType_64: React.FC<Props> = ({ rows, hint }) => {
  const data = rows?.length ? rows : demoRows;
  const hintText = hint ?? defaultHint;

  const [answers, setAnswers] = useState<string[]>(() => data.map(() => ""));
  const [oks, setOks] = useState<boolean[]>(() => data.map(() => false));
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  // keep arrays in sync if data length changes
  useEffect(() => {
    setAnswers(data.map(() => ""));
    setOks(data.map(() => false));
    setChecked(false);
    setStatus("idle");
    setShowHint(false);
  }, [data.length]);

  const setAnswer = useCallback((i: number, v: string) => {
    setAnswers((prev) => {
      const cp = [...prev];
      cp[i] = v;
      return cp;
    });
  }, []);

  const handleCheck = useCallback(() => {
    const res = data.map((r, i) => {
      const want = +(r.a + r.b).toFixed(2);
      const got = parseMoney(answers[i]);
      return Number.isFinite(got) && Math.abs(got - want) < 0.01;
    });
    setOks(res);
    setChecked(true);
    setStatus(res.every(Boolean) ? "match" : "wrong");
  }, [answers, data]);

  const handleShowSolution = useCallback(() => {
    setAnswers(data.map((r) => (r.a + r.b).toFixed(2)));
    setOks(data.map(() => true));
    setChecked(true);
    setStatus("match");
  }, [data]);

  const handleShowHint = useCallback(() => setShowHint((s) => !s), []);

  // ✅ summary you requested (emoji + class names)
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

  // Wire up the global controls (no Controllers/Hint/Check in this file)
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
    // only update the context if something actually changed (prevents loops)
    setControls((prev) => {
      const changed = Object.keys(controls).some(
        (k) => (controls as any)[k] !== (prev as any)[k]
      );
      return changed ? controls : prev;
    });
  }, [controls, setControls]);

  const inputCls = (ok: boolean) =>
    !checked
      ? "border-slate-400 text-slate-900"
      : ok
      ? "border-emerald-400 text-emerald-600"
      : "border-rose-400 text-rose-600";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">Calculate using mental arithmetic.</p>
      </div>

      {/* 2 columns / 5 rows layout */}
      <div className="grid grid-cols-1 gap-x-12 gap-y-3 md:grid-cols-2">
        {data.map((r, i) => (
          <div
            key={`${r.a}+${r.b}-${i}`}
            className="flex items-center gap-3 text-[15px] leading-none text-slate-900"
          >
            <span className="tabular-nums">{toGBP(r.a)}</span>
            <span className="text-slate-700">+</span>
            <span className="tabular-nums">{toGBP(r.b)}</span>
            <span className="text-slate-700">=</span>

            <span className="text-emerald-600">£</span>
            <input
              value={answers[i]}
              onChange={(e) => setAnswer(i, e.target.value)}
              inputMode="decimal"
              placeholder=""
              className={`w-24 bg-transparent text-center outline-none border-b border-dotted ${inputCls(
                oks[i]
              )}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrType_64;
