import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* --------------------------------
   Demo data & hint (top of file)
--------------------------------- */

// Each row is “a × b m” with a specific expected result in meters.
export type MeterRow = { a: number; b: number; expected: number };

export const data: MeterRow[] = [
  { a: 4,  b: 4.7,  expected: 18.8  },
  { a: 5,  b: 3.2,  expected: 16.0  },
  { a: 6,  b: 2.75, expected: 16.5  },
  { a: 3,  b: 8.4,  expected: 25.2  },
  { a: 9,  b: 1.25, expected: 11.25 },
  { a: 7,  b: 2.3,  expected: 16.1  },
  { a: 2,  b: 12.5, expected: 25.0  },
  { a: 8,  b: 3.9,  expected: 31.2  },
  { a: 10, b: 0.95, expected: 9.5   },
];

export const hint =
  "For splitting: e.g., 4 × 4.7 m = 4 × (4 + 0.7) = 16 + 2.8 = 18.8 m. Round sensibly when estimating.";

/* --------------------------------
   Helpers
--------------------------------- */
type Status = "idle" | "match" | "wrong";
interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

// parse relaxed inputs like “23.5”, “23.50m”, “m 23.5”
const parseLoose = (v: string | number | null | undefined) => {
  if (typeof v === "number") return v;
  if (v == null) return NaN;
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
};

const stripZeros = (n: number) => {
  const s = n.toFixed(2);
  return s.replace(/\.?0+$/, ""); // 31.20 -> 31.2, 25.00 -> 25
};

/* --------------------------------
   Props (for later) + normalizer
--------------------------------- */
type Props = {
  data?: MeterRow[];   // optional: override the demo set
  hint?: string;
};

const normalize = (incoming?: MeterRow[]) => {
  const src = Array.isArray(incoming) && incoming.length ? incoming : data;
  const rows = src
    .map((r) => ({
      a: parseLoose((r as any)?.a),
      b: parseLoose((r as any)?.b),
      expected: parseLoose((r as any)?.expected),
    }))
    .filter((r) => Number.isFinite(r.a) && Number.isFinite(r.b) && Number.isFinite(r.expected)) as MeterRow[];
  return rows.length ? rows : data;
};

/* --------------------------------
   Component
--------------------------------- */
const ArrType_51: React.FC<Props> = ({ data: incoming, hint: incomingHint }) => {
  const rows = useMemo(() => normalize(incoming), [incoming]);
  const helpText = incomingHint ?? hint;

  // UI state
  const [answers, setAnswers] = useState<string[]>(() => rows.map(() => ""));
  const [ok, setOk] = useState<boolean[]>(() => rows.map(() => false));
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  // Reset if rows change (count or content)
  useEffect(() => {
    setAnswers(rows.map(() => ""));
    setOk(rows.map(() => false));
    setChecked(false);
    setStatus("idle");
    setShowHint(false);
  }, [rows.length]);

  const setAnswer = useCallback((i: number, v: string) => {
    setAnswers((prev) => {
      const cp = [...prev];
      cp[i] = v;
      return cp;
    });
  }, []);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  const handleCheck = useCallback(() => {
    const results = rows.map((r, i) => {
      const want = +r.expected.toFixed(2);
      const given = parseLoose(answers[i]);
      return Number.isFinite(given) && Math.abs(given - want) < 0.01;
    });
    setOk(results);
    setChecked(true);
    setStatus(results.every(Boolean) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },results.every(Boolean));
  }, [answers, rows]);

  const handleShowSolution = useCallback(() => {
    const filled = rows.map((r) => stripZeros(+r.expected.toFixed(2)));
    setAnswers(filled);
    setOk(rows.map(() => true));
    setChecked(true);
    setStatus("match");
  }, [rows]);

  const handleShowHint = useCallback(() => setShowHint((s) => !s), []);

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

  // Expose handlers to the global toolbar (no local Controllers/Hint/Check)
  const { setControls } = useQuestionControls();
  const controls = useMemo(
    () => ({
      handleCheck,
      handleShowSolution,
      handleShowHint,
      hint: helpText,
      showHint,
      summary,
    }),
    [handleCheck, handleShowSolution, handleShowHint, helpText, showHint, summary]
  );
  useEffect(() => {
    setControls(controls);
  }, [controls, setControls]);

  // Styles like Figma: orange rounded box; dotted underline input; green/red feedback on Check
  const inputUnderline = (good: boolean) =>
    !checked
      ? "border-slate-300 text-slate-900"
      : good
      ? "border-emerald-400 text-emerald-600"
      : "border-rose-400 text-rose-600";

  const unitColor = (good: boolean) =>
    !checked ? "text-slate-700" : good ? "text-emerald-600" : "text-rose-600";

  return (
    <div className="space-y-5">

      {/* 3 columns like the screenshots */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((r, i) => {
          const good = ok[i];
          return (
            <div
              key={`${r.a}x${r.b}-${i}`}
              className="inline-flex items-center gap-2 rounded-md border-2 border-orange-300 bg-white px-4 py-3"
            >
              <span className="tabular-nums">{r.a} ×</span>
              <span className="tabular-nums">{stripZeros(r.b)}</span>
              <span className={unitColor(good)}>m</span>
              <span>=</span>
              <input
                value={answers[i] ?? ""}
                onChange={(e) => setAnswer(i, e.target.value)}
                inputMode="decimal"
                className={`w-24 bg-transparent text-center outline-none border-b border-dotted ${inputUnderline(
                  good
                )}`}
                placeholder=""
              />
              <span className={unitColor(good)}>m</span>
            </div>
          );
        })}
      </div>
      {/* No local Controllers/Hint/Check—global toolbar uses the exposed controls */}
    </div>
  );
};

export default ArrType_51;
