// ArrType_17.tsx
// Developers: At the top you will find `demoHint` and `demoItems` (default props).
// `ArrType_17` takes two props: `items` (data array) and `hint` (string).


import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";


/* =========================================================================
   DEFAULT HINT + DEMO DATA (for testing)
============================================================================ */
export const demoHint = "Fill the boxes by counting in increments of 1, 10, or 100.";

type StepRowM2 = {
  label: string;
  center: number;
  step: number;
  cellsEachSide?: number;
};

type Arr17Item =
  | {
      id: string | number;
      method: 1;
      rows: number[][];
      order?: "asc" | "desc";
    }
  | {
      id: string | number;
      method: 2;
      rows: StepRowM2[];
    };

export const demoItems: Arr17Item[] = [
  {
    id: "1",
    method: 1,
    rows: [
      [700, 200, 800, 100, 400],
      [640, 240, 460, 360, 100],
      [850, 520, 720, 270, 910],
    ],
    order: "asc",
  },
  {
    id: "2",
    method: 2,
    rows: [
      { label: "in increments of 1", center: 758, step: 1 },
      { label: "in increments of 10", center: 825, step: 10 },
      { label: "in increments of 100", center: 441, step: 100 },
    ],
  },
];

/* =========================================================================
   PARENT COMPONENT
============================================================================ */
export default function ArrType_17({
  items = demoItems,
  hint = demoHint,
}: {
  items?: Arr17Item[];
  hint?: string;
}) {
  const item = items[0];
  if (!item) return null;

  if (item.method === 1) {
    const m1: DataM1 = {
      id: Number(item.id) || 0,
      question: "From small to large.",
      order: item.order ?? "asc",
      rows: item.rows,
    };
    return (
      <div className="space-y-8">
        <ArrTypeSeventeenMethodOne
          key={`m1-${item.id}`}
          problem={m1}
          hint={hint}
        />
      </div>
    );
  }

  const m2: DataM2 = {
    id: Number(item.id) || 0,
    question: "Write down the number. Count forwards and backwards.",
    rows: item.rows,
  };
  return (
    <div className="space-y-8">
      <ArrTypeSeventeenMethodtwo key={`m2-${item.id}`} problem={m2} hint={hint} />
    </div>
  );
}

/* =========================================================================
   METHOD 1 — Sort numbers
============================================================================ */
export type DataM1 = {
  id: number;
  question: string;
  order: "asc" | "desc";
  rows: number[][];
};

function InputPillM1({
  value,
  onChange,
  checked,
  correct,
  widthClass = "min-w-[80px]",
}: {
  value: string;
  onChange: (v: string) => void;
  checked?: boolean;
  correct?: boolean;
  widthClass?: string;
}) {
  const border = checked
    ? correct
      ? "border-emerald-600 text-emerald-700"
      : "border-rose-500 text-rose-700"
    : "border-emerald-600 text-slate-800";
  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
      className={`rounded-sm border-2 bg-white px-3 py-2 text-center text-xl font-semibold font-mono tabular-nums ${border} ${widthClass}`}
    />
  );
}

function Pill({
  value,
  color = "orange",
  widthClass = "min-w-[72px]",
}: {
  value?: number | string;
  color?: "orange" | "green";
  widthClass?: string;
}) {
  const theme =
    color === "orange"
      ? "border-orange-500 text-slate-800"
      : "border-emerald-600 text-emerald-700";
  return (
    <div
      className={`rounded-sm border-2 bg-white px-3 py-1 text-xl font-semibold font-mono tabular-nums ${theme} ${widthClass} text-center`}
    >
      {value ?? ""}
    </div>
  );
}

export function ArrTypeSeventeenMethodOne({
  problem,
  hint,
}: {
  problem: DataM1;
  hint: string;
}) {
  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();


  const answers = useMemo(() => {
    const cmp =
      problem.order === "asc"
        ? (a: number, b: number) => a - b
        : (a: number, b: number) => b - a;
    return problem.rows.map((row) => [...row].sort(cmp));
  }, [problem]);

  const [inputs, setInputs] = useState<string[][]>(() =>
    problem.rows.map((row) => Array(row.length).fill(""))
  );
  const [checked, setChecked] = useState(false);
  const [correctMap, setCorrectMap] = useState<boolean[][]>(() =>
    problem.rows.map((row) => row.map(() => false))
  );
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<"idle" | "match" | "wrong">("idle");

  const setCell = useCallback((r: number, c: number, v: string) => {
    setInputs((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[r][c] = v;
      return copy;
    });
  }, []);

  const handleCheck = useCallback(() => {
    let allFilled = true;
    let allCorrect = true;

    const nextCorrect = inputs.map((row, rIdx) =>
      row.map((val, cIdx) => {
        if (val.trim() === "") allFilled = false;
        const ok = val.trim() !== "" && Number(val) === answers[rIdx][cIdx];
        if (!ok) allCorrect = false;
        return ok;
      })
    );

    setCorrectMap(nextCorrect);
    setChecked(true);
    const ok = allFilled && allCorrect;
    setStatus(ok ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, ok);
  }, [inputs, answers, addResult, qId, qTitle]);

  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);
  const handleShowSolution = useCallback(() => {
    setInputs(answers.map((row) => row.map(String)));

    setCorrectMap(answers.map((row) => row.map(() => true)));
    setChecked(true);
  }, [answers]);

  const summary = useMemo(
    () =>
      status === "match"
        ? { text: "🎉 All Correct! Great job", color: "text-green-600", bgColor: "bg-green-100", borderColor: "border-green-600" }
        : status === "wrong"
        ? { text: "❌ Some answers are wrong. Check again.", color: "text-red-600", bgColor: "bg-red-100", borderColor: "border-red-600" }
        : null,
    [status]
  );

  const controls = useMemo(
    () => ({ handleCheck, handleShowHint, handleShowSolution, hint, showHint, summary }),
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
    <div className="">
      <h2 className="text-lg font-semibold">Question 1</h2>
      <p className="mb-4 text-sm text-slate-600">{problem.question}</p>
      <div className="space-y-4">
        {problem.rows.map((row, rIdx) => (
          <div key={rIdx} className="rounded-2xl bg-amber-50/60 p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {row.map((n, i) => (
                  <Pill key={i} value={n} color="orange" />
                ))}
              </div>
              <span className="text-2xl font-bold text-slate-700">→</span>
              <div className="flex items-center gap-2">
                {row.map((_n, cIdx) => (
                  <InputPillM1
                    key={cIdx}
                    value={inputs[rIdx][cIdx]}
                    onChange={(v) => setCell(rIdx, cIdx, v)}
                    checked={checked}
                    correct={checked && correctMap[rIdx][cIdx]}
                    widthClass="w-36"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   METHOD 2 — Count backwards/forwards
============================================================================ */
export type DataM2 = { id: number; question: string; rows: StepRowM2[] };

function InputPillM2({
  value,
  onChange,
  checked,
  correct,
  widthClass = "min-w-[80px]",
}: {
  value: string;
  onChange: (v: string) => void;
  checked?: boolean;
  correct?: boolean;
  widthClass?: string;
}) {
  const border = checked
    ? correct
      ? "border-emerald-600 text-emerald-700"
      : "border-rose-500 text-rose-700"
    : "border-emerald-600 text-slate-800";
  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9-]/g, ""))}
      className={`rounded-sm border-2 bg-white px-2 py-1 text-center text-xl font-semibold font-mono tabular-nums ${border} ${widthClass}`}
    />
  );
}

export function ArrTypeSeventeenMethodtwo({
  problem,
  hint,
}: {
  problem: DataM2;
  hint: string;
}) {
  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  const { setControls } = useQuestionControls();


  const expectedRows = useMemo(() => {
    return problem.rows.map((r) => {
      const cells = r.cellsEachSide ?? 4;
      const arr: number[] = [];
      for (let i = -cells; i <= cells; i++) arr.push(r.center + i * r.step);
      return arr;
    });
  }, [problem]);

  const [inputs, setInputs] = useState<string[][]>(() =>
    expectedRows.map((row) =>
      row.map((val, i, a) => (i === Math.floor(a.length / 2) ? String(val) : ""))
    )
  );
  const [checked, setChecked] = useState(false);
  const [correctMap, setCorrectMap] = useState<boolean[][]>(() =>
    expectedRows.map((row) => row.map((_v, i) => i === Math.floor(row.length / 2)))
  );
  const [lastAction, setLastAction] = useState<"check" | "solution" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<"idle" | "match" | "wrong">("idle");

  const setCell = useCallback((r: number, c: number, v: string) => {
    setInputs((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[r][c] = v;
      return copy;
    });
  }, []);

  const handleCellChange = useCallback(
    (r: number, c: number, v: string) => {
      const centerIdx = Math.floor(inputs[r].length / 2);
      if (c === centerIdx) return;
      setCell(r, c, v);
      setChecked(false);
      setLastAction(null);
      setStatus("idle");
    },
    [inputs, setCell]
  );

  const handleCheck = useCallback(() => {
    let allFilled = true;
    let allCorrect = true;

    const nextCorrect = inputs.map((row, rIdx) => {
      const exp = expectedRows[rIdx];
      const centerIdx = Math.floor(row.length / 2);
      return row.map((val, i) => {
        if (i === centerIdx) return true;
        if (val.trim() === "") {
          allFilled = false;
          allCorrect = false;
          return false;
        }
        const ok = Number(val) === exp[i];
        if (!ok) allCorrect = false;
        return ok;
      });
    });

    setCorrectMap(nextCorrect);
    setChecked(true);
    const ok = allFilled && allCorrect;
    setStatus(ok ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, ok);
    setLastAction("check");
  }, [inputs, expectedRows, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    setInputs(expectedRows.map((row) => row.map(String)));
    setCorrectMap(expectedRows.map((row) => row.map(() => true)));
    setChecked(true);
    setLastAction("solution");
  }, [expectedRows]);

  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);


  const summary =
    lastAction === "check"
      ? status === "match"
        ? { text: "Correct! Great job.", color: "text-green-700", bgColor: "bg-green-100", borderColor: "border-green-600" }
        : { text: "Some answers are wrong. Try again.", color: "text-red-700", bgColor: "bg-red-100", borderColor: "border-red-600" }
      : null;

  const controls = useMemo(
    () => ({ handleCheck, handleShowHint, handleShowSolution, hint, showHint, summary }),
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
    <div className="">
      <h2 className="text-lg font-semibold">Question 1</h2>
      <p className="mb-4 text-sm text-slate-600">{problem.question}</p>
      <div className="space-y-4">
        {problem.rows.map((row, rIdx) => {
          const exp = expectedRows[rIdx];
          const centerIdx = Math.floor(exp.length / 2);
          return (
            <div key={rIdx} className="rounded-2xl bg-amber-50/60 p-4">
              <p className="mb-2 text-sm text-slate-600">{row.label}</p>
              <div className="grid grid-cols-12 gap-2 items-center">
                {exp.map((_, cIdx) =>
                  cIdx === centerIdx ? (
                    <Pill key={cIdx} value={exp[cIdx]} color="orange" />
                  ) : (
                    <InputPillM2
                      key={cIdx}
                      value={inputs[rIdx][cIdx]}
                      onChange={(v) => handleCellChange(rIdx, cIdx, v)}
                      checked={checked}
                      correct={checked && correctMap[rIdx][cIdx]}
                    />
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
