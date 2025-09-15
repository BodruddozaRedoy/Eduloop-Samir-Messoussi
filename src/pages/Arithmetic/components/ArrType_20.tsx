import React, { useEffect, useState, useCallback, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// Example problem
const data = [
  {
    id: 1,
    dividend: 85,
    divisor: 5,
    splits: [50, 35], // 50 ÷ 5 + 35 ÷ 5 = 17
    answer: 17,
  },
  {
    id: 2,
    dividend: 96,
    divisor: 6,
    splits: [60, 36], // 60 ÷ 6 + 36 ÷ 6 = 16
    answer: 16,
  },
  {
    id: 3,
    dividend: 72,
    divisor: 8,
    splits: [40, 32], // 40 ÷ 8 + 32 ÷ 8 = 9 + 4 = 13
    answer: 13,
  },
  {
    id: 4,
    dividend: 54,
    divisor: 9,
    splits: [30, 24], // 30 ÷ 9 + 24 ÷ 9 = 3 + 2.67 ❌ (not clean)
    // better split → [45, 9]: 45 ÷ 9 + 9 ÷ 9 = 5 + 1 = 6
    splits: [45, 9],
    answer: 6,
  },
  {
    id: 5,
    dividend: 63,
    divisor: 7,
    splits: [35, 28], // 35 ÷ 7 + 28 ÷ 7 = 5 + 4 = 9
    answer: 9,
  },
  {
    id: 6,
    dividend: 84,
    divisor: 12,
    splits: [60, 24], // 60 ÷ 12 + 24 ÷ 12 = 5 + 2 = 7
    answer: 7,
  },
];


export default function ArrType_20({
  hint,
  data
}:any) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  // handle change
  const handleChange = (key: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value.replace(/[^0-9]/g, ""), // only numbers
    }));
    setStatus(null);
  };

  // check answers
  const handleCheck = useCallback(() => {
    let allCorrect = true;

    data.forEach((p) => {
      if (
        Number(answers[`${p.id}-ans`]) !== p.answer ||
        Number(answers[`${p.id}-s0`]) !== p.splits[0] ||
        Number(answers[`${p.id}-s1`]) !== p.splits[1]
      ) {
        allCorrect = false;
      }
    });

    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
    setShowSolution(false);
  }, [answers, addResult, qId, qTitle]);

  // show solution
  const handleShowSolution = useCallback(() => {
    const filled: Record<string, string> = {};
    data.forEach((p) => {
      filled[`${p.id}-ans`] = String(p.answer);
      filled[`${p.id}-s0`] = String(p.splits[0]);
      filled[`${p.id}-s1`] = String(p.splits[1]);
    });
    setAnswers(filled);
    // setStatus("match");
    setShowSolution(true);
  }, []);

  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  const summary = useMemo(
    () =>
      status === "match"
        ? { text: "🎉 Correct! Great job", color: "text-green-600" }
        : status === "wrong"
        ? { text: "❌ Some answers are wrong", color: "text-red-600" }
        : null,
    [status]
  );

  // avoid infinite loop → only update controls when dependencies change
  useEffect(() => {
    setControls({
      handleCheck,
      handleShowSolution,
      handleShowHint,
      hint,
      showHint,
      summary,
    });
  }, [setControls, handleCheck, handleShowSolution, handleShowHint, hint, showHint, summary]);

  return (
    <div className="flex items-center gap-5">
      {data.map((p) => (
        <div key={p.id}>
          {/* top equation */}
          <div className="flex items-center gap-3 font-semibold ml-12">
            <h1>{p.dividend}</h1>
            <p>:</p>
            <p>{p.divisor}</p>
            <p>=</p>
            <input
              type="text"
              className={`border-b border-dashed outline-none w-8 text-center ${status === "match" && "text-green-500"} ${status === "wrong" && "text-red-500"}`}
              value={answers[`${p.id}-ans`] || ""}
              onChange={(e) => handleChange(`${p.id}-ans`, e.target.value)}
              readOnly={showSolution}
            />
          </div>

          {/* slanted lines */}
          <div className="flex gap-7 ml-10">
            <div className="h-10 w-0.5 bg-black rotate-45"></div>
            <div className="h-10 w-0.5 bg-black -rotate-45"></div>
          </div>

          {/* splits */}
          <div className="flex gap-3 ml-5">
            <input
              type="text"
              className={`border-b border-dashed w-8 outline-none text-center ${status === "match" && "text-green-500"} ${status === "wrong" && "text-red-500"}`}
              value={answers[`${p.id}-s0`] || ""}
              onChange={(e) => handleChange(`${p.id}-s0`, e.target.value)}
              readOnly={showSolution}
            />
            <input
              type="text"
              className={`border-b border-dashed w-8 outline-none text-center ${status === "match" && "text-green-500"} ${status === "wrong" && "text-red-500"}`}
              value={answers[`${p.id}-s1`] || ""}
              onChange={(e) => handleChange(`${p.id}-s1`, e.target.value)}
              readOnly={showSolution}
            />
          </div>
        </div>
      ))}

      {/* optional local controllers */}
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
