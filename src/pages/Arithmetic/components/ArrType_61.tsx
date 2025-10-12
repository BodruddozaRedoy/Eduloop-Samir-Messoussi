import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* -----------------------------
   Demo data (all different) & hint
------------------------------ */

export type SumRow = { terms: number[]; expected?: number };

export const data: SumRow[] = [
  { terms: [80, 300, 6000, 9],   expected: 6389 },
  { terms: [120, 450, 5200, 7],  expected: 5777 },
  { terms: [90, 700, 3000, 5],   expected: 3795 },
  { terms: [15, 850, 1200, 6],   expected: 2071 },
  { terms: [40, 900, 4500, 2],   expected: 5442 },
  { terms: [75, 125, 8000, 4],   expected: 8204 },
  { terms: [35, 680, 1100, 3],   expected: 1818 },
  { terms: [60, 240, 9500, 1],   expected: 9801 },
  { terms: [25, 375, 2000, 8],   expected: 2408 },
  { terms: [10, 410, 700, 9],    expected: 1129 },
];

export const hint =
  "Add by place value and regroup if helpful. Example: 80 + 300 + 6000 + 9 = (6000) + (300) + (80) + 9 = 6389.";

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

const parseLoose = (v: string | number | null | undefined) => {
  if (typeof v === "number") return v;
  if (v == null) return NaN;
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
};
const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

/** Normalize incoming rows; compute expected if omitted; drop invalid. */
const normalize = (incoming?: SumRow[]) => {
  const src = Array.isArray(incoming) && incoming.length ? incoming : data;
  const rows = src
    .map((r: any) => {
      const terms = Array.isArray(r?.terms)
        ? (r.terms as any[]).map((t) => parseLoose(t)).filter((n) => Number.isFinite(n))
        : [];
      const expected = Number.isFinite(parseLoose(r?.expected))
        ? parseLoose(r?.expected)
        : sum(terms);
      return { terms: terms as number[], expected };
    })
    .filter((r) => r.terms.length > 0 && Number.isFinite(r.expected)) as Required<SumRow>[];
  return rows.length ? rows : data.map((r) => ({ terms: r.terms, expected: r.expected ?? sum(r.terms) }));
};

/* -----------------------------
   Component
------------------------------ */
type Props = {
  data?: SumRow[];
  hint?: string;
};

const ArrType_61: React.FC<Props> = ({ data: incoming, hint: incomingHint }) => {
  const rows = useMemo(() => normalize(incoming), [incoming]);
  const helpText = incomingHint ?? hint;

  const [answers, setAnswers] = useState<string[]>(() => rows.map(() => ""));
  const [ok, setOk] = useState<boolean[]>(() => rows.map(() => false));
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

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

  const handleCheck = useCallback(() => {
    const results = rows.map((r, i) => {
      const want = Math.round(r.expected);
      const given = parseLoose(answers[i]);
      return Number.isFinite(given) && Math.round(given) === want;
    });
    setOk(results);
    setChecked(true);
    setStatus(results.every(Boolean) ? "match" : "wrong");
  }, [answers, rows]);

  const handleShowSolution = useCallback(() => {
    setAnswers(rows.map((r) => String(Math.round(r.expected))));
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

  // Expose to global toolbar
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

  const underlineCls = (good: boolean) =>
    !checked
      ? "border-slate-300 text-slate-900"
      : good
      ? "border-emerald-400 text-emerald-600"
      : "border-rose-400 text-rose-600";

  return (
    <div className="space-y-5">

      {/* Two columns, responsive */}
      <div className="grid grid-cols-1 gap-y-3 gap-x-12 md:grid-cols-2">
        {rows.map((r, i) => {
          const good = ok[i];
          return (
            <div key={`row-${i}`} className="flex items-center gap-2 text-[15px] leading-none">
              <div className="tabular-nums text-slate-900">
                {r.terms.map((t, idx) => (
                  <span key={`${t}-${idx}`}>{idx > 0 ? " + " : ""}{t}</span>
                ))}{" "}
                ={" "}
              </div>
              <input
                value={answers[i] ?? ""}
                onChange={(e) => setAnswer(i, e.target.value)}
                inputMode="numeric"
                className={`w-24 bg-transparent text-center outline-none border-b border-dotted ${underlineCls(
                  good
                )}`}
                placeholder=""
                aria-label={`sum of row ${i + 1}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArrType_61;
