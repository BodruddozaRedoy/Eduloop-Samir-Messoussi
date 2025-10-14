import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Problem = {
  id: string;
  percent: number;   // e.g. 2
  base: number;      // e.g. 300
  answer: number;    // e.g. 6
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
  { id: "p1", percent: 2, base: 300, answer: 6 },
  { id: "p2", percent: 50, base: 360, answer: 180 },
  { id: "p3", percent: 5, base: 900, answer: 45 },
  { id: "p4", percent: 8, base: 1200, answer: 96 },
  { id: "p5", percent: 75, base: 4000, answer: 3000 },
  { id: "p6", percent: 10, base: 500, answer: 50 },
  { id: "p7", percent: 20, base: 150, answer: 30 },
  { id: "p8", percent: 12, base: 600, answer: 72 },
  { id: "p9", percent: 25, base: 200, answer: 50 },
  { id: "p10", percent: 40, base: 250, answer: 100 },
  { id: "p11", percent: 30, base: 1000, answer: 300 },
  { id: "p12", percent: 15, base: 800, answer: 120 },
];

const DEFAULT_HINT =
  "Remember: (percent × base) ÷ 100 = result. Example: 2% of 300 = (2×300)/100 = 6.";

/* ---------------- Input ---------------- */
const NumberInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  ok: boolean | null;
}> = ({ value, onChange, ok }) => {
  const border =
    ok === null
      ? "border-slate-400"
      : ok
      ? "border-green-500 text-green-600"
      : "border-red-500 text-red-600";

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
      className={`w-20 text-center border-b-2 border-dotted focus:outline-none ${border}`}
    />
  );
};

/* ---------------- Main Component ---------------- */
const ArrType_106: React.FC<Props> = ({ data, hint }) => {
  const DATA = DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;

  const [values, setValues] = useState<string[]>(() =>
    DATA.map(() => "")
  );
  const [ok, setOk] = useState<(boolean | null)[]>(() =>
    DATA.map(() => null)
  );
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setValues(DATA.map(() => ""));
    setOk(DATA.map(() => null));
    setStatus("idle");
    setShowHint(false);
  }, [data]);

  /* -------- Handlers -------- */
    const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const handleCheck = useCallback(() => {
    const results = DATA.map((p, i) => values[i] === String(p.answer));
    setOk(results);
    setStatus(results.every(Boolean) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },results.every(Boolean));
  }, [DATA, values]);

  const handleShowSolution = useCallback(() => {
    setValues(DATA.map((p) => String(p.answer)));
    setOk(DATA.map(() => true));
    setStatus("match");
  }, [DATA]);

  const handleShowHint = useCallback(() => setShowHint((prev) => !prev), []);

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
  }, [setControls, handleCheck, handleShowSolution, handleShowHint, help, showHint, summary]);

  /* -------- Render -------- */
  return (
    <div className="space-y-6">
      <div>
        {/* <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">
          Calculate. Mark with a cross the sums you calculate using 1%.
        </p> */}
      </div>



      <div className="grid grid-cols-4 gap-6">
        {DATA.map((p, i) => (
          <div key={p.id} className="flex items-center gap-2 text-lg">
            <span>{p.percent}% of £{p.base} =</span>
            <NumberInput
              value={values[i]}
              onChange={(val) =>
                setValues((prev) => {
                  const cp = [...prev];
                  cp[i] = val;
                  return cp;
                })
              }
              ok={ok[i]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrType_106;
