import React, { useState, useCallback, useEffect, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// Fraction sorting problems data
const problemsJSON = [
  {
    id: 1,
    fractions: ["3/6", "1/5", "3/4"],
    sorted: ["1/5", "3/6", "3/4"],
  },
  {
    id: 2,
    fractions: ["1/2", "7/8", "2/5"],
    sorted: ["2/5", "1/2", "7/8"],
  },
  {
    id: 3,
    fractions: ["9/10", "2/4", "3/8"],
    sorted: ["3/8", "2/4", "9/10"],
  },
  {
    id: 4,
    fractions: ["3/6", "1/5", "3/4"],
    sorted: ["1/5", "3/6", "3/4"],
  },
  {
    id: 5,
    fractions: ["1/2", "7/8", "2/5"],
    sorted: ["2/5", "1/2", "7/8"],
  },
  {
    id: 6,
    fractions: ["9/10", "2/4", "3/8"],
    sorted: ["3/8", "2/4", "9/10"],
  },
];

const renderFraction = (fractionString: string) => {
  const [numerator, denominator] = fractionString.split("/");
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-medium">{numerator}</span>
      <hr className="w-8 border-t-2 border-gray-600 my-0.5" />
      <span className="text-2xl font-medium mt-1">{denominator}</span>
    </div>
  );
};

export default function ArrType_24({ hint }: { hint: string }) {
  const [answers, setAnswers] = useState(
    Array(problemsJSON.length)
      .fill(null)
      .map(() => ["", "", ""])
  );
  const [validation, setValidation] = useState<(boolean | null)[]>(
    Array(problemsJSON.length * 3).fill(null)
  );
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  // Input handler
  const handleInputChange = useCallback(
    (problemIdx: number, inputIdx: number, value: string) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[problemIdx][inputIdx] = value;
        return next;
      });
      setStatus(null);
    },
    []
  );

  // Check
  const handleCheck = useCallback(() => {
    let allCorrect = true;
    const newValidation: (boolean | null)[] = [];

    problemsJSON.forEach((p, problemIdx) => {
      p.sorted.forEach((correctAnswer, inputIdx) => {
        const isCorrect = answers[problemIdx][inputIdx].trim() === correctAnswer;
        newValidation.push(isCorrect);
        if (!isCorrect) {
          allCorrect = false;
        }
      });
    });

    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle]);

  // Show Solution
  const handleShowSolution = useCallback(() => {
    const filledAnswers = problemsJSON.map((p) => p.sorted);
    setAnswers(filledAnswers);
    setValidation(Array(problemsJSON.length * 3).fill(true));
    setShowSolution(true);
    setStatus("match");
  }, []);

  // Hint toggle
  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  // Summary
  const summary = useMemo(() => {
    if (!status) return null;
    return status === "match"
      ? { text: "Correct! Great job.", color: "text-green-600" }
      : { text: "Some answers are wrong", color: "text-red-600" };
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
      <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 px-6 py-8">
        {problemsJSON.map((p, idx) => (
          <div key={p.id} className="flex flex-col items-center space-y-4">
            {/* Unsorted fractions display */}
            <div className="flex justify-center space-x-2 w-60 h-36  bg-orange-50/50 rounded-xl p-4 shadow-md">
              {p.fractions.map((f, fIdx) => (
                <div
                  key={fIdx}
                  className="w-16 h-20 mt-5 flex justify-center items-center bg-orange-100 border-2 border-orange-300 rounded-lg shadow-sm"
                >
                  {renderFraction(f)}
                </div>
              ))}
            </div>

            {/* Sorted fractions inputs / answers */}
            <div className="flex justify-center space-x-2 w-60">
              {showSolution || status === "match" ? (
                // Displaying solved cards
                p.sorted.map((f, fIdx) => (
                  <div
                    key={fIdx}
                    className="w-16 h-20 flex justify-center items-center bg-green-100 border-2 border-green-500 rounded-lg shadow-sm text-green-700"
                  >
                    {renderFraction(f)}
                  </div>
                ))
              ) : (
                // Displaying input fields
                answers[idx].map((a, inputIdx) => (
                  <div
                    key={inputIdx}
                    className="w-16 h-20 flex justify-center items-center border-2 border-orange-300 rounded-lg shadow-sm"
                  >
                    <input
                      type="text"
                      className="w-full h-full text-center bg-transparent outline-none font-semibold text-gray-700"
                      value={a}
                      onChange={(e) =>
                        handleInputChange(idx, inputIdx, e.target.value)
                      }
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>


    </div>
  );
}