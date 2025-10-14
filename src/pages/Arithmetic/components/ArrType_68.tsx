import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------- Types ---------- */
type Kind = "add" | "mul" | "ratio";

type Problem = {
  id: string;
  kind: Kind;
  equation: string;
  options: string[];
  correct: string;
  answerValue: number;
  expectedWork?: string;
  unitSuffix?: string;
};

/* ---------- Demo data (2 rows × 3 columns) ---------- */
export const DEMO: Problem[] = [
  // Row 1
  {
    id: "add-4896-990-2004-r1",
    kind: "add",
    equation: "4896 + 990 + 2004 = ?",
    options: ["7000", "8000", "9000"],
    correct: "8000",
    answerValue: 8000,
    expectedWork: "5000 + 1000 + 2000",
  },
  {
    id: "mul-6x813-r1",
    kind: "mul",
    equation: "6 × £813.00 = ?",
    options: ["£4800.00", "£4900.00", "£5000.00"],
    correct: "£4800.00",
    answerValue: 4800,
    expectedWork: "6 × 800",
  },
  {
    id: "ratio-37_925-8-r1",
    kind: "ratio",
    equation: "37.925 kg : 8 = ?",
    options: ["0.04 kg", "0.4 kg", "4 kg"],
    correct: "4 kg",
    answerValue: 4,
    expectedWork: "32 : 8",
    unitSuffix: "kg",
  },
  // Row 2
  {
    id: "add-7325-1180-490-r2",
    kind: "add",
    equation: "7325 + 1180 + 490 = ?",
    options: ["8000", "9000", "10000"],
    correct: "9000", // 8995 ≈ 9000
    answerValue: 9000,
    expectedWork: "7000 + 1000 + 1000",
  },
  {
    id: "mul-9x542-r2",
    kind: "mul",
    equation: "9 × £542 = ?",
    options: ["£4800.00", "£4900.00", "£5000.00"],
    correct: "£4900.00", // 9×542 ≈ 9×540 = 4860 → ~4900
    answerValue: 4900,
    expectedWork: "9 × 540",
  },
  {
    id: "ratio-45_6-12-r2",
    kind: "ratio",
    equation: "45.6 kg : 12 = ?",
    options: ["3.5 kg", "4 kg", "5 kg"],
    correct: "4 kg", // ≈ 48 : 12
    answerValue: 4,
    expectedWork: "48 : 12",
    unitSuffix: "kg",
  },
];

export const hint =
  "Round to friendly numbers. For addition: split thousands/hundreds. For multiplication: round to a clean tens/hundreds and adjust (e.g., 6×813 ≈ 6×800). For ratios: use clean division like 32 : 8 = 4. Type only the strategy (left of the equals).";

/* ---------- Helpers ---------- */
type Status = "idle" | "match" | "wrong";

const strip = (s: string) => s.replace(/\s+/g, "").toLowerCase();

const toNum = (v: unknown): number => {
  const n = parseFloat(String(v ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
};

/** Evaluate user strategy; now accepts the real multiply sign “×”. */
function evalStrategy(raw: string): number | null {
  const s = strip(raw);
  if (!s) return null;

  // ratio
  if (/[:÷/]/.test(s)) {
    const parts = s.split(/[:÷/]/).map(toNum);
    if (parts.length === 2 && parts.every(Number.isFinite)) {
      return +(parts[0]! / parts[1]!).toFixed(2);
    }
  }

  // multiplication — accept x, *, and ×
  if (/[x*×]/.test(s)) {
    const parts = s.split(/[x*×]/).map(toNum);
    if (parts.length === 2 && parts.every(Number.isFinite)) {
      return +(parts[0]! * parts[1]!).toFixed(2);
    }
  }

  // addition
  if (/\+/.test(s)) {
    const parts = s.split("+").map(toNum);
    if (parts.length >= 2 && parts.every(Number.isFinite)) {
      const sum = parts.reduce((acc, n) => acc + (n as number), 0);
      return +sum.toFixed(2);
    }
  }

  return null;
}

/** Validation: treat multiplication strategies as rounded to the nearest 100. */
function approxOk(p: Problem, computed: number | null): boolean {
  if (computed === null || !Number.isFinite(computed)) return false;
  const want = p.answerValue;

  if (p.kind === "mul") {
    const roundedToHundreds = Math.round((computed as number) / 100) * 100;
    return Math.abs(roundedToHundreds - want) < 0.5;
    // e.g., 9×540 = 4860 → 4900, so it matches £4900.00
  }

  if (p.kind === "ratio") {
    return Math.abs((computed as number) - want) < 0.011;
  }

  // add (and default)
  return Math.abs((computed as number) - want) < 0.011;
}

/* ---------- Component ---------- */
type Props = { data?: Problem[]; hint?: string };

const TARGET_COUNT = 6; // 2 rows × 3 columns

const ArrType_68: React.FC<Props> = ({ data: incoming, hint: incomingHint }) => {
  /** Build the source list as incoming + DEMO, then take the first 6 UNIQUE by id.
   *  This prevents repeating the first row and guarantees different data in row 2.
   */
  const problems = useMemo<Problem[]>(() => {
    const incomingList = Array.isArray(incoming) ? incoming : [];
    const combined = [...incomingList, ...DEMO];

    const seen = new Set<string>();
    const unique: Problem[] = [];
    for (const p of combined) {
      const id = (p?.id ?? "").toString();
      if (!id || seen.has(id)) continue;
      if (
        typeof p.kind !== "string" ||
        typeof p.equation !== "string" ||
        !Array.isArray(p.options) ||
        typeof p.correct !== "string" ||
        typeof p.answerValue !== "number"
      ) {
        continue; // skip invalid
      }
      seen.add(id);
      unique.push(p as Problem);
      if (unique.length === TARGET_COUNT) break;
    }

    // If still short (shouldn't happen), pad from DEMO
    while (unique.length < TARGET_COUNT) {
      for (const p of DEMO) {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          unique.push(p);
          if (unique.length === TARGET_COUNT) break;
        }
      }
      if (unique.length === TARGET_COUNT) break;
    }

    return unique.slice(0, TARGET_COUNT);
  }, [incoming]);

  const helpText = incomingHint ?? hint;

  // UI state per problem
  const [work, setWork] = useState<string[]>(() => problems.map(() => ""));
  const [picked, setPicked] = useState<string[]>(() => problems.map(() => ""));
  const [workOk, setWorkOk] = useState<boolean[]>(() => problems.map(() => false));
  const [pickOk, setPickOk] = useState<boolean[]>(() => problems.map(() => false));
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  // reset when array length changes
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

  /* ----- Validate ----- */
  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  const handleCheck = useCallback(() => {
    const wOK: boolean[] = [];
    const pOK: boolean[] = [];

    problems.forEach((p, i) => {
      const computed = evalStrategy(work[i]);
      wOK.push(approxOk(p, computed));
      pOK.push(strip(picked[i]) === strip(p.correct));
    });

    setWorkOk(wOK);
    setPickOk(pOK);
    setChecked(true);
    setStatus(wOK.every(Boolean) && pOK.every(Boolean) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },wOK.every(Boolean) && pOK.every(Boolean));
  }, [problems, work, picked]);

  const handleShowSolution = useCallback(() => {
    setWork(problems.map((p) => p.expectedWork ?? ""));
    setPicked(problems.map((p) => p.correct));
    setWorkOk(problems.map(() => true));
    setPickOk(problems.map(() => true));
    setChecked(true);
    setStatus("match");
  }, [problems]);

  const handleShowHint = useCallback(() => setShowHint((s) => !s), []);

  /* ----- wire to your global toolbar ----- */
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

  const underline = (good: boolean) =>
    !checked
      ? "border-slate-300 text-slate-800"
      : good
      ? "border-emerald-400 text-emerald-600"
      : "border-rose-400 text-rose-600";

  const optionBox = (checkedBox: boolean, active: boolean, isCorrect: boolean) => {
    const outer =
      "h-5 w-5 rounded-[4px] border-2 grid place-items-center transition-colors " +
      (!checkedBox
        ? "border-orange-400"
        : active
        ? isCorrect
          ? "border-emerald-600"
          : "border-rose-600"
        : "border-orange-300");
    const inner =
      "h-3 w-3 rounded-[2px] transition-colors " +
      (active
        ? checkedBox
          ? isCorrect
            ? "bg-emerald-600"
            : "bg-rose-600"
          : "bg-slate-500"
        : "bg-transparent");
    return { outer, inner };
  };

  /* ---------- UI ---------- */
  return (
    <div className="space-y-6">
      <div>
        {/* <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">
          How much is it approximately? Write down the calculation you are using. Then tick the
          correct answer.
        </p> */}
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
        {problems.map((p, i) => {
          const goodWork = workOk[i];
          const goodPick = pickOk[i];

          return (
            <div key={p.id} className="space-y-3">
              <div className="inline-block rounded-md border-2 border-orange-300 bg-orange-50 px-3 py-1 text-[15px] font-semibold text-slate-800">
                {p.equation}
              </div>

              <div className="text-[14px]">
                <span className="text-slate-700">I calculate: </span>
                <input
                  value={work[i]}
                  onChange={(e) => setWorkAt(i, e.target.value)}
                  placeholder={
                    p.kind === "add"
                      ? "e.g. 5000 + 1000 + 2000"
                      : p.kind === "mul"
                      ? "e.g. 6 × 800"
                      : "e.g. 32 : 8"
                  }
                  className={`ml-2 w-[280px] border-b border-dotted bg-transparent outline-none ${underline(
                    goodWork
                  )}`}
                />
              </div>

              <div className="space-y-2">
                {p.options.map((opt, idx) => {
                  const active = picked[i] === opt;
                  const isCorrect = strip(opt) === strip(p.correct);
                  const { outer, inner } = optionBox(checked, active, isCorrect);
                  const textCls =
                    !checked
                      ? "text-slate-800"
                      : active
                      ? goodPick
                        ? "text-emerald-600"
                        : "text-rose-600"
                      : "text-slate-800";

                  return (
                    <div
                      key={`${p.id}::${idx}`}
                      className="flex items-center gap-2 text-[14px] cursor-pointer select-none"
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

export default ArrType_68;
