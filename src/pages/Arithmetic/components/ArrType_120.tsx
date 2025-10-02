import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Item = {
  id: string;
  img: string;
  unit: string;
  volume: number;
  liters: number;
};

type Props = {
  data?: Item[];
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
const DEFAULT_DATA: Item[] = [
  { id: "b1", img: "/images/arrtype120img1.png", unit: "m²", volume: 60, liters: 60 },
  { id: "b2", img: "/images/arrtype120img2.png", unit: "cm²", volume: 16000, liters: 16 },
  { id: "b3", img: "/images/arrtype120img3.png", unit: "m²", volume: 30, liters: 30000 },
];

const DEFAULT_HINT =
  "Find the volume of each rectangular box (l × w × h). Convert into liters where required.";

/* ---------------- Main ---------------- */
const ArrType_120: React.FC<Props> = ({ data, hint }) => {
  const DATA =  DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;

  const [values, setValues] = useState(() =>
    DATA.map(() => ({ volume: "", liters: "" }))
  );
  const [ok, setOk] = useState(() =>
    DATA.map(() => ({ volume: null as boolean | null, liters: null as boolean | null }))
  );
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setValues(DATA.map(() => ({ volume: "", liters: "" })));
    setOk(DATA.map(() => ({ volume: null, liters: null })));
    setStatus("idle");
    setShowHint(false);
  }, [data]);

  /* -------- Handlers -------- */
  const handleCheck = useCallback(() => {
    const results = DATA.map((item, i) => {
      const volOk = values[i].volume === String(item.volume);
      const litOk = values[i].liters === String(item.liters);
      return { volume: volOk, liters: litOk };
    });
    setOk(results);

    const allCorrect = results.every(
      (r) => r.volume === true && r.liters === true
    );
    setStatus(allCorrect ? "match" : "wrong");
  }, [values, DATA]);

  const handleShowSolution = useCallback(() => {
    setValues(DATA.map((item) => ({
      volume: String(item.volume),
      liters: String(item.liters),
    })));
    setOk(DATA.map(() => ({ volume: true, liters: true })));
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
      <h2 className="text-lg font-semibold">Question 1</h2>
      <p className="text-sm text-slate-600">Wat is de inhoud?</p>

      <div className="grid grid-cols-3 gap-6">
        {DATA.map((item, i) => (
          <div key={item.id} className="space-y-3">
            <img src={item.img} alt="box" className="mx-auto h-32" />

            <p>
              De inhoud van bak is{" "}
              <input
                type="text"
                value={values[i].volume}
                onChange={(e) => {
                  const cp = [...values];
                  cp[i].volume = e.target.value.replace(/[^0-9]/g, "");
                  setValues(cp);
                }}
                className={`w-20 text-center border-b-2 border-dotted focus:outline-none ${
                  ok[i].volume === null
                    ? "border-slate-400"
                    : ok[i].volume
                    ? "border-green-500 text-green-600"
                    : "border-red-500 text-red-600"
                }`}
              />{" "}
              {item.unit}
            </p>

            <p>
              Dan is{" "}
              <input
                type="text"
                value={values[i].liters}
                onChange={(e) => {
                  const cp = [...values];
                  cp[i].liters = e.target.value.replace(/[^0-9]/g, "");
                  setValues(cp);
                }}
                className={`w-28 text-center border-b-2 border-dotted focus:outline-none ${
                  ok[i].liters === null
                    ? "border-slate-400"
                    : ok[i].liters
                    ? "border-green-500 text-green-600"
                    : "border-red-500 text-red-600"
                }`}
              />{" "}
              liter
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrType_120;
