import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useState } from "react";

// Math problems dataset
const problemsJSON = [
  { id: 1, question: "5 x _ = 40", answer: 8 },
  { id: 2, question: "_ x 8 = 48", answer: 6 },
  { id: 3, question: "8 x 7 = _", answer: 56 },
  { id: 4, question: "_ x 7 = 42", answer: 6 },
  { id: 5, question: "_ x 9 = 45", answer: 5 },
  { id: 6, question: "6 x 9 = _", answer: 54 },
  { id: 7, question: "7 x 6 = _", answer: 42 },
  { id: 8, question: "_ x 12 = 60", answer: 5 },
  { id: 9, question: "9 x _ = 81", answer: 9 },
];

const ArrType_19 = ({ hint }) => {
  const [answers, setAnswers] = useState(Array(problemsJSON.length).fill(""));
  const [validation, setValidation] = useState(Array(problemsJSON.length).fill(null));
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [status, setStatus] = useState(null);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  // handle input changes
  const handleInputChange = (idx, val) => {
    const newAnswers = [...answers];
    newAnswers[idx] = val === "" ? "" : Number(val);
    setAnswers(newAnswers);
    setStatus(null);
  };

  // check answers
  const handleCheck = () => {
    const newValidation = problemsJSON.map((p, i) => p.answer === answers[i]);
    setValidation(newValidation);
    const allCorrect = newValidation.every(Boolean);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  };

  // show solution
  const handleShowSolution = () => {
    setAnswers(problemsJSON.map((p) => p.answer));
    setValidation(Array(problemsJSON.length).fill(true));
    setStatus("match");
    setShowSolution(true);
  };

  // toggle hint
  const handleShowHint = () => setShowHint((v) => !v);

  // summary for Check component
  const summary = status
    ? {
        text: status === "match" ? "🎉 Correct! Good Job" : "❌ Some answers are wrong",
        color: status === "match" ? "text-green-600" : "text-red-600",
      }
    : null;

  return (
    <div className="flex flex-col">
      {/* Math problems grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {problemsJSON.map((p, idx) => (
          <div
            key={p.id}
            className="flex items-center gap-2 p-2 sm:p-4 rounded bg-white shadow-sm border"
          >
            {p.question.split(" ").map((part, i) =>
              part === "_"
                ? (
                  <input
                    key={i}
                    type="number"
                    className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-center rounded  
                      ${validation[idx] === false ? "border-red-500" : "border-gray-300"}`}
                    style={{ backgroundImage: `url("/images/math.png")`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}
                    value={answers[idx]}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    readOnly={showSolution}
                  />
                )
                : (
                  <span
                    key={i}
                    className="text-base sm:text-lg md:text-xl font-medium"
                  >
                    {part}
                  </span>
                )
            )}
          </div>
        ))}
      </div>

      {/* Controllers */}
      <div className="mt-6 flex justify-start">
        <Controllers
          handleCheck={handleCheck}
          handleShowSolution={handleShowSolution}
          handleShowHint={handleShowHint}
        />
      </div>

      {/* Hint + Summary */}
      {showHint && <Hint hint={hint} />}
      <Check summary={summary} />
    </div>
  );
};

export default ArrType_19;
