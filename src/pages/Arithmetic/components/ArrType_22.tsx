import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useState, useCallback, useMemo, useEffect } from "react";

/* ---- TimeInput Component ---- */
function TimeInput({
  value,
  onChange,
  readOnly,
}: {
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={value}
      readOnly={readOnly}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9:]/g, ""))}
      className={`h-12 w-28 bg-white px-3 text-lg font-semibold outline-none
      text-center font-mono tabular-nums rounded-lg
      border-2 border-slate-400`}
      placeholder="00:00"
    />
  );
}

/* ---- ArrType_22 Component ---- */
type Row = {
  id: number;
  text: string;
  expectedTime: string;
};

const problemsJSON: Row[] = [
  { id: 1, text: "It is quarter to 10 in the evening.", expectedTime: "21:45" },
  { id: 2, text: "It is 2 o'clock in the afternoon.", expectedTime: "14:00" },
  { id: 3, text: "It is half past 2 in the night.", expectedTime: "02:30" },
  { id: 4, text: "It is quarter to 6 in the afternoon.", expectedTime: "17:45" },
  { id: 5, text: "It is quarter past 7 in the morning.", expectedTime: "07:15" },
  { id: 6, text: "It is quarter to 10 in the evening.", expectedTime: "21:45" },
  { id: 7, text: "It is quarter to 10 in the evening.", expectedTime: "21:45" },
];

export default function ArrType_22({ hint }: { hint: string }) {
  const [answers, setAnswers] = useState<string[]>(Array(problemsJSON.length).fill(""));
  const [validation, setValidation] = useState<(boolean | null)[]>(Array(problemsJSON.length).fill(null));
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  const handleInputChange = useCallback((idx: number, val: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
    setStatus(null);
  }, []);

  const handleCheck = useCallback(() => {
    const newValidation = problemsJSON.map((p, i) => p.expectedTime === answers[i].trim());
    const allCorrect = newValidation.every(Boolean);
    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    setAnswers(problemsJSON.map((p) => p.expectedTime));
    setValidation(Array(problemsJSON.length).fill(true));
    setStatus("match");
    setShowSolution(true);
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

  return (
    <div className="flex flex-col w-full">
      {/* Questions grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {problemsJSON.map((p, idx) => (
          <div
            key={p.id}
            className="rounded-xl bg-amber-50/70 p-6 flex flex-col items-center justify-between text-center min-h-[14rem] shadow"
          >
            <p className="text-lg text-slate-700 mb-4">{p.text}</p>
            <TimeInput
              value={showSolution ? p.expectedTime : answers[idx]}
              onChange={(v) => handleInputChange(idx, v)}
              readOnly={showSolution}
            />
          </div>
        ))}
      </div>

      {/* Optional Controls and Feedback (same as ArrType_19) */}
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
