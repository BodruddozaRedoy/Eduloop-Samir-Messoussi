import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type TableRow = {
  id: string;
  packs: number[];
  values: number[]; // correct answers
  label: string; // row header (e.g. "biscuits" or "price")
};

type Props = {
  data?: TableRow[];
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
const DEFAULT_DATA: TableRow[] = [
  {
    id: "biscuits",
    packs: [1, 2, 6, 60],
    values: [8, 16, 48, 480],
    label: "biscuits",
  },
  {
    id: "price",
    packs: [1, 3, 12, 24],
    values: [3, 9, 36, 72],
    label: "price",
  },
];

const DEFAULT_HINT =
  "Multiply the packs by the given rate (8 biscuits per pack, or $3 per pack) to fill in the missing values.";

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
const ArrType_116: React.FC<Props> = ({ data, hint }) => {
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

  useEffect(() => {
    setValues(DATA.map((row) => row.values.map(() => "")));
    setOk(DATA.map((row) => row.values.map(() => null)));
    setStatus("idle");
    setShowHint(false);
  }, [data]);

  /* -------- Handlers -------- */
  const handleCheck = useCallback(() => {
    const res = DATA.map((row, rIdx) =>
      row.values.map((val, cIdx) => values[rIdx][cIdx] === String(val))
    );
    setOk(res);
    const allCorrect = res.every((row) => row.every((cell) => cell));
    setStatus(allCorrect ? "match" : "wrong");
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

  /* -------- Hook into controller -------- */
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
  }, [setControls, handleCheck, handleShowSolution, help, summary, showHint]);

  /* -------- Render -------- */
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">How much?</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {DATA.map((row, rIdx) => (
          <div key={row.id} className="border rounded-md overflow-hidden">
            <div className="bg-slate-100 p-2 text-sm font-medium text-slate-700">
              {row.id === "biscuits"
                ? "There are 8 biscuits in 1 pack."
                : "1 pack costs $3.00"}
            </div>
            <table className="w-full text-center">
              <thead className="bg-orange-50">
                <tr>
                  <th className="p-2 border">packs</th>
                  {row.packs.map((p, i) => (
                    <th key={i} className="p-2 border font-semibold">
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border font-medium">{row.label}</td>
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

export default ArrType_116;
