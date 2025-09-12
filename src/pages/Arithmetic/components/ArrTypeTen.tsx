import React, { useState } from "react";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import Check from "@/components/common/Check";

// JSON Data (all questions and answers here)
const problemsJSON = [
  { id: 1, question: "5 - 3 =", answer: 2, type: "subtraction" },
  { id: 2, question: "7 - 3 =", answer: 4, type: "subtraction" },
  { id: 3, question: "8 - 6 =", answer: 2, type: "subtraction" },
  { id: 4, question: "6 - 4 =", answer: 2, type: "subtraction" },
  { id: 5, question: "8 - 4 =", answer: 4, type: "subtraction" },
  { id: 6, question: "9 - 6 =", answer: 3, type: "subtraction" },
  { id: 7, question: "9 - 3 =", answer: 6, type: "subtraction" },
  { id: 8, question: "6 - 3 =", answer: 3, type: "subtraction" },
  { id: 9, question: "7 - 3 =", answer: 4, type: "subtraction" },
  { id: 10, question: "9 - 7 =", answer: 2, type: "subtraction" },
];

const ArrTypeTen = ({data, hint}:any) => {
  // Use JSON data
  const [problems] = useState(data);

  const [userAnswers, setUserAnswers] = useState<number[]>(Array(problems.length).fill(NaN));
  const [validation, setValidation] = useState<(boolean | null)[]>(Array(problems.length).fill(null));
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value === "" ? NaN : parseInt(value);
    setUserAnswers(newAnswers);
  };

  const handleCheck = () => {
    const newValidation = problems.map((p, i) => p.answer === userAnswers[i]);
    const allCorrect = newValidation.every(Boolean);
    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    setShowSolution(false);
  };

  const handleShowHint = () => setShowHint((v) => !v);

  const handleShowSolution = () => {
    setShowSolution(true);
    setValidation(Array(problems.length).fill(true));
    setStatus(null);
  };

  const summary =
    status === "match"
      ? { text: "🎉 All Correct! Great job", color: "text-green-600", bgColor: "bg-green-100", borderColor: "border-green-600" }
      : status === "wrong"
      ? { text: "❌ Some answers are wrong. Check again.", color: "text-red-600", bgColor: "bg-red-100", borderColor: "border-red-600" }
      : null;

  return (
    <div className="flex items-center justify-center">
      <div className=" rounded-lg w-full">
        {/* Abacus Image */}
        <div className="mb-12">
          <img src="/images/arr1.png" alt="Abacus" className="" />
        </div>

        {/* Math Problems Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5   mb-12">
          {problems.map((p, idx) => {
            const isCorrect = validation[idx];
            const inputClass =
              isCorrect === true
                ? "border-green-600 text-green-600"
                : isCorrect === false
                ? "border-red-600 text-red-600"
                : "border-gray-400 text-gray-900";

            return (
              <div key={p.id} className="flex items-end space-x-2">
                <span className="text-lg text-gray-900 tracking-wide">
                  {p.question.split(" ").map((part, partIdx) => (
                    <span key={partIdx} className="border-b-2 border-dashed border-gray-400 mr-2">{part}</span>
                  ))}
                </span>
                <input
                  type="number"
                  className={`w-16 h-8 text-center text-lg font-semibold border-b-2 border-dashed focus:outline-none ${inputClass}`}
                  value={showSolution ? p.answer : (isNaN(userAnswers[idx]) ? "" : userAnswers[idx])}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  readOnly={showSolution}
                />
              </div>
            );
          })}
        </div>

        {/* Controllers */}
        <Controllers
          handleCheck={handleCheck}
          handleShowSolution={handleShowSolution}
          handleShowHint={handleShowHint}
        />

        {/* Hint */}
        {showHint && <Hint hint={hint} />}

        {/* Summary */}
        <Check summary={summary} />
      </div>
    </div>
  );
};

export default ArrTypeTen;
