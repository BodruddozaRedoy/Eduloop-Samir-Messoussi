import React, { useState, useCallback, useEffect, useMemo } from "react";
// Assuming these are correctly configured external components/hooks
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

const quizConfigJSON = {

  numbers: [451, 764, 492, 753, 864, 54, 251, 888, 297, 670],


  ranges: [
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
  ],
};


export default function ArrType_59({ hint }: { hint: string }) {
  

  const { numbers: unsortedNumbers, ranges: problemsJSON } = useMemo(
    () => quizConfigJSON,
    []
  );

  const findCorrectRangeIndex = useCallback(
    (number: number) => {
      return problemsJSON.findIndex(
        (p) => number >= p.min && number <= p.max
      );
    },
    [problemsJSON]
  );
  


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
        answers[selectedNumberIndex] === null &&
        !showSolution 
      ) {
        setAnswers((prev) => {
          const newAnswers = [...prev];
          newAnswers[selectedNumberIndex] = colorBoxIndex;
          return newAnswers;
        });
        setSelectedNumberIndex(null);
        setStatus(null);
      } else if (showSolution) {
  
      }
    },
    [selectedNumberIndex, answers, showSolution]
  );

  const handleNumberClick = useCallback(
    (numberIndex: number) => {
      if (!showSolution) {

        setSelectedNumberIndex(numberIndex);

        if (answers[numberIndex] !== null) {
          setAnswers(prev => {
             const newAnswers = [...prev];
             newAnswers[numberIndex] = null;
             return newAnswers;
          });
          setStatus(null);
        }
      }
    },
    [answers, showSolution]
  );

  const handleCheck = useCallback(() => {
    let allCorrect = true;
    
   
    let finalCorrect = true;
    for(let i = 0; i < unsortedNumbers.length; i++) {
        const selectedRangeIndex = answers[i];
        if (selectedRangeIndex === null) {
            finalCorrect = false; 
            break;
        }
        const correctRangeIndex = findCorrectRangeIndex(unsortedNumbers[i]);
        if (selectedRangeIndex !== correctRangeIndex) {
            finalCorrect = false;
            break;
        }
    }
    
    setStatus(finalCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, finalCorrect);
  }, [answers, addResult, qId, qTitle, findCorrectRangeIndex, unsortedNumbers]);


  const handleShowSolution = useCallback(() => {
    const solutionAnswers = unsortedNumbers.map((number) =>
      findCorrectRangeIndex(number)
    );
    setAnswers(solutionAnswers);
    setShowSolution(true);
    setStatus("match");
  }, [findCorrectRangeIndex, unsortedNumbers]);

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
    const currentRange = selectedRangeIndex !== null ? problemsJSON[selectedRangeIndex] : null;


    if (selectedRangeIndex === null) {
      classes += " bg-white border-gray-300 hover:border-blue-400 text-gray-800";
    }

    if (showSolution) {
      const solutionRange = problemsJSON[correctRangeIndex];
      classes += ` ${solutionRange.color} ${solutionRange.borderColor} ${solutionRange.textColor} border-4`;
  
      if (selectedRangeIndex !== null && selectedRangeIndex !== correctRangeIndex) {
         classes = classes.replace('border-4', 'border-8 border-dashed border-red-600 shadow-xl');
      }
    } else if (status === "match" && currentRange) {

        classes += ` ${currentRange.color} ${currentRange.borderColor} ${currentRange.textColor} border-2`;
    } else if (status === "wrong") {
      if (selectedRangeIndex !== null && isCorrect) {

        classes += ` ${currentRange.color} ${currentRange.borderColor} ${currentRange.textColor} border-2`;
      } else if (selectedRangeIndex !== null && !isCorrect) {

        classes += " bg-red-200 border-red-500 text-red-800 border-2";
      }
    } else if (currentRange) {
      
        classes += ` ${currentRange.color} ${currentRange.borderColor} ${currentRange.textColor} border-2`;
    }


    if (selectedNumberIndex === numberIndex && !showSolution) {
      classes += " ring-4 ring-blue-500 ring-opacity-50 border-blue-500 shadow-lg"; // highlight selected
    }
    

    if (selectedRangeIndex === null) {
        classes += " text-gray-800";
    }


    return classes;
  };

  return (
    <div className="flex flex-col space-y-8 p-6">
      <div className="text-xl font-bold text-gray-800">Question 1: Number Sorting</div>
      <div className="text-gray-600">Click a number below, then click the correct color range box above to sort it.</div>


      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
        {problemsJSON.map((p, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer h-24 font-semibold text-lg border-4 transition-all duration-150
             ${p.color} ${p.textColor} ${p.borderColor}`}
            onClick={() => handleColorBoxClick(idx)}
          >
            {p.range}
          </div>
        ))}
      </div>

      {/* Unsorted Numbers */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-8">
        {unsortedNumbers.map((number, idx) => (
          <div
            key={idx}
            className={getNumberBoxClasses(idx) + ' text-2xl font-semibold'}
            onClick={() => handleNumberClick(idx)}
          >
            {number}
          </div>
        ))}
      </div>
      
      {showHint && (
         <div className="mt-4 p-3 bg-yellow-50 text-yellow-500 rounded-lg border border-yellow-300">
             <span className="font-semibold">Hint:</span> {hint}
         </div>
      )}

    </div>
  );
}