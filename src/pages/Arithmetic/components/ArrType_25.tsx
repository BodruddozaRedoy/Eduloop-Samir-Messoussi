import React, { useEffect, useState, useCallback, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// Sample data
const problems = [
  {
    id: 1,
    time: "22:18", // 24h format
    answer: {
      minutes: 12,
      phrase: "before half past 10",
      period: "evening",
    },
  },
  {
    id: 2,
    time: "07:25", // 24h format
    answer: {
      minutes: 5,
      phrase: "before half past 7",
      period: "morning",
    },
  },
  {
    id: 3,
    time: "15:40", // 24h format
    answer: {
      minutes: 20,
      phrase: "after half past 3",
      period: "afternoon",
    },
  },
];


const hint =
  "Read the clock carefully. Work out how many minutes remain until the next half past.";

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

export default function ArrType_25({
  hint: hintText = hint,
}: {
  hint?: string;
}) {
  const [userInput, setUserInput] = useState<
    { minutes: string; phrase: string; period: string }[]
  >(() =>
    problems.map(() => ({
      minutes: "",
      phrase: "",
      period: "",
    }))
  );

  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  const handleChange = useCallback(
    (idx: number, field: "minutes" | "phrase" | "period", value: string) => {
      setUserInput((prev) => {
        const next = [...prev];
        next[idx][field] = value;
        return next;
      });
      setChecked(false);
      setStatus(null);
    },
    []
  );

  const handleCheck = useCallback(() => {
    let allCorrect = true;
    problems.forEach((p, i) => {
      const ans = p.answer;
      const user = userInput[i];
      if (
        Number(user.minutes) !== ans.minutes ||
        user.phrase.trim().toLowerCase() !== ans.phrase.toLowerCase() ||
        user.period.trim().toLowerCase() !== ans.period.toLowerCase()
      ) {
        allCorrect = false;
      }
    });
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
    setChecked(true);
  }, [userInput, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    setUserInput(problems.map((p) => ({ ...p.answer })));
    setChecked(true);
  }, []);

  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  const summary = useMemo(() => {
    if (status === "match") {
      return {
        text: "🎉 Correct! Good job",
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
    <div className="flex items-center justify-center gap-10">
      {problems.map((p, idx) => {
        const [h, m] = (p.time ? p.time.split(":").map(Number) : [0, 0]) as [
          number,
          number
        ];
        return (
          <div
            key={p.id}
            className="flex flex-col items-center bg-primary/10 p-5 rounded-lg py-10"
          >
            <div className="border rounded-lg border-green-500 py-2 px-5 bg-white">
              {p.time}
            </div>
            <div className="my-5">
              <Clock hour={h} minute={m} />
            </div>
            <div className="mt-5 text-lg">
              It is{" "}
              <input
                type="text"
                className={`${status == "match" && "text-green-500"} ${ status == "wrong" && "text-red-500"} border-b border-dashed w-12 text-center outline-none`}
                value={userInput[idx].minutes}
                onChange={(e) => handleChange(idx, "minutes", e.target.value)}
                readOnly={checked && status === "match"}
              />{" "}
              minutes <br />
              <input
                type="text"
                className={`${status == "match" && "text-green-500"} ${ status == "wrong" && "text-red-500"} border-b border-dashed w-40 text-center outline-none`}
                value={userInput[idx].phrase}
                onChange={(e) => handleChange(idx, "phrase", e.target.value)}
                readOnly={checked && status === "match"}
              />{" "}
              in the{" "}
              <input
                type="text"
                className={`${status == "match" && "text-green-500"} ${ status == "wrong" && "text-red-500"} border-b border-dashed w-20 text-center outline-none`}
                value={userInput[idx].period}
                onChange={(e) => handleChange(idx, "period", e.target.value)}
                readOnly={checked && status === "match"}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
