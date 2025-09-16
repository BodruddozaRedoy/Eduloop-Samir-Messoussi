"use client";

import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useState } from "react";
import useResultTracker from "@/hooks/useResultTracker";
import type { Summary } from "./ReadingMultipleChoice";
interface ReadingShortQuestionProps {
  question: string;
  correctAnswer: string;
  description: string;
  hint: string;
  qid?: number;
}

const ReadingShortQuestion = ({
  question,
  correctAnswer,
  description,
  hint,
  qid,
}: ReadingShortQuestionProps) => {
  const [inputValue, setInputValue] = useState("");
  // const [result, setResult] = useState<null | boolean>(null);
  const [showHint, setShowHint] = useState(false);

// copying state
  // const [answers, setAnswers] = useState<{ [id: number]: string[] }>({})
    const [status, setStatus] = useState<"match" | "wrong" | "">("")
    // const [showSolution, setShowSolution] = useState(false)
  //   const [wrongAnswers, setWrongAnswers] = useState<{ [id: number]: string[] }>({})
  //   const [correctAnswers, setCorrectAnswers] = useState<{ [id: number]: string[] }>({})




  const { addResult } = useResultTracker();

  const handleCheck = () => {
    if (!inputValue.trim()) return;
    // setResult(
    //   inputValue.trim().toLowerCase() === correctAnswer.toLowerCase()
    // );
    const ok = inputValue.trim().toLowerCase() === correctAnswer.toLowerCase();
    setStatus(ok ? "match" : "wrong")
    if (qid != null) addResult({ id: qid, title: question }, ok)
  };

  const handleShowSolution = () => {
    setInputValue(correctAnswer);
      // setShowSolution(true);
    // setResult(true);
    setStatus("")
  };

    const handleShowHint = () => {
    setShowHint(!showHint);
  };

     const summary : Summary | null =
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
                : null


  return (
    <div className="w-full bg-[#fdeedc] rounded-xl p-6 shadow-md">
      {/* Top description */}
      <div className="bg-[#e9543d] text-white rounded-lg p-4 mb-6">
        <p className="text-sm md:text-base">{description}</p>
      </div>

      {/* Question */}
      <h2 className="text-lg font-semibold mb-4">{question}</h2>

      {/* Input */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your answer here..."
        className="w-full p-3 rounded-lg border border-gray-300 mb-4"
      />

      {/* Buttons */}
      {/* <div className="flex gap-3 mt-4">
        <Button
          onClick={handleCheck}
          className="bg-[#dbeafe] hover:bg-[#dbeafe]/70 text-black border p-2"
        >
          Check
        </Button>
        <Button
          onClick={() => setShowHint(!showHint)}
          className="bg-[#ffedd5] hover:bg-[#ffedd5]/70 text-black border"
        >
          {showHint ? "Hide Hint" : "Hint"}
        </Button>
        <Button
          onClick={handleShowSolution}
          className="bg-[#f3e8ff] hover:bg-[#f3e8ff]/70 text-black border"
        >
          Show Solution
        </Button>
      </div> */}





      {/* ✅ Show Hint */}
      {/* {showHint && (
        <p className="text-blue-600 font-medium mb-2">💡 Hint: {hint}</p>
      )} */}

      {/* Result */}
      {/* {result !== null && (
        <p
          className={`text-base font-medium ${
            result ? "text-green-600" : "text-red-600"
          }`}
        >
          {result ? "✅ Correct!" : "❌ Wrong. Try again or show solution."}
        </p>
      )} */}
      <Controllers
        handleCheck={handleCheck}
        handleShowSolution={handleShowSolution}
        handleShowHint={handleShowHint}
      />
       {showHint && <Hint hint={hint} />}
      <Check summary={summary} />
    </div>
  );
};

export default ReadingShortQuestion;
