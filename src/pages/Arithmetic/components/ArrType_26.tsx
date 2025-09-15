import React, { useState, useEffect, useCallback, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// Sample data: 4 clocks with random times
const problems = [
  { id: 1, hour: 3, minute: 15 }, // 03:15
  { id: 2, hour: 7, minute: 45 }, // 07:45
  { id: 3, hour: 12, minute: 0 }, // 12:00
  { id: 4, hour: 9, minute: 30 }, // 09:30
];

const hint = "Look at the clock hands carefully and write the exact time shown.";

// ✅ Clock component
function Clock({ hour, minute }: { hour: number; minute: number }) {
  const hourDeg = (hour % 12) * 30 + minute * 0.5;
  const minuteDeg = minute * 6;

  return (
    <div className="relative w-40 h-40 border-4 border-green-600 rounded-full bg-white">
      {/* Hour hand */}
      <div
        className="absolute bottom-1/2 left-1/2 w-1 h-12 bg-black origin-bottom"
        style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
      />
      {/* Minute hand */}
      <div
        className="absolute bottom-1/2 left-1/2 w-0.5 h-16 bg-red-500 origin-bottom"
        style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }}
      />
      {/* Center dot */}
      <div className="absolute w-3 h-3 bg-black rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Numbers */}
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

export default function ArrType_26({
  hint:hintText,
  data:problems
}: {
  hint?: string;
  data:any
}) {
  const [userInput, setUserInput] = useState<string[]>(
    () => problems.map(() => "")
  );

  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  const handleChange = useCallback((idx: number, value: string) => {
    setUserInput((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
    setChecked(false);
    setStatus(null);
  }, []);

  const handleCheck = useCallback(() => {
    let allCorrect = true;
    problems.forEach((p, i) => {
      const correct =
        `${p.hour.toString().padStart(2, "0")}:${p.minute
          .toString()
          .padStart(2, "0")}`;
      if (userInput[i] !== correct) {
        allCorrect = false;
      }
    });
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
    setChecked(true);
  }, [userInput, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    setUserInput(
      problems.map(
        (p) =>
          `${p.hour.toString().padStart(2, "0")}:${p.minute
            .toString()
            .padStart(2, "0")}`
      )
    );
    setChecked(true);
  }, []);

  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  const summary = useMemo(() => {
    if (status === "match") {
      return {
        text: "🎉 All times are correct! Well done.",
        color: "text-green-600",
        bgColor: "bg-green-100",
        borderColor: "border-green-600",
      };
    }
    if (status === "wrong") {
      return {
        text: "❌ Some answers are wrong. Check the clocks again.",
        color: "text-red-600",
        bgColor: "bg-red-100",
        borderColor: "border-red-600",
      };
    }
    return null;
  }, [status]);

  useEffect(() => {
    setControls({
      handleCheck,
      handleShowHint,
      handleShowSolution,
      hint: hintText,
      showHint,
      summary,
    });
  }, [handleCheck, handleShowHint, handleShowSolution, hintText, showHint, summary, setControls]);

  return (
    <div className="flex flex-wrap justify-center gap-10">
      {problems.map((p, idx) => {
        const correctTime = `${p.hour.toString().padStart(2, "0")}:${p.minute
          .toString()
          .padStart(2, "0")}`;
        const isCorrect = checked && userInput[idx] === correctTime;
        const isWrong =
          checked && userInput[idx] !== "" && userInput[idx] !== correctTime;

        return (
          <div
            key={p.id}
            className="flex flex-col items-center bg-primary/10 p-5 rounded-lg"
          >
            <Clock hour={p.hour} minute={p.minute} />

            <div className="mt-5 text-lg">
              Time:{" "}
              <input
                type="text"
                placeholder="HH:MM"
                className={`border-b border-dashed text-center outline-none w-24
                  ${isCorrect ? "text-green-600 font-bold" : ""}
                  ${isWrong ? "text-red-600 font-bold" : ""}`}
                value={userInput[idx]}
                onChange={(e) => handleChange(idx, e.target.value)}
                readOnly={checked && status === "match"}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
