import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Row = {
  id?: string;
  words?: string;      // the phrase (“two hundred and fifty thousand”)
  value?: number;      // expected numeric value (e.g., 250000)
};
type Props = {
  data?: Row[];
  hint?: string;
};

/* ---------------- Defaults ---------------- */
const DEFAULT_DATA: Required<Row>[] = [
  { id: "r1", words: "two hundred and fifty thousand",        value: 250000 },
  { id: "r2", words: "nine hundred and ten thousand",         value: 910000 },
  { id: "r3", words: "eighty-six thousand",                   value: 86000  },
  { id: "r4", words: "two hundred and fifty-six thousand",    value: 256000 },
  { id: "r5", words: "five hundred and forty thousand",       value: 540000 },
  { id: "r6", words: "seven hundred and thirty-four thousand",value: 734000 },
];

const DEFAULT_HINT =
  "Write each amount in figures. Use digits and optional commas (e.g., 250,000).";




  const ArrType_80: React.FC<Props> = ({data:DEFAULT_DATA, hint:DEFAULT_HINT}) => {
    return <ArrType data={DEFAULT_DATA} hint={DEFAULT_HINT} />;
  };
/* ---------------- Helpers ---------------- */
const parseUserNumber = (s: string): number => {
  const t = String(s ?? "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/[€£]/g, "")
    .replace(/,/g, ""); // allow commas
  const n = Number(t);
  return Number.isFinite(n) ? n : NaN;
};
const fmt = (n: number) =>
  n.toLocaleString("en-GB", { maximumFractionDigits: 0 });

type Status = "idle" | "match" | "wrong";
interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

/* ---------------- Component ---------------- */
const ArrType: React.FC<Props> = ({ data, hint }) => {
  // normalize
  const ROWS = useMemo<Required<Row>[]>(() => {
    const src = Array.isArray(data) && data.length ? data : DEFAULT_DATA;
    return src.map((r, i) => ({
      id: r.id ?? `r-${i}`,
      words: r.words ?? "",
      value: Number.isFinite(r.value as number) ? (r.value as number) : 0,
    }));
  }, [data]);

  const [inputs, setInputs] = useState<string[]>(() => ROWS.map(() => ""));
  const [ok, setOk] = useState<(boolean | null)[]>(() => ROWS.map(() => null));
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  // reset if item count changes
  useEffect(() => {
    setInputs(ROWS.map(() => ""));
    setOk(ROWS.map(() => null));
    setStatus("idle");
    setShowHint(false);
  }, [ROWS.length]);

  /* handlers */
  const handleCheck = useCallback(() => {
    const verdicts = ROWS.map((r, i) => {
      const g = parseUserNumber(inputs[i]);
      return Number.isFinite(g) && g === r.value;
    });
    setOk(verdicts);
    setStatus(verdicts.every(Boolean) ? "match" : "wrong");
  }, [ROWS, inputs]);

  const handleShowSolution = useCallback(() => {
    setInputs(ROWS.map((r) => fmt(r.value)));
    setOk(ROWS.map(() => true));
    setStatus("match");
  }, [ROWS]);

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

  /* expose to the global Controllers/Hint/Check */
  const { setControls } = useQuestionControls();
  useEffect(() => {
    setControls({
      handleCheck,
      handleShowSolution,
      handleShowHint,
      hint: hint ?? DEFAULT_HINT,
      showHint,
      summary,
    });
  }, [setControls, handleCheck, handleShowSolution, handleShowHint, hint, showHint, summary]);

  const inputTone = (flag: boolean | null) =>
    flag === null
      ? "border-slate-300 text-slate-800"
      : flag
      ? "border-emerald-500 text-emerald-600"
      : "border-rose-500 text-rose-600";

  /* ---------------- UI (kept close to your design) ---------------- */
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">Write in figures.</p>
      </div>

      {/* 6 items; responsive like your layout */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {ROWS.map((r, i) => (
          <div key={r.id} className="space-y-3">
            {/* orange chip text */}
            <div className="inline-block rounded-md bg-orange-50 px-4 py-3 text-[13px] font-medium text-slate-800 border border-orange-200 shadow-sm">
              {r.words}
            </div>

            {/* dotted underline input (figures) */}
            <div className="flex items-center">
              <input
                type="text"
                inputMode="numeric"
                value={inputs[i]}
                onChange={(e) => {
                  const v = e.target.value;
                  setInputs((p) => ((p = [...p]), (p[i] = v), p));
                  setOk((p) => ((p = [...p]), (p[i] = null), p));
                  setStatus("idle");
                }}
                placeholder="…………………"
                className={`w-40 border-b border-dotted bg-transparent text-emerald-600 outline-none tabular-nums ${inputTone(
                  ok[i]
                )}`}
              />
            </div>
          </div>
        ))}
      </div>


    </div>
  );
};

export default ArrType_80;
