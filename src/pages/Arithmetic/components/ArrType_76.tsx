import React, { useState, useCallback, useEffect, useMemo } from "react";

import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";


const problemsJSON = [
  { id: 1, fraction: "6/9", answer: "0.667" },
  { id: 2, fraction: "5/6", answer: "0.833" },
  { id: 3, fraction: "3 1/6", answer: "3.167" },
  { id: 4, fraction: "2/75", answer: "0.027" },
  { id: 5, fraction: "6/25", answer: "0.24" },

 
];

export default function ArrType_76({ hint }: { hint: string }) {
  const [answers, setAnswers] = useState(
    problemsJSON.map(() => "")
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
  
  const renderFraction = (fraction: string) => {
    const parts = fraction.split(" ");
    if (parts.length > 1) { // Mixed fraction
      const [whole, frac] = parts;
      const [num, den] = frac.split('/');
      return (
        <div className="flex items-end">
          <span className="text-3xl font-medium mr-1">{whole}</span>
          <div className="flex flex-col text-xl font-medium">
            <span>{num}</span>
            <span className="border-t-2 border-gray-600">{den}</span>
          </div>
        </div>
      );
    } else { // Simple fraction
      const [num, den] = fraction.split('/');
      return (
        <div className="flex flex-col text-3xl font-medium">
          <span>{num}</span>
          <span className="border-t-2 border-gray-600">{den}</span>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col space-y-8">
      <div className="text-xl font-semibold text-gray-800">Question 1</div>
      <div className="text-gray-600">Write as a decimal. Use a calculator.</div>
      
      <div className="grid grid-cols-5 gap-12 px-6 py-8">
        {problemsJSON.slice(0, 5).map((p, idx) => (
          <div key={p.id} className="flex flex-col items-center">
            <div className="flex items-center space-x-2">
              {renderFraction(p.fraction)}
              <span className="text-3xl font-medium">=</span>
              <input
                type="text"
                className={`w-24 p-1 text-md text-center border-b border-dotted outline-none font-medium ${getInputClass(validation[idx])}`}
                value={getAnswerValue(idx)}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                readOnly={isInputReadOnly}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-12 px-6 py-8">
        {problemsJSON.slice(5, 10).map((p, idx) => {
          const problemIdx = idx + 5;
          return (
            <div key={p.id} className="flex flex-col items-center">
              <div className="flex items-center space-x-2">
                {renderFraction(p.fraction)}
                <span className="text-3xl font-medium">=</span>
                <input
                  type="text"
                  className={`w-24 p-1 text-md text-center border-b border-dotted outline-none font-medium ${getInputClass(validation[problemIdx])}`}
                  value={getAnswerValue(problemIdx)}
                  onChange={(e) => handleInputChange(problemIdx, e.target.value)}
                  readOnly={isInputReadOnly}
                />
              </div>
            </div>
          );
        })}
      </div>

    
    </div>
  );
}