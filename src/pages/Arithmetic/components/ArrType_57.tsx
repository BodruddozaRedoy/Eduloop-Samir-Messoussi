import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import { useCallback, useEffect, useMemo, useState } from "react";

// Data for the area calculation problems with corrected image paths
const problemsJSON = [
  // Rectangular areas
  {
    id: 1,
    type: "rectangle",
    text: "The room is 6 m long and 4.5 m wide.",
    answer_m2: "27",
  },
  {
    id: 2,
    type: "rectangle_hectare",
    text: "The park is 400 m long and 50 m wide.",
    answer_m2: "20000",
    answer_ha: "2",
  },
  {
    id: 3,
    type: "rectangle_are",
    text: "The playground is 400 m long and 50 m wide.",
    answer_m2: "20000",
    answer_are: "200",
  },
  // Other shapes
  {
    id: 4,
    type: "triangle",
    text: "De oppervlakte is",
    image: "/public/images/juyelTri.png", // Corrected path
    answer_cm2: "24",
  },
  {
    id: 5,
    type: "trapezoid",
    text: "De oppervlakte is",
     image: "/public/images/JuyelCotur.png", // Corrected path
    answer_cm2: "10",
  },
];

export default function ArrType_57({ hint,data:problemsJSON }: {data:any, hint: string }) {
  const [answers, setAnswers] = useState(() => {
    const initialState = {};
    problemsJSON.forEach((p) => {
      if (p.type === "rectangle") {
        initialState[p.id] = { m2: "" };
      } else if (p.type === "rectangle_hectare") {
        initialState[p.id] = { m2: "", ha: "" };
      } else if (p.type === "rectangle_are") {
        initialState[p.id] = { m2: "", are: "" };
      } else if (p.type === "triangle" || p.type === "trapezoid") {
        initialState[p.id] = { cm2: "" };
      }
    });
    return initialState;
  });

  const [validation, setValidation] = useState(
    problemsJSON.map(() => ({ m2: null, ha: null, are: null, cm2: null }))
  );
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  const handleInputChange = useCallback(
    (problemId: number, field: string, value: string) => {
      setAnswers((prev) => {
        const newAnswers = { ...prev };
        newAnswers[problemId] = { ...newAnswers[problemId], [field]: value };
        return newAnswers;
      });
      setStatus(null);
    },
    []
  );

  const handleCheck = useCallback(() => {
    let allCorrect = true;
    const newValidation = problemsJSON.map((p) => {
      const result = { m2: null, ha: null, are: null, cm2: null };
      const currentAnswers = answers[p.id] || {};
      if (p.type === "rectangle") {
        const isM2Correct = currentAnswers.m2?.trim() === p.answer_m2;
        result.m2 = isM2Correct;
        if (!isM2Correct) allCorrect = false;
      } else if (p.type === "rectangle_hectare") {
        const isM2Correct = currentAnswers.m2?.trim() === p.answer_m2;
        const isHaCorrect = currentAnswers.ha?.trim() === p.answer_ha;
        result.m2 = isM2Correct;
        result.ha = isHaCorrect;
        if (!isM2Correct || !isHaCorrect) allCorrect = false;
      } else if (p.type === "rectangle_are") {
        const isM2Correct = currentAnswers.m2?.trim() === p.answer_m2;
        const isAreCorrect = currentAnswers.are?.trim() === p.answer_are;
        result.m2 = isM2Correct;
        result.are = isAreCorrect;
        if (!isM2Correct || !isAreCorrect) allCorrect = false;
      } else if (p.type === "triangle" || p.type === "trapezoid") {
        const isCm2Correct = currentAnswers.cm2?.trim() === p.answer_cm2;
        result.cm2 = isCm2Correct;
        if (!isCm2Correct) allCorrect = false;
      }
      return result;
    });

    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [answers, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    const newAnswers = {};
    const newValidation = problemsJSON.map((p) => {
      const result = { m2: true, ha: true, are: true, cm2: true };
      if (p.type === "rectangle") {
        newAnswers[p.id] = { m2: p.answer_m2 };
      } else if (p.type === "rectangle_hectare") {
        newAnswers[p.id] = { m2: p.answer_m2, ha: p.answer_ha };
      } else if (p.type === "rectangle_are") {
        newAnswers[p.id] = { m2: p.answer_m2, are: p.answer_are };
      } else if (p.type === "triangle" || p.type === "trapezoid") {
        newAnswers[p.id] = { cm2: p.answer_cm2 };
      }
      return result;
    });

    setAnswers(newAnswers);
    setValidation(newValidation);
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

  const getInputClass = (isCorrect: boolean | null) => {
    if (isCorrect === true) return "text-green-600";
    if (isCorrect === false) return "text-red-600";
    return "text-gray-700";
  };

  const getAnswerValue = (problemId: number, field: string) => {
    if (showSolution) {
      const p = problemsJSON.find(p => p.id === problemId);
      if (field === 'm2' && p.answer_m2) return p.answer_m2;
      if (field === 'ha' && p.answer_ha) return p.answer_ha;
      if (field === 'are' && p.answer_are) return p.answer_are;
      if (field === 'cm2' && p.answer_cm2) return p.answer_cm2;
    }
    return answers[problemId]?.[field] || '';
  };

  const isInputReadOnly = showSolution;

  return (
    <div className="flex flex-col space-y-8">
      {/* <div className="text-xl font-semibold text-gray-800">Question 1</div>
      <div className="text-gray-600">Calculate the area</div> */}

      {/* Top row of problems */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-8">
        {problemsJSON.slice(0, 3).map((p, idx) => (
          <div key={p.id} className="flex flex-col items-center">
            <div className="rounded-2xl bg-amber-50/60 p-6 flex items-center shadow-md w-full mb-4">
              <p className="text-sm text-gray-800 text-center">{p.text}</p>
            </div>
            {p.type === "rectangle" && (
              <div className="flex items-center space-x-1">
                <span className="text-md text-gray-700 font-medium">The area is</span>
                <input
                  type="text"
                  className={`w-24 p-1 text-md text-center border-b border-dotted outline-none font-medium ${getInputClass(validation[idx].m2)}`}
                  value={getAnswerValue(p.id, 'm2')}
                  onChange={(e) => handleInputChange(p.id, 'm2', e.target.value)}
                  readOnly={isInputReadOnly}
                />
                <span className="text-md text-gray-700 font-medium">m²</span>
              </div>
            )}
            {p.type === "rectangle_hectare" && (
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-1">
                  <span className="text-md text-gray-700 font-medium">The area is</span>
                  <input
                    type="text"
                    className={`w-24 p-1 text-md text-center border-b border-dotted outline-none font-medium ${getInputClass(validation[idx].m2)}`}
                    value={getAnswerValue(p.id, 'm2')}
                    onChange={(e) => handleInputChange(p.id, 'm2', e.target.value)}
                    readOnly={isInputReadOnly}
                  />
                  <span className="text-md text-gray-700 font-medium">m²</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-md text-gray-700 font-medium">That is</span>
                  <input
                    type="text"
                    className={`w-24 p-1 text-md text-center border-b border-dotted outline-none font-medium ${getInputClass(validation[idx].ha)}`}
                    value={getAnswerValue(p.id, 'ha')}
                    onChange={(e) => handleInputChange(p.id, 'ha', e.target.value)}
                    readOnly={isInputReadOnly}
                  />
                  <span className="text-md text-gray-700 font-medium">ha.</span>
                </div>
              </div>
            )}
            {p.type === "rectangle_are" && (
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-1">
                  <span className="text-md text-gray-700 font-medium">The area is</span>
                  <input
                    type="text"
                    className={`w-24 p-1 text-md text-center border-b border-dotted outline-none font-medium ${getInputClass(validation[idx].m2)}`}
                    value={getAnswerValue(p.id, 'm2')}
                    onChange={(e) => handleInputChange(p.id, 'm2', e.target.value)}
                    readOnly={isInputReadOnly}
                  />
                  <span className="text-md text-gray-700 font-medium">m²</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-md text-gray-700 font-medium">That is</span>
                  <input
                    type="text"
                    className={`w-24 p-1 text-md text-center border-b border-dotted outline-none font-medium ${getInputClass(validation[idx].are)}`}
                    value={getAnswerValue(p.id, 'are')}
                    onChange={(e) => handleInputChange(p.id, 'are', e.target.value)}
                    readOnly={isInputReadOnly}
                  />
                  <span className="text-md text-gray-700 font-medium">are.</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom row of problems with images */}
      <div className="flex justify-center gap-8 px-6 py-8">
        {problemsJSON.slice(3).map((p, idx) => {
          // Find the correct validation index for the sliced array
          const problemValidationIdx = 3 + idx;
          return (
            <div key={p.id} className="flex flex-col items-center">
              <div className="relative w-48 h-24">
                <img src={p.image} alt="Geometry shape" className="w-full h-full object-contain" />
              </div>
              <div className="mt-4 flex items-center space-x-1">
                <span className="text-md text-gray-700 font-medium">{p.text}</span>
                <input
                  type="text"
                  className={`w-24 p-1 text-md text-center border-b border-dotted outline-none font-medium ${getInputClass(validation[problemValidationIdx].cm2)}`}
                  value={getAnswerValue(p.id, 'cm2')}
                  onChange={(e) => handleInputChange(p.id, 'cm2', e.target.value)}
                  readOnly={isInputReadOnly}
                />
                <span className="text-md text-gray-700 font-medium">cm²</span>
              </div>
            </div>
          );
        })}
      </div>


    </div>
  );
}
