"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
  qid: number;
  question: string;
  correctAnswer: string[];
  hint?: string;
  addResult: (data: { id: number; title: string }, correct: boolean) => void;
}

export default function VocabularyFillBlank({ qid, question, correctAnswer, hint, addResult }: Props) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"match" | "wrong" | "">("");
  const [showSolution, setShowSolution] = useState(false);

  const handleCheck = () => {
    if (!value) return;
    const correct = correctAnswer.some(ans => ans.toLowerCase() === value.toLowerCase());
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
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:bg-primary"
        placeholder="Write your answer..."
      />
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
