
import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Row = {
  id?: string;
  start?: number | string;
  saved?: number | string;
  total?: number | string;
};

  const demo: Row[] = [
  { id: "r1", start: 13, saved: 50, total: 63 },
  { id: "r2", start: 44, saved: 30, total: 74 },
  { id: "r3", start: 53, saved: 20, total: 73 },
];

const hintpass  =
  "Add the number in the left box to the euros saved in the middle. Type the total in the right box (e.g., 13 + 50 = 63).";

const ArrType_71: React.FC<Props> = ({ data, hint }) => {
  console.log("ArrType_71 rendering with data:", data ,hint);
  return <ArrType data={demo} hint={hintpass} />;
};

export default ArrType_71;






type Props = { data?: Row[]; hint?: string };

/* ---------------- Defaults ---------------- */
const DEMO: Row[] = [
  { id: "r1", start: 13, saved: 50, total: 63 },
  { id: "r2", start: 44, saved: 30, total: 74 },
  { id: "r3", start: 53, saved: 20, total: 73 },
];

const DEFAULT_HINT =
  "Add the number in the left box to the euros saved in the middle. Type the total in the right box (e.g., 13 + 50 = 63).";

/* ---------------- Helpers ---------------- */
type Status = "idle" | "match" | "wrong";
interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}
const parseNum = (v: unknown): number | null => {
  const t = String(v ?? "").trim();
  if (!t) return null;
  const n = Number(t.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : null;
};


const ArrType: React.FC<Props> = ({ data, hint = DEFAULT_HINT }) =>{
  // Show what arrives
  useEffect(() => {
    console.log("ArrType_71 props.data →", data);
  }, [data]);

  // Normalize once; use normalized values for display
  const ROWS = useMemo(() => {
    const src = Array.isArray(data) && data.length ? data : DEMO;
    return src.map((r, i) => {
      const startN = parseNum(r.start) ?? 0;
      const savedN = parseNum(r.saved) ?? 0;
      const totalN = parseNum(r.total) ?? startN + savedN;

      return {
        id: r.id ?? `r-${i}`,
        // Use display* fields in the UI to avoid blanks
        displayStart: String(startN),
        displaySaved: String(savedN),
        total: String(totalN),
      };
    });
  }, [data]);

  const [collectionData, setCollectionData] = useState<string[]>(
    () => ROWS.map(() => "")
  );
  const [styleBolean, setStyleBolean] = useState<Array<boolean | null>>(
    () => ROWS.map(() => null)
  );
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  // Reset when the number of rows changes
  useEffect(() => {
    setCollectionData(ROWS.map(() => ""));
    setStyleBolean(ROWS.map(() => null));
    setStatus("idle");
    setShowHint(false);
  }, [ROWS.length]);

  /* ------------ Handlers ------------ */
  const handleCheck = useCallback(() => {
    const verdicts = ROWS.map((r, i) => {
      const given = parseNum(collectionData[i]);
      const want = parseNum(r.total);
      return given !== null && want !== null && Math.abs(given - want) < 0.01;
    });
    setStyleBolean(verdicts);
    setStatus(verdicts.every(Boolean) ? "match" : "wrong");
  }, [ROWS, collectionData]);

  const handleShowSolution = useCallback(() => {
    setCollectionData(ROWS.map((r) => String(r.total)));
    setStyleBolean(ROWS.map(() => true));
    setStatus("match");
  }, [ROWS]);

  const handleShowHint = useCallback(() => setShowHint((s) => !s), []);

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
        text: "Some answers are wrong. Check again.",
        color: "text-red-700",
        bgColor: "bg-red-100",
        borderColor: "border-red-600",
      };
    return null;
  }, [status]);

  // Wire to toolbar
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
  }, [handleCheck, handleShowSolution, handleShowHint, hint, showHint, summary, setControls]);

  /* ---------------- UI (your design kept) ---------------- */
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Question 2</h2>
        <p className="text-sm text-slate-600">How much do I have now?</p>
      </div>

      <div>
        <div className="flex flex-col justify-center items-center">
          {ROWS.map((v, i) => {
            const borderStyle =
              styleBolean[i] == null
                ? undefined
                : styleBolean[i]
                ? { borderColor: "#10B981" } // green
                : { borderColor: "#F43F5E" }; // red

            return (
              <div key={v.id} className="flex items-center gap-4 p-4">
                {/* Left box */}
                <div className="bg-orange-100 w-20 h-14 flex items-center justify-center rounded-lg text-2xl text-slate-800 border border-orange-300">
                  {v.displayStart}
                </div>

                {/* Middle curved text box */}
                <div className="bg-orange-100 h-14 flex items-center justify-center px-6 rounded-tl-[90px] text-center text-2xl border border-orange-300">
                  <span className="text-slate-800">
                    I have saved{" "}
                    <span className="font-semibold">{v.displaySaved}</span> euros.
                  </span>
                </div>

                {/* Right input */}
                <input
                  type="number"
                  value={collectionData[i] ?? ""}
                  onChange={(e) => {
                    setCollectionData((prev) => {
                      const cp = [...prev];
                      cp[i] = e.target.value;
                      return cp;
                    });
                    setStyleBolean((prev) => {
                      const cp = [...prev];
                      cp[i] = null; // clear verdict while editing
                      return cp;
                    });
                  }}
                  className="bg-orange-100 w-20 h-14 flex items-center justify-center rounded-lg text-center text-2xl text-slate-800 border border-orange-300 focus:outline-none"
                  style={borderStyle}
                />
              </div>
            );
          })}
        </div>
      </div>


    </div>
  );
};




/* ---------------- Component ---------------- */

