import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type ThrowRow = {
  id: string;
  thrown: number[];
  total: number;
  avg: number;
};

type Props = {
  data?: ThrowRow[];
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
const DEFAULT_DATA: ThrowRow[] = [
  { id: "t1", thrown: [3, 3, 2, 2, 1, 1], total: 12, avg: 2 },
  { id: "t2", thrown: [6, 6, 5, 5, 5, 3], total: 30, avg: 5 },
  { id: "t3", thrown: [5, 4, 4, 4, 3], total: 24, avg: 4 },
  { id: "t4", thrown: [5, 4, 4, 2, 2, 1], total: 18, avg: 3 },
];

const DEFAULT_HINT =
  "Add up the totals (e.g., 12 + 30 + 24 + 18 = 84), then divide by the number of rows (84 ÷ 4 = 21).";

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
const ArrType_111: React.FC<Props> = ({ data, hint }) => {
  const DATA =  DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;

  const [values, setValues] = useState(() =>
    DATA.map(() => ({ total: "", avg: "" }))
  );
  const [ok, setOk] = useState(() =>
    DATA.map(() => ({ total: null, avg: null }))
  );

  const [working1, setWorking1] = useState("");
  const [working2, setWorking2] = useState("");
  const [answer, setAnswer] = useState("");
  const [okWorking1, setOkWorking1] = useState<boolean | null>(null);
  const [okWorking2, setOkWorking2] = useState<boolean | null>(null);
  const [okAnswer, setOkAnswer] = useState<boolean | null>(null);

  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    setValues(DATA.map(() => ({ total: "", avg: "" })));
    setOk(DATA.map(() => ({ total: null, avg: null })));
    setWorking1("");
    setWorking2("");
    setAnswer("");
    setOkWorking1(null);
    setOkWorking2(null);
    setOkAnswer(null);
    setStatus("idle");
  }, [data]);

  /* -------- Handlers -------- */
  const normalize = (str: string) => str.replace(/\s+/g, "").replace(":", "÷").replace("/", "÷");

  const handleCheck = useCallback(() => {
    const res = DATA.map((row, i) => ({
      total: values[i].total === String(row.total),
      avg: values[i].avg === String(row.avg),
    }));
    setOk(res);

    const totalSum = DATA.reduce((acc, r) => acc + r.total, 0); // 84
    const rowCount = DATA.length; // 4
    const correctAnswer = Math.round(totalSum / rowCount); // 21

    const norm1 = normalize(working1);
    const norm2 = normalize(working2);

    setOkWorking1(norm1 === `${DATA.map(r => r.total).join("+")}=${totalSum}`);
    setOkWorking2(norm2 === `${totalSum}÷${rowCount}=${correctAnswer}`);
    setOkAnswer(answer === String(correctAnswer));

    const allCorrect =
      res.every((r) => r.total && r.avg) &&
      norm1 === `${DATA.map(r => r.total).join("+")}=${totalSum}` &&
      norm2 === `${totalSum}÷${rowCount}=${correctAnswer}` &&
      answer === String(correctAnswer);

    setStatus(allCorrect ? "match" : "wrong");
  }, [DATA, values, working1, working2, answer]);

  const handleShowSolution = useCallback(() => {
    setValues(DATA.map((r) => ({ total: String(r.total), avg: String(r.avg) })));
    setOk(DATA.map(() => ({ total: true, avg: true })));

    const totalSum = DATA.reduce((acc, r) => acc + r.total, 0);
    const rowCount = DATA.length;
    const correctAnswer = Math.round(totalSum / rowCount);

    setWorking1(`${DATA.map(r => r.total).join(" + ")} = ${totalSum}`);
    setWorking2(`${totalSum} ÷ ${rowCount} = ${correctAnswer}`);
    setAnswer(String(correctAnswer));
    setOkWorking1(true);
    setOkWorking2(true);
    setOkAnswer(true);

    setStatus("match");
  }, [DATA]);

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

  /* -------- Controls with Hint -------- */
  const { setControls } = useQuestionControls();
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setControls({
      handleCheck,
      handleShowSolution,
      handleShowHint: () => setShowHint(true),
      hint: help,
      showHint,
      summary,
    });
  }, [setControls, handleCheck, handleShowSolution, help, summary, showHint]);

  /* -------- Render -------- */
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">Calculate the average.</p>
      </div>
      <div>
        <img src="/images/arrtype111dice.png" alt="" />
      </div>
      <table className="w-full border border-slate-300 text-center">
        <thead className="bg-orange-50">
          <tr>
            <th className="p-2 border">throw</th>
            <th className="p-2 border">thrown</th>
            <th className="p-2 border">total number of throws</th>
            <th className="p-2 border">average per stone in this throw</th>
          </tr>
        </thead>
        <tbody>
          {DATA.map((row, i) => (
            <tr key={row.id}>
              <td className="p-2 border">{i + 1}</td>
              <td className="p-2 border">{row.thrown.join(",")}</td>
              <td className="p-2 border">
                <NumberInput
                  value={values[i].total}
                  onChange={(val) =>
                    setValues((prev) => {
                      const cp = [...prev];
                      cp[i] = { ...cp[i], total: val };
                      return cp;
                    })
                  }
                  ok={ok[i].total}
                />
              </td>
              <td className="p-2 border">
                <NumberInput
                  value={values[i].avg}
                  onChange={(val) =>
                    setValues((prev) => {
                      const cp = [...prev];
                      cp[i] = { ...cp[i], avg: val };
                      return cp;
                    })
                  }
                  ok={ok[i].avg}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex  gap-18">
        <p className="text-sm">
          What is the average number of points in a throw? Show your working.
        </p>

     <div>
         <div className="mb-2">
          <input
            type="text"
            value={working1}
            onChange={(e) => setWorking1(e.target.value)}
            placeholder="12 + 30 + 24 + 18 = 84"
            className={`border-b-2 border-dotted focus:outline-none ${
              okWorking1 === null
                ? "border-slate-400"
                : okWorking1
                ? "border-green-500 text-green-600"
                : "border-red-500 text-red-600"
            }`}
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            value={working2}
            onChange={(e) => setWorking2(e.target.value)}
            placeholder="84 ÷ 4 = 21"
            className={` border-b-2 border-dotted focus:outline-none ${
              okWorking2 === null
                ? "border-slate-400"
                : okWorking2
                ? "border-green-500 text-green-600"
                : "border-red-500 text-red-600"
            }`}
          />
        </div>
     </div>

        <div className="mt-2 flex items-center gap-2">
          <span>answer:</span>
          <NumberInput value={answer} onChange={setAnswer} ok={okAnswer} />
          <span>points</span>
        </div>
      </div>
    </div>
  );
};

export default ArrType_111;
