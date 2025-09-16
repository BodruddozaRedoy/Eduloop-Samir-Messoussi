import React, { useState, useCallback, useEffect, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// Percentage problems data
const problemsJSON = [
  {
    id: 1,
    question: "Of the 400 bicycles, 320 are rented out.",
    answer: "80%",
  },
  {
    id: 2,
    question: "Of the 400 bicycles, 320 are rented out.",
    answer: "80%",
  },
  {
    id: 3,
    question: "Of the 400 bicycles, 320 are rented out.",
    answer: "80%",
  },
  {
    id: 4,
    question: "Of the 400 bicycles, 320 are rented out.",
    answer: "80%",
  },
];

export default function ArrType_30({ hint }: { hint: string }) {
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
    const newValidation = problemsJSON.map(
      (p, i) => answers[i].trim().toLowerCase() === p.answer.toLowerCase()
    );
    const allCorrect = newValidation.every(Boolean);
    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle]);

  // Show Solution
  const handleShowSolution = useCallback(() => {
    const filledAnswers = problemsJSON.map((p) => p.answer);
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

  return (
    <div className="flex flex-col space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 px-6 py-8">
        {problemsJSON.map((p, idx) => (
          <div
            key={p.id}
            className="rounded-2xl bg-[#FFEDD5] p-5 flex flex-col items-start shadow-md w-full"
          >
            {/* Question */}
            <div className="mb-4 text-sm text-gray-800">{p.question}</div>

            {/* Answer Input */}
            <div className="flex items-center text-green-600  w-full">
              <span className="text-sm text-gray-600 mr-2">Answer:</span>
              <input
                type="text"
                className="flex-1 p-1 text-sm border-b border-dashed  border-gray-700 outline-none  bg-transparent"
                value={showSolution ? p.answer : answers[idx]}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                readOnly={showSolution}
              />
            </div>
          </div>
        ))}
      </div>

    
    </div>
  );
}