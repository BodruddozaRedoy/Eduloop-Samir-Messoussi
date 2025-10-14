import bedImg from "@/assets/images/arrtype40bed.png";
import bikeImg from "@/assets/images/arrtype40bycicle.png";
import lampostImg from "@/assets/images/arrtype40lampost.png";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* -----------------------------
   Demo data & hint (top)
------------------------------ */
type Item = {
  id: string;
  imgSrc: string;
  correctMeters: 1 | 2 | 5 | 10;
};

export const data: Item[] = [
  { id: "bike", imgSrc: bikeImg as unknown as string, correctMeters: 1 },
  { id: "bed", imgSrc: bedImg as unknown as string, correctMeters: 2 },
  { id: "lamp", imgSrc: lampostImg as unknown as string, correctMeters: 5 },
];

export const hint =
  "Choose from 1, 2, 5 or 10. Think of typical sizes: scooter ≈ 1 m, bed ≈ 2 m, street lamp ≈ 5–10 m.";

/* -----------------------------
   Types
------------------------------ */
type Status = "idle" | "match" | "wrong";
interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

/* -----------------------------
   Component
------------------------------ */
const ArrType_40: React.FC = () => {
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [checked, setChecked] = useState(false);

  // user answers (as strings to keep input relaxed)
  const [answers, setAnswers] = useState<string[]>(() => data.map(() => ""));
  // per-card correctness
  const [ok, setOk] = useState<boolean[]>(() => data.map(() => false));

  const setAnswer = useCallback((i: number, val: string) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[i] = val;
      return copy;
    });
  }, []);

  const parseAllowed = useCallback((v: string): 1 | 2 | 5 | 10 | null => {
    const n = parseInt((v ?? "").replace(/[^0-9]/g, ""), 10);
    return n === 1 || n === 2 || n === 5 || n === 10 ? (n as 1 | 2 | 5 | 10) : null;
  }, []);

  const handleShowHint = useCallback(() => {
    setShowHint((prev) => !prev);
  }, []);



     const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const handleCheck = useCallback(() => {
    let allCorrect = true;
    const results = answers.map((a, i) => {
      const parsed = parseAllowed(a);
      const isOk = parsed === data[i].correctMeters;
      if (!isOk) allCorrect = false;
      return isOk;
    });
    setOk(results);
    setChecked(true);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },allCorrect);
  }, [answers, parseAllowed]);

  const handleShowSolution = useCallback(() => {
    setAnswers(data.map((d) => String(d.correctMeters)));
    setOk(data.map(() => true));
    setChecked(true);
    setStatus("match");
  }, []);

  // ✅ keep ONLY ONE summary
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

  const controls = useMemo(
    () => ({
      handleCheck,
      handleShowHint,
      handleShowSolution,
      hint,
      showHint,
      summary,
    }),
    [handleCheck, handleShowHint, handleShowSolution, showHint, summary]
  );

  useEffect(() => {
    // push the current controls object to the global UI
    setControls(controls);
  }, [controls, setControls]);

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        {/* <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">
          How many metres approximately?
          <br />
          1, 2, 5 or 10?
        </p> */}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {data.map((item, i) => {
          const isRight = ok[i];
          const hasValue = answers[i].trim().length > 0;

          const ring = !checked
            ? "border-orange-300"
            : isRight
            ? "border-emerald-500"
            : "border-rose-500";

          const valueColor = !checked
            ? "text-slate-800"
            : isRight
            ? "text-emerald-600"
            : "text-rose-600";

          const underlineColor = !checked
            ? "border-slate-300"
            : isRight
            ? "border-emerald-400"
            : "border-rose-400";

          return (
            <div key={item.id} className="flex flex-col items-center gap-4">
              {/* image card */}
              <div className="flex h-48 w-44 items-center justify-center rounded-md bg-white shadow-sm">
                {item.imgSrc && (
                  <img
                    src={item.imgSrc}
                    alt={item.id}
                    className="max-h-40 select-none object-contain"
                    draggable={false}
                  />
                )}
              </div>

              {/* input pill */}
              <div className={`inline-flex items-center gap-2 rounded-md border ${ring} px-4 py-2`}>
                <span className={`${valueColor} font-semibold`}>{hasValue ? answers[i] : ""}</span>
                <span className="text-slate-700">meter</span>
              </div>

              {/* dotted input line below the pill */}
              <input
                value={answers[i]}
                onChange={(e) => setAnswer(i, e.target.value)}
                inputMode="numeric"
                placeholder=""
                className={`w-40 border-b border-dotted bg-transparent text-center outline-none ${underlineColor} ${valueColor}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArrType_40;
