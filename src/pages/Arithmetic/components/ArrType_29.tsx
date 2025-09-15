import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useState } from "react";
import useResultTracker from "@/hooks/useResultTracker";
import { useQuestionMeta } from "@/context/QuestionMetaContext";

/* ---- FractionCard Component ---- */
function FractionCard({
  numerator,
  denominator,
}: {
  numerator: number;
  denominator: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-32 w-28 rounded-xl border-2 border-orange-500 bg-amber-50 p-4">
      <span className="text-3xl font-semibold text-gray-800">{numerator}</span>
      <div className="w-16 h-px bg-gray-800 my-1" />
      <span className="text-3xl font-semibold text-gray-800">{denominator}</span>
    </div>
  );
}

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
      className={`h-40 w-28 rounded-xl border-2 bg-white px-3 text-lg font-semibold outline-none
      text-center font-mono tabular-nums
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

/* ---- ArrType_32 Component ---- */
type Problem = {
  id: number;
  fractions: { num: number; den: number }[];
  expectedOrder: string[];
};

// Dummy data for a single problem set
const DUMMY_DATA: Problem = {
  id: 1,
  fractions: [{ num: 3, den: 6 }, { num: 1, den: 5 }, { num: 3, den: 4 }],
  expectedOrder: ["1/5", "3/6", "3/4"],
};

const HINT_TEXT =
  "Convert each fraction to a decimal to compare their values, then order them from smallest to largest.";

export default function ArrType_32() {
  type Status = "idle" | "match" | "wrong";

  const [state, setState] = useState({
    vals: ["", "", ""],
    checked: false,
  });

  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);
  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  const setVal = (idx: number, v: string) => {
    setState((s) => {
      const nextVals = [...s.vals];
      nextVals[idx] = v;
      return { ...s, vals: nextVals };
    });
  };

  const handleCheck = () => {
    const isCorrect = DUMMY_DATA.expectedOrder.every(
      (expected, idx) => state.vals[idx].trim() === expected
    );

    const allFilled = state.vals.every((v) => v.trim() !== "");

    setState((s) => ({ ...s, checked: true }));

    const ok = isCorrect && allFilled;
    setStatus(ok ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, ok);
  };

  const handleShowSolution = () => {
    setState({
      vals: DUMMY_DATA.expectedOrder,
      checked: true,
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

      {/* Problem */}
      <div className="flex flex-col items-center space-y-12">
        {/* Fraction Cards */}
        <div className="flex space-x-6 mt-6">
          {DUMMY_DATA.fractions.map((f, idx) => (
            <FractionCard key={idx} numerator={f.num} denominator={f.den} />
          ))}
        </div>
        {/* Answer Inputs */}
        <div className="flex space-x-6 mt-8">
          {DUMMY_DATA.expectedOrder.map((exp, idx) => (
            <AnswerInput
              key={idx}
              value={state.vals[idx]}
              onChange={(v) => setVal(idx, v)}
              invalid={state.checked && state.vals[idx].trim() !== exp}
              correct={isSolved || (state.checked && state.vals[idx].trim() === exp)}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-start space-y-4 w-full max-w-xl mt-8">
        <Controllers
          handleCheck={handleCheck}
          handleShowSolution={handleShowSolution}
          handleShowHint={() => setShowHint((v) => !v)}
        />
        {showHint && <Hint hint={HINT_TEXT} />}
        <Check summary={summary} />
      </div>
    </div>
  );
}
