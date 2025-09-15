
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useEffect, useState } from "react";
import useResultTracker from "@/hooks/useResultTracker";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import { useQuestionControls } from "@/context/QuestionControlsContext";

/** ─────────────────────────────────────────────────────────
 * Wrapper: choose which variant to render
 * method = 1 → ArrTypeFourteenV1
 * method = 2 → ArrTypeFourteenV2
 * You can pass it as a prop, read from URL/search, etc.
 * Default is 1 below; change as you like.
 * ───────────────────────────────────────────────────────── */
export default function ArrType_14({ data: groupedQuestions, method }: { data: Question[][]; method?: 1 | 2 }) {
  return method === 1 ? <ArrTypeFourteenV1 /> : <ArrTypeFourteenV2 />;
}

/** ─────────────────────────────────────────────────────────
 * Variant 1 (your first commented component)
 * One blank per equation; summary + hint + controllers
 * ───────────────────────────────────────────────────────── */
type Question = { left: number; operator: "+" | "-"; right: number; answer: number };

// const groupedQuestions: Question[][] = [
//   [
//     { left: 9, operator: "+", right: 4, answer: 13 },
//     { left: 3, operator: "+", right: 5, answer: 8 },
//     { left: 10, operator: "-", right: 8, answer: 2 },
//     { left: 8, operator: "-", right: 5, answer: 3 },
//   ],
//   [
//     { left: 5, operator: "+", right: 4, answer: 9 },
//     { left: 3, operator: "+", right: 5, answer: 8 },
//     { left: 10, operator: "-", right: 8, answer: 2 },
//     { left: 8, operator: "-", right: 5, answer: 3 },
//   ],
//   [
//     { left: 5, operator: "+", right: 4, answer: 9 },
//     { left: 3, operator: "+", right: 5, answer: 8 },
//     { left: 10, operator: "-", right: 8, answer: 2 },
//     { left: 8, operator: "-", right: 5, answer: 3 },
//   ],
//   [
//     { left: 5, operator: "+", right: 4, answer: 9 },
//     { left: 3, operator: "+", right: 5, answer: 8 },
//     { left: 10, operator: "-", right: 8, answer: 2 },
//     { left: 8, operator: "-", right: 5, answer: 3 },
//   ],
// ];

const hintV1 = "Try to add the numbers step by step.";

function ArrTypeFourteenV1() {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [checkAnswers, setCheckAnswers] = useState(false);
  const [status, setStatus] = useState<"" | "match" | "wrong">("");
  const [showHint, setShowHint] = useState(false);
  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  const keyFor = (col: number, row: number) => `${col}-${row}`;

  const handleChange = (key: string, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    setCheckAnswers(false);
    setStatus("");
  };

  const computeAllCorrect = (state: Record<string, string>) => {
    let allFilled = true;
    let allCorrect = true;
    groupedQuestions.forEach((col, cIdx) =>
      col.forEach((q, rIdx) => {
        const k = keyFor(cIdx, rIdx);
        const val = state[k];
        if (!val || val.trim() === "") allFilled = false;
        if (Number(val) !== q.answer) allCorrect = false;
      })
    );
    return allFilled && allCorrect;
  };

  const handleCheckAll = () => {
    setCheckAnswers(true);
    const ok = computeAllCorrect(inputs);
    setStatus(ok ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, ok);
  };

  const handleShowSolutionAll = () => {
    const filled: Record<string, string> = {};
    groupedQuestions.forEach((col, cIdx) =>
      col.forEach((q, rIdx) => {
        filled[keyFor(cIdx, rIdx)] = String(q.answer);
      })
    );
    setInputs(filled);
    setCheckAnswers(true);
    setStatus("match");
  };

  const summary =
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
      : null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-12 p-6">
        {groupedQuestions.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-6">
            {col.map((q, rowIndex) => {
              const key = keyFor(colIndex, rowIndex);
              const userValue = inputs[key] || "";
              const isCorrect = Number(userValue) === q.answer;
              return (
                <div key={key} className="flex items-center gap-2 text-lg font-medium">
                  <span>{q.left}</span>
                  <span>{q.operator}</span>
                  <span>{q.right}</span>
                  <span>=</span>
                  <input
                    type="text"
                    value={userValue}
                    onChange={(e) => handleChange(key, e.target.value.replace(/[^0-9]/g, ""))}
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

      <Controllers
        handleCheck={handleCheckAll}
        handleShowSolution={handleShowSolutionAll}
        handleShowHint={() => setShowHint((p) => !p)}
      />
      {showHint && <Hint hint={hintV1} />}
      <Check summary={summary} />
    </div>
  );
}

/** ─────────────────────────────────────────────────────────
 * Variant 2 (your second component)
 * Two blanks per row; arithmetic-only checking
 * ───────────────────────────────────────────────────────── */
type Op = "+" | "-";
type ColSpec = { left: number; op: Op; rows: number };

const COLS: ColSpec[] = [
  { left: 13, op: "+", rows: 4 }, 
  { left: 15, op: "+", rows: 4 },
  { left: 19, op: "-", rows: 4 },
  { left: 18, op: "-", rows: 4 },
];

const keyForV2 = (c: number, r: number, which: "right" | "result") => `${c}-${r}-${which}`;
const toNum = (v: string) => (v.trim() === "" ? NaN : Number(v));
const hintV2 = "Try to add or subtract the numbers step by step.";

function ArrTypeFourteenV2() {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<"" | "match" | "wrong">("");
  const [showHint, setShowHint] = useState(false);
  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  const onEdit = (k: string, v: string) => {
    setInputs((p) => ({ ...p, [k]: v }));
    setChecked(false);
    setStatus("");
  };

  const isRowCorrect = (left: number, op: Op, rightStr: string, resultStr: string) => {
    const b = toNum(rightStr);
    const r = toNum(resultStr);
    if (Number.isNaN(b) || Number.isNaN(r)) return false;
    const calc = op === "+" ? left + b : left - b;
    return calc === r;
  };

  const handleCheck = () => {
    setChecked(true);
    let allFilled = true;
    let allOK = true;

    COLS.forEach((col, ci) => {
      for (let ri = 0; ri < col.rows; ri++) {
        const kR = keyForV2(ci, ri, "right");
        const kRes = keyForV2(ci, ri, "result");
        const vr = inputs[kR]?.trim() ?? "";
        const vres = inputs[kRes]?.trim() ?? "";
        if (vr === "" || vres === "") allFilled = false;
        if (!isRowCorrect(col.left, col.op, vr, vres)) allOK = false;
      }
    });

    const ok = allFilled && allOK;
    setStatus(ok ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, ok);
  };

  const handleShowSolution = () => {
    const filled: Record<string, string> = {};
    COLS.forEach((col, ci) => {
      for (let ri = 0; ri < col.rows; ri++) {
        const b = Math.min(ri + 1, col.op === "-" ? col.left - 1 : ri + 1);
        const r = col.op === "+" ? col.left + b : col.left - b;
        filled[keyForV2(ci, ri, "right")] = String(b);
        filled[keyForV2(ci, ri, "result")] = String(r);
      }
    });
    setInputs(filled);
    setChecked(true);
    // setStatus("match");
  };

  const summary =
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
      : null;

      

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-12 p-4">
        {COLS.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-6">
            {Array.from({ length: col.rows }).map((_, ri) => {
              const kRight = keyForV2(ci, ri, "right");
              const kResult = keyForV2(ci, ri, "result");
              const vRight = inputs[kRight] ?? "";
              const vResult = inputs[kResult] ?? "";
              const rowOK = checked && isRowCorrect(col.left, col.op, vRight, vResult);

              return (
                <div key={ri} className="flex items-center gap-2 text-lg">
                  <span>{col.left}</span>
                  <span className="font-semibold">{col.op}</span>
                  <input
                    value={vRight}
                    onChange={(e) => onEdit(kRight, e.target.value.replace(/[^0-9]/g, ""))}
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
                    onChange={(e) => onEdit(kResult, e.target.value.replace(/[^0-9]/g, ""))}
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

      <Controllers
        handleCheck={handleCheck}
        handleShowSolution={handleShowSolution}
        handleShowHint={() => setShowHint((p) => !p)}
      />
      {showHint && <Hint hint={hintV2} />}
      <Check summary={summary} />
    </div>
  );
}
