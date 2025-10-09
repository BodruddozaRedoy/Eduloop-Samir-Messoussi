import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* --------------------------------
   Types & defaults
--------------------------------- */
export type Row = { a: number; b: number };

type Props = {
  data?: Row[];  // we will normalize & use first 6
  hint?: string;
};

const DEMO_ROWS: Row[] = [
  { a: 4, b: 35 },
  { a: 6, b: 25 },
  { a: 8, b: 15 },
  { a: 12, b: 45 },
  { a: 3, b: 40 },
  { a: 10, b: 17 },
];

const DEFAULT_HINT =
  "Halve one factor and double the other to keep the product the same. Example: 4×35 → 2×70 → 140.";

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

const parseNum = (v: string) => {
  const n = parseFloat((v ?? "").toString().replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
};

/** One halving/doubling step (prefer halving an even factor). */
function oneStep(a: number, b: number) {
  if (a % 2 === 0) return { a2: a / 2, b2: b * 2, prod: a * b };
  if (b % 2 === 0) return { a2: a * 2, b2: b / 2, prod: a * b };
  return { a2: a, b2: b, prod: a * b };
}

/** Normalize parent data to a clean Row[] of finite numbers. */
function normalizeRows(input: unknown): Row[] {
  if (!Array.isArray(input)) return DEMO_ROWS;
  const rows = (input as any[]).map((r) => ({
    a: Number((r ?? {}).a),
    b: Number((r ?? {}).b),
  }));
  const valid = rows.filter((r) => Number.isFinite(r.a) && Number.isFinite(r.b));
  return valid.length ? valid : DEMO_ROWS;
}

/* --------------------------------
   Component
--------------------------------- */
const ArrType_45: React.FC<Props> = ({ data, hint }) => {
  // Ensure exactly 2 columns × 3 rows. Slice to first 6.
  const allRows = useMemo(() => normalizeRows(data).slice(0, 6), [data]);
  const ROWS_PER_COL = 3;
  const columns = useMemo(
    () => [allRows.slice(0, ROWS_PER_COL), allRows.slice(ROWS_PER_COL, ROWS_PER_COL * 2)],
    [allRows]
  );

  const helpText = hint ?? DEFAULT_HINT;

  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [checked, setChecked] = useState(false);

  // user inputs per row (global index across both columns)
  const [answers, setAnswers] = useState<
    { a2: string; b2: string; prod: string }[]
  >(() => allRows.map(() => ({ a2: "", b2: "", prod: "" })));

  const [oks, setOks] = useState<
    { a2: boolean; b2: boolean; prod: boolean }[]
  >(() => allRows.map(() => ({ a2: false, b2: false, prod: false })));

  // Reset when rows change (content or count)
  useEffect(() => {
    setAnswers(allRows.map(() => ({ a2: "", b2: "", prod: "" })));
    setOks(allRows.map(() => ({ a2: false, b2: false, prod: false })));
    setChecked(false);
    setStatus("idle");
    setShowHint(false);
  }, [allRows]);

  const setAnswer = useCallback(
    (i: number, field: "a2" | "b2" | "prod", value: string) => {
      setAnswers((prev) => {
        const cp = [...prev];
        cp[i] = { ...cp[i], [field]: value };
        return cp;
      });
    },
    []
  );

  const { addResult } = useResultTracker()
  const { id: qId, title: qTitle } = useQuestionMeta()

  const handleCheck = useCallback(() => {
    const results = allRows.map((row, i) => {
      const { a2, b2, prod } = oneStep(row.a, row.b);
      const ga2 = parseNum(answers[i].a2);
      const gb2 = parseNum(answers[i].b2);
      const gprod = parseNum(answers[i].prod);
      return {
        a2: Number.isFinite(ga2) && Math.abs(ga2 - a2) < 0.01,
        b2: Number.isFinite(gb2) && Math.abs(gb2 - b2) < 0.01,
        prod: Number.isFinite(gprod) && Math.abs(gprod - prod) < 0.01,
      };
    });

    setOks(results);
    setChecked(true);
    setStatus(results.every((r) => r.a2 && r.b2 && r.prod) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, results.every((r) => r.a2 && r.b2 && r.prod))
  }, [answers, allRows]);

  const handleShowSolution = useCallback(() => {
    setAnswers(
      allRows.map((row) => {
        const s = oneStep(row.a, row.b);
        return { a2: String(s.a2), b2: String(s.b2), prod: String(s.prod) };
      })
    );
    setOks(allRows.map(() => ({ a2: true, b2: true, prod: true })));
    setChecked(true);
    setStatus("match");
  }, [allRows]);

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

  // Expose to GLOBAL Controllers/Hint/Check (IMPORTANT: avoid functional set)
  const { setControls } = useQuestionControls();
  const controls = useMemo(
    () => ({
      handleCheck,
      handleShowHint,
      handleShowSolution,
      hint: helpText,
      showHint,
      summary,
    }),
    [handleCheck, handleShowHint, handleShowSolution, helpText, showHint, summary]
  );
  useEffect(() => {
    // Calling setControls with the memoized object avoids infinite loops
    setControls(controls);
  }, [controls, setControls]);

  const fieldCls = (ok: boolean) =>
    !checked
      ? "border-slate-400 text-slate-900"
      : ok
        ? "border-emerald-400 text-emerald-600"
        : "border-rose-400 text-rose-600";

  return (
    <div className="space-y-4">

      {/* Exactly two columns, three rows each */}
      <div className="grid grid-cols-1 gap-x-12 gap-y-3 md:grid-cols-2">
        {columns.map((colRows, col) => (
          <div key={col} className="space-y-3">
            {colRows.map((row, r) => {
              const idx = col * ROWS_PER_COL + r; // 0..5 global index

              return (
                <div
                  key={`${row.a}x${row.b}-${idx}`}
                  className="flex flex-wrap items-center gap-2 text-[15px] leading-none text-slate-900"
                >
                  <span className="tabular-nums">
                    {row.a} × {row.b} =
                  </span>

                  <input
                    value={answers[idx].a2}
                    onChange={(e) => setAnswer(idx, "a2", e.target.value)}
                    inputMode="numeric"
                    className={`w-10 bg-transparent text-center outline-none border-b border-dotted ${fieldCls(
                      oks[idx].a2
                    )}`}
                  />
                  <span>×</span>

                  <input
                    value={answers[idx].b2}
                    onChange={(e) => setAnswer(idx, "b2", e.target.value)}
                    inputMode="numeric"
                    className={`w-12 bg-transparent text-center outline-none border-b border-dotted ${fieldCls(
                      oks[idx].b2
                    )}`}
                  />
                  <span>=</span>

                  <input
                    value={answers[idx].prod}
                    onChange={(e) => setAnswer(idx, "prod", e.target.value)}
                    inputMode="numeric"
                    className={`w-14 bg-transparent text-center outline-none border-b border-dotted ${fieldCls(
                      oks[idx].prod
                    )}`}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {/* No local Controllers/Hint/Check — global toolbar uses the exposed controls */}
    </div>
  );
};

export default ArrType_45;
