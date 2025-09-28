import React, { useState, useCallback, useEffect, useMemo } from "react";

import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";


const problemsJSON = [
  { id: 1, text: "1% van 800 =", answer: "8" },
  { id: 2, text: "3% van 500 =", answer: "15" },
  { id: 3, text: "9% van 1100 =", answer: "99" },
  { id: 4, text: "1% van 800 =", answer: "8" },
  { id: 5, text: "3% van 500 =", answer: "15" },
  { id: 6, text: "9% van 1100 =", answer: "99" },
  { id: 7, text: "1% van 800 =", answer: "8" },
  { id: 8, text: "3% van 500 =", answer: "15" },
  { id: 9, text: "9% van 1100 =", answer: "99" },
];

export default function ArrType_75({ hint,data:problemsJSON }: {data:any, hint: string }) {
  const [answers, setAnswers] = useState(
    problemsJSON.map(() => "")
  );
  const [validation, setValidation] = useState<(boolean | null)[]>(
    problemsJSON.map(() => null)
  );
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  const handleInputChange = useCallback(
    (idx: number, value: string) => {
      setAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[idx] = value;
        return newAnswers;
      });
      setStatus(null);
    },
    []
  );

  const handleCheck = useCallback(() => {
    let allCorrect = true;
    const newValidation = problemsJSON.map((p, idx) => {
      const isCorrect = answers[idx].trim() === p.answer;
      if (!isCorrect) {
        allCorrect = false;
      }
      return isCorrect;
    });

    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    const filledAnswers = problemsJSON.map((p) => p.answer);
    setAnswers(filledAnswers);
    setValidation(problemsJSON.map(() => true));
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

  const getInputClass = (isCorrect: boolean | null) => {
    if (isCorrect === true) return "text-green-600";
    if (isCorrect === false) return "text-red-600";
    return "text-gray-700";
  };

  const getAnswerValue = (idx: number) => {
    if (showSolution) {
      return problemsJSON[idx].answer;
    }
    return answers[idx];
  };

  const isInputReadOnly = showSolution;

  return (
    <div className="flex flex-col space-y-8">
      <div className="text-xl font-semibold text-gray-800">Question 1</div>
      <div className="text-gray-600">Calculate.</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {Array(3).fill(null).map((_, colIdx) => (
          <div key={colIdx} className="flex flex-col space-y-4">
            {problemsJSON.slice(colIdx * 3, colIdx * 3 + 3).map((p, rowIdx) => {
              const problemIdx = colIdx * 3 + rowIdx;
              const isCorrect = validation[problemIdx];
              return (
                <div key={p.id} className="flex items-center space-x-2">
                  <span className="whitespace-nowrap">{p.text}</span>
                  <input
                    type="text"
                    className={`flex-1 p-1 text-sm text-center border-b border-dotted outline-none font-semibold ${getInputClass(isCorrect)}`}
                    value={getAnswerValue(problemIdx)}
                    onChange={(e) => handleInputChange(problemIdx, e.target.value)}
                    readOnly={isInputReadOnly}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

    
    </div>
  );
}