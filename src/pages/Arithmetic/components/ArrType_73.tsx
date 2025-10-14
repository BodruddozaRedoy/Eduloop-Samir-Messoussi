import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type BlankDef = { accepts: string[]; show: string };
type Token =
  | { type: "text"; text: string }
  | { type: "blank"; accepts: string[]; show?: string };
type Row = { tokens: Token[] };
type DataSet = { left: Row[]; right: Row[] };

type Props = { data?: DataSet; hint?: string };

type Status = "idle" | "match" | "wrong";
interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

/* ---------------- Defaults ---------------- */
const DEFAULT_DATA: DataSet = {
  left: [
    {
      tokens: [
        {
          type: "text",
          text:
            "Which word is missing? Choose from: thousand–million–billion. The woolly mammoth went extinct 4 ",
        },
        { type: "blank", accepts: ["thousand"], show: "thousand" },
        { type: "text", text: " years ago." },
      ],
    },
    {
      tokens: [
        {
          type: "text",
          text:
            "The distance from the North Pole to the South Pole is approximately 12 ",
        },
        { type: "blank", accepts: ["thousand", "thousands"], show: "thousand" },
        { type: "text", text: " km." },
      ],
    },
    {
      tokens: [
        { type: "text", text: "Every year, about 13 " },
        { type: "blank", accepts: ["million", "millions"], show: "million" },
        { type: "text", text: " Dutch people go on holiday." },
      ],
    },
    {
      tokens: [
        {
          type: "text",
          text:
            "The 8 richest people in the world have a combined wealth of over 450 ",
        },
        { type: "blank", accepts: ["billion", "billions"], show: "billion" },
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
        { type: "blank", accepts: ["thousand", "thousands"], show: "thousand" },
        { type: "text", text: " euros." },
      ],
    },
    {
      tokens: [
        { type: "text", text: "Approximately 500 " },
        { type: "blank", accepts: ["thousand", "thousands"], show: "thousand" },
        { type: "text", text: " Dutch people go on holiday to Portugal." },
      ],
    },
    {
      tokens: [
        { type: "text", text: "In the city of Groningen, more than 200 " },
        { type: "blank", accepts: ["thousand", "thousands"], show: "thousand" },
        { type: "text", text: " people live." },
      ],
    },
  ],
};

const DEFAULT_HINT =
  "Match number size with the correct word: thousand (10³), million (10⁶), billion (10⁹).";

/* ---------------- Helpers ---------------- */
const norm = (s: string) => s.trim().toLowerCase();

/* ---------------- Component ---------------- */
const ArrType_73: React.FC<Props> = ({ data: rawData, hint = DEFAULT_HINT }) => {
  /* ---- Coerce incoming data safely (fixes non-iterable shapes) ---- */
  const coerceRows = (v: unknown): Row[] =>
    Array.isArray(v)
      ? v
      : v && typeof v === "object"
      ? (Object.values(v as Record<string, Row>) as Row[])
      : [];

  const data: DataSet = useMemo(() => {
    const left = coerceRows((rawData as any)?.left);
    const right = coerceRows((rawData as any)?.right);
    if (left.length && right.length) return { left, right };
    return DEFAULT_DATA;
  }, [rawData]);

  /* ---- Build blanks list ---- */
  const rowsAll: Row[] = useMemo(
    () => [...data.left, ...data.right],
    [data.left, data.right]
  );

  const blanks: BlankDef[] = useMemo(() => {
    const acc: BlankDef[] = [];
    rowsAll.forEach((row) =>
      row.tokens.forEach((t) => {
        if (t.type === "blank") {
          acc.push({ accepts: t.accepts, show: t.show ?? t.accepts[0] });
        }
      })
    );
    return acc;
  }, [rowsAll]);

  /* ---- State ---- */
  const [values, setValues] = useState<string[]>(() => blanks.map(() => ""));
  const [ok, setOk] = useState<(boolean | null)[]>(() => blanks.map(() => null));
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  /* ---- Reset on data change ---- */
  useEffect(() => {
    setValues(blanks.map(() => ""));
    setOk(blanks.map(() => null));
    setStatus("idle");
    setShowHint(false);
  }, [blanks]);

  /* ---- Hooks: result & meta ---- */
  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  /* ---- Handlers ---- */
  const handleCheck = useCallback(() => {
    const results = values.map((v, i) =>
      blanks[i].accepts.map(norm).includes(norm(v))
    );
    setOk(results);
    const allRight = results.every(Boolean);
    setStatus(allRight ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allRight);
  }, [values, blanks, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    setValues(blanks.map((b) => b.show));
    setOk(blanks.map(() => true));
    setStatus("match");
  }, [blanks]);

  const handleShowHint = useCallback(() => setShowHint((s) => !s), []);

  /* ---- Summary ---- */
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

  /* ---- Register with QuestionControls ---- */
  const { setControls } = useQuestionControls();
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

  /* ---- Render helpers ---- */
  const renderRow = (row: Row, rowKey: string | number) => {
    // running blank index inside this row
    let localBlankStart = 0;
    // compute the global offset of this row's blanks
    const prefixBlankCount = rowsAll
      .slice(0, rowsAll.indexOf(row))
      .reduce(
        (acc, r) =>
          acc +
          r.tokens.reduce((c, t) => (t.type === "blank" ? c + 1 : c), 0),
        0
      );

    return (
      <div className="text-sm leading-7" key={rowKey}>
        {row.tokens.map((t, j) => {
          if (t.type === "text") return <span key={j}>{t.text}</span>;

          const globalIx = prefixBlankCount + localBlankStart;
          localBlankStart += 1;

          const isCorrect = ok[globalIx] && status !== "idle";
          const isWrong = ok[globalIx] === false && status !== "idle";

          const cls =
            "border-b-2 border-dashed focus:outline-none text-center min-w-24 " +
            (isCorrect ? "border-green-500 text-green-700 " : "") +
            (isWrong ? "border-red-500 text-red-600 " : "");

          return (
            <input
              key={j}
              type="text"
              value={values[globalIx] ?? ""}
              onChange={(e) => {
                const cp = [...values];
                cp[globalIx] = e.target.value;
                setValues(cp);
                setOk((prev) => {
                  const arr = [...prev];
                  arr[globalIx] = null;
                  return arr;
                });
                setStatus("idle");
              }}
              className={cls}
            />
          );
        })}
      </div>
    );
  };

  /* ---- Render ---- */
  return (
    <div className="space-y-6">
      <div>
        {/* <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-slate-600 text-sm">
          Which word is missing? Choose from:{" "}
          <span className="font-medium">thousand–million–billion</span>.
        </p> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {data.left.map((row, i) => renderRow(row, `L-${i}`))}
        </div>
        <div className="space-y-4">
          {data.right.map((row, i) => renderRow(row, `R-${i}`))}
        </div>
      </div>

      {showHint && (
        <div className="p-3 border border-amber-300 bg-amber-50 text-amber-800 text-sm rounded">
          {hint}
        </div>
      )}
    </div>
  );
};

export default ArrType_73;
