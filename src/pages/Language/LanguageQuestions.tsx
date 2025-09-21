import React, { useState, useEffect } from "react";
import Check from "@/components/common/Check";
import Hint from "@/components/common/Hint";
import Controllers from "@/components/common/Controllers";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import {
  IoMdArrowRoundBack,
  IoMdArrowRoundForward,
  IoMdCheckmarkCircleOutline,
} from "react-icons/io";
import { Link } from "react-router";
import {
  hasAnyResults,
  onResultsUpdated,
  type TrackedResults,
} from "@/hooks/useResultTracker";
import useResultTracker from "@/hooks/useResultTracker";

interface Question {
  "id": string;
  "type": "mcq" | "fill_blank" | "short";
  "group"?: string;
  "subject"?: string;
  "category"?: string;
  "level"?: string;
  "metadata": {
    "question": string;
    "options"?: string[];
    "correctAnswer": string[];
    "hint"?: string;
    "description"?: string;
  };
}

export default function LanguageQuestions() {
  const [data, setData] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [id: string]: string | string[] }>({});
  const [status, setStatus] = useState<"match" | "wrong" | "">("");
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(true);

  const { addResult } = useResultTracker();
  const [hasResults, setHasResults] = useState<boolean>(hasAnyResults());

  useEffect(() => {
    const off = onResultsUpdated((_r: TrackedResults) =>
      setHasResults(hasAnyResults())
    );
    return () => off();
  }, []);

  useEffect(() => {
    const fakeData: Question[] = [
      {
        "id": 5,
        "group": "group-5",
        "subject": "language",
        "category": "Woordsoorten",
        "subcategory": "werkwoord",
        "level": "medium",
        "type": "mcq",
        "metadata": {
            "question": "Welk woord is het werkwoord in de volgende zin: 'Lisa speelt in de tuin.'?",
            "options": [
                "Lisa",
                "speelt",
                "in",
                "tuin"
            ],
            "correctAnswer": [
                "speelt"
            ],
            "hint": "Een werkwoord is iets wat je doet."
        }
    },
      {
        "id": 6,
        "group": "group-5",
        "subject": "language",
        "category": "Leestekens",
        "subcategory": "punt",
        "level": "easy",
        "type": "fill_blank",
        "metadata": {
            "question": "Vul het juiste leesteken in: Het is vandaag een mooie dag_",
            "correctAnswer": [
                "."
            ],
            "hint": "Aan het eind van een zin gebruik je dit leesteken."
        }
    },
       {
        "id": 9,
        "group": "group-5",
        "subject": "language",
        "category": "Grammaticale kennis",
        "subcategory": "onderwerp",
        "level": "advanced",
        "type": "short",
        "metadata": {
            "question": "Wat is het onderwerp in de volgende zin: 'De kat jaagt op de muis in de tuin'?",
            "correctAnswer": [
                "De kat"
            ],
            "hint": "Het onderwerp is degene die de actie uitvoert in de zin."
        }
    },
      
    ];
    setData(fakeData);
    setLoading(false);
  }, []);

  if (loading) return <div className="text-center text-xl mt-10">Loading questions...</div>;
  if (data.length === 0) return <div className="text-center text-xl mt-10">No questions available</div>;

  const currentQuestion = data[currentIndex];
  const selected = answers[currentQuestion["id"]] || "";

  const selectOption = (value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion["id"]]: value }));
    setShowSolution(false);
    setStatus("");
  };

  const handleCheck = () => {
    if (!selected) return;

    if (Array.isArray(selected)) {
      const correct = currentQuestion["metadata"]["correctAnswer"].every((ans) =>
        selected.some((s) => s.toLowerCase() === ans.toLowerCase())
      );
      setStatus(correct ? "match" : "wrong");
      addResult(
        { id: currentQuestion["id"], title: currentQuestion["metadata"]["question"] },
        correct
      );
    } else {
      const ok = currentQuestion["metadata"]["correctAnswer"]
        .map((a) => a.toLowerCase())
        .includes((selected as string).toLowerCase());
      setStatus(ok ? "match" : "wrong");
      addResult(
        { id: currentQuestion["id"], title: currentQuestion["metadata"]["question"] },
        ok
      );
    }
  };

  const handleShowSolution = () => { setShowSolution(true); setStatus(""); };
  const handleShowHint = () => setShowHint(!showHint);
  const goNext = () => { if (currentIndex < data.length - 1) setCurrentIndex(currentIndex + 1); setShowSolution(false); setShowHint(false); setStatus(""); };
  const goPrev = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); setShowSolution(false); setShowHint(false); setStatus(""); };

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === data.length - 1;

  const summary =
    status === "match"
      ? { text: "✅ Correct!", color: "text-green-600", bgColor: "bg-green-100", borderColor: "border-green-600" }
      : status === "wrong"
      ? { text: "❌ Wrong answer!", color: "text-red-600", bgColor: "bg-red-100", borderColor: "border-red-600" }
      : null;

  return (
    <div className="p-10">
      <Button onClick={goPrev} disabled={isFirst} className="rounded-2xl py-7 pl-2 font-bold text-xl disabled:opacity-60 disabled:cursor-not-allowed">
        <div className="size-10 bg-white text-black rounded-2xl flex items-center justify-center">
          <IoMdArrowRoundBack size={50} className="text-5xl" />
        </div>
        Back
      </Button>

      <div className="w-full flex flex-col gap-6">
        <div className="bg-white mt-10 shadow-lg rounded-2xl p-6 flex flex-col gap-6">
          <p className="text-xl font-semibold text-gray-700">
            Q{currentIndex + 1}. {currentQuestion["metadata"]["question"]}
          </p>

          {currentQuestion["type"] === "mcq" && (
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion["metadata"]["options"]?.map((opt) => {
                const isSelected = selected === opt;
                const isCorrect = showSolution && currentQuestion["metadata"]["correctAnswer"].some(ans => ans.toLowerCase() === opt.toLowerCase());
                const isWrong = showSolution && !currentQuestion["metadata"]["correctAnswer"].some(ans => ans.toLowerCase() === opt.toLowerCase()) && isSelected;
                return (
                  <Button
                    key={opt}
                    onClick={() => selectOption(opt)}
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
          )}

          {currentQuestion["type"] === "fill_blank" && (
            <input
              type="text"
              value={selected as string}
              onChange={(e) => selectOption(e.target.value)}
              placeholder="Write your answer..."
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}

          {currentQuestion["type"] === "short" && (
            <div className="flex flex-col gap-4">
              {currentQuestion["metadata"]["correctAnswer"].map((_, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={Array.isArray(selected) ? selected[idx] || "" : ""}
                  onChange={(e) => {
                    const updated = Array.isArray(selected) ? [...selected] : [];
                    updated[idx] = e.target.value;
                    selectOption(updated);
                  }}
                  placeholder={`Answer ${idx + 1}`}
                  className="w-full border-b-2 border-gray-400 focus:border-blue-500 outline-none px-2 py-2"
                />
              ))}
            </div>
          )}

          <div className="flex gap-4 justify-start mt-4">
            <Controllers handleCheck={handleCheck} handleShowSolution={handleShowSolution} handleShowHint={handleShowHint} />
          </div>

          {summary && <Check summary={summary} />}
          {showHint && <Hint hint={currentQuestion["metadata"]["hint"] || ""} />}

          {showSolution && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50 text-gray-800">
              <p className="font-semibold">✅ Correct Answer:</p>
              <ul className="list-disc list-inside">
                {currentQuestion["metadata"]["correctAnswer"].map((ans, idx) => (
                  <li key={idx}>{ans}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            <div>
              <Button className="mt-5 py-6 bg-[#e8edff] hover:bg-[#e8edff]/70 text-black border">
                <ChevronLeft className="mr-2" /> Switch Category
              </Button>
            </div>
            <div className="space-x-5">
              <Button onClick={goNext} disabled={isLast} className="rounded-2xl py-7 pr-2 font-bold text-xl disabled:opacity-60 disabled:cursor-not-allowed">
                Next
                <div className="size-10 bg-black rounded-2xl flex items-center justify-center ml-2">
                  <IoMdArrowRoundForward size={50} className="text-5xl" />
                </div>
              </Button>
              <Link to={'/result'} onClick={(e) => { if (!hasResults) e.preventDefault(); }}>
                <Button disabled={!hasResults} className='rounded-2xl py-7 pr-2 font-bold text-xl disabled:opacity-60 disabled:cursor-not-allowed'>
                  Result
                  <div className='size-10 bg-white rounded-2xl flex items-center justify-center ml-2'>
                    <IoMdCheckmarkCircleOutline size={60} className='text-green-500' />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
