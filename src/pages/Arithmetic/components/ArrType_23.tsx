import React, { useState, useCallback, useEffect, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// Multiplication problems data
const problemsJSON = [
  {
    id: 1,
    factor1: 6,
    factor2: 37,
    breakdown1: 30,
    breakdown2: 7,
    partialProduct1: 180, // 6 * 30
    partialProduct2: 42, // 6 * 7
    product: 222, // 180 + 42
  },
  {
    id: 2,
    factor1: 7,
    factor2: 28,
    breakdown1: 20,
    breakdown2: 8,
    partialProduct1: 140, // 7 * 20
    partialProduct2: 56, // 7 * 8
    product: 196, // 140 + 56
  },
  {
    id: 3,
    factor1: 4,
    factor2: 57,
    breakdown1: 50,
    breakdown2: 7,
    partialProduct1: 200, // 4 * 50
    partialProduct2: 28, // 4 * 7
    product: 228, // 200 + 28
  },
];

export default function ArrType_23({ hint }: { hint: string }) {
  const [answers, setAnswers] = useState(
    Array(problemsJSON.length).fill({
      partial1: "",
      partial2: "",
      product: "",
      breakdown1: "",
      breakdown2: "",
    })
  );
  const [validation, setValidation] = useState<(boolean | null)[]>(
    Array(problemsJSON.length * 5).fill(null)
  );
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  // Input handler
  const handleInputChange = useCallback(
    (
      idx: number,
      field: "partial1" | "partial2" | "product" | "breakdown1" | "breakdown2",
      value: string
    ) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[idx] = { ...next[idx], [field]: value };
        return next;
      });
      setStatus(null);
    },
    []
  );

  // Check
  const handleCheck = useCallback(() => {
    let allCorrect = true;
    const newValidation: (boolean | null)[] = [];

    problemsJSON.forEach((p, i) => {
      const isBreakdown1Correct = parseInt(answers[i].breakdown1) === p.breakdown1;
      const isBreakdown2Correct = parseInt(answers[i].breakdown2) === p.breakdown2;
      const isPartial1Correct = parseInt(answers[i].partial1) === p.partialProduct1;
      const isPartial2Correct = parseInt(answers[i].partial2) === p.partialProduct2;
      const isProductCorrect = parseInt(answers[i].product) === p.product;

      newValidation.push(
        isPartial1Correct,
        isPartial2Correct,
        isProductCorrect,
        isBreakdown1Correct,
        isBreakdown2Correct
      );

      if (
        !isPartial1Correct ||
        !isPartial2Correct ||
        !isProductCorrect ||
        !isBreakdown1Correct ||
        !isBreakdown2Correct
      ) {
        allCorrect = false;
      }
    });

    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle]);

  // Show Solution
  const handleShowSolution = useCallback(() => {
    const filledAnswers = problemsJSON.map((p) => ({
      partial1: p.partialProduct1.toString(),
      partial2: p.partialProduct2.toString(),
      product: p.product.toString(),
      breakdown1: p.breakdown1.toString(),
      breakdown2: p.breakdown2.toString(),
    }));
    setAnswers(filledAnswers);
    setValidation(Array(problemsJSON.length * 5).fill(true));
    setShowSolution(true);
    setStatus("match");
  }, []);

  // Hint toggle
  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  // Summary
  const summary = useMemo(() => {
    if (!status) return null;
    return status === "match"
      ? { text: "🎉 Correct! Good Job", color: "text-green-600" }
      : { text: "❌ Some answers are wrong", color: "text-red-600" };
  }, [status]);

  // Controls sync
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
    <div className="flex flex-col space-y-6">
      <div className="flex flex-wrap justify-center gap-10 px-6 py-8">
        {problemsJSON.map((p, idx) => (
          <div key={p.id} className="flex flex-col items-center relative p-4">
            {/* Top bubble for partial products */}
            <div
              className={``}
              style={{
                backgroundImage: `url(/images/union.png)`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                minWidth: "200px",
                minHeight: "60px",
                justifyContent: "center",
                paddingTop: "0px",
                
              }}
            >
              <input
                type="number"
                className="w-16  p-0.5 text-center bg-transparent border-b border-dashed border-gray-400 outline-none text-gray-800 font-semibold"
                value={showSolution ? p.partialProduct1 : answers[idx].partial1}
                onChange={(e) => handleInputChange(idx, "partial1", e.target.value)}
                readOnly={showSolution}
              />
              <span className="mx-2 font-bold text-gray-600">+</span>
              <input
                type="number"
                className="w-16 p-0.5 text-center bg-transparent border-b border-dashed border-gray-400 outline-none text-gray-800 font-semibold"
                value={showSolution ? p.partialProduct2 : answers[idx].partial2}
                onChange={(e) => handleInputChange(idx, "partial2", e.target.value)}
                readOnly={showSolution}
              />
            </div>
       

            {/* Main multiplication line */}
            <div className="flex flex-col items-center mt-[10px] text-xl font-semibold">
              <div className="flex items-center space-x-2">
                <span className="text-gray-800">{p.factor1}</span>
                <span className="text-gray-500">x</span>
                <span className="text-gray-800">{p.factor2}</span>
                <span className="text-gray-500">=</span>
                <input
                  type="number"
                  className="w-24 p-0.5 text-center bg-transparent border-b border-dashed border-gray-400 outline-none text-gray-800 font-semibold"
                  value={showSolution ? p.product : answers[idx].product}
                  onChange={(e) => handleInputChange(idx, "product", e.target.value)}
                  readOnly={showSolution}
                />
              </div>

              {/* SVG for the V-shaped arrow */}
              <div
                className={`relative `}
                style={{ height: "40px", width: "100px", left: "20px" }} // Adjusted width and added 'left' to position it under factor2
              >
                <svg
                  className={`absolute top-0 right-4 -translate-x-1/2 transition-opacity duration-500`}
                  style={{
                    height: "100%",
                    width: "100%",
                    viewBox: "0 0 100 80", // Adjusted viewBox to fit the new width
                    opacity: status !== null || showSolution ? 1 : 0,
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 50 0 L 0 80 M 50 0 L 100 80"
                    stroke="#FF0000" // Red color for the line
                    strokeWidth="2"
                    fill="transparent"
                  />
                </svg>
              </div>
            </div>

            {/* Breakdown inputs (now placed relative to the main problem) */}
            <div className="flex  gap-5 relative w-full left-0">
              <input
                type="number"
                className={`w-10 p-0.5 text-center bg-transparent border-b border-dashed border-gray-400 outline-none font-medium text-gray-800`}
                value={showSolution ? p.breakdown1 : answers[idx].breakdown1}
                onChange={(e) => handleInputChange(idx, "breakdown1", e.target.value)}
                readOnly={showSolution}
              />
              <input
                type="number"
                className={`w-10 p-0.5 text-center bg-transparent border-b border-dashed right-20  border-gray-400 outline-none font-medium text-gray-800`}
                value={showSolution ? p.breakdown2 : answers[idx].breakdown2}
                onChange={(e) => handleInputChange(idx, "breakdown2", e.target.value)}
                readOnly={showSolution}
              />
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
}