import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* --------------------------------
   Demo data & hint (top of file)
--------------------------------- */
type Fraction = { n: number; d: number };
type Item = { id: string; fracs: Fraction[] }; // order shown is the one to judge

export const data: Item[] = [
  { id: "A", fracs: [{ n: 1, d: 3 }, { n: 1, d: 6 }, { n: 3, d: 4 }] },
  { id: "B", fracs: [{ n: 5, d: 4 }, { n: 5, d: 3 }, { n: 5, d: 1 }] },
  { id: "C", fracs: [{ n: 1, d: 3 }, { n: 1, d: 6 }, { n: 3, d: 4 }] },
  { id: "D", fracs: [{ n: 1, d: 3 }, { n: 1, d: 6 }, { n: 3, d: 4 }] },
];

export const hint =
  "From small to large means ascending order. Convert each fraction to decimals (or common denominators) and compare: e.g., 1/6 ≈ 0.166, 1/3 ≈ 0.333, 3/4 = 0.75.";

/* --------------------------------
   Helpers & types
--------------------------------- */
type Status = "idle" | "match" | "wrong";
type Choice = "true" | "false" | null;

interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const fracVal = (f: Fraction) => f.n / f.d;
const isAscending = (arr: Fraction[]) =>
  arr.every((f, i) => (i === 0 ? true : fracVal(arr[i - 1]) <= fracVal(f))) &&
  arr.some((f, i) => (i > 0 ? fracVal(arr[i - 1]) < fracVal(f) : false));

/* --------------------------------
   Component
--------------------------------- */
const ArrType_43: React.FC = ({data,hint}:any) => {
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [checked, setChecked] = useState(false);

  // per-group choice: 'true' | 'false' | null
  const [choices, setChoices] = useState<Choice[]>(() => data.map(() => null));
  // per-group correctness after check
  const [ok, setOk] = useState<boolean[]>(() => data.map(() => false));

  const correctAnswers = useMemo<("true" | "false")[]>(
    () => data.map((g) => (isAscending(g.fracs) ? "true" : "false")),
    []
  );

  const pick = useCallback((i: number, c: "true" | "false") => {
    setChoices((prev) => {
      const cp = [...prev];
      cp[i] = prev[i] === c ? null : c; // toggle same, radio-like otherwise
      return cp;
    });
  }, []);

  const handleCheck = useCallback(() => {
    const results = choices.map((c, i) => c !== null && c === correctAnswers[i]);
    setOk(results);
    setChecked(true);
    setStatus(results.every(Boolean) && results.length === data.length ? "match" : "wrong");
  }, [choices, correctAnswers]);

  const handleShowSolution = useCallback(() => {
    setChoices(correctAnswers);
    setOk(data.map(() => true));
    setChecked(true);
    setStatus("match");
  }, [correctAnswers]);

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

  // Expose to GLOBAL Controllers/Hint/Check (no local render of those)
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

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        {data.map((g, idx) => {
          const choice = choices[idx];
          const isRight = ok[idx];

          const boxBorder =
            !checked
              ? "border-orange-500"
              : choice === null
              ? "border-rose-400"
              : isRight
              ? "border-emerald-500"
              : "border-rose-500";

          const chk = (label: "true" | "false") => {
            const active = choice === label;
            const good = checked && active && isRight;
            const bad = checked && active && !isRight;
            const mark =
              active && (!checked || good)
                ? "bg-emerald-500"
                : active && bad
                ? "bg-rose-500"
                : "bg-transparent";
            return (
              <button
                type="button"
                onClick={() => pick(idx, label)}
                className="flex items-center gap-2"
              >
                <span className={`grid h-5 w-5 place-items-center rounded-[3px] border-2 ${boxBorder}`}>
                  <span className={`h-3 w-3 rounded-[2px] ${mark}`} />
                </span>
                <span className="text-slate-800">{label}</span>
              </button>
            );
          };

          return (
            <div key={g.id} className="space-y-3">
              {/* fraction cards row */}
              <div className="flex items-center gap-3">
                {g.fracs.map((f, i) => (
                  <FractionCard key={i} f={f} />
                ))}
              </div>

              {/* true/false */}
              <div className="space-y-2">
                {chk("true")}
                {chk("false")}
              </div>
            </div>
          );
        })}
      </div>
      {/* No local Controllers/Hint/Check — global UI handles them via context */}
    </div>
  );
};

export default ArrType_43;

/* --------------------------------
   Small subcomponent: fraction card
--------------------------------- */
const FractionCard = ({ f }: { f: Fraction }) => (
  <div className="grid h-16 w-12 place-items-center rounded-md border-2 border-orange-400 bg-white">
    <div className="flex flex-col items-center text-slate-800">
      <span className="text-lg leading-none">{f.n}</span>
      <span className="my-0.5 block h-[1px] w-7 bg-slate-400" />
      <span className="text-lg leading-none">{f.d}</span>
    </div>
  </div>
);
