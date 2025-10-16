import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Card = {
  id?: string;
  prompt?: string;
  options?: string[];
  correct?: number; // index in options
};
type Props = {
  data?: Card[];
  hint?: string;
};

/* ---------------- Defaults ---------------- */
const DEFAULT_DATA: Required<Card>[] = [
  {
    id: "c1",
    prompt: "10 to 8 in the morning",
    options: ["07:50", "19:50"],
    correct: 0,
  },
  {
    id: "c2",
    prompt: "5 past 8 in the evening",
    options: ["11:05", "23:05"],
    correct: 1,
  },
  {
    id: "c3",
    prompt: "10 to 4 at night",
    options: ["04:10", "16:10"],
    correct: 0,
  },
  {
    id: "c4",
    prompt: "5 to 5 in the afternoon",
    options: ["04:55", "16:55"],
    correct: 1,
  },
  {
    id: "c5",
    prompt: "5 past 7 in the evening",
    options: ["07:05", "19:05"],
    correct: 1,
  },
];

const DEFAULT_HINT =
  "Read each description carefully (morning ≈ 00:00–11:59, afternoon ≈ 12:00–17:59, evening/night ≈ 18:00–23:59). Pick the matching digital time.";

const ArrType_78: React.FC<Props> = ({
  data: DEFAULT_DATA,
  hint: DEFAULT_HINT,
}) => {
  return <ArrType data={DEFAULT_DATA} hint={DEFAULT_HINT} />;
};

/* ---------------- Helpers ---------------- */
type Status = "idle" | "match" | "wrong";
interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

/* ---------------- Component ---------------- */
const ArrType: React.FC<Props> = ({ data, hint }) => {
  // Normalize robustly: ensure options is an array, prompt is a string, correct is a valid index
  const CARDS = useMemo<Required<Card>[]>(() => {
    const src = Array.isArray(data) && data.length ? data : DEFAULT_DATA;

    return src.map((c, i) => {
      const options = Array.isArray(c?.options)
        ? c!.options.filter((o) => typeof o === "string")
        : [];
      // default correct to 0 if out of range
      const safeCorrect =
        typeof c?.correct === "number" &&
        c.correct >= 0 &&
        c.correct < options.length
          ? c.correct
          : 0;

      return {
        id: c?.id ?? `c-${i}`,
        prompt: typeof c?.prompt === "string" ? c!.prompt : "",
        options,
        correct: options.length ? safeCorrect : 0,
      };
    });
  }, [data]);

  const help = hint ?? DEFAULT_HINT;

  // State: one selection per card (null means not selected)
  const [picked, setPicked] = useState<(number | null)[]>(() =>
    CARDS.map(() => null)
  );
  // Per-card correctness after check (null until check)
  const [ok, setOk] = useState<(boolean | null)[]>(() => CARDS.map(() => null));
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  // Reset when number of cards changes
  useEffect(() => {
    setPicked(CARDS.map(() => null));
    setOk(CARDS.map(() => null));
    setStatus("idle");
    setShowHint(false);
  }, [CARDS.length]);

  /* -------- Handlers -------- */
  const pick = useCallback(
    (cardIdx: number, optIdx: number) => {
      const optionsLen = CARDS[cardIdx]?.options.length ?? 0;
      if (optIdx < 0 || optIdx >= optionsLen) return; // guard against bad data

      setPicked((prev) => {
        const cp = [...prev];
        cp[cardIdx] = cp[cardIdx] === optIdx ? null : optIdx;
        return cp;
      });

      setOk((prev) => {
        const cp = [...prev];
        cp[cardIdx] = null; // clear verdict for that card on edit
        return cp;
      });

      setStatus("idle");
    },
    [CARDS]
  );

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const handleCheck = useCallback(() => {
    const results = CARDS.map((c, i) => picked[i] === c.correct);
    setOk(results);
    setStatus(results.every(Boolean) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },results.every(Boolean));
  }, [CARDS, picked]);

  const handleShowSolution = useCallback(() => {
    setPicked(CARDS.map((c) => c.correct));
    setOk(CARDS.map(() => true));
    setStatus("match");
  }, [CARDS]);

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

  // Wire to your global toolbar (Controllers/Hint/Check)
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

  /* -------- UI -------- */
  const boxTone = (cardIdx: number, optIdx: number) => {
    const wasChecked = ok[cardIdx] !== null;
    const isPicked = picked[cardIdx] === optIdx;
    const isCorrect = CARDS[cardIdx]?.correct === optIdx;

    if (!wasChecked) return "border-slate-300 text-slate-800";
    if (isPicked && isCorrect) return "border-emerald-500 text-emerald-600";
    if (isPicked && !isCorrect) return "border-rose-500 text-rose-600";
    return "border-slate-300 text-slate-800";
  };

  const tickTone = (cardIdx: number, optIdx: number) => {
    const isPicked = picked[cardIdx] === optIdx;
    const wasChecked = ok[cardIdx] !== null;
    const isCorrect = CARDS[cardIdx]?.correct === optIdx;

    if (!wasChecked)
      return isPicked ? "border-orange-500" : "border-orange-300";
    if (isPicked) return isCorrect ? "border-emerald-600" : "border-rose-600";
    return "border-orange-300";
  };

  return (
    <div className="space-y-6">
      <div>
        {/* <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">What time is it?</p> */}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-5">
        {CARDS.map((card, ci) => (
          <div
            key={card.id}
            className="rounded-md bg-orange-50 p-4 shadow-[0_1px_0_rgba(0,0,0,0.05)]"
          >
            <div className="mb-3 text-[13px] font-semibold text-slate-700">
              {card.prompt}
            </div>

            <div className="space-y-3">
              {(card.options ?? []).map((time, oi) => (
                <div
                  key={`${card.id}-${time}-${oi}`}
                  className="flex flex-col items-center gap-2"
                >
                  {/* Time chip */}
                  <div
                    className={`w-20 rounded-md border px-2 py-1 text-center text-sm tabular-nums ${boxTone(
                      ci,
                      oi
                    )}`}
                  >
                    {time}
                  </div>

                  {/* Radio-like square */}
                  <button
                    type="button"
                    aria-pressed={picked[ci] === oi}
                    onClick={() => pick(ci, oi)}
                    className={`h-5 w-5 rounded-[4px] border-2 transition-colors ${tickTone(
                      ci,
                      oi
                    )} grid place-items-center`}
                  >
                    <span
                      className={`h-3 w-3 rounded-[2px] ${
                        picked[ci] === oi ? "bg-orange-500" : "bg-transparent"
                      }`}
                    />
                  </button>
                </div>
              ))}

              {/* If a card has no options, render a small notice (prevents crashes) */}
              {(!card.options || card.options.length === 0) && (
                <div className="text-xs text-slate-500">
                  No options provided.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrType_78;
