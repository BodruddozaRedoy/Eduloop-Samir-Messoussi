import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Column = {
  id: string;
  title: string;
  divisor: number;
  numbers: number[];
};

type Props = {
  data?: Column[];
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
const DEFAULT_DATA: Column[] = [
  {
    id: "c1",
    title: "divide by 2",
    divisor: 2,
    numbers: [24, 32, 81, 106, 345, 27380],
  },
  {
    id: "c2",
    title: "divide by 10",
    divisor: 10,
    numbers: [21, 90, 210, 345, 900, 27380],
  },
  {
    id: "c3",
    title: "divide by 5",
    divisor: 5,
    numbers: [60, 75, 210, 345, 912, 27380],
  },
  {
    id: "c4",
    title: "divide by 4",
    divisor: 4,
    numbers: [44, 88, 102, 210, 345, 27380],
  },
];

const DEFAULT_HINT = "Mark all numbers that divide exactly with no remainder.";

/* ---------------- Main Component ---------------- */
const ArrType_109: React.FC<Props> = ({ data, hint }) => {
  const DATA = DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;

  const [checked, setChecked] = useState<boolean[][]>(() =>
    DATA.map((col) => col.numbers.map(() => false))
  );
  const [ok, setOk] = useState<(boolean | null)[][]>(() =>
    DATA.map((col) => col.numbers.map(() => null))
  );
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setChecked(DATA.map((c) => c.numbers.map(() => false)));
    setOk(DATA.map((c) => c.numbers.map(() => null)));
    setStatus("idle");
    setShowHint(false);
  }, [data]);

  /* -------- Handlers -------- */
  const toggleCheck = (ci: number, ni: number) => {
    setChecked((prev) => {
      const cp = prev.map((col) => [...col]);
      cp[ci][ni] = !cp[ci][ni];
      return cp;
    });
  };

    const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const handleCheck = useCallback(() => {
    const results = DATA.map((col, ci) =>
      col.numbers.map((n, ni) => {
        const correct = n % col.divisor === 0;
        return checked[ci][ni] === correct;
      })
    );
    setOk(results);
    const allCorrect = results.every((col) => col.every((r) => r));
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },allCorrect);
  }, [DATA, checked]);

  const handleShowSolution = useCallback(() => {
    setChecked(DATA.map((col) => col.numbers.map((n) => n % col.divisor === 0)));
    setOk(DATA.map((col) => col.numbers.map(() => true)));
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
          Which numbers leave no remainder? Cross off.
        </p> */}
      </div>

      <div className="grid grid-cols-4 gap-6">
        {DATA.map((col, ci) => (
          <div key={col.id} className="space-y-3">
            <h3 className="bg-slate-100 text-center py-2 font-medium">
              {col.title}
            </h3>
            <div className="flex flex-col gap-2">
              {col.numbers.map((n, ni) => {
                const isCorrect = n % col.divisor === 0;
                const checkedVal = checked[ci][ni];
                const statusVal = ok[ci][ni];
                return (
                  <label
                    key={ni}
                    className={`flex items-center gap-2 border rounded px-2 py-1 cursor-pointer ${
                      statusVal === null
                        ? "border-slate-400"
                        : statusVal
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checkedVal}
                      onChange={() => toggleCheck(ci, ni)}
                      className="w-4 h-4"
                    />
                    <span>{n}</span>
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

export default ArrType_109;
