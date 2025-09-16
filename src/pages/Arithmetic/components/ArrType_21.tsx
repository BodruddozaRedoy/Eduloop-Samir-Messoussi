import React, { useState, useCallback, useEffect, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// Time conversion data
const problemsJSON = [
  {
    id: 1,
    time24: "13:15",
    time12: "1:15",
    period: "P.M.",
    daypart: "afternoon",
  },
  {
    id: 2,
    time24: "19:45",
    time12: "7:45",
    period: "P.M.",
    daypart: "evening",
  },
  {
    id: 3,
    time24: "21:30",
    time12: "9:30",
    period: "P.M.",
    daypart: "night",
  },
  {
    id: 4,
    time24: "16:45",
    time12: "4:45",
    period: "P.M.",
    daypart: "afternoon",
  },
  {
    id: 5,
    time24: "15:15",
    time12: "3:15",
    period: "P.M.",
    daypart: "afternoon",
  },
  {
    id: 6,
    time24: "19:15",
    time12: "7:15",
    period: "P.M.",
    daypart: "evening",
  },
];

export default function ArrType_21({ hint }: { hint: string }) {
  const [answers, setAnswers] = useState(
    Array(problemsJSON.length).fill({ time: "", part: "" })
  );
  const [validation, setValidation] = useState<(boolean | null)[]>(
    Array(problemsJSON.length).fill(null)
  );
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  // Input handler
  const handleInputChange = useCallback(
    (idx: number, field: "time" | "part", value: string) => {
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
    const newValidation = problemsJSON.map(
      (p, i) =>
        p.time12 === answers[i].time.trim() &&
        p.daypart === answers[i].part.trim().toLowerCase()
    );
    const allCorrect = newValidation.every(Boolean);
    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle]);

  // Show Solution
  const handleShowSolution = useCallback(() => {
    const filledAnswers = problemsJSON.map((p) => ({
      time: `${p.time12} ${p.period}`,
      part: p.daypart,
    }));
    setAnswers(filledAnswers);
    setValidation(Array(problemsJSON.length).fill(true));
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
      {/* Cards */}
      <div className="flex flex-wrap justify-start gap-6 px-6">
        {problemsJSON.map((p, idx) => (
          <div
            key={p.id}
            className="w-64 rounded-2xl bg-amber-50/60 p-6 flex flex-col items-center justify-between text-center shadow-md"
          >
            {/* 24-hour time */}
            <div className="mb-4">
              <span className="text-xl font-semibold text-red-600">
                {p.time24}
              </span>
            </div>

            {/* Inputs */}
            <div className="space-y-2 w-full">
              <div className="flex items-center gap-1 justify-center">
                <span className="text-sm">It is</span>
                <input
                  type="text"
                  className="flex-1 p-1 text-sm border-b border-dotted outline-none text-center"
                  value={
                    showSolution ? `${p.time12} ${p.period}` : answers[idx].time
                  }
                  onChange={(e) =>
                    handleInputChange(idx, "time", e.target.value)
                  }
                  readOnly={showSolution}
                />
              </div>
              <div className="flex items-center gap-1 justify-center">
                <span className="text-sm">in the</span>
                <input
                  type="text"
                  className="flex-1 p-1 text-sm border-b border-dotted outline-none text-center"
                  value={showSolution ? p.daypart : answers[idx].part}
                  onChange={(e) =>
                    handleInputChange(idx, "part", e.target.value)
                  }
                  readOnly={showSolution}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Optional Controls */}
      {/* <Controllers
        handleCheck={handleCheck}
        handleShowSolution={handleShowSolution}
        handleShowHint={handleShowHint}
      />
      {showHint && <Hint hint={hint} />}
      <Check summary={summary} /> */}
    </div>
  );
}