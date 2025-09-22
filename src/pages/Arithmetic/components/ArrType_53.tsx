import React, { useState, useCallback, useEffect, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// Data for the area calculation problems
const problemsJSON = [
  {
    id: 1,
    length: 4.2,
    width: 3.1,
    estimation: "4 x 3 =",
    estimateAnswer: "12",
    sumWithoutDecimals: "42 x 31 =",
    sumWithoutDecimalsAnswer: "1302",
    area: "13.02",
  },
  {
    id: 2,
    length: 4.2,
    width: 3.1,
    estimation: "4 x 3 =",
    estimateAnswer: "12",
    sumWithoutDecimals: "42 x 31 =",
    sumWithoutDecimalsAnswer: "1302",
    area: "13.02",
  },
  {
    id: 3,
    length: 4.2,
    width: 3.1,
    estimation: "4 x 3 =",
    estimateAnswer: "12",
    sumWithoutDecimals: "42 x 31 =",
    sumWithoutDecimalsAnswer: "1302",
    area: "13.02",
  },
  {
    id: 4,
    length: 4.2,
    width: 3.1,
    estimation: "4 x 3 =",
    estimateAnswer: "12",
    sumWithoutDecimals: "42 x 31 =",
    sumWithoutDecimalsAnswer: "1302",
    area: "13.02",
  },
];

export default function ArrType_53({ hint }: { hint: string }) {
  const [answers, setAnswers] = useState(
    problemsJSON.map(() => ({ estimate: "", sum: "", area: "" }))
  );
  const [validation, setValidation] = useState<(boolean | null)[]>(
    Array(problemsJSON.length * 3).fill(null)
  );
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  const handleInputChange = useCallback(
    (problemIdx: number, field: "estimate" | "sum" | "area", value: string) => {
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
      const isEstimateCorrect = answers[problemIdx].estimate.trim() === p.estimateAnswer;
      newValidation.push(isEstimateCorrect);
      if (!isEstimateCorrect) allCorrect = false;

      const isSumCorrect = answers[problemIdx].sum.trim() === p.sumWithoutDecimalsAnswer;
      newValidation.push(isSumCorrect);
      if (!isSumCorrect) allCorrect = false;

      const isAreaCorrect = answers[problemIdx].area.trim() === p.area;
      newValidation.push(isAreaCorrect);
      if (!isAreaCorrect) allCorrect = false;
    });

    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    const filledAnswers = problemsJSON.map((p) => ({
      estimate: p.estimateAnswer,
      sum: p.sumWithoutDecimalsAnswer,
      area: p.area,
    }));
    setAnswers(filledAnswers);
    setValidation(Array(problemsJSON.length * 3).fill(true));
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

  const getAnswerValue = (problemIdx: number, field: "estimate" | "sum" | "area") => {
    if (showSolution) {
      if (field === "estimate") return problemsJSON[problemIdx].estimateAnswer;
      if (field === "sum") return problemsJSON[problemIdx].sumWithoutDecimalsAnswer;
      if (field === "area") return problemsJSON[problemIdx].area;
    }
    return answers[problemIdx][field];
  };

  const isInputReadOnly = showSolution;

  return (
    <div className="flex flex-col space-y-8">
      <div className="text-xl font-semibold text-gray-800">Question 1</div>
      <div className="text-gray-600">
        What is the area? Estimate first, then calculate without decimals (using that calculator) and place the decimal point afterwards.
      </div>

      <div className="w-full">
        <div className="grid grid-cols-6 border-2 border-orange-300 rounded-lg overflow-hidden">
          {/* Header row */}
          <div className="p-2 bg-orange-100 text-sm font-semibold text-center border-r border-orange-300">room</div>
          <div className="p-2 bg-orange-100 text-sm font-semibold text-center border-r border-orange-300">length</div>
          <div className="p-2 bg-orange-100 text-sm font-semibold text-center border-r border-orange-300">width</div>
          <div className="p-2 bg-orange-100 text-sm font-semibold text-center border-r border-orange-300">estimation</div>
          <div className="p-2 bg-orange-100 text-sm font-semibold text-center border-r border-orange-300">sum without decimals</div>
          <div className="p-2 bg-orange-100 text-sm font-semibold text-center">area</div>

          {/* Problem rows */}
          {problemsJSON.map((p, problemIdx) => {
            const estimateValidationIndex = problemIdx * 3;
            const sumValidationIndex = problemIdx * 3 + 1;
            const areaValidationIndex = problemIdx * 3 + 2;

            return (
              <React.Fragment key={p.id}>
                <div className="p-2 bg-orange-50 text-sm text-center border-r border-orange-300 border-t border-orange-300">
                  <span className="font-medium">{`${p.length} x ${p.width} =`}</span>
                </div>
                <div className="p-2 bg-orange-50 text-sm text-center border-r border-orange-300 border-t border-orange-300">
                  <span className="font-medium">{`${p.length} m`}</span>
                </div>
                <div className="p-2 bg-orange-50 text-sm text-center border-r border-orange-300 border-t border-orange-300">
                  <span className="font-medium">{`${p.width} m`}</span>
                </div>
                <div className="p-2 bg-orange-50 text-sm text-center border-r border-orange-300 border-t border-orange-300 flex items-center justify-center space-x-1">
                  <span className="font-medium">{p.estimation}</span>
                  <input
                    type="text"
                    className={`w-1/2 text-sm text-center bg-transparent border-dotted border-b border-gray-500  outline-none font-semibold ${getInputClass(validation[estimateValidationIndex])}`}
                    value={getAnswerValue(problemIdx, "estimate")}
                    onChange={(e) => handleInputChange(problemIdx, "estimate", e.target.value)}
                    readOnly={isInputReadOnly}
                  />
                </div>
                <div className="p-2 bg-orange-50 text-sm text-center border-r border-orange-300 border-t border-orange-300 flex items-center justify-center space-x-1">
                  <span className="font-medium">{p.sumWithoutDecimals}</span>
                  <input
                    type="text"
                    className={`w-1/2 text-sm text-center bg-transparent border-dotted border-b border-gray-500  outline-none font-semibold ${getInputClass(validation[sumValidationIndex])}`}
                    value={getAnswerValue(problemIdx, "sum")}
                    onChange={(e) => handleInputChange(problemIdx, "sum", e.target.value)}
                    readOnly={isInputReadOnly}
                  />
                </div>
                <div className="p-2 bg-orange-50 text-sm text-center border-t border-orange-300 flex items-center justify-center space-x-1">
                  <input
                    type="text"
                    className={`w-full text-sm text-center bg-transparent border-dotted border-b border-gray-500  outline-none font-semibold ${getInputClass(validation[areaValidationIndex])}`}
                    value={getAnswerValue(problemIdx, "area")}
                    onChange={(e) => handleInputChange(problemIdx, "area", e.target.value)}
                    readOnly={isInputReadOnly}
                  />
                  <span className="font-medium text-gray-700">m²</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>


    </div>
  );
}