// import { useQuestionControls } from "@/context/QuestionControlsContext";
// import React, { useEffect, useMemo, useState } from "react";

// /* ------------------------- Types ------------------------- */
// type BlankDef = { accepts: string[]; show: string };

// type Token =
//   | { type: "text"; text: string }
//   | { type: "blank"; accepts: string[]; show?: string };

// type Row = { tokens: Token[] };

// type IndexedToken =
//   | { kind: "text"; text: string }
//   | { kind: "blank"; ix: number }; // global blank index within values[]

// /* --------------------- Static content -------------------- */
// const LEFT: Row[] = [
//   {
//     tokens: [
//       { type: "text", text: "Which word is missing? Choose from: thousand–million–billion. The woolly mammoth went extinct " },
//       { type: "blank", accepts: ["thousand"], show: "thousand" },
//       { type: "text", text: " years ago." },
//     ],
//   },
//   {
//     tokens: [
//       { type: "text", text: "The distance from the North Pole to the South Pole is approximately 12 " },
//       { type: "blank", accepts: ["thousand"], show: "thousand" },
//       { type: "text", text: " km." },
//     ],
//   },
//   {
//     tokens: [
//       { type: "text", text: "Every year, about 13 " },
//       { type: "blank", accepts: ["million"], show: "million" },
//       { type: "text", text: " Dutch people go on holiday." },
//     ],
//   },
//   {
//     tokens: [
//       { type: "text", text: "The 8 richest people in the world have a combined wealth of over 450 " },
//       { type: "blank", accepts: ["billion"], show: "billion" },
//       { type: "text", text: " dollars." },
//     ],
//   },
// ];

// const RIGHT: Row[] = [
//   {
//     tokens: [
//       { type: "text", text: "A Boeing 737 aircraft costs hundreds of " },
//       { type: "blank", accepts: ["million", "millions"], show: "millions" },
//       { type: "text", text: " of euros." },
//     ],
//   },
//   {
//     tokens: [
//       { type: "text", text: "A Porsche can cost 150 " },
//       { type: "blank", accepts: ["thousand"], show: "thousand" },
//       { type: "text", text: " euros." },
//     ],
//   },
//   {
//     tokens: [
//       { type: "text", text: "Approximately 500 " },
//       { type: "blank", accepts: ["thousand"], show: "thousand" },
//       { type: "text", text: " Dutch people go on holiday to Portugal." },
//     ],
//   },
//   {
//     tokens: [
//       { type: "text", text: "In the city of Groningen, more than 200 " },
//       { type: "blank", accepts: ["thousand"], show: "thousand" },
//       { type: "text", text: " people live." },
//     ],
//   },
// ];

// const HINT_TEXT =
//   "Use: thousand = 1,000; million = 1,000,000; billion = 1,000,000,000. Think about the scale—distances often use thousands, big purchases can be in millions, and huge fortunes can be in billions.";

// /* -------------------- Build indexed rows ------------------- */
// function buildIndexed(
//   rows: Row[],
//   startIx: number
// ): { indexed: IndexedToken[][]; nextIx: number; blanks: BlankDef[] } {
//   const indexed: IndexedToken[][] = [];
//   const blanks: BlankDef[] = [];
//   let ix = startIx;

//   for (const row of rows) {
//     const line: IndexedToken[] = [];
//     for (const t of row.tokens) {
//       if (t.type === "text") {
//         line.push({ kind: "text", text: t.text });
//       } else {
//         blanks.push({
//           accepts: t.accepts.map((s) => s.toLowerCase()),
//           show: (t.show ?? t.accepts[0]).toLowerCase(),
//         });
//         line.push({ kind: "blank", ix });
//         ix += 1;
//       }
//     }
//     indexed.push(line);
//   }
//   return { indexed, nextIx: ix, blanks };
// }

// /* ====================== Component ====================== */
// const ArrType_73: React.FC = () => {
//   // Index all blanks once (left then right), so each blank has a unique index
//   const { leftIndexed, rightIndexed, blanks } = useMemo(() => {
//     const left = buildIndexed(LEFT, 0);
//     const right = buildIndexed(RIGHT, left.nextIx);
//     return {
//       leftIndexed: left.indexed,
//       rightIndexed: right.indexed,
//       blanks: [...left.blanks, ...right.blanks],
//     };
//   }, []);

//   // User inputs for each blank (initially empty)
//   const [values, setValues] = useState<string[]>(() => blanks.map(() => ""));
//   // Validation state: null => never checked; boolean per blank after Check
//   const [ok, setOk] = useState<boolean[] | null>(null);
//   const [showHint, setShowHint] = useState(false);

//   const setValueAt = (i: number, v: string) => {
//     setValues((prev) => {
//       const cp = [...prev];
//       cp[i] = v;
//       return cp;
//     });
//     if (ok) {
//       setOk((prev) => {
//         if (!prev) return prev;
//         const cp = [...prev];
//         cp[i] = false;
//         return cp;
//       });
//     }
//   };

//   const checkAll = () => {
//     const verdicts = values.map((v, i) =>
//       blanks[i].accepts.includes(v.trim().toLowerCase())
//     );
//     setOk(verdicts);
//   };

//   const showSolution = () => {
//     setValues(blanks.map((b) => b.show));
//     setOk(blanks.map(() => true));
//   };

//   /* -------- wire to your global toolbar -------- */
//   const { setControls } = useQuestionControls();
//   useEffect(() => {
//     setControls({
//       handleCheck: checkAll,
//       handleShowSolution: showSolution,
//       handleShowHint: () => setShowHint((s) => !s),
//       hint: HINT_TEXT,
//       showHint,
//       summary:
//         ok && ok.every(Boolean)
//           ? {
//               text: "Correct! Great job.",
//               color: "text-green-700",
//               bgColor: "bg-green-100",
//               borderColor: "border-green-600",
//             }
//           : ok && ok.some((b) => !b)
//           ? {
//               text: "Some answers are wrong. Check again.",
//               color: "text-red-700",
//               bgColor: "bg-red-100",
//               borderColor: "border-red-600",
//             }
//           : null,
//     });
//   }, [ok, showHint, setControls]);

//   const inputTone = (i: number) => {
//     if (!ok) return "border-slate-300 text-slate-800";
//     return ok[i] ? "border-emerald-500 text-emerald-600" : "border-rose-500 text-rose-600";
//   };

//   const renderLine = (line: IndexedToken[]) => (
//     <p className="text-sm leading-6 text-slate-800">
//       {line.map((tok, k) =>
//         tok.kind === "text" ? (
//           <span key={k}>{tok.text}</span>
//         ) : (
//           <input
//             key={k}
//             type="text"
//             value={values[tok.ix]}
//             onChange={(e) => setValueAt(tok.ix, e.target.value)}
//             className={`mx-1 inline-block min-w-[90px] rounded bg-transparent px-2 pb-0.5 outline-none border-b border-dotted ${inputTone(
//               tok.ix
//             )}`}
//           />
//         )
//       )}
//     </p>
//   );

//   return (
//     <div className="space-y-5">
//       <div>
//         <h2 className="text-lg font-semibold">Question 1</h2>
//         <p className="text-xs text-slate-600">
//           Which word is missing? Choose from: thousand–million–billion.
//         </p>
//       </div>

//       {showHint && (
//         <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
//           {HINT_TEXT}
//         </div>
//       )}

//       <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
//         <div className="space-y-5">
//           {leftIndexed.map((line, i) => (
//             <div key={`L-${i}`}>{renderLine(line)}</div>
//           ))}
//         </div>
//         <div className="space-y-5">
//           {rightIndexed.map((line, i) => (
//             <div key={`R-${i}`}>{renderLine(line)}</div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ArrType_73;






import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useEffect, useMemo, useState } from "react";

/* ------------------------- Types ------------------------- */
type BlankDef = { accepts: string[]; show: string };

type Token =
  | { type: "text"; text: string }
  | { type: "blank"; accepts: string[]; show?: string };

type Row = { tokens: Token[] };

type IndexedToken =
  | { kind: "text"; text: string }
  | { kind: "blank"; ix: number }; // global blank index within values[]

type DataSet = {
  left: Row[];
  right: Row[];
};

type Props = {
  data?: DataSet;
  hint?: string;
};

/* --------------------- Default Data -------------------- */
const DEFAULT_DATA: DataSet = {
  left: [
    {
      tokens: [
        {
          type: "text",
          text: "Which word is missing? Choose from: thousand–million–billion. The woolly mammoth went extinct ",
        },
        { type: "blank", accepts: ["thousand"], show: "thousand" },
        { type: "text", text: " years ago." },
      ],
    },
    {
      tokens: [
        { type: "text", text: "The distance from the North Pole to the South Pole is approximately 12 " },
        { type: "blank", accepts: ["thousand"], show: "thousand" },
        { type: "text", text: " km." },
      ],
    },
    {
      tokens: [
        { type: "text", text: "Every year, about 13 " },
        { type: "blank", accepts: ["million"], show: "million" },
        { type: "text", text: " Dutch people go on holiday." },
      ],
    },
    {
      tokens: [
        { type: "text", text: "The 8 richest people in the world have a combined wealth of over 450 " },
        { type: "blank", accepts: ["billion"], show: "billion" },
        { type: "text", text: " dollars." },
      ],
    },
  ],
  right: [
    {
      tokens: [
        { type: "text", text: "A Boeing 737 aircraft costs hundreds of " },
        { type: "blank", accepts: ["million", "millions"], show: "millions" },
        { type: "text", text: " of euros." },
      ],
    },
    {
      tokens: [
        { type: "text", text: "A Porsche can cost 150 " },
        { type: "blank", accepts: ["thousand"], show: "thousand" },
        { type: "text", text: " euros." },
      ],
    },
    {
      tokens: [
        { type: "text", text: "Approximately 500 " },
        { type: "blank", accepts: ["thousand"], show: "thousand" },
        { type: "text", text: " Dutch people go on holiday to Portugal." },
      ],
    },
    {
      tokens: [
        { type: "text", text: "In the city of Groningen, more than 200 " },
        { type: "blank", accepts: ["thousand"], show: "thousand" },
        { type: "text", text: " people live." },
      ],
    },
  ],
};

const DEFAULT_HINT =
  "Use: thousand = 1,000; million = 1,000,000; billion = 1,000,000,000. Think about the scale—distances often use thousands, big purchases can be in millions, and huge fortunes can be in billions.";

/* -------------------- Build indexed rows ------------------- */
function buildIndexed(
  rows: Row[],
  startIx: number
): { indexed: IndexedToken[][]; nextIx: number; blanks: BlankDef[] } {
  const indexed: IndexedToken[][] = [];
  const blanks: BlankDef[] = [];
  let ix = startIx;

  for (const row of rows || []) {
    const line: IndexedToken[] = [];
    for (const t of row.tokens) {
      if (t.type === "text") {
        line.push({ kind: "text", text: t.text });
      } else {
        blanks.push({
          accepts: t.accepts.map((s) => s.toLowerCase()),
          show: (t.show ?? t.accepts[0]).toLowerCase(),
        });
        line.push({ kind: "blank", ix });
        ix += 1;
      }
    }
    indexed.push(line);
  }
  return { indexed, nextIx: ix, blanks };
}

/* ====================== Component ====================== */
const ArrType_73: React.FC<Props> = ({ data, hint }) => {
  // Fallback if props missing or malformed
  const safeData: DataSet = {
    left: Array.isArray(data?.left) ? data!.left : DEFAULT_DATA.left,
    right: Array.isArray(data?.right) ? data!.right : DEFAULT_DATA.right,
  };
  const help = hint ?? DEFAULT_HINT;

  const { leftIndexed, rightIndexed, blanks } = useMemo(() => {
    const left = buildIndexed(safeData.left, 0);
    const right = buildIndexed(safeData.right, left.nextIx);
    return {
      leftIndexed: left.indexed,
      rightIndexed: right.indexed,
      blanks: [...left.blanks, ...right.blanks],
    };
  }, [safeData]);

  const [values, setValues] = useState<string[]>(() => blanks.map(() => ""));
  const [ok, setOk] = useState<boolean[] | null>(null);
  const [showHint, setShowHint] = useState(false);

  const setValueAt = (i: number, v: string) => {
    setValues((prev) => {
      const cp = [...prev];
      cp[i] = v;
      return cp;
    });
    if (ok) {
      setOk((prev) => {
        if (!prev) return prev;
        const cp = [...prev];
        cp[i] = false;
        return cp;
      });
    }
  };

  const checkAll = () => {
    const verdicts = values.map((v, i) =>
      blanks[i].accepts.includes(v.trim().toLowerCase())
    );
    setOk(verdicts);
  };

  const showSolution = () => {
    setValues(blanks.map((b) => b.show));
    setOk(blanks.map(() => true));
  };

  /* -------- wire to your global toolbar -------- */
  const { setControls } = useQuestionControls();
  useEffect(() => {
    setControls({
      handleCheck: checkAll,
      handleShowSolution: showSolution,
      handleShowHint: () => setShowHint((s) => !s),
      hint: help,
      showHint,
      summary:
        ok && ok.every(Boolean)
          ? {
              text: "Correct! Great job.",
              color: "text-green-700",
              bgColor: "bg-green-100",
              borderColor: "border-green-600",
            }
          : ok && ok.some((b) => !b)
          ? {
              text: "Some answers are wrong. Check again.",
              color: "text-red-700",
              bgColor: "bg-red-100",
              borderColor: "border-red-600",
            }
          : null,
    });
  }, [ok, showHint, setControls, help]);

  const inputTone = (i: number) => {
    if (!ok) return "border-slate-300 text-slate-800";
    return ok[i] ? "border-emerald-500 text-emerald-600" : "border-rose-500 text-rose-600";
  };

  const renderLine = (line: IndexedToken[]) => (
    <p className="text-sm leading-6 text-slate-800">
      {line.map((tok, k) =>
        tok.kind === "text" ? (
          <span key={k}>{tok.text}</span>
        ) : (
          <input
            key={k}
            type="text"
            value={values[tok.ix]}
            onChange={(e) => setValueAt(tok.ix, e.target.value)}
            className={`mx-1 inline-block min-w-[90px] rounded bg-transparent px-2 pb-0.5 outline-none border-b border-dotted ${inputTone(
              tok.ix
            )}`}
          />
        )
      )}
    </p>
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-xs text-slate-600">
          Which word is missing? Choose from: thousand–million–billion.
        </p>
      </div>


      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-5">
          {leftIndexed.map((line, i) => (
            <div key={`L-${i}`}>{renderLine(line)}</div>
          ))}
        </div>
        <div className="space-y-5">
          {rightIndexed.map((line, i) => (
            <div key={`R-${i}`}>{renderLine(line)}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArrType_73;
