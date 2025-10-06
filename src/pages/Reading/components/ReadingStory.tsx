import { useEffect, useState } from "react";
 
import { Button } from "@/components/ui/button";
 
import {
  IoIosArrowForward,
  IoMdArrowRoundBack,
  IoMdArrowRoundForward,
  IoMdCheckmarkCircleOutline,
} from "react-icons/io";
 
import { ChevronLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router";
 
import {
  hasAnyResults,
  onResultsUpdated,
  type TrackedResults,
} from "@/hooks/useResultTracker";
 
import {
  QuestionControlsProvider,
} from "@/context/QuestionControlsContext";
 
// Four JSON story data
const stories = [
  {
    id: 1,
    type: "readingStoryQuestion",
    group: "groep-5",
    subject: "Reading",
    category: "Environment",
    subcategory: "Task-1",
    level: "Medium",
    metadata: {
      story_name: "Lune en de verdwaalde kat",
      image: "/images/story/story_1.png",
      story: "Luna loopt naar huis vanuit school. Plots hoort ze een zacht miauwtje...",
      data: [
        {
          id: 1,
          qs: "Wie is de hoofdpersoon in het verhaal?",
          options: ["Luna", "Max", "Vos", "Kat"],
          ans: "Luna",
        },
      ],
      hint: "It’s a helping verb that makes the question correct.",
    },
  },
  {
    id: 2,
    type: "readingStoryQuestion",
    group: "groep-5",
    subject: "Reading",
    category: "Environment",
    subcategory: "Task-2",
    level: "Medium",
    metadata: {
      story_name: "Het avontuur van Max",
      image: "/images/story/story_2.png",
      story: "Max wandelt in het bos en ziet een oude eekhoorn...",
      data: [
        {
          id: 1,
          qs: "Wie gaat op avontuur?",
          options: ["Luna", "Max", "Vos"],
          ans: "Max",
        },
      ],
      hint: "The main character is a boy.",
    },
  },
  {
    id: 3,
    type: "readingStoryQuestion",
    group: "groep-5",
    subject: "Reading",
    category: "Environment",
    subcategory: "Task-3",
    level: "Medium",
    metadata: {
      story_name: "De slimme vos",
      image: "/images/story/story_3.png",
      story: "Een slimme vos probeert de kippen te vangen...",
      data: [
        {
          id: 1,
          qs: "Wie probeert de kippen te vangen?",
          options: ["Vos", "Max", "Kat"],
          ans: "Vos",
        },
      ],
      hint: "It's an animal.",
    },
  },
  {
    id: 4,
    type: "readingStoryQuestion",
    group: "groep-5",
    subject: "Reading",
    category: "Environment",
    subcategory: "Task-4",
    level: "Medium",
    metadata: {
      story_name: "Het mysterie van de grot",
      image: "/images/story/story_4.png",
      story: "In een donkere grot ontdekken kinderen een geheimzinnige schat...",
      data: [
        {
          id: 1,
          qs: "Wat ontdekken de kinderen?",
          options: ["Steen", "Boom", "Schat", "Kat"],
          ans: "Schat",
        },
      ],
      hint: "It's something valuable.",
    },
  },
];
 
export default function ReadingStory() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasResults, setHasResults] = useState<boolean>(hasAnyResults());
  const q = stories[currentIndex];
 
  const [searchParams] = useSearchParams();
  const subject = searchParams.get("subjectId");
  const group = searchParams.get("groupId");
 
  useEffect(() => {
    const off = onResultsUpdated((_r: TrackedResults) =>
      setHasResults(hasAnyResults())
    );
    return () => off();
  }, []);
 
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev < stories.length - 1 ? prev + 1 : prev));
 
  const level = q?.level ?? "Easy";
  const pillBase = "py-2 px-5 rounded-lg font-semibold";
  const active = "bg-primary text-white";
  const inactive = "bg-transparent text-black";
 
  return (
    <QuestionControlsProvider>
      <>
        {/* Top bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-5 relative">
          <div className="flex items-center gap-3">
            <Button
              onClick={handlePrev}
              className="rounded-2xl py-7 pl-2 font-bold text-xl"
            >
              <div className="size-10 bg-white text-black rounded-2xl flex items-center justify-center">
                <IoMdArrowRoundBack size={50} className="text-5xl" />
              </div>
              Back
            </Button>
 
            {/* Breadcrumbs */}
            <div className="text-primary flex gap-3 items-center">
              <p>Group {q.group}</p>
              <IoIosArrowForward />
              <p>{q.subject}</p>
              <IoIosArrowForward />
              <p>{q.category}</p>
              <IoIosArrowForward />
              <p>{q.subcategory}</p>
            </div>
          </div>
 
          {/* Difficulty pills */}
          <div className="bg-[#e8edff] p-1 rounded-lg flex items-center">
            <div className={`${pillBase} ${level === "Easy" ? active : inactive}`}>
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
 
 
       
 
        {/* Story Body */}
        <div className="p-5 rounded-[30px] w-full h-[430px] overflow-y-auto border flex flex-col bg-white">
          <h1 className="text-xl font-bold mb-3">{q.metadata.story_name}</h1>
 
          {/* Story Text + Image */}
          <div className="flex flex-col lg:flex-row justify-start items-center gap-8 flex-1">
            <div className="text-lg text-center lg:text-left">
              {q.metadata.story}
            </div>
 
            <div className="w-60 flex">
              <img
                src={q.metadata.image}
                alt="Story"
                className="rounded-lg object-contain"
              />
            </div>
          </div>
 
          {/* Quiz */}
          <div className="mt-5">
            {q.metadata.data.map((item) => (
              <StoryQuiz
                key={item.id}
                question={item}
                hint={q.metadata.hint}
              />
            ))}
          </div>
        </div>
 
        {/* Footer */}
        <div className="flex flex-col lg:flex-row items-center justify-between mt-5">
          <div className="flex items-center gap-5 mt-5">
            <Link
              to={`/group/subject/category?groupId=${group}&subjectId=${subject}`}
            >
              <Button className="py-6 bg-[#e8edff] hover:bg-[#e8edff]/70 text-black border">
                <ChevronLeft className="mr-2" /> Switch Category
              </Button>
            </Link>
 
            <Button
              onClick={handleNext}
              className="rounded-2xl py-7 pr-2 font-bold text-xl"
            >
              Next
              <div className="size-10 bg-black rounded-2xl flex items-center justify-center ml-2">
                <IoMdArrowRoundForward size={50} className="text-5xl" />
              </div>
            </Button>
 
            <Link
              to={`/result?groupId=${group}&subjectId=${subject}`}
              onClick={(e) => {
                if (!hasResults) e.preventDefault();
              }}
            >
              <Button
                disabled={!hasResults}
                className="rounded-2xl py-7 pr-2 font-bold text-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Result
                <div className="size-10 bg-white rounded-2xl flex items-center justify-center ml-2">
                  <IoMdCheckmarkCircleOutline
                    size={60}
                    className="text-green-500"
                  />
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </>
    </QuestionControlsProvider>
  );
}
 
// Quiz component with Check, Hint, Solution functionality
function StoryQuiz({
  question,
  hint,
}: {
  question: any;
  hint: string;
}) {
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState<"right" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
 
  const handleShowSolution = () => {
    setSelected(question.ans);
    setResult("right");
  };
 
  const handleCheck = () => {
    if (!selected) return;
    setResult(selected === question.ans ? "right" : "wrong");
  };
 
  const handleOptionSelect = (opt: string) => {
    setSelected(opt);
    setResult(null);
  };
 
  const btnClassBase =
    "px-4 py-2 rounded-lg font-semibold transition-colors duration-200";
  const btnCheck = "bg-[#e6f0fa] text-black border border-[#d1e5f6]";
  const btnHint = "bg-[#fff3de] text-black border border-[#ffe6c2]";
  const btnSolution = "bg-[#efeafd] text-black border border-[#cec2f6]";
 
  return (
    <div className="mt-4 space-y-2  p-3 rounded-lg">
      <p className="font-semibold">{question.qs}</p>
 
      {/* Options */}
      <div className="flex gap-3 flex-wrap">
        {question.options?.map((opt: string, idx: number) => (
          <Button
            key={idx}
            variant={selected === opt ? "default" : "outline"}
            onClick={() => handleOptionSelect(opt)}
          >
            {opt}
          </Button>
        ))}
      </div>
 
      {/* Result */}
      {result && (
        <p
          className={`font-bold ${
            result === "right" ? "text-green-600" : "text-red-600"
          }`}
        >
          {result === "right" ? "Correct!" : "Wrong!"}
        </p>
      )}
 
      {/* Action Buttons */}
      <div className="flex gap-4 mt-2">
        <button onClick={handleCheck} className={btnClassBase + " " + btnCheck}>
          Check
        </button>
 
        <button
          onClick={() => setShowHint((prev) => !prev)}
          className={btnClassBase + " " + btnHint}
        >
          Hint
        </button>
 
        <button
          onClick={handleShowSolution}
          className={btnClassBase + " " + btnSolution}
        >
          Show Solution
        </button>
      </div>
 
      {/* Hint Section */}
      {showHint && (
        <p className="mt-2 text-yellow-600 font-medium">Hint: {hint}</p>
      )}
    </div>
  );
}