import React, { useState, useCallback, useEffect, useMemo } from "react";
// Assuming these are correctly configured external components/hooks
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";


const quizConfigJSON = {
  questionTitle: "Count on and back.",
  baseCenterNumber: 6490,

  problemSets: [
    { id: "minus1_plus1", count: 4, minus: -1, plus: 1 },
    { id: "minus10_plus10", count: 4, minus: -10, plus: 10 },
    { id: "minus100_plus100", count: 4, minus: -100, plus: 100 },
  
  ],
};


export default function ArrType_63({ hint }: { hint: string }) {

  const { problemSets, baseCenterNumber, questionTitle } = useMemo(
    () => quizConfigJSON,
    []
  );

  const problemsJSON = useMemo(() => {
    let finalProblems = [];
    problemSets.forEach((set) => {

      for (let i = 0; i < set.count; i++) {
        finalProblems.push({
          id: set.id,
          center: baseCenterNumber,
          minus: set.minus,
          plus: set.plus,
        });
      }
    });
    return finalProblems;
  }, [problemSets, baseCenterNumber]); 


  const [answers, setAnswers] = useState(
    problemsJSON.map(() => ({ minus: "", plus: "" }))
  );

  const [validation, setValidation] = useState<(boolean | null)[]>(
    Array(problemsJSON.length * 2).fill(null)
  );
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  const handleInputChange = useCallback(
    (problemIdx: number, field: "minus" | "plus", value: string) => {
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
    const newValidation: (boolean | null)[] = []; // Explicitly type
    
   
    problemsJSON.forEach((p, problemIdx) => {

      const minusAnswer = p.center + p.minus;
      const plusAnswer = p.center + p.plus;

 
      const isMinusCorrect = parseInt(answers[problemIdx].minus) === minusAnswer;
      const isPlusCorrect = parseInt(answers[problemIdx].plus) === plusAnswer;

      newValidation.push(isMinusCorrect);
      newValidation.push(isPlusCorrect);

      if (!isMinusCorrect || !isPlusCorrect) {
        allCorrect = false;
      }
    });

    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle, problemsJSON]); 

  const handleShowSolution = useCallback(() => {

    const filledAnswers = problemsJSON.map((p) => ({
      minus: (p.center + p.minus).toString(),
      plus: (p.center + p.plus).toString(),
    }));
    setAnswers(filledAnswers);
    setValidation(Array(problemsJSON.length * 2).fill(true));
    setShowSolution(true);
    setStatus("match");
  }, [problemsJSON]); 

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

 
  const getInputValidation = (problemIdx: number, field: "minus" | "plus") => {
      const index = field === "minus" ? problemIdx * 2 : problemIdx * 2 + 1;
      return validation[index];
  };

  const getInputClass = (isCorrect: boolean | null) => {

    if (showSolution || isCorrect === true) return "text-green-600";
    if (isCorrect === false) return "text-red-600";
    return "text-gray-700"; // Default
  };

  const getAnswerValue = (problemIdx: number, field: "minus" | "plus") => {
    if (showSolution) {
      return (problemsJSON[problemIdx].center + problemsJSON[problemIdx][field]).toString();
    }
    return answers[problemIdx][field];
  };

  const isInputReadOnly = showSolution;

  const renderProblem = (p: typeof problemsJSON[0], problemIdx: number) => (
    <div key={problemIdx} className="flex flex-col space-y-4">
      <div className="flex justify-between items-center text-sm">

        <div className="flex items-center space-x-1 p-1 px-2 bg-blue-100 rounded-md border border-blue-300 shadow-sm">
          <span className="text-blue-700 font-semibold">{p.minus}</span>
        </div>
        <div className="flex items-center space-x-1 p-1 px-2 bg-blue-100 rounded-md border border-blue-300 shadow-sm">
          <span className="text-blue-700 font-semibold">{p.plus}</span>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-3">

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className={`w-28 md:w-32 p-2 text-lg text-center border-b-2 border-dotted outline-none font-bold bg-gray-50 rounded-md transition duration-150 focus:border-blue-500 ${getInputClass(getInputValidation(problemIdx, "minus"))}`}
          value={getAnswerValue(problemIdx, "minus")}
          onChange={(e) => handleInputChange(problemIdx, "minus", e.target.value)}
          readOnly={isInputReadOnly}
        />

        <span className="text-xl  text-gray-800 p-2 bg-gray-200 rounded-lg shadow-inner border border-gray-300">{p.center}</span>

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className={`w-28 md:w-32 p-2 text-lg text-center border-b-2 border-dotted outline-none font-bold bg-gray-50 rounded-md transition duration-150 focus:border-blue-500 ${getInputClass(getInputValidation(problemIdx, "plus"))}`}
          value={getAnswerValue(problemIdx, "plus")}
          onChange={(e) => handleInputChange(problemIdx, "plus", e.target.value)}
          readOnly={isInputReadOnly}
        />
      </div>
    </div>
  );

  const numProblems = problemsJSON.length;
  const problemsPerColumn = Math.ceil(numProblems / 4);

  const column1 = problemsJSON.slice(0, problemsPerColumn);
  const column2 = problemsJSON.slice(problemsPerColumn, problemsPerColumn * 2);
  const column3 = problemsJSON.slice(problemsPerColumn * 2, problemsPerColumn * 3);
  const column4 = problemsJSON.slice(problemsPerColumn * 3, numProblems);


  return (
    <div className="flex flex-col space-y-8 p-6 bg-white rounded-xl shadow-lg">
      <div className="text-2xl  text-gray-900 border-b pb-2">Question 1: Number Manipulation</div>
      <div className="text-gray-600 font-medium">{questionTitle} Fill in the missing numbers by calculating the offset shown above each box.</div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 px-2 py-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
        
        {/* Column 1 */}
        <div className="flex flex-col space-y-6">
          {column1.map((p, idx) => renderProblem(p, idx))}
        </div>
        
        {/* Column 2 */}
        <div className="flex flex-col space-y-6">
          {column2.map((p, idx) => renderProblem(p, idx + column1.length))}
        </div>
        
        {/* Column 3 */}
        <div className="flex flex-col space-y-6">
          {column3.map((p, idx) => renderProblem(p, idx + column1.length + column2.length))}
        </div>
        
        {/* Column 4 */}
        <div className="flex flex-col space-y-6">
          {column4.map((p, idx) => renderProblem(p, idx + column1.length + column2.length + column3.length))}
        </div>

      </div>
      
      {showHint && (
         <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-300">
             <span className="font-semibold">Hint:</span> {hint}
         </div>
      )}

    </div>
  );
}