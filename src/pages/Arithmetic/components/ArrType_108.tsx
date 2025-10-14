import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Row = {
  id: string;
  numerator: number;
  denominator: number;
  decimal: number;
  percentage: number;
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
  { id: "r1", numerator: 1, denominator: 10, decimal: 0.1, percentage: 10 },
  { id: "r2", numerator: 1, denominator: 2, decimal: 0.5, percentage: 50 },
  { id: "r3", numerator: 2, denominator: 5, decimal: 0.4, percentage: 40 },
  { id: "r4", numerator: 3, denominator: 4, decimal: 0.75, percentage: 75 },
  { id: "r5", numerator: 1, denominator: 4, decimal: 0.25, percentage: 25 },
];

const DEFAULT_HINT =
  "Convert the shaded fraction into a decimal and then into a percentage. Example: 1/2 = 0.5 = 50.";

/* ---------------- Inputs ---------------- */
const FractionInput: React.FC<{
  value: { num: string; den: string };
  onChange: (val: { num: string; den: string }) => void;
  ok: boolean | null;
}> = ({ value, onChange, ok }) => {
  const border =
    ok === null
      ? "border-slate-400"
      : ok
      ? "border-green-500 text-green-600"
      : "border-red-500 text-red-600";

  return (
    <div className="flex flex-col items-center w-12">
      <input
        type="text"
        value={value.num}
        onChange={(e) =>
          onChange({ ...value, num: e.target.value.replace(/[^0-9]/g, "") })
        }
        className={`w-full text-center border-b ${border} focus:outline-none`}
      />
      {/* <div className="w-full border-t-2 border-slate-500 my-[1px]" /> */}
      <input
        type="text"
        value={value.den}
        onChange={(e) =>
          onChange({ ...value, den: e.target.value.replace(/[^0-9]/g, "") })
        }
        className={`w-full text-center ${border} focus:outline-none`}
      />
    </div>
  );
};

const TextInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  ok: boolean | null;
  suffix?: string;
}> = ({ value, onChange, ok, suffix }) => {
  const border =
    ok === null
      ? "border-slate-400"
      : ok
      ? "border-green-500 text-green-600"
      : "border-red-500 text-red-600";

  return (
    <div className="flex items-center justify-center">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
        className={`w-20 text-center border-b-2 border-dotted focus:outline-none ${border}`}
      />
      {suffix && <span className="ml-1">{suffix}</span>}
    </div>
  );
};

/* ---------------- Main Component ---------------- */
const ArrType_108: React.FC<Props> = ({ data, hint }) => {
  const DATA = DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;

  const [values, setValues] = useState(() =>
    DATA.map(() => ({ fracNum: "", fracDen: "", dec: "", perc: "" }))
  );
  const [ok, setOk] = useState(() =>
    DATA.map(() => ({ frac: null, dec: null, perc: null }))
  );
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setValues(DATA.map(() => ({ fracNum: "", fracDen: "", dec: "", perc: "" })));
    setOk(DATA.map(() => ({ frac: null, dec: null, perc: null })));
    setStatus("idle");
    setShowHint(false);
  }, [data]);

  /* -------- Handlers -------- */
  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const handleCheck = useCallback(() => {
    const results = DATA.map((p, i) => {
      const v = values[i];
      return {
        frac:
          v.fracNum === String(p.numerator) &&
          v.fracDen === String(p.denominator),
        dec: v.dec === String(p.decimal),
        perc: v.perc === String(p.percentage), // ✅ compare plain number
      };
    });
    setOk(results);
    setStatus(results.every((r) => r.frac && r.dec && r.perc) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },results.every((r) => r.frac && r.dec && r.perc));
  }, [DATA, values]);

  const handleShowSolution = useCallback(() => {
    setValues(
      DATA.map((p) => ({
        fracNum: String(p.numerator),
        fracDen: String(p.denominator),
        dec: String(p.decimal),
        perc: String(p.percentage), // ✅ only number
      }))
    );
    setOk(DATA.map(() => ({ frac: true, dec: true, perc: true })));
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
      <div>
        {/* <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">
          Which part is coloured? Write as a fraction, decimal, and percentage.
        </p> */}
      </div>

      <table className="w-full border text-center text-sm">
        <thead className="bg-orange-50">
          <tr>
            <th className="border px-3 py-2">Bar</th>
            <th className="border px-3 py-2">Fraction</th>
            <th className="border px-3 py-2">Decimal</th>
            <th className="border px-3 py-2">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {DATA.map((row, i) => (
            <tr key={row.id}>
              <td className="border px-3 py-2">
                <div className="inline-flex">
                  {Array.from({ length: row.denominator }).map((_, j) => (
                    <div
                      key={j}
                      className={`w-6 h-5 border ${
                        j < row.numerator ? "bg-emerald-600" : "bg-white"
                      }`}
                    />
                  ))}
                </div>
              </td>
              <td className="border px-3 py-2">
                <FractionInput
                  value={{
                    num: values[i].fracNum,
                    den: values[i].fracDen,
                  }}
                  onChange={(val) =>
                    setValues((prev) => {
                      const cp = [...prev];
                      cp[i] = { ...cp[i], fracNum: val.num, fracDen: val.den };
                      return cp;
                    })
                  }
                  ok={ok[i].frac}
                />
              </td>
              <td className="border px-3 py-2">
                <TextInput
                  value={values[i].dec}
                  onChange={(val) =>
                    setValues((prev) => {
                      const cp = [...prev];
                      cp[i] = { ...cp[i], dec: val };
                      return cp;
                    })
                  }
                  ok={ok[i].dec}
                />
              </td>
              <td className="border px-3 py-2">
                <TextInput
                  value={values[i].perc}
                  onChange={(val) =>
                    setValues((prev) => {
                      const cp = [...prev];
                      cp[i] = { ...cp[i], perc: val };
                      return cp;
                    })
                  }
                  ok={ok[i].perc}
                  suffix="%"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArrType_108;
