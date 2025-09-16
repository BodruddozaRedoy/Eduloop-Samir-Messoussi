import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useEffect, useMemo, useState, useCallback } from "react";
import useResultTracker from "@/hooks/useResultTracker";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import { useQuestionControls } from "@/context/QuestionControlsContext";

type Problem = { id: number; question: string; answer: number; type: string };

const ArrType_10 = ({ data, hint }: { data: Problem[]; hint: string }) => {
  const [problems] = useState(data);

  const [userAnswers, setUserAnswers] = useState<number[]>(
    Array(problems.length).fill(NaN)
  );
  const [validation, setValidation] = useState<(boolean | null)[]>(
    Array(problems.length).fill(null)
  );
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const { setControls } = useQuestionControls();

  const handleInputChange = useCallback((index: number, value: string) => {
    setUserAnswers((prev) => {
      const copy = [...prev];
      copy[index] = value === "" ? NaN : parseInt(value);
      return copy;
    });
  }, []);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  const handleCheck = useCallback(() => {
    const newValidation = problems.map((p, i) => p.answer === userAnswers[i]);
    const allCorrect = newValidation.every(Boolean);
    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
    setShowSolution(false);
  }, [problems, userAnswers, addResult, qId, qTitle]);

  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  const handleShowSolution = useCallback(() => {
    setShowSolution(true);
    setValidation(Array(problems.length).fill(true));
    setStatus(null); // no summary after solution
  }, [problems.length]);

  const summary = useMemo(() => {
    if (status === "match") {
      return {
        text: "🎉 All Correct! Great job",
        color: "text-green-600",
        bgColor: "bg-green-100",
        borderColor: "border-green-600",
      };
    }
    if (status === "wrong") {
      return {
        text: "❌ Some answers are wrong. Check again.",
        color: "text-red-600",
        bgColor: "bg-red-100",
        borderColor: "border-red-600",
      };
    }
    return null;
  }, [status]);

  // ✅ memoized controls
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
        (k) => (controls as any)[k] !== (prev as any)[k]
      );
      return changed ? controls : prev;
    });
  }, [controls, setControls]);

  return (
    <div className="flex items-center justify-center">
      <div className="rounded-lg w-full">
        {/* Abacus Image */}
        <div className="mb-12">
          <img src="/images/arr1.png" alt="Abacus" className="" />
        </div>

        {/* Math Problems Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-12">
          {problems.map((p, idx) => {
            const isCorrect = validation[idx];
            const inputClass =
              isCorrect === true
                ? "border-green-600 text-green-600"
                : isCorrect === false
                ? "border-red-600 text-red-600"
                : "border-gray-400 text-gray-900";

            return (
              <div key={p.id} className="flex items-end space-x-2">
                <span className="text-lg text-gray-900 tracking-wide">
                  {p.question.split(" ").map((part, partIdx) => (
                    <span
                      key={partIdx}
                      className="border-b-2 border-dashed border-gray-400 mr-2"
                    >
                      {part}
                    </span>
                  ))}
                </span>
                <input
                  type="number"
                  className={`w-16 h-8 text-center text-lg font-semibold border-b-2 border-dashed focus:outline-none ${inputClass}`}
                  value={
                    showSolution
                      ? p.answer
                      : isNaN(userAnswers[idx])
                      ? ""
                      : userAnswers[idx]
                  }
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  readOnly={showSolution}
                />
              </div>
            );
          })}
        </div>

        {/* Controllers/Hint/Check are rendered globally */}
      </div>
    </div>
  );
};

export default ArrType_10;
