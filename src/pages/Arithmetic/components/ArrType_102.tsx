import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Problem = {
  id: string;
  label: string;
  img: string;
  sum: [string, string, string];        // e.g. [ "40", "7", "280" ]
  reverse: [string, string, string];    // e.g. [ "7", "40", "280" ]
  small: [string, string, string];      // e.g. [ "7", "4", "28" ]
  answer: string;                       // e.g. "280"
  unit: string;                         // e.g. "euros", "kg", "litres"
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
    label: "How much do 40 plants cost?",
    img: "/images/arrtype102yellowflowereuro7.png",
    sum: ["40", "7", "280"],
    reverse: ["7", "40", "280"],
    small: ["7", "4", "28"],
    answer: "280",
    unit: "euros",
  },
  {
    id: "p2",
    label: "How much do 80 flowers cost?",
    img: "/images/arrtype102redflowereuro3.png",
    sum: ["80", "3", "240"],
    reverse: ["3", "80", "240"],
    small: ["3", "8", "24"],
    answer: "240",
    unit: "euros",
  },
  {
    id: "p3",
    label: "How many kg in 9 weight?",
    img: "/images/arrtype102weight20.png",
    sum: ["9", "20", "180"],
    reverse: ["20", "9", "180"],
    small: ["9", "2", "18"],
    answer: "180",
    unit: "kg",
  },
  {
    id: "p4",
    label: "How much do 40 cane cost?",
    img: "/images/arrtype102caneliter30.png",
    sum: ["6", "30", "180"],
    reverse: ["30", "6", "180"],
    small: ["6", "3", "18"],
    answer: "180",
    unit: "litres",
  },
];

const DEFAULT_HINT =
  "Fill in all the multipliers and results. Remember: sum → reverse → small sum → final answer.";

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
      className={`w-16 text-center border-b-2 border-dotted focus:outline-none ${border}`}
    />
  );
};

/* ---------------- Main Component ---------------- */
const ArrType_102: React.FC<Props> = ({ data, hint }) => {
  const DATA = DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;

  const [values, setValues] = useState(() =>
    DATA.map(() => ({
      sum: ["", "", ""],
      reverse: ["", "", ""],
      small: ["", "", ""],
      answer: "",
    }))
  );
  const [ok, setOk] = useState(() =>
    DATA.map(() => ({
      sum: [null, null, null],
      reverse: [null, null, null],
      small: [null, null, null],
      answer: null,
    }))
  );
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setValues(
      DATA.map(() => ({
        sum: ["", "", ""],
        reverse: ["", "", ""],
        small: ["", "", ""],
        answer: "",
      }))
    );
    setOk(
      DATA.map(() => ({
        sum: [null, null, null],
        reverse: [null, null, null],
        small: [null, null, null],
        answer: null,
      }))
    );
    setStatus("idle");
    setShowHint(false);
  }, [data]);

  /* -------- Handlers -------- */
      const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const handleCheck = useCallback(() => {
    const results = DATA.map((p, i) => {
      const v = values[i];
      return {
        sum: v.sum.map((x, j) => x === p.sum[j]),
        reverse: v.reverse.map((x, j) => x === p.reverse[j]),
        small: v.small.map((x, j) => x === p.small[j]),
        answer: v.answer === p.answer,
      };
    });
    setOk(results);
    const allCorrect = results.every(
      (r) =>
        r.sum.every(Boolean) &&
        r.reverse.every(Boolean) &&
        r.small.every(Boolean) &&
        r.answer
    );
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },allCorrect);
  }, [DATA, values]);

  const handleShowSolution = useCallback(() => {
    setValues(
      DATA.map((p) => ({
        sum: [...p.sum],
        reverse: [...p.reverse],
        small: [...p.small],
        answer: p.answer,
      }))
    );
    setOk(
      DATA.map(() => ({
        sum: [true, true, true],
        reverse: [true, true, true],
        small: [true, true, true],
        answer: true,
      }))
    );
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
      <div>
        {/* <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">Write down the sum. Calculate.</p> */}
      </div>

      {showHint && (
        <div className="p-3 border border-amber-300 bg-amber-50 text-amber-800 text-sm rounded">
          {help}
        </div>
      )}

      <div className="grid grid-cols-2 gap-10">
        {DATA.map((p, i) => (
          <div key={p.id} className="space-y-4">
            <img src={p.img} alt={p.label} className="h-28 object-contain" />
            <p className="font-medium">{p.label}</p>

            {/* Sum */}
            <p>
              Sum:{" "}
              <NumberInput
                value={values[i].sum[0]}
                onChange={(val) =>
                  setValues((prev) => {
                    const cp = [...prev];
                    cp[i].sum[0] = val;
                    return [...cp];
                  })
                }
                ok={ok[i].sum[0]}
              />{" "}
              ×{" "}
              <NumberInput
                value={values[i].sum[1]}
                onChange={(val) =>
                  setValues((prev) => {
                    const cp = [...prev];
                    cp[i].sum[1] = val;
                    return [...cp];
                  })
                }
                ok={ok[i].sum[1]}
              />{" "}
              ={" "}
              <NumberInput
                value={values[i].sum[2]}
                onChange={(val) =>
                  setValues((prev) => {
                    const cp = [...prev];
                    cp[i].sum[2] = val;
                    return [...cp];
                  })
                }
                ok={ok[i].sum[2]}
              />{" "}
              {p.unit}
            </p>

            {/* Reverse */}
            <p>
              Reverse:{" "}
              <NumberInput
                value={values[i].reverse[0]}
                onChange={(val) =>
                  setValues((prev) => {
                    const cp = [...prev];
                    cp[i].reverse[0] = val;
                    return [...cp];
                  })
                }
                ok={ok[i].reverse[0]}
              />{" "}
              ×{" "}
              <NumberInput
                value={values[i].reverse[1]}
                onChange={(val) =>
                  setValues((prev) => {
                    const cp = [...prev];
                    cp[i].reverse[1] = val;
                    return [...cp];
                  })
                }
                ok={ok[i].reverse[1]}
              />{" "}
              ={" "}
              <NumberInput
                value={values[i].reverse[2]}
                onChange={(val) =>
                  setValues((prev) => {
                    const cp = [...prev];
                    cp[i].reverse[2] = val;
                    return [...cp];
                  })
                }
                ok={ok[i].reverse[2]}
              />{" "}
              {p.unit}
            </p>

            {/* Small sum */}
            <p>
              Small sum:{" "}
              <NumberInput
                value={values[i].small[0]}
                onChange={(val) =>
                  setValues((prev) => {
                    const cp = [...prev];
                    cp[i].small[0] = val;
                    return [...cp];
                  })
                }
                ok={ok[i].small[0]}
              />{" "}
              ×{" "}
              <NumberInput
                value={values[i].small[1]}
                onChange={(val) =>
                  setValues((prev) => {
                    const cp = [...prev];
                    cp[i].small[1] = val;
                    return [...cp];
                  })
                }
                ok={ok[i].small[1]}
              />{" "}
              ={" "}
              <NumberInput
                value={values[i].small[2]}
                onChange={(val) =>
                  setValues((prev) => {
                    const cp = [...prev];
                    cp[i].small[2] = val;
                    return [...cp];
                  })
                }
                ok={ok[i].small[2]}
              />
            </p>

            {/* Answer */}
            <p>
              Answer:{" "}
              <NumberInput
                value={values[i].answer}
                onChange={(val) =>
                  setValues((prev) => {
                    const cp = [...prev];
                    cp[i].answer = val;
                    return [...cp];
                  })
                }
                ok={ok[i].answer}
              />{" "}
              {p.unit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrType_102;
