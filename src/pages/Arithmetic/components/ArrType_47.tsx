
import React, { useState, useCallback, useEffect, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// Data for the fraction comparison problems
const problemsJSON = [
  {
    id: 1,
    options: [
      { text: "3/4 part of $80", value: 60 },
      { text: "2/3 part of $60", value: 40 },
    ],
    correctAnswer: 0, // Index of the correct option
  },
  {
    id: 2,
    options: [
      { text: "3/10 part of $150", value: 45 },
      { text: "3/4 part of $48", value: 36 },
    ],
    correctAnswer: 0,
  },
  {
    id: 3,
    options: [
      { text: "1/4 part of $120", value: 30 },
      { text: "1/3 part of $150", value: 50 },
    ],
    correctAnswer: 1,
  },
  {
    id: 4,
    options: [
      { text: "1/3 part of $120", value: 40 },
      { text: "1/10 part of $350", value: 35 },
    ],
    correctAnswer: 0,
  },
];

const renderFractionText = (fractionText: string) => {
  const [fraction, rest] = fractionText.split(' part of ');
  const [numerator, denominator] = fraction.split('/');
  
  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center mr-2 text-xl font-medium">
        <span>{numerator}</span>
        <hr className="w-6 border-t-2 border-gray-600 my-0.5" />
        <span>{denominator}</span>
      </div>
      <span className="text-lg">{`part of ${rest}`}</span>
    </div>
  );
};


export default function ArrType_47({ hint }: { hint: string }) {
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(problemsJSON.length).fill(null)
  );
  const [validation, setValidation] = useState<(boolean | null)[]>(
    Array(problemsJSON.length).fill(null)
  );
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  const handleCheckboxChange = useCallback(
    (problemIdx: number, optionIdx: number) => {
      setSelectedAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[problemIdx] = optionIdx;
        return newAnswers;
      });
      setStatus(null);
      setValidation(Array(problemsJSON.length).fill(null));
    },
    []
  );

  const handleCheck = useCallback(() => {
    let allCorrect = true;
    const newValidation = problemsJSON.map((p, i) => {
      const isCorrect = selectedAnswers[i] === p.correctAnswer;
      if (!isCorrect) {
        allCorrect = false;
      }
      return isCorrect;
    });
    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [selectedAnswers, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    const solution = problemsJSON.map((p) => p.correctAnswer);
    setSelectedAnswers(solution);
    setValidation(Array(problemsJSON.length).fill(true));
    setShowSolution(true);
    setStatus("match");
  }, []);

  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  const summary = useMemo(() => {
    if (!status) return null;
    return status === "match"
      ? { text: "🎉 Correct! Good Job", color: "text-green-600" }
      : { text: "❌ Some answers are wrong", color: "text-red-600" };
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
    <div className="flex flex-col space-y-8">
      <div className="text-xl font-semibold text-gray-800">Question 1</div>
      <div className="text-gray-600">Which is more? Tick the box.</div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-12 gap-y-8 px-6 py-8">
        {problemsJSON.map((problem, problemIdx) => (
          <div key={problem.id} className="flex flex-col space-y-4">
            {problem.options.map((option, optionIdx) => {
              const isSelected = selectedAnswers[problemIdx] === optionIdx;
              const isCorrect = validation[problemIdx] && isSelected;
              const isIncorrect = validation[problemIdx] === false && isSelected;

              let checkboxClasses =
                "relative w-6 h-6 border-2 rounded cursor-pointer transition-colors duration-200 flex items-center justify-center";
              if (showSolution && problem.correctAnswer === optionIdx) {
                checkboxClasses += " bg-green-200 border-green-500";
              } else if (isCorrect) {
                checkboxClasses += " bg-green-200 border-green-500";
              } else if (isIncorrect) {
                checkboxClasses += " bg-red-200 border-red-500";
              } else if (isSelected) {
                checkboxClasses += " bg-blue-200 border-blue-500";
              } else {
                checkboxClasses += " border-gray-400";
              }

              const shouldShowCheckmark = isSelected || (showSolution && problem.correctAnswer === optionIdx);
              const checkmarkColor = isCorrect || (showSolution && problem.correctAnswer === optionIdx) ? 'text-green-600' : 'text-blue-500';


              return (
                <div
                  key={optionIdx}
                  className="flex items-center space-x-2"
                  onClick={() => handleCheckboxChange(problemIdx, optionIdx)}
                >
                  <div className={checkboxClasses}>
                    {shouldShowCheckmark && (
                      <svg
                        className={`w-4 h-4 pointer-events-none ${checkmarkColor}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    )}
                  </div>
                  {renderFractionText(option.text)}
                </div>
              );
            })}
          </div>
        ))}
      </div>

   
    </div>
  );
}