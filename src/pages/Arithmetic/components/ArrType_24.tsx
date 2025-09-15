import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useState } from "react";
import useResultTracker from "@/hooks/useResultTracker";
import { useQuestionMeta } from "@/context/QuestionMetaContext";

/* ---- MathInput Component ---- */
function MathInput({
  value,
  onChange,
  invalid,
  correct,
  style,
}: {
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  correct?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9\+\-\*\/]/g, ""))}
      style={style}
      className={`h-12 w-40 px-3 text-lg font-semibold outline-none
      text-center font-mono tabular-nums rounded-lg
      
      ${
        invalid
          ? "border-rose-500 text-rose-700"
          : correct
          ? "border-emerald-600 text-emerald-700"
          : "border-blue-500 text-slate-800"
      }`}
    />
  );
}

/* ---- NumberSplitInput Component ---- */
function NumberSplitInput({
  value,
  onChange,
  invalid,
  correct,
}: {
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  correct?: boolean;
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
      className={`h-12 w-20 bg-white px-3 text-lg font-semibold outline-none
      text-center font-mono tabular-nums mb-10 rounded-lg
      border-2 border-dashed ${
        invalid
          ? "border-rose-500 text-rose-700"
          : correct
          ? "border-emerald-600 text-emerald-700"
          : "border-slate-400 text-slate-800"
      }`}
    />
  );
}

/* ---- ArrType_24 Component ---- */
type Row = {
  id: number;
  expression: string;
  expectedSplit: [string, string];
  expectedSum: string;
  mainExpression: string;
  expectedResult: string;
  firstSplit: string;
  secondSplit: string;
};

// Dummy data from the image
const DUMMY_DATA: Row[] = [
  {
    id: 1,
    expression: "6 × 37 =",
    expectedSplit: ["30", "7"],
    expectedSum: "180 + 42",
    mainExpression: "6 × 37",
    expectedResult: "222",
    firstSplit: "180",
    secondSplit: "42",
  },
  {
    id: 2,
    expression: "7 × 28 =",
    expectedSplit: ["20", "8"],
    expectedSum: "140 + 56",
    mainExpression: "7 × 28",
    expectedResult: "196",
    firstSplit: "140",
    secondSplit: "56",
  },
  {
    id: 3,
    expression: "4 × 57 =",
    expectedSplit: ["50", "7"],
    expectedSum: "200 + 28",
    mainExpression: "4 × 57",
    expectedResult: "228",
    firstSplit: "200",
    secondSplit: "28",
  },
  {
    id: 4,
    expression: "4 × 57 =",
    expectedSplit: ["50", "7"],
    expectedSum: "200 + 28",
    mainExpression: "4 × 57",
    expectedResult: "228",
    firstSplit: "200",
    secondSplit: "28",
  },
  {
    id: 5,
    expression: "4 × 57 =",
    expectedSplit: ["50", "7"],
    expectedSum: "200 + 28",
    mainExpression: "4 × 57",
    expectedResult: "228",
    firstSplit: "200",
    secondSplit: "28",
  },
];

const HINT_TEXT =
  "Split the second number into tens and ones, then multiply each by the first number and add the results.";

export default function ArrType_24() {
  type Status = "idle" | "match" | "wrong";

  const [state, setState] = useState<
    Record<
      number,
      {
        sumVal: string;
        splitVal: [string, string];
        resultVal: string;
        checked: boolean;
      }
    >
  >(() => {
    const init: Record<
      number,
      { sumVal: string; splitVal: [string, string]; resultVal: string; checked: boolean }
    > = {};
    DUMMY_DATA.forEach(
      (r) => (init[r.id] = { sumVal: "", splitVal: ["", ""], resultVal: "", checked: false })
    );
    return init;
  });

  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);
  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  const setVal = (id: number, type: "sum" | "split0" | "split1" | "result", v: string) => {
    setState((s) => {
      const next = { ...s };
      const current = next[id];
      if (type === "sum") {
        next[id] = { ...current, sumVal: v };
      } else if (type.startsWith("split")) {
        const splitVals = [...current.splitVal] as [string, string];
        splitVals[type === "split0" ? 0 : 1] = v;
        next[id] = { ...current, splitVal: splitVals };
      } else if (type === "result") {
        next[id] = { ...current, resultVal: v };
      }
      return next;
    });
  };

  const handleCheckAll = () => {
    let anyWrong = false;
    let allFilledAndCorrect = true;

    setState((s) => {
      const next: typeof s = { ...s };
      for (const r of DUMMY_DATA) {
        const current = next[r.id];
        const isCorrect =
          current.sumVal.trim() === r.expectedSum &&
          current.splitVal[0].trim() === r.expectedSplit[0] &&
          current.splitVal[1].trim() === r.expectedSplit[1] &&
          current.resultVal.trim() === r.expectedResult;

        if (!isCorrect) anyWrong = true;
        if (
          current.sumVal.trim() === "" ||
          current.splitVal[0].trim() === "" ||
          current.splitVal[1].trim() === "" ||
          current.resultVal.trim() === ""
        ) {
          allFilledAndCorrect = false;
        }

        next[r.id] = { ...current, checked: true };
      }
      return next;
    });

    const ok = !anyWrong && allFilledAndCorrect;
    setStatus(ok ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, ok);
  };

  const handleShowSolution = () => {
    setState((s) => {
      const next: typeof s = { ...s };
      for (const r of DUMMY_DATA) {
        next[r.id] = {
          sumVal: r.expectedSum,
          splitVal: r.expectedSplit,
          resultVal: r.expectedResult,
          checked: true,
        };
      }
      return next;
    });
    setStatus("match");
  };

  interface Summary {
    text: string;
    color: string;
    bgColor: string;
    borderColor: string;
  }

  const summary: Summary | null =
    status === "match"
      ? {
          text: "🎉 Correct! Great job.",
          color: "text-green-700",
          bgColor: "bg-green-100",
          borderColor: "border-green-600",
        }
      : status === "wrong"
      ? {
          text: "❌ Some answers are wrong. Check again.",
          color: "text-red-700",
          bgColor: "bg-red-100",
          borderColor: "border-red-600",
        }
      : null;

  return (
    <div className="flex flex-col items-start justify-start space-y-8 w-full px-4 py-8">
      {/* Header */}
      <div className="text-left w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-2">Question 1</h2>
        <p className="text-slate-600 text-lg">
          Calculate by splitting.
          <br />
          Show how you calculate.
        </p>
      </div>

      {/* Questions */}
      <div className="flex flex-wrap justify-start gap-12 ">
        {DUMMY_DATA.map((r) => {
          const st = state[r.id];
          const isCorrect =
            st.checked &&
            st.sumVal === r.expectedSum &&
            st.splitVal[0] === r.expectedSplit[0] &&
            st.splitVal[1] === r.expectedSplit[1] &&
            st.resultVal === r.expectedResult;
          const isInvalid = st.checked && !isCorrect;

          return (
            <div
              key={r.id}
              className="relative flex flex-col items-center p-6 space-y-4 rounded-2xl bg-amber-50/60 shadow-md"
            >
              {/* First Row - Sum input with centered bg */}
              <div className="relative w-full flex justify-center">
                <MathInput
                  value={st.sumVal}
                  onChange={(v) => setVal(r.id, "sum", v)}
                  invalid={isInvalid && st.sumVal !== r.expectedSum}
                  correct={st.checked && st.sumVal === r.expectedSum}
                  style={{
                    backgroundImage: "url('/images/union.png')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                />
              </div>

              {/* Second Row - Expression and Result input */}
              <div className="flex items-center ">
                <span className="text-2xl font-semibold text-slate-800">{r.expression}</span>
                <MathInput
                  value={st.resultVal}
                  onChange={(v) => setVal(r.id, "result", v)}
                  invalid={isInvalid && st.resultVal !== r.expectedResult}
                  correct={st.checked && st.resultVal === r.expectedResult}
                />
              </div>

              {/* Third Row - Split inputs */}
              <div className="flex items-center space-x-6 z-10">
                <NumberSplitInput
                  value={st.splitVal[0]}
                  onChange={(v) => setVal(r.id, "split0", v)}
                  invalid={isInvalid && st.splitVal[0] !== r.expectedSplit[0]}
                  correct={st.checked && st.splitVal[0] === r.expectedSplit[0]}
                />
                <NumberSplitInput
                  value={st.splitVal[1]}
                  onChange={(v) => setVal(r.id, "split1", v)}
                  invalid={isInvalid && st.splitVal[1] !== r.expectedSplit[1]}
                  correct={st.checked && st.splitVal[1] === r.expectedSplit[1]}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-start space-y-4 w-full max-w-xl mt-8">
        <Controllers
          handleCheck={handleCheckAll}
          handleShowSolution={handleShowSolution}
          handleShowHint={() => setShowHint((v) => !v)}
        />
        {showHint && <Hint hint={HINT_TEXT} />}
        <Check summary={summary} />
      </div>
    </div>
  );
}
