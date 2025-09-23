import React, { useState, useCallback, useEffect, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// Data for the time calculation problems
const problemsJSON = [
  {
    id: 1,
    departureDate: "12-09-2024",
    departureTime: "05:45",
    arrivalDate: "12-09-2024",
    arrivalTime: "12:25",
    travelTime: {
      hours: "6",
      minutes: "40",
    },
    inputField: "travelTime",
  },
  {
    id: 2,
    departureDate: "12-09-2024",
    departureTime: "21:55",
    arrivalDate: "13-09-2024",
    arrivalTime: "02:15",
    travelTime: {
      hours: "4",
      minutes: "20",
    },
    inputField: "departureTime",
  },
  {
    id: 3,
    departureDate: "12-09-2024",
    departureTime: "21:45",
    arrivalDate: "13-09-2024",
    arrivalTime: "17:10",
    travelTime: {
      hours: "19",
      minutes: "25",
    },
    inputField: "arrivalTime",
  },
];

export default function ArrType_58({ hint }: { hint: string }) {
  const [answers, setAnswers] = useState(
    problemsJSON.map(() => ({
      departureTime: "",
      arrivalTime: "",
      travelHours: "",
      travelMinutes: "",
    }))
  );
  const [validation, setValidation] = useState<(boolean | null)[]>(
    Array(problemsJSON.length).fill(null)
  );
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  const handleInputChange = useCallback(
    (problemIdx: number, field: string, value: string) => {
      setAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[problemIdx] = { ...newAnswers[problemIdx], [field]: value };
        return newAnswers;
      });
      setStatus(null);
    },
    []
  );

  const handleCheck = useCallback(() => {
    let allCorrect = true;
    const newValidation = problemsJSON.map((p, problemIdx) => {
      const userAnswer = answers[problemIdx];
      let isCorrect = false;

      switch (p.inputField) {
        case "travelTime":
          isCorrect =
            userAnswer.travelHours === p.travelTime.hours &&
            userAnswer.travelMinutes === p.travelTime.minutes;
          break;
        case "departureTime":
          isCorrect = userAnswer.departureTime === p.departureTime;
          break;
        case "arrivalTime":
          isCorrect = userAnswer.arrivalTime === p.arrivalTime;
          break;
        default:
          break;
      }
      
      if (!isCorrect) {
        allCorrect = false;
      }
      return isCorrect;
    });

    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    const filledAnswers = problemsJSON.map((p) => {
      const newAnswer = {
        departureTime: p.departureTime || "",
        arrivalTime: p.arrivalTime || "",
        travelHours: p.travelTime?.hours || "",
        travelMinutes: p.travelTime?.minutes || "",
      };
      return newAnswer;
    });
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

  const getInputClass = (problemIdx: number, isCorrect: boolean | null) => {
    const inputClasses = "w-full text-sm text-center bg-transparent border-b border-dotted outline-none font-semibold";
    const statusClasses =
      isCorrect === true ? "text-green-600" :
      isCorrect === false ? "text-red-600" :
      "text-gray-700";
    return `${inputClasses} ${statusClasses}`;
  };

  const getAnswerValue = (problemIdx: number, field: string) => {
    const p = problemsJSON[problemIdx];
    if (showSolution) {
      if (field === 'departureTime') return p.departureTime;
      if (field === 'arrivalTime') return p.arrivalTime;
      if (field === 'travelHours') return p.travelTime.hours;
      if (field === 'travelMinutes') return p.travelTime.minutes;
    }
    return answers[problemIdx][field];
  };

  const isInputReadOnly = showSolution;

  return (
    <div className="flex flex-col space-y-8 mb-10">
      <div className="text-xl font-semibold text-gray-800">Question 1</div>
      <div className="text-gray-600">Fill in the times.</div>

      <div className="w-full max-w-2xl mx-auto">
        <div className="grid grid-cols-3 border-2 border-orange-300 rounded-lg overflow-hidden">
          {/* Header row */}
          <div className="p-2 bg-orange-100 text-sm font-semibold text-center border-r border-orange-300">Departure</div>
          <div className="p-2 bg-orange-100 text-sm font-semibold text-center border-r border-orange-300">Arrival</div>
          <div className="p-2 bg-orange-100 text-sm font-semibold text-center">Travel Time</div>

          {/* Problem rows */}
          {problemsJSON.map((p, problemIdx) => {
            const isCorrect = validation[problemIdx];
            const isDepartureInput = p.inputField === 'departureTime';
            const isArrivalInput = p.inputField === 'arrivalTime';
            const isTravelInput = p.inputField === 'travelTime';

            return (
              <React.Fragment key={p.id}>
                {/* Departure */}
                <div className="p-2 bg-white text-center border-r border-orange-300 border-t border-orange-300">
                  <div className="text-sm font-medium mb-1">{p.departureDate}</div>
                  {isDepartureInput ? (
                    <input
                      type="text"
                      className={`w-full text-sm text-center bg-transparent border-b border-dotted outline-none font-semibold ${getInputClass(problemIdx, isCorrect)}`}
                      value={getAnswerValue(problemIdx, "departureTime")}
                      onChange={(e) => handleInputChange(problemIdx, "departureTime", e.target.value)}
                      readOnly={isInputReadOnly}
                    />
                  ) : (
                    <span className="font-medium text-sm">{p.departureTime}</span>
                  )}
                </div>

                {/* Arrival */}
                <div className="p-2 bg-white text-center border-r border-orange-300 border-t border-orange-300">
                  <div className="text-sm font-medium mb-1">{p.arrivalDate}</div>
                  {isArrivalInput ? (
                    <input
                      type="text"
                      className={`w-full text-sm text-center bg-transparent border-b border-dotted outline-none font-semibold ${getInputClass(problemIdx, isCorrect)}`}
                      value={getAnswerValue(problemIdx, "arrivalTime")}
                      onChange={(e) => handleInputChange(problemIdx, "arrivalTime", e.target.value)}
                      readOnly={isInputReadOnly}
                    />
                  ) : (
                    <span className="font-medium text-sm">{p.arrivalTime}</span>
                  )}
                </div>

                {/* Travel Time */}
                <div className="p-2 bg-white text-center border-t border-orange-300">
                  {isTravelInput ? (
                    <div className="flex items-center space-x-1 justify-center">
                      <input
                        type="text"
                        className={`w-12 text-sm text-center bg-transparent border-b border-dotted outline-none font-semibold ${getInputClass(problemIdx, isCorrect)}`}
                        value={getAnswerValue(problemIdx, "travelHours")}
                        onChange={(e) => handleInputChange(problemIdx, "travelHours", e.target.value)}
                        readOnly={isInputReadOnly}
                      />
                      <span className="text-sm">hours and</span>
                      <input
                        type="text"
                        className={`w-12 text-sm text-center bg-transparent border-b border-dotted outline-none font-semibold ${getInputClass(problemIdx, isCorrect)}`}
                        value={getAnswerValue(problemIdx, "travelMinutes")}
                        onChange={(e) => handleInputChange(problemIdx, "travelMinutes", e.target.value)}
                        readOnly={isInputReadOnly}
                      />
                      <span className="text-sm">minutes</span>
                    </div>
                  ) : (
                    <span className="font-medium text-sm">{`${p.travelTime.hours} hours and ${p.travelTime.minutes} minutes`}</span>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

   
    </div>
  );
}