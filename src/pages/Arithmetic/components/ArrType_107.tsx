import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Item = {
  id: string;
  percent: number;
  base: number;
  answer: number;
};

type Status = "idle" | "match" | "wrong";

interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

/* ---------------- Default Data ---------------- */
const DEFAULT_DATA: Item[] = [
  { id: "a1", percent: 2, base: 200, answer: 4 },
  { id: "a2", percent: 80, base: 300, answer: 240 },
  { id: "a3", percent: 1, base: 2300, answer: 23 },
];

const DEFAULT_HINT =
  "Multiply the number by the percentage and divide by 100. Example: 2% of 200 = (200 × 2) ÷ 100.";

/* ---------------- Component ---------------- */
const ArrType_107: React.FC = () => {
  const DATA = DEFAULT_DATA;
  const hint = DEFAULT_HINT;

  const [values, setValues] = useState<string[][]>(() =>
    Array(3)
      .fill(0)
      .map(() => Array(DATA.length).fill(""))
  );
  const [ok, setOk] = useState<(boolean | null)[][]>(() =>
    Array(3)
      .fill(0)
      .map(() => Array(DATA.length).fill(null))
  );

  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  /* -------- Handlers -------- */
  const handleCheck = useCallback(() => {
    const results = values.map((col) =>
      col.map((val, i) => Number(val) === DATA[i].answer)
    );
    setOk(results);

    const allCorrect = results.flat().every((r) => r === true);
    setStatus(allCorrect ? "match" : "wrong");

    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [values, DATA]);

  const handleShowSolution = useCallback(() => {
    setValues(values.map(() => DATA.map((item) => String(item.answer))));
    setOk(ok.map(() => DATA.map(() => true)));
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

  /* -------- Hook into global controls -------- */
  useEffect(() => {
    setControls({
      handleCheck,
      handleShowSolution,
      handleShowHint,
      hint,
      showHint,
      summary,
    });
  }, [setControls, handleCheck, handleShowSolution, handleShowHint, hint, showHint, summary]);

  /* -------- Render -------- */
  return (
    <div className="space-y-6">
      <p className="text-lg font-medium">Calculate.</p>

      <div className="grid grid-cols-3 gap-8">
        {Array(3)
          .fill(0)
          .map((_, colIdx) => (
            <div key={colIdx} className="space-y-4">
              {DATA.map((item, rowIdx) => (
                <div key={item.id} className="text-lg">
                  {item.percent}% of {item.base} ={" "}
                  <input
                    type="text"
                    inputMode="numeric"
                    value={values[colIdx][rowIdx]}
                    onChange={(e) => {
                      const cp = values.map((v) => [...v]);
                      cp[colIdx][rowIdx] = e.target.value.replace(/[^0-9]/g, "");
                      setValues(cp);
                    }}
                    className={`w-20 text-center border-b-2 border-dotted focus:outline-none ${
                      ok[colIdx][rowIdx] === null
                        ? "border-slate-400"
                        : ok[colIdx][rowIdx]
                        ? "border-green-500 text-green-600"
                        : "border-red-500 text-red-600"
                    }`}
                  />
                </div>
              ))}
            </div>
          ))}
      </div>

      {/* {summary && (
        <div
          className={`p-3 rounded-md border ${summary.bgColor} ${summary.color} ${summary.borderColor}`}
        >
          {summary.text}
        </div>
      )} */}
    </div>
  );
};

export default ArrType_107;
