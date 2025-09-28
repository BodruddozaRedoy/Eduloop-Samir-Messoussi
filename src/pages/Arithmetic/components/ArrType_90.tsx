import React, { useState, useCallback, useEffect, useMemo } from "react";

import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import BarChart from "./BarChart";


const quizConfigJSON = {
  questionTitle: "Look at the bar chart. Answer the questions.",


  chartData: [
    { name: "swimming", value: 4 },
    { name: "judo", value: 7 },
    { name: "ice skating", value: 3 },
    { name: "football", value: 10 },
    { name: "gymnastics", value: 2 },
    { name: "dancing", value: 3 },
  ],


  questions: [
    {
      id: "q1",
      text: "How many children swim?",
      answers: [{ field: "ans0", correct: ["4"] }],
      suffix: "children",
    },
    {
      id: "q2",
      text: "Which sport is done by the fewest children?",
      answers: [{ field: "ans1", correct: ["gymnastics"] }],
    },
    {
      id: "q3",
      text: "How many children are in judo?",
      answers: [{ field: "ans2", correct: ["7"] }],
      suffix: "children",
    },
    
    {
      id: "q4",
      text: "Which 2 sports have the same number of children?",
      answers: [
        { field: "ans3a", correct: ["ice skating", "dancing"] },
        { field: "ans3b", correct: ["ice skating", "dancing"] },
      ],
      separator: "and",
    },
    {
      id: "q5",
      text: "Which sport do 10 children do?",
      answers: [{ field: "ans4", correct: ["football"] }],
    },
  ],
};


const initialAnswers = {
  ans0: "",
  ans1: "",
  ans2: "",
  ans3a: "",
  ans3b: "",
  ans4: "",
};

type AnswersState = {
  [key: string]: string;
};

export default function ArrType_90({ hint }: { hint: string }) {

  const { chartData, questions, questionTitle } = useMemo(
    () => quizConfigJSON,
    []
  );

  const [answers, setAnswers] = useState<AnswersState>(initialAnswers);

  const [validation, setValidation] = useState<{
    [key: string]: boolean | null;
  }>(
    Object.keys(initialAnswers).reduce(
      (acc, key) => ({ ...acc, [key]: null }),
      {} as { [key: string]: boolean | null }
    )
  );
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();


  const normalizeInput = (input: string) =>
    input.toLowerCase().trim().replace(/\s/g, " ");

  const handleInputChange = useCallback((field: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
    setStatus(null);
   
    setValidation((prev) => ({ ...prev, [field]: null }));
  }, []);

  const handleCheck = useCallback(() => {
    let allCorrect = true;
    const newValidation: { [key: string]: boolean | null } = {};

    questions.forEach((q) => {

      if (q.id === "q4") {
        const fieldA = q.answers[0].field; // ans3a
        const fieldB = q.answers[1].field; // ans3b

        const userAnsA = normalizeInput(answers[fieldA] || "");
        const userAnsB = normalizeInput(answers[fieldB] || "");

        const correctOptions = q.answers[0].correct.map(normalizeInput); // ["ice skating", "dancing"]

   
        const isQ4ACorrect = correctOptions.includes(userAnsA);
        const isQ4BCorrect = correctOptions.includes(userAnsB);
        const isDifferent =
          userAnsA !== userAnsB && userAnsA.length > 0 && userAnsB.length > 0;
        const isQ4Correct = isQ4ACorrect && isQ4BCorrect && isDifferent;

        newValidation[fieldA] = isQ4Correct;
        newValidation[fieldB] = isQ4Correct;

        if (!isQ4Correct) {
          allCorrect = false;
        }
      } else {

        q.answers.forEach((ans) => {
          const userAns = normalizeInput(answers[ans.field] || "");
          const isCorrect = ans.correct.map(normalizeInput).includes(userAns);

          newValidation[ans.field] = isCorrect;

          if (!isCorrect) {
            allCorrect = false;
          }
        });
      }
    });

    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle, questions]);

  const handleShowSolution = useCallback(() => {
    const solutionAnswers: { [key: string]: string } = {};

    questions.forEach((q) => {
      if (q.id === "q4") {

        solutionAnswers[q.answers[0].field] = "ice skating";
        solutionAnswers[q.answers[1].field] = "dancing";
      } else {

        q.answers.forEach((ans) => {
          solutionAnswers[ans.field] = ans.correct[0];
        });
      }
    });

    setAnswers(solutionAnswers);
   
    const solutionValidation = Object.keys(initialAnswers).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setValidation(solutionValidation);
    setShowSolution(true);
    setStatus("match");
  }, [questions]);

  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  const summary = useMemo(() => {
    if (!status) return null;
    return status === "match"
      ? {
          text: "🎉 Correct! Good Job",
          color: "text-green-600",
          bgColor: "bg-green-100",
          borderColor: "border-green-600",
        }
      : {
          text: "❌ Some answers are wrong",
          color: "text-red-600",
          bgColor: "bg-red-100",
          borderColor: "border-red-600",
        };
  }, [status]);

  useEffect(() => {
    setControls({
      handleCheck,
      handleShowHint,
      handleShowSolution,
      hint,
      showHint,
      summary,
    });
  }, [
    setControls,
    handleCheck,
    handleShowHint,
    handleShowSolution,
    hint,
    showHint,
    summary,
  ]);

  
  const getValidationStatus = (field: string): boolean | null =>
    validation[field];

  const getInputClass = (isCorrect: boolean | null) => {
    if (showSolution) return "text-green-600 font-bold border-green-400";
    if (isCorrect === true) return "text-green-600 font-bold border-green-400";
    if (isCorrect === false) return "text-red-600 font-bold border-red-400";
    return "text-gray-700 font-medium border-gray-400 focus:border-blue-500";
  };

  const getAnswerValue = (field: string) => answers[field] || "";

  const isInputReadOnly = showSolution;

  return (
    <div className="flex flex-col space-y-8 p-6 bg-white rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      <div className="text-2xl font-extrabold text-gray-900 border-b pb-2">
        Question 1
      </div>
      <div className="text-gray-600 font-medium">{questionTitle}</div>


      <div className="py-4">
        <BarChart data={chartData} />
      </div>

 
      <div className="flex flex-col space-y-4 pt-6">
        {questions.map((q) => {
  
          let displayQuestion;

          switch (q.id) {
            case "q1": 
              displayQuestion = (
                <div className="flex items-center space-x-2">
                  <span>How many children swim?</span>{" "}
                  {renderInput(q.answers[0].field)} <span>children</span>
                </div>
              );
              break;
            case "q2":
              displayQuestion = (
                <div className="flex items-center space-x-2">
                  <span>Which sport is done by the fewest children?</span>{" "}
                  {renderInput(q.answers[0].field)}
                </div>
              );
              break;
            case "q3": 
              displayQuestion = (
                <div className="flex items-center space-x-2">
                  <span>How many children are in judo?</span>{" "}
                  {renderInput(q.answers[0].field)} <span>children</span>
                </div>
              );
              break;
            case "q4": 
              displayQuestion = (
                <div className="flex flex-wrap items-center space-x-2">
                  <span>Which 2 sports have the same number of children?</span>
                  {renderInput(q.answers[0].field)}
                  <span>and</span>
                  {renderInput(q.answers[1].field)}
                </div>
              );
              break;
            case "q5": 
              displayQuestion = (
                <div className="flex items-center space-x-2">
                  <span>Which sport do 10 children do?</span>{" "}
                  {renderInput(q.answers[0].field)}
                </div>
              );
              break;
            default:
              displayQuestion = <div>Error in question display.</div>;
          }

          return (
            <div key={q.id} className="text-lg text-gray-800">
              {displayQuestion}
            </div>
          );
        })}
      </div>

      {showHint && (
        <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-300">
          <span className="font-semibold">Hint:</span> {hint}
        </div>
      )}
    </div>
  );


  function renderInput(field: string, widthClass: string = "w-32") {
    return (
      <input
        type="text"
        className={`${widthClass} p-1 text-center border-b-2 border-dotted outline-none bg-transparent transition ${getInputClass(
          getValidationStatus(field)
        )}`}
        value={getAnswerValue(field)}
        onChange={(e) => handleInputChange(field, e.target.value)}
        readOnly={isInputReadOnly}
        placeholder="..."
      />
    );
  }
}
