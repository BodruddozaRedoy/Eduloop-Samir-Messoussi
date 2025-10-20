import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type ColumnOptions = {
  values: number[];
  correct: number;
};

type Problem = {
  id: string;
  min: number;
  max: number;
  options: {
    col1: ColumnOptions;
    col2: ColumnOptions;
    col3: ColumnOptions;
  };
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
  {
    id: "p1",
    min: 50,
    max: 100,
    options: {
      col1: { values: [80, 60, 50], correct: 60 },
      col2: { values: [50, 70, 90], correct: 70 },
      col3: { values: [70, 20, 99], correct: 99 },
    },
  },
  {
    id: "p2",
    min: 60,
    max: 100,
    options: {
      col1: { values: [65, 80, 50], correct: 65 },
      col2: { values: [50, 77, 90], correct: 77 },
      col3: { values: [40, 90, 70], correct: 90 },
    },
  },
];

const DEFAULT_HINT =
  "Pick the correct numbers that correspond to the markers on the line.";

/* ---------------- Tiny NumberLine ---------------- */
const TinyNumberLine: React.FC<{
  min: number;
  max: number;
  options: Problem["options"];
  picked: (number | null)[];
  onPick: (colIndex: number, value: number) => void;
  ok: (boolean | null)[];
}> = ({ min, max, options, picked, onPick, ok }) => {
  if (!options) return null;

  const cols = [options.col1, options.col2, options.col3];

  return (
    <div className="flex flex-col items-center">
      {/* line */}
      <div className="relative w-64 border-t-2 border-slate-900 h-12 mb-6">
        <span className="absolute left-0  text-sm font-medium">{min}</span>
        <span className="absolute right-0  text-sm font-medium">{max}</span>
        {cols.map((_, i) => (
          <div
            key={i}
            className="absolute top-0 h-6 w-px bg-red-500"
            style={{ left: `${((i + 1) / 4) * 100}%` }}
          >
            <div className="w-2 h-2 rounded-full bg-slate-900  -ml-[3px]" />
          </div>
        ))}
      </div>

      {/* options */}
      <div className="flex gap-4 m-[-44px]">
        {cols.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-2 items-center">
            {col.values.map((val, i) => {
              const active = picked[colIndex] === val;
              const correct = ok[colIndex] === true && val === col.correct;
              const wrong = ok[colIndex] === false && active;

              return (
                <button
                  key={i}
                  onClick={() => onPick(colIndex, val)}
                  className={`px-3 py-1 border rounded border-orange-400
                    ${correct ? "bg-green-500 text-white" : ""}
                    ${wrong ? "bg-red-500 text-white" : ""}
                    ${active && !correct && !wrong ? "ring-2 ring-orange-500" : ""}`}
                >
                  {val}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- Component ---------------- */
const ArrType_70: React.FC<Props> = ({ data:DEFAULT_DATA, hint }) => {
  const DATA = DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;

  const [picked, setPicked] = useState<(number | null)[][]>(
    () => DATA.map(() => [null, null, null])
  );
  const [ok, setOk] = useState<(boolean | null)[][]>(
    () => DATA.map(() => [null, null, null])
  );
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  // reset when data changes
  useEffect(() => {
    setPicked(DATA.map(() => [null, null, null]));
    setOk(DATA.map(() => [null, null, null]));
    setStatus("idle");
    setShowHint(false);
  }, [DATA]);

  /* -------- Handlers -------- */
  const handlePick = (problemIndex: number, colIndex: number, value: number) => {
    setPicked((prev) => {
      const cp = [...prev];
      cp[problemIndex] = [...cp[problemIndex]];
      cp[problemIndex][colIndex] = value;
      return cp;
    });
    setOk((prev) => {
      const cp = [...prev];
      cp[problemIndex] = [...cp[problemIndex]];
      cp[problemIndex][colIndex] = null;
      return cp;
    });
    setStatus("idle");
  };

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();


  const handleCheck = useCallback(() => {
    const results = DATA.map((problem, pi) =>
      [problem.options.col1, problem.options.col2, problem.options.col3].map(
        (col, ci) => picked[pi][ci] === col.correct
      )
    );
    setOk(results);
    setStatus(results.every((arr) => arr.every(Boolean)) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },results.every((arr) => arr.every(Boolean)));
  }, [DATA, picked]);

  const handleShowSolution = useCallback(() => {
    setPicked(
      DATA.map((p) => [
        p.options.col1.correct,
        p.options.col2.correct,
        p.options.col3.correct,
      ])
    );
    setOk(DATA.map(() => [true, true, true]));
    setStatus("match");
  }, [DATA]);

  const handleShowHint = useCallback(() => setShowHint((s) => !s), []);

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

  /* -------- Register controls -------- */
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
  }, [setControls, handleCheck, handleShowSolution, handleShowHint, help, showHint, summary]);

  /* -------- Render -------- */
  return (
    <div className="space-y-10">
      <div>
        {/* <h2 className="text-lg font-semibold">Question 2</h2>
        <p className="text-sm text-slate-600">Which number?</p> */}
      </div>

      <div className="flex justify-center gap-20 flex-wrap">
        {DATA.map((problem, pi) => (
          <TinyNumberLine
            key={problem.id}
            min={problem.min}
            max={problem.max}
            options={problem.options}
            picked={picked[pi]}
            ok={ok[pi]}
            onPick={(colIndex, value) => handlePick(pi, colIndex, value)}
          />
        ))}
      </div>
    </div>
  );
};

export default ArrType_70;
