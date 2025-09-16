"use client";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useState } from "react";
import useResultTracker from "@/hooks/useResultTracker";
import type { Summary } from "./ReadingMultipleChoice";

interface FillBlanksProps {
  question: string;
  correctAnswer: string;
  description: string;
  hint: string;
  qid?: number;
}

export default function ReadingFillBlanks({
  question,
  correctAnswer,
  description,
  hint,
  qid,
}: FillBlanksProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  // const [showSolution, setShowSolution] = useState(false);

  // const [answers, setAnswers] = useState<{ [id: number]: string[] }>({})
    const [status, setStatus] = useState<"match" | "wrong" | "">("")
  //   const [showSolution, setShowSolution] = useState(false)
  //   const [wrongAnswers, setWrongAnswers] = useState<{ [id: number]: string[] }>({})
  //   const [correctAnswers, setCorrectAnswers] = useState<{ [id: number]: string[] }>({})
  //   const [showHint, setShowHint] = useState(false)



  const { addResult } = useResultTracker();

  const handleCheck = () => {
    if (userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
      setStatus("match")
      if (qid != null) addResult({ id: qid, title: question }, true)
    } else {
      setStatus("wrong")
      if (qid != null) addResult({ id: qid, title: question }, false)
    }
  };

  const handleShowSolution = () => {
    setUserAnswer(correctAnswer);
    setStatus("")
  }
  const handleShowHint = () => {
    setShowHint(!showHint);
  }
   const summary: Summary | null =
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
      {/* Passage */}
      <p className="bg-[#e9543d] text-white rounded-lg p-4 mb-6">
        {description}
      </p>

      {/* Question */}
      <h2 className="text-lg font-semibold mb-4">{question}</h2>

      {/* Input field */}
      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        className="border p-2 rounded w-1/2 mb-4"
        placeholder="Type your answer..."
      />

      {/* Feedback */}
      {/* {feedback && <p className="mb-2 font-medium">{feedback}</p>}
      {showHint && <p className="text-blue-600 mb-2">💡 Hint: {hint}</p>}
      {showSolution && (
        <p className="text-green-600 mb-2">
          ✅ Correct Answer: <b>{correctAnswer}</b>
        </p>
      )} */}

      {/* Buttons */}
      {/* <div className="flex gap-3 mt-4">
        <Button
          onClick={handleCheck}
          className="bg-[#dbeafe] hover:bg-[#dbeafe]/70 text-black border"
        >
          Check
        </Button>
        <Button
          onClick={() => setShowHint(true)}
          className="bg-[#ffedd5] hover:bg-[#ffedd5]/70 text-black border"
        >
          Hint
        </Button>
        <Button
          onClick={() => setShowSolution(true)}
          className="bg-[#f3e8ff] hover:bg-[#f3e8ff]/70 text-black border"
        >
          Show Solution
        </Button>
      </div> */}

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
