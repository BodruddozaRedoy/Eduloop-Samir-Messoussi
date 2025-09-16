import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

function Clock({ hour, minute }: { hour: number; minute: number }) {
  const hourDeg = (hour % 12) * 30 + minute * 0.5;
  const minuteDeg = minute * 6;

  return (
    <div className="relative w-40 h-40 border-4 border-green-600 rounded-full bg-white">
      <div
        className="absolute bottom-1/2 left-1/2 w-1 h-12 bg-black origin-bottom"
        style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
      />
      <div
        className="absolute bottom-1/2 left-1/2 w-0.5 h-16 bg-red-500 origin-bottom"
        style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }}
      />
      <div className="absolute w-3 h-3 bg-black rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      {[...Array(12)].map((_, i) => {
        const angle = (i + 1) * 30;
        const x = 50 + 42 * Math.sin((angle * Math.PI) / 180);
        const y = 50 - 42 * Math.cos((angle * Math.PI) / 180);
        return (
          <div
            key={i}
            className="absolute text-sm font-bold"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {i + 1}
          </div>
        );
      })}
    </div>
  );
}

export default function ArrType_27({ data: problems, hint }: any) {
  const [answers, setAnswers] = useState<string[]>(Array(problems.length).fill(""));
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  const handleChange = useCallback((idx: number, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
    setStatus(null);
  }, []);

  const handleCheck = useCallback(() => {
    const allCorrect = problems.every((p, i) => Number(answers[i]) === p.correct);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle, problems]);

  const handleShowSolution = useCallback(() => {
    setAnswers(problems.map((p) => String(p.correct)));
    setStatus("match");
  }, [problems]);

  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  // ✅ memoize summary so it only changes when status changes
  const summary = useMemo(() => {
    if (status === "match") {
      return {
        text: "🎉 All correct! Great job",
        color: "text-green-600",
        bgColor: "bg-green-100",
        borderColor: "border-green-600",
      };
    }
    if (status === "wrong") {
      return {
        text: "❌ Some answers are wrong",
        color: "text-red-600",
        bgColor: "bg-red-100",
        borderColor: "border-red-600",
      };
    }
    return null;
  }, [status]);

  // ✅ memoize the whole controls object
  const controls = useMemo(
    () => ({
      handleCheck,
      handleShowHint,
      handleShowSolution,
      hint,
      showHint,
      summary,
    }),
    [handleCheck, handleShowHint, handleShowSolution, hint, showHint, summary]
  );

  useEffect(() => {
    setControls(controls);
  }, [controls, setControls]);

  return (
    <div className="flex gap-6 items-center justify-center">
      {problems.map((p, idx) => {
        const [h, m] = (p.clockTime ? p.clockTime.split(":").map(Number) : [0, 0]) as [number, number];
        return (
          <div
            key={p.id}
            className="flex flex-col items-center bg-primary/10 p-4 rounded-lg"
          >
            <div className="border rounded-lg border-green-500 py-1 px-3 bg-white mb-2">
              {p.time}
            </div>
            <div className="text-white bg-red-500 rounded-full w-7 h-7 flex items-center justify-center mb-2">
              {p.id}
            </div>
            <Clock hour={h} minute={m} />
            <input
              type="number"
              className={`mt-2 w-10 rounded-md text-center outline-none border-2 border-primary font-semibold ${
                status
                  ? Number(answers[idx]) === p.correct
                    ? "text-green-600"
                    : "text-red-600"
                  : ""
              }`}
              value={answers[idx]}
              onChange={(e) => handleChange(idx, e.target.value)}
            />
          </div>
        );
      })}
    </div>
  );
}
