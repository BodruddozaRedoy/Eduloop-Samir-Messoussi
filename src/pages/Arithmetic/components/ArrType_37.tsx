import React, { useState, useCallback, useEffect, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// Pricing problems data with new images and structure matching the provided image
const problemsJSON = [
  {
    id: 1,
    item: "cycle",
    topImage: "/images/cycle.png", // Image for the top of the first column
    bottomImage: "/images/circle.png", // Image for the bottom of the first column
    costPerUnit: 3,
    answers: ["6", "9"], // Answers for quantity 2 and 3
    numCols: 3, // Number of columns for quantities (1, 2, 3)
  },
  {
    id: 2,
    item: "flower",
    topImage: "/images/flower.png", // Image for the top of the first column
    bottomImage: "/images/circle.png", // Image for the bottom of the first column
    costPerUnit: 5,
    answers: ["10", "15", "20"], // Answers for quantity 2, 3, and 4
    numCols: 4, // Number of columns for quantities (1, 2, 3, 4)
  },
];

export default function ArrType_37({ hint }: { hint: string }) {
  const [answers, setAnswers] = useState(
    problemsJSON.map((p) => Array(p.numCols - 1).fill(""))
  );
  const [validation, setValidation] = useState<(boolean | null)[]>(
    Array(problemsJSON.reduce((sum, p) => sum + (p.numCols - 1), 0)).fill(null)
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
      setValidation(Array(validation.length).fill(null));
    },
    [validation.length]
  );

  // Check
  const handleCheck = useCallback(() => {
    let allCorrect = true;
    const newValidation: (boolean | null)[] = [];

    let currentValidationIndex = 0;
    problemsJSON.forEach((p, problemIdx) => {
      p.answers.forEach((correctAnswer) => {
        // Calculate the correct inputIdx for the current problem's answer
        const localInputIdx = newValidation.length - problemsJSON.slice(0, problemIdx).reduce((sum, cp) => sum + (cp.numCols - 1), 0);
        const isCorrect = answers[problemIdx][localInputIdx]?.trim() === correctAnswer; 
        newValidation.push(isCorrect);
        if (!isCorrect) {
          allCorrect = false;
        }
      });
    });

    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle, validation.length]);

  // Show Solution
  const handleShowSolution = useCallback(() => {
    const filledAnswers = problemsJSON.map((p) => p.answers);
    setAnswers(filledAnswers);
    setValidation(Array(validation.length).fill(true));
    setShowSolution(true);
    setStatus("match");
  }, [validation.length]);

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

  const getInputClass = (isCorrect: boolean | null) => {
    if (isCorrect === true) return "text-green-600";
    if (isCorrect === false) return "text-red-600";
    return "text-gray-700";
  };

  const getAnswerValue = (problemIdx: number, inputIdx: number) => {
    if (showSolution) {
      return problemsJSON[problemIdx].answers[inputIdx];
    }
    return answers[problemIdx][inputIdx];
  };

  const isInputReadOnly = showSolution;

  return (
    <div className="flex flex-col space-y-12">
      {problemsJSON.map((p, problemIdx) => {
        const numTableCols = p.numCols + 1; // 1 for the image column + numCols for quantities
        const gridColsClass = `grid-cols-${numTableCols}`;

        // Calculate the starting index for current problem's validation
        const problemValidationStartIndex = problemsJSON.slice(0, problemIdx).reduce((sum, cp) => sum + (cp.numCols - 1), 0);

        return (
          <div key={p.id} className="p-6 bg-white rounded-xl shadow-md">
            <div className={`grid ${gridColsClass} gap-0 border-2 border-yellow-300 rounded-lg overflow-hidden`}>
              {/* Row 1: Top Image and Quantities */}
              <div className="col-span-1 p-2 bg-white flex items-center justify-center border-r border-blue-300">
                <img src={p.topImage} alt={p.item} className="h-10 w-auto object-contain" />
              </div>
              {Array.from({ length: p.numCols }).map((_, colIdx) => (
                <div
                  key={`header-${p.id}-${colIdx}`}
                  className={`p-2 bg-[#FFF7ED] text-lg font-semibold text-center flex items-center justify-center ${colIdx < p.numCols - 1 ? 'border-r border-blue-300' : ''}`}
                >
                  {colIdx + 1}
                </div>
              ))}

              {/* Row 2: Bottom Image, Cost per Unit, and Input Fields */}
              <div className="col-span-1 p-2 bg-[#FFF7ED] flex items-center justify-center border-r border-blue-300">
                <img src={p.bottomImage} alt="unit" className="h-10 w-auto object-contain" />
              </div>
              {Array.from({ length: p.numCols }).map((_, colIdx) => {
                // Calculate the validation index for the current input field
                const validationIndex = problemValidationStartIndex + (colIdx - 1);
                return (
                  <div
                    key={`data-${p.id}-${colIdx}`}
                    className={`p-2 bg-white text-center flex items-center justify-center ${colIdx < p.numCols - 1 ? 'border-r border-blue-300' : ''}`}
                  >
                    {colIdx === 0 ? (
                      <span className="text-lg font-semibold">{p.costPerUnit}</span>
                    ) : (
                      <input
                        type="text"
                        className={`w-full text-lg text-center bg-transparent border-b border-dotted outline-none font-semibold ${getInputClass(validation[validationIndex])}`}
                        value={getAnswerValue(problemIdx, colIdx - 1)}
                        onChange={(e) => handleInputChange(problemIdx, colIdx - 1, e.target.value)}
                        readOnly={isInputReadOnly}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

    </div>
  );
}