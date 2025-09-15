import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useState } from "react";
import useResultTracker from "@/hooks/useResultTracker";
import { useQuestionMeta } from "@/context/QuestionMetaContext";

/* ---- AnswerInput Component ---- */
function AnswerInput({
  value,
  onChange,
  invalid,
  correct,
}: {
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  correct?: boolean;
}) {
  return (
    <input
      type="text"
      inputMode="text"
      autoComplete="off"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-12 w-24 bg-white px-3 text-lg font-semibold outline-none
      text-center font-mono tabular-nums rounded-lg border-2
      ${
        invalid
          ? "border-rose-500 text-rose-700"
          : correct
          ? "border-emerald-600 text-emerald-700"
          : "border-orange-500 text-slate-800"
      }`}
    />
  );
}

/* ---- FractionCard Component ---- */
function FractionCard({ numerator, denominator }: { numerator: number; denominator: number }) {
  return (
    <div className="flex flex-col items-center justify-center h-28 w-24 rounded-lg border-2 border-orange-500 bg-amber-50/60 p-2">
      <span className="text-2xl font-semibold text-slate-800">{numerator}</span>
      <div className="w-12 h-px bg-slate-800" />
      <span className="text-2xl font-semibold text-slate-800">{denominator}</span>
    </div>
  );
}

/* ---- ArrType_27 Component ---- */
type ProblemSet = {
  id: number;
  fractions: { num: number; den: number }[];
  expectedOrder: string[];
};

// Dummy data for all problem sets
const DUMMY_DATA: ProblemSet[] = [
  {
    id: 1,
    fractions: [{ num: 3, den: 6 }, { num: 1, den: 5 }, { num: 3, den: 4 }],
    expectedOrder: ["1/5", "3/6", "3/4"],
  },
  {
    id: 2,
    fractions: [{ num: 1, den: 2 }, { num: 7, den: 8 }, { num: 2, den: 5 }],
    expectedOrder: ["2/5", "1/2", "7/8"],
  },
  {
    id: 3,
    fractions: [{ num: 9, den: 10 }, { num: 2, den: 4 }, { num: 3, den: 8 }],
    expectedOrder: ["3/8", "2/4", "9/10"],
  },
  {
    id: 4,
    fractions: [{ num: 3, den: 6 }, { num: 1, den: 5 }, { num: 3, den: 4 }],
    expectedOrder: ["1/5", "3/6", "3/4"],
  },
  {
    id: 5,
    fractions: [{ num: 1, den: 2 }, { num: 7, den: 8 }, { num: 2, den: 5 }],
    expectedOrder: ["2/5", "1/2", "7/8"],
  },
  {
    id: 6,
    fractions: [{ num: 9, den: 10 }, { num: 2, den: 4 }, { num: 3, den: 8 }],
    expectedOrder: ["3/8", "2/4", "9/10"],
  },
];

const HINT_TEXT = "Convert each fraction to a decimal to compare their values, then order them from smallest to largest.";

export default function ArrType_27() {
  type Status = "idle" | "match" | "wrong";

  const [state, setState] = useState<
    Record<number, { vals: string[]; checked: boolean }>
  >(() => {
    const init: Record<number, { vals: string[]; checked: boolean }> = {};
    DUMMY_DATA.forEach((p) => (init[p.id] = { vals: ["", "", ""], checked: false }));
    return init;
  });

  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);
  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  const setVal = (id: number, idx: number, v: string) => {
    setState((s) => {
      const next = { ...s };
      const current = next[id];
      const nextVals = [...current.vals];
      nextVals[idx] = v;
      next[id] = { ...current, vals: nextVals };
      return next;
    });
  };

  const handleCheckAll = () => {
    let anyWrong = false;
    let allFilledAndCorrect = true;

    setState((s) => {
      const next = { ...s };
      DUMMY_DATA.forEach((p) => {
        const current = next[p.id];
        const isCorrect = p.expectedOrder.every((expected, idx) => current.vals[idx].trim() === expected);

        if (!isCorrect) anyWrong = true;
        if (current.vals.some((v) => v.trim() === "")) allFilledAndCorrect = false;

        next[p.id] = { ...current, checked: true };
      });
      return next;
    });

    const ok = !anyWrong && allFilledAndCorrect;
    setStatus(ok ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, ok);
  };

  const handleShowSolution = () => {
    setState((s) => {
      const next = { ...s };
      DUMMY_DATA.forEach((p) => {
        next[p.id] = { vals: p.expectedOrder, checked: true };
      });
      return next;
    });
    setStatus("match");
  };

  interface Summary {
    text: string;
    color: string;
    bgColor: string;
    borderColor: string;
  }

  const summary: Summary | null =
    status === "match"
      ? {
          text: "🎉 All correct! Great job.",
          color: "text-green-700",
          bgColor: "bg-green-100",
          borderColor: "border-green-600",
        }
      : status === "wrong"
      ? {
          text: "❌ Some answers are wrong. Check again.",
          color: "text-red-700",
          bgColor: "bg-red-100",
          borderColor: "border-red-600",
        }
      : null;

  const isSolved = status === "match";

  return (
    <div className="flex flex-col items-center justify-start space-y-8 w-full px-4 py-8">
      {/* Header */}
      <div className="text-left w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-2">Question 1</h2>
        <p className="text-slate-600 text-lg">From small to large.</p>
      </div>

      {/* Problem Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-8 w-full max-w-4xl">
        {DUMMY_DATA.map((p) => {
          const current = state[p.id];
          const isCorrect = isSolved || (current.checked && p.expectedOrder.every((expected, idx) => current.vals[idx].trim() === expected));
          const isInvalid = current.checked && !isCorrect;

          return (
            <div key={p.id} className="flex flex-col items-center space-y-8">
              {/* Fraction Cards */}
              <div className="flex space-x-4">
                {p.fractions.map((f, idx) => (
                  <FractionCard key={idx} numerator={f.num} denominator={f.den} />
                ))}
              </div>
              {/* Answer Inputs */}
              <div className="flex space-x-4">
                {p.expectedOrder.map((exp, idx) => (
                  <AnswerInput
                    key={idx}
                    value={current.vals[idx]}
                    onChange={(v) => setVal(p.id, idx, v)}
                    invalid={isInvalid && current.vals[idx].trim() !== exp}
                    correct={isCorrect}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-start space-y-4 w-full max-w-xl mt-8">
        <Controllers
          handleCheck={handleCheckAll}
          handleShowSolution={handleShowSolution}
          handleShowHint={() => setShowHint((v) => !v)}
        />
        {showHint && <Hint hint={HINT_TEXT} />}
        <Check summary={summary} />
      </div>
    </div>
  );
}