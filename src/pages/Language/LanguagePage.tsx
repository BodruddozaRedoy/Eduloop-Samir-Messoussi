import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  IoIosArrowForward,
  IoMdArrowRoundBack,
  IoMdArrowRoundForward,
  IoMdCheckmarkCircleOutline,
} from "react-icons/io";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { hasAnyResults, onResultsUpdated, type TrackedResults } from "@/hooks/useResultTracker";
import { AxiosPublic } from "@/config/axios";
import LoadingScreen from "@/components/common/LoadingScreen";
import { toast } from "sonner";
import ReadingShortQuestion from "../Reading/components/ReadingShortQuestion";
import ReadingFillBlanks from "../Reading/components/ReadingFillBlanks";
import ReadingMultipleChoice from "../Reading/components/ReadingMultipleChoice";

export default function LanguagePage() {
  const location = useLocation();
  const initialQuestion = location.state?.question; // 👈 first question from CategoryPage

  const [question, setQuestion] = useState<any | null>(initialQuestion || null);
  const [loading, setLoading] = useState(false);
  const [serial, setSerial] = useState(1); // 👈 track serial number
  const [hasResults, setHasResults] = useState<boolean>(hasAnyResults());

  const subjectId = localStorage.getItem("subjectId");
  const groupId = localStorage.getItem("groupId");
  const navigate = useNavigate();
  const sessionId = localStorage.getItem("sessionId")


  // Fetch one new question from API
  const fetchQuestion = async () => {
    const payload = {
      group_id: groupId,
      subject_id: subjectId,
      category_ids: JSON.parse(localStorage.getItem("categories")!),
      subcategory_ids: JSON.parse(localStorage.getItem("subcategories")!)
    }
    try {
      setLoading(true);
      console.log("api is calling")
      const res = await AxiosPublic.get("/questions/", {
        headers: {
          "X-Session-Id": sessionId
        }
      }); // 👈 replace with your GET endpoint
      console.log("api call end", res)
      setQuestion(res.data);
    } catch (err) {
      console.error("Failed to load question", err);
      toast.error("No question found");
      navigate(`/category`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const off = onResultsUpdated((_r: TrackedResults) =>
      setHasResults(hasAnyResults())
    );
    return () => off();
  }, []);

  const handleNext = async () => {
    setSerial((prev) => prev + 1); // increment serial
    await fetchQuestion(); // fetch new question
  };

  const handlePrev = () => {
    // optional: if you want previous question support → you'd need a cache/stack
    setSerial((prev) => Math.max(prev - 1, 1));
  };

  const content = useMemo(() => {
    if (!question) return null;
    switch (question.type) {
      case "mcq":
        return (
          <ReadingMultipleChoice
            key={serial}
            qid={serial}
            question={question.metadata.question}
            options={question.metadata.options ?? []}
            correctAnswer={question.metadata.correctAnswer}
            description={question.metadata.description}
            hint={question.metadata.hint}
          />
        );
      case "short":
        return (
          <ReadingShortQuestion
            key={serial}
            qid={serial}
            question={question.metadata.question}
            correctAnswer={question.metadata.correctAnswer}
            description={question.metadata.description}
            hint={question.metadata.hint}
          />
        );
      case "fill_blank":
        return (
          <ReadingFillBlanks
            key={serial}
            qid={serial}
            question={question.metadata.question}
            correctAnswer={question.metadata.correctAnswer}
            description={question.metadata.description}
            hint={question.metadata.hint}
          />
        );
      default:
        return null;
    }
  }, [question, serial]);

  if (loading || !question) return <LoadingScreen />;

  const level = question?.level ?? "Easy";
  const pillBase = "py-2 px-5 rounded-lg font-semibold";
  const active = "bg-primary text-white";
  const inactive = "bg-transparent text-black";

  return (
    <>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Link to={"/category"}>
          <Button
            // onClick={handlePrev}
            className="rounded-2xl py-7 pl-2 font-bold text-xl disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="size-10 bg-white text-black rounded-2xl flex items-center justify-center">
              <IoMdArrowRoundBack size={50} className="text-5xl" />
            </div>
            Back
          </Button>
          </Link>

          {/* Breadcrumbs */}
          <div className="text-primary flex gap-3 items-center">
            <p>{question.group}</p>
            <IoIosArrowForward />
            <p>{question.subject}</p>
            <IoIosArrowForward />
            <p>{question.category}</p>
            <IoIosArrowForward />
            <p>{question.subcategory}</p>
          </div>
        </div>

        {/* Difficulty pills */}
        <div className="bg-white p-1 rounded-lg flex items-center">
          <div className={`${pillBase} ${level === "easy" ? active : inactive}`}>Easy</div>
          <div className={`${pillBase} ${level.includes("medium")  ? active : inactive}`}>Medium</div>
          <div className={`${pillBase} ${level.includes("advance") ? active : inactive}`}>Advance</div>
        </div>
      </div>

      {/* Body */}
      <div key={serial} className="p-10 rounded-[30px] w-full h-full border flex flex-col bg-white">
        <div className="mb-4 text-lg font-semibold">
          {/* Show serial instead of backend id */}
          <h1 className="font-bold">Question {serial}</h1>
        </div>

        {content}

        {/* Footer */}
        <div className="flex items-center justify-between mt-6">
          <Link to={"/category"}>
            <Button className="mt-5 py-6 bg-[#e8edff] hover:bg-[#e8edff]/70 text-black border">
              <ChevronLeft className="mr-2" /> Switch Category
            </Button>
          </Link>
          <div className="space-x-5">
            <Button
              onClick={handleNext}
              className="rounded-2xl py-7 pr-2 font-bold text-xl"
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
