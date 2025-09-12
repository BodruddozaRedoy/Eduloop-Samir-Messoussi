import React, { useState } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";

const hint =
  "Count the hours forward from the clock time until you reach the given time.";

// ✅ Type 1: User types difference
const dataOne = [
  {
    id: 1,
    clock: { hour: 9, minute: 0 },
    boxTime: { hour: 12, minute: 0 },
    answer: 3,
  },
  {
    id: 2,
    clock: { hour: 5, minute: 0 },
    boxTime: { hour: 2, minute: 0 },
    answer: 9,
  },
];

// ✅ Type 2: User sets time on clock
const dataTwo = [
  {
    id: 1,
    boxTime: { hour: 4, minute: 0 }, // Fixed box time
    difference: 8, // 8 hours later
    correct: { hour: 12, minute: 0 }, // User must set 12 o'clock
  },
  {
    id: 2,
    boxTime: { hour: 4, minute: 0 }, // Fixed box time
    difference: 8, // 8 hours later
    correct: { hour: 12, minute: 0 }, // User must set 12 o'clock
  },
];

export default function ArrTypeThirteen({dataOne, dataTwo}:any) {
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [clockAnswers, setClockAnswers] = useState<{
    [key: number]: { hour: number; minute: number };
  }>({});
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleInputChange = (id: number, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleClockChange = (id: number, hour: number, minute: number) => {
    setClockAnswers((prev) => ({ ...prev, [id]: { hour, minute } }));
  };

  const handleCheck = () => {
    let allCorrect = true;

    // check type 1
    dataOne?.forEach((item) => {
      if (Number(userAnswers[item.id]) !== item.answer) {
        allCorrect = false;
      }
    });

    // check type 2
    dataTwo?.forEach((item) => {
      const ans = clockAnswers[item.id];
      if (
        !ans ||
        ans.hour !== item.correct.hour ||
        ans.minute !== item.correct.minute
      ) {
        allCorrect = false;
      }
    });

    setStatus(allCorrect ? "match" : "wrong");
    setChecked(true);
  };

  const handleShowSolution = () => {
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
  };

  const handleShowHint = () => setShowHint((v) => !v);

  const summary =
    status === "match"
      ? {
          text: "🎉 All Correct! Great job",
          color: "text-green-600",
          bgColor: "bg-green-100",
          borderColor: "border-green-600",
        }
      : status === "wrong"
      ? {
          text: "❌ Some answers are wrong. Check again.",
          color: "text-red-600",
          bgColor: "bg-red-100",
          borderColor: "border-red-600",
        }
      : null;

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
          ${
            highlight === "correct"
              ? "border-green-600 ring-4 ring-green-400"
              : highlight === "wrong"
              ? "border-red-600 ring-4 ring-red-400"
              : "border-green-600"
          }`}
      >
        {!hideHands && (
          <>
            {/* Hour hand */}
            <div
              className="absolute bottom-1/2 left-1/2 w-1 h-10 bg-gray-700 origin-bottom"
              style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
            />
            {/* Minute hand */}
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
            if (
              user &&
              user.hour === item.correct.hour &&
              user.minute === item.correct.minute
            ) {
              highlight = "correct";
            } else {
              highlight = "wrong";
            }
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
      <div>
        <Controllers
          handleCheck={handleCheck}
          handleShowSolution={handleShowSolution}
          handleShowHint={handleShowHint}
        />
        {showHint && <Hint hint={hint} />}
        <Check summary={summary} />
      </div>
    </div>
  );
}
