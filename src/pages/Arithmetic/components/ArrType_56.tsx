import React, { useState, useCallback, useEffect, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Data for the temperature chart and questions
const problemsJSON = [
  {
    id: 1,
    question: "What was the highest temperature on Monday?",
    answer: "20",
  },
  {
    id: 2,
    question: "On which day was the temperature highest this week?",
    answer: "Tuesday",
  },
  {
    id: 3,
    question: "On which day was the difference between the highest and lowest temperature greatest?",
    answer: "Wednesday",
  },
];

const chartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Lowest temperature",
      data: [10, 15, 5, 8, 4, 6, 10],
      borderColor: "rgb(255, 159, 64)",
      backgroundColor: "rgba(255, 159, 64, 0.5)",
    },
    {
      label: "Highest temperature",
      data: [20, 30, 35, 25, 15, 18, 22],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "right",
    },
    title: {
      display: true,
      text: "Measured temperature",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Temperature C°",
      },
    },
  },
};

export default function ArrType_56({ hint }: { hint: string }) {
  const [answers, setAnswers] = useState(Array(problemsJSON.length).fill(""));
  const [validation, setValidation] = useState<(boolean | null)[]>(Array(problemsJSON.length).fill(null));
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  const handleInputChange = useCallback((idx: number, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
    setStatus(null);
  }, []);

  const handleCheck = useCallback(() => {
    let allCorrect = true;
    const newValidation = problemsJSON.map((p, i) => {
      const isCorrect = answers[i].trim().toLowerCase() === p.answer.toLowerCase();
      if (!isCorrect) allCorrect = false;
      return isCorrect;
    });
    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    const filledAnswers = problemsJSON.map((p) => p.answer);
    setAnswers(filledAnswers);
    setValidation(Array(problemsJSON.length).fill(true));
    setShowSolution(true);
    setStatus("match");
  }, []);

  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  const summary = useMemo(() => {
    if (!status) return null;
    return status === "match"
      ? { text: "🎉 Correct! Good Job", color: "text-green-600" }
      : { text: "❌ Some answers are wrong", color: "text-red-600" };
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
  }, [setControls, handleCheck, handleShowHint, handleShowSolution, hint, showHint, summary]);

  const getInputClass = (idx: number) => {
    if (showSolution || (status === "match" && validation[idx])) return "text-green-600";
    if (status === "wrong" && validation[idx] === false) return "text-red-600";
    return "text-gray-700";
  };

  const getAnswerValue = (idx: number) => showSolution ? problemsJSON[idx].answer : answers[idx];

  const isInputReadOnly = showSolution;

  return (
    <div className="flex flex-col space-y-8">
      <div className="text-xl font-semibold text-gray-800">Question 1</div>
      <div className="text-gray-600">Look at the diagram. Answer the questions.</div>

      <div className="flex justify-center p-6 bg-white rounded-xl ">
        <div style={{ width: "600px", height: "300px" }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="space-y-4 px-6">
        {problemsJSON.map((p, idx) => (
          <div key={p.id} className="flex  space-x-2">
            <span className="text-md text-gray-700 font-medium whitespace-nowrap">{p.question}</span>
            <input
              type="text"
              className={`flex-1 p-1 text-md text-center border-b border-dotted outline-none font-medium ${getInputClass(idx)}`}
              value={getAnswerValue(idx)}
              onChange={(e) => handleInputChange(idx, e.target.value)}
              readOnly={isInputReadOnly}
            />
          </div>
        ))}
      </div>

    </div>
  );
}