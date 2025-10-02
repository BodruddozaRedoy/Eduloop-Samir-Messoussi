import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Row = {
  id: string;
  hundreds: number;
  tens: number;
  ones: number;
  amount: number; // correct total
};

type Props = {
  data?: Row[];
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
const DEFAULT_DATA: Row[] = [
  { id: "r1", hundreds: 7, tens: 4, ones: 9, amount: 749 },
  { id: "r2", hundreds: 8, tens: 1, ones: 3, amount: 813 },
  { id: "r3", hundreds: 4, tens: 0, ones: 6, amount: 406 },
];

const DEFAULT_HINT =
  "Multiply the number of notes/coins by their values and add them up.";

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
      className={`w-24 text-center border-b-2 border-dotted focus:outline-none ${border}`}
    />
  );
};

/* ---------------- Main ---------------- */
const ArrType_121: React.FC<Props> = ({ data, hint }) => {
  const DATA =  DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;

  const [values, setValues] = useState<string[]>(() => DATA.map(() => ""));
  const [ok, setOk] = useState<(boolean | null)[]>(() => DATA.map(() => null));
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  /* Reset when data changes */
  useEffect(() => {
    setValues(DATA.map(() => ""));
    setOk(DATA.map(() => null));
    setStatus("idle");
    setShowHint(false);
  }, [data]);

  /* -------- Handlers -------- */
  const handleCheck = useCallback(() => {
    const res = DATA.map((row, i) => values[i] === String(row.amount));
    setOk(res);
    setStatus(res.every(Boolean) ? "match" : "wrong");
  }, [DATA, values]);

  const handleShowSolution = useCallback(() => {
    setValues(DATA.map((r) => String(r.amount)));
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
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Question 1</h2>
      <p className="text-sm text-slate-600">
        How many 100 euro and 10 euro notes and 1 euro coins?
      </p>

      {showHint && (
        <div className="p-2 bg-yellow-50 border border-yellow-300 rounded text-sm">
          {help}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="border border-orange-300 text-center w-full">
          <thead>
            <tr className="bg-orange-50">
              <th className="border p-2">
                <img
                  src="/images/arrtype121100euro.png"
                  alt="100 euro"
                  className="h-10 mx-auto"
                />
              </th>
              <th className="border p-2">
                <img
                  src="/images/arrtype12110euro.png"
                  alt="10 euro"
                  className="h-10 mx-auto"
                />
              </th>
              <th className="border p-2">
                <img
                  src="/images/arrtype1211euro.png"
                  alt="1 euro"
                  className="h-10 mx-auto"
                />
              </th>
              <th className="border p-2">amount</th>
            </tr>
          </thead>
          <tbody>
            {DATA.map((row, i) => (
              <tr key={row.id}>
                <td className="border p-2">{row.hundreds}</td>
                <td className="border p-2">{row.tens}</td>
                <td className="border p-2">{row.ones}</td>
                <td className="border p-2">
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
                  />{" "}
                  euro
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArrType_121;
