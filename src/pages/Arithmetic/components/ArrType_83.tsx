import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Status = "idle" | "match" | "wrong";
interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

/* ---------------- Static Data ---------------- */
const DATA = [
  { id: "c1", img: "/images/arrtype83cake1.png", denominator: 5 },
  { id: "c2", img: "/images/arrtype83pizza1.png", denominator: 4 },
  { id: "c3", img: "/images/arrtype83cake2.png", denominator: 3 },
  { id: "c4", img: "/images/arrtype83pizza2.png", denominator: 6 },
];

const DEFAULT_HINT =
  "Write the correct fraction for one piece (like 1/5, 1/4, etc.).";

/* ---------------- Fraction Input ---------------- */
const FractionInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  ok: boolean | null;
}> = ({ value, onChange, ok }) => {
  const [num = "", den = ""] = value.split("/");

  const border =
    ok === null
      ? "border-slate-300"
      : ok
      ? "border-green-500 text-green-600"
      : "border-red-500 text-red-600";

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex flex-col items-center">
        <input
          type="text"
          value={num}
          onChange={(e) =>
            onChange(`${e.target.value.replace(/[^0-9]/g, "")}/${den}`)
          }
          className={`w-8 text-center ${border}`}
        />
        <div className="w-8 h-px bg-black my-0.5" />
        <input
          type="text"
          value={den}
          onChange={(e) =>
            onChange(`${num}/${e.target.value.replace(/[^0-9]/g, "")}`)
          }
          className={`w-8 text-center ${border}`}
        />
      </div>
      <span className="ml-2">cake.</span>
    </div>
  );
};

/* ---------------- Component ---------------- */
const ArrType_83: React.FC = () => {
  const help = DEFAULT_HINT;

  const [answers, setAnswers] = useState<string[]>(() => DATA.map(() => ""));
  const [ok, setOk] = useState<(boolean | null)[]>(() => DATA.map(() => null));
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  // reset
  useEffect(() => {
    setAnswers(DATA.map(() => ""));
    setOk(DATA.map(() => null));
    setStatus("idle");
    setShowHint(false);
  }, []);

  /* -------- Handlers -------- */
  const handleCheck = useCallback(() => {
    const results = DATA.map(
      (c, i) => answers[i].trim() === `1/${c.denominator}`
    );
    setOk(results);
    setStatus(results.every(Boolean) ? "match" : "wrong");
  }, [answers]);

  const handleShowSolution = useCallback(() => {
    setAnswers(DATA.map((c) => `1/${c.denominator}`));
    setOk(DATA.map(() => true));
    setStatus("match");
  }, []);

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
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">
          Divide into equal pieces. <span className="text-orange-500">For example:</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {DATA.map((c, i) => (
          <div
            key={c.id}
            className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-lg"
          >
            <img
              src={c.img}
              alt={`divided into ${c.denominator} pieces`}
              className="w-32 h-32 object-contain"
            />
            <p className="text-slate-800">in {c.denominator} pieces</p>
            <div className="flex items-center">
              <span className="mr-1">1 piece is</span>
              <FractionInput
                value={answers[i]}
                onChange={(val) => {
                  const cp = [...answers];
                  cp[i] = val;
                  setAnswers(cp);
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
        ))}
      </div>
    </div>
  );
};

export default ArrType_83;
