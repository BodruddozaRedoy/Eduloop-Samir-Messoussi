import React, { useState, useCallback, useEffect, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// Data for the arithmetic problems
const problemsJSON = [
  // Four addition problems
  ...Array(4)
    .fill(null)
    .map((_, i) => ({
      id: `add-${i}`,
      num1: 474,
      num2: 137,
      operator: "+",
      answer: 474 + 137,
    })),
  // Four subtraction problems
  ...Array(4)
    .fill(null)
    .map((_, i) => ({
      id: `sub-${i}`,
      num1: 403,
      num2: 189,
      operator: "-",
      answer: 403 - 189,
    })),
];

export default function ArrType_44({ hint }: { hint: string }) {
  const [answers, setAnswers] = useState(Array(problemsJSON.length).fill(""));
  const [validation, setValidation] = useState<(boolean | null)[]>(
    Array(problemsJSON.length).fill(null)
  );
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  // Input handler
  const handleInputChange = useCallback((idx: number, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
    setStatus(null);
  }, []);

  // Check
  const handleCheck = useCallback(() => {
    let allCorrect = true;
    const newValidation = problemsJSON.map((p, i) => {
      const isCorrect = parseInt(answers[i]) === p.answer;
      if (!isCorrect) {
        allCorrect = false;
      }
      return isCorrect;
    });
    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle]);

  // Show Solution
  const handleShowSolution = useCallback(() => {
    const filledAnswers = problemsJSON.map((p) => p.answer.toString());
    setAnswers(filledAnswers);
    setValidation(Array(problemsJSON.length).fill(true));
    setShowSolution(true);
    setStatus("match");
  }, []);

  // Hint toggle
  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  // Summary
  const summary = useMemo(() => {
    if (!status) return null;
    return status === "match"
      ? { text: "🎉 Correct! Good Job", color: "text-green-600" }
      : { text: "❌ Some answers are wrong", color: "text-red-600" };
  }, [status]);

  // Controls sync
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

  const getInputClass = (idx: number) => {
    if (showSolution || (status === "match" && validation[idx])) {
      return "text-green-600";
    }
    if (status === "wrong" && validation[idx] === false) {
      return "text-red-600";
    }
    return "text-gray-700";
  };

  const getAnswerValue = (idx: number) => {
    if (showSolution) {
      return problemsJSON[idx].answer.toString();
    }
    return answers[idx];
  };

  return (
    <div className="flex flex-col space-y-8">
      <div className="text-2xl font-semibold text-gray-800">Question 1</div>
      <div className="text-gray-600">Calculate.</div>

      {/* Addition Problems */}
      <div className="grid grid-cols-4 gap-8">
        {problemsJSON.slice(0, 4).map((p, idx) => (
          <div key={p.id} className="flex flex-col items-center">
            <div className="flex flex-col items-end text-xl font-medium space-y-1">
              <span>{p.num1}</span>
              <div className="flex items-center space-x-2">
                <span>{p.operator}</span>
                <span>{p.num2}</span>
              </div>
              <div className="w-full border-t-2 border-gray-400"></div>
            </div>
            <input
              type="text"
              className={`mt-2 w-24 p-1 text-xl font-medium text-center border-b border-dotted outline-none ${getInputClass(idx)}`}
              value={getAnswerValue(idx)}
              onChange={(e) => handleInputChange(idx, e.target.value)}
              readOnly={showSolution}
            />
          </div>
        ))}
      </div>

      {/* Subtraction Problems */}
      <div className="grid grid-cols-4 gap-8">
        {problemsJSON.slice(4, 8).map((p, idx) => (
          <div key={p.id} className="flex flex-col items-center">
            <div className="flex flex-col items-end text-xl font-medium space-y-1">
              <span>{p.num1}</span>
              <div className="flex items-center space-x-2">
                <span>{p.operator}</span>
                <span>{p.num2}</span>
              </div>
              <div className="w-full border-t-2 border-gray-400"></div>
            </div>
            <input
              type="text"
              className={`mt-2 w-24 p-1 text-xl font-medium text-center border-b border-dotted outline-none ${getInputClass(idx + 4)}`}
              value={getAnswerValue(idx + 4)}
              onChange={(e) => handleInputChange(idx + 4, e.target.value)}
              readOnly={showSolution}
            />
          </div>
        ))}
      </div>

 
    </div>
  );
}













