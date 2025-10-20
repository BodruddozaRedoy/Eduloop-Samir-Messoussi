import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Problem = {
  id: string;
  text: string;
  sum: string;
  answer: string; // can contain units, but we validate only number
};

type Props = {
  data?: Problem[];
  hint?: string;
};

type Status = "idle" | "match" | "wrong";
interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

/* ---------------- Defaults ---------------- */
const DEFAULT_DATA: Problem[] = [
  {
    id: "p1",
    text: "1 dog weighs about 19 kilograms, and 1 cat weighs about 6 kilograms. How much do 6 dogs and 6 cats weigh together?",
    sum: "6 x 25 = 150",
    answer: "150 kilogram",
  },
  {
    id: "p2",
    text: "1 Shirt £19 Tine buys 2 shirts and Sep buys 4. How much do they pay together?",
    sum: "6 x 19 = 114",
    answer: "£ 114",
  },
];

const DEFAULT_HINT = "Write the sum and final answer correctly.";

/* ---------------- Helpers ---------------- */
const extractNumber = (str: string): string => {
  const match = str.match(/\d+/g);
  return match ? match.join("") : "";
};

/* ---------------- Styled Input ---------------- */
const UnderlineInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  ok: boolean | null;
}> = ({ value, onChange, ok }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`border-0 border-b-2 border-dotted focus:outline-none text-center
        ${ok === null ? "border-slate-400" : ok ? "text-green-600 border-green-500" : "text-red-600 border-red-500"}
      `}
    />
  );
};

/* ---------------- Component ---------------- */
const ArrType_88: React.FC<Props> = ({ data, hint }) => {
  // const DATA = data?.length ? data : DEFAULT_DATA;
  const DATA = DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;

  const [sumInputs, setSumInputs] = useState<string[]>(() => DATA.map(() => ""));
  const [ansInputs, setAnsInputs] = useState<string[]>(() => DATA.map(() => ""));
  const [ok, setOk] = useState<(boolean | null)[]>(() => DATA.map(() => null));
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  // reset
  useEffect(() => {
    setSumInputs(DATA.map(() => ""));
    setAnsInputs(DATA.map(() => ""));
    setOk(DATA.map(() => null));
    setStatus("idle");
    setShowHint(false);
  }, [DATA]);

  /* -------- Handlers -------- */
      const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const handleCheck = useCallback(() => {
    const results = DATA.map((p, i) => {
      const correctSum = p.sum.replace(/\s+/g, "").toLowerCase();
      const userSum = sumInputs[i].replace(/\s+/g, "").toLowerCase();

      const correctAnsNum = extractNumber(p.answer);
      const userAnsNum = extractNumber(ansInputs[i]);
      return correctSum === userSum && correctAnsNum === userAnsNum;
    });
    setOk(results);
    setStatus(results.every(Boolean) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },results.every(Boolean));
  }, [DATA, sumInputs, ansInputs]);

  const handleShowSolution = useCallback(() => {
    setSumInputs(DATA.map((p) => p.sum));
    setAnsInputs(DATA.map((p) => extractNumber(p.answer)));
    setOk(DATA.map(() => true));
    setStatus("match");
  }, [DATA]);

  const handleShowHint = useCallback(() => setShowHint((s) => !s), []);

  /* -------- Summary -------- */
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

  /* -------- Register controls -------- */
  const { setControls } = useQuestionControls();
  useEffect(() => {
    setControls({
      handleCheck,
      handleShowSolution,
      handleShowHint,
      hint: help,
      showHint,
      summary,
    });
  }, [setControls, handleCheck, handleShowSolution, handleShowHint, help, showHint, summary]);

  /* -------- Render -------- */
  return (
    <div className="space-y-10">
      <div>
        {/* <h2 className="text-lg font-semibold">Question 5</h2>
        <p className="text-sm text-slate-600">
          Which sum corresponds to this? Calculate it in your notebook.
        </p> */}
      </div>

      {DATA.map((p, i) => (
        <div key={p.id} className="flex flex-col gap-3">
          <div className="bg-orange-100 p-3 rounded-md text-slate-800 max-w-2xl">
            {p.text}
          </div>

          <div className="ml-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-700">sum:</span>
              <UnderlineInput
                value={sumInputs[i]}
                onChange={(val) => {
                  const cp = [...sumInputs];
                  cp[i] = val;
                  setSumInputs(cp);
                  setOk((prev) => {
                    const arr = [...prev];
                    arr[i] = null;
                    return arr;
                  });
                  setStatus("idle");
                }}
                ok={ok[i]}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-700">answer:</span>
              <UnderlineInput
                value={ansInputs[i]}
                onChange={(val) => {
                  const cp = [...ansInputs];
                  cp[i] = val;
                  setAnsInputs(cp);
                  setOk((prev) => {
                    const arr = [...prev];
                    arr[i] = null;
                    return arr;
                  });
                  setStatus("idle");
                }}
                ok={ok[i]}
              />
            </div>
          </div>
        </div>
      ))}

      {showHint && (
        <div className="p-3 border border-amber-300 bg-amber-50 text-amber-800 text-sm rounded">
          {help}
        </div>
      )}
    </div>
  );
};

export default ArrType_88;
