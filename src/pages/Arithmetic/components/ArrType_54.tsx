import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* --------------------------------
   Demo data & hint (top of file)
--------------------------------- */
type Unit = "kg" | "g" | "mg";
export type Row = {
  value: number;     // numeric source value (e.g., 23)
  from: Unit;        // "kg" | "g" | "mg"
  to: Unit;          // target unit
  expected: number;  // numeric expected result, e.g., 23000
};

/** Six sample items matching your screenshots */
export const data: Row[] = [
  { value: 23,    from: "kg", to: "g",  expected: 23000 },
  { value: 5,     from: "g",  to: "mg", expected: 5000  },
  { value: 3.5,   from: "kg", to: "g",  expected: 3500  },
  { value: 0.575, from: "kg", to: "g",  expected: 575   },
  { value: 1500,  from: "g",  to: "kg", expected: 1.5   },
  { value: 3,     from: "kg", to: "g",  expected: 3000  },
];

export const hint =
  "Use place-value: 1 kg = 1000 g and 1 g = 1000 mg. Multiply when going to a smaller unit; divide when going to a larger unit. Examples: 23 kg → 23000 g, 5 g → 5000 mg, 1500 g → 1.5 kg.";

/* --------------------------------
   Helpers
--------------------------------- */
type Status = "idle" | "match" | "wrong";
interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const parseLoose = (v: string | number | null | undefined) => {
  if (typeof v === "number") return v;
  if (v == null) return NaN;
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
};

/** Format solution nicely per unit (no unnecessary trailing zeros). */
const fmtValue = (n: number, unit: Unit) => {
  if (unit === "mg" || unit === "g") {
    // integers look like 23000; if not integer, keep up to 2 dp then trim zeros
    if (Number.isInteger(n)) return String(n);
    return n.toFixed(2).replace(/\.?0+$/, "");
  }
  // kg: allow up to 3 dp (e.g., 1.5)
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(3).replace(/\.?0+$/, "");
};

/** Accept incoming props data or fall back to demo. Coerce to numbers and keep valid rows. */
const normalize = (incoming?: Row[]) => {
  const src = Array.isArray(incoming) && incoming.length ? incoming : data;
  const rows = src
    .map((r: any) => ({
      value: parseLoose(r?.value),
      from: (r?.from as Unit) ?? "g",
      to: (r?.to as Unit) ?? "g",
      expected: parseLoose(r?.expected),
    }))
    .filter(
      (r) =>
        Number.isFinite(r.value) &&
        Number.isFinite(r.expected) &&
        (r.from === "kg" || r.from === "g" || r.from === "mg") &&
        (r.to === "kg" || r.to === "g" || r.to === "mg")
    ) as Row[];
  return rows.length ? rows : data;
};

/* --------------------------------
   Component
--------------------------------- */
type Props = {
  data?: Row[];
  hint?: string;
};

const ArrType_54: React.FC<Props> = ({ data: incoming, hint: incomingHint }) => {
  const rows = useMemo(() => normalize(incoming), [incoming]);
  const helpText = incomingHint ?? hint;

  // UI state
  const [answers, setAnswers] = useState<string[]>(() => rows.map(() => ""));
  const [ok, setOk] = useState<boolean[]>(() => rows.map(() => false));
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  // Reset whenever row count/shape changes
  useEffect(() => {
    setAnswers(rows.map(() => ""));
    setOk(rows.map(() => false));
    setChecked(false);
    setStatus("idle");
    setShowHint(false);
  }, [rows.length]);

  const setAnswer = useCallback((i: number, v: string) => {
    setAnswers((prev) => {
      const cp = [...prev];
      cp[i] = v;
      return cp;
    });
  }, []);


    const { addResult } = useResultTracker();
    const { id: qId, title: qTitle } = useQuestionMeta();

  const handleCheck = useCallback(() => {
    const results = rows.map((r, i) => {
      const want = +r.expected.toFixed(3);
      const given = parseLoose(answers[i]);
      return Number.isFinite(given) && Math.abs(given - want) < 0.001;
    });
    setOk(results);
    setChecked(true);
    setStatus(results.every(Boolean) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },results.every(Boolean));
  }, [answers, rows]);

  const handleShowSolution = useCallback(() => {
    const filled = rows.map((r) => fmtValue(+r.expected, r.to));
    setAnswers(filled);
    setOk(rows.map(() => true));
    setChecked(true);
    setStatus("match");
  }, [rows]);

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
        text: "Some answers are wrong. Try again.",
        color: "text-red-700",
        bgColor: "bg-red-100",
        borderColor: "border-red-600",
      };
    return null;
  }, [status]);

  // Expose controls to your global toolbar (no local Controllers/Hint/Check)
  const { setControls } = useQuestionControls();
  const controls = useMemo(
    () => ({
      handleCheck,
      handleShowSolution,
      handleShowHint,
      hint: helpText,
      showHint,
      summary,
    }),
    [handleCheck, handleShowSolution, handleShowHint, helpText, showHint, summary]
  );
  useEffect(() => {
    setControls(controls);
  }, [controls, setControls]);

  // Styles to match the Figma look
  const underlineCls = (good: boolean) =>
    !checked
      ? "border-slate-300 text-slate-800"
      : good
      ? "border-emerald-400 text-emerald-600"
      : "border-rose-400 text-rose-600";

  const unitCls = (good: boolean) =>
    !checked ? "text-slate-700" : good ? "text-emerald-600" : "text-rose-600";

  return (
    <div className="space-y-5">

      {/* 3 columns × 2 rows (auto wraps on small screens) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((r, i) => {
          const good = ok[i];
          return (
            <div key={`${r.value}${r.from}->${r.to}-${i}`} className="flex items-center gap-2">
              <span className="tabular-nums">
                {fmtValue(r.value, r.from)} {r.from}
              </span>
              <span>=</span>

              {/* Input */}
              <input
                value={answers[i] ?? ""}
                onChange={(e) => setAnswer(i, e.target.value)}
                inputMode="decimal"
                className={`w-28 bg-transparent text-center outline-none border-b border-dotted ${underlineCls(
                  good
                )}`}
                placeholder=""
                aria-label={`convert ${r.value} ${r.from} to ${r.to}`}
              />

              {/* Target unit */}
              <span className={unitCls(good)}>{r.to}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArrType_54;
