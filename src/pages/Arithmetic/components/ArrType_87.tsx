import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Item = {
  id?: string;
  name: string;
  quantity: number;
};

type Props = {
  items?: Item[];
  price?: number;
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
const DEFAULT_ITEMS: Item[] = [
  { id: "i1", name: "Murat", quantity: 6 },
  { id: "i2", name: "Achmed", quantity: 4 },
  { id: "i3", name: "Sarma", quantity: 8 },
];

const DEFAULT_PRICE = 35;

const DEFAULT_HINT = "Multiply the number of shirts with the price per shirt.";

/* ---------------- Component ---------------- */
const ArrType_87: React.FC<Props> = ({
  items = DEFAULT_ITEMS,
  price = DEFAULT_PRICE,
  hint = DEFAULT_HINT,
}) => {
  const [equations, setEquations] = useState<string[]>(() =>
    items.map(() => "")
  );
  const [answers, setAnswers] = useState<string[]>(() => items.map(() => ""));
  const [ok, setOk] = useState<(boolean | null)[]>(() =>
    items.map(() => null)
  );
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  // reset when items or price changes
  useEffect(() => {
    setEquations(items.map(() => ""));
    setAnswers(items.map(() => ""));
    setOk(items.map(() => null));
    setStatus("idle");
    setShowHint(false);
  }, [items, price]);

  /* -------- Handlers -------- */
  const handleCheck = useCallback(() => {
    const results = items.map((it, i) => {
      const correctEq = `${it.quantity}×${price}=${it.quantity * price}`;
      const correctAns = String(it.quantity * price);
      return (
        equations[i].replace(/\s/g, "") === correctEq.replace(/\s/g, "") &&
        answers[i].trim() === correctAns
      );
    });
    setOk(results);
    setStatus(results.every(Boolean) ? "match" : "wrong");
  }, [items, equations, answers, price]);

  const handleShowSolution = useCallback(() => {
    setEquations(items.map((it) => `${it.quantity} × ${price} = ${it.quantity * price}`));
    setAnswers(items.map((it) => String(it.quantity * price)));
    setOk(items.map(() => true));
    setStatus("match");
  }, [items, price]);

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
      hint,
      showHint,
      summary,
    });
  }, [setControls, handleCheck, handleShowSolution, handleShowHint, hint, showHint, summary]);

  /* -------- Render -------- */
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Question</h2>
        <p className="text-sm text-slate-600">
          Which sum corresponds to this? Calculate it in your notebook.
        </p>
      </div>

      {/* Price Card */}
      <div className="flex justify-center">
        <div className="bg-orange-200 px-4 py-2 rounded font-semibold">
          T-Shirt: € {price},-
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {items.map((it, i) => {
          const isCorrect = ok[i] && status !== "idle";
          const isWrong = ok[i] === false && status !== "idle";

          const inputStyle = `border-b-2 border-dashed focus:outline-none text-center
            ${isCorrect ? "border-green-500 text-green-600" : ""}
            ${isWrong ? "border-red-500 text-red-600" : ""}`;

          return (
            <div key={it.id} className="flex items-start gap-6">
              {/* Problem statement */}
              <div className="bg-orange-50 p-3 rounded w-72 text-sm">
                {it.name} buys {it.quantity} shirts. How much does he have to pay?
              </div>

              {/* Inputs */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">sum:</span>
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
                    className={inputStyle}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">answer:</span>
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
                    className={inputStyle}
                  />
                  <span>euros</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showHint && (
        <div className="p-3 border border-amber-300 bg-amber-50 text-amber-800 text-sm rounded">
          {hint}
        </div>
      )}
    </div>
  );
};

export default ArrType_87;
