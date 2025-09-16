import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  IoIosArrowForward,
  IoMdArrowRoundBack,
  IoMdArrowRoundForward,
  IoMdCheckmarkCircleOutline,
} from "react-icons/io";
import ReadingFillBlanks from "./components/ReadingFillBlanks";
import ReadingMultipleChoice from "./components/ReadingMultipleChoice";
import ReadingShortQuestion from "./components/ReadingShortQuestion";
import { Link } from "react-router";
import { hasAnyResults, onResultsUpdated, type TrackedResults } from "@/hooks/useResultTracker";

const QUESTIONS_DATA = [
  {
    id: 1,
    type: "readingMultipleChoice",
    group: "4",
    subject: "Reading",
    category: "Environment",
    level: "Easy",
    metadata: {
      description:
        "Mangrove forests grow along coastlines and protect the land from big waves and storms. They also provide homes for fish, crabs, and many birds. Scientists say mangroves are important because they keep the coast safe and help animals survive. Communities often plant more mangroves to protect the environment.",
      question: "Why do communities plant more mangroves?",
      options: [
        "To protect the coast and the environment.",
        "Animals will lose their homes.",
        "More storms will stop.",
        "Communities will be safer.",
      ],
      correctAnswer: "To protect the coast and the environment.",
      hint: "Think about the role mangroves play in protecting both land and animals.", // ✅ Added hint
    },
  },
  {
    id: 2,
    type: "readingShortQuestion",
    group: "4",
    subject: "Reading",
    category: "Environment",
    level: "Easy",
    metadata: {
      description:
        "Mangrove forests grow along coastlines and protect the land from big waves and storms. They also provide homes for fish, crabs, and many birds. Scientists say mangroves are important because they keep the coast safe and help animals survive. Communities often plant more mangroves to protect the environment.",
      question: "Why do communities plant more mangroves?",
      correctAnswer: "To protect the coast and the environment.",
      hint: "Think about the role mangroves play in protecting both land and animals.", // ✅ Added hint
    },
  },
  {
    id: 3,
    type: "readingFillBlanks", // ✅ New type
    group: "5",
    subject: "Reading",
    category: "Environment",
    level: "Medium",
    metadata: {
      description:
        "Mangrove forests grow along coastlines and protect the land from big waves and storms...",
      question: "Why _____ communities plant more mangroves?",
      correctAnswer: "do",
      hint: "It’s a helping verb that makes the question correct.",
    },
  },
];

export default function ReadingPage() {
  const [question, setQuestion] = useState(0);
  const [hasResults, setHasResults] = useState<boolean>(hasAnyResults());

  const isFirst = question === 0;
  const isLast = question === QUESTIONS_DATA.length - 1;
  const q = QUESTIONS_DATA[question];

  const handlePrev = () => setQuestion((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setQuestion((prev) => Math.min(prev + 1, QUESTIONS_DATA.length - 1));

  useEffect(() => {
    const off = onResultsUpdated((_r: TrackedResults) => setHasResults(hasAnyResults()));
    return () => off();
  }, []);

  // Render by type
  const content = useMemo(() => {
    if (!q) return null;

    switch (q.type) {
      case "readingMultipleChoice": {
        return (
          <ReadingMultipleChoice
            key={q.id}
            qid={q.id}
            question={q.metadata.question}
            options={q.metadata.options ?? []}
            correctAnswer={q.metadata.correctAnswer}
            description={q.metadata.description}
            hint={q.metadata.hint} // ✅ new
          />
        );
      }
      case "readingShortQuestion": {
        return (
          <ReadingShortQuestion
            key={q.id}
            qid={q.id}
            question={q.metadata.question}
            correctAnswer={q.metadata.correctAnswer}
            description={q.metadata.description}
            hint={q.metadata.hint}
          />
        );
      }
      case "readingFillBlanks": {
        return (
          <ReadingFillBlanks
            key={q.id}
            qid={q.id}
            question={q.metadata.question}
            correctAnswer={q.metadata.correctAnswer}
            description={q.metadata.description}
            hint={q.metadata.hint}
          />
        );
      }

      default:
        return null;
    }
  }, [q]);

  // Difficulty pills highlight
  const level = q?.level ?? "Easy";
  const pillBase = "py-2 px-5 rounded-lg font-semibold";
  const active = "bg-primary text-white";
  const inactive = "bg-transparent text-black";

  return (
    <>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Button
            onClick={handlePrev}
            disabled={isFirst}
            className="rounded-2xl py-7 pl-2 font-bold text-xl disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="size-10 bg-white text-black rounded-2xl flex items-center justify-center">
              <IoMdArrowRoundBack size={50} className="text-5xl" />
            </div>
            Back
          </Button>

          {/* Breadcrumbs from data */}
          <div className="text-primary flex gap-3 items-center">
            <p>Group {q.group}</p>
            <IoIosArrowForward />
            <p>{q.subject}</p>
            <IoIosArrowForward />
            <p>{q.category}</p>
          </div>
        </div>

        {/* Difficulty pills */}
        <div className="bg-white p-1 rounded-lg flex items-center">
          <div
            className={`${pillBase} ${level === "Easy" ? active : inactive}`}
          >
            Easy
          </div>
          <div
            className={`${pillBase} ${level === "Medium" ? active : inactive}`}
          >
            Medium
          </div>
          <div
            className={`${pillBase} ${level === "Advance" ? active : inactive}`}
          >
            Advance
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        key={q.id}
        className="p-10 rounded-[30px] w-full h-full border flex flex-col bg-white"
      >
        {/* Question text */}
        <div className="mb-4 text-lg font-semibold">
          <h1 className="font-bold">Question {question + 1}</h1>
        </div>

        {content}

        {/* Footer actions */}
        <div className="flex items-center justify-between mt-6">
          <div>
            <Button className="mt-5 py-6 bg-[#e8edff] hover:bg-[#e8edff]/70 text-black border">
              <ChevronLeft className="mr-2" /> Switch Category
            </Button>
          </div>
          <div className="space-x-5">
            <Button
              onClick={handleNext}
              disabled={isLast}
              className="rounded-2xl py-7 pr-2 font-bold text-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Next
              <div className="size-10 bg-black rounded-2xl flex items-center justify-center ml-2">
                <IoMdArrowRoundForward size={50} className="text-5xl" />
              </div>
            </Button>
            <Link to="/result" onClick={(e) => { if (!hasResults) e.preventDefault(); }}>
              <Button disabled={!hasResults} className="rounded-2xl py-7 pr-2 font-bold text-xl disabled:opacity-60 disabled:cursor-not-allowed">
                Result
                <div className="size-10 bg-white rounded-2xl flex items-center justify-center ml-2">
                  <IoMdCheckmarkCircleOutline size={60} className="text-green-500" />
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
