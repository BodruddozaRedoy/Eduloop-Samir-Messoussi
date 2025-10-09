"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import {
  IoIosArrowForward,
  IoMdArrowRoundBack,
  IoMdArrowRoundForward,
  IoMdCheckmarkCircleOutline,
} from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router";
import { hasAnyResults, onResultsUpdated, type TrackedResults } from "@/hooks/useResultTracker";
import { AxiosPublic } from "@/config/axios";
import LoadingScreen from "@/components/common/LoadingScreen";
import { toast } from "sonner";
import ReadingShortQuestion from "../Reading/components/ReadingShortQuestion";
import ReadingFillBlanks from "../Reading/components/ReadingFillBlanks";
import ReadingMultipleChoice from "../Reading/components/ReadingMultipleChoice";

export default function LanguagePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialQuestion = location.state?.question;

  const [question, setQuestion] = useState<any | null>(initialQuestion || null);
  const [loading, setLoading] = useState(false);
  const [serial, setSerial] = useState(1);
  const [hasResults, setHasResults] = useState<boolean>(hasAnyResults());
  const [showReloadWarning, setShowReloadWarning] = useState(false);

  const subjectId = localStorage.getItem("subjectId");
  const groupId = localStorage.getItem("groupId");
  const sessionId = localStorage.getItem("sessionId");

  // Listen for results updates
  useEffect(() => {
    const off = onResultsUpdated((_r: TrackedResults) =>
      setHasResults(hasAnyResults())
    );
    return () => off();
  }, []);

  // Fetch question from API
  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const res = await AxiosPublic.get("/questions/", {
        headers: { "X-Session-Id": sessionId },
        params: {
          group_id: groupId,
          subject_id: subjectId,
          category_ids: JSON.parse(localStorage.getItem("categories") || "[]"),
          subcategory_ids: JSON.parse(localStorage.getItem("subcategories") || "[]"),
        },
      });
      setQuestion(res.data);
    } catch (err) {
      console.error("Failed to load question", err);
      toast.error("Failed to load question. Redirecting to category page...");
      navigate("/category");
    } finally {
      setLoading(false);
    }
  };

  // Custom reload warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      setShowReloadWarning(true);
      return (e.returnValue = "");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleCancelReload = () => {
    setShowReloadWarning(false);
    navigate("/category");
  };

  const handleReload = () => {
    setShowReloadWarning(false);
    setQuestion(null); // clear previous question
    fetchQuestion();   // re-fetch current question
  };

  const handleNext = async () => {
    setSerial((prev) => prev + 1);
    await fetchQuestion();
  };

  const handleBackToCategory = async () => {
    localStorage.removeItem("quizResults")
  }

  if (loading || !question) return <LoadingScreen />;

  const level = question?.level ?? "Easy";
  const pillBase = "py-2 px-5 rounded-lg font-semibold";
  const active = "bg-primary text-white";
  const inactive = "bg-transparent text-black";

  return (
    <>
      {showReloadWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-8 rounded-2xl flex flex-col gap-5 max-w-sm w-full">
            <h2 className="text-xl font-bold text-gray-800">Go Back to Category?</h2>
            <p className="text-gray-600">
              Your current progress will be lost. Do you still want to go back?
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowReloadWarning(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-primary text-white"
                onClick={() => {
                  setShowReloadWarning(false);
                  navigate("/category");
                  handleBackToCategory()
                }}
              >
                Go to Category
              </Button>
            </div>
          </div>
        </div>
      )}


      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {/* Back button with confirmation modal */}
          <Button
            onClick={() => setShowReloadWarning(true)}
            className="rounded-2xl py-7 pl-2 font-bold text-xl"
          >
            <div className="size-10 bg-white text-black rounded-2xl flex items-center justify-center">
              <IoMdArrowRoundBack size={50} className="text-5xl" />
            </div>
            Back
          </Button>

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
        <div className="bg-muted p-1 rounded-lg flex items-center">
          <div className={`${pillBase} ${level === "easy" ? active : inactive}`}>Easy</div>
          <div className={`${pillBase} ${level.includes("medium") ? active : inactive}`}>Medium</div>
          <div className={`${pillBase} ${level.includes("advance") ? active : inactive}`}>Advance</div>
        </div>
      </div>

      {/* Body */}
      <div className="p-10 rounded-[30px] w-full h-full border flex flex-col bg-white">
        <div className="mb-4 text-lg font-semibold">
          <h1 className="font-bold">Question {serial}</h1>
        </div>

        {/* Render question component */}
        {question.type === "mcq" && (
          <ReadingMultipleChoice
            key={serial}
            qid={serial}
            question={question.metadata.question}
            options={question.metadata.options ?? []}
            correctAnswer={question.metadata.correctAnswer}
            description={question.metadata.description}
            hint={question.metadata.hint}
          />
        )}
        {question.type === "short" && (
          <ReadingShortQuestion
            key={serial}
            qid={serial}
            question={question.metadata.question}
            correctAnswer={question.metadata.correctAnswer}
            description={question.metadata.description}
            hint={question.metadata.hint}
          />
        )}
        {question.type === "fill_blank" && (
          <ReadingFillBlanks
            key={serial}
            qid={serial}
            question={question.metadata.question}
            correctAnswer={question.metadata.correctAnswer}
            description={question.metadata.description}
            hint={question.metadata.hint}
          />
        )}

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
