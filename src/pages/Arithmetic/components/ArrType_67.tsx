import React, { useState, useCallback, useEffect, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

const problemsJSON = [
  {
    id: 1,
    number: "23,45",
    digitValues: [
      { text: "0,005 l =", answer: "5 cl" },
      { text: "0,4 l =", answer: "40 cl" },
      { text: "3 l =", answer: "300 cl" },
      { text: "20 l =", answer: "2000 cl" },
    ],
    arrows: [
      { from: 10, to: 10 },
      { from: 10, to: 10 },
      { from: 10, to: 10 },
      { from: 10, to: 10 },
    ],
  },
  {
    id: 2,
    number: "1,588",
    digitValues: [
      { text: "0,009 l =", answer: "9 ml" },
      { text: "0,08 l =", answer: "80 ml" },
      { text: "0,5 l =", answer: "500 ml" },
      { text: "1 l =", answer: "1000 ml" },
    ],
    arrows: [
      { from: 10, to: 10 },
      { from: 10, to: 10 },
      { from: 10, to: 10 },
      { from: 10, to: 10 },
    ],
  },
];

const renderArrow = (from, to, text, isCorrect) => (
  <div className="relative" style={{ width: 150, height: 20 }}>
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-gray-400"></div>
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-1 bg-white text-sm"
      style={{ color: isCorrect ? "green" : "red" }}
    >
      {text}
    </div>
  </div>
);

export default function ArrType_45({ hint }: { hint: string }) {
  const [answers, setAnswers] = useState(
    problemsJSON.map((p) => p.digitValues.map(() => ""))
  );
  const [validation, setValidation] = useState(
    problemsJSON.map((p) => p.digitValues.map(() => null))
  );
  const [status, setStatus] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  const handleInputChange = useCallback(
    (problemIdx: number, inputIdx: number, value: string) => {
      setAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[problemIdx][inputIdx] = value;
        return newAnswers;
      });
      setStatus(null);
    },
    []
  );

  const handleCheck = useCallback(() => {
    let allCorrect = true;
    const newValidation = problemsJSON.map((p, problemIdx) =>
      p.digitValues.map((val, inputIdx) => {
        const isCorrect =
          answers[problemIdx][inputIdx].trim() === val.answer;
        if (!isCorrect) {
          allCorrect = false;
        }
        return isCorrect;
      })
    );
    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    const solutionAnswers = problemsJSON.map((p) =>
      p.digitValues.map((val) => val.answer)
    );
    setAnswers(solutionAnswers);
    const newValidation = problemsJSON.map((p) =>
      p.digitValues.map(() => true)
    );
    setValidation(newValidation);
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

  const getAnswerValue = (problemIdx: number, inputIdx: number) => {
    if (showSolution) {
      return problemsJSON[problemIdx].digitValues[inputIdx].answer;
    }
    return answers[problemIdx][inputIdx];
  };
  
  const isInputReadOnly = showSolution;

  return (
    <div className="flex flex-col space-y-8">
      <div className="text-xl font-semibold text-gray-800">Question 1</div>
      <div className="text-gray-600">What is each digit worth? Fill in.</div>

      <div className="flex justify-center gap-20 px-6 py-8">
        {problemsJSON.map((problem, problemIdx) => (
          <div key={problem.id} className="flex flex-col items-center">
            <div className="relative w-full">
              <span className="text-3xl font-medium">{problem.number} l</span>
            </div>
            
            <div className="mt-8 space-y-4">
              {problem.digitValues.map((val, inputIdx) => (
                <div key={inputIdx} className="flex items-center space-x-2">
                  <div className="relative w-32">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-px bg-gray-400"></div>
                  </div>
                  <span className="whitespace-nowrap">{val.text}</span>
                  <input
                    type="text"
                    className={`flex-1 p-1 text-md text-center border-b border-dotted outline-none font-medium ${getInputClass(validation[problemIdx][inputIdx])}`}
                    value={getAnswerValue(problemIdx, inputIdx)}
                    onChange={(e) => handleInputChange(problemIdx, inputIdx, e.target.value)}
                    readOnly={isInputReadOnly}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Controllers
        handleCheck={handleCheck}
        handleShowSolution={handleShowSolution}
        handleShowHint={handleShowHint}
      />
      {showHint && <Hint hint={hint} />}
      <Check summary={summary} />
    </div>
  );
}