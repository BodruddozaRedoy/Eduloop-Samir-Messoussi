import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* -----------------------------
   Data & hint (top of file)
------------------------------ */
interface DataItem {
  totalPrice: number;          // 100%
  buyingPrice: number;         // paid/sale price (black)
  discountPrice: number;       // total - buying
  discountpercentage: number;  // (discount/total)*100
}

const data: DataItem[] = [
  { totalPrice: 300, buyingPrice: 150, discountPrice: 150, discountpercentage: 50 },
  { totalPrice: 600, buyingPrice: 360, discountPrice: 240, discountpercentage: 40 },
];

const hint =
  "The black bar is the buying price. Green is the remainder to reach the total. Discount = total − buying. %discount = (discount ÷ total) × 100.";

/* -----------------------------
   Helpers
------------------------------ */
type Status = "idle" | "match" | "wrong";
const currency = (n: number) => `$${n}`;

type Summary =
  | {
      text: string;
      color: string;
      bgColor: string;
      borderColor: string;
    }
  | null;

/* -----------------------------
   Main component
------------------------------ */
const ArrType_34: React.FC = ({data,hint}:any) => {
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [checked, setChecked] = useState(false);

  // user inputs per-row
  const [answers, setAnswers] = useState(
    () =>
      data.map(() => ({
        discount: "",
        percent: "",
      })) as { discount: string; percent: string }[]
  );

  // keep latest answers in a ref so callbacks can be stable
  const answersRef = useRef(answers);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // per-row validation results
  const [results, setResults] = useState(
    () =>
      data.map(() => ({
        discountOk: false,
        percentOk: false,
      })) as { discountOk: boolean; percentOk: boolean }[]
  );

  const setAnswer = useCallback((i: number, field: "discount" | "percent", value: string) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [field]: value };
      return copy;
    });
  }, []);

  const parseNum = useCallback((v: string) => {
    const n = parseFloat((v ?? "").toString().replace(/[^0-9.]/g, "")); // allows "$150" or "50%"
    return Number.isFinite(n) ? n : NaN;
  }, []);

    const { addResult } = useResultTracker();
    const { id: qId, title: qTitle } = useQuestionMeta();

  const handleCheck = useCallback(() => {
    const current = answersRef.current;

    const next = data.map((d, i) => {
      const expectedDiscount = d.totalPrice - d.buyingPrice;
      const expectedPct = Math.round((expectedDiscount / d.totalPrice) * 100);

      const discGiven = parseNum(current[i].discount);
      const pctGiven = parseNum(current[i].percent);

      const discountOk =
        Number.isFinite(discGiven) && Math.abs(discGiven - expectedDiscount) < 0.01;
      const percentOk = Number.isFinite(pctGiven) && Math.abs(pctGiven - expectedPct) <= 0.5;

      return { discountOk, percentOk };
    });

    setResults(next);
    setChecked(true);
    setStatus(next.every((r) => r.discountOk && r.percentOk) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },next.every((r) => r.discountOk && r.percentOk));
  }, [parseNum]);

  const handleShowSolution = useCallback(() => {
    setAnswers(
      data.map((d) => {
        const disc = d.totalPrice - d.buyingPrice;
        const pct = Math.round((disc / d.totalPrice) * 100);
        return { discount: `${disc}`, percent: `${pct}` };
      })
    );
    setResults(data.map(() => ({ discountOk: true, percentOk: true })));
    setChecked(true);
    setStatus("match");
  }, []);

  const handleShowHint = useCallback(() => {
    setShowHint((s) => !s);
  }, []);

  const summary: Summary = useMemo(
    () =>
      status === "match"
        ? {
            text: "🎉 All Correct! Great job",
            color: "text-green-600",
            bgColor: "bg-green-100",
            borderColor: "border-green-600",
          }
        : status === "wrong"
        ? {
            text: "❌ Some answers are wrong. Check again.",
            color: "text-red-600",
            bgColor: "bg-red-100",
            borderColor: "border-red-600",
          }
        : null,
    [status]
  );

  const { setControls } = useQuestionControls();

  // ✅ Push stable handlers + changing bits only when needed
  useEffect(() => {
    setControls({
      handleCheck,
      handleShowHint,
      handleShowSolution,
      hint,     // module-constant
      showHint, // boolean state
      summary,  // changes with `status`
    });
  }, [setControls, handleCheck, handleShowHint, handleShowSolution, showHint, summary]);

  return (
    <div className="space-y-6">
      <div>
        {/* <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">What percentage discount do you get?</p> */}
      </div>

      {/* two problems side by side */}
      <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
        {data.map((d, idx) => {
          const discount = d.totalPrice - d.buyingPrice;
          const pct = Math.round((discount / d.totalPrice) * 100);

          const colors = {
            discount:
              !checked
                ? "border-slate-300 text-slate-700"
                : results[idx].discountOk
                ? "border-emerald-400 text-emerald-600"
                : "border-rose-400 text-rose-600",
            percent:
              !checked
                ? "border-slate-300 text-slate-700"
                : results[idx].percentOk
                ? "border-emerald-400 text-emerald-600"
                : "border-rose-400 text-rose-600",
          };

          return (
            <div key={idx} className="space-y-4">
              <div className="flex justify-center">
                <PriceTag original={d.totalPrice} sale={d.buyingPrice} />
              </div>

              <PercentageBar
                totalPrice={d.totalPrice}
                buyingPrice={d.buyingPrice}
                checked={checked}
                chipPercent={pct}
              />

              {/* Inputs */}
              <div className="space-y-3 text-slate-800">
                <label className="block text-sm">
                  discount:{" "}
                  <span className="relative">
                    <span className="text-slate-500">$</span>
                    <input
                      value={answers[idx].discount}
                      onChange={(e) => setAnswer(idx, "discount", e.target.value)}
                      className={`ml-1 w-48 bg-transparent outline-none border-b border-dotted ${colors.discount}`}
                      placeholder=""
                      inputMode="decimal"
                    />
                  </span>
                </label>

                <label className="block text-sm">
                  answer:{" "}
                  <span className="relative">
                    <input
                      value={answers[idx].percent}
                      onChange={(e) => setAnswer(idx, "percent", e.target.value)}
                      className={`w-28 bg-transparent outline-none border-b border-dotted ${colors.percent}`}
                      placeholder=""
                      inputMode="numeric"
                    />
                    <span className="ml-1 text-slate-500">%</span>
                  </span>
                </label>
              </div>

              {/* Optional: show computed values faintly when checked */}
              {checked && (
                <div className="text-xs text-slate-400">
                  (Correct: {currency(discount)} / {pct}%)
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArrType_34;

/* -----------------------------
   Subcomponents
------------------------------ */

const PriceTag = ({ original, sale }: { original: number; sale: number }) => (
  <div className="flex items-center">
    <div className="relative h-16 w-4 bg-rose-600">
      <div className="absolute left-0 top-1/2 h-3 w-3 -translate-x-2 -translate-y-1/2 rounded-full bg-pink-300" />
    </div>
    <div className="ml-2 flex h-20 w-48 flex-col items-center justify-center gap-1 rounded-sm bg-orange-50 px-4 py-2 text-slate-800 shadow-sm">
      <div className="text-base">of ${original}.</div>
      <div className="text-base">for ${sale}.</div>
    </div>
  </div>
);

type BarProps = {
  totalPrice: number;
  buyingPrice: number;
  checked: boolean;     // before check: skeleton; after check: show fill + labels
  chipPercent: number;  // dynamic % location
};

/** Percentages on TOP, values under the scale, chip below values. */
const PercentageBar: React.FC<BarProps> = ({ totalPrice, buyingPrice, checked, chipPercent }) => {
  const pct = Math.min((buyingPrice / totalPrice) * 100, 100);

  // positions
  const percentPercents = [0, 0.5, 1];     // TOP: 0% / 50% / 100%
  const valuePercents = [0.4, 0.6, 0.8, 1]; // BOTTOM: values at 40/60/80/100%

  return (
    <div className="space-y-2">
      {/* TOP: percentage labels */}
      <div className="relative mx-auto h-6 w-full max-w-[520px]">
        {percentPercents.map((p) => (
          <div
            key={p}
            className={`absolute -translate-x-1/2 text-emerald-600 ${checked ? "opacity-100" : "opacity-0"} text-sm`}
            style={{ left: `${p * 100}%`, top: 0 }}
          >
            {Math.round(p * 100)}%
          </div>
        ))}
      </div>

      {/* The scale */}
      <div className="relative mx-auto h-6 w-full max-w-[520px] rounded-md border border-slate-900 bg-white">
        {/* vertical dividers at 40/60/80 */}
        {[40, 60, 80].map((x) => (
          <div
            key={x}
            className="absolute top-0 h-full border-l border-slate-900"
            style={{ left: `${x}%` }}
          />
        ))}

        {/* fill appears only after check */}
        {checked && (
          <>
            <div className="absolute left-0 top-0 h-full bg-black" style={{ width: `${pct}%` }} />
            <div
              className="absolute right-0 top-0 h-full bg-emerald-600"
              style={{ width: `${100 - pct}%` }}
            />
          </>
        )}
      </div>

      {/* BOTTOM: value labels (aligned to 40/60/80/100%) */}
      <div className="relative mx-auto h-6 w-full max-w-[520px]">
        {valuePercents.map((p) => (
          <div
            key={p}
            className={`absolute -translate-x-1/2 text-emerald-600 ${checked ? "opacity-100" : "opacity-0"} text-sm`}
            style={{ left: `${p * 100}%`, top: 0 }}
          >
            {Math.round(totalPrice * p)}
          </div>
        ))}
      </div>

      {/* DYNAMIC % CHIP — placed BELOW the values to avoid any overlap */}
      <div className="relative mx-auto h-6 w-full max-w-[520px]">
        <div
          className="absolute top-0 -translate-x-1/2 rounded-md border border-slate-300 bg-white px-2 py-0.5 text-sm"
          style={{ left: `${chipPercent}%` }}
        >
          <span className={checked ? "text-emerald-600" : "text-transparent"}>
            {Math.round(chipPercent)}%
          </span>
        </div>
      </div>
    </div>
  );
};
