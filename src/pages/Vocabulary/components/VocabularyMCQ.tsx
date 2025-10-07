"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
  qid: number;
  question: string;
  options: string[];
  correctAnswer: string[];
  hint?: string;
  addResult: (data: { id: number; title: string }, correct: boolean) => void;
}

export default function VocabularyMCQ({ qid, question, options, correctAnswer, hint, addResult }: Props) {
  const [selected, setSelected] = useState<string>("");
  const [status, setStatus] = useState<"match" | "wrong" | "">("");
  const [showSolution, setShowSolution] = useState(false);

  const handleSelect = (opt: string) => {
    setSelected(opt);
    setStatus("");
    setShowSolution(false);
  };

  const handleCheck = () => {
    if (!selected) return;
    const correct = correctAnswer.some(ans => ans.toLowerCase() === selected.toLowerCase());
    setStatus(correct ? "match" : "wrong");
    addResult({ id: qid, title: question }, correct);
  };

  const handleShowSolution = () => {
    setShowSolution(true);
    setStatus("");
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-gray-700 font-semibold">{question}</p>

      <div className="grid grid-cols-2 gap-4">
        {options.map(opt => {
          const isCorrect = showSolution && correctAnswer.some(ans => ans.toLowerCase() === opt.toLowerCase());
          const isWrong = showSolution && !correctAnswer.some(ans => ans.toLowerCase() === opt.toLowerCase()) && selected === opt;
          const isSelected = selected === opt;

          return (
            <Button
              key={opt}
              onClick={() => handleSelect(opt)}
              className={`w-full px-4 py-4 rounded-lg border text-gray-700 font-medium
                ${isSelected ? "bg-blue-100 border-blue-400" : "bg-white border-gray-300"}
                ${isCorrect ? "bg-green-100 border-green-500 text-green-700" : ""}
                ${isWrong ? "bg-red-100 border-red-500 text-red-700" : ""}`}
            >
              {opt}
            </Button>
          );
        })}
      </div>

      <div className="flex gap-2 mt-2">
        <Button onClick={handleCheck} className="bg-primary text-white">Check</Button>
        <Button onClick={handleShowSolution} className="bg-gray-200">Show Solution</Button>
      </div>

      {status && (
        <p className={`mt-2 font-semibold ${status === "match" ? "text-green-600" : "text-red-600"}`}>
          {status === "match" ? "✅ Correct!" : "❌ Wrong!"}
        </p>
      )}

      {showSolution && (
        <div className="mt-2 p-2 border rounded bg-gray-50 text-gray-800">
          Correct Answer: {correctAnswer.join(", ")}
        </div>
      )}

      {hint && <p className="mt-2 text-gray-500 italic">Hint: {hint}</p>}
    </div>
  );
}
