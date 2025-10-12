
import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Problem = {
  id: string;
  left: string; // e.g. "7 km"
  right: string; // e.g. "m"
  answer: string; // e.g. "7000"
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
  { id: "p1", left: "7 km", right: "m", answer: "7000" },
  { id: "p2", left: "390 cm", right: "dm", answer: "39" },
  { id: "p3", left: "4 hm", right: "m", answer: "400" },
  { id: "p4", left: "250 mm", right: "cm", answer: "25" },
  { id: "p5", left: "9 m", right: "cm", answer: "900" },
  { id: "p6", left: "2400 m", right: "hm", answer: "24" },
  { id: "p7", left: "2 km", right: "m", answer: "2000" },
  { id: "p8", left: "300 dm", right: "m", answer: "30" },
];

const DEFAULT_HINT =
  "Remember the metric conversions: 1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm, 1 hm = 100 m, 1 dm = 0.1 m.";

/* ---------------- Input Component ---------------- */
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
const ArrType_91: React.FC<Props> = ({ data, hint }) => {
  // const DATA = data?.length ? data : DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;
  const DATA = DEFAULT_DATA;

  const [values, setValues] = useState<string[]>(() => DATA.map(() => ""));
  const [ok, setOk] = useState<(boolean | null)[]>(() => DATA.map(() => null));
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setValues(DATA.map(() => ""));
    setOk(DATA.map(() => null));
    setStatus("idle");
    setShowHint(false);
  }, [DATA]);

  /* -------- Handlers -------- */
  const handleCheck = useCallback(() => {
    const results = DATA.map((p, i) => values[i].trim() === p.answer);
    setOk(results);
    setStatus(results.every(Boolean) ? "match" : "wrong");
  }, [DATA, values]);

  const handleShowSolution = useCallback(() => {
    setValues(DATA.map((p) => p.answer));
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
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">Convert to the other measurement.</p>
      </div>
      <div className="grid grid-cols-2 gap-8">
        {DATA.map((p, i) => (
          <div key={p.id} className="flex items-center gap-2 text-lg">
            <span>{p.left}</span>
            <span>=</span>
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
            <span>{p.right}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrType_91;









