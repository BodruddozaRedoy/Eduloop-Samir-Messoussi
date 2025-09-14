// ArrTypeSeventeen.tsx
// One-page file that includes your two method components *unchanged in behavior/ui*,
// plus a wrapper that renders the right one based on `method` in the data.

import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useMemo, useState } from "react";
import useResultTracker from "@/hooks/useResultTracker";
import { useQuestionMeta } from "@/context/QuestionMetaContext";


/* ======================================================================
   Shared small UI
====================================================================== */
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

/* ======================================================================
   METHOD 1 — your original code (sorting). Internal logic/design unchanged.
   Only type names are suffixed to avoid collisions in this single file.
====================================================================== */
export type DataM1 = {
  id: number;
  question: string;
  order: "asc" | "desc";
  rows: number[][];
  hint?: string;
};

const hintM1 =
  "Sort the numbers in ascending order (smallest → largest).";

// Input for Method 1 (digits only)
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
    : "border-emerald-600 text-slate-800"; // default green look

  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
      className={`rounded-sm border-2 bg-white px-3 py-2 text-center text-xl font-semibold font-mono tabular-nums ${border} ${widthClass}`}
      placeholder=""
    />
  );
}

export function ArrTypeSeventeenMethodOne({
  problem,
}: {
  problem: DataM1;
}) {
  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
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

  const setCell = (r: number, c: number, v: string) =>
    setInputs((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[r][c] = v;
      return copy;
    });

  const handleCheck = () => {
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
  };

  const handleShowSolution = () => {
    setInputs(answers.map((row) => row.map((n) => String(n))));
    setCorrectMap(answers.map((row) => row.map(() => true)));
    setChecked(true);
    // setStatus("match"); // keep your original behavior
  };

  const summary =
    status === "match"
      ? {
          text: "✅ Sorted correctly!",
          color: "text-green-700",
          bgColor: "bg-green-100",
          borderColor: "border-green-600",
        }
      : status === "wrong"
      ? {
          text: "❌ Some answers are wrong. Try again.",
          color: "text-red-700",
          bgColor: "bg-red-100",
          borderColor: "border-red-600",
        }
      : null;

  return (
    <div className="">
      <h2 className="text-lg font-semibold">Question 1</h2>
      <p className="mb-4 text-sm text-slate-600">{problem.question}</p>

      <div className="space-y-4">
        {problem.rows.map((row, rIdx) => (
          <div key={rIdx} className="rounded-2xl bg-amber-50/60 p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {row.map((n, i) => (
                  <Pill key={i} value={n} color="orange" />
                ))}
              </div>
              <span className="text-2xl font-bold text-slate-700">→</span>
              <div className="flex flex-wrap items-center gap-2">
                {row.map((_n, cIdx) => (
                  <InputPillM1
                    key={cIdx}
                    value={inputs[rIdx][cIdx]}
                    onChange={(v) => setCell(rIdx, cIdx, v)}
                    checked={checked}
                    correct={checked && correctMap[rIdx][cIdx]}
                    widthClass="min-w-[80px]"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="">
        <Controllers
          handleCheck={handleCheck}
          handleShowSolution={handleShowSolution}
          handleShowHint={() => setShowHint((v) => !v)}
        />
        {showHint && <Hint hint={problem.hint ?? hintM1} />}
        <Check summary={summary} />
      </div>
    </div>
  );
}

/* ======================================================================
   METHOD 2 — your original code (count forwards/backwards).
   Internal logic/design unchanged. Type names suffixed only.
====================================================================== */
type StepRowM2 = {
  label: string;     // e.g., "in increments of 1"
  center: number;    // given middle number
  step: number;      // step size
  cellsEachSide?: number; // default 4
};

export type DataM2 = {
  id: number;
  question: string;
  rows: StepRowM2[];
};

const hintM2 =
  "Fill the boxes by counting 4 steps backward and 4 steps forward from the center using the given increment.";

// Input for Method 2 (allow minus)
function InputPillM2({
  value,
  onChange,
  checked,
  correct,
  widthClass = "min-w-[px]",
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
      placeholder=""
    />
  );
}

export function ArrTypeSeventeenMethodtwo({
  problem,
}: {
  problem: DataM2;
}) {
  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
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
      row.map((val, i, a) => {
        const centerIdx = Math.floor(a.length / 2);
        return i === centerIdx ? String(val) : ""; // center shown but not editable
      })
    )
  );

  const [checked, setChecked] = useState(false);
  const [correctMap, setCorrectMap] = useState<boolean[][]>(() =>
    expectedRows.map((row) => row.map((_v, i) => i === Math.floor(row.length / 2)))
  );

  const [lastAction, setLastAction] = useState<"check" | "solution" | null>(
    null
  );
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<"idle" | "match" | "wrong">("idle");

  const setCell = (r: number, c: number, v: string) =>
    setInputs((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[r][c] = v;
      return copy;
    });

  const handleCellChange = (r: number, c: number, v: string) => {
    const centerIdx = Math.floor(inputs[r].length / 2);
    if (c === centerIdx) return;
    setCell(r, c, v);
    setChecked(false);
    setLastAction(null);
    setStatus("idle");
  };

  const handleCheck = () => {
    let allFilled = true;
    let allCorrect = true;

    const nextCorrect = inputs.map((row, rIdx) => {
      const exp = expectedRows[rIdx];
      const centerIdx = Math.floor(row.length / 2);
      return row.map((val, i) => {
        if (i === centerIdx) return true; // given cell always correct
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
  };

  const handleShowSolution = () => {
    setInputs(expectedRows.map((row) => row.map((n) => String(n))));
    setCorrectMap(expectedRows.map((row) => row.map(() => true)));
    setChecked(true);
    // setStatus("match");
    setLastAction("solution"); // summary must not show after solution
  };

  const summary =
    lastAction === "check"
      ? status === "match"
        ? {
            text: "Correct! Great job.",
            color: "text-green-700",
            bgColor: "bg-green-100",
            borderColor: "border-green-600",
          }
        : {
            text: "Some answers are wrong. Try again.",
            color: "text-red-700",
            bgColor: "bg-red-100",
            borderColor: "border-red-600",
          }
      : null;

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

      <div className="mt-4">
        <Controllers
          handleCheck={handleCheck}
          handleShowSolution={() => handleShowSolution()}
          handleShowHint={() => setShowHint((v) => !v)}
        />
        {showHint && <Hint hint={hintM2} />}
        <Check summary={summary} />
      </div>
    </div>
  );
}

/* ======================================================================
   WRAPPER — Renders the correct method based on `method` in data
====================================================================== */
 type Arr17Item =
  | { id: string | number; method: 1; problem: DataM1 }
  | { id: string | number; method: 2; problem: DataM2 };

/* Sample combined data. Replace with your real data list. */
const data: Arr17Item[] = [
  {
    id: "ex-1",
    method: 1,
    problem: {
      id: 1,
      question: "From small to large.",
      order: "asc",
      rows: [
        [700, 200, 800, 100, 400],
        [640, 240, 460, 360, 100],
        [850, 520, 720, 270, 910],
      ],
      hint: hintM1,
    },
  },

  {
    id: "ex-2",
    method: 2,
    problem: {
      id: 1,
      question: "Write down the number. Count forwards and backwards.",
      rows: [
        { label: "in increments of 1", center: 758, step: 1 },
        { label: "in increments of 10", center: 825, step: 10 },
        { label: "in increments of 100", center: 441, step: 100 },
      ],
    },
  },
];



export default function ArrType_17({
  items = data,
}: {
  items?: Arr17Item[];
}) {
  return (
    <div className="space-y-8">
      {
        items[0].method === 1 ? (
          <ArrTypeSeventeenMethodOne
            key={`m1-${items[0].id}`}
            problem={items[0].problem}
          />
        ) : (
          <ArrTypeSeventeenMethodtwo
            key={`m2-${items[0].id}`}
            problem={items[0].problem}
          />
        )
      }
    </div>
  );
}



