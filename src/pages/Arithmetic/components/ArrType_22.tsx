import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useState } from "react";
import useResultTracker from "@/hooks/useResultTracker";
import { useQuestionMeta } from "@/context/QuestionMetaContext";

/* ---- TimeInput Component ---- */
function TimeInput({
  value,
  onChange,
  invalid,
  correct,
}: {
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  correct?: boolean;
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9:]/g, ""))}
      className={`h-12 w-32 bg-white px-3 text-lg font-semibold outline-none
      text-center font-mono tabular-nums rounded-lg
      border-2 ${
        invalid
          ? "border-rose-500 text-rose-700"
          : correct
          ? "border-emerald-600 text-emerald-700"
          : "border-orange-500 text-slate-800"
      }`}
      placeholder="00:00"
    />
  );
}

/* ---- ArrType_22 Component ---- */
type Row = {
  id: number;
  text: string;
  expectedTime: string;
};

const DUMMY_DATA: Row[] = [
  { id: 1, text: "It is quarter to 10 in the evening It is quarter to 10 in the evening It is quarter to 10 in the evening.", expectedTime: "21:45" },
  { id: 2, text: "It is 2 o'clock in the afternoon.", expectedTime: "14:00" },
  { id: 3, text: "It is half past 2 in the night.", expectedTime: "02:30" },
  { id: 4, text: "It is quarter to 6 in the afternoon.", expectedTime: "17:45" },
  { id: 5, text: "It is quarter past 7 in the morning.", expectedTime: "07:15" },
  
  { id: 6, text: "It is quarter to 10 in the evening.", expectedTime: "21:45" },
  { id: 7, text: "It is quarter to 10 in the evening.", expectedTime: "21:45" },
];

const HINT_TEXT = "Remember to use a 24-hour clock and format it as HH:MM.";

export default function ArrType_22() {
  type Status = "idle" | "match" | "wrong";

  const [state, setState] = useState<Record<number, { val: string; checked: boolean }>>(() => {
    const init: Record<number, { val: string; checked: boolean }> = {};
    DUMMY_DATA.forEach((r) => (init[r.id] = { val: "", checked: false }));
    return init;
  });

  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);
  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  const setVal = (id: number, v: string) =>
    setState((s) => {
      const next = { ...s };
      next[id] = { ...next[id], val: v };
      return next;
    });

  const handleCheckAll = () => {
    let anyWrong = false;
    let allFilledAndCorrect = true;

    setState((s) => {
      const next: typeof s = { ...s };
      for (const r of DUMMY_DATA) {
        const isCorrect = next[r.id].val.trim() === r.expectedTime;
        if (!isCorrect) anyWrong = true;
        if (next[r.id].val.trim() === "") allFilledAndCorrect = false;
        next[r.id] = { ...next[r.id], checked: true };
      }
      setStatus(!anyWrong && allFilledAndCorrect ? "match" : "wrong");
      addResult({ id: qId, title: qTitle }, !anyWrong && allFilledAndCorrect);
      return next;
    });
  };

  const handleShowSolution = () => {
    setState((s) => {
      const next: typeof s = { ...s };
      for (const r of DUMMY_DATA) {
        next[r.id] = { val: r.expectedTime, checked: true };
      }
      return next;
    });
    setStatus("match");
  };

  interface Summary {
    text: string;
    color: string;
    bgColor: string;
    borderColor: string;
  }

  const summary: Summary | null =
    status === "match"
      ? {
          text: "🎉 All correct! Great job.",
          color: "text-green-700",
          bgColor: "bg-green-100",
          borderColor: "border-green-600",
        }
      : status === "wrong"
      ? {
          text: "❌ Some answers are wrong. Check again.",
          color: "text-red-700",
          bgColor: "bg-red-100",
          borderColor: "border-red-600",
        }
      : null;

  return (
    <div className="flex flex-col items-start justify-start space-y-8 w-full px-4 py-8">
      {/* Header */}
      <div className="text-left w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-2">Question 1</h2>
        <p className="text-slate-600 text-lg">
          What time is it? <br /> Fill in the digital time.
        </p>
      </div>

      {/* Questions */}
      <div className="flex flex-wrap justify-start gap-6 ">
        {DUMMY_DATA.map((r) => {
          const st = state[r.id];
          const isInvalid = st.checked && st.val.trim() !== r.expectedTime;
          const isCorrect = st.checked && st.val.trim() === r.expectedTime && st.val.trim() !== "";
          return (
            <div
              key={r.id}
              className="w-64 rounded-2xl bg-amber-50/60 p-6 flex flex-col items-center justify-between text-center min-h-[16rem] shadow-md"
            >
              <p className="text-lg text-slate-700 mb-4">{r.text}</p>
              <TimeInput value={st.val} onChange={(v) => setVal(r.id, v)} invalid={isInvalid} correct={isCorrect} />
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-start space-y-4 w-full max-w-xl">
        <Controllers
          handleCheck={handleCheckAll}
          handleShowSolution={handleShowSolution}
          handleShowHint={() => setShowHint((v) => !v)}
        />
        {showHint && <Hint hint={HINT_TEXT} />}
        <Check summary={summary} />
      </div>
    </div>
  );
}
