import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Problem = {
  id: string;
  left: number;
  rounded: number;
};

type DataProp = {
  tens: Problem[];
  hundreds: Problem[];
};

type Props = {
  data?: DataProp;
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
const DEFAULT_DATA: DataProp = {
  tens: [
    { id: "t1", left: 2753, rounded: 2750 },
    { id: "t2", left: 4045, rounded: 4050 },
    { id: "t3", left: 8904, rounded: 8900 },
    { id: "t4", left: 3899, rounded: 3900 },
    { id: "t5", left: 7651, rounded: 7650 },
    { id: "t6", left: 8566, rounded: 8570 },
  ],
  hundreds: [
    { id: "h1", left: 3589, rounded: 3600 },
    { id: "h2", left: 7853, rounded: 7900 },
    { id: "h3", left: 8049, rounded: 8000 },
    { id: "h4", left: 3445, rounded: 3400 },
    { id: "h5", left: 9975, rounded: 10000 },
    { id: "h6", left: 5555, rounded: 5600 },
  ],
};

const DEFAULT_HINT = "Round each number to the nearest tens or hundreds.";

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
      onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
      className={`w-20 text-center border-b-2 border-dotted focus:outline-none ${border}`}
    />
  );
};

/* ---------------- Section ---------------- */
const Section: React.FC<{
  title: string;
  problems: Problem[];
  values: string[];
  setValues: React.Dispatch<React.SetStateAction<string[]>>;
  ok: (boolean | null)[];
}> = ({ title, problems, values, setValues, ok }) => {
  return (
    <div className="flex-1">
      <h3 className="bg-slate-100 text-center py-2 font-medium">{title}</h3>
      <div className="space-y-4 mt-3 grid grid-cols-2">
        {problems.map((p, i) => (
          <div key={p.id} className="flex items-center gap-3 text-lg">
            <span>{p.left}</span>
            <span className="text-orange-600 font-bold text-6xl">→</span>
            <NumberInput
              value={values[i]}
              onChange={(val) =>
                setValues((prev) => {
                  const cp = [...prev];
                  cp[i] = val;
                  return cp;
                })
              }
              ok={ok[i]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- Main Component ---------------- */
const ArrType_94: React.FC<Props> = ({ data, hint }) => {
  const DATA = useMemo(() => {
    if (
      data &&
      typeof data === "object" &&
      Array.isArray((data as DataProp).tens) &&
      Array.isArray((data as DataProp).hundreds)
    ) {
      return data as DataProp;
    }
    return DEFAULT_DATA;
  }, [data]);
  const help = hint ?? DEFAULT_HINT;

  const [valuesTens, setValuesTens] = useState<string[]>(() =>
    DATA.tens.map(() => "")
  );
  const [valuesHundreds, setValuesHundreds] = useState<string[]>(() =>
    DATA.hundreds.map(() => "")
  );
  const [okTens, setOkTens] = useState<(boolean | null)[]>(() =>
    DATA.tens.map(() => null)
  );
  const [okHundreds, setOkHundreds] = useState<(boolean | null)[]>(() =>
    DATA.hundreds.map(() => null)
  );
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setValuesTens(DATA.tens.map(() => ""));
    setValuesHundreds(DATA.hundreds.map(() => ""));
    setOkTens(DATA.tens.map(() => null));
    setOkHundreds(DATA.hundreds.map(() => null));
    setStatus("idle");
    setShowHint(false);
  }, [DATA]);

  /* -------- Handlers -------- */
      const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const handleCheck = useCallback(() => {
    const resTens = DATA.tens.map((p, i) => valuesTens[i] === String(p.rounded));
    const resHundreds = DATA.hundreds.map(
      (p, i) => valuesHundreds[i] === String(p.rounded)
    );
    setOkTens(resTens);
    setOkHundreds(resHundreds);
    setStatus([...resTens, ...resHundreds].every(Boolean) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },[...resTens, ...resHundreds].every(Boolean));
  }, [DATA, valuesTens, valuesHundreds]);

  const handleShowSolution = useCallback(() => {
    setValuesTens(DATA.tens.map((p) => String(p.rounded)));
    setValuesHundreds(DATA.hundreds.map((p) => String(p.rounded)));
    setOkTens(DATA.tens.map(() => true));
    setOkHundreds(DATA.hundreds.map(() => true));
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
    <div className="space-y-6">
      <div>
        {/* <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">Round off.</p> */}
      </div>

      <div className="grid grid-cols-2 gap-10">
        <Section
          title="to tens"
          problems={DATA.tens}
          values={valuesTens}
          setValues={setValuesTens}
          ok={okTens}
        />
        <Section
          title="to hundreds"
          problems={DATA.hundreds}
          values={valuesHundreds}
          setValues={setValuesHundreds}
          ok={okHundreds}
        />
      </div>
    </div>
  );
};

export default ArrType_94;
