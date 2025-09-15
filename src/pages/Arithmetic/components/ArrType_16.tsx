import React, { useState } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";

import useResultTracker from "@/hooks/useResultTracker";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import { useQuestionControls } from "@/context/QuestionControlsContext";

  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

    const newValidation = problems.map((p, i) => p.answer === userAnswers[i]);
    const allCorrect = newValidation.every(Boolean);

    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");

    const wrong = newValidation
      .map((isCorrect, i) => (isCorrect ? null : i + 1))
      .filter((n): n is number => n !== null);
    setWrongAnswers(wrong);

    addResult({ id: qId, title: qTitle }, allCorrect);


  const handleShowHint = useCallback(() => {
    setShowHint((v) => !v);
  }, []);

  const handleShowSolution = useCallback(() => {
    setShowSolution(true);
    setValidation(Array(problems.length).fill(true));


  const summary = useMemo(() => {
    return status === "match"
      ? {
          text: "🎉 Correct! Good Job",
          color: "text-green-600",
          bgColor: "bg-green-100",
          borderColor: "border-green-600",
        }
      : status === "wrong"
      ? {
          text:
            wrongAnswers.length > 0
              ? `❌ Oops! These answers are wrong: ${wrongAnswers.join(", ")}`
              : "❌ Oops! Some answers are wrong",
          color: "text-red-600",
          bgColor: "bg-red-100",
          borderColor: "border-red-600",
        }
      : null;
  }, [status]);

  useEffect(() => {
    setControls({
      handleCheck,
      handleShowHint,
      handleShowSolution,
      hint,
      showHint,
      summary,
    });
  }, [setControls, handleCheck, handleShowHint, handleShowSolution, hint, showHint, summary]);

  return (
    <>
      <div className="flex flex-col items-center justify-center font-sans text-gray-800 relative">
        <div className="w-full rounded-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-16 mb-4">
            {problems.map((p, idx) => {
              const isCorrect = validation[idx];
              const inputClass =
                isCorrect === true
                  ? "border-green-600 text-green-600"
                  : isCorrect === false
                  ? "border-red-600 text-red-600"
                  : "border-gray-400 text-gray-900";

              return (
                <div key={p.id} className="flex items-end justify-between sm:justify-start sm:space-x-4">
                  <span className="text-xl sm:text-2xl font-medium tracking-wide">{p.question}</span>
                  <input
                    type="number"
                    className={`w-24 sm:w-28 h-12 text-center text-xl font-semibold border-b-2 border-dashed focus:outline-none ${inputClass}`}
                    value={showSolution ? p.answer : isNaN(userAnswers[idx]) ? "" : userAnswers[idx]}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    readOnly={showSolution} // sudhu solution dekhano jonne
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>


    </>
  );
};

export default ArrType_16;
