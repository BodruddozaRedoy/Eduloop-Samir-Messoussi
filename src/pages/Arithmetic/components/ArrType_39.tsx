import manImage from "@/assets/images/arrtype39man.png";
import rabbitImage from "@/assets/images/arrtype39rabbit.png";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------------------
   Types & DEMO data
--------------------------- */
type Item = {
  id: "left" | "right";
  label: "rabbit" | "man";
  imgSrc: string;
  isCorrect: boolean;
};

export const DEMO_ITEMS: Item[] = [
  { id: "left", label: "rabbit", imgSrc: rabbitImage as unknown as string, isCorrect: false },
  { id: "right", label: "man", imgSrc: manImage as unknown as string, isCorrect: true },
];

const DEFAULT_HINT =
  "Assume the measurement is 1 meter. Which example best matches 1 meter? Only one choice is allowed. Click the square below the correct picture.";

/* ---------------------------
   Defensive normalizer
--------------------------- */
function normalizeItems(input: unknown): Item[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((x) => {
      const raw = x as any;
      const id: "left" | "right" =
        raw?.id === "left" || raw?.id === "right" ? raw.id : "left";
      const label: "rabbit" | "man" =
        raw?.label === "rabbit" || raw?.label === "man" ? raw.label : "rabbit";
      const imgSrc = typeof raw?.imgSrc === "string" ? raw.imgSrc : "";
      const isCorrect = Boolean(raw?.isCorrect);
      return { id, label, imgSrc, isCorrect } as Item;
    })
    // keep only the two positions we render
    .filter((it) => it.id === "left" || it.id === "right");
}

/* ---------------------------
   Component
--------------------------- */
type Props = {
  data?: unknown; // optional override; we normalize
  hint?: string;
};

type Status = "idle" | "match" | "wrong";
interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const ArrType_39: React.FC<Props> = ({ data, hint }) => {
  // normalize + fallback to demo
  const items = useMemo(() => {
    const normalized = normalizeItems(data);
    const hasBoth =
      normalized.some((i) => i.id === "left") &&
      normalized.some((i) => i.id === "right");
    return hasBoth ? normalized : DEMO_ITEMS;
  }, [data]);

  const hintText = hint ?? DEFAULT_HINT;

  const [showHint, setShowHint] = useState(false);
  const [selected, setSelected] = useState<"left" | "right" | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [checked, setChecked] = useState(false);

  // reset when items change
  useEffect(() => {
    setSelected(null);
    setStatus("idle");
    setChecked(false);
  }, [items]);

  const handlePick = useCallback((id: "left" | "right") => {
    setSelected((prev) => (prev === id ? null : id));
  }, []);

  const handleCheck = useCallback(() => {
    const chosen = items.find((d) => d.id === selected);
    setChecked(true);
    setStatus(chosen?.isCorrect ? "match" : "wrong");
  }, [items, selected]);

  const handleShowSolution = useCallback(() => {
    const correct = items.find((d) => d.isCorrect);
    if (correct) {
      setSelected(correct.id);
      setChecked(true);
      setStatus("match");
    }
  }, [items]);

  const handleShowHint = useCallback(() => setShowHint((s) => !s), []);

  const summary: Summary | null = useMemo(() => {
    if (status === "match")
      return {
        text: "🎉 Correct! A man is about 1 meter.",
        color: "text-green-600",
        bgColor: "bg-green-100",
        borderColor: "border-green-600",
      };
    if (status === "wrong")
      return {
        text: selected
          ? "❌ The rabbit is not about 1 meter. Try again."
          : "❌ Please select one option.",
        color: "text-red-600",
        bgColor: "bg-red-100",
        borderColor: "border-red-600",
      };
    return null;
  }, [status, selected]);

  // selection square border state
  const squareState = useCallback(
    (id: "left" | "right") => {
      if (!checked) return "border-orange-500";
      if (!selected) return "border-rose-400";
      if (selected === id) {
        const chosen = items.find((d) => d.id === id);
        return chosen?.isCorrect ? "border-emerald-500" : "border-rose-500";
      }
      return "border-orange-500";
    },
    [checked, selected, items]
  );

  // expose to global Controllers/Hint/Check
  const { setControls } = useQuestionControls();
  const controls = useMemo(
    () => ({
      handleCheck,
      handleShowHint,
      handleShowSolution,
      hint: hintText,
      showHint,
      summary,
    }),
    [handleCheck, handleShowHint, handleShowSolution, hintText, showHint, summary]
  );
  useEffect(() => {
    setControls(controls);
  }, [controls, setControls]);

  return (
    <div className="space-y-6">
      {/* images row */}
      <div className="relative grid grid-cols-2 gap-8 sm:gap-16">
        {items.map((it) => (
          <div key={it.id} className="flex flex-col items-center">
            {/* picture card */}
            <div className="relative flex h-48 w-40 items-center justify-center rounded-md bg-white shadow-sm">
              <img
                src={it.imgSrc}
                alt={it.label}
                className="max-h-40 object-contain"
                draggable={false}
              />
            </div>

            {/* the orange square selector */}
            <button
              type="button"
              aria-pressed={selected === it.id}
              onClick={() => handlePick(it.id)}
              className={`mt-6 grid h-5 w-5 place-items-center rounded-[3px] border-2 ${squareState(
                it.id
              )} transition-colors`}
            >
              <span
                className={`h-3 w-3 rounded-[2px] ${
                  selected === it.id ? "bg-orange-500" : "bg-transparent"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrType_39;
