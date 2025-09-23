import React, { useState, useCallback, useEffect, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// Data for the time calculation problems
const problemsJSON = [
  {
    id: 1,
    start: "13:05",
    finish: "13:56",
    duration: "51 minutes",
    inputField: "finish",
  },
  {
    id: 2,
    start: "15:20",
    finish: "16:09",
    duration: "49 minutes",
    inputField: "duration",
  },
  {
    id: 3,
    start: "14:35",
    finish: "15:11",
    duration: "36 minutes",
    inputField: "start",
  },
];

export default function ArrType_74({ hint }: { hint: string }) {
  const [answers, setAnswers] = useState(
    problemsJSON.map(() => ({ start: "", finish: "", duration: "" }))
  );
  const [validation, setValidation] = useState<(boolean | null)[]>(
    Array(problemsJSON.length).fill(null)
  );
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  const handleInputChange = useCallback(
    (problemIdx: number, field: "start" | "finish" | "duration", value: string) => {
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
    const newValidation = problemsJSON.map((p, problemIdx) => {
      let isCorrect = false;
      const userAnswer = answers[problemIdx][p.inputField]?.trim();
      const correctAnswer = p[p.inputField];

      if (userAnswer === correctAnswer) {
        isCorrect = true;
      } else {
        allCorrect = false;
      }
      return isCorrect;
    });

    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    const filledAnswers = problemsJSON.map((p) => {
      const newAnswer = {};
      if (p.start) newAnswer.start = p.start;
      if (p.finish) newAnswer.finish = p.finish;
      if (p.duration) newAnswer.duration = p.duration;
      return newAnswer;
    });
    setAnswers(filledAnswers);
    setValidation(Array(problemsJSON.length).fill(true));
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

  const getAnswerValue = (problemIdx: number, field: "start" | "finish" | "duration") => {
    if (showSolution) {
      return problemsJSON[problemIdx][field];
    }
    return answers[problemIdx][field];
  };

  const isInputReadOnly = showSolution;

  return (
    <div className="flex flex-col space-y-8">
      <div className="text-xl font-semibold text-gray-800">Question 1</div>
      <div className="text-gray-600">Fill in the times.</div>

      <div className="w-full max-w-2xl mx-auto">
        <div className="grid grid-cols-3 border-2 border-orange-300 rounded-lg overflow-hidden">
          {/* Header row */}
          <div className="p-2 bg-orange-100 text-sm font-semibold text-center border-r border-orange-300">Start</div>
          <div className="p-2 bg-orange-100 text-sm font-semibold text-center border-r border-orange-300">Finish</div>
          <div className="p-2 bg-orange-100 text-sm font-semibold text-center">Duration</div>

          {/* Problem rows */}
          {problemsJSON.map((p, problemIdx) => {
            const getField = (field) => {
              const isAnswerField = p.inputField === field;
              const isCorrect = validation[problemIdx] === true;
              const isIncorrect = validation[problemIdx] === false;

              if (isAnswerField) {
                return (
                  <input
                    type="text"
                    className={`w-full text-sm text-center bg-transparent border-b border-dotted outline-none font-semibold ${getInputClass(isCorrect ? true : (isIncorrect ? false : null))}`}
                    value={getAnswerValue(problemIdx, field)}
                    onChange={(e) => handleInputChange(problemIdx, field, e.target.value)}
                    readOnly={isInputReadOnly}
                  />
                );
              } else {
                return <span className="font-medium text-sm">{p[field]}</span>;
              }
            };
            
            return (
              <React.Fragment key={p.id}>
                <div className="p-2 bg-white text-center border-r border-orange-300 border-t border-orange-300">
                  {getField("start")}
                </div>
                <div className="p-2 bg-white text-center border-r border-orange-300 border-t border-orange-300">
                  {getField("finish")}
                </div>
                <div className="p-2 bg-white text-center border-t border-orange-300">
                  {getField("duration")}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

    
    </div>
  );
}