import React, { useState, useEffect } from "react";
import Check from "@/components/common/Check";
import Hint from "@/components/common/Hint";
import Controllers from "@/components/common/Controllers";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { IoMdArrowRoundBack, IoMdArrowRoundForward, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Link } from "react-router";
import { hasAnyResults, onResultsUpdated, type TrackedResults } from "@/hooks/useResultTracker";
import useResultTracker from "@/hooks/useResultTracker";

interface Question {
  id: number;
  type: "mcq" | "fill" | "verb" | "short";
  group?: string;
  subject?: string;
  category?: string;
  level?: string;
  metadata: {
    question: string;
    options?: string[];
    correctAnswer: string[];
    hint?: string;
    description?: string;
  };
}

export default function VocabularyQuestions() {
  const [data, setData] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [id: number]: string | string[] }>({});
  const [status, setStatus] = useState<"match" | "wrong" | "">("");
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(true);
  // Hooks must be called unconditionally on every render
  const { addResult } = useResultTracker();
  const [hasResults, setHasResults] = useState<boolean>(hasAnyResults());

  useEffect(() => {
    const off = onResultsUpdated((_r: TrackedResults) => setHasResults(hasAnyResults()));
    return () => off();
  }, []);

  useEffect(() => {
    const fakeData: Question[] = [
      {
        id: 1,
        type: "mcq",
        group: "1",
        subject: "Reading",
        category: "Environment",
        level: "Easy",
        metadata: {
          description: "Mangrove forests grow along coastlines and protect the land from big waves and storms.",
          question: "Why do communities plant more mangroves?",
          options: [
            "To protect the coast and the environment.",
            "Animals will lose their homes.",
            "More storms will stop.",
            "Communities will be safer."
          ],
          correctAnswer: ["To protect the coast and the environment."],
          hint: "Think about the role mangroves play in protecting both land and animals."
        }
      },
      {
        id: 2,
        type: "fill",
        group: "1",
        subject: "Geography",
        category: "Capital",
        level: "Easy",
        metadata: {
          question: "The capital of Bangladesh is _____.",
          correctAnswer: ["Dhaka"],
          hint: "It starts with 'D'."
        }
      },
      {
        id: 3,
        type: "verb",
        group: "1",
        subject: "Grammar",
        category: "Verb",
        level: "Medium",
        metadata: {
          question: "Right form of verb: She ____ (run) fast every morning.",
          correctAnswer: ["runs"],
          hint: "Think about present simple tense."
        }
      },
      {
        id: 4,
        type: "short",
        group: "1",
        subject: "Programming",
        category: "Languages",
        level: "Medium",
        metadata: {
          question: "Write two programming languages you know:",
          correctAnswer: ["JavaScript", "Python"],
          hint: "Think about web or general purpose languages."
        }
      },
      {
        id: 5,
        type: "mcq",
        group: "2",
        subject: "Science",
        category: "Plants",
        level: "Easy",
        metadata: {
          question: "Which of these is a flowering plant?",
          options: ["Rose", "Fern", "Moss", "Lichen"],
          correctAnswer: ["Rose"],
          hint: "It produces flowers."
        }
      }
    ];
    setData(fakeData);
    setLoading(false);
  }, []);

  if (loading)
    return <div className="text-center text-xl mt-10">Loading questions...</div>;
  if (data.length === 0)
    return <div className="text-center text-xl mt-10">No questions available</div>;

  const currentQuestion = data[currentIndex];
  const selected = answers[currentQuestion.id] || "";

  const selectOption = (value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    setShowSolution(false);
    setStatus("");
  };

  const handleCheck = () => {
    if (!selected) return;

    if (Array.isArray(selected)) {
      const correct = currentQuestion.metadata.correctAnswer.every((ans) =>
        selected.some((s) => s.toLowerCase() === ans.toLowerCase())
      );
      setStatus(correct ? "match" : "wrong");
      addResult({ id: currentQuestion.id, title: currentQuestion.metadata.question }, correct);
    } else {
      const ok =
        currentQuestion.metadata.correctAnswer
          .map((a) => a.toLowerCase())
          .includes((selected as string).toLowerCase())
      setStatus(ok ? "match" : "wrong");
      addResult({ id: currentQuestion.id, title: currentQuestion.metadata.question }, ok);
    }
  };

  const handleShowSolution = () => {
    setShowSolution(true);
    setStatus("");
  };

  const handleShowHint = () => setShowHint(!showHint);

  const goNext = () => {
    if (currentIndex < data.length - 1) setCurrentIndex(currentIndex + 1);
    setShowSolution(false);
    setShowHint(false);
    setStatus("");
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    setShowSolution(false);
    setShowHint(false);
    setStatus("");
  };

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
            Q{currentIndex + 1}. {currentQuestion.metadata.question}
          </p>

          {currentQuestion.type === "mcq" && (
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.metadata.options?.map((opt) => {
                const isSelected = selected === opt;
                const isCorrect = showSolution && currentQuestion.metadata.correctAnswer.includes(opt);
                const isWrong = showSolution && !currentQuestion.metadata.correctAnswer.includes(opt) && isSelected;

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

          {(currentQuestion.type === "fill" || currentQuestion.type === "verb") && (
            <input
              type="text"
              value={selected as string}
              onChange={(e) => selectOption(e.target.value)}
              placeholder="Please write your answer..."
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}

          {currentQuestion.type === "short" && (
            <div className="flex flex-col gap-4">
              {[0, 1].map((i) => (
                <input
                  key={i}
                  type="text"
                  value={Array.isArray(selected) ? selected[i] || "" : ""}
                  onChange={(e) => {
                    const updated = Array.isArray(selected) ? [...selected] : [];
                    updated[i] = e.target.value;
                    selectOption(updated);
                  }}
                  placeholder={`Please write the answer ${i + 1}`}
                  className="w-full border-b-2 border-gray-400 focus:border-blue-500 outline-none px-2 py-2"
                />
              ))}
            </div>
          )}

          <div className="flex gap-4 justify-start mt-4">
            <Controllers handleCheck={handleCheck} handleShowSolution={handleShowSolution} handleShowHint={handleShowHint} />
          </div>

          {summary && <Check summary={summary} />}
          {showHint && <Hint hint={currentQuestion.metadata.hint || ""} />}

          {showSolution && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50 text-gray-800">
              <p className="font-semibold">✅ Correct Answer:</p>
              <ul className="list-disc list-inside">
                {currentQuestion.metadata.correctAnswer.map((ans, idx) => (
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
