import React, { useEffect, useState, useCallback, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import useResultTracker from "@/hooks/useResultTracker";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import { useQuestionControls } from "@/context/QuestionControlsContext";

type ClockVal = { hour: number; minute: number };
type TypeOne = { id: number; clock: ClockVal; boxTime: ClockVal; answer: number };
type TypeTwo = {
  id: number;
  boxTime: ClockVal;
  difference: number;
  correct: ClockVal;
};

const hint = "Count the hours forward from the clock time until you reach the given time.";

export default function ArrType_13({
  dataOne,
  dataTwo,
}: {
  dataOne?: TypeOne[];
  dataTwo?: TypeTwo[];
}) {
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [clockAnswers, setClockAnswers] = useState<{
    [key: number]: { hour: number; minute: number };
  }>({});
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleInputChange = useCallback((id: number, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleClockChange = useCallback(
    (id: number, hour: number, minute: number) => {
      setClockAnswers((prev) => ({ ...prev, [id]: { hour, minute } }));
    },
    []
  );

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  const handleCheck = useCallback(() => {
    let allCorrect = true;

    dataOne?.forEach((item) => {
      if (Number(userAnswers[item.id]) !== item.answer) {
        allCorrect = false;
      }
    });

    dataTwo?.forEach((item) => {
      const ans = clockAnswers[item.id];
      if (!ans || ans.hour !== item.correct.hour || ans.minute !== item.correct.minute) {
        allCorrect = false;
      }
    });

    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
    setChecked(true);
  }, [dataOne, dataTwo, userAnswers, clockAnswers, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    const filled: { [key: number]: string } = {};
    dataOne?.forEach((item) => {
      filled[item.id] = String(item.answer);
    });
    setUserAnswers(filled);

    const filledClocks: { [key: number]: { hour: number; minute: number } } = {};
    dataTwo?.forEach((item) => {
      filledClocks[item.id] = item.correct;
    });
    setClockAnswers(filledClocks);

    setStatus("match");
    setChecked(true);
  }, [dataOne, dataTwo]);

  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  const summary = useMemo(() => {
    if (status === "match") {
      return {
        text: "🎉 All Correct! Great job",
        color: "text-green-600",
        bgColor: "bg-green-100",
        borderColor: "border-green-600",
      };
    }
    if (status === "wrong") {
      return {
        text: "❌ Some answers are wrong. Check again.",
        color: "text-red-600",
        bgColor: "bg-red-100",
        borderColor: "border-red-600",
      };
    }
    return null;
  }, [status]);

  const { setControls } = useQuestionControls();

  const controls = useMemo(
    () => ({
      handleCheck,
      handleShowHint,
      handleShowSolution,
      hint,
      showHint,
      summary,
    }),
    [handleCheck, handleShowHint, handleShowSolution, hint, showHint, summary]
  );

  useEffect(() => {
    setControls((prev) => {
      const changed = Object.keys(controls).some(
        (k) => (controls as any)[k] !== (prev as any)[k]
      );
      return changed ? controls : prev;
    });
  }, [controls, setControls]);

  // ⏰ Clock component
  const Clock = ({
    hour,
    minute,
    hideHands,
    highlight,
  }: {
    hour: number;
    minute: number;
    hideHands?: boolean;
    highlight?: "correct" | "wrong";
  }) => {
    const hourDeg = (hour % 12) * 30 + minute * 0.5;
    const minuteDeg = minute * 6;
    return (
      <div
        className={`relative w-32 h-32 border-2 rounded-full flex items-center justify-center bg-slate-50
          ${highlight === "correct"
            ? "border-green-600 ring-4 ring-green-400"
            : highlight === "wrong"
            ? "border-red-600 ring-4 ring-red-400"
            : "border-green-600"
          }`}
      >
        {!hideHands && (
          <>
            <div
              className="absolute bottom-1/2 left-1/2 w-1 h-10 bg-gray-700 origin-bottom"
              style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
            />
            <div
              className="absolute bottom-1/2 left-1/2 w-0.5 h-14 bg-red-500 origin-bottom"
              style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }}
            />
            <div className="absolute w-2 h-2 bg-red-500 rounded-full" />
          </>
        )}
        {hideHands && (
          <div className="absolute text-xs text-gray-500">Set Time</div>
        )}
        {[...Array(12)].map((_, i) => {
          const angle = (i + 1) * 30;
          const x = 50 + 40 * Math.sin((angle * Math.PI) / 180);
          const y = 50 - 40 * Math.cos((angle * Math.PI) / 180);
          return (
            <div
              key={i}
              className="absolute text-[10px] font-bold"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-center gap-10 p-6">
        {/* Type 1: difference input */}
        {dataOne?.map((item) => (
          <div key={item.id} className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-5">
              <Clock
                hour={item.clock.hour}
                minute={item.clock.minute}
                highlight={
                  checked
                    ? Number(userAnswers[item.id]) === item.answer
                      ? "correct"
                      : "wrong"
                    : undefined
                }
              />
              <div className="border border-green-600 px-4 py-2 rounded text-sm font-semibold">
                {item.boxTime.hour} o’clock
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={userAnswers[item.id] || ""}
                onChange={(e) => handleInputChange(item.id, e.target.value)}
                className={`border px-3 py-1 rounded text-center w-20 ${
                  checked
                    ? Number(userAnswers[item.id]) === item.answer
                      ? "border-green-600 text-green-600 font-bold"
                      : "border-red-600 text-red-600 font-bold"
                    : ""
                }`}
              />
              <span className="text-gray-600">hours later</span>
            </div>
          </div>
        ))}

        {/* Type 2: user sets time */}
        {dataTwo?.map((item) => {
          const user = clockAnswers[item.id];
          let highlight: "correct" | "wrong" | undefined;
          if (checked) {
            highlight =
              user &&
              user.hour === item.correct.hour &&
              user.minute === item.correct.minute
                ? "correct"
                : "wrong";
          }

          return (
            <div key={item.id} className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-5">
                <Clock
                  hour={user?.hour ?? 0}
                  minute={user?.minute ?? 0}
                  hideHands={!user}
                  highlight={highlight}
                />
                <div className="border border-green-600 px-4 py-2 rounded text-sm font-semibold">
                  {item.boxTime.hour} o’clock
                </div>
              </div>
              <div className="text-gray-600">{item.difference} hours later</div>

              {/* Inputs to set the time */}
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={user?.hour || ""}
                  onChange={(e) =>
                    handleClockChange(item.id, Number(e.target.value), 0)
                  }
                  className={`border px-3 py-1 rounded text-center w-20 ${
                    checked
                      ? user &&
                        user.hour === item.correct.hour &&
                        user.minute === item.correct.minute
                        ? "border-green-600 text-green-600 font-bold"
                        : "border-red-600 text-red-600 font-bold"
                      : ""
                  }`}
                  placeholder="Hour"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Controllers */}
      {/* <div>
        <Controllers
          handleCheck={handleCheck}
          handleShowSolution={handleShowSolution}
          handleShowHint={handleShowHint}
        />
        {showHint && <Hint hint={hint} />}
        <Check summary={summary} />
      </div> */}
    </div>
  );
}
