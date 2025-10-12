import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";

/* ---------- Types ---------- */
type Kind = "digitWorth";

type Problem = {
  id: string;
  kind: Kind;
  equation: string; // e.g., "2, 3, 4, 5"
  digits: string[]; // Array of individual digits
  answers: string[]; // Expected values (e.g., ["0.005 cl", "0.4 cl", ...])
  userInputs: string[]; // User-entered values
  unitSuffix: string; // Unit (e.g., "cl" or "ml")
};

/* ---------- Demo data (2 rows × 3 columns) ---------- */
export const DEMO: Problem[] = [
  // Row 1
  {
    id: "dw-2345-r1",
    kind: "digitWorth",
    equation: "2, 3, 4, 5",
    digits: ["2", "3", "4", "5"],
    answers: ["0.005", "0.4", "3", "20"],
    userInputs: ["", "", "", ""],
    unitSuffix: "cl",
  },
  {
    id: "dw-1588-r1",
    kind: "digitWorth",
    equation: "1, 5, 8, 8",
    digits: ["1", "5", "8", "8"],
    answers: ["0.009", "0.08", "0.5", "11"],
    userInputs: ["", "", "", ""],
    unitSuffix: "ml",
  },
  {
    id: "dw-6792-r1",
    kind: "digitWorth",
    equation: "6, 7, 9, 2",
    digits: ["6", "7", "9", "2"],
    answers: ["0.006", "0.7", "9", "200"],
    userInputs: ["", "", "", ""],
    unitSuffix: "cl",
  },
  // Row 2
  {
    id: "dw-3481-r2",
    kind: "digitWorth",
    equation: "3, 4, 8, 1",
    digits: ["3", "4", "8", "1"],
    answers: ["0.003", "0.4", "8", "100"],
    userInputs: ["", "", "", ""],
    unitSuffix: "ml",
  },
  {
    id: "dw-5927-r2",
    kind: "digitWorth",
    equation: "5, 9, 2, 7",
    digits: ["5", "9", "2", "7"],
    answers: ["0.005 cl", "0.9 cl", "20 cl", "700 cl"],
    userInputs: ["", "", "", ""],
    unitSuffix: "cl",
  },
  {
    id: "dw-1473-r2",
    kind: "digitWorth",
    equation: "1, 4, 7, 3",
    digits: ["1", "4", "7", "3"],
    answers: ["0.001 ml", "0.04 ml", "0.7 ml", "30 ml"],
    userInputs: ["", "", "", ""],
    unitSuffix: "ml",
  },
];

export const hint = "Determine the value of each digit based on its position or context. Use the unit provided (cl or ml).";

/* ---------- Helpers ---------- */
type Status = "idle" | "match" | "wrong";

const strip = (s: string) => s.replace(/\s+/g, "").toLowerCase();

const toNum = (v: unknown): number => {
  const n = parseFloat(String(v ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
};

/** Validate user input against expected answer (ignoring unit suffix for numeric comparison). */
function approxOk(userInput: string, expected: string): boolean {
  const userNum = toNum(userInput);
  const expectedNum = toNum(expected);
  return Number.isFinite(userNum) && Number.isFinite(expectedNum) && Math.abs(userNum - expectedNum) < 0.011;
}

/* ---------- Component ---------- */
type Props = { data?: Problem[]; hint?: string };

const TARGET_COUNT = 6; // 2 rows × 3 columns

const ArrType_67: React.FC<Props> = ({ data: incoming, hint: incomingHint }) => {
  /** Build the source list as incoming + DEMO, then take the first 6 UNIQUE by id. */
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
        !Array.isArray(p.digits) ||
        !Array.isArray(p.answers) ||
        typeof p.unitSuffix !== "string"
      ) {
        continue; // skip invalid
      }
      seen.add(id);
      unique.push(p as Problem);
      if (unique.length === TARGET_COUNT) break;
    }

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
  const [userInputs, setUserInputs] = useState<string[][]>(() => problems.map((p) => [...p.userInputs]));
  const [inputOk, setInputOk] = useState<boolean[][]>(() => problems.map((p) => p.digits.map(() => false)));
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  // Reset when array length changes
  useEffect(() => {
    setUserInputs(problems.map((p) => [...p.userInputs]));
    setInputOk(problems.map((p) => p.digits.map(() => false)));
    setChecked(false);
    setStatus("idle");
    setShowHint(false);
  }, [problems.length]);

  const setInputAt = useCallback((problemIdx: number, digitIdx: number, v: string) => {
    setUserInputs((prev) => {
      const cp = [...prev];
      cp[problemIdx] = [...cp[problemIdx]];
      cp[problemIdx][digitIdx] = v;
      return cp;
    });
  }, []);

  /* ----- Validate ----- */
  const handleCheck = useCallback(() => {
    const iOK: boolean[][] = problems.map((p, pIdx) =>
      p.digits.map((_, dIdx) => approxOk(userInputs[pIdx][dIdx], p.answers[dIdx]))
    );

    setInputOk(iOK);
    setChecked(true);
    setStatus(iOK.every((row) => row.every(Boolean)) ? "match" : "wrong");
  }, [problems, userInputs]);

  const handleShowSolution = useCallback(() => {
    setUserInputs(problems.map((p, pIdx) => [...p.answers]));
    setInputOk(problems.map((p) => p.digits.map(() => true)));
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

  /* ---------- UI with Vector Lines ---------- */
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-6" ref={containerRef}>
      <div>
        <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">What is each digit worth? Fill in.</p>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
        {problems.map((p, pIdx) => {
          const digitRefs = useRef<(HTMLSpanElement | null)[]>([]);
          const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

          return (
            <div key={p.id} className="space-y-3 relative">
              <div className="inline-block rounded-md border-2 border-orange-300 bg-orange-50 px-3 py-1 text-[15px] font-semibold text-slate-800">
                {p.equation}
              </div>

              <div className="text-[14px] flex flex-col items-start">
                {p.digits.map((digit, dIdx) => (
                  <div key={`${p.id}-digit-${dIdx}`} className="flex items-center gap-2 my-1 relative">
                    <span
                      ref={(el) => (digitRefs.current[dIdx] = el)}
                      className="text-slate-700"
                    >
                      {digit} =
                    </span>
                    <input
                      ref={(el) => (inputRefs.current[dIdx] = el)}
                      value={userInputs[pIdx][dIdx]}
                      onChange={(e) => setInputAt(pIdx, dIdx, e.target.value)}
                      placeholder={`e.g. 0.005 ${p.unitSuffix}`}
                      className={`ml-2 w-[100px] border-b border-dotted bg-transparent outline-none ${underline(
                        inputOk[pIdx][dIdx]
                      )}`}
                    />
                    <span className="text-slate-700">{p.unitSuffix}</span>
                   
                  </div>
                ))}
              </div>

              {/* SVG for Vector Lines */}
              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ zIndex: 0 }}
              >
                {p.digits.map((_, dIdx) => {
                  const digitEl = digitRefs.current[dIdx];
                  const inputEl = inputRefs.current[dIdx];
                  if (digitEl && inputEl) {
                    const digitRect = digitEl.getBoundingClientRect();
                    const inputRect = inputEl.getBoundingClientRect();
                    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
                    const x1 = digitRect.left - containerRect.left + digitRect.width;
                    const y1 = digitRect.top - containerRect.top + digitRect.height / 2;
                    const x2 = inputRect.left - containerRect.left;
                    const y2 = inputRect.top - containerRect.top + inputRect.height / 2;

                    return (
                      <line
                        key={`line-${p.id}-${dIdx}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#f97316" // Orange color matching the image
                        strokeWidth="2"
                        strokeDasharray={dIdx === 0 ? "0" : "5, 5"} // Solid for first, dashed for others
                      />
                    );
                  }
                  return null;
                })}
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArrType_67;