import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useQuestionControls } from "@/context/QuestionControlsContext";

// Table data
const DATA = [
  {
    digit: "3",
    items: [
      { num: "236.041", answer: 30 },
      { num: "1,230,478.000", answer: 30000 },
      { num: "5,003.000", answer: 3 },
      { num: "93,154.000", answer: 3000 },
    ],
  },
  {
    digit: "5",
    items: [
      { num: "501.306", answer: 500 },
      { num: "16.593", answer: 0.5 },
      { num: "5,210.210", answer: 5000 },
      { num: "2,536,130.000", answer: 500000 },
    ],
  },
];

const HINT_TEXT = "The value of a digit depends on its position. For example, the digit 5 in 50 has a value of 50 (tens place), while in 0.5 it has a value of 0.5 (tenths place).";

// Helper formatting
const numFmt = (n) => n.toLocaleString("en-GB");

// Difference correct answers
const answers = DATA.flatMap((group) => group.items.map((item) => item.answer));

// Main component
const ArrType_97 = () => {
  const totalItems = answers.length;
  const [inputs, setInputs] = useState(Array(totalItems).fill(""));
  const [ok, setOk] = useState(Array(totalItems).fill(null));
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState("idle");

  // Controller setup
  const { setControls } = useQuestionControls();

  // Check answers
  const handleCheck = useCallback(() => {
    const verdicts = inputs.map((inp, idx) => {
      const parsed = parseFloat(inp.replace(/,/g, ""));
      return Math.abs(isNaN(parsed) ? Infinity : parsed - answers[idx]) < 0.01;
    });
    setOk(verdicts);
    setStatus(verdicts.every(Boolean) ? "match" : "wrong");
  }, [inputs]);

  // Show solution
  const handleShowSolution = useCallback(() => {
    setInputs(answers.map(numFmt));
    setOk(Array(totalItems).fill(true));
    setStatus("match");
  }, []);

  // Toggle hint
  const handleShowHint = useCallback(() => setShowHint((s) => !s), []);

  // Reset on item count change (not strictly needed here)
  useEffect(() => {
    setInputs(Array(totalItems).fill(""));
    setOk(Array(totalItems).fill(null));
    setStatus("idle");
    setShowHint(false);
  }, []);

  // Feedback message (still computed for controls but not displayed)
  const summary = useMemo(() => {
    if (status === "match")
      return {
        text: "Correct! Great job.",
        color: "text-green-700",
        bgColor: "bg-green-100",
        borderColor: "border-green-600",
      };
    if (status === "wrong")
      return {
        text: "Some answers are wrong. Try again.",
        color: "text-red-700",
        bgColor: "bg-red-100",
        borderColor: "border-red-600",
      };
    return null;
  }, [status]);

  // Expose controls to parent
  useEffect(() => {
    setControls({
      handleCheck,
      handleShowSolution,
      handleShowHint,
      hint: HINT_TEXT,
      showHint,
      summary,
    });
  }, [setControls, handleCheck, handleShowSolution, handleShowHint, summary, showHint]);

  // Input border color
  const inputTone = (flag) =>
    flag === null
      ? "border-slate-300 text-slate-800"
      : flag
      ? "border-emerald-500 text-emerald-600"
      : "border-rose-500 text-rose-600";

  return (
    <div className="w-full mx-auto max-w-4xl mt-10">
      {/* <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-600">Question 1</h2>
        <p className="text-base font-medium">What is the value of the digit?</p>
      </div> */}
      <div className="flex justify-center gap-12">
        {DATA.map((group, gIdx) => {
          const startIdx = DATA.slice(0, gIdx).reduce((sum, g) => sum + g.items.length, 0);
          return (
            <div key={group.digit} className="w-72"> {/* Increased from w-48 to w-72 for larger cards */}
              <table
                className="w-full border rounded-xl overflow-hidden"
                style={{ borderCollapse: "separate", borderSpacing: 0 }}
              >
                <thead>
                  <tr>
                    <th className="bg-orange-50 px-6 py-4 text-center font-medium text-slate-800 border border-orange-200">
                      {group.digit}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((item, iIdx) => {
                    const idx = startIdx + iIdx;
                    return (
                      <tr key={iIdx}>
                        <td className="text-center px-6 py-2 border-t border-orange-100">
                          <div className="flex items-center justify-center">
                            <div className="font-mono text-slate-800">{item.num}</div>
                            <input
                              type="text"
                              inputMode="decimal"
                            
                              value={inputs[idx]}
                              onChange={(e) => {
                                const val = e.target.value;
                                setInputs((prev) => {
                                  const next = [...prev];
                                  next[idx] = val;
                                  return next;
                                });
                                setOk((prev) => {
                                  const next = [...prev];
                                  next[idx] = null;
                                  return next;
                                });
                                setStatus("idle");
                              }}
                              className={`border-b border-dotted bg-transparent outline-none italic text-lg font-mono text-center ${inputTone(
                                ok[idx]
                              )} w-full`} /* Removed fixed width, full width now */
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
      {/* Hint display */}
      {showHint && (
        <div className="mt-3 px-4 py-2 bg-yellow-50 border-l-4 border-yellow-300 text-yellow-800">
          {HINT_TEXT}
        </div>
      )}
    </div>
  );
};

export default ArrType_97;