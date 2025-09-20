import React, { useState, useCallback, useEffect, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// Data for the multiplication problems
const problemsJSON = [
  {
    id: 1,
    problemRows: [
      { reverse: "23 x 626", estimateText: "20 x 600 =", estimateValue: "12000", answer: "14398" },
      { reverse: "23 x 626", estimateText: "2 x 6 =", estimateValue: "120", answer: "14398" },
      { reverse: "23 x 626", estimateText: "2 x 60 =", estimateValue: "12", answer: "14398" },
      { reverse: "23 x 626", estimateText: "2 x 60 =", estimateValue: "120", answer: "14398" },
    ],
  },
  {
    id: 2,
    problemRows: [
      { reverse: "23 x 626", estimateText: "20 x 600 =", estimateValue: "12000", answer: "14398" },
      { reverse: "23 x 626", estimateText: "2 x 6 =", estimateValue: "120", answer: "14398" },
      { reverse: "23 x 626", estimateText: "2 x 60 =", estimateValue: "12", answer: "14398" },
      { reverse: "23 x 626", estimateText: "2 x 60 =", estimateValue: "120", answer: "14398" },
    ],
  },
];

export default function ArrType_49({ hint }: { hint: string }) {
  const [answers, setAnswers] = useState(
    problemsJSON.map((p) => p.problemRows.map(() => ({ estimate: "", answer: "" })))
  );
  const [validation, setValidation] = useState<(boolean | null)[]>(
    Array(problemsJSON.length * 2 * problemsJSON[0].problemRows.length).fill(null)
  );
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  const handleInputChange = useCallback(
    (problemIdx: number, rowIdx: number, field: "estimate" | "answer", value: string) => {
      setAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[problemIdx][rowIdx] = { ...newAnswers[problemIdx][rowIdx], [field]: value };
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
      p.problemRows.forEach((row, rowIdx) => {
        const isEstimateCorrect = answers[problemIdx][rowIdx].estimate.trim() === row.estimateValue;
        newValidation.push(isEstimateCorrect);
        if (!isEstimateCorrect) allCorrect = false;

        const isAnswerCorrect = answers[problemIdx][rowIdx].answer.trim() === row.answer;
        newValidation.push(isAnswerCorrect);
        if (!isAnswerCorrect) allCorrect = false;
      });
    });

    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    const filledAnswers = problemsJSON.map((p) =>
      p.problemRows.map((row) => ({
        estimate: row.estimateValue,
        answer: row.answer,
      }))
    );
    setAnswers(filledAnswers);
    setValidation(Array(problemsJSON.length * 2 * problemsJSON[0].problemRows.length).fill(true));
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

  const getCellClass = (isCorrect: boolean | null) => {
    if (isCorrect === true) return "text-green-600";
    if (isCorrect === false) return "text-red-600";
    return "text-gray-700";
  };

  const getAnswerValue = (problemIdx: number, rowIdx: number, field: "estimate" | "answer") => {
    if (showSolution) {
      return problemsJSON[problemIdx].problemRows[rowIdx][field === "estimate" ? "estimateValue" : "answer"];
    }
    return answers[problemIdx][rowIdx][field];
  };

  const isInputReadOnly = showSolution;

  return (
    <div className="flex flex-col space-y-8">
      <div className="text-xl font-semibold text-gray-800">Question 1</div>
      <div className="text-gray-600">Estimate first, then place the comma.</div>

      <div className="grid grid-cols-2 gap-x-12 gap-y-8 px-6 py-8">
        {problemsJSON.map((problem, problemIdx) => (
          <div key={problem.id} className="w-full">
            <div className="grid grid-cols-3 border-2 border-orange-300 rounded-lg overflow-hidden">
              {/* Header row */}
              <div className="p-2 bg-orange-100 text-sm font-semibold text-center border-r border-orange-300">reverse</div>
              <div className="p-2 bg-orange-100 text-sm font-semibold text-center border-r border-orange-300">estimate</div>
              <div className="p-2 bg-orange-100 text-sm font-semibold text-center">answer</div>

              {/* Problem rows */}
              {problem.problemRows.map((row, rowIdx) => {
                const estimateValidationIndex = problemIdx * problemsJSON[0].problemRows.length * 2 + rowIdx * 2;
                const answerValidationIndex = problemIdx * problemsJSON[0].problemRows.length * 2 + rowIdx * 2 + 1;

                return (
                  <React.Fragment key={rowIdx}>
                    <div className="p-2 bg-orange-50 text-sm text-center border-r border-orange-300 border-t border-orange-300">
                      <span className="font-medium">{row.reverse}</span>
                    </div>
                    <div className="p-2 bg-orange-50 text-center border-r border-orange-300 border-t border-orange-300 flex items-center justify-center">
                      <span className="font-medium mr-1">{row.estimateText}</span>
                      <input
                        type="text"
                        className={`w-1/2 text-sm text-center bg-transparent border-b border-dotted outline-none font-semibold ${getCellClass(validation[estimateValidationIndex])}`}
                        value={getAnswerValue(problemIdx, rowIdx, "estimate")}
                        onChange={(e) => handleInputChange(problemIdx, rowIdx, "estimate", e.target.value)}
                        readOnly={isInputReadOnly}
                      />
                    </div>
                    <div className="p-2 bg-orange-50 text-center border-t border-orange-300">
                      <input
                        type="text"
                        className={`w-full text-sm text-center bg-transparent border-b border-dotted outline-none font-semibold ${getCellClass(validation[answerValidationIndex])}`}
                        value={getAnswerValue(problemIdx, rowIdx, "answer")}
                        onChange={(e) => handleInputChange(problemIdx, rowIdx, "answer", e.target.value)}
                        readOnly={isInputReadOnly}
                      />
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
      </div>


    </div>
  );
}