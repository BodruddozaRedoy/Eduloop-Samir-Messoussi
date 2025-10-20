import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Problem = {
  id: string;
  img: string;
  label: string;
  inputs: { id: string; text: string; unit: string; answer: string }[];
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
    id: "flowerbox",
    img: "/images/arrtype99harvestthings.png",
    label: "Flower Box",
    inputs: [
      { id: "fb1", text: "The content of the flower box is", unit: "dm2", answer: "360" },
      { id: "fb2", text: "That", unit: "litres", answer: "360" },
    ],
  },
  {
    id: "container",
    img: "/images/arrtype99container.png",
    label: "Container",
    inputs: [
      { id: "c1", text: "The content of the container is", unit: "m2", answer: "5.4" },
      { id: "c2", text: "That is", unit: "litres", answer: "5400" },
      { id: "c3", text: "The flower box fits", unit: "times in the container", answer: "15" },
    ],
  },
];

const DEFAULT_HINT =
  "Calculate the volume of each object. Convert to litres (1 dm³ = 1 litre). Then divide container volume by flower box volume.";

/* ---------------- Input ---------------- */
const NumberInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  ok: boolean | null;
}> = ({ value, onChange, ok }) => {
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
      onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
      className={`w-20 text-center border-b-2 border-dotted focus:outline-none ${border}`}
    />
  );
};

/* ---------------- Main Component ---------------- */
const ArrType_100: React.FC<Props> = ({ data, hint }) => {
  const DATA = DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;

  const [values, setValues] = useState<string[][]>(() =>
    DATA.map((p) => p.inputs.map(() => ""))
  );
  const [ok, setOk] = useState<(boolean | null)[][]>(() =>
    DATA.map((p) => p.inputs.map(() => null))
  );
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setValues(DATA.map((p) => p.inputs.map(() => "")));
    setOk(DATA.map((p) => p.inputs.map(() => null)));
    setStatus("idle");
    setShowHint(false);
  }, [data]);

  /* -------- Handlers -------- */

      const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const handleCheck = useCallback(() => {
    const results = DATA.map((p, i) =>
      p.inputs.map((inp, j) => values[i][j] === inp.answer)
    );
    setOk(results);
    setStatus(results.every((row) => row.every(Boolean)) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },results.every((row) => row.every(Boolean)));
  }, [DATA, values]);

  const handleShowSolution = useCallback(() => {
    setValues(DATA.map((p) => p.inputs.map((inp) => inp.answer)));
    setOk(DATA.map((p) => p.inputs.map(() => true)));
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
  }, [setControls, handleCheck, handleShowSolution, handleShowHint, help, showHint, summary]);

  /* -------- Render -------- */
  return (
    <div className="space-y-8">
      <div>
        {/* <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">
          What is the content? How many flower boxes fit in the large container?
        </p> */}
      </div>

      <div className="grid grid-cols-2 gap-10">
        {DATA.map((p, i) => (
          <div key={p.id} className="flex flex-col items-center gap-4">
            <img src={p.img} alt={p.label} className="h-40 object-contain" />

            <div className="space-y-3 text-lg">
              {p.inputs.map((inp, j) => (
                <div key={inp.id} className="flex items-center gap-2">
                  <span>{inp.text}</span>
                  <NumberInput
                    value={values[i][j]}
                    onChange={(val) =>
                      setValues((prev) => {
                        const cp = [...prev];
                        cp[i] = [...cp[i]];
                        cp[i][j] = val;
                        return cp;
                      })
                    }
                    ok={ok[i][j]}
                  />
                  <span>{inp.unit}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrType_100;

