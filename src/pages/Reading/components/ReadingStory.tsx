import { useEffect, useState } from "react";
import { QuestionControlsProvider } from "@/context/QuestionControlsContext";
import Controllers from "@/components/common/Controllers";
import Check from "@/components/common/Check";
import Hint from "@/components/common/Hint";
import useResultTracker, {
  hasAnyResults,
  onResultsUpdated,
  type TrackedResults,
} from "@/hooks/useResultTracker";

export default function ReadingStory({ data, hint, id }: any) {
  const { addResult } = useResultTracker();

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [summary, setSummary] = useState<any>(null);
  const [showHint, setShowHint] = useState(false);
  const [hasResults, setHasResults] = useState<boolean>(hasAnyResults());

  // 🔁 Listen for localStorage updates
  useEffect(() => {
    const off = onResultsUpdated((_r: TrackedResults) =>
      setHasResults(hasAnyResults())
    );
    return () => off();
  }, []);

  // 🧠 Input handler
  const handleInputChange = (index: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  // ✅ Check answers and record with useResultTracker
  const handleCheck = () => {
    let correctCount = 0;

    data.data.forEach((item: any, i: number) => {
      const userAns = answers[i]?.trim().toLowerCase();
      const correctAns = item.ans?.trim().toLowerCase();

      const isCorrect = userAns === correctAns;
      if (isCorrect) correctCount++;

      addResult({ id: item.id || i, title: item.qs }, isCorrect);
    });

    setSummary({
      total: data.data.length,
      correct: correctCount,
      wrong: data.data.length - correctCount,
    });
  };

  // 💡 Show / hide hint
  const handleShowHint = () => setShowHint((prev) => !prev);

  // 🧾 Show all solutions (for debug or UI modal)
  const handleShowSolution = () => {
    const solutions = data.data.map((item: any) => ({
      question: item.qs,
      answer: item.ans,
    }));

    alert(
      solutions
        .map((s, i) => `${i + 1}. ${s.question}\nAnswer: ${s.answer}`)
        .join("\n\n")
    );
  };

  return (
    <QuestionControlsProvider>
      <>
        {/* Story Display */}
        <div className="p-5 rounded-[30px] w-full h-[430px] overflow-y-auto border flex flex-col bg-white">
          <div className="flex flex-col lg:flex-row justify-start items-center gap-8 flex-1 w-3/5 mx-auto">
            <div className="text-lg text-center lg:text-left">{data?.story}</div>
            <div className="w-full flex">
              <img
                src={data?.image}
                alt={data?.image}
                className="rounded-lg object-contain"
              />
            </div>
          </div>

          {/* Quiz Section */}
          <div className="mt-5 space-y-5">
            {data?.data.map((item: any, index: number) => (
              <div key={index}>
                <h1>
                  <span className="font-semibold">Question:</span> {item.qs}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <h1 className="font-semibold">Answer:</h1>
                  <input
                    type="text"
                    value={answers[index] || ""}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className="bg-muted py-2 px-5 rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex flex-col lg:flex-row items-center gap-10 mt-5">
          <Controllers
            handleCheck={handleCheck}
            handleShowSolution={handleShowSolution}
            handleShowHint={handleShowHint}
            id={id}
          />

          {showHint && <Hint hint={hint} />}

          <Check summary={summary || null} />
        </div>
      </>
    </QuestionControlsProvider>
  );
}
