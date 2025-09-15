import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useCallback, useEffect, useRef, useState } from "react";
import useResultTracker from "@/hooks/useResultTracker";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import { useQuestionControls } from "@/context/QuestionControlsContext";

type Op = "+" | "-";
type Row = { left: number; op: Op; right: number };

const LEFT_BLOCK: Row[] = [
  { left: 16, op: "-", right: 4 },
  { left: 18, op: "-", right: 5 },
  { left: 19, op: "-", right: 3 },
];

const RIGHT_BLOCK: Row[] = [
  { left: 11, op: "+", right: 5 },
  { left: 14, op: "+", right: 6 },
  { left: 12, op: "+", right: 7 },
];

const calc = (a: number, op: Op, b: number) => (op === "+" ? a + b : a - b);
const toNum = (v: string) => (v.trim() === "" ? NaN : Number(v));
const ones = (n: number) => Math.abs(n) % 10;

const key = (side: "L" | "R", idx: number, part: "main" | "bA" | "bB" | "bR") =>
  `${side}-${idx}-${part}`;

const HINT_TEXT =
  "Solve the big sum. In the thought bubble, use the ones digit of the first number with the same operator and the second number (e.g., 16−4 → 6−4=2; 14+6 → 4+6=10).";

export default function ArrType_15({ hint }: any) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<"" | "match" | "wrong">("");
  const [showHint, setShowHint] = useState(false);
  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  // refs so caret/focus never gets lost
  const refs = useRef<Record<string, HTMLInputElement | null>>({});
  const setRef =
    (k: string) =>
    (el: HTMLInputElement | null): void => {
      refs.current[k] = el;
    };

  // caret-safe numeric update
  const onEdit = (k: string, raw: string) => {
    const el = refs.current[k];
    const caret = el?.selectionStart ?? raw.length;
    const cleaned = raw.replace(/[^\d]/g, "");
    setInputs((p) => ({ ...p, [k]: cleaned }));
    setChecked(false);
    setStatus("");
    requestAnimationFrame(() => {
      const target = refs.current[k];
      if (target) {
        const pos = Math.min(caret, cleaned.length);
        target.focus();
        try {
          target.setSelectionRange(pos, pos);
        } catch {
          // ignore
        }
      }
    });
  };

  // validator
  const validateRow = (
    row: Row,
    kMain: string,
    kA: string,
    kB: string,
    kR: string
  ) => {
    const mainRes = toNum(inputs[kMain] ?? "");
    const a = toNum(inputs[kA] ?? "");
    const b = toNum(inputs[kB] ?? "");
    const r = toNum(inputs[kR] ?? "");

    const mainOK =
      !Number.isNaN(mainRes) && mainRes === calc(row.left, row.op, row.right);

    const wantA = ones(row.left);
    const wantB = row.right;
    const wantR = calc(wantA, row.op, wantB);

    const bubbleOK =
      ![a, b, r].some(Number.isNaN) &&
      a === wantA &&
      b === wantB &&
      r === wantR;

    const filled =
      (inputs[kMain] ?? "").trim() &&
      (inputs[kA] ?? "").trim() &&
      (inputs[kB] ?? "").trim() &&
      (inputs[kR] ?? "").trim();

    return { mainOK, bubbleOK, filled: !!filled };
  };

  // ✅ memoized handlers
  const handleCheck = useCallback(() => {
    setChecked(true);
    const rows = [
      ...LEFT_BLOCK.map((row, i) =>
        validateRow(
          row,
          key("L", i, "main"),
          key("L", i, "bA"),
          key("L", i, "bB"),
          key("L", i, "bR")
        )
      ),
      ...RIGHT_BLOCK.map((row, i) =>
        validateRow(
          row,
          key("R", i, "main"),
          key("R", i, "bA"),
          key("R", i, "bB"),
          key("R", i, "bR")
        )
      ),
    ];
    const allFilled = rows.every((r) => r.filled);
    const allOK = rows.every((r) => r.mainOK && r.bubbleOK);
    const ok = allFilled && allOK;
    setStatus(ok ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, ok);
  }, [addResult, qId, qTitle, inputs]);

  const handleShowSolution = useCallback(() => {
    const next: Record<string, string> = {};
    const fillFor = (row: Row, i: number, side: "L" | "R") => {
      const main = calc(row.left, row.op, row.right);
      const a = ones(row.left);
      const b = row.right;
      const r = calc(a, row.op, b);
      next[key(side, i, "main")] = String(main);
      next[key(side, i, "bA")] = String(a);
      next[key(side, i, "bB")] = String(b);
      next[key(side, i, "bR")] = String(r);
    };
    LEFT_BLOCK.forEach((row, i) => fillFor(row, i, "L"));
    RIGHT_BLOCK.forEach((row, i) => fillFor(row, i, "R"));
    setInputs(next);
    setChecked(true);
    setStatus("match");
  }, []);

  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  // summary
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

  const { setControls } = useQuestionControls();

  // ✅ now safe, no infinite loop
  useEffect(() => {
    setControls({
      handleCheck,
      handleShowHint,
      handleShowSolution,
      hint,
      showHint,
      summary,
    });
  }, [handleCheck, handleShowHint, handleShowSolution, hint, showHint, summary, setControls]);

  // ===== Bubble UI =====
  const Bubble = ({
    aKey,
    bKey,
    rKey,
    op,
    ok,
  }: {
    aKey: string;
    bKey: string;
    rKey: string;
    op: Op;
    ok: boolean;
  }) => (
    <div className="ml-2 flex items-center shrink-0">
      <span className="mr-1 inline-block h-2 w-2 rounded-full bg-sky-200" />
      <span className="mr-2 inline-block h-3 w-3 rounded-full bg-sky-200 border border-sky-300 shadow-[0_0_2px_rgba(14,165,233,0.35)]" />
      <div className="rounded-xl border border-sky-200 bg-sky-100/90 px-3 py-1.5 shadow-sm">
        <div className="flex items-center gap-1.5">
          <input
            ref={setRef(aKey)}
            value={inputs[aKey] ?? ""}
            onChange={(e) => onEdit(aKey, e.target.value)}
            className={`w-12 bg-transparent text-center border-b border-dashed focus:outline-none
              ${
                checked
                  ? ok
                    ? "border-green-500 text-green-700"
                    : "border-red-500 text-red-600"
                  : "border-primary"
              }`}
            placeholder="……"
          />
          <span className="font-semibold">{op}</span>
          <input
            ref={setRef(bKey)}
            value={inputs[bKey] ?? ""}
            onChange={(e) => onEdit(bKey, e.target.value)}
            className={`w-12 bg-transparent text-center border-b border-dashed focus:outline-none
              ${
                checked
                  ? ok
                    ? "border-green-500 text-green-700"
                    : "border-red-500 text-red-600"
                  : "border-primary"
              }`}
            placeholder="……"
          />
          <span className="font-semibold">=</span>
          <input
            ref={setRef(rKey)}
            value={inputs[rKey] ?? ""}
            onChange={(e) => onEdit(rKey, e.target.value)}
            className={`w-14 bg-transparent text-center border-b border-dashed focus:outline-none
              ${
                checked
                  ? ok
                    ? "border-green-500 text-green-700"
                    : "border-red-500 text-red-600"
                  : "border-primary"
              }`}
            placeholder="……"
          />
        </div>
      </div>
    </div>
  );

  const RowUI = ({ row, side, idx }: { row: Row; side: "L" | "R"; idx: number }) => {
    const kMain = key(side, idx, "main");
    const kA = key(side, idx, "bA");
    const kB = key(side, idx, "bB");
    const kR = key(side, idx, "bR");
    const { mainOK, bubbleOK } = validateRow(row, kMain, kA, kB, kR);

    return (
      <div className="flex flex-nowrap items-center gap-3">
        <div className="flex items-center gap-2 text-lg">
          <span>{row.left}</span>
          <span className="font-semibold">{row.op}</span>
          <span>{row.right}</span>
          <span>=</span>
          <input
            ref={setRef(kMain)}
            value={inputs[kMain] ?? ""}
            onChange={(e) => onEdit(kMain, e.target.value)}
            className={`w-16 text-center border-b border-dashed focus:outline-none
              ${
                checked
                  ? mainOK
                    ? "border-green-500 text-green-700"
                    : "border-red-500 text-red-600"
                  : "border-primary"
              }`}
            placeholder="……"
          />
        </div>
        <Bubble aKey={kA} bKey={kB} rKey={kR} op={row.op} ok={bubbleOK} />
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-gray-600">
          Solve the sums. Write the small sum in the thought bubble.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="space-y-4">
          {LEFT_BLOCK.map((r, i) => (
            <RowUI key={`L-${i}`} row={r} side="L" idx={i} />
          ))}
        </div>
        <div className="space-y-4">
          {RIGHT_BLOCK.map((r, i) => (
            <RowUI key={`R-${i}`} row={r} side="R" idx={i} />
          ))}
        </div>
      </div>

      {/* <Controllers
        handleCheck={handleCheck}
        handleShowSolution={handleShowSolution}
        handleShowHint={handleShowHint}
      />
      {showHint && <Hint hint={HINT_TEXT} />}
      <Check summary={summary} /> */}
    </div>
  );
}
