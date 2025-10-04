import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type JumpRow = {
  id: string;
  name: string;
  jumps?: (string | number)[]; // make optional, in case some rows don't pass jumps
};

type Props = {
  data?: JumpRow[];
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
const DEFAULT_DATA: JumpRow[] = [
  { id: "r1", name: "Dingena", jumps: [2.96, 1.13, 2.6] },
  { id: "r2", name: "Jeroen", jumps: [2.61, 1.84, 2.12] },
  { id: "r3", name: "Sonja", jumps: [2.46, 2.13, 2.76] },
  { id: "r4", name: "Niels", jumps: ["invalid", 1.96, 0.3] },
];

const DEFAULT_HINT =
  "Calculate each row’s average (ignore 'invalid'). Then calculate the group average.";

/* ---------------- Helpers ---------------- */
const calcAverage = (values?: (string | number)[]): number => {
  if (!Array.isArray(values) || values.length === 0) return 0;
  const nums = values.filter((v) => typeof v === "number") as number[];
  if (nums.length === 0) return 0;
  return parseFloat(
    (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2)
  );
};

/* ---------------- Main Component ---------------- */
const ArrType_115: React.FC<Props> = ({ data, hint }) => {
  const DATA = DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;

  // ✅ compute averages safely
  const rowAverages = useMemo(
    () => DATA.map((row) => calcAverage(row.jumps ?? [])),
    [DATA]
  );

  const groupAverage = useMemo(
    () =>
      parseFloat(
        (
          rowAverages.reduce((a, b) => a + b, 0) / rowAverages.length
        ).toFixed(2)
      ),
    [rowAverages]
  );

  const [rowValues, setRowValues] = useState<string[]>(() =>
    DATA.map(() => "")
  );
  const [rowOk, setRowOk] = useState<(boolean | null)[]>(() =>
    DATA.map(() => null)
  );

  const [finalValue, setFinalValue] = useState<string>("");
  const [finalOk, setFinalOk] = useState<boolean | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setRowValues(DATA.map(() => ""));
    setRowOk(DATA.map(() => null));
    setFinalValue("");
    setFinalOk(null);
    setStatus("idle");
  }, [DATA]);

  /* -------- Handlers -------- */
  const handleCheck = useCallback(() => {
    const rowResults = DATA.map(
      (_, i) => rowValues[i] === String(rowAverages[i])
    );
    const finalCorrect = finalValue === String(groupAverage);

    setRowOk(rowResults);
    setFinalOk(finalCorrect);

    const allCorrect = rowResults.every(Boolean) && finalCorrect;
    setStatus(allCorrect ? "match" : "wrong");
  }, [rowValues, finalValue, rowAverages, groupAverage, DATA]);

  const handleShowSolution = useCallback(() => {
    setRowValues(rowAverages.map((a) => String(a)));
    setRowOk(DATA.map(() => true));
    setFinalValue(String(groupAverage));
    setFinalOk(true);
    setStatus("match");
  }, [rowAverages, groupAverage, DATA]);

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
      <p className="text-sm text-slate-600">Distances in long jump</p>



      <table className="w-full border text-center">
        <thead className="bg-orange-50">
          <tr>
            <th className="border px-4 py-2">throw</th>
            <th className="border px-4 py-2">Jump 1</th>
            <th className="border px-4 py-2">Jump 2</th>
            <th className="border px-4 py-2">Jump 3</th>
            <th className="border px-4 py-2">average</th>
          </tr>
        </thead>
        <tbody>
          {DATA.map((row, i) => (
            <tr key={row.id}>
              <td className="border px-4 py-2 font-medium">{row.name}</td>
              {(row.jumps ?? []).map((j, idx) => (
                <td key={idx} className="border px-4 py-2">
                  {typeof j === "string" ? j : `${j} metres`}
                </td>
              ))}
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={rowValues[i]}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, "");
                    setRowValues((prev) => {
                      const cp = [...prev];
                      cp[i] = val;
                      return cp;
                    });
                  }}
                  className={`w-20 text-center border-b-2 border-dotted focus:outline-none ${
                    rowOk[i] === null
                      ? "border-slate-400"
                      : rowOk[i]
                      ? "border-green-500 text-green-600"
                      : "border-red-500 text-red-600"
                  }`}
                />{" "}
                metres
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-lg flex items-center gap-5">
        <span>What is the average distance of this group?</span>
        <span> Answer : </span>
        <input
          type="text"
          value={finalValue}
          onChange={(e) =>
            setFinalValue(e.target.value.replace(/[^0-9.]/g, ""))
          }
          className={`w-24 text-center border-b-2 border-dotted focus:outline-none ${
            finalOk === null
              ? "border-slate-400"
              : finalOk
              ? "border-green-500 text-green-600"
              : "border-red-500 text-red-600"
          }`}
        />
        <span>metres</span>
      </div>
    </div>
  );
};

export default ArrType_115;
