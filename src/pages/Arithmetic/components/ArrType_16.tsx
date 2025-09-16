import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import useResultTracker from "@/hooks/useResultTracker";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import { useQuestionControls } from "@/context/QuestionControlsContext";

const defaultProblems = [
  { id: 1, question: "3 + 7 + 2 =", answer: 12, type: "addition" },
  { id: 2, question: "1 + 5 + 9 =", answer: 15, type: "addition" },
  { id: 3, question: "4 + 3 + 6 =", answer: 13, type: "addition" },
  { id: 4, question: "5 + 5 + 4 =", answer: 14, type: "addition" },
  { id: 5, question: "8 + 3 + 2 =", answer: 13, type: "addition" },
  { id: 6, question: "6 + 6 + 4 =", answer: 16, type: "addition" },
];

type Problem = { id: number; question: string; answer: number; type: string };

const ArrType_16 = ({
  data = defaultProblems,
  hint,
}: {
  data?: Problem[];
  hint: string;
}) => {
  const [problems] = useState<Problem[]>(data);
  const [userAnswers, setUserAnswers] = useState<number[]>(
    Array(problems.length).fill(NaN)
  );
  const [validation, setValidation] = useState<(boolean | null)[]>(
    Array(problems.length).fill(null)
  );
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  const handleInputChange = useCallback(
    (index: number, value: string) => {
      const newAnswers = [...userAnswers];
      newAnswers[index] = value === "" ? NaN : parseInt(value, 10);
      setUserAnswers(newAnswers);
      if (status) setStatus(null);
    },
    [userAnswers, status]
  );

  const handleCheck = useCallback(() => {
    const newValidation = problems.map((p, i) => p.answer === userAnswers[i]);
    const allCorrect = newValidation.every(Boolean);
    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
    setShowSolution(false);
  }, [problems, userAnswers, addResult, qId, qTitle]);

  const handleShowHint = useCallback(() => {
    setShowHint((v) => !v);
  }, []);

  const handleShowSolution = useCallback(() => {
    setShowSolution(true);
    setValidation(Array(problems.length).fill(true));
    setStatus(null);
  }, [problems.length]);

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
          text: "❌ Oops! Some answers are wrong",
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
                <div
                  key={p.id}
                  className="flex items-end justify-between sm:justify-start sm:space-x-4"
                >
                  <span className="text-xl sm:text-2xl font-medium tracking-wide">
                    {p.question}
                  </span>
                  <input
                    type="number"
                    className={`w-24 sm:w-28 h-12 text-center text-xl font-semibold border-b-2 border-dashed focus:outline-none ${inputClass}`}
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
        </div>
      </div>

      {/* Controls, Hint and Check section */}
      {/* 
      <Controllers
        handleCheck={handleCheck}
        handleShowSolution={handleShowSolution}
        handleShowHint={handleShowHint}
      />
      {showHint && <Hint hint={hint} />}
      <Check summary={summary} /> 
      */}
    </>
  );
};

export default ArrType_16;
