import React, { useState, useCallback, useEffect, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// Data for the color-coded number sorting problem
const problemsJSON = [
  {
    range: "401 to 500",
    color: "bg-yellow-400",
    textColor: "text-slate-800",
    borderColor: "border-yellow-500",
    min: 401,
    max: 500,
  },
  {
    range: "801 to 900",
    color: "bg-red-400",
    textColor: "text-slate-800",
    borderColor: "border-red-500",
    min: 801,
    max: 900,
  },
  {
    range: "0 to 100",
    color: "bg-orange-400",
    textColor: "text-slate-800",
    borderColor: "border-orange-500",
    min: 0,
    max: 100,
  },
  {
    range: "601 to 700",
    color: "bg-blue-400",
    textColor: "text-slate-800",
    borderColor: "border-blue-500",
    min: 601,
    max: 700,
  },
  {
    range: "201 to 300",
    color: "bg-teal-400",
    textColor: "text-slate-800",
    borderColor: "border-teal-500",
    min: 201,
    max: 300,
  },
  {
    range: "701 to 800",
    color: "bg-pink-400",
    textColor: "text-slate-800",
    borderColor: "border-pink-500",
    min: 701,
    max: 800,
  },
];

const unsortedNumbers = [451, 764, 492, 753, 864, 54, 251, 888, 297, 670];

const findCorrectRangeIndex = (number: number) => {
  return problemsJSON.findIndex((p) => number >= p.min && number <= p.max);
};

export default function ArrType_59({ hint }: { hint: string }) {
  const [answers, setAnswers] = useState<(number | null)[]>(
    unsortedNumbers.map(() => null)
  );
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedNumberIndex, setSelectedNumberIndex] = useState<number | null>(
    null
  );
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  const handleColorBoxClick = useCallback(
    (colorBoxIndex: number) => {
      if (
        selectedNumberIndex !== null &&
        answers[selectedNumberIndex] === null
      ) {
        setAnswers((prev) => {
          const newAnswers = [...prev];
          newAnswers[selectedNumberIndex] = colorBoxIndex;
          return newAnswers;
        });
        setSelectedNumberIndex(null);
        setStatus(null);
      }
    },
    [selectedNumberIndex, answers]
  );

  const handleNumberClick = useCallback(
    (numberIndex: number) => {
      // Always allow reselection
      setSelectedNumberIndex(numberIndex);
    },
    []
  );

  const handleCheck = useCallback(() => {
    let allCorrect = true;
    answers.forEach((selectedRangeIndex, numberIndex) => {
      const correctRangeIndex = findCorrectRangeIndex(
        unsortedNumbers[numberIndex]
      );
      if (selectedRangeIndex !== correctRangeIndex) {
        allCorrect = false;
      }
    });
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    const solutionAnswers = unsortedNumbers.map((number) =>
      findCorrectRangeIndex(number)
    );
    setAnswers(solutionAnswers);
    setShowSolution(true);
    setStatus("match");
  }, []);

  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  const summary = useMemo(() => {
    if (!status) return null;
    return status === "match"
      ? { text: "🎉 Correct! Good Job", color: "text-green-600" }
      : { text: "❌ Some answers are wrong", color: "text-red-600" };
  }, [status]);

  useEffect(() => {
    setControls({
      handleCheck,
      handleShowHint,
      handleShowSolution,
      hint,
      showHint,
      summary,
    });
  }, [
    setControls,
    handleCheck,
    handleShowHint,
    handleShowSolution,
    hint,
    showHint,
    summary,
  ]);

  const getNumberBoxClasses = (numberIndex: number) => {
    let classes =
      "p-3 border-2 rounded-lg cursor-pointer transition-colors select-none";

    const selectedRangeIndex = answers[numberIndex];
    const correctRangeIndex = findCorrectRangeIndex(unsortedNumbers[numberIndex]);
    const isCorrect = selectedRangeIndex === correctRangeIndex;

    if (showSolution) {
      classes += ` ${
        isCorrect
          ? `${problemsJSON[correctRangeIndex].color} ${problemsJSON[correctRangeIndex].borderColor} ${problemsJSON[correctRangeIndex].textColor}`
          : "bg-red-400 border-red-500 text-white"
      }`;
    } else if (status === "match") {
      if (selectedRangeIndex !== null) {
        classes += ` ${problemsJSON[selectedRangeIndex].color} ${problemsJSON[selectedRangeIndex].borderColor} ${problemsJSON[selectedRangeIndex].textColor}`;
      }
    } else if (status === "wrong") {
      if (selectedRangeIndex === null) {
        classes += " bg-white border-gray-400";
      } else if (isCorrect) {
        classes += ` ${problemsJSON[correctRangeIndex].color} ${problemsJSON[correctRangeIndex].borderColor} ${problemsJSON[correctRangeIndex].textColor}`;
      } else {
        classes +=
          " bg-red-400 border-red-500 text-white hover:bg-red-300"; // wrong but clickable
      }
    } else {
      classes += " bg-white border-gray-300";
    }

    if (selectedNumberIndex === numberIndex) {
      classes += " border-4 border-blue-500"; // highlight selected
    }

    return classes;
  };

  return (
    <div className="flex flex-col space-y-8">
      <div className="text-xl font-semibold text-gray-800">Question 1</div>
      <div className="text-gray-600">Give the boxes the correct colour.</div>

      {/* Color Range Boxes */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {problemsJSON.map((p, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-4 flex items-center justify-center text-center cursor-pointer h-24 ${p.color} ${p.textColor}`}
            onClick={() => handleColorBoxClick(idx)}
          >
            {p.range}
          </div>
        ))}
      </div>

      {/* Unsorted Numbers */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-8 mt-12">
        {unsortedNumbers.map((number, idx) => (
          <div
            key={idx}
            className={getNumberBoxClasses(idx)}
            onClick={() => handleNumberClick(idx)}
          >
            {number}
          </div>
        ))}
      </div>

      <Controllers
        handleCheck={handleCheck}
        handleShowSolution={handleShowSolution}
        handleShowHint={handleShowHint}
      />
      {showHint && <Hint hint={hint} />}
      <Check summary={summary} />
    </div>
  );
}
