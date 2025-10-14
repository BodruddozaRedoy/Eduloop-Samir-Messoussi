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

type SectionData = {
  title: string;
  problems: Problem[];
};

type DataProp = {
  left: SectionData[];
  right: SectionData[];
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
  left: [
    { title: "to tens", problems: [{ id: "l1", left: 2159, rounded: 2160 }] },
    { title: "to hundreds", problems: [{ id: "l2", left: 3451, rounded: 3500 }] },
    { title: "to thousands", problems: [{ id: "l3", left: 67283, rounded: 67000 }] },
  ],
  right: [
    { title: "to tens", problems: [{ id: "r1", left: 4637, rounded: 4640 }] },
    { title: "to hundreds", problems: [{ id: "r2", left: 3428, rounded: 3400 }] },
    { title: "to thousands", problems: [{ id: "r3", left: 82713, rounded: 83000 }] },
  ],
};

const DEFAULT_HINT = "Round each number to the nearest tens, hundreds, or thousands.";

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
      className={`w-24 text-center border-b-2 border-dotted focus:outline-none ${border}`}
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
}> = ({ title, problems, values, setValues, ok }) => (
  <div className="space-y-4">
    <h3 className="bg-slate-100 text-center py-2 font-medium">{title}</h3>
    {problems.map((p, i) => (
      <div key={p.id} className="flex items-center gap-3 text-lg">
        <span>{p.left}</span>
        <span className="text-orange-600 font-bold text-4xl">→</span>
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
);

/* ---------------- Main Component ---------------- */
const ArrType_95: React.FC<Props> = ({ data, hint }) => {
  // const DATA = data ?? DEFAULT_DATA;
  const DATA = DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;

  const [valuesLeft, setValuesLeft] = useState<string[][]>(
    () => DATA.left.map((s) => s.problems.map(() => ""))
  );
  const [valuesRight, setValuesRight] = useState<string[][]>(
    () => DATA.right.map((s) => s.problems.map(() => ""))
  );
  const [okLeft, setOkLeft] = useState<(boolean | null)[][]>(
    () => DATA.left.map((s) => s.problems.map(() => null))
  );
  const [okRight, setOkRight] = useState<(boolean | null)[][]>(
    () => DATA.right.map((s) => s.problems.map(() => null))
  );

  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setValuesLeft(DATA.left.map((s) => s.problems.map(() => "")));
    setValuesRight(DATA.right.map((s) => s.problems.map(() => "")));
    setOkLeft(DATA.left.map((s) => s.problems.map(() => null)));
    setOkRight(DATA.right.map((s) => s.problems.map(() => null)));
    setStatus("idle");
    setShowHint(false);
  }, [DATA]);

  /* -------- Handlers -------- */
      const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const handleCheck = useCallback(() => {
    const resLeft = DATA.left.map((s, si) =>
      s.problems.map((p, pi) => valuesLeft[si][pi] === String(p.rounded))
    );
    const resRight = DATA.right.map((s, si) =>
      s.problems.map((p, pi) => valuesRight[si][pi] === String(p.rounded))
    );
    setOkLeft(resLeft);
    setOkRight(resRight);
    const all = [...resLeft.flat(), ...resRight.flat()];
    setStatus(all.every(Boolean) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },all.every(Boolean));
  }, [DATA, valuesLeft, valuesRight]);

  const handleShowSolution = useCallback(() => {
    setValuesLeft(DATA.left.map((s) => s.problems.map((p) => String(p.rounded))));
    setValuesRight(DATA.right.map((s) => s.problems.map((p) => String(p.rounded))));
    setOkLeft(DATA.left.map((s) => s.problems.map(() => true)));
    setOkRight(DATA.right.map((s) => s.problems.map(() => true)));
    setStatus("match");
  }, [DATA]);

  const handleShowHint = useCallback(() => setShowHint((prev) => !prev), []);

  /* -------- Summary -------- */
  const summary: Summary | null = useMemo(() => {
    if (status === "match")
      return { text: "Correct! Great job.", color: "text-green-700", bgColor: "bg-green-100", borderColor: "border-green-600" };
    if (status === "wrong")
      return { text: "Some answers are wrong. Try again.", color: "text-red-700", bgColor: "bg-red-100", borderColor: "border-red-600" };
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
        <p className="text-sm text-slate-600">Round the numbers off.</p> */}
      </div>

      <div className="grid grid-cols-2 gap-10">
        <div className="space-y-6">
          {DATA.left.map((s, si) => (
            <Section
              key={si}
              title={s.title}
              problems={s.problems}
              values={valuesLeft[si]}
              setValues={(val) =>
                setValuesLeft((prev) => {
                  const cp = [...prev];
                  cp[si] = val;
                  return cp;
                })
              }
              ok={okLeft[si]}
            />
          ))}
        </div>
        <div className="space-y-6">
          {DATA.right.map((s, si) => (
            <Section
              key={si}
              title={s.title}
              problems={s.problems}
              values={valuesRight[si]}
              setValues={(val) =>
                setValuesRight((prev) => {
                  const cp = [...prev];
                  cp[si] = val;
                  return cp;
                })
              }
              ok={okRight[si]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArrType_95;
