import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types & defaults (unchanged) ---------------- */
type Item = {
  id?: string;
  numerator: number;
  denominator: number;
  label?: string;
};
type Props = { data?: Item[]; hint?: string };

const DEFAULT_ITEMS: Item[] = [
  { id: "1", numerator: 2, denominator: 4, label: "part" },
  { id: "2", numerator: 2, denominator: 3, label: "part" },
  { id: "3", numerator: 1, denominator: 6, label: "part" },
  { id: "4", numerator: 1, denominator: 5, label: "part" },
];
const DEFAULT_HINT =
  "Click the squares from the left to color exactly the number of parts shown by the numerator. For example, 2/3 means color 2 of the 3 equal parts.";

type Status = "idle" | "match" | "wrong";
interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

/* ---------------- Component ---------------- */
const ArrType_81: React.FC<Props> = ({ data: DEFAULT_ITEMS, hint }) => {
  // const ITEMS = useMemo<Item[]>(
  //   () => (Array.isArray(data) && data.length ? data : DEFAULT_ITEMS),
  //   [data]
  // );
  const ITEMS = DEFAULT_ITEMS;

  const help = hint ?? DEFAULT_HINT;

  const [filled, setFilled] = useState<number[]>(() => ITEMS.map(() => 0));
  const [checked, setChecked] = useState(false);
  const [wrongright, setWrongRight] = useState<boolean[]>(() =>
    ITEMS.map(() => false)
  );
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  // reset only when count changes
  useEffect(() => {
    setFilled(ITEMS.map(() => 0));
    setWrongRight(ITEMS.map(() => false));
    setChecked(false);
    setStatus("idle");
    setShowHint(false);
  }, [ITEMS.length]);

  /* ------------ Memoized handlers ------------ */
  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const handleCheck = useCallback(() => {
    setChecked(true);
    const verdicts = filled.map((v, i) => v === ITEMS[i].numerator);
    setWrongRight(verdicts);
    setStatus(verdicts.every(Boolean) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },verdicts.every(Boolean));
  }, [filled, ITEMS]);

  const handleShowHint = useCallback(() => {
    setShowHint((s) => !s);
  }, []);

  const handleShowSolution = useCallback(() => {
    setFilled(ITEMS.map((it) => Math.min(it.numerator, it.denominator)));
    setChecked(true);
    setWrongRight(ITEMS.map(() => true));
    setStatus("match");
  }, [ITEMS]);

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

  // Expose to toolbar (memoize the controls object)
  const controls = useMemo(
    () => ({
      handleCheck,
      handleShowSolution,
      handleShowHint,
      hint: help,
      showHint,
      summary,
    }),
    [handleCheck, handleShowSolution, handleShowHint, help, showHint, summary]
  );
  const { setControls } = useQuestionControls();
  useEffect(() => {
    setControls(controls);
  }, [setControls, controls]);

  return (
    <div className="grid grid-cols-2 gap-10 ">
      {ITEMS.map((it, i) => (
        <div key={i} className="flex flex-col items-center ">
          <ClickStrip
            key={i}
            cells={it.denominator}
            index={i}
            count={filled[i]}
            setFilled={setFilled}
            className={
              checked
                ? wrongright[i]
                  ? "border-green-500"
                  : "border-red-500 border-2"
                : "border-slate-700"
            }
            numerator={it.numerator}
            denominator={it.denominator}
            label={it.label}
          />
          <div className="flex mt-10 items-center gap-3">
            <div className="flex flex-col items-center leading-tight text-slate-900">
              <span className="tabular-nums text-[22px]">{it.numerator}</span>
              <span className="my-[2px] h-[1px] w-10 bg-slate-700" />
              <span className="tabular-nums text-[22px]">{it.denominator}</span>
            </div>
            <span className="text-[22px] text-slate-900">{it.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArrType_81;

/* ---------------- ClickStrip (unchanged) ---------------- */
type ClickStripProps = {
  cells: number;
  index: number;
  count: number;
  setFilled: React.Dispatch<React.SetStateAction<number[]>>;
  cellWidth?: number;
  cellHeight?: number;
  className?: string;
  numerator: number;
  denominator: number;
  label?: string;
};

const ClickStrip: React.FC<ClickStripProps> = ({
  cells,
  index,
  count,
  setFilled,
  cellWidth = 48,
  cellHeight = 20,
  className,
}) => {
  const setCount = (next: number) =>
    setFilled((prev) => {
      const cp = [...prev];
      cp[index] = Math.max(0, Math.min(cells, next));
      return cp;
    });

  const handleClick = (cellIdx: number) => {
    if (cellIdx === count && count < cells) setCount(count + 1);
    else if (cellIdx === count - 1 && count > 0) setCount(count - 1);
  };
  const enabled = (cellIdx: number) =>
    cellIdx === count || cellIdx === count - 1;

  return (
    <div
      className={`inline-flex items-center rounded-sm p-[1px]`}
      role="group"
      aria-label={`strip ${index + 1}`}
    >
      {Array.from({ length: Math.max(1, cells) }).map((_, i) => {
        const active = i < count;
        const canClick = enabled(i);
        return (
          <button
            key={i}
            type="button"
            onClick={() => canClick && handleClick(i)}
            aria-pressed={active}
            aria-disabled={!canClick}
            style={{ width: `${cellWidth}px`, height: `${cellHeight}px` }}
            className={`border ${className} transition-colors
              ${active ? "bg-emerald-600" : "bg-white"}
              ${canClick ? "cursor-pointer" : "cursor-not-allowed opacity-60"}
              focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500`}
          />
        );
      })}
    </div>
  );
};
