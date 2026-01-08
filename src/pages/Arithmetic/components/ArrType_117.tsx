import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type RatioTable = {
  id: string;
  question: string;
  headers: [string, string]; // e.g. ["packs", "ice creams"]
  rows: {
    label: string; // fixed first row values
    values: (number | null)[];
    correct: number[];
  }[];
  answerLabel: string;
  answer: string;
};

type Props = {
  data?: RatioTable[];
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
const DEFAULT_DATA: RatioTable[] = [
  {
    id: "rt1",
    question:
      "In 2 packs there are 6 ice creams. How many ice creams are in 3 packs?",
    headers: ["packs", "ice creams"],
    rows: [
      { label: "packs", values: [2, 1, 3], correct: [2, 1, 3] },
      { label: "ice creams", values: [6, null, null], correct: [6, 3, 9] },
    ],
    answerLabel: "ice creams",
    answer: "9",
  },
  {
    id: "rt2",
    question: "In 3 bags there are 18 rolls. How many rolls are in 5 bags?",
    headers: ["bags", "rolls"],
    rows: [
      { label: "bags", values: [3, 1, 5], correct: [3, 1, 5] },
      { label: "rolls", values: [18, null, null], correct: [18, 6, 30] },
    ],
    answerLabel: "rolls",
    answer: "30",
  },
];

const DEFAULT_HINT =
  "Use ratio tables: divide to find 1 unit, then multiply to find the missing value.";

/* ---------------- Input ---------------- */
const NumberInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  ok: boolean | null;
  width?: string;
}> = ({ value, onChange, ok, width = "w-16" }) => {
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
      className={`${width} text-center border-b-2 border-dotted focus:outline-none ${border}`}
    />
  );
};

/* ---------------- Main ---------------- */
const ArrType_117: React.FC<Props> = ({ data, hint }) => {
  const DATA = useMemo(() => {
    return Array.isArray(data) && data.length ? data : DEFAULT_DATA;
  }, [data]);
  const help = hint ?? DEFAULT_HINT;

  const [values, setValues] = useState<string[][]>(() =>
    DATA.map((table) =>
      table.rows.map((row) => row.values.map((v) => (v ?? "").toString()))
    )
  );
  const [ok, setOk] = useState<(boolean | null)[][]>(() =>
    DATA.map((table) =>
      table.rows.map((row) =>
        row.values.map((v) => (v !== null ? true : null))
      )
    )
  );
  const [answers, setAnswers] = useState<string[]>(() =>
    DATA.map(() => "")
  );
  const [okAnswers, setOkAnswers] = useState<(boolean | null)[]>(() =>
    DATA.map(() => null)
  );

  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setValues(
      DATA.map((table) =>
        table.rows.map((row) => row.values.map((v) => (v ?? "").toString()))
      )
    );
    setOk(
      DATA.map((table) =>
        table.rows.map((row) =>
          row.values.map((v) => (v !== null ? true : null))
        )
      )
    );
    setAnswers(DATA.map(() => ""));
    setOkAnswers(DATA.map(() => null));
    setStatus("idle");
    setShowHint(false);
  }, [DATA]);


  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  /* -------- Handlers -------- */
  const handleCheck = useCallback(() => {
    const newOk = DATA.map((table, ti) =>
      table.rows.map((row, ri) =>
        row.correct.map((correct, ci) =>
          row.values[ci] === null
            ? values[ti][ri][ci] === String(correct)
            : true
        )
      )
    );
    setOk(newOk);

    const newOkAnswers = DATA.map(
      (table, ti) => answers[ti] === table.answer
    );
    setOkAnswers(newOkAnswers);

    const allCorrect =
      newOk.every((rows) => rows.every((cells) => cells.every((c) => c))) &&
      newOkAnswers.every(Boolean);

    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },allCorrect);
  }, [DATA, values, answers]);

  const handleShowSolution = useCallback(() => {
    setValues(
      DATA.map((table) => table.rows.map((row) => row.correct.map(String)))
    );
    setOk(
      DATA.map((table) =>
        table.rows.map((row) => row.correct.map(() => true))
      )
    );
    setAnswers(DATA.map((table) => table.answer));
    setOkAnswers(DATA.map(() => true));
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
    <div className="space-y-8">
      {/* <h2 className="text-lg font-semibold">Question 1</h2>
      <p className="text-sm text-slate-600">
        How much? Calculate using the ratio table.
      </p> */}

      <div className="grid grid-cols-2 gap-8">
        {DATA.map((table, ti) => (
          <div key={table.id} className="space-y-4">
            <div className="bg-slate-50 p-2 rounded text-sm">
              {table.question}
            </div>
            <table className="w-full border border-slate-300 text-center">
              <tbody>
                {table.rows.map((row, ri) => (
                  <tr key={ri}>
                    <td className="bg-orange-50 border p-2 font-medium">
                      {row.label}
                    </td>
                    {row.values.map((v, ci) => (
                      <td key={ci} className="border p-2">
                        {v !== null ? (
                          v
                        ) : (
                          <NumberInput
                            value={values[ti][ri][ci]}
                            onChange={(val) =>
                              setValues((prev) => {
                                const cp = [...prev];
                                cp[ti][ri][ci] = val;
                                return cp;
                              })
                            }
                            ok={ok[ti][ri][ci]}
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center gap-2">
              <span>answer:</span>
              <NumberInput
                value={answers[ti]}
                onChange={(val) =>
                  setAnswers((prev) => {
                    const cp = [...prev];
                    cp[ti] = val;
                    return cp;
                  })
                }
                ok={okAnswers[ti]}
              />
              <span>{table.answerLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrType_117;
