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
      text-center font-mono tabular-nums
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

// Dummy data for demonstration purposes
const DUMMY_DATA: Row[] = [
  { id: 1, text: "It is 2 o'clock in the afternoon.", expectedTime: "14:00" },
  { id: 2, text: "It is half past 2 in the night.", expectedTime: "02:30" },
  { id: 3, text: "It is quarter to 6 in the afternoon.", expectedTime: "17:45" },
  { id: 4, text: "It is quarter past 7 in the morning.", expectedTime: "07:15" },
  { id: 5, text: "It is quarter to 10 in the evening.", expectedTime: "21:45" },
];

const HINT_TEXT = "Remember to use a 24-hour clock and format it as HH:MM.";

export default function ArrType_22() {
  type Status = "idle" | "match" | "wrong";

  const [state, setState] = useState<
    Record<number, { val: string; checked: boolean }>
  >(() => {
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
      return next;
    });

    const ok = !anyWrong && allFilledAndCorrect;
    setStatus(ok ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, ok);
  };

  const handleShowSolution = () => {
    setState((s) => {
      const next: typeof s = { ...s };
      for (const r of DUMMY_DATA) {
        next[r.id] = {
          val: r.expectedTime,
          checked: true,
        };
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
    <div className="">
      <h2 className="text-2xl font-bold">Question 1</h2>
      <p className="mb-4 text-slate-600">
        What time is it?<br />Fill in the digital time.
      </p>

      <div className="flex flex-wrap items-stretch justify-start gap-4">
        {DUMMY_DATA.map((r) => {
          const st = state[r.id];
          const isInvalid = st.checked && st.val.trim() !== r.expectedTime;
          const isCorrect =
            st.checked && st.val.trim() === r.expectedTime && st.val.trim() !== "";
          return (
            <div
              key={r.id}
              className="w-56 rounded-2xl bg-amber-50/60 p-4 flex flex-col items-center justify-between text-center min-h-[16rem]"
            >
              <p className="text-lg text-slate-700 mb-4">{r.text}</p>
              <TimeInput
                value={st.val}
                onChange={(v) => setVal(r.id, v)}
                invalid={isInvalid}
                correct={isCorrect}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <Controllers
          handleCheck={handleCheckAll}
          handleShowSolution={handleShowSolution}
          handleShowHint={() => setShowHint((v) => !v)}
        />
        <br />
        {showHint && <Hint hint={HINT_TEXT} />}
        <br />
        <Check summary={summary} />
      </div>
    </div>
  );
}