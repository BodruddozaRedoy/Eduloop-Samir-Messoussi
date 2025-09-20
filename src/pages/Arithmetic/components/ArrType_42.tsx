import euro100 from "@/assets/images/arritype42100euro.png";
import euro10 from "@/assets/images/arritype4210euro.png";
import euro1 from "@/assets/images/arritype421euro.png";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* -----------------------------
   Demo data & hint
------------------------------ */
type SplitRow = { amount: number; hundreds: number; tens: number; ones: number };
type CombineRow = { hundreds: number; tens: number; ones: number; amount: number };

// classic example 749 = 7×100 + 4×10 + 9×1
const SPLIT_ROWS: SplitRow[] = [
  { amount: 749, hundreds: 7, tens: 4, ones: 9 },
  { amount: 749, hundreds: 7, tens: 4, ones: 9 },
  { amount: 749, hundreds: 7, tens: 4, ones: 9 },
];

const COMBINE_ROWS: CombineRow[] = [
  { hundreds: 7, tens: 4, ones: 9, amount: 749 },
  { hundreds: 7, tens: 4, ones: 9, amount: 749 },
  { hundreds: 7, tens: 4, ones: 9, amount: 749 },
];

const DEFAULT_HINT =
  "Use 100-euro notes, 10-euro notes, and 1-euro coins. Example: 7×100 + 4×10 + 9×1 = 749.";

/* -----------------------------
   Helpers & types
------------------------------ */
type Status = "idle" | "match" | "wrong";

interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const euroFmt = (n: number) =>
  `${n.toLocaleString(undefined, { maximumFractionDigits: 0 })} euro`;

const onlyNum = (s: string) => s.replace(/[^\d]/g, "");

/* -----------------------------
   Component
------------------------------ */
const ArrType_42: React.FC = () => {
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [checked, setChecked] = useState(false);

  // Inputs for "Splits." (counts per denomination)
  const [splitAns, setSplitAns] = useState<{ hundreds: string; tens: string; ones: string }[]>(
    () => SPLIT_ROWS.map(() => ({ hundreds: "", tens: "", ones: "" }))
  );

  // Inputs for "Voeg samen." (amount)
  const [combineAns, setCombineAns] = useState<string[]>(() => COMBINE_ROWS.map(() => ""));

  // Per-cell correctness
  const [splitOK, setSplitOK] = useState<{ hundreds: boolean; tens: boolean; ones: boolean }[]>(
    () => SPLIT_ROWS.map(() => ({ hundreds: false, tens: false, ones: false }))
  );
  const [combineOK, setCombineOK] = useState<boolean[]>(() => COMBINE_ROWS.map(() => false));

  // setters
  const setSplit = useCallback(
    (i: number, field: "hundreds" | "tens" | "ones", value: string) => {
      setSplitAns((prev) => {
        const cp = [...prev];
        cp[i] = { ...cp[i], [field]: onlyNum(value) };
        return cp;
      });
    },
    []
  );

  const setCombine = useCallback((i: number, value: string) => {
    setCombineAns((prev) => {
      const cp = [...prev];
      cp[i] = onlyNum(value);
      return cp;
    });
  }, []);

  // actions
  const handleCheck = useCallback(() => {
    // Validate split table
    const splitRes = SPLIT_ROWS.map((row, i) => ({
      hundreds: Number(splitAns[i].hundreds) === row.hundreds,
      tens: Number(splitAns[i].tens) === row.tens,
      ones: Number(splitAns[i].ones) === row.ones,
    }));
    setSplitOK(splitRes);

    // Validate combine table
    const combRes = COMBINE_ROWS.map((row, i) => Number(combineAns[i]) === row.amount);
    setCombineOK(combRes);

    setChecked(true);

    const allGood =
      splitRes.every((r) => r.hundreds && r.tens && r.ones) && combRes.every(Boolean);
    setStatus(allGood ? "match" : "wrong");
  }, [splitAns, combineAns]);

  const handleShowSolution = useCallback(() => {
    setSplitAns(
      SPLIT_ROWS.map((r) => ({
        hundreds: String(r.hundreds),
        tens: String(r.tens),
        ones: String(r.ones),
      }))
    );
    setCombineAns(COMBINE_ROWS.map((r) => String(r.amount)));
    setSplitOK(SPLIT_ROWS.map(() => ({ hundreds: true, tens: true, ones: true })));
    setCombineOK(COMBINE_ROWS.map(() => true));
    setChecked(true);
    setStatus("match");
  }, []);

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
        text: "Some answers are wrong. Check again.",
        color: "text-red-700",
        bgColor: "bg-red-100",
        borderColor: "border-red-600",
      };
    return null;
  }, [status]);

  // expose to GLOBAL controllers (no local Hint/Check/Controllers in DOM)
  const { setControls } = useQuestionControls();
  const controls = useMemo(
    () => ({
      handleCheck,
      handleShowHint,
      handleShowSolution,
      hint: DEFAULT_HINT,
      showHint,
      summary,
    }),
    [handleCheck, handleShowHint, handleShowSolution, showHint, summary]
  );
  useEffect(() => {
    setControls(controls);
  }, [controls, setControls]);

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">
          How many 100 euro and 10 euro notes and 1 euro coins?
        </p>
      </div>

      {/* Two tables */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: Splits */}
        <div>
          <p className="mb-2 text-sm text-slate-700">Splits.</p>
          <div className="overflow-x-auto rounded-lg p-2">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-slate-700">
                  <th className="w-32 rounded-tl-lg border border-orange-200 bg-slate-50 px-3 py-2 text-left">
                    bedrag
                  </th>
                  <th className="border border-orange-200 bg-slate-50 px-3 py-2">
                    <img src={euro100} alt="100 euro" className="mx-auto h-6" />
                  </th>
                  <th className="border border-orange-200 bg-slate-50 px-3 py-2">
                    <img src={euro10} alt="10 euro" className="mx-auto h-6" />
                  </th>
                  <th className="rounded-tr-lg border border-orange-200 bg-slate-50 px-3 py-2">
                    <img src={euro1} alt="1 euro" className="mx-auto h-6" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {SPLIT_ROWS.map((row, i) => {
                  const c = splitOK[i];
                  const cell = (
                    ok: boolean,
                    val: string,
                    onChange: (v: string) => void
                  ) => (
                    <input
                      value={val}
                      onChange={(e) => onChange(e.target.value)}
                      inputMode="numeric"
                      className={`mx-auto block w-12 rounded-md border px-2 py-1 text-center outline-none ${
                        !checked
                          ? "border-slate-300 text-slate-800"
                          : ok
                          ? "border-emerald-400 text-emerald-600"
                          : "border-rose-400 text-rose-600"
                      }`}
                    />
                  );

                  return (
                    <tr key={i} className="text-slate-800">
                      <td className="border border-orange-200 px-3 py-2">
                        {euroFmt(row.amount)}
                      </td>
                      <td className="border border-orange-200 px-3 py-2 text-center">
                        {cell(c.hundreds, splitAns[i].hundreds, (v) =>
                          setSplit(i, "hundreds", v)
                        )}
                      </td>
                      <td className="border border-orange-200 px-3 py-2 text-center">
                        {cell(c.tens, splitAns[i].tens, (v) => setSplit(i, "tens", v))}
                      </td>
                      <td className="border border-orange-200 px-3 py-2 text-center">
                        {cell(c.ones, splitAns[i].ones, (v) => setSplit(i, "ones", v))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Combine */}
        <div>
          <p className="mb-2 text-sm text-slate-700">Voeg samen.</p>
          <div className="overflow-x-auto rounded-lg p-2">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-slate-700">
                  <th className="rounded-tl-lg border border-orange-200 bg-slate-50 px-3 py-2">
                    <img src={euro100} alt="100 euro" className="mx-auto h-6" />
                  </th>
                  <th className="border border-orange-200 bg-slate-50 px-3 py-2">
                    <img src={euro10} alt="10 euro" className="mx-auto h-6" />
                  </th>
                  <th className="border border-orange-200 bg-slate-50 px-3 py-2">
                    <img src={euro1} alt="1 euro" className="mx-auto h-6" />
                  </th>
                  <th className="w-32 rounded-tr-lg border border-orange-200 bg-slate-50 px-3 py-2 text-left">
                    bedrag
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMBINE_ROWS.map((row, i) => {
                  const okFlag = combineOK[i];
                  const amtInputCls = !checked
                    ? "border-slate-300 text-slate-800"
                    : okFlag
                    ? "border-emerald-400 text-emerald-600"
                    : "border-rose-400 text-rose-600";
                  return (
                    <tr key={i} className="text-slate-800">
                      <td className="border border-orange-200 px-3 py-2 text-center">
                        {row.hundreds}
                      </td>
                      <td className="border border-orange-200 px-3 py-2 text-center">
                        {row.tens}
                      </td>
                      <td className="border border-orange-200 px-3 py-2 text-center">
                        {row.ones}
                      </td>
                      <td className="border border-orange-200 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <input
                            value={combineAns[i]}
                            onChange={(e) => setCombine(i, e.target.value)}
                            inputMode="numeric"
                            className={`w-24 rounded-md border px-2 py-1 text-right outline-none ${amtInputCls}`}
                          />
                          <span
                            className={`${
                              checked
                                ? okFlag
                                  ? "text-emerald-600"
                                  : "text-rose-600"
                                : "text-slate-600"
                            }`}
                          >
                            euro
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* No local Hint/Check/Controllers — global UI uses the exposed controls */}
    </div>
  );
};

export default ArrType_42;
