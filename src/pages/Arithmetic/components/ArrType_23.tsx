import React, { useState, useCallback, useEffect, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

/* -------------------- Local data (no props yet) -------------------- */
const data = [{ digits: [4, 0, 2, 9] }];
const hint = "👉 Try combining the given digits to make 3-digit numbers under 1000.";

/* --------------------------- UI bits --------------------------- */
const DigitBox = ({ value }: { value: number | string }) => (
  <div className="flex h-12 w-12 items-center justify-center border-2 border-orange-500 bg-white text-lg font-semibold text-slate-800">
    {value}
  </div>
);

const GreenPill = ({ value }: { value: number | string }) => (
  <div className="rounded-sm border-2 border-emerald-600 bg-white px-3 py-2 text-sm font-semibold text-emerald-700 font-mono tabular-nums">
    {value}
  </div>
);

const AmberStrip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="inline-flex flex-wrap gap-3 rounded-2xl bg-amber-50/60 p-4">
    {children}
  </div>
);

type BoxState = "idle" | "ok" | "err";

const PillInput = ({
  value,
  onChange,
  state = "idle",
  placeholder = "",
}: {
  value: string;
  onChange: (v: string) => void;
  state?: BoxState;
  placeholder?: string;
}) => {
  const base =
    "w-20 rounded-sm border-2 bg-white px-3 py-2 text-center font-mono text-sm font-semibold tabular-nums outline-none";
  const color =
    state === "ok"
      ? "border-emerald-600 text-emerald-700 focus:ring-2 focus:ring-emerald-300"
      : state === "err"
      ? "border-red-500 text-red-700 focus:ring-2 focus:ring-red-300"
      : "border-orange-400 text-slate-700 focus:ring-2 focus:ring-orange-300";
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
      placeholder={placeholder}
      inputMode="numeric"
      className={`${base} ${color}`}
    />
  );
};

/* ---------------------- helper: make examples ---------------------- */
function makeThreeDigitExamples(
  digits: (number | string)[],
  count = 6
): number[] {
  const nums = digits.map(Number);
  const out: number[] = [];
  const seen = new Set<number>();
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 0) continue;
    for (let j = 0; j < nums.length; j++) {
      if (j === i) continue;
      for (let k = 0; k < nums.length; k++) {
        if (k === i || k === j) continue;
        const n = nums[i] * 100 + nums[j] * 10 + nums[k];
        if (!seen.has(n)) {
          seen.add(n);
          out.push(n);
          if (out.length >= count) return out;
        }
      }
    }
  }
  return out;
}

/* ------------------------- validation utils ------------------------- */
const digs = (n: number) => n.toString().split("").map(Number);
const onlyFrom = (n: number, allowed: number[]) =>
  digs(n).every((d) => allowed.includes(d));
const noLeadingZero = (n: number) =>
  n.toString().length === 1 || n.toString()[0] !== "0";
const distinct = (n: number) => {
  const ds = digs(n);
  return new Set(ds).size === ds.length;
};
const under1000 = (n: number) =>
  n >= 0 && n < 1000 && n.toString().length <= 3;
const eqArr = (a: number[], b: number[]) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

/* ----------------------------- Page ----------------------------- */
export default function ArrType_23() {
  const title = "Question 1";
  const instruction = "Make 6 numbers under 1000 with these digits. For example,";
  const secondLine = "Arrange in order from smallest to largest";

  const digits = data[0].digits.map(Number);
  const REQUIRED = 6;
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  // Demo solution for "Show Solution"
  const sample = useMemo(() => makeThreeDigitExamples(digits, REQUIRED), [
    digits,
  ]);
  const sampleSorted = useMemo(() => [...sample].sort((a, b) => a - b), [
    sample,
  ]);

  // Inputs
  const [rowCreate, setRowCreate] = useState<string[]>(
    Array(REQUIRED).fill("")
  );
  const [rowArrange, setRowArrange] = useState<string[]>(
    Array(REQUIRED).fill("")
  );

  // Per-box correctness styling (set on Check)
  const [stateCreate, setStateCreate] = useState<BoxState[]>(
    Array(REQUIRED).fill("idle")
  );
  const [stateArrange, setStateArrange] = useState<BoxState[]>(
    Array(REQUIRED).fill("idle")
  );

  // Status drives your summary
  const [status, setStatus] = useState<"idle" | "match" | "wrong">("idle");

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

  const parseRow = (arr: string[]) =>
    arr.map((s) => Number(s)).filter((n) => !Number.isNaN(n));

  const handleShowSolution = () => {
    setRowCreate(sample.map(String));
    setRowArrange(sampleSorted.map(String));
    setStateCreate(Array(REQUIRED).fill("ok"));
    setStateArrange(Array(REQUIRED).fill("ok"));
    setStatus("match");
    setShowSolution(true);
  };

  const handleCheck = () => {
    const nextCreate: BoxState[] = Array(REQUIRED).fill("err");
    const nextArrange: BoxState[] = Array(REQUIRED).fill("err");
    const numsCreate = rowCreate.map((s) => Number(s));
    const numsArrange = rowArrange.map((s) => Number(s));

    let allCreateValid = true;
    for (let i = 0; i < REQUIRED; i++) {
      const n = numsCreate[i];
      const s = rowCreate[i].trim();
      const valid =
        s !== "" && // Check if the field is not empty
        Number.isFinite(n) &&
        under1000(n) &&
        noLeadingZero(n) &&
        onlyFrom(n, digits) &&
        distinct(n);
      nextCreate[i] = valid ? "ok" : "err";
      if (!valid) allCreateValid = false;
    }

    if (!allCreateValid) {
      setStateCreate(nextCreate);
      setStateArrange(Array(REQUIRED).fill("idle"));
      setStatus("wrong");
      return;
    }

    const userNums = numsCreate as number[];
    const wantSorted = [...userNums].sort((a, b) => a - b);

    let allArrangeValid = true;
    for (let i = 0; i < REQUIRED; i++) {
      const n = numsArrange[i];
      const s = rowArrange[i].trim();
      const ok = s !== "" && Number.isFinite(n) && n === wantSorted[i];
      nextArrange[i] = ok ? "ok" : "err";
      if (!ok) allArrangeValid = false;
    }

    setStateCreate(nextCreate);
    setStateArrange(nextArrange);
    setStatus(allArrangeValid ? "match" : "wrong");

    const overallCorrect = allCreateValid && allArrangeValid;
    addResult({ id: qId, title: qTitle }, overallCorrect);
  };

  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  useEffect(() => {
    setControls({
      handleCheck,
      handleShowHint,
      handleShowSolution,
      hint,
      showHint,
      summary,
    });
  }, [
    setControls,
    handleCheck,
    handleShowHint,
    handleShowSolution,
    hint,
    showHint,
    summary,
  ]);

  return (
    <div className="">
      {/* Header */}
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-slate-600">{instruction}</p>

      {/* Digits row */}
      <div className="flex gap-4 pt-2">
        {digits.map((d, i) => (
          <DigitBox key={i} value={d} />
        ))}
      </div>

      {/* Row 1: user creates numbers */}
      <AmberStrip>
        {rowCreate.map((val, i) => (
          <PillInput
            key={`c-${i}`}
            value={val}
            state={stateCreate[i]}
            onChange={(v) =>
              setRowCreate((prev) => {
                const next = [...prev];
                next[i] = v;
                return next;
              })
            }
            placeholder="---"
          />
        ))}
      </AmberStrip>

      {/* Row 2: arrange ascending */}
      <div className="pt-1">
        <p className="mb-2 text-sm text-slate-600">
          Arrange in order from smallest to largest
        </p>
        <AmberStrip>
          {rowArrange.map((val, i) => (
            <PillInput
              key={`s-${i}`}
              value={val}
              state={stateArrange[i]}
              onChange={(v) =>
                setRowArrange((prev) => {
                  const next = [...prev];
                  next[i] = v;
                  return next;
                })
              }
              placeholder="---"
            />
          ))}
        </AmberStrip>
      </div>

    </div>
  );
}