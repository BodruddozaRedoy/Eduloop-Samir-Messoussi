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
    number: "2 3,4 5 l",
    digits: ["2", "3", "4", "5"],
    digitValues: [
      { text: "0,005 l", answer: "5 cl" },
      { text: "0,4 l", answer: "40 cl" },
      { text: "3 l", answer: "300 cl" },
      { text: "20 l", answer: "2000 cl" },
    ],
  },
  {
    id: 2,
    number: "1 5,8 8 l",
    digits: ["1", "5", "8", "8"],
    digitValues: [
      { text: "0,009 l", answer: "9 ml" },
      { text: "0,08 l", answer: "80 ml" },
      { text: "0,5 l", answer: "500 ml" },
      { text: "1 l", answer: "1000 ml" },
    ],
  },
];

const renderDigitWithLine = (digit, index, numDigits) => {
  const isLast = index === numDigits - 1;
  const lineStyle = {
    top: '100%',
    left: '50%',
    width: '1px',
    height: '2rem',
    backgroundColor: '#9ca3af',
    transform: 'translateX(-50%)',
  };

  return (
    <div key={index} className="relative flex flex-col items-center">
      <span className="text-3xl font-semibold">{digit}</span>
      <div className="absolute top-full w-px h-8 bg-gray-400"></div>
    </div>
  );
};

export default function ArrType_45({ hint, data:problemsJSON }: {data:any, hint: string }) {
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
    (problemIdx, inputIdx, value) => {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 px-6 py-8">
        {problemsJSON.map((problem, problemIdx) => (
          <div key={problem.id} className="flex flex-col items-center">
            <div className="flex items-start justify-center relative w-full mb-8">
              <span className="text-3xl font-medium whitespace-pre">{problem.number}</span>
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Lines and arrows */}
                {problem.digits.map((digit, index) => {
                  const x1 = index * 20 + 20; // Adjust based on font size and spacing
                  const y1 = 40;
                  const x2 = 180; // Adjust for horizontal position
                  const y2 = 80 + index * 40; // Adjust for vertical spacing
                  return (
                    <g key={index}>
                      <line x1={`${x1}%`} y1="100%" x2={`${x1}%`} y2="120%" stroke="red" strokeWidth="2"/>
                      <path d={`M ${x1}% 120 L 120 ${y2}`} stroke="red" strokeWidth="2" fill="none"/>
                      <polygon points="120,80 125,75 115,75" fill="red"/>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="mt-8 space-y-4">
              {problem.digitValues.map((val, inputIdx) => (
                <div key={inputIdx} className="flex items-center space-x-2">
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