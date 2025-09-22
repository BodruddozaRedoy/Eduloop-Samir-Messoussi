import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* --------------------------------
   Demo data & hint (top of file)
--------------------------------- */
type Item = { num: number; den: number; multiplier: number };

// Screenshot set (3 × 2)
export const data: Item[] = [
  { num: 1, den: 7,  multiplier: 210 },
  { num: 1, den: 9,  multiplier: 72  },
  { num: 1, den: 10, multiplier: 250 },
  { num: 1, den: 7,  multiplier: 210 },
  { num: 1, den: 9,  multiplier: 72  },
  { num: 1, den: 10, multiplier: 250 },
];

export const hint =
  "Use: (a/b) × n = (a × n) ÷ b. For unit fractions: 1/7 × 210 = 210 ÷ 7 = 30, 1/9 × 72 = 8, 1/10 × 250 = 25.";

/* --------------------------------
   Helpers & types
--------------------------------- */
type Status = "idle" | "match" | "wrong";
interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const parseNum = (v: string) => {
  const n = parseFloat((v ?? "").toString().replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
};

const expectedValue = (it: Item) => (it.num * it.multiplier) / it.den;

/* --------------------------------
   Small subcomponent: fraction card
--------------------------------- */
const FractionCard = ({ n, d }: { n: number; d: number }) => (
  <div className="grid h-16 w-12 place-items-center rounded-md border-2 border-orange-400 bg-white">
    <div className="flex flex-col items-center text-slate-800">
      <span className="text-lg leading-none tabular-nums">{n}</span>
      <span className="my-0.5 block h-[1px] w-7 bg-slate-400" />
      <span className="text-lg leading-none tabular-nums">{d}</span>
    </div>
  </div>
);

/* --------------------------------
   Component
--------------------------------- */
const ArrType_46: React.FC = () => {
  const items = useMemo(() => data.slice(0, 6), []);
  const ROWS_PER_COL = 3;
  const columns = useMemo(
    () => [items.slice(0, ROWS_PER_COL), items.slice(ROWS_PER_COL, ROWS_PER_COL * 2)],
    [items]
  );

  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [checked, setChecked] = useState(false);

  // user inputs & correctness (indexed globally 0..5)
  const [answers, setAnswers] = useState<string[]>(() => items.map(() => ""));
  const [oks, setOks] = useState<boolean[]>(() => items.map(() => false));

  const setAnswer = useCallback((i: number, v: string) => {
    setAnswers((prev) => {
      const cp = [...prev];
      cp[i] = v;
      return cp;
    });
  }, []);

  const handleCheck = useCallback(() => {
    const res = items.map((it, i) => {
      const given = parseNum(answers[i]);
      const want = expectedValue(it);
      return Number.isFinite(given) && Math.abs(given - want) < 0.01;
    });
    setOks(res);
    setChecked(true);
    setStatus(res.every(Boolean) ? "match" : "wrong");
  }, [answers, items]);

  const handleShowSolution = useCallback(() => {
    setAnswers(
      items.map((it) => {
        const val = expectedValue(it);
        return Number.isInteger(val) ? String(val) : val.toFixed(2);
      })
    );
    setOks(items.map(() => true));
    setChecked(true);
    setStatus("match");
  }, [items]);

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

  // Expose to global Controllers/Hint/Check
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
    [handleCheck, handleShowHint, handleShowSolution, showHint, summary]
  );
  useEffect(() => {
    setControls(controls);
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
        <p className="text-sm text-slate-600">Calculate.</p>
      </div>

      {/* Exactly two columns × three rows */}
      <div className="grid grid-cols-1 gap-x-12 gap-y-3 md:grid-cols-2">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="space-y-3">
            {col.map((it, r) => {
              const i = colIdx * ROWS_PER_COL + r; // global index 0..5
              return (
                <div
                  key={`${it.num}/${it.den}x${it.multiplier}-${i}`}
                  className="flex items-center gap-3 text-[15px] leading-none text-slate-900"
                >
                  <FractionCard n={it.num} d={it.den} />
                  <span className="text-slate-700">×</span>
                  <span className="tabular-nums">{it.multiplier}</span>
                  <span className="text-slate-700">=</span>

                  <input
                    value={answers[i]}
                    onChange={(e) => setAnswer(i, e.target.value)}
                    inputMode="decimal"
                    className={`w-20 bg-transparent text-center outline-none border-b border-dotted ${inputCls(
                      oks[i]
                    )}`}
                    placeholder=""
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {/* No local Controllers / Hint / Check — handled globally via context */}
    </div>
  );
};

export default ArrType_46;
