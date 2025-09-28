import React, { useState, useCallback, useEffect, useMemo } from "react";

// Assuming these context/hook imports are provided by the environment
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// --- TYPES AND INTERFACES ---

interface BarChartData {
  name: string;
  value: number;
}

interface BarChartProps {
  data: BarChartData[];
  width?: number;
  height?: number;
}

type AnswersState = {
  [key: string]: string;
};


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





const BarChart = ({ data, width = 600, height = 300 }: BarChartProps) => {
  const chartHeight = height - 50;
  const chartWidth = width - 50;
  const maxVal = 12;
  const numBars = data.length;
  const barWidth = chartWidth / (numBars * 1.5);
  const barGap = chartWidth / (numBars * 3);

  return (
    <div className="flex justify-center items-start w-full overflow-x-auto min-w-full">
      <svg
        viewBox={`0 0 ${width} ${height + 20}`}
        className="w-full max-w-2xl h-auto bg-white border border-gray-300 rounded-lg shadow-inner p-2"
      >
        <g className="text-gray-500 text-xs font-medium">
          {Array.from({ length: maxVal / 2 + 1 }, (_, i) => i * 2).map((y) => {
            const yPos = chartHeight - (y / maxVal) * chartHeight + 20;
            return (
              <g key={y} transform={`translate(50, 0)`}>
                <line
                  x1="0"
                  y1={yPos}
                  x2={chartWidth}
                  y2={yPos}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text x="-15" y={yPos + 4} textAnchor="end">
                  {y}
                </text>
              </g>
            );
          })}
          <text
            x="15"
            y={height / 2}
            transform={`rotate(-90, 15, ${height / 2})`}
            textAnchor="middle"
            className="text-sm font-semibold text-gray-700"
          >
            number of children
          </text>
        </g>

        <g transform={`translate(50, 20)`}>
          {data.map((d, index) => {
            const barX = index * (barWidth + barGap) + barGap / 2;
            const barHeight = (d.value / maxVal) * chartHeight;
            const barY = chartHeight - barHeight;

            return (
              <g key={d.name} transform={`translate(${barX}, 0)`}>
                <rect
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill="#E0F2FE"
                  stroke="#3B82F6"
                  strokeWidth="1"
                  rx="4"
                  className="transition-all duration-300 hover:fill-blue-300"
                />

                <text
                  x={barWidth / 2}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  className="text-xs font-semibold"
                >
                  {d.name}
                </text>
              </g>
            );
          })}
        </g>
        <text
          x={chartWidth + 50}
          y={height + 15}
          textAnchor="end"
          className="text-xs text-gray-500"
        >
          sport
        </text>
        <text
          x={chartWidth / 2 + 50}
          y={15}
          textAnchor="middle"
          className="text-base font-bold text-red-600"
        >
          Which sports does group 5 do?
        </text>
      </svg>
    </div>
  );
};



const initialAnswers = {
  ans0: "",
  ans1: "",
  ans2: "",
  ans3a: "",
  ans3b: "",
  ans4: "",
};


// --- MAIN QUIZ COMPONENT ---

export default function BarChartQuiz({ hint }: { hint: string }) {

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
        const fieldA = q.answers[0].field;
        const fieldB = q.answers[1].field;

        const userAnsA = normalizeInput(answers[fieldA] || "");
        const userAnsB = normalizeInput(answers[fieldB] || "");

        const correctOptions = q.answers[0].correct.map(normalizeInput);

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
}
