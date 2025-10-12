import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* -----------------------------
   Types & DEMO data
------------------------------ */
type Item = {
  id: string;
  price: number;       // original price ($)
  discountPct: number; // percent off
};

export const DEMO_ITEMS: Item[] = [
  { id: "a", price: 300, discountPct: 5 },
  { id: "b", price: 400, discountPct: 10 },
  { id: "c", price: 300, discountPct: 5 },
];

const DEFAULT_HINT =
  "benefit = price × (discount% ÷ 100).  new price = price − benefit.  Example: price $300 with 5% → benefit $15, new price $285.";

/* -----------------------------
   Helpers
------------------------------ */
type Status = "idle" | "match" | "wrong";

interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const currency = (n: number) =>
  `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

const parseNum = (v: string) => {
  const n = parseFloat((v ?? "").toString().replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : NaN; // accepts "$15", "15.0", etc.
};

/** Defensive normalizer so props never blank the UI */
function normalizeItems(input: unknown): Item[] {
  if (!Array.isArray(input)) return [];
  return input.map((it, idx) => ({
    id: typeof (it as any)?.id === "string" ? (it as any).id : `item-${idx}`,
    price: Number((it as any)?.price),
    discountPct: Number((it as any)?.discountPct),
  }));
}

/* -----------------------------
   Component
------------------------------ */
type Props = {
  data?: unknown; // may be anything; we normalize
  hint?: string;
};

const ArrType_36: React.FC<Props> = ({ data, hint }) => {
  // Normalize incoming data; fallback to demo if empty/invalid
  const items = useMemo(() => {
    const normalized = normalizeItems(data);
    const hasRows = normalized.some(
      (r) => Number.isFinite(r.price) && Number.isFinite(r.discountPct)
    );
    return hasRows ? normalized : DEMO_ITEMS;
  }, [data]);

  const hintText = hint ?? DEFAULT_HINT;

  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [checked, setChecked] = useState(false);

  // user inputs per item
  const [answers, setAnswers] = useState<{ benefit: string; newPrice: string }[]>([]);
  const [results, setResults] = useState<{ benefitOk: boolean; newPriceOk: boolean }[]>([]);

  // (re)initialize when items change
  useEffect(() => {
    setAnswers(items.map(() => ({ benefit: "", newPrice: "" })));
    setResults(items.map(() => ({ benefitOk: false, newPriceOk: false })));
    setChecked(false);
    setStatus("idle");
  }, [items]);

  const setAnswer = useCallback(
    (i: number, field: "benefit" | "newPrice", value: string) => {
      setAnswers((prev) => {
        const copy = [...prev];
        copy[i] = { ...copy[i], [field]: value };
        return copy;
      });
    },
    []
  );

  const handleCheck = useCallback(() => {
    const next = items.map((it, i) => {
      const benefit = +(it.price * (it.discountPct / 100)).toFixed(2);
      const newPrice = +(it.price - benefit).toFixed(2);

      const givenBenefit = parseNum(answers[i]?.benefit ?? "");
      const givenNew = parseNum(answers[i]?.newPrice ?? "");

      const benefitOk =
        Number.isFinite(givenBenefit) && Math.abs(givenBenefit - benefit) < 0.01;
      const newPriceOk =
        Number.isFinite(givenNew) && Math.abs(givenNew - newPrice) < 0.01;

      return { benefitOk, newPriceOk };
    });

    setResults(next);
    setChecked(true);
    setStatus(next.every((r) => r.benefitOk && r.newPriceOk) ? "match" : "wrong");
  }, [answers, items]);

  const handleShowSolution = useCallback(() => {
    setAnswers(
      items.map((it) => {
        const benefit = +(it.price * (it.discountPct / 100)).toFixed(2);
        const newPrice = +(it.price - benefit).toFixed(2);
        return { benefit: `${benefit}`, newPrice: `${newPrice}` };
      })
    );
    setResults(items.map(() => ({ benefitOk: true, newPriceOk: true })));
    setChecked(true);
    setStatus("match");
  }, [items]);

  const handleShowHint = useCallback(() => setShowHint((s) => !s), []);

  const summary: Summary | null = useMemo(() => {
    if (status === "match")
      return {
        text: "🎉 All Correct! Great job",
        color: "text-green-600",
        bgColor: "bg-green-100",
        borderColor: "border-green-600",
      };
    if (status === "wrong")
      return {
        text: "❌ Some answers are wrong. Check again.",
        color: "text-red-600",
        bgColor: "text-red-100",
        borderColor: "border-red-600",
      } as any; // keep types happy if Tailwind tokens differ
    return null;
  }, [status]);

  // expose to global Controllers/Hint/Check via context
  const { setControls } = useQuestionControls();
  const controls = useMemo(
    () => ({
      handleCheck,
      handleShowHint,
      handleShowSolution,
      hint: hintText,
      showHint,
      summary,
    }),
    [handleCheck, handleShowHint, handleShowSolution, hintText, showHint, summary]
  );
  useEffect(() => {
    setControls(controls);
  }, [controls, setControls]);

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">calculate in your notebook</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
        {items.map((it, idx) => {
          const colors = {
            benefit:
              !checked
                ? "border-slate-300 text-slate-800"
                : results[idx]?.benefitOk
                ? "border-emerald-400 text-emerald-600"
                : "border-rose-400 text-rose-600",
            newPrice:
              !checked
                ? "border-slate-300 text-slate-800"
                : results[idx]?.newPriceOk
                ? "border-emerald-400 text-emerald-600"
                : "border-rose-400 text-rose-600",
          };

          return (
            <div key={it.id} className="space-y-5">
              {/* Tiny tag */}
              <div className="flex justify-center">
                <PriceDiscountTag price={it.price} discountPct={it.discountPct} />
              </div>

              {/* Inputs */}
              <div className="space-y-3 text-slate-900">
                <label className="block text-sm">
                  benefit:{" "}
                  <span className="relative">
                    <span className="text-emerald-600">$</span>
                    <input
                      value={answers[idx]?.benefit ?? ""}
                      onChange={(e) => setAnswer(idx, "benefit", e.target.value)}
                      className={`ml-1 w-56 bg-transparent outline-none border-b border-dotted ${colors.benefit}`}
                      placeholder=""
                      inputMode="decimal"
                    />
                  </span>
                </label>

                <label className="block text-sm">
                  new price:{" "}
                  <span className="relative">
                    <span className="text-emerald-600">$</span>
                    <input
                      value={answers[idx]?.newPrice ?? ""}
                      onChange={(e) => setAnswer(idx, "newPrice", e.target.value)}
                      className={`ml-1 w-56 bg-transparent outline-none border-b border-dotted ${colors.newPrice}`}
                      placeholder=""
                      inputMode="decimal"
                    />
                  </span>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {/* If you want local buttons instead of global controllers, you can add them here.
          We’re using the global QuestionControls via context as per the shared format. */}
    </div>
  );
};

export default ArrType_36;

/* -----------------------------
   Tiny tag component
------------------------------ */
const PriceDiscountTag = ({
  price,
  discountPct,
}: {
  price: number;
  discountPct: number;
}) => {
  return (
    <div className="flex items-center">
      {/* red fin + pin */}
      <div className="relative h-10 w-4 bg-rose-600">
        <div className="absolute left-0 top-1/2 h-3 w-3 -translate-x-2 -translate-y-1/2 rounded-full bg-pink-300" />
      </div>

      {/* card */}
      <div className="ml-2 flex min-w-[9.5rem] flex-col rounded-sm bg-orange-100/70 px-3 py-2 text-slate-800 shadow-sm">
        <div className="text-sm font-medium">price {currency(price)}.</div>
        <div className="mt-1 inline-block max-w-max rounded-sm bg-yellow-300 px-1.5 py-0.5 text-xs font-semibold text-slate-900">
          discount {discountPct}%</div>
      </div>
    </div>
  );
};
