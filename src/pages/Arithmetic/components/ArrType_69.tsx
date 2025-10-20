import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ------------------------------- */
type Kind = "add" | "mul" | "ratio" | "mixed";

type Problem = {
  id: string;
  kind: Kind;
  equation: string;      // label chip text
  options: string[];     // display strings (may include £, kg, commas)
  correct: string;       // kept for fallback (not used for validation now)
  answerValue: number;   // kept for fallback (not used for validation now)
  expectedWork?: string; // for Show Solution (we'll evaluate it)
};

export const DEMO: Problem[] = [
  {
    id: "mul-7x400",
    kind: "mul",
    equation: "7 × £400 = ?",
    options: ["£2800", "£3500", "£4000"],
    correct: "£2800",
    answerValue: 2800,
    expectedWork: "7 × 400",
  },
  {
    id: "ratio-37_175-6",
    kind: "ratio",
    equation: "37.175 kg : 6 = ?",
    options: ["0.006 kg", "0.6 kg", "6 kg"],
    correct: "6 kg",
    answerValue: 6,
    expectedWork: "36 : 6",
  },
  {
    id: "mixed-8949-2909+4083",
    kind: "mixed",
    equation: "8949 − 2909 + 4083 = ?",
    options: ["8000", "9000", "10,000"],
    correct: "10,000",
    answerValue: 10000,
    expectedWork: "9000 - 3000 + 4000",
  },
];

export const hint =
  "Round to friendly numbers and show the calculation you use. Then tick the option that matches your result. Your typed strategy must evaluate to the same value as the option you tick.";

/* -------------------------------
   Helpers
-------------------------------- */
type Status = "idle" | "match" | "wrong";
const TOL = 0.011;

const strip = (s: string) => String(s ?? "").trim().toLowerCase();
const toNum = (v: unknown): number => {
  const n = parseFloat(String(v ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
};

/** Evaluate a short strategy expression the user types.
 *  Supports +, -, ×, *, :, ÷, / (no parentheses).
 */
function evalStrategy(raw: string): number | null {
  if (!raw) return null;
  // normalise unicode operators and spaces
  const s = raw
    .replace(/\s+/g, "")
    .replace(/[×·]/g, "x")
    .replace(/[−–—]/g, "-")
    .replace(/[÷]/g, ":")
    .toLowerCase();

  if (!s) return null;

  // ratio / division (a : b or a/b)
  if (/:|\//.test(s)) {
    const parts = s.split(/[:/]/).map(toNum);
    if (parts.length === 2 && parts.every(Number.isFinite)) {
      return +(parts[0]! / parts[1]!).toFixed(2);
    }
  }

  // multiplication (a x b or a*b)
  if (/[x*]/.test(s)) {
    const parts = s.split(/[x*]/).map(toNum);
    if (parts.length === 2 && parts.every(Number.isFinite)) {
      return +(parts[0]! * parts[1]!).toFixed(2);
    }
  }

  // mixed +/-  (left-to-right)
  if (/[+-]/.test(s)) {
    const tokens = s.replace(/([+-])/g, " $1 ").trim().split(/\s+/);
    if (!tokens.length) return null;
    let acc = toNum(tokens[0]);
    if (!Number.isFinite(acc)) return null;
    for (let i = 1; i < tokens.length; i += 2) {
      const op = tokens[i];
      const rhs = toNum(tokens[i + 1]);
      if (!Number.isFinite(rhs)) return null;
      acc = op === "+" ? acc + rhs : acc - rhs;
    }
    return +acc.toFixed(2);
  }

  return null;
}

const underline = (checked: boolean, good: boolean) =>
  !checked
    ? "border-slate-300 text-slate-800"
    : good
    ? "border-emerald-400 text-emerald-600"
    : "border-rose-400 text-rose-600";

const optionBox = (checked: boolean, active: boolean, isMatch: boolean) => {
  const outer =
    "h-5 w-5 rounded-[4px] border-2 grid place-items-center transition-colors " +
    (!checked
      ? "border-orange-400"
      : active
      ? isMatch
        ? "border-emerald-600"
        : "border-rose-600"
      : "border-orange-300");
  const inner =
    "h-3 w-3 rounded-[2px] transition-colors " +
    (active
      ? checked
        ? isMatch
          ? "bg-emerald-600"
          : "bg-rose-600"
        : "bg-slate-500"
      : "bg-transparent");
  return { outer, inner };
};

/* -------------------------------
   Component
-------------------------------- */
type Props = { data?: Problem[]; hint?: string };

const ArrType_69: React.FC<Props> = ({ data: incoming, hint: incomingHint }) => {
  const problems = useMemo<Problem[]>(() => {
    const src = Array.isArray(incoming) && incoming.length ? incoming : DEMO;
    return src.map((p, i) => ({
      id: p?.id ?? `p-${i}`,
      kind: (p?.kind as Kind) ?? "mixed",
      equation: p?.equation?.trim() || DEMO[i % DEMO.length].equation,
      options: Array.isArray(p?.options) && p.options.length ? p.options : DEMO[i % DEMO.length].options,
      correct: p?.correct ?? DEMO[i % DEMO.length].correct,
      answerValue: Number.isFinite(p?.answerValue as number)
        ? (p!.answerValue as number)
        : DEMO[i % DEMO.length].answerValue,
      expectedWork: p?.expectedWork ?? DEMO[i % DEMO.length].expectedWork,
    }));
  }, [incoming]);

  const helpText = incomingHint ?? hint;

  // User state
  const [work, setWork] = useState<string[]>(() => problems.map(() => ""));
  const [picked, setPicked] = useState<string[]>(() => problems.map(() => ""));
  const [workOk, setWorkOk] = useState<boolean[]>(() => problems.map(() => false));
  const [pickOk, setPickOk] = useState<boolean[]>(() => problems.map(() => false));
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  // Reset when problems change
  useEffect(() => {
    setWork(problems.map(() => ""));
    setPicked(problems.map(() => ""));
    setWorkOk(problems.map(() => false));
    setPickOk(problems.map(() => false));
    setChecked(false);
    setStatus("idle");
    setShowHint(false);
  }, [problems.length]);

  const setWorkAt = useCallback((i: number, v: string) => {
    setWork((prev) => {
      const cp = [...prev];
      cp[i] = v;
      return cp;
    });
  }, []);
  const pick = useCallback((i: number, val: string) => {
    setPicked((prev) => {
      const cp = [...prev];
      cp[i] = val;
      return cp;
    });
  }, []);

  /** Core rule: the strategy value must match the picked option's value */

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  const handleCheck = useCallback(() => {
    const wOK: boolean[] = [];
    const pOK: boolean[] = [];

    problems.forEach((_, i) => {
      const val = evalStrategy(work[i]);
      const pickVal = toNum(picked[i]);
      const both =
        val !== null && picked[i].length > 0 && Number.isFinite(pickVal) && Math.abs((val as number) - pickVal) < TOL;

      wOK.push(both);
      pOK.push(both);
    });

    setWorkOk(wOK);
    setPickOk(pOK);
    setChecked(true);
    setStatus(wOK.every(Boolean) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },wOK.every(Boolean));
  }, [problems, work, picked]);

  /** Show solution: fill expected work & pick the option whose numeric value matches it */
  const handleShowSolution = useCallback(() => {
    const nextWork = problems.map((p) => p.expectedWork ?? "");
    const nextPicked = problems.map((p) => {
      const v = evalStrategy(p.expectedWork ?? "") ?? p.answerValue;
      // find option with numeric match
      const idx = p.options.findIndex((o) => {
        const ov = toNum(o);
        return Number.isFinite(ov) && Math.abs((v as number) - ov) < TOL;
      });
      return idx >= 0 ? p.options[idx] : p.correct ?? (p.options[0] ?? "");
    });

    setWork(nextWork);
    setPicked(nextPicked);
    setWorkOk(problems.map(() => true));
    setPickOk(problems.map(() => true));
    setChecked(true);
    setStatus("match");
  }, [problems]);

  const handleShowHint = useCallback(() => setShowHint((s) => !s), []);

  // Summary + wire to global toolbar
  const summary = useMemo(
    () =>
      status === "match"
        ? {
            text: "Correct! Great job.",
            color: "text-green-600",
            bgColor: "bg-green-100",
            borderColor: "border-green-600",
          }
        : status === "wrong"
        ? {
            text: "Some answers are wrong. Check again.",
            color: "text-red-600",
            bgColor: "bg-red-100",
            borderColor: "border-red-600",
          }
        : null,
    [status]
  );

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
    setControls((prev) => {
      const changed = Object.keys(controls).some(
        (k) => (controls as any)[k] !== (prev as any)?.[k]
      );
      return changed ? controls : prev;
    });
  }, [controls, setControls]);

  // UI
  return (
    <div className="space-y-6">
      <div>
        {/* <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">
          How much is it approximately? <br />
          Write down the calculation you are using. Then tick the correct answer.
        </p> */}
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {problems.map((p, i) => {
          // live computed value (used only for coloring options after check)
          const val = evalStrategy(work[i]);
          return (
            <div key={p.id} className="space-y-3">
              {/* equation chip */}
              <div className="inline-block rounded-md border-2 border-orange-300 bg-orange-50 px-3 py-1 text-[15px] font-semibold text-slate-800">
                {p.equation}
              </div>

              {/* I calculate input */}
              <div className="text-[14px]">
                <span className="text-slate-700">I calculate: </span>
                <input
                  value={work[i]}
                  onChange={(e) => setWorkAt(i, e.target.value)}
                  placeholder={
                    p.kind === "mul"
                      ? "e.g. 7 × 400"
                      : p.kind === "ratio"
                      ? "e.g. 36 : 6"
                      : p.kind === "mixed"
                      ? "e.g. 9000 - 3000 + 4000"
                      : "e.g. 5000 + 1000 + 2000"
                  }
                  className={`ml-2 w-[260px] border-b border-dotted bg-transparent outline-none ${underline(
                    checked,
                    workOk[i]
                  )}`}
                />
              </div>

              {/* options */}
              <div className="space-y-2">
                {p.options.map((opt) => {
                  const active = picked[i] === opt;
                  const optVal = toNum(opt);
                  const isMatch =
                    checked &&
                    val !== null &&
                    Number.isFinite(optVal) &&
                    Math.abs((val as number) - optVal) < TOL;

                  const { outer, inner } = optionBox(checked, active, isMatch);
                  const textCls =
                    !checked
                      ? "text-slate-800"
                      : active
                      ? isMatch
                        ? "text-emerald-600"
                        : "text-rose-600"
                      : "text-slate-800";

                  return (
                    <div
                      key={`${p.id}-${opt}`}
                      className="flex cursor-pointer select-none items-center gap-2 text-[14px]"
                      onClick={() => pick(i, opt)}
                      role="radio"
                      aria-checked={active}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") pick(i, opt);
                      }}
                    >
                      <span className={outer} aria-hidden="true">
                        <span className={inner} />
                      </span>
                      <span className={textCls}>{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArrType_69;
