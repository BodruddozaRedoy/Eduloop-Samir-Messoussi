import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Player = {
  name: string;
  throws: number[][];
  average: number;
};

type Status = "idle" | "match" | "wrong";

interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

/* ---------------- Defaults ---------------- */
const DEFAULT_DATA: Player[] = [
  { name: "Charissa", throws: [[19, 17, 0], [2, 15, 10], [8, 16, 6]], average: 31 },
  { name: "Dennis", throws: [[10, 15, 5], [1, 4, 15], [20, 15, 5]], average: 30 },
  { name: "Raymond", throws: [[20, 4, 0], [0, 20, 19], [3, 2, 4]], average: 24 },
  { name: "Shanti", throws: [[7, 16, 1], [20, 16, 12], [2, 20, 8]], average: 34 },
];

const DEFAULT_HINT =
  "Add all points of the player and divide by the number of throws (3).";

/* ---------------- Component ---------------- */
const ArrType_112: React.FC = () => {
  const DATA = DEFAULT_DATA;
  const hint = DEFAULT_HINT;

  const [answers, setAnswers] = useState<string[]>(() => DATA.map(() => ""));
  const [ok, setOk] = useState<(boolean | null)[]>(() => DATA.map(() => null));
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  /* -------- Handlers -------- */
  const handleCheck = useCallback(() => {
    const resultArray = DATA.map(
      (player, i) => Number(answers[i]) === player.average
    );
    setOk(resultArray);

    const allCorrect = resultArray.every((r) => r === true);
    setStatus(allCorrect ? "match" : "wrong");

    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, DATA]);

  const handleShowSolution = useCallback(() => {
    setAnswers(DATA.map((player) => String(player.average)));
    setOk(DATA.map(() => true));
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

  /* -------- Hook into global controls -------- */
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
      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full border-collapse">
          <thead className="bg-orange-50 text-left">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Throw 1</th>
              <th className="px-4 py-2 border">Throw 2</th>
              <th className="px-4 py-2 border">Throw 3</th>
              <th className="px-4 py-2 border">
                Average number of points per throw
              </th>
            </tr>
          </thead>
          <tbody>
            {DATA.map((player, i) => (
              <tr key={player.name}>
                <td className="border px-4 py-2 font-semibold">{player.name}</td>

                {player.throws.map((round, j) => (
                  <td key={j} className="border px-4 py-2">
                    {round.join(",")}
                  </td>
                ))}

                <td className="border px-4 py-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={answers[i]}
                    onChange={(e) => {
                      const cp = [...answers];
                      cp[i] = e.target.value.replace(/[^0-9]/g, "");
                      setAnswers(cp);
                    }}
                    className={`w-16 text-center border-b-2 border-dotted focus:outline-none ${
                      ok[i] === null
                        ? "border-slate-400"
                        : ok[i]
                        ? "border-green-500 text-green-600"
                        : "border-red-500 text-red-600"
                    }`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


    </div>
  );
};

export default ArrType_112;
