// import { useQuestionControls } from "@/context/QuestionControlsContext";
// import React, { useCallback, useEffect, useMemo, useState } from "react";

// /* ---------------- Types ---------------- */
// type DataProp = {
//   given: {
//     id: string;
//     label: string;   // e.g. "1 kg of apples"
//     price: string;   // e.g. "1.60"
//   }[];
//   problems: {
//     id: string;
//     text: string;    // e.g. "500 g of apples costs £"
//     answer: string;  // e.g. "0.80"
//   }[];
// };

// type Props = {
//   data?: DataProp;
//   hint?: string;
// };

// type Status = "idle" | "match" | "wrong";
// interface Summary {
//   text: string;
//   color: string;
//   bgColor: string;
//   borderColor: string;
// }

// /* ---------------- Defaults ---------------- */
// const DEFAULT_DATA: DataProp = {
//   given: [
//     { id: "g1", label: "1 kg of apples", price: "1.60" },
//     { id: "g2", label: "1 kg of cheese", price: "12.40" },
//     { id: "g3", label: "500 g of chicken fillet", price: "3.60" },
//   ],
//   problems: [
//     { id: "p1", text: "500 g of apples costs £", answer: "0.80" },
//     { id: "p2", text: "2 kg of apples costs £", answer: "3.20" },
//     { id: "p3", text: "500 g of cheese costs £", answer: "6.20" },
//     { id: "p4", text: "2 kg of cheese costs £", answer: "24.80" },
//     { id: "p5", text: "1 g of chicken costs £", answer: "7.20" },
//   ],
// };

// const DEFAULT_HINT =
//   "Work out the price per gram or kilogram, then multiply to get the cost for the given amount.";

// /* ---------------- Input ---------------- */
// const NumberInput: React.FC<{
//   value: string;
//   onChange: (val: string) => void;
//   ok: boolean | null;
// }> = ({ value, onChange, ok }) => {
//   const border =
//     ok === null
//       ? "border-slate-400"
//       : ok
//       ? "border-green-500 text-green-600"
//       : "border-red-500 text-red-600";

//   return (
//     <input
//       type="text"
//       value={value}
//       onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
//       className={`w-20 text-center border-b-2 border-dotted focus:outline-none ${border}`}
//     />
//   );
// };

// /* ---------------- Main Component ---------------- */
// const ArrType_99: React.FC<Props> = ({ data, hint }) => {
//   const DATA =  DEFAULT_DATA;
//   const help = hint ?? DEFAULT_HINT;
//   const [showHint, setShowHint] = useState(false);
//   const [values, setValues] = useState<string[]>(() =>
//     DATA.problems.map(() => "")
//   );
//   const [ok, setOk] = useState<(boolean | null)[]>(() =>
//     DATA.problems.map(() => null)
//   );
//   const [status, setStatus] = useState<Status>("idle");

//   useEffect(() => {
//     setValues(DATA.problems.map(() => ""));
//     setOk(DATA.problems.map(() => null));
//     setStatus("idle");
//   }, [data]);

//   /* -------- Handlers -------- */
//   const handleCheck = useCallback(() => {
//     const results = DATA.problems.map((p, i) => values[i] === p.answer);
//     setOk(results);
//     setStatus(results.every(Boolean) ? "match" : "wrong");
//   }, [DATA, values]);

//   const handleShowSolution = useCallback(() => {
//     setValues(DATA.problems.map((p) => p.answer));
//     setOk(DATA.problems.map(() => true));
//     setStatus("match");
//   }, [DATA]);

// const handleShowHint = useCallback(() => {
//   setShowHint((prev) => !prev);
// }, []);

//   /* -------- Summary -------- */
//   const summary: Summary | null = useMemo(() => {
//     if (status === "match")
//       return {
//         text: "Correct! Great job.",
//         color: "text-green-700",
//         bgColor: "bg-green-100",
//         borderColor: "border-green-600",
//       };
//     if (status === "wrong")
//       return {
//         text: "Some answers are wrong. Try again.",
//         color: "text-red-700",
//         bgColor: "bg-red-100",
//         borderColor: "border-red-600",
//       };
//     return null;
//   }, [status]);

//   const { setControls } = useQuestionControls();
//   useEffect(() => {
//     setControls({
//       handleCheck,
//       handleShowSolution,
//       handleShowHint,
//       hint: help,
//       showHint,
//       summary,
//     });
//   }, [setControls, handleCheck, handleShowSolution, handleShowHint, help,showHint, summary]);

//   /* -------- Render -------- */
//   return (
//     <div className="space-y-8">
//       <div>
//         <h2 className="text-lg font-semibold">Question 5</h2>
//         <p className="text-sm text-slate-600">How much does it cost?</p>
//       </div>

//       {/* Top given values */}
//       <div className="grid grid-cols-3 justify-center gap-6 ">
//         {DATA.given.map((g) => (
//           <div
//             key={g.id}
//             className="bg-orange-200 text-orange-900 px-4 py-2 rounded font-medium"
//           >
//             {g.label} £{g.price}
//           </div>
//         ))}
//       </div>

//       {/* Problems */}
//       <div className="grid grid-cols-3 justify-center  gap-6">
//         {DATA.problems.map((p, i) => (
//         <div>

//             <div key={p.id} className="flex items-center gap-2 text-lg">
//             <span>{p.text}</span>
//             <NumberInput
//               value={values[i]}
//               onChange={(val) =>
//                 setValues((prev) => {
//                   const cp = [...prev];
//                   cp[i] = val;
//                   return cp;
//                 })
//               }
//               ok={ok[i]}
//             />
//           </div>
//         </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ArrType_99;






import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type DataProp = {
  given: {
    id: string;
    label: string;   // e.g. "1 kg of apples"
    price: string;   // e.g. "1.60"
  }[];
  problems: {
    id: string;
    text: string;    // e.g. "500 g of apples costs £"
    answer: string;  // e.g. "0.80"
  }[];
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
  given: [
    { id: "g1", label: "1 kg of apples", price: "1.60" },
    { id: "g2", label: "1 kg of cheese", price: "12.40" },
    { id: "g3", label: "500 g of chicken fillet", price: "3.60" },
  ],
  problems: [
    { id: "p1", text: "500 g of apples costs £", answer: "0.80" },
    { id: "p2", text: "2 kg of apples costs £", answer: "3.20" },
    { id: "p3", text: "500 g of cheese costs £", answer: "6.20" },
    { id: "p4", text: "2 kg of cheese costs £", answer: "24.80" },
    { id: "p5", text: "1 kg of chicken costs £", answer: "7.20" },
  ],
};

const DEFAULT_HINT =
  "Work out the price per gram or kilogram, then multiply to get the cost for the given amount.";

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
const ArrType_99: React.FC<Props> = ({ data, hint }) => {
  const DATA = DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;

  const [showHint, setShowHint] = useState(false);
  const [values, setValues] = useState<string[]>(() =>
    DATA.problems.map(() => "")
  );
  const [ok, setOk] = useState<(boolean | null)[]>(() =>
    DATA.problems.map(() => null)
  );
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    setValues(DATA.problems.map(() => ""));
    setOk(DATA.problems.map(() => null));
    setStatus("idle");
  }, [data]);

  /* -------- Handlers -------- */
  const handleCheck = useCallback(() => {
    const results = DATA.problems.map((p, i) => values[i] === p.answer);
    setOk(results);
    setStatus(results.every(Boolean) ? "match" : "wrong");
  }, [DATA, values]);

  const handleShowSolution = useCallback(() => {
    setValues(DATA.problems.map((p) => p.answer));
    setOk(DATA.problems.map(() => true));
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
    // keep deps stable to avoid mismatch warnings
  }, [setControls, handleCheck, handleShowSolution, handleShowHint, help, summary, showHint]);

  /* -------- Render -------- */
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Question 5</h2>
        <p className="text-sm text-slate-600">How much does it cost?</p>
      </div>

      {/* Top given values */}
      <div className="grid grid-cols-3 justify-center gap-6">
        {DATA.given.map((g) => (
          <div
            key={g.id}
            className="bg-orange-200 text-orange-900 px-4 py-2 rounded font-medium"
          >
            {g.label} £{g.price}
          </div>
        ))}
      </div>

      {/* Problems */}
      <div className="grid grid-cols-3 justify-center gap-6">
        {DATA.problems.map((p, i) => (
          <div key={p.id} className="flex items-center gap-2 text-lg">
            <span>{p.text}</span>
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

export default ArrType_99;
