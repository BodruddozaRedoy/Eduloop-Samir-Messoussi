import React, { useState, useCallback, useEffect, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// Data for the counting problems
const problemsJSON = [
  // -1 and +1 problems
  ...Array(4).fill({
    id: "minus1_plus1",
    center: 6490,
    minus: -1,
    plus: +1,
  }),
  // -10 and +10 problems
  ...Array(4).fill({
    id: "minus10_plus10",
    center: 6490,
    minus: -10,
    plus: +10,
  }),
  // -100 and +100 problems
  ...Array(4).fill({
    id: "minus100_plus100",
    center: 6490,
    minus: -100,
    plus: +100,
  }),
  // -1000 and +1000 problems
  ...Array(4).fill({
    id: "minus1000_plus1000",
    center: 6490,
    minus: -1000,
    plus: +1000,
  }),
];

export default function ArrType_44({ hint }: { hint: string }) {
  const [answers, setAnswers] = useState(
    problemsJSON.map(() => ({ minus: "", plus: "" }))
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

  const handleInputChange = useCallback(
    (problemIdx: number, field: "minus" | "plus", value: string) => {
      setAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[problemIdx] = { ...newAnswers[problemIdx], [field]: value };
        return newAnswers;
      });
      setStatus(null);
    },
    []
  );

  const handleCheck = useCallback(() => {
    let allCorrect = true;
    const newValidation = [];
    problemsJSON.forEach((p, problemIdx) => {
      const minusAnswer = p.center + p.minus;
      const plusAnswer = p.center + p.plus;

      const isMinusCorrect = parseInt(answers[problemIdx].minus) === minusAnswer;
      const isPlusCorrect = parseInt(answers[problemIdx].plus) === plusAnswer;

      newValidation.push(isMinusCorrect);
      newValidation.push(isPlusCorrect);

      if (!isMinusCorrect || !isPlusCorrect) {
        allCorrect = false;
      }
    });

    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    const filledAnswers = problemsJSON.map((p) => ({
      minus: (p.center + p.minus).toString(),
      plus: (p.center + p.plus).toString(),
    }));
    setAnswers(filledAnswers);
    setValidation(Array(problemsJSON.length * 2).fill(true));
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

  const getAnswerValue = (problemIdx: number, field: "minus" | "plus") => {
    if (showSolution) {
      return (problemsJSON[problemIdx].center + problemsJSON[problemIdx][field]).toString();
    }
    return answers[problemIdx][field];
  };

  const isInputReadOnly = showSolution;

  const renderProblem = (p, problemIdx) => (
    <div key={problemIdx} className="flex flex-col space-y-4">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center space-x-1 p-1 bg-blue-200 rounded-md">
          <span className="text-blue-700 font-semibold">{p.minus}</span>
        </div>
        <div className="flex items-center space-x-1 p-1 bg-blue-200 rounded-md">
          <span className="text-blue-700 font-semibold">{p.plus}</span>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-1">
        <input
          type="text"
          className={`w-24 p-1 text-md text-center border-b border-dotted outline-none font-medium ${getInputClass(problemIdx * 2)}`}
          value={getAnswerValue(problemIdx, "minus")}
          onChange={(e) => handleInputChange(problemIdx, "minus", e.target.value)}
          readOnly={isInputReadOnly}
        />
        <span className="text-md font-medium text-gray-700">{`-${p.center}-`}</span>
        <input
          type="text"
          className={`w-24 p-1 text-md text-center border-b border-dotted outline-none font-medium ${getInputClass(problemIdx * 2 + 1)}`}
          value={getAnswerValue(problemIdx, "plus")}
          onChange={(e) => handleInputChange(problemIdx, "plus", e.target.value)}
          readOnly={isInputReadOnly}
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col space-y-8">
      <div className="text-xl font-semibold text-gray-800">Question 1</div>
      <div className="text-gray-600">Count on and back.</div>

      <div className="grid grid-cols-2 gap-x-12 gap-y-8 px-6 py-8">
        <div className="flex flex-col space-y-4">
          {problemsJSON.slice(0, 4).map((p, idx) => renderProblem(p, idx))}
        </div>
        <div className="flex flex-col space-y-4">
          {problemsJSON.slice(4, 8).map((p, idx) => renderProblem(p, idx + 4))}
        </div>
        <div className="flex flex-col space-y-4">
          {problemsJSON.slice(8, 12).map((p, idx) => renderProblem(p, idx + 8))}
        </div>
        <div className="flex flex-col space-y-4">
          {problemsJSON.slice(12, 16).map((p, idx) => renderProblem(p, idx + 12))}
        </div>
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