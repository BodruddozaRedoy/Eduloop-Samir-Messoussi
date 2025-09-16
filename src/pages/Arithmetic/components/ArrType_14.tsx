import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────
 * Types shared by variants
 * ───────────────────────────────────────────────────────── */
type Op = "+" | "-";
export type Question = { left: number; operator: Op; right: number; answer: number };
export type ColSpec = { left: number; op: Op; rows: number };

/* ─────────────────────────────────────────────────────────
 * Default (dummy) data & hints — used by the parent as defaults
 * ───────────────────────────────────────────────────────── */
const DEFAULT_V1_DATA: Question[][] = [
  [
    { left: 9, operator: "+", right: 4, answer: 13 },
    { left: 3, operator: "+", right: 5, answer: 8 },
    { left: 10, operator: "-", right: 8, answer: 2 },
    { left: 8, operator: "-", right: 5, answer: 3 },
  ],
  [
    { left: 5, operator: "+", right: 4, answer: 9 },
    { left: 3, operator: "+", right: 5, answer: 8 },
    { left: 10, operator: "-", right: 8, answer: 2 },
    { left: 8, operator: "-", right: 5, answer: 3 },
  ],
  [
    { left: 5, operator: "+", right: 4, answer: 9 },
    { left: 3, operator: "+", right: 5, answer: 8 },
    { left: 10, operator: "-", right: 8, answer: 2 },
    { left: 8, operator: "-", right: 5, answer: 3 },
  ],
  [
    { left: 5, operator: "+", right: 4, answer: 9 },
    { left: 3, operator: "+", right: 5, answer: 8 },
    { left: 10, operator: "-", right: 8, answer: 2 },
    { left: 8, operator: "-", right: 5, answer: 3 },
  ],
];

const DEFAULT_V2_COLS: ColSpec[] = [
  { left: 13, op: "+", rows: 4 },
  { left: 15, op: "+", rows: 4 },
  { left: 19, op: "-", rows: 4 },
  { left: 18, op: "-", rows: 4 },
];

const DEFAULT_HINT_V1 = "Try to add or subtract the numbers step by step.";
const DEFAULT_HINT_V2 = "Think about the operation, fill both blanks so the equation is true.";

/* ─────────────────────────────────────────────────────────
 * PARENT: choose which variant to render (method = 1 or 2)
 * - Uses default props (dummy data + hints) if none are passed
 * - Passes data & hint down to the selected child
 * ───────────────────────────────────────────────────────── */
export default function ArrType_14({
  method = 1,
  dataV1 = DEFAULT_V1_DATA,
  dataV2 = DEFAULT_V2_COLS,
  hintV1 = DEFAULT_HINT_V1,
  hintV2 = DEFAULT_HINT_V2,
}: {
  method?: 1 | 2;
  /** Data for Method 1 (grid of single-answer equations) */
  dataV1?: Question[][];
  /** Data for Method 2 (column spec: left/op with 2 blanks per row) */
  dataV2?: ColSpec[];
  /** Hint strings (shown via your Controllers/Hint UI through context) */
  hintV1?: string;
  hintV2?: string;
}) {
  return method === 1 ? (
    <ArrTypeFourteenV1 data={dataV1} hint={hintV1} />
  ) : (
    <ArrTypeFourteenV2 cols={dataV2} hint={hintV2} />
  );
}

/* ─────────────────────────────────────────────────────────
 * Variant 1: One blank per equation; summary + hint via context
 * ───────────────────────────────────────────────────────── */
function ArrTypeFourteenV1({
  data,
  hint,
}: {
  data: Question[][];
  hint: string;
}) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [checkAnswers, setCheckAnswers] = useState(false);
  const [status, setStatus] = useState<"" | "match" | "wrong">("");
  const [showHint, setShowHint] = useState(false);
  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  const { setControls } = useQuestionControls();

  const keyFor = useCallback((col: number, row: number) => `${col}-${row}`, []);

  const handleChange = useCallback((key: string, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    setCheckAnswers(false);
    setStatus("");
  }, []);

  const computeAllCorrect = useCallback(
    (state: Record<string, string>) => {
      let allFilled = true;
      let allCorrect = true;
      data.forEach((col, cIdx) =>
        col.forEach((q, rIdx) => {
          const k = keyFor(cIdx, rIdx);
          const val = state[k];
          if (!val || val.trim() === "") allFilled = false;
          if (Number(val) !== q.answer) allCorrect = false;
        })
      );
      return allFilled && allCorrect;
    },
    [data, keyFor]
  );

  const handleCheck = useCallback(() => {
    setCheckAnswers(true);
    const ok = computeAllCorrect(inputs);
    setStatus(ok ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, ok);
  }, [inputs, computeAllCorrect, addResult, qId, qTitle]);


  const handleShowSolution = useCallback(() => {
    const filled: Record<string, string> = {};
    data.forEach((col, cIdx) =>
      col.forEach((q, rIdx) => {
        filled[keyFor(cIdx, rIdx)] = String(q.answer);
      })
    );
    setInputs(filled);
    setCheckAnswers(true);
    setStatus("match");
  }, [data, keyFor]);

  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  const summary = useMemo(
    () =>
      status === "match"
        ? {
            text: "🎉 All Correct! Great job",
            color: "text-green-600",
            bgColor: "bg-green-100",
            borderColor: "border-green-600",
          }
        : status === "wrong"
        ? {
            text: "❌ Some answers are wrong. Check again.",
            color: "text-red-600",
            bgColor: "bg-red-100",
            borderColor: "border-red-600",
          }
        : null,
    [status]
  );

  // Stable controls object + guarded setControls to avoid loops
  const controls = useMemo(
    () => ({
      handleCheck,
      handleShowHint,
      handleShowSolution,
      hint,
      showHint,
      summary,
    }),
    [handleCheck, handleShowHint, handleShowSolution, hint, showHint, summary]
  );
  const lastControlsRef = useRef<typeof controls | null>(null);
  useEffect(() => {
    if (lastControlsRef.current !== controls) {
      lastControlsRef.current = controls;
      setControls(controls);
    }
  }, [controls, setControls]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-12 p-6">
        {data.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-6">
            {col.map((q, rowIndex) => {
              const k = keyFor(colIndex, rowIndex);
              const userValue = inputs[k] || "";
              const isCorrect = Number(userValue) === q.answer;
              return (
                <div key={k} className="flex items-center gap-2 text-lg font-medium">
                  <span>{q.left}</span>
                  <span>{q.operator}</span>
                  <span>{q.right}</span>
                  <span>=</span>
                  <input
                    type="text"
                    value={userValue}
                    onChange={(e) =>
                      handleChange(k, e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className={`border-b border-dashed w-16 text-center focus:outline-none
                      ${
                        checkAnswers
                          ? isCorrect
                            ? "border-green-500 text-green-600"
                            : "border-red-500 text-red-600"
                          : "border-primary"
                      }`}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Optional: if this page itself renders Controllers/Hint/Check locally
          (usually they live in a common layout reading from context) */}
      {/* <div className="mt-4">
        <Controllers
          handleCheck={handleCheck}
          handleShowSolution={handleShowSolution}
          handleShowHint={handleShowHint}
        />
        {showHint && <Hint hint={hint} />}
        <Check summary={summary} />
      </div> */}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
 * Variant 2: Two blanks per row (right and result); arithmetic-only checking
 * ───────────────────────────────────────────────────────── */
function ArrTypeFourteenV2({
  cols,
  hint,
}: {
  cols: ColSpec[];
  hint: string;
}) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<"" | "match" | "wrong">("");
  const [showHint, setShowHint] = useState(false);
  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  const { setControls } = useQuestionControls();

  const keyFor = useCallback(
    (c: number, r: number, which: "right" | "result") => `${c}-${r}-${which}`,
    []
  );
  const toNum = (v: string) => (v.trim() === "" ? NaN : Number(v));

  const isRowCorrect = useCallback((left: number, op: Op, rightStr: string, resultStr: string) => {
    const b = toNum(rightStr);
    const r = toNum(resultStr);
    if (Number.isNaN(b) || Number.isNaN(r)) return false;
    const calc = op === "+" ? left + b : left - b;
    return calc === r;
  }, []);

  const onEdit = useCallback((k: string, v: string) => {
    setInputs((p) => ({ ...p, [k]: v }));
    setChecked(false);
    setStatus("");
  }, []);

  const handleCheck = useCallback(() => {
    setChecked(true);
    let allFilled = true;
    let allOK = true;

    cols.forEach((col, ci) => {
      for (let ri = 0; ri < col.rows; ri++) {
        const kR = keyFor(ci, ri, "right");
        const kRes = keyFor(ci, ri, "result");
        const vr = inputs[kR]?.trim() ?? "";
        const vres = inputs[kRes]?.trim() ?? "";
        if (vr === "" || vres === "") allFilled = false;
        if (!isRowCorrect(col.left, col.op, vr, vres)) allOK = false;
      }
    });

    const ok = allFilled && allOK;
    setStatus(ok ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, ok);
  }, [cols, inputs, keyFor, isRowCorrect, addResult, qId, qTitle]);


  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  const handleShowSolution = useCallback(() => {
    const filled: Record<string, string> = {};
    cols.forEach((col, ci) => {
      for (let ri = 0; ri < col.rows; ri++) {
        const b = Math.min(ri + 1, col.op === "-" ? col.left - 1 : ri + 1);
        const r = col.op === "+" ? col.left + b : col.left - b;
        filled[keyFor(ci, ri, "right")] = String(b);
        filled[keyFor(ci, ri, "result")] = String(r);
      }
    });
    setInputs(filled);
    setChecked(true);

    // leave status unchanged so Controllers banner behavior is consistent
  }, [cols, keyFor]);

  const summary = useMemo(
    () =>
      status === "match"
        ? {
            text: "🎉 All Correct! Great job",
            color: "text-green-600",
            bgColor: "bg-green-100",
            borderColor: "border-green-600",
          }
        : status === "wrong"
        ? {
            text: "❌ Some answers are wrong. Check again.",
            color: "text-red-600",
            bgColor: "bg-red-100",
            borderColor: "border-red-600",
          }
        : null,
    [status]
  );

  // Stable controls + guarded setControls
  const controls = useMemo(
    () => ({
      handleCheck,
      handleShowHint,
      handleShowSolution,
      hint,
      showHint,
      summary,
    }),
    [handleCheck, handleShowHint, handleShowSolution, hint, showHint, summary]
  );
  const lastControlsRef = useRef<typeof controls | null>(null);
  useEffect(() => {
    if (lastControlsRef.current !== controls) {
      lastControlsRef.current = controls;
      setControls(controls);
    }
  }, [controls, setControls]);

      

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-12 p-4">
        {cols.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-6">
            {Array.from({ length: col.rows }).map((_, ri) => {
              const kRight = keyFor(ci, ri, "right");
              const kResult = keyFor(ci, ri, "result");
              const vRight = inputs[kRight] ?? "";
              const vResult = inputs[kResult] ?? "";
              const rowOK =
                checked && isRowCorrect(col.left, col.op, vRight, vResult);

              return (
                <div key={ri} className="flex items-center gap-2 text-lg">
                  <span>{col.left}</span>
                  <span className="font-semibold">{col.op}</span>
                  <input
                    value={vRight}
                    onChange={(e) =>
                      onEdit(kRight, e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className={`w-16 text-center border-b border-dashed focus:outline-none
                      ${
                        checked
                          ? rowOK
                            ? "border-green-500 text-green-600"
                            : "border-red-500 text-red-600"
                          : "border-primary"
                      }`}
                    placeholder="……"
                  />
                  <span className="font-semibold">=</span>
                  <input
                    value={vResult}
                    onChange={(e) =>
                      onEdit(kResult, e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className={`w-20 text-center border-b border-dashed focus:outline-none
                      ${
                        checked
                          ? rowOK
                            ? "border-green-500 text-green-600"
                            : "border-red-500 text-red-600"
                          : "border-primary"
                      }`}
                    placeholder="……"
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Optional local controls (usually global via layout) */}
      {/* <div className="mt-4">
        <Controllers
          handleCheck={handleCheck}
          handleShowSolution={handleShowSolution}
          handleShowHint={handleShowHint}
        />
        {showHint && <Hint hint={hint} />}
        <Check summary={summary} />
      </div> */}
    </div>
  );
}
