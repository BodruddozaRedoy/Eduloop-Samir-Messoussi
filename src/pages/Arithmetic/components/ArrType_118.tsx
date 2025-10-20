import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type RatioRow = {
  id: string;
  label: string;
  packs: number[];
  values: number[];
};

type Props = {
  data?: RatioRow[];
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
const DEFAULT_DATA: RatioRow[] = [
  {
    id: "biscuits",
    label: "Pakken",
    packs: [3, 6, 12, 120],
    values: [12, 24, 48, 480],
  },
  {
    id: "pizzas",
    label: "pizza’s",
    packs: [2, 6, 12, 60],
    values: [8, 24, 48, 240],
  },
];

const DEFAULT_HINT =
  "Use the ratio from the first pack/pizza to calculate the rest of the row. Multiply both numerator and denominator equally.";

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

/* ---------------- Main ---------------- */
const ArrType_118: React.FC<Props> = ({ data, hint }) => {
  const DATA =  DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;

  const [values, setValues] = useState(() =>
    DATA.map((row) => row.values.map(() => ""))
  );
  const [ok, setOk] = useState(() =>
    DATA.map((row) => row.values.map(() => null as boolean | null))
  );

  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);



  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  /* -------- Handlers -------- */
  const handleCheck = useCallback(() => {
    const res = DATA.map((row, rIdx) =>
      row.values.map((correct, cIdx) => values[rIdx][cIdx] === String(correct))
    );
    setOk(res);

    const allCorrect = res.every((row) => row.every((cell) => cell));
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },allCorrect);
  }, [DATA, values]);

  const handleShowSolution = useCallback(() => {
    setValues(DATA.map((row) => row.values.map((v) => String(v))));
    setOk(DATA.map((row) => row.values.map(() => true)));
    setStatus("match");
  }, [DATA]);

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
      handleShowHint: () => setShowHint((prev) => !prev),
      hint: help,
      showHint,
      summary,
    });
  }, [setControls, handleCheck, handleShowSolution, help, showHint, summary]);

  /* -------- Render -------- */
  return (
    <div className="space-y-8">
      <div>
        {/* <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">
          How much? Think for yourself. <span className="text-orange-500">For example:</span>
        </p> */}
      </div>

      <div className="grid grid-cols-2 gap-12">
        {DATA.map((row, rIdx) => (
          <div key={row.id} className="space-y-4">
            <div className="bg-slate-100 p-2 text-sm">{row.packs[0]} {row.label.toLowerCase()} cost {row.values[0]}.</div>
            <table className="w-full border border-slate-300 text-center">
              <thead className="bg-orange-50">
                <tr>
                  <th className="p-2 border">{row.label}</th>
                  {row.packs.map((p, i) => (
                    <th key={i} className="p-2 border">{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">prijs</td>
                  {row.values.map((_, cIdx) => (
                    <td key={cIdx} className="p-2 border">
                      <NumberInput
                        value={values[rIdx][cIdx]}
                        onChange={(val) =>
                          setValues((prev) => {
                            const cp = [...prev];
                            cp[rIdx][cIdx] = val;
                            return cp;
                          })
                        }
                        ok={ok[rIdx][cIdx]}
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ArrType_118;
