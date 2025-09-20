import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* --------------------------------
   Demo data & hint (top of file)
--------------------------------- */
// Each equation row carries its *expected* result.
// You can pass the same shape via props later.
export type MoneyRow = { mult: number; price: number; expected: number }; // £
export type KgRow    = { mult: number; kg: number;    expected: number }; // kg

export const data = {
  left: [
    { mult: 4, price: 4.6,  expected: 23.0  },  // 4 × £4.60 = £23.00
    { mult: 3, price: 7.25, expected: 21.75 },  // 3 × £7.25 = £21.75
    { mult: 5, price: 2.99, expected: 14.95 },  // 5 × £2.99 = £14.95
    { mult: 6, price: 1.5,  expected: 9.0   },  // 6 × £1.50 = £9.00
    { mult: 2, price: 12.2, expected: 24.4  },  // 2 × £12.20 = £24.40
    { mult: 8, price: 0.75, expected: 6.0   },  // 8 × £0.75 = £6.00
  ] as MoneyRow[],
  right: [
    { mult: 4, kg: 7.8,  expected: 31.2 },      // 4 × 7.8 kg = 31.2 kg
    { mult: 3, kg: 2.55, expected: 7.65 },      // 3 × 2.55 kg = 7.65 kg
    { mult: 5, kg: 1.2,  expected: 6.0  },      // 5 × 1.2 kg = 6.0 kg
    { mult: 2, kg: 9.75, expected: 19.5 },      // 2 × 9.75 kg = 19.5 kg
    { mult: 7, kg: 0.35, expected: 2.45 },      // 7 × 0.35 kg = 2.45 kg
    { mult: 8, kg: 3.9,  expected: 31.2 },      // 8 × 3.9 kg = 31.2 kg
  ] as KgRow[],
};

export const hint =
  "Split to tens/ones/decimals if helpful. Validate your total: e.g., 4 × £4.60 = 4 × (4 + 0.6) = 16 + 2.4 = £18.4 (check again!) — actually £23.0; or 4 × 7.8 kg = 31.2 kg.";

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

// Parse relaxed numeric input like "£23.00", "23", "31.2kg"
const parseLoose = (v: string | number | null | undefined) => {
  if (typeof v === "number") return v;
  if (v == null) return NaN;
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
};

const fmtMoney = (n: number) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const stripTrailingZeros = (n: number) => {
  const s = n.toFixed(2);
  return s.replace(/\.?0+$/, ""); // "31.20" -> "31.2", "6.00" -> "6"
};

/* --------------------------------
   Props (for later) + normalizer
--------------------------------- */
type Props = {
  data?: { left?: MoneyRow[]; right?: KgRow[] };
  hint?: string;
};

const normalize = (incoming?: Props["data"]) => {
  const left = Array.isArray(incoming?.left) && incoming!.left!.length ? incoming!.left! : data.left;
  const right =
    Array.isArray(incoming?.right) && incoming!.right!.length ? incoming!.right! : data.right;

  // Coerce and keep only finite numbers
  const cleanLeft: MoneyRow[] = left
    .map((r) => ({
      mult: parseLoose(r?.mult),
      price: parseLoose(r?.price),
      expected: parseLoose(r?.expected),
    }))
    .filter((r) => Number.isFinite(r.mult) && Number.isFinite(r.price) && Number.isFinite(r.expected)) as MoneyRow[];

  const cleanRight: KgRow[] = right
    .map((r) => ({
      mult: parseLoose(r?.mult),
      kg: parseLoose(r?.kg),
      expected: parseLoose(r?.expected),
    }))
    .filter((r) => Number.isFinite(r.mult) && Number.isFinite(r.kg) && Number.isFinite(r.expected)) as KgRow[];

  // If nothing valid, fall back to demo
  return {
    left: cleanLeft.length ? cleanLeft : data.left,
    right: cleanRight.length ? cleanRight : data.right,
  };
};

/* --------------------------------
   Component
--------------------------------- */
const ArrType_50: React.FC<Props> = ({ data: incoming, hint: incomingHint }) => {
  const spec = useMemo(() => normalize(incoming), [incoming]);
  const helpText = incomingHint ?? hint;

  // Build flat indices: left 0..L-1, right L..L+R-1
  const L = spec.left.length;
  const R = spec.right.length;
  const total = L + R;

  const [answers, setAnswers] = useState<string[]>(() => Array(total).fill(""));
  const [ok, setOk] = useState<boolean[]>(() => Array(total).fill(false));
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  // Reset if spec changes
  useEffect(() => {
    const newTotal = spec.left.length + spec.right.length;
    setAnswers(Array(newTotal).fill(""));
    setOk(Array(newTotal).fill(false));
    setChecked(false);
    setStatus("idle");
    setShowHint(false);
  }, [spec.left.length, spec.right.length]);

  const setAnswer = useCallback((i: number, v: string) => {
    setAnswers((prev) => {
      const cp = [...prev];
      cp[i] = v;
      return cp;
    });
  }, []);

  const handleCheck = useCallback(() => {
    const results: boolean[] = Array(total).fill(false);

    // Money (left)
    for (let i = 0; i < L; i++) {
      const want = +spec.left[i].expected.toFixed(2);
      const given = parseLoose(answers[i]);
      results[i] = Number.isFinite(given) && Math.abs(given - want) < 0.01;
    }

    // Kg (right)
    for (let i = 0; i < R; i++) {
      const idx = L + i;
      const want = +spec.right[i].expected.toFixed(2);
      const given = parseLoose(answers[idx]);
      results[idx] = Number.isFinite(given) && Math.abs(given - want) < 0.01;
    }

    setOk(results);
    setChecked(true);
    setStatus(results.every(Boolean) && results.length === total ? "match" : "wrong");
  }, [answers, L, R, spec.left, spec.right, total]);

  const handleShowSolution = useCallback(() => {
    const filled: string[] = Array(total).fill("");

    // Money as 2dp (currency)
    for (let i = 0; i < L; i++) {
      const want = +spec.left[i].expected.toFixed(2);
      filled[i] = fmtMoney(want);
    }
    // Kg stripped zeros (tidy)
    for (let i = 0; i < R; i++) {
      const idx = L + i;
      const want = +spec.right[i].expected.toFixed(2);
      filled[idx] = stripTrailingZeros(want);
    }

    setAnswers(filled);
    setOk(Array(total).fill(true));
    setChecked(true);
    setStatus("match");
  }, [L, R, spec.left, spec.right, total]);

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

  // Expose to your global toolbar (no local Controllers/Hint/Check here)
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
      ? "border-slate-300 text-slate-800"
      : good
      ? "border-emerald-400 text-emerald-600"
      : "border-rose-400 text-rose-600";

  const unitCls = (good: boolean) =>
    !checked ? "text-slate-700" : good ? "text-emerald-600" : "text-rose-600";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Question 1</h2>
      </div>

      <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
        {/* Left: money */}
        <div className="space-y-3">
          {spec.left.map((row, i) => {
            const good = ok[i];
            return (
              <div key={`L-${i}`} className="flex items-center gap-2 text-[15px] leading-none">
                <span className="tabular-nums">{row.mult} ×</span>
                <span className="tabular-nums">£{fmtMoney(row.price)}</span>
                <span>=</span>
                <span className={unitCls(good)}>£</span>
                <input
                  value={answers[i] ?? ""}
                  onChange={(e) => setAnswer(i, e.target.value)}
                  inputMode="decimal"
                  className={`w-24 bg-transparent outline-none border-b border-dotted ${underlineCls(
                    good
                  )}`}
                />
              </div>
            );
          })}
        </div>

        {/* Right: kilograms */}
        <div className="space-y-3">
          {spec.right.map((row, r) => {
            const idx = L + r;
            const good = ok[idx];
            return (
              <div key={`R-${r}`} className="flex items-center gap-2 text-[15px] leading-none">
                <span className="tabular-nums">{row.mult} ×</span>
                <span className="tabular-nums">{stripTrailingZeros(row.kg)}</span>
                <span className={unitCls(good)}>kg</span>
                <span>=</span>
                <input
                  value={answers[idx] ?? ""}
                  onChange={(e) => setAnswer(idx, e.target.value)}
                  inputMode="decimal"
                  className={`w-24 bg-transparent text-center outline-none border-b border-dotted ${underlineCls(
                    good
                  )}`}
                />
                <span className={unitCls(good)}>kg</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ArrType_50;
