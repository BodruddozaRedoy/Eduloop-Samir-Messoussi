import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useQuestionControls } from "@/context/QuestionControlsContext";

// Table data
const DATA = [
  { name: "Britt", final: 65.27, initial: 44.67 },
  { name: "safer", final: 64.73, initial: 47.35 },
  { name: "Annet", final: 58.57, initial: 22.75 },
  { name: "Luuk", final: 51.62, initial: 17.57 },
];

const HINT_TEXT = "Subtract the initial odometer from the final odometer to find the difference for each person.";

// Helper formatting
const kmFmt = (n) => n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Difference correct answers
const answers = DATA.map((x) => +(x.final - x.initial).toFixed(2));

// Main component
const ArrType_96 = () => {
  const [inputs, setInputs] = useState(Array(DATA.length).fill(""));
  const [ok, setOk] = useState(Array(DATA.length).fill(null));
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState("idle");

  // Controller setup
  const { setControls } = useQuestionControls();

  // Check answers
  const handleCheck = useCallback(() => {
    const verdicts = inputs.map((inp, idx) => Math.abs(parseFloat(inp) - answers[idx]) < 0.01);
    setOk(verdicts);
    setStatus(verdicts.every(Boolean) ? "match" : "wrong");
  }, [inputs]);

  // Show solution
  const handleShowSolution = useCallback(() => {
    setInputs(answers.map(kmFmt));
    setOk(Array(DATA.length).fill(true));
    setStatus("match");
  }, []);

  // Toggle hint
  const handleShowHint = useCallback(() => setShowHint((s) => !s), []);


  useEffect(() => {
    setInputs(Array(DATA.length).fill(""));
    setOk(Array(DATA.length).fill(null));
    setStatus("idle");
    setShowHint(false);
  }, []);


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
    <div className="w-full mx-auto mt-10 max-w-4xl">
   
      <div className="overflow-x-auto">
        <table
          className="min-w-full border rounded-xl overflow-hidden"
          style={{ borderCollapse: "separate", borderSpacing: 0 }}
        >
          <thead>
            <tr>
              <th className="bg-white"></th>
              {DATA.map((p) => (
                <th
                  key={p.name}
                  className="bg-orange-50 px-6 py-4 text-center font-medium text-slate-800 border border-orange-200"
                >
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-medium px-4 py-2 text-right">final odometer reading</td>
              {DATA.map((p) => (
                <td key={p.name} className="text-center px-6 py-2 font-mono">
                  {kmFmt(p.final)} km
                </td>
              ))}
            </tr>
            <tr>
              <td className="font-medium px-4 py-2 text-right">initial odometer reading</td>
              {DATA.map((p) => (
                <td key={p.name} className="text-center px-6 py-2 font-mono">
                  {kmFmt(p.initial)} km
                </td>
              ))}
            </tr>
            <tr>
              <td className="font-medium px-4 py-2 text-right">difference</td>
              {DATA.map((p, idx) => (
                <td key={p.name} className="text-center px-6 py-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="---------"
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
                    className={`w-24 border-b border-dotted bg-transparent outline-none italic text-lg font-mono text-center ${inputTone(
                      ok[idx]
                    )}`}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
  
    </div>
  );
};

export default ArrType_96;














