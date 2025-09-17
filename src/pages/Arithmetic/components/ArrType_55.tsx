import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* --------------------------------
   Demo data & hint (top of file)
--------------------------------- */
export type Problem = { a: number; b: number; expected: number };

// You can pass your own problems via props with the same shape.
// These are just example rows; in your screenshot the same 382 × 4 is repeated.
export const data: Problem[] = [
  { a: 382,  b: 4, expected: 1528 },
  { a: 746,  b: 3, expected: 2238 },
  { a: 609,  b: 7, expected: 4263 },
  { a: 1203, b: 8, expected: 9624 },
];

export const hint =
  "Calculate. 1) Calculate using figures. 2) Calculate using figures or column-wise. (Example: 382 × 4 = 1528.)";

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

// relaxed numeric parsing (accepts stray spaces etc.)
const parseLoose = (v: string | number | null | undefined) => {
  if (typeof v === "number") return v;
  if (v == null) return NaN;
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
};

// normalize incoming data
const normalize = (incoming?: Problem[]) => {
  const src = Array.isArray(incoming) && incoming.length ? incoming : data;
  const rows = src
    .map((r: any) => ({
      a: parseLoose(r?.a),
      b: parseLoose(r?.b),
      expected: parseLoose(r?.expected),
    }))
    .filter((r) => Number.isFinite(r.a) && Number.isFinite(r.b) && Number.isFinite(r.expected)) as Problem[];
  return rows.length ? rows : data;
};

/* --------------------------------
   Small subcomponent: spaced digits row
--------------------------------- */
const DigitsRow = ({ n }: { n: number }) => {
  const digits = String(Math.trunc(Math.abs(n))).split("");
  return (
    <div className="flex items-end gap-4 tabular-nums text-[18px] leading-none text-slate-900">
      {digits.map((d, i) => (
        <span key={`${d}-${i}`}>{d}</span>
      ))}
    </div>
  );
};

/* --------------------------------
   Component
--------------------------------- */
type Props = {
  data?: Problem[];
  hint?: string;
};

const ArrType_55: React.FC<Props> = ({ data: incoming, hint: incomingHint }) => {
  const rows = useMemo(() => normalize(incoming), [incoming]);
  const helpText = incomingHint ?? hint;

  const [answers, setAnswers] = useState<string[]>(() => rows.map(() => ""));
  const [ok, setOk] = useState<boolean[]>(() => rows.map(() => false));
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  // reset if row count changes
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
      const want = Math.trunc(r.expected); // products are integers
      const given = parseLoose(answers[i]);
      return Number.isFinite(given) && Math.round(given) === want;
    });
    setOk(results);
    setChecked(true);
    setStatus(results.every(Boolean) ? "match" : "wrong");
  }, [answers, rows]);

  const handleShowSolution = useCallback(() => {
    setAnswers(rows.map((r) => String(Math.trunc(r.expected))));
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
      <div>
        <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">
          Calculate.<br />
          1. Calculate using figures.<br />
          2. Calculate using figures or column-wise.
        </p>
      </div>

      {/* Four mini cards, responsive */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        {rows.map((r, i) => {
          const good = ok[i];
          return (
            <div key={`${r.a}x${r.b}-${i}`} className="flex flex-col items-center">
              {/* Top number as spaced digits */}
              <DigitsRow n={r.a} />

              {/* multiplier row */}
              <div className="mt-1 flex items-center gap-2 text-slate-700">
                <span className="tabular-nums">{r.b}</span>
                <span className="font-medium">x</span>
              </div>

              {/* divider */}
              <div className="mt-1 h-[1px] w-28 bg-slate-400" />

              {/* answer input with dotted underline */}
              <input
                value={answers[i] ?? ""}
                onChange={(e) => setAnswer(i, e.target.value)}
                inputMode="numeric"
                aria-label={`product of ${r.a} × ${r.b}`}
                className={`mt-2 w-28 bg-transparent text-center outline-none border-b border-dotted ${underlineCls(
                  good
                )}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArrType_55;

