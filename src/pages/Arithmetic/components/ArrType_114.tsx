import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Problem = {
  id: string;
  question: string;  // e.g. "√36"
  answer: string;    // e.g. "6"
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
  { id: "p1", question: "√36", answer: "6" },
  { id: "p2", question: "√16", answer: "4" },
  { id: "p3", question: "√25", answer: "5" },
  { id: "p4", question: "√49", answer: "7" },
  { id: "p5", question: "√81", answer: "9" },
  { id: "p6", question: "√9", answer: "3" },
  { id: "p7", question: "√4", answer: "2" },
  { id: "p8", question: "√64", answer: "8" },
  { id: "p9", question: "√121", answer: "11" },
  { id: "p10", question: "√144", answer: "12" },
  { id: "p11", question: "√100", answer: "10" },
  { id: "p12", question: "√49", answer: "7" },
];

const DEFAULT_HINT = "Remember: √n means the number which multiplied by itself equals n.";

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
const ArrType_114: React.FC<Props> = ({ data, hint }) => {
  const DATA =DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;

  const [values, setValues] = useState<string[]>(() => DATA.map(() => ""));
  const [ok, setOk] = useState<(boolean | null)[]>(() => DATA.map(() => null));
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setValues(DATA.map(() => ""));
    setOk(DATA.map(() => null));
    setStatus("idle");
  }, [data]);


    const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  /* -------- Handlers -------- */
  const handleCheck = useCallback(() => {
    const results = DATA.map((p, i) => values[i] === p.answer);
    setOk(results);
    setStatus(results.every(Boolean) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },results.every(Boolean));
  }, [DATA, values]);

  const handleShowSolution = useCallback(() => {
    setValues(DATA.map((p) => p.answer));
    setOk(DATA.map(() => true));
    setStatus("match");
  }, [DATA]);

  const handleShowHint = useCallback(() => setShowHint((prev) => !prev), []);

  /* -------- Summary -------- */
  const summary: Summary | null = useMemo(() => {
    if (status === "match")
      return { text: "Correct! Great job.", color: "text-green-700", bgColor: "bg-green-100", borderColor: "border-green-600" };
    if (status === "wrong")
      return { text: "Some answers are wrong. Try again.", color: "text-red-700", bgColor: "bg-red-100", borderColor: "border-red-600" };
    return null;
  }, [status]);

  const { setControls } = useQuestionControls();
  useEffect(() => {
    setControls({ handleCheck, handleShowSolution, handleShowHint, hint: help, showHint, summary });
  }, [setControls, handleCheck, handleShowSolution, handleShowHint, help, showHint, summary]);

  /* -------- Render -------- */
  return (
    <div className="space-y-6">
      <div>
        {/* <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">
          Calculate the length of the sides of the square. Use the calculator.
        </p> */}
      </div>

      {/* Example with image */}
      <div className="flex items-center gap-4">
        <img src="/images/arrtype114square.png" alt="Square" className="h-32" />
        <div>
          <p className="text-sm text-slate-600">area = 36 cm²</p>
          <p className="text-sm text-slate-600">length of a side</p>
          <p className="text-lg">
            √36 ={" "}
            <NumberInput
              value={values[0]}
              onChange={(val) =>
                setValues((prev) => {
                  const cp = [...prev];
                  cp[0] = val;
                  return cp;
                })
              }
              ok={ok[0]}
            />
          </p>
        </div>
      </div>

      {/* 4-column grid */}
      <div className="grid grid-cols-4 gap-6">
        {DATA.slice(1).map((p, i) => (
          <div key={p.id} className="text-lg flex items-center gap-2">
            <span>{p.question} =</span>
            <NumberInput
              value={values[i + 1]}
              onChange={(val) =>
                setValues((prev) => {
                  const cp = [...prev];
                  cp[i + 1] = val;
                  return cp;
                })
              }
              ok={ok[i + 1]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrType_114;
