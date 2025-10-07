"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import {
  IoMdArrowRoundBack,
  IoMdArrowRoundForward,
  IoMdCheckmarkCircleOutline,
} from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router";
import { hasAnyResults, onResultsUpdated, type TrackedResults } from "@/hooks/useResultTracker";
import useResultTracker from "@/hooks/useResultTracker";
import { AxiosPublic } from "@/config/axios";
import LoadingScreen from "@/components/common/LoadingScreen";
import VocabularyMCQ from "./components/VocabularyMCQ";
import VocabularyFillBlank from "./components/VocabularyFillBlank";
import VocabularyShort from "./components/VocabularyShort";
import { toast } from "sonner";

export default function VocabularyPage() {
  const location = useLocation();
  const initialQuestion = location.state?.question;

  const [question, setQuestion] = useState<any | null>(initialQuestion || null);
  const [loading, setLoading] = useState(false);
  const [serial, setSerial] = useState(1);
  const [hasResults, setHasResults] = useState<boolean>(hasAnyResults());
  const navigate = useNavigate();
  const { addResult } = useResultTracker();

  const subjectId = localStorage.getItem("subjectId");
  const groupId = localStorage.getItem("groupId");
  const sessionId = localStorage.getItem("sessionId");

  // Reload / navigation warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      toast.warning("If you reload this page, your progress will be lost. Redirecting to category page...");
      setTimeout(() => {
        navigate("/category");
      }, 2000);
      e.returnValue = "";
      return "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [navigate]);

  // Listen for results updates
  useEffect(() => {
    const off = onResultsUpdated((_r: TrackedResults) => setHasResults(hasAnyResults()));
    return () => off();
  }, []);

  // Fetch one question from API
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

  const handleNext = async () => {
    setSerial((prev) => prev + 1);
    await fetchQuestion();
  };

  const content = useMemo(() => {
    if (!question) return null;

    switch (question.type) {
      case "mcq":
        return (
          <VocabularyMCQ
            key={serial}
            qid={serial}
            question={question.metadata.question}
            options={question.metadata.options ?? []}
            correctAnswer={question.metadata.correctAnswer}
            hint={question.metadata.hint}
            addResult={addResult}
          />
        );
      case "fill":
        return (
          <VocabularyFillBlank
            key={serial}
            qid={serial}
            question={question.metadata.question}
            correctAnswer={question.metadata.correctAnswer}
            hint={question.metadata.hint}
            addResult={addResult}
          />
        );
      case "short":
      case "short_answer":
        return (
          <VocabularyShort
            key={serial}
            qid={serial}
            question={question.metadata.question}
            correctAnswer={question.metadata.correctAnswer}
            hint={question.metadata.hint}
            addResult={addResult}
          />
        );
      default:
        return null;
    }
  }, [question, serial, addResult]);

  if (loading || !question) return <LoadingScreen />;

  const level = question?.level ?? "Easy";
  const pillBase = "py-2 px-5 rounded-lg font-semibold";
  const active = "bg-primary text-white";
  const inactive = "bg-transparent text-black";

  return (
    <>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <Link to={"/category"}>
          <Button className="rounded-2xl py-7 pl-2 font-bold text-xl">
            <div className="size-10 bg-white text-black rounded-2xl flex items-center justify-center">
              <IoMdArrowRoundBack size={50} className="text-5xl" />
            </div>
            Back
          </Button>
        </Link>

        {/* Breadcrumbs */}
        <div className="text-primary flex gap-3 items-center">
          <p>{question.group}</p>
          <p>→</p>
          <p>{question.subject}</p>
          <p>→</p>
          <p>{question.category}</p>
          <p>→</p>
          <p>{question.subcategory}</p>
        </div>

        {/* Difficulty */}
        <div className="bg-white p-1 rounded-lg flex items-center">
          <div className={`${pillBase} ${level === "easy" ? active : inactive}`}>Easy</div>
          <div className={`${pillBase} ${level.includes("medium") ? active : inactive}`}>Medium</div>
          <div className={`${pillBase} ${level.includes("advance") ? active : inactive}`}>Advance</div>
        </div>
      </div>

      {/* Question Body */}
      <div key={serial} className="p-10 rounded-[30px] w-full h-full border flex flex-col bg-white">
        <div className="mb-4 text-lg font-semibold">
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
              <Button
                disabled={!hasResults}
                className="rounded-2xl py-7 pr-2 font-bold text-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
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
