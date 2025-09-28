import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Card = {
  id?: string;
  amounts?: Array<number | string>; // four values; numbers in euros (e.g., 112.5) or "112,5"
};

type Props = {
  data?: Card[];
  hint?: string;
};

/* ---------------- Defaults ---------------- */
const DEFAULT_DATA: Required<Card>[] = [
  { id: "c1", amounts: [112.5, 79.8, 0.72, 2.03] },  // sum = 195.05
  { id: "c2", amounts: [111.25, 79.8, 0.72, 2.03] }, // sum = 193.80
  { id: "c3", amounts: [112.5, 79.8, 0.72, 2.03] },  // sum = 195.05
];

const DEFAULT_HINT =
  "Tel de vier bedragen bij elkaar op. Gebruik voor het antwoord een decimale punt (bijv. € 195.05). De schatting is alleen ter oefening en wordt niet nagekeken.";


const ArrType_79: React.FC<Props> = ({ data, hint }) => {
  return <ArrType data={DEFAULT_DATA} hint={DEFAULT_HINT} />;
};


/* ---------------- Helpers ---------------- */
// accept either "," or "." from user; normalize to dot for Number()
const parseEuro = (v: string | number): number => {
  if (typeof v === "number") return v;
  const t = String(v ?? "")
    .replace(/\s+/g, "")
    .replace(/[€£]/g, "")
    .replace(/,/g, "."); // treat comma as dot
  const n = Number(t);
  return Number.isFinite(n) ? n : NaN;
};

// dot-decimal number (no currency symbol)
const formatEuroNumberDot = (n: number) => {
  const dp = Number.isInteger(n) ? 0 : 2;
  return n.toLocaleString("en-GB", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });
};

// dot-decimal with € prefix
const formatEuroCurrencyDot = (n: number) => `€ ${formatEuroNumberDot(n)}`;

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const near = (a: number, b: number, tol = 0.01) => Math.abs(a - b) <= tol;

/* ---------------- Component ---------------- */
const ArrType: React.FC<Props> = ({ data, hint }) => {
  // normalize robustly
  const CARDS = useMemo(() => {
    const src = Array.isArray(data) && data.length ? data : DEFAULT_DATA;
    return src.map((c, i) => {
      const amts = (Array.isArray(c?.amounts) ? c!.amounts : [])
        .slice(0, 4)
        .map((v) => parseEuro(v));
      while (amts.length < 4) amts.push(0);
      return {
        id: c?.id ?? `c-${i}`,
        amounts: amts as [number, number, number, number],
        total: sum(amts as number[]),
      };
    });
  }, [data]);

  const help = hint ?? DEFAULT_HINT;

  // user inputs
  const [approx, setApprox] = useState<string[]>(() => CARDS.map(() => ""));
  const [exact, setExact] = useState<string[]>(() => CARDS.map(() => ""));
  const [ok, setOk] = useState<(boolean | null)[]>(() => CARDS.map(() => null));
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<"idle" | "match" | "wrong">("idle");

  // reset if card count changes
  useEffect(() => {
    setApprox(CARDS.map(() => ""));
    setExact(CARDS.map(() => ""));
    setOk(CARDS.map(() => null));
    setStatus("idle");
    setShowHint(false);
  }, [CARDS.length]);

  /* -------- Handlers -------- */
  const handleCheck = useCallback(() => {
    const res = CARDS.map((c, i) => {
      const val = parseEuro(exact[i] ?? "");
      return Number.isFinite(val) && near(val, c.total);
    });
    setOk(res);
    setStatus(res.every(Boolean) ? "match" : "wrong");
  }, [CARDS, exact]);

  const handleShowSolution = useCallback(() => {
    // quick estimate: round to whole euro using dot decimals
    setApprox(CARDS.map((c) => formatEuroCurrencyDot(Math.round(c.total))));
    setExact(CARDS.map((c) => formatEuroCurrencyDot(c.total)));
    setOk(CARDS.map(() => true));
    setStatus("match");
  }, [CARDS]);

  const handleShowHint = useCallback(() => setShowHint((s) => !s), []);

  const summary = useMemo(() => {
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

  // expose to global toolbar
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
  }, [setControls, handleCheck, handleShowSolution, handleShowHint, help, showHint, summary]);

  const tone = (flag: boolean | null) =>
    flag === null
      ? "border-slate-300 text-slate-800"
      : flag
      ? "border-emerald-500 text-emerald-600"
      : "border-rose-500 text-rose-600";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">First, estimate; then calculate with the calculator.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {CARDS.map((c, i) => (
          <div key={c.id} className="rounded-md bg-orange-50 p-4">
            {/* 4 amounts */}
            <div className="space-y-2 text-slate-800">
              {c.amounts.map((a, idx) => (
                <div key={idx} className="flex items-center justify-between tabular-nums">
                  <span>€</span>
                  <span className="ml-2 flex-1 text-right">
                    {formatEuroNumberDot(a)}
                  </span>
                  <span className="ml-2">{idx === 3 ? "+" : ""}</span>
                </div>
              ))}
            </div>

            {/* estimate */}
            <div className="mt-5 text-sm text-slate-700">
              <div className="flex items-center justify-between gap-3">
                <span>
                  ik schat: <span className="italic">bijv.</span>
                </span>
                <input
                  type="text"
                  value={approx[i]}
                  onChange={(e) => setApprox((p) => ((p = [...p]), (p[i] = e.target.value), p))}
                  className={`w-40 rounded-md border ${tone(null)} bg-white/70 px-2 py-1 text-right tabular-nums`}
                  placeholder="€ …"
                />
              </div>
            </div>

            {/* exact answer */}
            <div className="mt-2 text-sm text-slate-700">
              <div className="flex items-center justify-between gap-3">
                <span>antwoord:</span>
                <input
                  type="text"
                  value={exact[i]}
                  onChange={(e) => {
                    setExact((p) => ((p = [...p]), (p[i] = e.target.value), p));
                    setOk((p) => ((p = [...p]), (p[i] = null), p));
                    setStatus("idle");
                  }}
                  className={`w-40 rounded-md border ${tone(ok[i])} bg-white/70 px-2 py-1 text-right tabular-nums`}
                  placeholder="€ …"
                />
              </div>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
};

export default ArrType_79;
