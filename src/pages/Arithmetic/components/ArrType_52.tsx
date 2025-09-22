import  { useState, useCallback, useEffect, useMemo } from "react";

import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// Data for the mixed-format problems
const problemsJSON = [
  {
    id: 1,
    type: "direct",
    question: "7 x 4 =",
    answer: "28",
  },
  {
    id: 2,
    type: "reverse",
    operation: "multiplication",
    correctFactor1: 70,
    correctFactor2: 40,
    answer: 2800,
  },
  {
    id: 3,
    type: "direct",
    question: "21 : 3 =",
    answer: "7",
  },
  {
    id: 4,
    type: "reverse",
    operation: "division",
    correctFactor1: 2100,
    correctFactor2: 30,
    answer: 70,
  },
  {
    id: 5,
    type: "direct",
    question: "70 x 40 =",
    answer: "2800",
  },
  {
    id: 6,
    type: "direct",
    question: "2100 : 30 =",
    answer: "70",
  },
  {
    id: 7,
    type: "reverse",
    operation: "multiplication",
    correctFactor1: 7,
    correctFactor2: 4,
    answer: 28,
  },
];

export default function ArrType_52({ hint }: { hint: string }) {
  const [answers, setAnswers] = useState(
    problemsJSON.map((p) => {
      if (p.type === "direct") return { answer: "" };
      return { factor1: "", factor2: "" };
    })
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
    (problemIdx: number, field: string, value: string) => {
      setAnswers((prev) => {
        const newAnswers = [...prev];
        if (newAnswers[problemIdx]) {
          newAnswers[problemIdx] = { ...newAnswers[problemIdx], [field]: value };
        }
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
      if (p.type === "direct") {
        const isCorrect = answers[problemIdx]?.answer?.trim() === p.answer;
        newValidation.push(isCorrect);
        if (!isCorrect) allCorrect = false;
        // Pad validation for consistency in a mixed array
        newValidation.push(null);
      } else { // Reverse type
        const isFactor1Correct = parseInt(answers[problemIdx].factor1) === p.correctFactor1;
        const isFactor2Correct = parseInt(answers[problemIdx].factor2) === p.correctFactor2;
        newValidation.push(isFactor1Correct);
        newValidation.push(isFactor2Correct);
        if (!isFactor1Correct || !isFactor2Correct) allCorrect = false;
      }
    });
  
    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    const filledAnswers = problemsJSON.map((p) => {
      if (p.type === "direct") {
        return { answer: p.answer };
      }
      return {
        factor1: p.correctFactor1.toString(),
        factor2: p.correctFactor2.toString(),
      };
    });
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

  const getAnswerValue = (problemIdx: number, field: string) => {
    if (showSolution) {
      if (field === "answer") return problemsJSON[problemIdx].answer;
      if (field === "factor1") return problemsJSON[problemIdx].correctFactor1.toString();
      if (field === "factor2") return problemsJSON[problemIdx].correctFactor2.toString();
    }
    return answers[problemIdx][field];
  };

  const isInputReadOnly = showSolution;

  return (
    <div className="flex flex-col space-y-8">
      <div className="text-xl font-semibold text-gray-800">Question 1</div>
      <div className="text-gray-600">
        Calculate the small sum. Think of a large sum to go with it.
        Create a large sum like in the example.
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-8 px-6 py-8">
        {problemsJSON.map((p, problemIdx) => {
          // Calculate validation indices dynamically
          const validationIndex = problemIdx * 2;

          if (p.type === "direct") {
            return (
              <div key={p.id} className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-md text-gray-700 font-medium whitespace-nowrap">
                    {p.question}
                  </span>
                  <input
                    type="text"
                    className={`w-24 p-1 text-md text-center border-b border-dotted outline-none font-medium ${getInputClass(validation[validationIndex])}`}
                    value={getAnswerValue(problemIdx, "answer")}
                    onChange={(e) => handleInputChange(problemIdx, "answer", e.target.value)}
                    readOnly={isInputReadOnly}
                  />
                </div>
              </div>
            );
          } else { // Reverse type
            return (
              <div key={p.id} className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-md text-gray-700 font-medium whitespace-nowrap">
                    {p.answer} =
                  </span>
                  <input
                    type="text"
                    className={`w-16 p-1 text-md text-center border-b border-dotted outline-none font-medium ${getInputClass(validation[validationIndex])}`}
                    value={getAnswerValue(problemIdx, "factor1")}
                    onChange={(e) => handleInputChange(problemIdx, "factor1", e.target.value)}
                    readOnly={isInputReadOnly}
                  />
                  <span className="text-md font-medium">{p.operation === "multiplication" ? "x" : ":"}</span>
                  <input
                    type="text"
                    className={`w-16 p-1 text-md text-center border-b border-dotted outline-none font-medium ${getInputClass(validation[validationIndex + 1])}`}
                    value={getAnswerValue(problemIdx, "factor2")}
                    onChange={(e) => handleInputChange(problemIdx, "factor2", e.target.value)}
                    readOnly={isInputReadOnly}
                  />
                </div>
              </div>
            );
          }
        })}
      </div>

    </div>
  );
}