import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Item = {
  id?: string;
  min: number;
  max: number;
  correct: number;
};

type Props = {
  data?: Item[];
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
const DEFAULT_DATA: Item[] = [
  { id: "i1", min: 80, max: 90, correct: 84 },
  { id: "i2", min: 10, max: 20, correct: 16 },
  { id: "i3", min: 60, max: 70, correct: 63 },
  { id: "i4", min: 20, max: 30, correct: 21 },
  { id: "i5", min: 50, max: 60, correct: 59 },
  { id: "i6", min: 70, max: 80, correct: 72 },
  { id: "i7", min: 30, max: 40, correct: 38 },
  { id: "i8", min: 40, max: 50, correct: 45 },
];

const DEFAULT_HINT =
  "Think of a number that lies between the given two numbers.";

/* ---------------- Component ---------------- */
const ArrType_84: React.FC<Props> = ({ data:DEFAULT_DATA, hint }) => {
  // const DATA = useMemo(
  //   () => (Array.isArray(data) && data.length ? data : DEFAULT_DATA),
  //   [data]
  // );
  const DATA = DEFAULT_DATA;

  const help = hint ?? DEFAULT_HINT;

  const [answers, setAnswers] = useState<string[]>(() => DATA.map(() => ""));
  const [ok, setOk] = useState<(boolean | null)[]>(() => DATA.map(() => null));
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  // reset when DATA changes
  useEffect(() => {
    setAnswers(DATA.map(() => ""));
    setOk(DATA.map(() => null));
    setStatus("idle");
    setShowHint(false);
  }, [DATA]);

  /* -------- Handlers -------- */
 const handleCheck = useCallback(() => {
  const results = DATA.map((c, i) => {
    const val = Number(answers[i]);
    // Accept any number strictly between min and max
    return !isNaN(val) && val > c.min && val < c.max;
  });
  setOk(results);
  setStatus(results.every(Boolean) ? "match" : "wrong");
}, [DATA, answers]);

const handleShowSolution = useCallback(() => {
  // Just show one valid example (the midpoint)
  setAnswers(DATA.map((c) => String(Math.floor((c.min + c.max) / 2))));
  setOk(DATA.map(() => true));
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
  const half = Math.ceil(DATA.length / 2);
  const left = DATA.slice(0, half);
  const right = DATA.slice(half);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Question 5</h2>
        <p className="text-sm text-slate-600">What number could it be?</p>
      </div>

      <div className="grid grid-cols-2 gap-x-12 gap-y-4">
        {[left, right].map((group, gi) => (
          <div key={gi} className="space-y-3">
            {group.map((c, i) => {
              const idx = gi === 0 ? i : i + half;
              return (
                <div key={c.id ?? idx} className="flex items-center gap-2">
                  <span>
                    Between {c.min} and {c.max} lies
                  </span>
                  <input
                    type="text"
                    value={answers[idx]}
                    onChange={(e) => {
                      const cp = [...answers];
                      cp[idx] = e.target.value.replace(/[^0-9]/g, "");
                      setAnswers(cp);
                      setOk((prev) => {
                        const arr = [...prev];
                        arr[idx] = null;
                        return arr;
                      });
                      setStatus("idle");
                    }}
                    className={`border-b-2 w-16 text-center outline-none
                      ${
                        ok[idx] === null
                          ? "border-slate-400"
                          : ok[idx]
                          ? "border-green-500 text-green-600 font-semibold"
                          : "border-red-500 text-red-600 font-semibold"
                      }`}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

    </div>
  );
};

export default ArrType_84;
