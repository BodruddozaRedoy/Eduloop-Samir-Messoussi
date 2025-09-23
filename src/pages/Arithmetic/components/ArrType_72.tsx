import React, { useState, useCallback, useEffect, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// Data for the division problems
const problemsJSON = [
  {
    id: 1,
    days: "147 days",
    partialSum: "147:7",
    helpSum1: { text: "140:7", answer: "20" },
    helpSum2: { text: "7:7", answer: "1" },
    weeks: "21",
    isExample: true,
  },
  {
    id: 2,
    days: "154 days",
    partialSum: "154:7",
    helpSum1: { text: "140:7", answer: "20" },
    helpSum2: { text: "14:7", answer: "2" },
    weeks: "22",
    isExample: false,
  },
  {
    id: 3,
    days: "154 days",
    partialSum: "154:7",
    helpSum1: { text: "140:7", answer: "20" },
    helpSum2: { text: "14:7", answer: "2" },
    weeks: "22",
    isExample: false,
  },
  {
    id: 4,
    days: "154 days",
    partialSum: "154:7",
    helpSum1: { text: "140:7", answer: "20" },
    helpSum2: { text: "14:7", answer: "2" },
    weeks: "22",
    isExample: false,
  },
];

export default function ArrType_53({ hint }: { hint: string }) {
  const [answers, setAnswers] = useState(
    problemsJSON.map(() => ({ partialSum: "", helpSum1: "", helpSum2: "", weeks: "" }))
  );
  const [validation, setValidation] = useState<(boolean | null)[]>(
    Array(problemsJSON.length * 4).fill(null)
  );
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  const handleInputChange = useCallback(
    (problemIdx: number, field: string, value: string) => {
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
      // Skip example row for validation
      if (p.isExample) {
        newValidation.push(null, null, null, null);
        return;
      }
      
      const isPartialSumCorrect = answers[problemIdx].partialSum.trim() === p.partialSum;
      const isHelpSum1Correct = answers[problemIdx].helpSum1.trim() === p.helpSum1.answer;
      const isHelpSum2Correct = answers[problemIdx].helpSum2.trim() === p.helpSum2.answer;
      const isWeeksCorrect = answers[problemIdx].weeks.trim() === p.weeks;

      newValidation.push(isPartialSumCorrect);
      newValidation.push(isHelpSum1Correct);
      newValidation.push(isHelpSum2Correct);
      newValidation.push(isWeeksCorrect);

      if (!isPartialSumCorrect || !isHelpSum1Correct || !isHelpSum2Correct || !isWeeksCorrect) {
        allCorrect = false;
      }
    });

    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    const filledAnswers = problemsJSON.map((p) => ({
      partialSum: p.partialSum,
      helpSum1: p.helpSum1.answer,
      helpSum2: p.helpSum2.answer,
      weeks: p.weeks,
    }));
    setAnswers(filledAnswers);
    setValidation(Array(problemsJSON.length * 4).fill(true));
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
  
  const getAnswerValue = (problemIdx: number, field: string) => {
    if (showSolution) {
      const p = problemsJSON[problemIdx];
      if (field === 'partialSum') return p.partialSum;
      if (field === 'helpSum1') return p.helpSum1.answer;
      if (field === 'helpSum2') return p.helpSum2.answer;
      if (field === 'weeks') return p.weeks;
    }
    return answers[problemIdx][field];
  };

  const isInputReadOnly = showSolution;

  const renderHelpSums = (p, problemIdx) => {
    const helpSum1ValidationIndex = problemIdx * 4 + 1;
    const helpSum2ValidationIndex = problemIdx * 4 + 2;

    const isSolved = showSolution || status === "match";
    
    // Check if the overall row is correct to apply green coloring
    const isRowCorrect = isSolved && validation[problemIdx * 4 + 1] && validation[problemIdx * 4 + 2];
    const textColor = isRowCorrect ? "text-green-600" : "text-gray-700";
    
    return (
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-center space-x-1">
          <span className={`font-medium ${textColor}`}>
            {p.helpSum1.text} =
          </span>
          {isSolved ? (
            <span className={`w-1/2 text-sm text-center font-semibold border-b border-dotted ${textColor}`}>
              {p.helpSum1.answer}
            </span>
          ) : (
            <input
              type="text"
              className={`w-1/2 text-sm text-center bg-transparent border-b border-dotted outline-none font-semibold ${getInputClass(validation[helpSum1ValidationIndex])}`}
              value={getAnswerValue(problemIdx, "helpSum1")}
              onChange={(e) => handleInputChange(problemIdx, "helpSum1", e.target.value)}
              readOnly={isInputReadOnly}
            />
          )}
        </div>
        <div className="flex items-center justify-center space-x-1">
          <span className={`font-medium ${textColor}`}>
            {p.helpSum2.text} =
          </span>
          {isSolved ? (
            <span className={`w-1/2 text-sm text-center font-semibold border-b border-dotted ${textColor}`}>
              {p.helpSum2.answer}
            </span>
          ) : (
            <input
              type="text"
              className={`w-1/2 text-sm text-center bg-transparent border-b border-dotted outline-none font-semibold ${getInputClass(validation[helpSum2ValidationIndex])}`}
              value={getAnswerValue(problemIdx, "helpSum2")}
              onChange={(e) => handleInputChange(problemIdx, "helpSum2", e.target.value)}
              readOnly={isInputReadOnly}
            />
          )}
        </div>
      </div>
    );
  };
  
  const renderPartialSum = (p, problemIdx) => {
    const partialSumValidationIndex = problemIdx * 4;
    const isSolved = showSolution || status === "match";
    const isCorrect = isSolved && validation[partialSumValidationIndex];
    const textColor = isCorrect ? "text-green-600" : "text-gray-700";
    
    return (
      <div className="p-2 bg-white text-center border-r border-orange-300 border-t border-orange-300">
        {isSolved ? (
          <span className={`font-medium ${textColor}`}>{p.partialSum}</span>
        ) : (
          <input
            type="text"
            className={`w-full text-sm text-center bg-transparent border-b border-dotted outline-none font-semibold ${getInputClass(validation[partialSumValidationIndex])}`}
            value={getAnswerValue(problemIdx, "partialSum")}
            onChange={(e) => handleInputChange(problemIdx, "partialSum", e.target.value)}
            readOnly={isInputReadOnly}
          />
        )}
      </div>
    );
  };

  const renderWeeks = (p, problemIdx) => {
    const weeksValidationIndex = problemIdx * 4 + 3;
    const isSolved = showSolution || status === "match";
    const isCorrect = isSolved && validation[weeksValidationIndex];
    const textColor = isCorrect ? "text-green-600" : "text-gray-700";
    
    return (
      <div className="p-2 bg-white text-center border-t border-orange-300">
        {isSolved ? (
          <span className={`font-medium ${textColor}`}>{p.weeks}</span>
        ) : (
          <input
            type="text"
            className={`w-full text-sm text-center bg-transparent border-b border-dotted outline-none font-semibold ${getInputClass(validation[weeksValidationIndex])}`}
            value={getAnswerValue(problemIdx, "weeks")}
            onChange={(e) => handleInputChange(problemIdx, "weeks", e.target.value)}
            readOnly={isInputReadOnly}
          />
        )}
      </div>
    );
  };


  return (
    <div className="flex flex-col space-y-8">
      <div className="text-xl font-semibold text-gray-800">Question 1</div>
      <div className="text-gray-600">Which sum corresponds? Fill in the table. There are 7 days in 1 week. How many weeks are there?</div>

      <div className="w-full">
        <div className="grid grid-cols-4 border-2 border-orange-300 rounded-lg overflow-hidden">
          {/* Header row */}
          <div className="p-2 bg-orange-100 text-sm font-semibold text-center border-r border-orange-300"></div>
          <div className="p-2 bg-orange-100 text-sm font-semibold text-center border-r border-orange-300">partial sum</div>
          <div className="p-2 bg-orange-100 text-sm font-semibold text-center border-r border-orange-300">help sums</div>
          <div className="p-2 bg-orange-100 text-sm font-semibold text-center">number of weeks</div>
          
          {/* Problem rows */}
          {problemsJSON.map((p, problemIdx) => (
            <React.Fragment key={p.id}>
              {/* Days */}
              <div className={`p-2 ${p.isExample ? 'bg-orange-50' : 'bg-white'} text-sm text-left border-r border-orange-300 border-t border-orange-300`}>
                <span className="font-medium">{p.days}</span>
              </div>
              
              {/* Partial Sum */}
              {renderPartialSum(p, problemIdx)}

              {/* Help Sums */}
              <div className="p-2 bg-white text-sm text-center border-r border-orange-300 border-t border-orange-300">
                {p.isExample ? (
                  <span className="font-medium">
                    {p.helpSum1.text} = {p.helpSum1.answer} en {p.helpSum2.text} = {p.helpSum2.answer}
                  </span>
                ) : (
                  renderHelpSums(p, problemIdx)
                )}
              </div>

              {/* Weeks */}
              {renderWeeks(p, problemIdx)}
            </React.Fragment>
          ))}
        </div>
      </div>

   
    </div>
  );
}