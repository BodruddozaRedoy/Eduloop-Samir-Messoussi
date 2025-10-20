import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Problem = {
  id: string;
  circles: number;
  partsPerCircle: number;
  shadedParts: number;
  simplified: string; // e.g. "1 1/2", "2", "2 1/4"
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
    circles: 2,
    partsPerCircle: 4,
    shadedParts: 6,
    simplified: "1 1/2",
  },
  {
    id: "p2",
    circles: 2,
    partsPerCircle: 3,
    shadedParts: 5,
    simplified: "1 2/3",
  },
  { id: "p3", circles: 2, partsPerCircle: 5, shadedParts: 10, simplified: "2" },
  {
    id: "p4",
    circles: 3,
    partsPerCircle: 4,
    shadedParts: 9,
    simplified: "2 1/4",
  },
];

const DEFAULT_HINT =
  "Count shaded parts (numerator) and total parts in one circle (denominator). Then simplify.";

/* ---------------- Circle Component ---------------- */
const Circle: React.FC<{ parts: number; shaded: number }> = ({
  parts,
  shaded,
}) => {
  const wedges = Array.from({ length: parts }, (_, i) => i);
  return (
    <svg width="60" height="60" viewBox="0 0 100 100">
      {wedges.map((_, i) => {
        const angle = (2 * Math.PI * i) / parts;
        const x1 = 50 + 50 * Math.cos(angle);
        const y1 = 50 + 50 * Math.sin(angle);
        const x2 = 50 + 50 * Math.cos(angle + (2 * Math.PI) / parts);
        const y2 = 50 + 50 * Math.sin(angle + (2 * Math.PI) / parts);
        const path = `M50,50 L${x1},${y1} A50,50 0 0 1 ${x2},${y2} Z`;
        return (
          <path
            key={i}
            d={path}
            fill={i < shaded ? "#f97316" : "white"}
            stroke="red"
            strokeWidth="0.5"
          />
        );
      })}
    </svg>
  );
};

/* ---------------- Fraction Input ---------------- */
const FractionInput: React.FC<{
  value: string; // "a/b"
  onChange: (val: string) => void;
  ok: boolean | null;
}> = ({ value, onChange, ok }) => {
  const [num = "", den = ""] = value.split("/");

  const border =
    ok === null
      ? "border-slate-400"
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
        className={`w-10 text-center focus:outline-none ${border}`}
      />
      <div className={`w-10 h-px ${ok ? "bg-green-500" : "bg-black"}`} />
      <input
        type="text"
        value={den}
        onChange={(e) =>
          onChange(`${num}/${e.target.value.replace(/[^0-9]/g, "")}`)
        }
        className={`w-10 text-center focus:outline-none ${border}`}
      />
    </div>
  );
};

/* ---------------- Mixed Fraction Input ---------------- */
const MixedFractionInput: React.FC<{
  value: string; // "w n/d"
  onChange: (val: string) => void;
  ok: boolean | null;
}> = ({ value, onChange, ok }) => {
  const [whole = "", frac = ""] = value.trim().split(" ");
  const [num = "", den = ""] = frac.split("/");

  const border =
    ok === null
      ? "border-slate-400"
      : ok
      ? "border-green-500 text-green-600"
      : "border-red-500 text-red-600";

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={whole}
        onChange={(e) =>
          onChange(`${e.target.value.replace(/[^0-9]/g, "")} ${num}/${den}`)
        }
        className={`w-8 text-center border-b focus:outline-none ${border}`}
      />
      <div className="flex flex-col items-center">
        <input
          type="text"
          value={num}
          onChange={(e) =>
            onChange(`${whole} ${e.target.value.replace(/[^0-9]/g, "")}/${den}`)
          }
          className={`w-10 text-center focus:outline-none ${border}`}
        />
        <div className={`w-10 h-px ${ok ? "bg-green-500" : "bg-black"}`} />
        <input
          type="text"
          value={den}
          onChange={(e) =>
            onChange(`${whole} ${num}/${e.target.value.replace(/[^0-9]/g, "")}`)
          }
          className={`w-10 text-center focus:outline-none ${border}`}
        />
      </div>
    </div>
  );
};

/* ---------------- Main Component ---------------- */
const ArrType_89: React.FC<Props> = ({ data, hint }) => {
  // const DATA = data?.length ? data : DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;
  const DATA = DEFAULT_DATA;

  const [improper, setImproper] = useState<string[]>(() => DATA.map(() => ""));
  const [simplified, setSimplified] = useState<string[]>(() =>
    DATA.map(() => "")
  );
  const [ok, setOk] = useState<(boolean | null)[]>(() => DATA.map(() => null));
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setImproper(DATA.map(() => ""));
    setSimplified(DATA.map(() => ""));
    setOk(DATA.map(() => null));
    setStatus("idle");
    setShowHint(false);
  }, [DATA]);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const handleCheck = useCallback(() => {
    const results = DATA.map((p, i) => {
      const expectedImproper = `${p.shadedParts}/${p.partsPerCircle}`;
      const userImproper = improper[i].replace(/\s/g, "");
      const userSimplified = simplified[i].replace(/\s/g, "");
      return (
        userImproper === expectedImproper &&
        userSimplified.toLowerCase() ===
          p.simplified.replace(/\s/g, "").toLowerCase()
      );
    });
    setOk(results);
    setStatus(results.every(Boolean) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },results.every(Boolean));
  }, [DATA, improper, simplified]);

  const handleShowSolution = useCallback(() => {
    setImproper(DATA.map((p) => `${p.shadedParts}/${p.partsPerCircle}`));
    setSimplified(DATA.map((p) => p.simplified));
    setOk(DATA.map(() => true));
    setStatus("match");
  }, [DATA]);

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

  return (
    <div className="space-y-10">
      <div>
        {/* <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">
          Which fraction? Remove the wholes.
        </p> */}
      </div>

      <div className="grid grid-cols-2 gap-10">
        {DATA.map((p, pi) => (
          <div key={p.id} className="flex flex-col items-center gap-3">
            {/* Circles */}
            <div className="flex gap-2">
              {Array.from({ length: p.circles }).map((_, ci) => {
                const shadedInThis = Math.min(
                  Math.max(p.shadedParts - ci * p.partsPerCircle, 0),
                  p.partsPerCircle
                );
                return (
                  <Circle
                    key={ci}
                    parts={p.partsPerCircle}
                    shaded={shadedInThis}
                  />
                );
              })}
            </div>

            {/* Improper + Simplified fraction */}
            <div className="flex items-center gap-2">
              <FractionInput
                value={improper[pi]}
                onChange={(val) =>
                  setImproper((prev) => {
                    const cp = [...prev];
                    cp[pi] = val;
                    return cp;
                  })
                }
                ok={ok[pi]}
              />
              <span>=</span>
              <MixedFractionInput
                value={simplified[pi]}
                onChange={(val) =>
                  setSimplified((prev) => {
                    const cp = [...prev];
                    cp[pi] = val;
                    return cp;
                  })
                }
                ok={ok[pi]}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrType_89;
