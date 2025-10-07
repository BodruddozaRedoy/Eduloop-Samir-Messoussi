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

export default function VocabularyShort({ qid, question, correctAnswer, hint, addResult }: Props) {
  const [values, setValues] = useState<string[]>(correctAnswer.map(() => ""));
  const [status, setStatus] = useState<"match" | "wrong" | "">("");
  const [showSolution, setShowSolution] = useState(false);

  const handleChange = (idx: number, val: string) => {
    const updated = [...values];
    updated[idx] = val;
    setValues(updated);
    setStatus("");
    setShowSolution(false);
  };

  const handleCheck = () => {
    const correct = correctAnswer.every((ans, idx) => ans.toLowerCase() === (values[idx] || "").toLowerCase());
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

      {correctAnswer.map((_, idx) => (
        <input
          key={idx}
          type="text"
          value={values[idx]}
          onChange={(e) => handleChange(idx, e.target.value)}
          placeholder={`Answer ${idx + 1}`}
          className="w-full border-b-2 border-gray-400 focus:border-blue-500 outline-none px-2 py-2"
        />
      ))}

      <div className="flex gap-2 mt-2">
        <Button onClick={handleCheck} className="bg-blue-500 text-white">Check</Button>
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
