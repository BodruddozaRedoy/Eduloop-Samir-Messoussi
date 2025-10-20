// import { useEffect, useMemo, useState } from "react";
// import { QuestionControlsProvider } from "@/context/QuestionControlsContext";
// import Controllers from "@/components/common/Controllers";
// import Check from "@/components/common/Check";
// import Hint from "@/components/common/Hint";
// import useResultTracker from "@/hooks/useResultTracker";
// import type { Summary } from "./ReadingMultipleChoice";

// type StoryQuestion = {
//   id?: number;
//   qs: string;
//   ans: string;
// };

// type StoryData = {
//   story?: string;
//   image?: string;
//   data?: StoryQuestion[];
// };

// type AnswerState = {
//   value: string;
//   status: "correct" | "incorrect" | null;
// };

// interface ReadingStoryProps {
//   data: StoryData;
//   hint?: string;
//   id: number | string;
//   qid?: number;
//   question?: string;
//   description?: string;
//   correctAnswer?: unknown;
// }

// const buildSummary = (correct: number, total: number): Summary => {
//   if (total === 0) {
//     return {
//       text: "No questions available for this story.",
//       color: "text-slate-600",
//       bgColor: "bg-slate-100",
//       borderColor: "border-slate-300",
//     };
//   }

//   if (correct === total) {
//     return {
//       text: "All answers are correct. Great work!",
//       color: "text-green-600",
//       bgColor: "bg-green-100",
//       borderColor: "border-green-600",
//     };
//   }

//   return {
//     text: `You answered ${correct} out of ${total} questions correctly. Review the story and try again.`,
//     color: "text-orange-600",
//     bgColor: "bg-orange-100",
//     borderColor: "border-orange-600",
//   };
// };

// export default function ReadingStory({
//   data,
//   hint,
//   id,
//   qid,
//   question,
// }: ReadingStoryProps) {
//   const { addResult } = useResultTracker();

//   const [answers, setAnswers] = useState<Record<number, AnswerState>>({});
//   const [summary, setSummary] = useState<Summary | null>(null);
//   const [showHint, setShowHint] = useState(false);

//   const totalQuestions = useMemo(() => data?.data?.length ?? 0, [data]);

//   useEffect(() => {
//     setAnswers({});
//     setSummary(null);
//     setShowHint(false);
//   }, [qid, id]);

//   const handleInputChange = (index: number, value: string) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [index]: { value, status: null },
//     }));
//   };

//   const handleCheck = () => {
//     const items = data?.data ?? [];
//     if (!items.length) {
//       setSummary(buildSummary(0, 0));
//       return;
//     }

//     let correctCount = 0;
//     const nextAnswers: Record<number, AnswerState> = {};

//     items.forEach((item, index) => {
//       const currentValue = answers[index]?.value ?? "";
//       const userAnswer = currentValue.trim().toLowerCase();
//       const expectedAnswer = (item.ans ?? "").trim().toLowerCase();
//       const isCorrect = userAnswer.length > 0 && userAnswer === expectedAnswer;

//       if (isCorrect) correctCount += 1;
//       nextAnswers[index] = {
//         value: currentValue,
//         status: isCorrect ? "correct" : "incorrect",
//       };
//     });

//     setAnswers((prev) => ({ ...prev, ...nextAnswers }));
//     setSummary(buildSummary(correctCount, items.length));

//     const resolvedId =
//       typeof id === "number"
//         ? id
//         : Number.isFinite(Number(id))
//         ? Number(id)
//         : typeof qid === "number"
//         ? qid
//         : 0;

//     if (resolvedId) {
//       addResult(
//         {
//           id: resolvedId,
//           title:
//             question ||
//             data?.story?.slice(0, 40)?.concat(data?.story && data.story.length > 40 ? "..." : "") ||
//             `Reading story question ${resolvedId}`,
//         },
//         correctCount === items.length
//       );
//     }
//   };

//   const handleShowHint = () => setShowHint((prev) => !prev);

//   const handleShowSolution = () => {
//     const items = data?.data ?? [];
//     if (!items.length) return;

//     const revealed: Record<number, AnswerState> = {};

//     items.forEach((item, index) => {
//       revealed[index] = { value: item.ans ?? "", status: "correct" };
//     });

//     setAnswers(revealed);
//     setSummary({
//       text: "Solutions revealed. Review them and check again when ready.",
//       color: "text-blue-600",
//       bgColor: "bg-blue-100",
//       borderColor: "border-blue-600",
//     });
//   };

//   return (
//     <QuestionControlsProvider>
//       <>
//         <div className="p-5 rounded-[30px] w-full h-[430px] overflow-y-auto border flex flex-col bg-white">
//           <div className="flex flex-col lg:flex-row justify-start items-center gap-8 flex-1 w-3/5 mx-auto">
//             <div className="text-lg text-center lg:text-left whitespace-pre-line">
//               {data?.story}
//             </div>
//             {data?.image && (
//               <div className="w-full flex">
//                 <img
//                   src={data.image}
//                   alt="Story illustration"
//                   className="rounded-lg object-contain max-h-64 mx-auto"
//                 />
//               </div>
//             )}
//           </div>

//           <div className="mt-5 space-y-5">
//             {data?.data?.map((item, index) => {
//               const answerState = answers[index];
//               const statusClass =
//                 answerState?.status === "correct"
//                   ? "border-green-500 bg-green-50"
//                   : answerState?.status === "incorrect"
//                   ? "border-red-500 bg-red-50"
//                   : "border-transparent bg-muted";

//               return (
//                 <div key={item.id ?? index} className="space-y-2">
//                   <h2 className="font-semibold">
//                     Question {index + 1}:{" "}
//                     <span className="font-normal">{item.qs}</span>
//                   </h2>
//                   <input
//                     type="text"
//                     value={answerState?.value ?? ""}
//                     onChange={(e) => handleInputChange(index, e.target.value)}
//                     className={`w-full py-2 px-5 rounded-lg border ${statusClass}`}
//                     placeholder="Type your answer..."
//                   />
//                 </div>
//               );
//             })}
//             {!totalQuestions && (
//               <p className="text-sm text-muted-foreground">
//                 No questions are available for this story yet.
//               </p>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-col lg:flex-row items-center gap-10 mt-5">
//           <Controllers
//             handleCheck={handleCheck}
//             handleShowSolution={handleShowSolution}
//             handleShowHint={handleShowHint}
//             id={id}
//           />

//           {showHint && <Hint hint={hint ?? "No hint available."} />}

//           <Check summary={summary} />
//         </div>
//       </>
//     </QuestionControlsProvider>
//   );
// }



import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { QuestionControlsProvider } from "@/context/QuestionControlsContext";
import useResultTracker from "@/hooks/useResultTracker";
import { useEffect, useMemo, useState } from "react";
import type { Summary } from "./ReadingMultipleChoice";

type StoryQuestion = {
  id?: number;
  qs: string;
  ans: string;
  options?: string[]; // ✅ added for multiple choice
};

type StoryData = {
  story?: string;
  image?: string;
  data?: StoryQuestion[];
};

type AnswerState = {
  value: string;
  status: "correct" | "incorrect" | null;
};

interface ReadingStoryProps {
  data: StoryData;
  hint?: string;
  id: number | string;
  qid?: number;
  question?: string;
  description?: string;
  correctAnswer?: unknown;
}

/* ---------- Summary Helper ---------- */
const buildSummary = (correct: number, total: number): Summary => {
  if (total === 0) {
    return {
      text: "No questions available for this story.",
      color: "text-slate-600",
      bgColor: "bg-slate-100",
      borderColor: "border-slate-300",
    };
  }

  if (correct === total) {
    return {
      text: "All answers are correct. Great work!",
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-600",
    };
  }

  return {
    text: `You answered ${correct} out of ${total} questions correctly. Review the story and try again.`,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-600",
  };
};

export default function ReadingStory({
  data,
  hint,
  id,
  qid,
  question,
}: ReadingStoryProps) {
  const { addResult } = useResultTracker();

  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});
  const [summary, setSummary] = useState<Summary | null>(null);
  const [showHint, setShowHint] = useState(false);

  const totalQuestions = useMemo(() => data?.data?.length ?? 0, [data]);

  useEffect(() => {
    setAnswers({});
    setSummary(null);
    setShowHint(false);
  }, [qid, id]);

  /* ---------- Handlers ---------- */

  const handleInputChange = (index: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: { value, status: null },
    }));
  };

  const handleCheck = () => {
    const items = data?.data ?? [];
    if (!items.length) {
      setSummary(buildSummary(0, 0));
      return;
    }

    let correctCount = 0;
    const nextAnswers: Record<number, AnswerState> = {};

    items.forEach((item, index) => {
      const currentValue = answers[index]?.value ?? "";
      const userAnswer = currentValue.trim().toLowerCase();
      const expectedAnswer = (item.ans ?? "").trim().toLowerCase();
      const isCorrect = userAnswer.length > 0 && userAnswer === expectedAnswer;

      if (isCorrect) correctCount += 1;
      nextAnswers[index] = {
        value: currentValue,
        status: isCorrect ? "correct" : "incorrect",
      };
    });

    setAnswers((prev) => ({ ...prev, ...nextAnswers }));
    setSummary(buildSummary(correctCount, items.length));

    const resolvedId =
      typeof id === "number"
        ? id
        : Number.isFinite(Number(id))
        ? Number(id)
        : typeof qid === "number"
        ? qid
        : 0;

    if (resolvedId) {
      addResult(
        {
          id: resolvedId,
          title:
            question ||
            data?.story?.slice(0, 40)?.concat(data?.story && data.story.length > 40 ? "..." : "") ||
            `Reading story question ${resolvedId}`,
        },
        correctCount === items.length
      );
    }
  };

  const handleShowHint = () => setShowHint((prev) => !prev);

  const handleShowSolution = () => {
    const items = data?.data ?? [];
    if (!items.length) return;

    const revealed: Record<number, AnswerState> = {};
    items.forEach((item, index) => {
      revealed[index] = { value: item.ans ?? "", status: "correct" };
    });

    setAnswers(revealed);
    setSummary({
      text: "Solutions revealed. Review them and check again when ready.",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-600",
    });
  };

  /* ---------- UI ---------- */
  console.log("Rendering ReadingStory with data:", data);
  return (
    <QuestionControlsProvider>
      <>
        <div className="p-5 rounded-[30px] w-full h-[430px] overflow-y-auto border flex flex-col bg-white">
          <div className="flex flex-col lg:flex-row justify-start items-center gap-8 flex-1 w-3/5 mx-auto">
            <div className="text-lg  text-center lg:text-justify whitespace-pre-line">
              {data?.story}
            </div>
            <div className={`w-full ${data?.image ?"flex":"hidden"} `}>
                <img
                  src={data.image}
                  alt="Story illustration"
                  className="rounded-lg object-contain max-h-64 mx-auto"
                />
              </div>

          </div>

          <div className="mt-5 space-y-5">
            {data?.data?.map((item, index) => {
              const answerState = answers[index];
              const statusClass =
                answerState?.status === "correct"
                  ? "border-green-500 bg-green-50"
                  : answerState?.status === "incorrect"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-muted";

              return (
                <div key={item.id ?? index} className="space-y-2">
                  <h2 className="font-semibold">
                    Question {index + 1}:{" "}
                    <span className="font-normal">{item.qs}</span>
                  </h2>

                  {/* ---------- Multiple Choice ---------- */}
                  {item.options && item.options.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {item.options.map((opt, optIndex) => (
                        <label
                          key={optIndex}
                          className={`flex items-center gap-3 border rounded-lg px-4 py-2 cursor-pointer transition
                            ${
                              answerState?.value === opt
                                ? "border-blue-500 bg-blue-50"
                                : statusClass
                            }`}
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={opt}
                            checked={answerState?.value === opt}
                            onChange={() => handleInputChange(index, opt)}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    /* ---------- Text Input ---------- */
                    <input
                      type="text"
                      value={answerState?.value ?? ""}
                      onChange={(e) =>
                        handleInputChange(index, e.target.value)
                      }
                      className={`w-full py-2 px-5 rounded-lg border ${statusClass}`}
                      placeholder="Type your answer..."
                    />
                  )}
                </div>
              );
            })}

            {!totalQuestions && (
              <p className="text-sm text-muted-foreground">
                No questions are available for this story yet.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-10 mt-5">
          <Controllers
            handleCheck={handleCheck}
            handleShowSolution={handleShowSolution}
            handleShowHint={handleShowHint}
            id={id}
          />
          {showHint && <Hint hint={hint ?? "No hint available."} />}
          <Check summary={summary} />
        </div>
      </>
    </QuestionControlsProvider>
  );
}
