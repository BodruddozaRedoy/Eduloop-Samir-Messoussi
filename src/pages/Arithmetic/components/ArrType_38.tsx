import React, { useState, useCallback, useEffect, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// Pricing problems data
const problemsJSON = [
  {
    id: 1,
    item: "ice cream",
    mainImage: "/images/singleIceCream.png",
    tableImage: "/images/singleIceCream.png",
    costPerUnit: 6,
    answers: ["4", "6"], // Changed to just number values
    currency: "euro", // New field for currency
  },
  {
    id: 2,
    item: "soccer ball",
    mainImage: "/images/singleFootball.png",
    tableImage: "/images/singleFootball.png",
    costPerUnit: 5,
    answers: ["10", "15"], // Changed to just number values
    currency: "euro", // New field for currency
  },
  {
    id: 3,
    item: "book",
    mainImage: "/images/singleBook.png",
    tableImage: "/images/singleBook.png",
    costPerUnit: 10,
    answers: ["20", "30"], // Changed to just number values
    currency: "euro", // New field for currency
  },
];

export default function ArrType_38({ hint }: { hint: string }) {
  const [answers, setAnswers] = useState(
    Array(problemsJSON.length)
      .fill(null)
      .map(() => ["", ""])
  );
  const [validation, setValidation] = useState<(boolean | null)[]>(
    Array(problemsJSON.length * 2).fill(null)
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
      setValidation(Array(problemsJSON.length * 2).fill(null));
    },
    []
  );

  // Check
  const handleCheck = useCallback(() => {
    let allCorrect = true;
    const newValidation: (boolean | null)[] = [];

    problemsJSON.forEach((p, problemIdx) => {
      p.answers.forEach((correctAnswer, inputIdx) => {
        const isCorrect = answers[problemIdx][inputIdx].trim() === correctAnswer;
        newValidation.push(isCorrect);
        if (!isCorrect) {
          allCorrect = false;
        }
      });
    });

    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle]);

  // Show Solution
  const handleShowSolution = useCallback(() => {
    const filledAnswers = problemsJSON.map((p) => p.answers);
    setAnswers(filledAnswers);
    setValidation(Array(problemsJSON.length * 2).fill(true));
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
      {problemsJSON.map((p, idx) => (
        <div key={p.id} className="flex flex-col sm:flex-row items-center justify-center p-6 bg-white rounded-xl shadow-md space-y-6 sm:space-y-0 sm:space-x-10">
          {/* Left side: Main Image and price tag */}
          <div className="relative w-32 h-32 flex justify-center items-center">
            <img src={p.mainImage} alt={p.item} className="w-full h-full object-contain" />
            <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-blue-200 rounded-md px-2 py-1 text-sm font-semibold text-gray-800 shadow-md">
              {p.costPerUnit} {p.currency}
            </div>
          </div>
          
          {/* Right side: Table */}
          <div className="grid grid-cols-4 gap-2 border-2 border-orange-300 rounded-lg overflow-hidden">
            {/* Header row */}
            <div className="col-span-1 p-2 bg-orange-100 text-sm font-semibold text-center border-r border-orange-300">
              <div className="h-6 w-6 mx-auto">
                <img src={p.tableImage} alt={p.item} className="w-full h-full object-contain"/>
              </div>
            </div>
            <div className="p-2 bg-orange-100 text-sm font-semibold text-center border-r border-orange-300">
              1
            </div>
            <div className="p-2 bg-orange-100 text-sm font-semibold text-center border-r border-orange-300">
              2
            </div>
            <div className="p-2 bg-orange-100 text-sm font-semibold text-center">
              3
            </div>

            {/* Price row */}
            <div className="col-span-1 p-2 bg-orange-50 text-sm font-semibold text-center border-r border-orange-300">
              price
            </div>
            <div className="p-2 bg-orange-50 text-sm text-center border-r border-orange-300">
              {p.costPerUnit} {p.currency}
            </div>
            <div className="p-2 bg-orange-50 text-center border-r border-orange-300 flex items-center justify-center space-x-1">
              <input
                type="text"
                className={`w-1/2 text-sm text-center bg-transparent border-b border-dotted outline-none font-semibold ${getInputClass(validation[idx * 2])}`}
                value={getAnswerValue(idx, 0)}
                onChange={(e) => handleInputChange(idx, 0, e.target.value)}
                readOnly={isInputReadOnly}
              />
              <span className="text-gray-700">{p.currency}</span>
            </div>
            <div className="p-2 bg-orange-50 text-center flex items-center justify-center space-x-1">
              <input
                type="text"
                className={`w-1/2 text-sm text-center bg-transparent border-b border-dotted outline-none font-semibold ${getInputClass(validation[idx * 2 + 1])}`}
                value={getAnswerValue(idx, 1)}
                onChange={(e) => handleInputChange(idx, 1, e.target.value)}
                readOnly={isInputReadOnly}
              />
              <span className="text-gray-700">{p.currency}</span>
            </div>
          </div>
        </div>
      ))}

    </div>
  );
}