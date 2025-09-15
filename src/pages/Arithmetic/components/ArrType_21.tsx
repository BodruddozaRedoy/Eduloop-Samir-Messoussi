import React, { useState } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";

// Time conversion data with hint inside JSON
const problemsJSON = [
  {
    id: 1,
    time24: "13:15",
    time12: "1:15",
    period: "P.M.",
    daypart: "afternoon",
    hint: "Convert 13:15 into 12-hour format",
  },
  {
    id: 2,
    time24: "19:45",
    time12: "7:45",
    period: "P.M.",
    daypart: "evening",
    hint: "19:45 = 7:45 P.M. (evening)",
  },
  {
    id: 3,
    time24: "21:30",
    time12: "9:30",
    period: "P.M.",
    daypart: "night",
    hint: "21:30 = 9:30 P.M. (night)",
  },
  {
    id: 4,
    time24: "16:45",
    time12: "4:45",
    period: "P.M.",
    daypart: "afternoon",
    hint: "16:45 = 4:45 P.M. (afternoon)",
  },
  {
    id: 5,
    time24: "15:15",
    time12: "3:15",
    period: "P.M.",
    daypart: "afternoon",
    hint: "15:15 = 3:15 P.M. (afternoon)",
  },
  {
    id: 6,
    time24: "19:15",
    time12: "7:15",
    period: "P.M.",
    daypart: "evening",
    hint: "19:15 = 7:15 P.M. (evening)",
  },
];

const ArrType_21 = () => {
  const [answers, setAnswers] = useState(
    Array(problemsJSON.length).fill({ time: "", part: "" })
  );
  const [validation, setValidation] = useState(Array(problemsJSON.length).fill(null));
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Input change handler
  const handleInputChange = (idx: number, field: "time" | "part", value: string) => {
    const newAnswers = [...answers];
    newAnswers[idx] = { ...newAnswers[idx], [field]: value };
    setAnswers(newAnswers);
    setStatus(null);
  };

  // Check answers
  const handleCheck = () => {
    const newValidation = problemsJSON.map(
      (p, i) =>
        p.time12 === answers[i].time.trim() &&
        p.daypart === answers[i].part.trim().toLowerCase()
    );
    setValidation(newValidation);
    setStatus(newValidation.every(Boolean) ? "match" : "wrong");
    setShowSolution(false);
  };

  // Show solution
  const handleShowSolution = () => {
    const filledAnswers = problemsJSON.map((p) => ({
      time: `${p.time12} ${p.period}`,
      part: p.daypart,
    }));
    setAnswers(filledAnswers);
    setValidation(Array(problemsJSON.length).fill(true));
    setShowSolution(true);
    setStatus("match");
  };

  // Summary feedback
  const summary =
    status === "match"
      ? {
          text: "🎉 Correct! Good Job",
          color: "text-green-600",
          bgColor: "bg-green-100",
          borderColor: "border-green-600",
        }
      : status === "wrong"
      ? {
          text: "❌ Some answers are wrong",
          color: "text-red-600",
          bgColor: "bg-red-100",
          borderColor: "border-red-600",
        }
      : null;

  return (
    <div className="flex flex-col space-y-6">
      {/* Cards */}
      <div className="flex flex-wrap justify-start gap-6 px-6">
        {problemsJSON.map((p, idx) => (
          <div
            key={p.id}
            className="w-64 rounded-2xl bg-amber-50/60 p-6 flex flex-col items-center justify-between text-center shadow-md"
          >
            {/* 24-hour time */}
            <div className="mb-4">
              <span className="text-xl font-semibold text-red-600">{p.time24}</span>
            </div>

            {/* Input fields */}
            <div className="space-y-2 w-full">
              <div className="flex items-center gap-1 justify-center">
                <span className="text-sm">It is</span>
                <input
                  type="text"
                  className={`flex-1 p-1 text-sm border-dotted border-b outline-none text-center
                    ${
                      validation[idx] === true
                        ? "border-green-500 text-green-600"
                        : validation[idx] === false
                        ? "border-red-500 text-red-600"
                        : "border-gray-300 text-gray-900"
                    }`}
                  value={answers[idx].time}
                  onChange={(e) => handleInputChange(idx, "time", e.target.value)}
                  readOnly={showSolution}
                />
              </div>
              <div className="flex items-center gap-1 justify-center">
                <span className="text-sm">in the</span>
                <input
                  type="text"
                  className={`flex-1 p-1 text-sm border-dotted border-b outline-none text-center
                    ${
                      validation[idx] === true
                        ? "border-green-500 text-green-600"
                        : validation[idx] === false
                        ? "border-red-500 text-red-600"
                        : "border-gray-300 text-gray-900"
                    }`}
                  value={answers[idx].part}
                  onChange={(e) => handleInputChange(idx, "part", e.target.value)}
                  readOnly={showSolution}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-start mt-4 px-6 space-x-4">
        
        <Controllers
          handleCheck={handleCheck}
          handleShowSolution={handleShowSolution}
          handleShowHint={() => setShowHint((v) => !v)}
        /> 
        
   
      </div>
           <div className="flex ">
          {showHint && (
          <Hint hint="Remember: Subtract 12 from the hour if it's more than 12 to convert into 12-hour format. Then add A.M. or P.M." />
        )}
        </div>

      {/* Summary */}
      <Check summary={summary} />
    </div>
  );
};

export default ArrType_21;
