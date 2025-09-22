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
    statement: "50% of the garden area is 45 m2",
    question: "What is the area of the whole garden?",
    answer: "90 m2",
  },
  {
    id: 2,
    statement: "50% of the garden area is 45 m2",
    question: "What is the area of the whole garden?",
    answer: "90 m2",
  },
  {
    id: 3,
    statement: "50% of the garden area is 45 m2",
    question: "What is the area of the whole garden?",
    answer: "90 m2",
  },
  {
    id: 4,
    statement: "50% of the garden area is 45 m2",
    question: "What is the area of the whole garden?",
    answer: "90 m2",
  },
];

export default function ArrType_32({ hint }: { hint: string }) {
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
          <div key={p.id} className="flex flex-col items-start w-full">
            {/* Question Card */}
            <div className="rounded-2xl bg-amber-50/60 p-6 flex items-center shadow-md w-full mb-4">
              <p className="text-sm text-gray-800">{p.statement}</p>
            </div>

            {/* Answer section */}
            <div className="flex flex-col text-green-600 w-full px-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                {p.question}
              </h3>
              <input
                type="text"
                className="flex-1 border-gray-700 p-1 text-sm border-b border-dotted outline-none text-gray-700 bg-transparent"
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