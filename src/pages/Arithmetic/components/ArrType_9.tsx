import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useEffect, useMemo, useState, useCallback } from "react";
import useResultTracker from "@/hooks/useResultTracker";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import { useQuestionControls } from "@/context/QuestionControlsContext";

type Operator = "+" | "-";
type Item = {
  id: number;
  top: number;
  bottoms: [number, number];
  answers: string[];
};
type Eq = {
  left: string;
  op: Operator;
  right: string;
  result: string;
  isChecked?: boolean;
  isCorrect?: boolean;
};

const evaluate = (a: number, op: Operator, b: number) =>
  op === "+" ? a + b : a - b;
const parseNum = (v: string) => (v.trim() === "" ? NaN : Number(v));

function validateOne(eq: Eq, triple: [number, number, number]): boolean {
  const a = parseNum(eq.left),
    b = parseNum(eq.right),
    r = parseNum(eq.result);
  if ([a, b, r].some(Number.isNaN)) return false;
  const arithOK = evaluate(a, eq.op, b) === r;
  const used = [a, b, r].sort((x, y) => x - y);
  const expected = [...triple].sort((x, y) => x - y);
  return arithOK && used.every((n, i) => n === expected[i]);
}

type ArrType9Data = {
  numbers: number[];
  query: Item[];
};

export default function ArrType_9({
  data: props,
  hint,
}: {
  data: ArrType9Data;
  hint: any;
}) {
  const qData = props?.query;
  const qNumbers = props?.numbers;
  const REQUIRED = 4;

  const [status, setStatus] = useState<"" | "match" | "wrong">("");

  const triples = useMemo(
    () =>
      qData.reduce<Record<number, [number, number, number]>>((acc, d) => {
        acc[d.id] = [d.bottoms[0], d.bottoms[1], d.top];
        return acc;
      }, {}),
    [qData]
  );

  const [eqs, setEqs] = useState<Record<number, Eq[]>>(() => {
    const init: Record<number, Eq[]> = {};
    qData.forEach((d) => {
      init[d.id] = Array.from({ length: REQUIRED }, (_, i) => ({
        left: "",
        op: i < 2 ? "+" : "-",
        right: "",
        result: "",
        isChecked: false,
        isCorrect: false,
      }));
    });
    return init;
  });

  // helper to recompute the overall summary after a check
  const recomputeStatus = useCallback((state: Record<number, Eq[]>) => {
    const allChecked = Object.values(state)
      .flat()
      .every((r) => r.isChecked);
    if (!allChecked) return setStatus("");
    const allCorrect = Object.values(state)
      .flat()
      .every((r) => r.isCorrect);
    setStatus(allCorrect ? "match" : "wrong");
  }, []);

  const [showHint, setShowHint] = useState(false);
  const [focused, setFocused] = useState<
    Record<number, { row: number; field: "left" | "right" | "result" } | null>
  >({});

  const setField = useCallback(
    (id: number, idx: number, field: keyof Eq, value: string | Operator) => {
      setEqs((prev) => {
        const copy = { ...prev };
        const rows = [...copy[id]];
        rows[idx] = { ...rows[idx], [field]: value, isChecked: false };
        copy[id] = rows;
        setStatus(""); // editing clears summary
        return copy;
      });
    },
    []
  );

  const handleNumClick = useCallback(
    (id: number, n: number) => {
      const f = focused[id];
      if (f) return setField(id, f.row, f.field, String(n));
      const first = eqs[id][0];
      if (first.left === "") setField(id, 0, "left", String(n));
      else if (first.right === "") setField(id, 0, "right", String(n));
      else if (first.result === "") setField(id, 0, "result", String(n));
    },
    [focused, eqs, setField]
  );

  // ✅ Check button
  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  const handleCheckAll = useCallback(() => {
    setEqs((prev) => {
      const next: typeof prev = {};
      for (const item of qData) {
        const triple = triples[item.id];
        next[item.id] = prev[item.id].map((row) => ({
          ...row,
          isChecked: true,
          isCorrect: validateOne(row, triple),
        }));
      }
      recomputeStatus(next);
      const allCorrect = Object.values(next).flat().every((r) => r.isCorrect);
      addResult({ id: qId, title: qTitle }, allCorrect);
      return next;
    });
  }, [qData, triples, recomputeStatus, addResult, qId, qTitle]);

  // ✅ Show Solution
  const handleShowSolutionAll = useCallback(() => {
    setEqs((prev) => {
      const next: typeof prev = { ...prev };
      for (const item of qData) {
        const plus = item.answers.filter((s) => s.includes("+")).slice(0, 2);
        const minus = item.answers.filter((s) => s.includes("-")).slice(0, 2);
        const picks = [...plus, ...minus];
        next[item.id] = picks.map((s, i) => {
          const [lhs, r] = s.split("=");
          const [la, , lb] = lhs.trim().split(" ");
          return {
            left: la.trim(),
            op: (i < 2 ? "+" : "-") as Operator,
            right: lb.trim(),
            result: r.trim(),
            isChecked: true,
            isCorrect: true,
          } as Eq;
        });
      }
      setStatus("match");
      return next;
    });
  }, [qData]);

  const summary = useMemo(
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

  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  // ✅ stable controls object
  const controls = useMemo(
    () => ({
      handleCheck: handleCheckAll,
      handleShowHint,
      handleShowSolution: handleShowSolutionAll,
      hint,
      showHint,
      summary,
    }),
    [handleCheckAll, handleShowHint, handleShowSolutionAll, hint, showHint, summary]
  );

  useEffect(() => {
    setControls((prev) => {
      const changed = Object.keys(controls).some(
        (k) => (controls as any)[k] !== (prev as any)[k]
      );
      return changed ? controls : prev;
    });
  }, [controls, setControls]);

  return (
    <div>
      <div className="p-4">
        {/* header strip */}
        <div className="mb-6 rounded-2xl border bg-amber-50/60 p-4">
          {/* TOP row */}
          <div className="flex items-center justify-around gap-6">
            {qNumbers.map((n, i) => (
              <span
                key={`top-${i}`}
                className={
                  "w-10 text-center text-lg font-semibold " +
                  (i % 2 === 0 ? "" : "opacity-0")
                }
              >
                {n}
              </span>
            ))}
          </div>

          {/* BOTTOM row */}
          <div className="mt-3 flex items-center justify-around gap-6">
            {qNumbers.map((n, i) => (
              <span
                key={`bottom-${i}`}
                className={
                  "w-10 text-center text-lg font-semibold " +
                  (i % 2 === 1 ? "" : "opacity-0")
                }
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* columns */}
        <div className="flex justify-around gap-3.5">
          {qData?.map((item) => (
            <div
              key={item.id}
              className="flex gap-6 rounded-xl border border-amber-300 bg-white p-4 shadow-sm"
            >
              {/* left numbers */}
              <div className="flex items-center gap-3">
                <div
                  onClick={() => handleNumClick(item.id, item.top)}
                  className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-md border-2 border-green-600 text-xl font-bold"
                >
                  {item.top}
                </div>
                <div className="flex flex-col gap-2">
                  {item.bottoms.map((b, i) => (
                    <div
                      key={i}
                      onClick={() => handleNumClick(item.id, b)}
                      className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-md border-2 border-green-600 text-lg font-semibold"
                    >
                      {b}
                    </div>
                  ))}
                </div>
              </div>

              {/* equations */}
              <div className="flex flex-col gap-4">
                {eqs[item.id].map((row, idx) => (
                  <div
                    key={idx}
                    className={[
                      "rounded-lg border px-3 py-2",
                      row.isChecked
                        ? row.isCorrect
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-rose-500 bg-rose-50"
                        : "border-gray-200",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-center gap-2 text-lg">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={row.left}
                        onFocus={() =>
                          setFocused((f) => ({
                            ...f,
                            [item.id]: { row: idx, field: "left" },
                          }))
                        }
                        onChange={(e) =>
                          setField(
                            item.id,
                            idx,
                            "left",
                            e.target.value.replace(/[^0-9]/g, "")
                          )
                        }
                        className="w-12 border-b-2 border-dashed border-primary bg-transparent text-center focus:outline-none"
                        placeholder="?"
                      />
                      <span className=" px-2 py-1 font-bold">{row.op}</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={row.right}
                        onFocus={() =>
                          setFocused((f) => ({
                            ...f,
                            [item.id]: { row: idx, field: "right" },
                          }))
                        }
                        onChange={(e) =>
                          setField(
                            item.id,
                            idx,
                            "right",
                            e.target.value.replace(/[^0-9]/g, "")
                          )
                        }
                        className="w-12 border-b-2 border-dashed border-primary bg-transparent text-center focus:outline-none"
                        placeholder="?"
                      />
                      <span>=</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={row.result}
                        onFocus={() =>
                          setFocused((f) => ({
                            ...f,
                            [item.id]: { row: idx, field: "result" },
                          }))
                        }
                        onChange={(e) =>
                          setField(
                            item.id,
                            idx,
                            "result",
                            e.target.value.replace(/[^0-9]/g, "")
                          )
                        }
                        className="w-12 border-b-2 border-dashed border-primary bg-transparent text-center focus:outline-none"
                        placeholder="?"
                      />
                    </div>

                    {row.isChecked && (
                      <p
                        className={`mt-2 text-sm font-semibold ${
                          row.isCorrect ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        {row.isCorrect ? "Correct" : "Wrong"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* controls + summary banner */}
      {/* <div className="">
        <Controllers
          handleCheck={handleCheckAll}
          handleShowSolution={handleShowSolutionAll}
          handleShowHint={() => setShowHint((v) => !v)}
        />
        {showHint && (
          <Hint hint="Make splits with the numbers. For each box, build 4 equations: two additions and two subtractions using exactly the three boxed values once per equation." />
        )}
        <Check summary={summary} />
      </div> */}
    </div>
  );
}
