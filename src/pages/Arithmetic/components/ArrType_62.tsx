import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ----------------------------
   Demo data & hint (top)
   Each column has TWO given values (middle cells).
----------------------------- */
type Col = { top: number; bottom: number }; // two given values

export const DEMO_COLS: Col[] = [
  { top: 3400, bottom: 3401 }, // step +1
  { top: 180,  bottom: 190  }, // step +10
  { top: 1200, bottom: 1300 }, // step +100
  { top: 5000, bottom: 6000 }, // step +1000
  { top: 2505, bottom: 2506 }, // step +1
];

export const hint =
  "Count on and back. Each column shows two given numbers. Determine the step (difference between them) and write the number before the first and after the second.";

/* ----------------------------
   Helpers
----------------------------- */
type Status = "idle" | "match" | "wrong";
interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}
const parseLoose = (v: unknown) => {
  const n = parseFloat(String(v ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
};

type Props = { data?: Col[]; hint?: string };

/* ----------------------------
   Component
----------------------------- */
const ArrType_62: React.FC<Props> = ({ data: incoming, hint: incomingHint }) => {
  // ✅ Normalize: use props if valid, else demo
  const cols = useMemo<Col[]>(() => {
    const src = Array.isArray(incoming) && incoming.length ? incoming : DEMO_COLS;
    const cleaned = src
      .map((c: any) => ({
        top: Math.trunc(parseLoose(c?.top)),
        bottom: Math.trunc(parseLoose(c?.bottom)),
      }))
      .filter((c) => Number.isFinite(c.top) && Number.isFinite(c.bottom));
    return cleaned.length ? cleaned : DEMO_COLS; // guarantee at least one column
  }, [incoming]);

  const helpText = incomingHint ?? hint;

  // Expected per column
  const expected = useMemo(
    () =>
      cols.map((c) => {
        const step = c.bottom - c.top; // may be negative/zero/positive
        return {
          before: c.top - step,
          givenTop: c.top,
          givenBottom: c.bottom,
          after: c.bottom + step,
        };
      }),
    [cols]
  );

  // UI state
  const [answers, setAnswers] = useState<{ before: string; after: string }[]>(
    () => cols.map(() => ({ before: "", after: "" }))
  );
  const [ok, setOk] = useState<{ before: boolean; after: boolean }[]>(
    () => cols.map(() => ({ before: false, after: false }))
  );
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  // Reset whenever the *content* we render changes
  useEffect(() => {
    setAnswers(cols.map(() => ({ before: "", after: "" })));
    setOk(cols.map(() => ({ before: false, after: false })));
    setChecked(false);
    setStatus("idle");
    setShowHint(false);
  }, [cols]);

  const setAnswer = useCallback(
    (i: number, field: "before" | "after", v: string) => {
      setAnswers((prev) => {
        const cp = [...prev];
        cp[i] = { ...cp[i], [field]: v };
        return cp;
      });
    },
    []
  );

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  const handleCheck = useCallback(() => {
    const results = answers.map((a, i) => {
      const want = expected[i];
      const b = parseLoose(a.before);
      const af = parseLoose(a.after);
      return {
        before: Number.isFinite(b) && Math.trunc(b) === want.before,
        after: Number.isFinite(af) && Math.trunc(af) === want.after,
      };
    });

    setOk(results);
    setChecked(true);
    setStatus(results.every((r) => r.before && r.after) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },results.every((r) => r.before && r.after));
  }, [answers, expected]);

  const handleShowSolution = useCallback(() => {
    setAnswers(expected.map((e) => ({ before: String(e.before), after: String(e.after) })));
    setOk(expected.map(() => ({ before: true, after: true })));
    setChecked(true);
    setStatus("match");
  }, [expected]);

  const handleShowHint = useCallback(() => setShowHint((s) => !s), []);

  const summary: Summary | null = useMemo(() => {
    if (status === "match")
      return { text: "Correct! Great job.", color: "text-green-700", bgColor: "bg-green-100", borderColor: "border-green-600" };
    if (status === "wrong")
      return { text: "Some answers are wrong. Try again.", color: "text-red-700", bgColor: "bg-red-100", borderColor: "border-red-600" };
    return null;
  }, [status]);

  // Expose handlers to your global toolbar
  const { setControls } = useQuestionControls();
  const controls = useMemo(
    () => ({ handleCheck, handleShowSolution, handleShowHint, hint: helpText, showHint, summary }),
    [handleCheck, handleShowSolution, handleShowHint, helpText, showHint, summary]
  );
  useEffect(() => {
    setControls(controls);
  }, [controls, setControls]);

  // Styling
  const cell = "h-10 w-16 grid place-items-center rounded-sm border-2 border-orange-300 bg-white";
  const inputBase = "w-full bg-transparent text-center outline-none border-b border-dotted";
  const underline = (good: boolean) =>
    !checked ? "border-slate-300 text-slate-800" : good ? "border-emerald-400 text-emerald-600" : "border-rose-400 text-rose-600";
  const givenText = "text-slate-900 tabular-nums";

  return (
    <div className="space-y-5">
      <div>
        {/* <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">Count on and back. Make jumps of 1, 10, 100 or 1000.</p> */}
      </div>

      {/* columns */}
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 xl:grid-cols-5">
        {expected.map((e, i) => (
          <div key={`${e.givenTop}-${e.givenBottom}-${i}`} className="grid grid-rows-4 gap-3">
            {/* before (input) */}
            <div className={cell}>
              <input
                value={answers[i].before}
                onChange={(ev) => setAnswer(i, "before", ev.target.value)}
                inputMode="numeric"
                className={`${inputBase} ${underline(ok[i].before)} w-14`}
                aria-label={`before column ${i + 1}`}
              />
            </div>

            {/* given top */}
            <div className={`${cell} ${givenText}`}>{e.givenTop}</div>

            {/* given bottom */}
            <div className={`${cell} ${givenText}`}>{e.givenBottom}</div>

            {/* after (input) */}
            <div className={cell}>
              <input
                value={answers[i].after}
                onChange={(ev) => setAnswer(i, "after", ev.target.value)}
                inputMode="numeric"
                className={`${inputBase} ${underline(ok[i].after)} w-14`}
                aria-label={`after column ${i + 1}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrType_62;
