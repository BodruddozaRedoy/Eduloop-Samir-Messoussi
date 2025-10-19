import React from "react";
import { Button } from "../ui/button";
import { Lock } from "lucide-react"; // <-- import lock icon

type ControllersProps = {
  handleCheck: () => void;
  handleShowSolution: () => void;
  handleShowHint: () => void;
  id: any;
};

export default function Controllers({
  handleCheck,
  handleShowSolution,
  handleShowHint,
  id,
}: ControllersProps) {
  // Get and parse quiz results
  const quizResultsString = localStorage.getItem("quizResults");
  const quizResults = quizResultsString ? JSON.parse(quizResultsString) : { right: [], wrong: [] };

  // Check if ID exists in right or wrong array
  const isUnlocked =
    quizResults.right.some((q: any) => q.id === id) ||
    quizResults.wrong.some((q: any) => q.id === id);

  return (
    <div className="flex items-center justify-between mt-5">
      <div className="flex items-center gap-3">
        <Button
          onClick={handleCheck}
          className="bg-[#dbeafe] hover:bg-[#dbeafe]/70 text-black border"
        >
          Check
        </Button>

        <Button
          onClick={handleShowHint}
          className="bg-[#ffedd5] hover:bg-[#ffedd5]/70 text-black border"
        >
          Hint
        </Button>

        <Button
          onClick={isUnlocked ? handleShowSolution : undefined}
          disabled={!isUnlocked}
          className={`flex items-center gap-2 bg-[#f3e8ff] text-black border ${
            isUnlocked
              ? "hover:bg-[#f3e8ff]/70"
              : "opacity-50 cursor-not-allowed"
          }`}
        >
          {!isUnlocked && <Lock size={16} />}
          Show Solution
        </Button>
      </div>
    </div>
  );
}
