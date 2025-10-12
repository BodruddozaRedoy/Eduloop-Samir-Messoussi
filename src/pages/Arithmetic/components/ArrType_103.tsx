







import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useQuestionControls } from "@/context/QuestionControlsContext";

// Dynamic JSON data (from database)
const DATA = [
  {
    isFraction: false,
    sentence: "30% van de toeristen is boven de 65 jaar.",
    fields: [
      { label: "breuk:", answer: "3/10" },
      { label: "verhouding:", answer: "3:7" },
    ],
  },
  {
    isFraction: true,
    numerator: "3",
    denominator: "4",
    sentence: "deel van de toeristen heeft geen reisverzekering.",
    fields: [
      { label: "percentage:", answer: "75%" },
      { label: "verhouding:", answer: "3:1" },
    ],
  },
  {
    isFraction: true,
    numerator: "1",
    denominator: "4",
    sentence: "deel van de kinderen zit niet bij een sportvereniging.",
    fields: [
      { label: "percentage:", answer: "25%" },
      { label: "verhouding:", answer: "1:3" },
    ],
  },
  {
    isFraction: false,
    sentence: "8 op de 10 kinderen hebben wel eens in een hotel gelogeerd.",
    fields: [
      { label: "breuk:", answer: "8/10" },
      { label: "percentage:", answer: "80%" },
    ],
  },
];

const HINT_TEXT = "Om te converteren tussen percentage, breuk en verhouding, herinner je dat percentage = (deel/totaal) * 100, breuk = deel/totaal, verhouding = deel:(totaal-deel).";

// Flatten fields for answers and labels
const flatFields = DATA.flatMap((group) => group.fields);
const answers = flatFields.map((field) => field.answer);
const labels = flatFields.map((field) => field.label);

// Main component
const ArrType_103 = () => {
  const totalItems = answers.length;
  const [inputs, setInputs] = useState(Array(totalItems).fill(""));
  const [ok, setOk] = useState(Array(totalItems).fill(null));
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState("idle");

  // Controller setup
  const { setControls } = useQuestionControls();

  // Check answers
  const handleCheck = useCallback(() => {
    const verdicts = inputs.map((inp, idx) => {
      const label = labels[idx];
      const expected = answers[idx];
      if (label.includes("percentage:")) {
        const parsedInp = parseFloat(inp.replace(/%/g, "").trim());
        const parsedExp = parseFloat(expected.replace(/%/g, "").trim());
        return !isNaN(parsedInp) && parsedInp === parsedExp;
      } else {
        return inp.trim() === expected.trim();
      }
    });
    setOk(verdicts);
    setStatus(verdicts.every(Boolean) ? "match" : "wrong");
  }, [inputs]);

  // Show solution
  const handleShowSolution = useCallback(() => {
    setInputs(answers);
    setOk(Array(totalItems).fill(true));
    setStatus("match");
  }, []);

  // Toggle hint
  const handleShowHint = useCallback(() => setShowHint((s) => !s), []);

  // Reset on item count change (not strictly needed here)
  useEffect(() => {
    setInputs(Array(totalItems).fill(""));
    setOk(Array(totalItems).fill(null));
    setStatus("idle");
    setShowHint(false);
  }, []);

  // Feedback message (still computed for controls but not displayed)
  const summary = useMemo(() => {
    if (status === "match")
      return {
        text: "Correct! Great job.",
        color: "text-green-700",
        bgColor: "bg-green-100",
        borderColor: "border-green-600",
      };
    if (status === "wrong")
      return {
        text: "Some answers are wrong. Try again.",
        color: "text-red-700",
        bgColor: "bg-red-100",
        borderColor: "border-red-600",
      };
    return null;
  }, [status]);

  // Expose controls to parent
  useEffect(() => {
    setControls({
      handleCheck,
      handleShowSolution,
      handleShowHint,
      hint: HINT_TEXT,
      showHint,
      summary,
    });
  }, [setControls, handleCheck, handleShowSolution, handleShowHint, summary, showHint]);

  // Input border color
  const inputTone = (flag) =>
    flag === null
      ? "border-slate-300 text-slate-800"
      : flag
      ? "border-emerald-500 text-emerald-600"
      : "border-rose-500 text-rose-600";

  return (
    <div className="w-full mx-auto max-w-4xl">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-600">Question 5</h2>
        <span className="text-sm text-slate-600">-----</span>
      </div>
      <div className="grid grid-cols-2 gap-8">
        {DATA.map((item, groupIdx) => {
          const startIdx = DATA.slice(0, groupIdx).reduce((sum, g) => sum + g.fields.length, 0);
          return (
            <div key={groupIdx}>
              <div className="bg-orange-50 rounded-lg p-2 text-slate-800">
                {item.isFraction ? (
                  <span>
                    <span className="inline-flex flex-col items-center mr-1">
                      <span>{item.numerator}</span>
                      <span>{item.denominator}</span>
                    </span>
                    {item.sentence}
                  </span>
                ) : (
                  item.sentence
                )}
              </div>
              {item.fields.map((field, fieldIdx) => {
                const idx = startIdx + fieldIdx;
                return (
                  <div key={fieldIdx} className="mt-2 flex items-center">
                    <span className="mr-2">{field.label}</span>
                    <input
                      type="text"
                      inputMode="text"
                      placeholder="---------"
                      value={inputs[idx]}
                      onChange={(e) => {
                        const val = e.target.value;
                        setInputs((prev) => {
                          const next = [...prev];
                          next[idx] = val;
                          return next;
                        });
                        setOk((prev) => {
                          const next = [...prev];
                          next[idx] = null;
                          return next;
                        });
                        setStatus("idle");
                      }}
                      className={`flex-1 border-b border-dotted bg-transparent outline-none italic text-lg font-mono ${inputTone(ok[idx])}`}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {/* Hint display */}
      {showHint && (
        <div className="mt-3 px-4 py-2 bg-yellow-50 border-l-4 border-yellow-300 text-yellow-800">
          {HINT_TEXT}
        </div>
      )}
    </div>
  );
};

export default ArrType_103;