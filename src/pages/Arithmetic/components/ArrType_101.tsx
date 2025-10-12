import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Problem = {
  id: string;
  img: string;
  answer: number;
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
  { id: "p1", img: "/images/arrtype101value50.png", answer: 50 },
  { id: "p2", img: "/images/arrtype101value25.png", answer: 25 },
  { id: "p3", img: "/images/arrtype101value10.png", answer: 10 },
  { id: "p4", img: "/images/arrtype101value15.png", answer: 15 },
];

const DEFAULT_HINT =
  "Look at the liquid level in the jug compared to the 100 ml scale. Estimate the value in millilitres.";

/* ---------------- Input ---------------- */
const NumberInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  ok: boolean | null;
}> = ({ value, onChange, ok }) => {
  const border =
    ok === null
      ? "border-slate-400"
      : ok
      ? "border-green-500 text-green-600"
      : "border-red-500 text-red-600";

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
      className={`w-16 text-center border-b-2 border-dotted focus:outline-none ${border}`}
    />
  );
};

/* ---------------- Main Component ---------------- */
const ArrType_101: React.FC<Props> = ({ data, hint }) => {
  const DATA = DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;

  const [values, setValues] = useState<string[]>(() =>
    DATA.map(() => "")
  );
  const [ok, setOk] = useState<(boolean | null)[]>(() =>
    DATA.map(() => null)
  );
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setValues(DATA.map(() => ""));
    setOk(DATA.map(() => null));
    setStatus("idle");
    setShowHint(false);
  }, [data]);

  /* -------- Handlers -------- */
  const handleCheck = useCallback(() => {
    const results = DATA.map((p, i) => Number(values[i]) === p.answer);
    setOk(results);
    setStatus(results.every(Boolean) ? "match" : "wrong");
  }, [DATA, values]);

  const handleShowSolution = useCallback(() => {
    setValues(DATA.map((p) => String(p.answer)));
    setOk(DATA.map(() => true));
    setStatus("match");
  }, [DATA]);

  const handleShowHint = useCallback(() => {
    setShowHint((prev) => !prev);
  }, []);

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
  }, [
    setControls,
    handleCheck,
    handleShowSolution,
    handleShowHint,
    help,
    showHint,
    summary,
  ]);

  /* -------- Render -------- */
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">
          How much is there approximately in the measuring jug?
        </p>
      </div>

      <div className="flex gap-8 justify-center">
        {DATA.map((p, i) => (
          <div key={p.id} className="flex flex-col items-center gap-2">
            <img src={p.img} alt={`jug-${p.id}`} className="h-40 object-contain" />
            <div className="flex items-center gap-1 text-lg">
              <NumberInput
                value={values[i]}
                onChange={(val) =>
                  setValues((prev) => {
                    const cp = [...prev];
                    cp[i] = val;
                    return cp;
                  })
                }
                ok={ok[i]}
              />
              <span>ml</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrType_101;
