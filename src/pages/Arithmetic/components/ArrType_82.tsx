import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Item = {
  id?: string;
  numerator: number;
  denominator: number;
  label?: string;
};

type Props = {
  data?: Item[];
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
const DEFAULT_ITEMS: Item[] = [
  { id: "c1", numerator: 1, denominator: 4, label: "part" },
  { id: "c2", numerator: 2, denominator: 8, label: "part" },
  { id: "c3", numerator: 1, denominator: 4, label: "part" },
  { id: "c4", numerator: 3, denominator: 4, label: "part" },
];

const DEFAULT_HINT =
  "Write the fraction that matches the shaded orange part.";

/* ---------------- Tiny Circle ---------------- */
const Circle: React.FC<{ numerator: number; denominator: number }> = ({
  numerator,
  denominator,
}) => {
  const radius = 40;
  const slices = Array.from({ length: denominator });
  const angle = (2 * Math.PI) / denominator;

  return (
    <svg width={100} height={100} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={radius} fill="white" stroke="black" />
      {slices.map((_, i) => {
        const startAngle = i * angle - Math.PI / 2;
        const endAngle = (i + 1) * angle - Math.PI / 2;
        const x1 = 50 + radius * Math.cos(startAngle);
        const y1 = 50 + radius * Math.sin(startAngle);
        const x2 = 50 + radius * Math.cos(endAngle);
        const y2 = 50 + radius * Math.sin(endAngle);

        const largeArc = angle > Math.PI ? 1 : 0;
        const pathData = `
          M 50 50
          L ${x1} ${y1}
          A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
          Z
        `;

        return (
          <path
            key={i}
            d={pathData}
            fill={i < numerator ? "#f97316" : "white"}
            stroke="black"
          />
        );
      })}
    </svg>
  );
};

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
    <div className="flex flex-col items-center">
      <input
        type="text"
        value={num}
        onChange={(e) =>
          onChange(`${e.target.value.replace(/[^0-9]/g, "")}/${den}`)
        }
        className={`w-10 text-center ${border}`}
      />
      <div className="w-10 h-px bg-black my-0.5" />
      <input
        type="text"
        value={den}
        onChange={(e) =>
          onChange(`${num}/${e.target.value.replace(/[^0-9]/g, "")}`)
        }
        className={`w-10 text-center ${border}`}
      />
    </div>
  );
};

/* ---------------- Component ---------------- */
const ArrType_82: React.FC<Props> = ({ data:DEFAULT_ITEMS, hint }) => {
  // const DATA = useMemo(
  //   () => (Array.isArray(data) && data.length ? data : DEFAULT_ITEMS),
  //   [data]
  // );
  const DATA = DEFAULT_ITEMS;
  const help = hint ?? DEFAULT_HINT;

  const [answers, setAnswers] = useState<string[]>(() => DATA.map(() => ""));
  const [ok, setOk] = useState<(boolean | null)[]>(() =>
    DATA.map(() => null)
  );
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  // reset on data change
  useEffect(() => {
    setAnswers(DATA.map(() => ""));
    setOk(DATA.map(() => null));
    setStatus("idle");
    setShowHint(false);
  }, [DATA]);

  /* -------- Handlers -------- */
  const handleCheck = useCallback(() => {
    const results = DATA.map(
      (c, i) => answers[i].trim() === `${c.numerator}/${c.denominator}`
    );
    setOk(results);
    setStatus(results.every(Boolean) ? "match" : "wrong");
  }, [DATA, answers]);

  const handleShowSolution = useCallback(() => {
    setAnswers(DATA.map((c) => `${c.numerator}/${c.denominator}`));
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
        <p className="text-sm text-slate-600">which part is coloured?</p>
      </div>

      <div className="flex justify-center gap-10">
        {DATA.map((c, i) => (
          <div key={c.id} className="flex flex-col items-center gap-2">
            <Circle numerator={c.numerator} denominator={c.denominator} />
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
            <span className="text-slate-700">{c.label ?? "part"}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ArrType_82;
