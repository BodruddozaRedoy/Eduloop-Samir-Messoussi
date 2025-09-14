import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import React, { useState } from "react";

// Time conversion data
const problemsJSON = [
  { id: 1, time24: "13:15", time12: "1:15", period: "P.M.", daypart: "afternoon" },
  { id: 2, time24: "19:45", time12: "7:45", period: "P.M.", daypart: "evening" },
  { id: 3, time24: "21:30", time12: "9:30", period: "P.M.", daypart: "night" },
  { id: 4, time24: "16:45", time12: "4:45", period: "P.M.", daypart: "afternoon" },
  { id: 5, time24: "15:15", time12: "3:15", period: "P.M.", daypart: "afternoon" },
  { id: 6, time24: "19:15", time12: "7:15", period: "P.M.", daypart: "evening" },
];

const ArrType_21 = ({ hint }) => {
  const [answers, setAnswers] = useState(
    Array(problemsJSON.length).fill({ time: "", part: "" })
  );
  const [validation, setValidation] = useState(
    Array(problemsJSON.length).fill(null)
  );
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  const handleInputChange = (idx, field, value) => {
    const newAnswers = [...answers];
    newAnswers[idx] = { ...newAnswers[idx], [field]: value };
    setAnswers(newAnswers);
    setStatus(null);
  };

  const handleCheck = () => {
    const newValidation = problemsJSON.map(
      (p, i) =>
        p.time12 === answers[i].time.trim() &&
        p.daypart === answers[i].part.trim().toLowerCase()
    );
    setValidation(newValidation);
    setStatus(newValidation.every(Boolean) ? "match" : "wrong");
  };

  const handleShowSolution = () => {
    setShowSolution(true);
    setValidation(Array(problemsJSON.length).fill(true));
  };

  const handleShowHint = () => setShowHint((v) => !v);

  const summary = status
    ? {
        text:
          status === "match"
            ? "🎉 Correct! Good Job"
            : "❌ Some answers are wrong",
        color: status === "match" ? "text-green-600" : "text-red-600",
      }
    : null;

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {problemsJSON.map((p, idx) => (
          <div
            key={p.id}
            className="p-4 rounded-lg shadow-sm bg-[#FFF7ED] border border-gray-200"
          >
            <div className="flex items-center justify-center p-1 rounded-md border-red-300 mb-2">
              <span className="text-base font-semibold text-red-600">
                {p.time24}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm">It is</span>
                <input
                  type="text"
                  className={`flex-1 p-1 text-sm border-dotted border-b outline-none ${
                    validation[idx] === false ? "border-red-500" : "border-gray-300"
                  }`}
                  value={showSolution ? `${p.time12} ${p.period}` : answers[idx].time}
                  onChange={(e) => handleInputChange(idx, "time", e.target.value)}
                  readOnly={showSolution}
                />
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-sm">in the</span>
                <input
                  type="text"
                  className={`flex-1 p-1 text-sm border-dotted border-b outline-none ${
                    validation[idx] === false ? "border-red-500" : "border-gray-300"
                  }`}
                  value={showSolution ? p.daypart : answers[idx].part}
                  onChange={(e) => handleInputChange(idx, "part", e.target.value)}
                  readOnly={showSolution}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-start">
        <Controllers
          handleCheck={handleCheck}
          handleShowSolution={handleShowSolution}
          handleShowHint={handleShowHint}
        />
      </div>
      {showHint && <Hint hint={hint} />}
      <Check summary={summary} />
    </div>
  );
};

export default ArrType_21;
