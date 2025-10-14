import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Problem = {
  id: string;
  value: number;   // e.g. 36
  answer: number;  // e.g. 6
};

type DataProp = {
  problems: Problem[];
};

type Props = {
  data?: DataProp;
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
const DEFAULT_DATA: DataProp = {
  problems: [
    { id: "p1", value: 36, answer: 6 },
    { id: "p2", value: 81, answer: 9 },
    { id: "p3", value: 25, answer: 5 },
    { id: "p4", value: 49, answer: 7 },
    { id: "p5", value: 81, answer: 9 },
    { id: "p6", value: 9, answer: 3 },
    { id: "p7", value: 4, answer: 2 },
    { id: "p8", value: 64, answer: 8 },
    { id: "k1", value: 36, answer: 6 },
    { id: "k2", value: 81, answer: 9 },
    { id: "k3", value: 25, answer: 5 },
    { id: "k4", value: 49, answer: 7 },
    { id: "k5", value: 81, answer: 9 },
    { id: "k6", value: 9, answer: 3 },
    { id: "k7", value: 4, answer: 2 },
    { id: "k8", value: 64, answer: 8 },
  ],
};

const DEFAULT_HINT =
  "Remember: √n means the number which multiplied by itself gives n. Example: √36 = 6 because 6 × 6 = 36.";

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
      className={`w-16 text-center border-b-2 border-dotted focus:outline-none ${border}`}
    />
  );
};

/* ---------------- Main Component ---------------- */
const ArrType_104: React.FC<Props> = ({ data, hint }) => {
  const DATA = DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;

  const [values, setValues] = useState<string[]>(() =>
    DATA.problems.map(() => "")
  );
  const [ok, setOk] = useState<(boolean | null)[]>(() =>
    DATA.problems.map(() => null)
  );
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setValues(DATA.problems.map(() => ""));
    setOk(DATA.problems.map(() => null));
    setStatus("idle");
    setShowHint(false);
  }, [data]);

  /* -------- Handlers -------- */
      const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const handleCheck = useCallback(() => {
    const results = DATA.problems.map(
      (p, i) => values[i] === String(p.answer)
    );
    setOk(results);
    setStatus(results.every(Boolean) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },results.every(Boolean));
  }, [DATA, values]);

  const handleShowSolution = useCallback(() => {
    setValues(DATA.problems.map((p) => String(p.answer)));
    setOk(DATA.problems.map(() => true));
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
  }, [setControls, handleCheck, handleShowSolution, handleShowHint, help, showHint, summary]);

  /* -------- Render -------- */
  return (
    <div className="space-y-8">
      <div>
        {/* <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">Calculate.</p> */}
      </div>

      <div className="grid grid-cols-4 gap-6">
        {DATA.problems.map((p, i) => (
          <div key={p.id} className="flex items-center gap-2 text-lg">
            <span>√{p.value} =</span>
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

export default ArrType_104;
