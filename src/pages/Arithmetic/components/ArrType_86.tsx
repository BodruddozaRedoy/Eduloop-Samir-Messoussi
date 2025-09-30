import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Problem = {
  id: string;
  text: string;
  total: number;
  subtract: number;
  unit: string;
};

type Props = {
  data?: Problem[];
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
const DEFAULT_DATA: Problem[] = [
  {
    id: "p1",
    text: "Rachid has 36 books. His sister has 18 fewer. How many books does his sister have?",
    total: 36,
    subtract: 18,
    unit: "books",
  },
  {
    id: "p2",
    text: "Sam has 63 euros. He buys a game for 29 euros. How much money does he have left?",
    total: 63,
    subtract: 29,
    unit: "euros",
  },
];

const DEFAULT_HINT =
  "Write the subtraction equation and the correct answer based on the story.";

/* ---------------- Component ---------------- */
const ArrType_86: React.FC<Props> = ({ data:DEFAULT_DATA, hint }) => {
  // const DATA = useMemo(
  //   () => (Array.isArray(data) && data.length ? data : DEFAULT_DATA),
  //   [data]
  // );
  const DATA = DEFAULT_DATA;

  const help = hint ?? DEFAULT_HINT;

  const [equations, setEquations] = useState<string[]>(() =>
    DATA.map(() => "")
  );
  const [answers, setAnswers] = useState<string[]>(() =>
    DATA.map(() => "")
  );
  const [ok, setOk] = useState<(boolean | null)[]>(() =>
    DATA.map(() => null)
  );
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  // Reset when data changes
  useEffect(() => {
    setEquations(DATA.map(() => ""));
    setAnswers(DATA.map(() => ""));
    setOk(DATA.map(() => null));
    setStatus("idle");
    setShowHint(false);
  }, [DATA]);

  /* -------- Handlers -------- */
  const handleCheck = useCallback(() => {
    const results = DATA.map((p, i) => {
      const expectedEq = `${p.total} - ${p.subtract} = ${p.total - p.subtract}`;
      const expectedAns = String(p.total - p.subtract);

      return (
        equations[i].replace(/\s+/g, "") === expectedEq.replace(/\s+/g, "") &&
        answers[i].trim() === expectedAns
      );
    });
    setOk(results);
    setStatus(results.every(Boolean) ? "match" : "wrong");
  }, [DATA, equations, answers]);

  const handleShowSolution = useCallback(() => {
    setEquations(
      DATA.map((p) => `${p.total} - ${p.subtract} = ${p.total - p.subtract}`)
    );
    setAnswers(DATA.map((p) => String(p.total - p.subtract)));
    setOk(DATA.map(() => true));
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
  }, [setControls, handleCheck, handleShowSolution, handleShowHint, help, showHint, summary]);

  /* -------- Render -------- */
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Question 5</h2>
        <p className="text-sm text-slate-600">
          Which sum corresponds to this? Calculate on the number line.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {DATA.map((p, i) => (
          <div key={p.id} className="flex items-start gap-6">
            {/* Left side: story */}
            <div className="bg-orange-100 px-4 py-3 rounded-md w-80">
              <p className="text-slate-800 text-sm">{p.text}</p>
            </div>

            {/* Right side: inputs */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-700">sum:</span>
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
                  className={`border-b-2 border-dashed outline-none px-1 w-40 text-center
                    ${
                      ok[i] === null
                        ? "border-slate-400"
                        : ok[i]
                        ? "border-green-600 text-green-600"
                        : "border-red-600 text-red-600"
                    }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-700">answer:</span>
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
                  className={`border-b-2 border-dashed outline-none px-1 w-20 text-center
                    ${
                      ok[i] === null
                        ? "border-slate-400"
                        : ok[i]
                        ? "border-green-600 text-green-600"
                        : "border-red-600 text-red-600"
                    }`}
                />
                <span className="text-slate-700">{p.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showHint && (
        <div className="p-3 border border-amber-300 bg-amber-50 text-amber-800 text-sm rounded">
          {help}
        </div>
      )}
    </div>
  );
};

export default ArrType_86;
