import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";


// Math problems dataset
const problemsJSON = [
  { id: 1, question: "5 x _ = 40", answer: 8 },
  { id: 2, question: "_ x 8 = 48", answer: 6 },
  { id: 3, question: "8 x 7 = _", answer: 56 },
  { id: 4, question: "_ x 7 = 42", answer: 6 },
  { id: 5, question: "_ x 9 = 45", answer: 5 },
  { id: 6, question: "6 x 9 = _", answer: 54 },
  { id: 7, question: "7 x 6 = _", answer: 42 },
  { id: 8, question: "_ x 12 = 60", answer: 5 },
  { id: 9, question: "9 x _ = 81", answer: 9 },
];


    setStatus(null);
  }, []);


    const newValidation = problemsJSON.map((p, i) => p.answer === answers[i]);
    const allCorrect = newValidation.every(Boolean);
    setValidation(newValidation);

    setAnswers(problemsJSON.map((p) => p.answer));
    setValidation(Array(problemsJSON.length).fill(true));
    setStatus("match");
    setShowSolution(true);


  return (
    <div className="flex flex-col">
      {/* Math problems grid */}

            )}
          </div>
        ))}
      </div>


        <Controllers
          handleCheck={handleCheck}
          handleShowSolution={handleShowSolution}
          handleShowHint={handleShowHint}
        />
      </div>

      {/* Hint + Summary */}
      {showHint && <Hint hint={hint} />}
      <Check summary={summary} /> */}
    </div>
  );
}
