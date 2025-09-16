import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useEffect, useState, useCallback, useMemo } from "react";

// Math problems data
const problemsJSON = [
  { id: 1, question: "5 x _ = 40", answer: 8 },
  { id: 2, question: "_ x 8 = 48", answer: 6 },
  { id: 3, question: "8 x 7 = _", answer: 56 },
  { id: 4, question: "_ x 7 = 42", answer: 6 },
  { id: 5, question: "_ x 9 = 45", answer: 5 },
  { id: 6, question: "6 x 9 = _", answer: 54 },
  { id: 7, question: "6 x 9 = _", answer: 54 },
  { id: 8, question: "_ x 9 = 45", answer: 5 },
  { id: 9, question: "7 x 6 = _", answer: 42 },
];

export default function ArrType_19({ hint, data:problemsJSON }: { hint: string, data:any }) {
  const [answers, setAnswers] = useState<(string | number)[]>(
    Array(problemsJSON.length).fill("")
  );
  const [validation, setValidation] = useState<(boolean | null)[]>(
    Array(problemsJSON.length).fill(null)
  );
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  const handleInputChange = useCallback((idx: number, val: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = val === "" ? "" : parseInt(val, 10);
      return next;
    });
    setStatus(null);
  }, []);

  const handleCheck = useCallback(() => {
    const newValidation = problemsJSON.map((p, i) => p.answer === answers[i]);
    const allCorrect = newValidation.every(Boolean);
    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    setAnswers(problemsJSON.map((p) => p.answer));
    setValidation(Array(problemsJSON.length).fill(true));
    setStatus("match");
    setShowSolution(true);
  }, []);

  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  const summary = useMemo(() => {
    if (!status) return null;
    return status === "match"
      ? {
          text: "🎉 Correct! Good Job",
          color: "text-green-600",
        }
      : {
          text: "❌ Some answers are wrong",
          color: "text-red-600",
        };
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

  return (
    <div className="flex flex-col">
      {/* Math problems grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full justify-items-start">
        {problemsJSON.map((p, idx) => (
          <div
            key={p.id}
            className="flex items-center gap-2 p-2 sm:p-4 rounded bg-white"
          >
            {p.question.split(" ").map((part, i) =>
              part === "_" ? (
                <input
                  key={i}
                  type="number"
                  className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-center rounded 
                      bg-no-repeat bg-center`}
                  style={{ backgroundImage: `url("/images/math.png")` }}
                  value={
                    showSolution
                      ? problemsJSON[idx].answer
                      : (answers[idx] as string | number)
                  }
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  readOnly={showSolution}
                />
              ) : (
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

      {/* Controllers and feedback (optional UI) */}
      {/* <div className="mt-6 flex justify-start">
        <Controllers
          handleCheck={handleCheck}
          handleShowSolution={handleShowSolution}
          handleShowHint={handleShowHint}
        />
      </div>

      {showHint && <Hint hint={hint} />}
      <Check summary={summary} /> */}
    </div>
  );
}
