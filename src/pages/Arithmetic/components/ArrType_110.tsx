import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Problem = {
  id: string;
  number: number;
  divisors: number[];
  correct: number[];
};

type Props = {
  data?: Problem[];
  hint?: string;
};

type Status = "idle" | "match" | "wrong";
interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

/* ---------------- Defaults ---------------- */
const DEFAULT_DATA: Problem[] = [
  { id: "p1", number: 3160, divisors: [2, 10, 5, 4], correct: [2, 10, 5, 4] },
  { id: "p2", number: 9524, divisors: [2, 10, 5, 4], correct: [2, 4] },
  { id: "p3", number: 8522, divisors: [2, 10, 5, 4], correct: [2] },
];

const DEFAULT_HINT =
  "Check divisibility: by 2 (last digit even), by 5 (last digit 0 or 5), by 10 (last digit 0), by 4 (last two digits divisible by 4).";

/* ---------------- Main Component ---------------- */
const ArrType_110: React.FC<Props> = ({ data, hint }) => {
  const DATA =  DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;

  const [selected, setSelected] = useState<Record<string, number[]>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const init: Record<string, number[]> = {};
    DATA.forEach((p) => {
      init[p.id] = [];
    });
    setSelected(init);
    setStatus("idle");
  }, [data]);

  /* -------- Handlers -------- */
  const toggle = (pid: string, divisor: number) => {
    setSelected((prev) => {
      const current = prev[pid] ?? [];
      return {
        ...prev,
        [pid]: current.includes(divisor)
          ? current.filter((d) => d !== divisor)
          : [...current, divisor],
      };
    });
  };

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  const handleCheck = useCallback(() => {
    const allCorrect = DATA.every((p) => {
      const chosen = selected[p.id] ?? [];
      return (
        chosen.length === p.correct.length &&
        chosen.every((d) => p.correct.includes(d))
      );
    });
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },allCorrect);
  }, [DATA, selected]);

  const handleShowSolution = useCallback(() => {
    const solved: Record<string, number[]> = {};
    DATA.forEach((p) => {
      solved[p.id] = [...p.correct];
    });
    setSelected(solved);
    setStatus("match");
  }, [DATA]);

  const handleShowHint = useCallback(() => {
    setShowHint((prev) => !prev);
  }, []);

  /* -------- Summary -------- */
  const summary: Summary | null = useMemo(() => {
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

  /* -------- Controls Integration -------- */
  const { setControls } = useQuestionControls();
  useEffect(() => {
    setControls({
      handleCheck,
      handleShowSolution,
      handleShowHint,
      hint: help,
      showHint,
      summary,
    });
  }, [
    setControls,
    handleCheck,
    handleShowSolution,
    handleShowHint,
    help,
    showHint,
    summary,
  ]);

  /* -------- Render -------- */
  return (
    <div className="space-y-8">
      <div>
        {/* <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">
          Is the number divisible by 2, by 10, by 5, by 4? Tick the boxes.
        </p> */}
      </div>

      <div className="grid grid-cols-3 gap-8">
        {DATA.map((p) => (
          <div key={p.id} className="space-y-3">
            <h3 className="bg-slate-100 px-3 py-1 font-medium">
              {p.number} is:
            </h3>
            <div className="flex flex-col space-y-2">
              {p.divisors.map((d) => {
                const checked = selected[p.id]?.includes(d) ?? false;
                return (
                  <label key={d} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(p.id, d)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded"
                    />
                    divisible by {d}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrType_110;
