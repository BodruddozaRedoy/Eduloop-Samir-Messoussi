"use client";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useState } from "react";
import useResultTracker from "@/hooks/useResultTracker";
interface ReadingQuizProps {
  question: string;
  options: string[];
  correctAnswer: string;
  description: string;
  hint: string; // ✅ added
}

export interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export default function ReadingQuiz(props: any) {
  const { question, options, correctAnswer, description, hint, qid } = props as {
    question: string;
    options: string[];
    correctAnswer: string;
    description: string;
    hint: string;
    qid?: number;
  };
  // const [answers, setAnswers] = useState<{ [id: number]: string[] }>({})
  const [status, setStatus] = useState<"match" | "wrong" | "">("");
  // const [showSolution, setShowSolution] = useState(false)
  // const [wrongAnswers, setWrongAnswers] = useState<{ [id: number]: string[] }>({})
  // const [correctAnswers, setCorrectAnswers] = useState<{ [id: number]: string[] }>({})
  // const [showHint, setShowHint] = useState(false)

  const [selected, setSelected] = useState<string | null>(null);
  const { addResult } = useResultTracker();
  const [result, setResult] = useState<null | boolean>(null);
  const [showHint, setShowHint] = useState(false); // ✅ state for hint

  const handleCheck = () => {
    if (selected) {
      const ok = selected === correctAnswer;
      setResult(ok);
      setStatus(ok ? "match" : "wrong");
      const id = qid ?? Array.from(question).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      addResult({ id, title: question }, ok);
    }
  };

  const handleShowSolution = () => {
    setSelected(correctAnswer);
    setResult(true);
    setStatus("");
  };

  const handleShowHint = () => {
    setShowHint(!showHint);
  };

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
      : null;

  return (
    <div className="w-full bg-[#fdeedc] rounded-xl p-6 shadow-md">
      {/* Top description */}
      <div className="bg-[#e9543d] text-white rounded-lg p-4 mb-6">
        <p className="text-sm md:text-base">{description}</p>
      </div>

      {/* Question */}
      <h2 className="text-lg font-semibold mb-4">{question}</h2>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            className={`w-full text-left p-3 rounded-lg border transition ${
              selected === option && result === null ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
            } ${result !== null && option === correctAnswer ? "border-green-500 bg-green-300" : ""} ${result === false && selected === option && option !== correctAnswer ? "border-red-500 bg-red-50" : ""}
            `}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Buttons */}
      {/* <div className="flex items-center gap-3">
        <Button
          onClick={handleCheck}
          className="bg-[#dbeafe] hover:bg-[#dbeafe]/70 text-black border"
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

      {/* <div className="flex items-center justify-between mt-10">
        <div className="flex items-center gap-3">
          <Button
            onClick={handleCheck}
            className="bg-[#dbeafe] hover:bg-[#dbeafe]/70 text-black border"
          >
            Check
          </Button>
          <Button className="bg-[#ffedd5] hover:bg-[#ffedd5]/70 text-black border">
            Hint
          </Button>
          <Button
            onClick={handleShowSolution}
            className="bg-[#f3e8ff] hover:bg-[#f3e8ff]/70 text-black border"
          >
            Show Solution
          </Button>
        </div>
      </div> */}

      {/* {showHint && (
        <p className="text-blue-600 font-medium mb-2">💡 Hint: {hint}</p>
      )} */}

      {/*
      {result !== null && (
        <p
          className={`text-base font-medium ${
            result ? "text-green-600" : "text-red-600"
          }`}
        >
          {result ? "✅ Correct!" : "❌ Wrong. Try again or show solution."}
        </p>
      )} */}

      {/* one controller at bottom */}
      {/* <Controllers
                handleCheck={handleCheckAll}
                handleShowSolution={handleShowSolutionAll}
                handleShowHint={handleShowHint}
            /> */}
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
