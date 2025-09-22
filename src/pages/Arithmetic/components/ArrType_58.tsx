import  { useState, useCallback, useEffect, useMemo } from "react";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// Data for the multiplication and price problems
const problemsJSON = [
  {
    id: 1,
    label: "zakken zand",
    unit: "kg",
    baseValue: 30,
    quantities: [1, 2, 3, 5, 7],
    answers: [
      { value: "60", calc: "2 x 30" },
      { value: "90", calc: "3 x 30" },
      { value: "150", calc: "5 x 30" },
      { value: "210", calc: "7 x 30" },
    ],
  },
  {
    id: 2,
    label: "rozen",
    unit: "euro",
    baseValue: 30,
    quantities: [10, 20, 40, 80, 100],
    answers: [
      { value: "8", calc: "2 x 4" },
      { value: "16", calc: "4 x 4" },
      { value: "32", calc: "8 x 4" },
      { value: "40", calc: "10 x 4" },
    ],
  },
];

export default function ArrType_58({ hint }: { hint: string }) {
  const initialAnswers = useMemo(
    () =>
      problemsJSON.map((p) =>
        p.answers.map(() => ({ value: "", calc: "" }))
      ),
    []
  );

  const [answers, setAnswers] = useState(initialAnswers);
  const [validation, setValidation] = useState(
    problemsJSON.map((p) => p.answers.map(() => ({ value: null, calc: null })))
  );
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  const handleInputChange = useCallback(
    (problemIdx: number, inputIdx: number, field: "value" | "calc", value: string) => {
      setAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[problemIdx][inputIdx] = {
          ...newAnswers[problemIdx][inputIdx],
          [field]: value,
        };
        return newAnswers;
      });
      setStatus(null);
      setValidation(problemsJSON.map((p) => p.answers.map(() => ({ value: null, calc: null }))));
    },
    []
  );

  const handleCheck = useCallback(() => {
    let allCorrect = true;
    const newValidation = problemsJSON.map((p, problemIdx) => {
      return p.answers.map((correctAnswer, inputIdx) => {
        const isValueCorrect = answers[problemIdx][inputIdx].value === correctAnswer.value;
        const isCalcCorrect = answers[problemIdx][inputIdx].calc === correctAnswer.calc;

        if (!isValueCorrect || !isCalcCorrect) {
          allCorrect = false;
        }

        return {
          value: isValueCorrect,
          calc: isCalcCorrect,
        };
      });
    });

    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    const filledAnswers = problemsJSON.map((p) => p.answers.map(ans => ({ value: ans.value, calc: ans.calc })));
    const newValidation = problemsJSON.map((p) => p.answers.map(() => ({ value: true, calc: true })));
    setAnswers(filledAnswers);
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
    if (showSolution) return "text-green-600";
    if (isCorrect === true) return "text-green-600";
    if (isCorrect === false) return "text-red-600";
    return "text-gray-700";
  };

  const getAnswerValue = (problemIdx: number, inputIdx: number, field: "value" | "calc") => {
    if (showSolution) {
      return problemsJSON[problemIdx].answers[inputIdx][field];
    }
    return answers[problemIdx][inputIdx][field];
  };

  const isInputReadOnly = showSolution;

  return (
    <div className="flex flex-col space-y-8">
      <div className="text-xl font-semibold text-gray-800">Question 1</div>
      <div className="text-gray-600">Fill in the multiplication sums in the thought bubbles. Calculate.</div>
      
      <div className="flex justify-center px-6 py-8">
        <div className="grid grid-cols-6 gap-0 border-2 border-orange-300 rounded-lg overflow-hidden">
          {/* Header row */}
          <div className="p-2 bg-orange-100 text-sm font-semibold text-center border-r border-orange-300">zakken zand</div>
          {problemsJSON[0].quantities.map((q, idx) => (
            <div key={idx} className="p-2 bg-orange-100 text-sm font-semibold text-center border-r border-orange-300">
              {q}
            </div>
          ))}

          {/* First data row (kg) */}
          <div className="p-2 bg-orange-50 text-sm font-semibold text-center border-r border-orange-300">kg</div>
          <div className="relative p-2 bg-white text-sm text-center border-r border-orange-300">
            <span className="font-medium">{problemsJSON[0].baseValue}</span>
          </div>
          {problemsJSON[0].answers.map((answer, idx) => (
            <div key={idx} className="relative p-2 bg-white text-center border-r border-orange-300">
              <input
                type="text"
                className={`w-full text-sm text-center bg-transparent border-b border-dotted outline-none font-semibold ${getInputClass(validation[0][idx]?.value)}`}
                value={getAnswerValue(0, idx, "value")}
                onChange={(e) => handleInputChange(0, idx, "value", e.target.value)}
                readOnly={isInputReadOnly}
              />
              <br />
              <input
                type="text"
                className={`w-full text-xs text-center bg-transparent border-b border-dotted outline-none ${getInputClass(validation[0][idx]?.calc)}`}
                value={getAnswerValue(0, idx, "calc")}
                onChange={(e) => handleInputChange(0, idx, "calc", e.target.value)}
                readOnly={isInputReadOnly}
              />
            </div>
          ))}

          {/* Spacer row */}
          <div className="col-span-6 p-2"></div>

          {/* Second header row (rozen) */}
          <div className="p-2 bg-orange-100 text-sm font-semibold text-center border-r border-orange-300">rozen</div>
          {problemsJSON[1].quantities.map((q, idx) => (
            <div key={idx} className="p-2 bg-orange-100 text-sm font-semibold text-center border-r border-orange-300">
              {q}
            </div>
          ))}

          {/* Second data row (euro) */}
          <div className="p-2 bg-orange-50 text-sm font-semibold text-center border-r border-orange-300">euro</div>
          <div className="relative p-2 bg-white text-sm text-center border-r border-orange-300">
            <span className="font-medium">{problemsJSON[1].baseValue}</span>
          </div>
          {problemsJSON[1].answers.map((answer, idx) => (
            <div key={idx} className="relative p-2 bg-white text-center border-r border-orange-300">
              <input
                type="text"
                className={`w-full text-sm text-center bg-transparent border-b border-dotted outline-none font-semibold ${getInputClass(validation[1][idx]?.value)}`}
                value={getAnswerValue(1, idx, "value")}
                onChange={(e) => handleInputChange(1, idx, "value", e.target.value)}
                readOnly={isInputReadOnly}
              />
              <br />
              <input
                type="text"
                className={`w-full text-xs text-center bg-transparent border-b border-dotted outline-none ${getInputClass(validation[1][idx]?.calc)}`}
                value={getAnswerValue(1, idx, "calc")}
                onChange={(e) => handleInputChange(1, idx, "calc", e.target.value)}
                readOnly={isInputReadOnly}
              />
            </div>
          ))}
        </div>
      </div>

   
    </div>
  );
}