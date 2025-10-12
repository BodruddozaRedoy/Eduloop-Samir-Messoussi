import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Problem = {
  id: string;
  base: number;
  power: number;
  answer: number;
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
  { id: "p1", base: 2, power: 2, answer: 4 },
  { id: "p2", base: 2, power: 8, answer: 256 },
  { id: "p3", base: 4, power: 2, answer: 16 },
  { id: "p4", base: 3, power: 3, answer: 27 },
  { id: "p5", base: 2, power: 10, answer: 1024 },
  { id: "p6", base: 4, power: 3, answer: 64 },
  { id: "p7", base: 2, power: 4, answer: 16 },
  { id: "p8", base: 3, power: 6, answer: 729 },
  { id: "p9", base: 4, power: 4, answer: 256 },
  { id: "p10", base: 2, power: 6, answer: 64 },
  { id: "p11", base: 6, power: 3, answer: 216 },
  { id: "p12", base: 4, power: 5, answer: 1024 },
];

const DEFAULT_HINT =
  "Remember: a^b means multiply 'a' by itself 'b' times. Example: 2^3 = 2 × 2 × 2 = 8.";

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
const ArrType_105: React.FC<Props> = ({ data, hint }) => {
  const DATA = DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;

  const [values, setValues] = useState<string[]>(() => DATA.map(() => ""));
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
  const handleCheck = useCallback(() => {
    const results = DATA.map((p, i) => values[i] === String(p.answer));
    setOk(results);
    setStatus(results.every(Boolean) ? "match" : "wrong");
  }, [DATA, values]);

  const handleShowSolution = useCallback(() => {
    setValues(DATA.map((p) => String(p.answer)));
    setOk(DATA.map(() => true));
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
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">Calculate using the belt machine.</p>
      </div>

      <div className="grid grid-cols-4 gap-8">
        {DATA.map((p, i) => (
          <div key={p.id} className="flex items-center gap-2 text-lg">
            <span>
              {p.base}
              <sup>{p.power}</sup> =
            </span>
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

export default ArrType_105;
