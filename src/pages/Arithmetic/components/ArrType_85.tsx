import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Item = {
  id?: string;
  total: number;
  items: { name: string; cost: number }[];
};

type Data = {
  items: Item[];
  priceList: { label: string; price: number }[];
};

type Props = {
  data?: Data;
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
const DEFAULT_DATA: Data = {
  items: [
    {
      id: "c1",
      total: 55,
      items: [{ name: "earrings", cost: 27 }],
    },
    {
      id: "c2",
      total: 62,
      items: [{ name: "necklaces", cost: 35 }], // ✅ corrected
    },
  ],
  priceList: [
    { label: "earrings", price: 27 },
    { label: "bracelets", price: 28 },
    { label: "necklaces", price: 35 },
    { label: "hats", price: 49 },
  ],
};

const DEFAULT_HINT =
  "Write the subtraction equation and final answer based on the money left after buying the items.";

/* ---------------- Component ---------------- */
const ArrType_85: React.FC<Props> = ({ data, hint }) => {
  // ✅ safe fallback
  const DATA: Data = useMemo(
    () =>
      data && Array.isArray(data.items) && Array.isArray(data.priceList)
        ? data
        : DEFAULT_DATA,
    [data]
  );

  const help = hint ?? DEFAULT_HINT;

  const [equations, setEquations] = useState<string[]>(
    DATA.items.map(() => "")
  );
  const [answers, setAnswers] = useState<string[]>(DATA.items.map(() => ""));
  const [ok, setOk] = useState<(boolean | null)[]>(DATA.items.map(() => null));
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  // reset when DATA changes
  useEffect(() => {
    setEquations(DATA.items.map(() => ""));
    setAnswers(DATA.items.map(() => ""));
    setOk(DATA.items.map(() => null));
    setStatus("idle");
    setShowHint(false);
  }, [DATA]);

  /* -------- Handlers -------- */
  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const handleCheck = useCallback(() => {
    const results = DATA.items.map((c, i) => {
      const totalCost = c.items.reduce((sum, it) => sum + it.cost, 0);
      const expectedEq = `${c.total}-${c.items
        .map((it) => it.cost)
        .join("-")}=${c.total - totalCost}`;
      const normalized = equations[i].replace(/\s+/g, "");
      return (
        normalized === expectedEq &&
        answers[i].trim() === String(c.total - totalCost)
      );
    });
    setOk(results);
    setStatus(results.every(Boolean) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },results.every(Boolean));
  }, [DATA, equations, answers]);

  const handleShowSolution = useCallback(() => {
    setEquations(
      DATA.items.map(
        (c) =>
          `${c.total}-${c.items.map((it) => it.cost).join("-")}=${
            c.total - c.items.reduce((s, it) => s + it.cost, 0)
          }`
      )
    );
    setAnswers(
      DATA.items.map((c) =>
        String(c.total - c.items.reduce((s, it) => s + it.cost, 0))
      )
    );
    setOk(DATA.items.map(() => true));
    setStatus("match");
  }, [DATA]);

  const handleShowHint = useCallback(() => setShowHint((s) => !s), []);

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

  /* -------- Register controls -------- */
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

  /* -------- Input style -------- */
  const inputStyle =
    "border-0 border-b-2 border-dashed focus:outline-none text-center min-w-[60px]";

  /* -------- Render -------- */
  return (
    <div className="space-y-6">
      <div>
        {/* <h2 className="text-lg font-semibold">Question 5</h2>
        <p className="text-sm text-slate-600">
          Which sum corresponds to this? How many euros do they have left?
        </p> */}
      </div>

      {/* 3-column layout */}
      <div className="grid grid-cols-3 gap-6 items-start">
        {/* Left problems */}
        <div className="flex flex-col gap-6">
          {DATA.items.slice(0, 1).map((c, i) => {
            const itemNames = c.items.map((it) => it.name).join(" and ");
            return (
              <div
                key={c.id}
                className="p-4 rounded-lg bg-orange-50 border border-orange-200 flex flex-col gap-3"
              >
                <p>I have {c.total} euros.</p>
                <p>I am buying {itemNames} for grandma.</p>

                <div>
                  <span className="text-sm">som: </span>
                  <input
                    type="text"
                    value={equations[i]}
                    onChange={(e) => {
                      const cp = [...equations];
                      cp[i] = e.target.value;
                      setEquations(cp);
                      setOk((prev) => {
                        const arr = [...prev];
                        arr[i] = null;
                        return arr;
                      });
                      setStatus("idle");
                    }}
                    className={`${inputStyle} ${
                      ok[i] === null
                        ? "border-slate-300"
                        : ok[i]
                        ? "border-green-500 text-green-600"
                        : "border-red-500 text-red-600"
                    }`}
                  />
                </div>

                <div>
                  <span className="text-sm">antwoord: </span>
                  <input
                    type="text"
                    value={answers[i]}
                    onChange={(e) => {
                      const cp = [...answers];
                      cp[i] = e.target.value;
                      setAnswers(cp);
                      setOk((prev) => {
                        const arr = [...prev];
                        arr[i] = null;
                        return arr;
                      });
                      setStatus("idle");
                    }}
                    className={`${inputStyle} ${
                      ok[i] === null
                        ? "border-slate-300"
                        : ok[i]
                        ? "border-green-500 text-green-600"
                        : "border-red-500 text-red-600"
                    }`}
                  />
                  <span className="text-sm ml-1">euro</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Middle price list */}
        <div className="p-4 rounded-lg bg-orange-200 border border-orange-400">
          <h3 className="font-semibold">PRICE LIST</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {DATA.priceList.map((p, idx) => (
              <li key={idx}>
                {p.label}: {p.price} euro
              </li>
            ))}
          </ul>
        </div>

        {/* Right problems */}
        <div className="flex flex-col gap-6">
          {DATA.items.slice(1).map((c, idx) => {
            const i = idx + 1;
            const itemNames = c.items.map((it) => it.name).join(" and ");
            return (
              <div
                key={c.id}
                className="p-4 rounded-lg bg-orange-50 border border-orange-200 flex flex-col gap-3"
              >
                <p>I have {c.total} euros.</p>
                <p>I am buying {itemNames} for grandma.</p>

                <div>
                  <span className="text-sm">som: </span>
                  <input
                    type="text"
                    value={equations[i]}
                    onChange={(e) => {
                      const cp = [...equations];
                      cp[i] = e.target.value;
                      setEquations(cp);
                      setOk((prev) => {
                        const arr = [...prev];
                        arr[i] = null;
                        return arr;
                      });
                      setStatus("idle");
                    }}
                    className={`${inputStyle} ${
                      ok[i] === null
                        ? "border-slate-300"
                        : ok[i]
                        ? "border-green-500 text-green-600"
                        : "border-red-500 text-red-600"
                    }`}
                  />
                </div>

                <div>
                  <span className="text-sm">antwoord: </span>
                  <input
                    type="text"
                    value={answers[i]}
                    onChange={(e) => {
                      const cp = [...answers];
                      cp[i] = e.target.value;
                      setAnswers(cp);
                      setOk((prev) => {
                        const arr = [...prev];
                        arr[i] = null;
                        return arr;
                      });
                      setStatus("idle");
                    }}
                    className={`${inputStyle} ${
                      ok[i] === null
                        ? "border-slate-300"
                        : ok[i]
                        ? "border-green-500 text-green-600"
                        : "border-red-500 text-red-600"
                    }`}
                  />
                  <span className="text-sm ml-1">euro</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ArrType_85;
