import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Problem = {
  id: string;
  left: string; // e.g. "6 km + 300 m"
  steps: { unit: string; answer: string }[]; // sequential steps
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
    left: "6 km + 300 m",
    steps: [
      { unit: "m", answer: "6000" },
      { unit: "m", answer: "300" },
      { unit: "m", answer: "6300" },
    ],
  },
  {
    id: "p2",
    left: "2 m + 7 dm",
    steps: [
      { unit: "dm", answer: "20" },
      { unit: "dm", answer: "7" },
      { unit: "dm", answer: "27" },
    ],
  },
  {
    id: "p3",
    left: "5 cm + 45 mm",
    steps: [
      { unit: "mm", answer: "50" },
      { unit: "mm", answer: "45" },
      { unit: "mm", answer: "95" },
    ],
  },
  {
    id: "p4",
    left: "3 m + 52 cm",
    steps: [
      { unit: "cm", answer: "300" },
      { unit: "cm", answer: "52" },
      { unit: "cm", answer: "352" },
    ],
  },
  {
    id: "p5",
    left: "4 dm + 33 cm",
    steps: [
      { unit: "cm", answer: "40" },
      { unit: "cm", answer: "33" },
      { unit: "cm", answer: "73" },
    ],
  },
  {
    id: "p6",
    left: "7 km + 25 hm",
    steps: [
      { unit: "m", answer: "7000" },
      { unit: "m", answer: "2500" },
      { unit: "m", answer: "9500" },
    ],
  },
];

const DEFAULT_HINT =
  "Convert all terms to the same unit, then add them together step by step.";

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
const ArrType_92: React.FC<Props> = ({ data, hint }) => {
  const help = hint ?? DEFAULT_HINT;
  const DATA = useMemo(() => {
    return Array.isArray(data) && data.length ? data : DEFAULT_DATA;
  }, [data]);

  const [values, setValues] = useState<string[][]>(() =>
    DATA.map((p) => p.steps.map(() => ""))
  );
  const [ok, setOk] = useState<(boolean | null)[][]>(() =>
    DATA.map((p) => p.steps.map(() => null))
  );
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setValues(DATA.map((p) => p.steps.map(() => "")));
    setOk(DATA.map((p) => p.steps.map(() => null)));
    setStatus("idle");
    setShowHint(false);
  }, [DATA]);

  /* -------- Handlers -------- */
  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const handleCheck = useCallback(() => {
    const results = DATA.map((p, i) =>
      p.steps.map((s, j) => values[i][j] === s.answer)
    );
    setOk(results);
    setStatus(results.every((row) => row.every(Boolean)) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },results.every((row) => row.every(Boolean)));
  }, [DATA, values]);

  const handleShowSolution = useCallback(() => {
    setValues(DATA.map((p) => p.steps.map((s) => s.answer)));
    setOk(DATA.map((p) => p.steps.map(() => true)));
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
        {/* <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">How much is it in total?</p> */}
      </div>



      <div className="space-y-5">
        {DATA.map((p, i) => (
          <div key={p.id} className="flex items-center gap-2 text-lg">
            <span>{p.left}</span>
            <span>=</span>
            {p.steps.map((s, j) => (
              <React.Fragment key={j}>
                <NumberInput
                  value={values[i][j]}
                  onChange={(val) =>
                    setValues((prev) => {
                      const cp = [...prev];
                      cp[i] = [...cp[i]];
                      cp[i][j] = val;
                      return cp;
                    })
                  }
                  ok={ok[i][j]}
                />
                <span>{s.unit}</span>
                {j < p.steps.length - 1 && (
                  <span>{j === p.steps.length - 2 ? "=" : "+"}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrType_92;
