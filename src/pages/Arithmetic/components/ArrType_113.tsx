import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Problem = {
  id: string;
  base: number;
  exp: number;
  steps?: { left: number; right: number; result: number } | null;
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
  { id: "p0", base: 5, exp: 2, steps: { left: 5, right: 5, result: 25 }, answer: 25 },
  { id: "p1", base: 1, exp: 2, steps: { left: 1, right: 1, result: 1 }, answer: 1 },
  { id: "p2", base: 2, exp: 2, steps: { left: 2, right: 2, result: 4 }, answer: 4 },
  { id: "p3", base: 1, exp: 2, steps: { left: 1, right: 1, result: 1 }, answer: 1 },
  { id: "p4", base: 2, exp: 2, steps: { left: 2, right: 2, result: 4 }, answer: 4 },
  { id: "p5", base: 1, exp: 2, steps: { left: 1, right: 1, result: 1 }, answer: 1 },
  { id: "p6", base: 10, exp: 2, steps: null, answer: 100 },
  { id: "p7", base: 8, exp: 2, steps: null, answer: 64 },
  { id: "p8", base: 12, exp: 2, steps: null, answer: 144 },
  { id: "p9", base: 12, exp: 2, steps: null, answer: 144 },
  { id: "p10", base: 12, exp: 2, steps: null, answer: 144 },
  { id: "p11", base: 12, exp: 2, steps: null, answer: 144 },
];

const DEFAULT_HINT =
  "To square a number, multiply it by itself (e.g., 2² = 2 × 2 = 4).";

/* ---------------- Input ---------------- */
const NumberInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  ok: boolean | null | undefined;
  width?: string;
}> = ({ value, onChange, ok, width = "w-12" }) => {
  const border =
    ok === null || ok === undefined
      ? "border-slate-400"
      : ok
      ? "border-green-500 text-green-600"
      : "border-red-500 text-red-600";

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
      className={`${width} text-center border-b-2 border-dotted focus:outline-none ${border}`}
    />
  );
};

/* ---------------- Main Component ---------------- */
const ArrType_113: React.FC<Props> = ({ data, hint }) => {
  const DATA = DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;

  const [values, setValues] = useState<Record<string, any>>({});
  const [ok, setOk] = useState<Record<string, any>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  // initialize values + ok state
  useEffect(() => {
    const initVals: Record<string, any> = {};
    const initOk: Record<string, any> = {};
    DATA.forEach((p) => {
      initVals[p.id] = { left: "", right: "", result: "", answer: "" };
      initOk[p.id] = { left: null, right: null, result: null, answer: null };
    });
    setValues(initVals);
    setOk(initOk);
    setStatus("idle");
  }, [DATA]);

    const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  /* -------- Handlers -------- */
  const handleCheck = useCallback(() => {
    const newOk: Record<string, any> = {};
    DATA.forEach((p) => {
      const v = values[p.id] ?? {};
      if (p.steps) {
        newOk[p.id] = {
          left: v.left === String(p.steps.left),
          right: v.right === String(p.steps.right),
          result: v.result === String(p.steps.result),
          answer: v.answer === String(p.answer),
        };
      } else {
        newOk[p.id] = {
          left: null,
          right: null,
          result: null,
          answer: v.answer === String(p.answer),
        };
      }
    });
    setOk(newOk);

    const allCorrect = Object.values(newOk).every((row: any) =>
      Object.values(row).every((val) => val === true || val === null)
    );
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },allCorrect);
  }, [DATA, values]);

  const handleShowSolution = useCallback(() => {
    const solVals: Record<string, any> = {};
    const solOk: Record<string, any> = {};
    DATA.forEach((p) => {
      if (p.steps) {
        solVals[p.id] = {
          left: String(p.steps.left),
          right: String(p.steps.right),
          result: String(p.steps.result),
          answer: String(p.answer),
        };
        solOk[p.id] = { left: true, right: true, result: true, answer: true };
      } else {
        solVals[p.id] = {
          left: "",
          right: "",
          result: "",
          answer: String(p.answer),
        };
        solOk[p.id] = { left: null, right: null, result: null, answer: true };
      }
    });
    setValues(solVals);
    setOk(solOk);
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
    <div className="space-y-6">
      <div>
        {/* <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">
          Calculate the area of the square.
        </p> */}
      </div>



      <div className="grid grid-cols-4 gap-6">
        {DATA.map((p) => {
          const v = values[p.id] ?? { left: "", right: "", result: "", answer: "" };
          const check = ok[p.id] ?? { left: null, right: null, result: null, answer: null };

          return (
            <div key={p.id} className="space-y-2 text-lg">
              <div className="flex items-center gap-2">
                <span>{p.base}² =</span>
                {p.steps ? (
                  <>
                    <NumberInput
                      value={v.left}
                      onChange={(val) =>
                        setValues((prev) => ({
                          ...prev,
                          [p.id]: { ...prev[p.id], left: val },
                        }))
                      }
                      ok={check.left}
                    />
                    <span>×</span>
                    <NumberInput
                      value={v.right}
                      onChange={(val) =>
                        setValues((prev) => ({
                          ...prev,
                          [p.id]: { ...prev[p.id], right: val },
                        }))
                      }
                      ok={check.right}
                    />
                    <span>=</span>
                    <NumberInput
                      value={v.result}
                      onChange={(val) =>
                        setValues((prev) => ({
                          ...prev,
                          [p.id]: { ...prev[p.id], result: val },
                        }))
                      }
                      ok={check.result}
                    />
                  </>
                ) : (
                  <NumberInput
                    value={v.answer}
                    onChange={(val) =>
                      setValues((prev) => ({
                        ...prev,
                        [p.id]: { ...prev[p.id], answer: val },
                      }))
                    }
                    ok={check.answer}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArrType_113;
